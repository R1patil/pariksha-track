// 


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Retrieve relevant chunks using keyword matching (no embeddings needed)
async function getRelevantChunks(
  question: string,
  classNum: string,
  subject: string,
  chapterId: string
): Promise<string[]> {

  // Get ALL chunks for this chapter
  const { data: chunks } = await supabase
    .from("chapter_embeddings")
    .select("content, chunk_index")
    .eq("chapter_id", chapterId)
    .eq("class", classNum)
    .order("chunk_index");

  if (!chunks || chunks.length === 0) return [];

  // Score chunks by keyword overlap with question
  const questionWords = question.toLowerCase()
    .replace(/[?।.,!]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);

  const scored = chunks.map(chunk => {
    const contentLower = chunk.content.toLowerCase();
    let score = 0;
    for (const word of questionWords) {
      // Count occurrences
      const matches = (contentLower.match(new RegExp(word, "g")) || []).length;
      score += matches;
    }
    return { content: chunk.content, score, index: chunk.chunk_index };
  });

  // Sort by score, take top 5, then sort back by index for context flow
  const topChunks = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.index - b.index)
    .map(c => c.content);

  // If no good keyword matches, return first 3 chunks as context
  if (topChunks.every((_, i) => scored[i]?.score === 0)) {
    return chunks.slice(0, 4).map(c => c.content);
  }

  return topChunks;
}

export async function POST(req: NextRequest) {
  const { question, classNum, subject, chapterId, chapterTitle, kannadaTitle } = await req.json();
  const GROQ_KEY = process.env.GROQ_API_KEY!;

  // Step 1: Check if textbook content exists for this chapter
  const { count } = await supabase
    .from("chapter_embeddings")
    .select("*", { count: "exact", head: true })
    .eq("chapter_id", chapterId)
    .eq("class", classNum);

  let context = "";
  let hasRAG  = false;

  // Step 2: Retrieve relevant chunks if available
  if (count && count > 0) {
    try {
      const relevantChunks = await getRelevantChunks(question, classNum, subject, chapterId);
      if (relevantChunks.length > 0) {
        context = relevantChunks
          .map((chunk, i) => `[ಪಠ್ಯಪುಸ್ತಕ ಭಾಗ ${i + 1}]\n${chunk}`)
          .join("\n\n---\n\n");
        hasRAG = true;
      }
    } catch (err) {
      console.log("Chunk retrieval failed:", err);
    }
  }

  // Step 3: Build prompt
  const systemPrompt = hasRAG
    ? `You are an expert Karnataka KSEAB board exam teacher "ಪರೀಕ್ಷಾ ಸಹಾಯಕ".

You have ACTUAL KSEAB TEXTBOOK CONTENT for:
- Class ${classNum}th Standard | Subject: ${subject}
- Chapter: ${kannadaTitle} (${chapterTitle})

TEXTBOOK CONTENT:
${context}

ANSWERING RULES:
1. Base your answer PRIMARILY on the textbook content above
2. For Science/Maths: answer in BOTH Kannada AND English
3. Match answer length to marks requested:
   - 1 mark → 1-2 sentences, direct answer
   - 2 marks → 2-3 key points  
   - 3 marks → 3 numbered points with explanation
   - 4-5 marks → Full answer: Definition → Explanation → Types/Steps → Examples → Diagram if needed
   - Summary/Full chapter → Cover ALL topics from textbook content systematically
4. For diagrams: list exact parts to label from the textbook
5. End with: 📌 ಪರೀಕ್ಷಾ ಸೂಚನೆ: [what examiner wants to see]
6. Start with: 📚 ಪಠ್ಯಪುಸ್ತಕ ಆಧಾರಿತ ಉತ್ತರ`
    : `You are an expert Karnataka KSEAB board exam teacher "ಪರೀಕ್ಷಾ ಸಹಾಯಕ".

Class: ${classNum}th Standard | Subject: ${subject}
Chapter: ${kannadaTitle} (${chapterTitle})

Textbook PDF not yet uploaded. Answer from KSEAB syllabus knowledge.

RULES:
1. Answer in BOTH Kannada AND English for Science/Maths
2. Match answer to marks requested (1/2/3/4/5 mark format)
3. Be thorough and exam-accurate for KSEAB Karnataka board
4. End with: 📌 ಪರೀಕ್ಷಾ ಸೂಚನೆ: [exam tip]
5. Start with: ⚠️ PDF ಅಪ್ಲೋಡ್ ಆಗಿಲ್ಲ — ಸಾಮಾನ್ಯ KSEAB ಜ್ಞಾನ ಆಧಾರಿತ`;

  // Step 4: Get answer from Groq
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
    const answer = data.choices?.[0]?.message?.content || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
    return NextResponse.json({ answer, hasRAG, chunksUsed: hasRAG ? 5 : 0 });
  } catch (err) {
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}