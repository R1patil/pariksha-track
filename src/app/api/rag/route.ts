// 



import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Rate limiting: max 15 AI requests per student per hour ──
async function checkRateLimit(studentId: string, schoolId: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("endpoint", "rag")
    .gte("created_at", oneHourAgo);
  return (count || 0) < 15;
}

async function logUsage(studentId: string, schoolId: string) {
  await supabase.from("api_usage").insert({
    student_id: studentId,
    school_id:  schoolId,
    endpoint:   "rag",
  });
}

// ── Keyword-based chunk retrieval ────────────────────────────
async function getRelevantChunks(
  question: string,
  classNum: string,
  chapterId: string,
  schoolId: string
): Promise<string[]> {
  const { data: chunks } = await supabase
    .from("chapter_embeddings")
    .select("content, chunk_index")
    .eq("chapter_id", chapterId)
    .eq("class", classNum)
    .eq("school_id", schoolId)
    .order("chunk_index");

  // fallback: try without school_id filter (global embeddings)
  const allChunks = chunks?.length
    ? chunks
    : (await supabase
        .from("chapter_embeddings")
        .select("content, chunk_index")
        .eq("chapter_id", chapterId)
        .eq("class", classNum)
        .order("chunk_index")
      ).data;

  if (!allChunks || allChunks.length === 0) return [];

  const questionWords = question.toLowerCase()
    .replace(/[?।.,!]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);

  const scored = allChunks.map(chunk => {
    const lower = chunk.content.toLowerCase();
    let score = 0;
    for (const word of questionWords) {
      score += (lower.match(new RegExp(word, "g")) || []).length;
    }
    return { content: chunk.content, score, index: chunk.chunk_index };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index)
    .map(c => c.content);
}

export async function POST(req: NextRequest) {
  // ── Auth: require student session token ──────────────────
  const authHeader = req.headers.get("x-student-id");
  const schoolHeader = req.headers.get("x-school-id");

  if (!authHeader || !schoolHeader) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in again." },
      { status: 401 }
    );
  }

  // ── Rate limit check ──────────────────────────────────────
  const allowed = await checkRateLimit(authHeader, schoolHeader);
  if (!allowed) {
    return NextResponse.json(
      { error: "ದಯವಿಟ್ಟು 1 ಗಂಟೆ ನಂತರ ಪ್ರಯತ್ನಿಸಿ. AI limit reached (15/hour)." },
      { status: 429 }
    );
  }

  const { question, classNum, subject, chapterId, chapterTitle, kannadaTitle } = await req.json();
  const GROQ_KEY = process.env.GROQ_API_KEY!;

  // ── Get relevant textbook chunks ──────────────────────────
  const { count } = await supabase
    .from("chapter_embeddings")
    .select("*", { count: "exact", head: true })
    .eq("chapter_id", chapterId)
    .eq("class", classNum);

  let context = "";
  let hasRAG  = false;

  if (count && count > 0) {
    try {
      const chunks = await getRelevantChunks(question, classNum, chapterId, schoolHeader);
      if (chunks.length > 0) {
        context = chunks
          .map((c, i) => `[ಪಠ್ಯಪುಸ್ತಕ ಭಾಗ ${i+1}]\n${c}`)
          .join("\n\n---\n\n");
        hasRAG = true;
      }
    } catch {}
  }

  // ── Build system prompt ───────────────────────────────────
  const systemPrompt = hasRAG
    ? `You are an expert Karnataka KSEAB board exam teacher "ಪರೀಕ್ಷಾ ಸಹಾಯಕ".

ACTUAL KSEAB TEXTBOOK CONTENT:
Class ${classNum} | ${subject} | ${kannadaTitle} (${chapterTitle})

${context}

RULES:
1. Answer based on the textbook content above
2. Science/Maths: answer in BOTH Kannada AND English
3. Match answer length to marks:
   - 1 mark: 1-2 sentences
   - 2-3 marks: numbered points
   - 4-5 marks: full structured answer with Definition→Explanation→Examples→Diagram note
   - Summary: cover ALL topics systematically
4. End with: 📌 ಪರೀಕ್ಷಾ ಸೂಚನೆ: [exam tip]
5. Start with: 📚 ಪಠ್ಯಪುಸ್ತಕ ಆಧಾರಿತ ಉತ್ತರ`
    : `You are an expert Karnataka KSEAB board exam teacher "ಪರೀಕ್ಷಾ ಸಹಾಯಕ".
Class ${classNum} | ${subject} | ${kannadaTitle} (${chapterTitle})
PDF not uploaded yet. Answer from KSEAB syllabus knowledge.
Answer in BOTH Kannada AND English for Science/Maths. Match answer to marks requested.
End with: 📌 ಪರೀಕ್ಷಾ ಸೂಚನೆ: [exam tip]
Start with: ⚠️ PDF ಅಪ್ಲೋಡ್ ಆಗಿಲ್ಲ — ಸಾಮಾನ್ಯ KSEAB ಜ್ಞಾನ`;

  // ── Call Groq ─────────────────────────────────────────────
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model:       "llama-3.3-70b-versatile",
        messages:    [
          { role: "system", content: systemPrompt },
          { role: "user",   content: question },
        ],
        max_tokens:  1500,
        temperature: 0.2,
      }),
    });

    const data   = await res.json();
    const answer = data.choices?.[0]?.message?.content || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ.";

    // Log usage after successful call
    await logUsage(authHeader, schoolHeader);

    return NextResponse.json({ answer, hasRAG });
  } catch {
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}