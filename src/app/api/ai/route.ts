// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { question, chapterTitle, kannadaTitle, subject, classNum, concepts } = await req.json();

//   if (!question?.trim()) {
//     return NextResponse.json({ error: "No question provided" }, { status: 400 });
//   }

//   const GROQ_API_KEY = process.env.GROQ_API_KEY;
//   if (!GROQ_API_KEY) {
//     return NextResponse.json({ error: "AI not configured" }, { status: 500 });
//   }

//   const systemPrompt = `You are a helpful Karnataka Government School teacher assistant called "ಪರೀಕ್ಷಾ ಸಹಾಯಕ" (Pariksha Sahayaka).

// You help students studying in Kannada medium schools. You are currently helping with:
// - Class: ${classNum}th Standard
// - Subject: ${subject}
// - Chapter: ${kannadaTitle} (${chapterTitle})
// - Key Concepts: ${(concepts || []).join(", ")}

// IMPORTANT RULES:
// 1. ALWAYS answer in simple Kannada (ಕನ್ನಡ) that a school student can understand
// 2. Keep answers SHORT and CLEAR — maximum 5-6 lines
// 3. Use examples from daily Karnataka life (farming, villages, local things students know)
// 4. For Maths: show step-by-step solutions clearly
// 5. For Science: give simple Kannada explanations with local examples
// 6. End every answer with one key point to remember: "📌 ನೆನಪಿಡಿ: ..."
// 7. If student asks in English, still answer in Kannada
// 8. Don't use complex words — use simple ಕನ್ನಡ`;

//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: question },
//         ],
//         max_tokens: 400,
//         temperature: 0.5,
//       }),
//     });

//     if (!response.ok) {
//       const err = await response.text();
//       console.error("Groq error:", err);
//       return NextResponse.json({ error: "AI request failed" }, { status: 500 });
//     }

//     const data = await response.json();
//     const answer = data.choices?.[0]?.message?.content || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";

//     return NextResponse.json({ answer });
//   } catch (err) {
//     console.error("AI error:", err);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }/


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, chapterTitle, kannadaTitle, subject, classNum, concepts } = await req.json();

  if (!question?.trim()) {
    return NextResponse.json({ error: "No question provided" }, { status: 400 });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt = `You are an expert Karnataka Government School teacher and exam coach called "ಪರೀಕ್ಷಾ ಸಹಾಯಕ".

CURRENT CHAPTER CONTEXT:
- Class: ${classNum}th Standard (KSEAB Karnataka Syllabus)
- Subject: ${subject}
- Chapter: ${kannadaTitle} / ${chapterTitle}
- Key Concepts: ${(concepts || []).join(", ")}

YOUR JOB:
You must answer like a real experienced teacher who knows exactly what appears in KSEAB board exams. Give complete, detailed, exam-ready answers.

ANSWER FORMAT RULES based on marks:

For 1-2 mark questions:
- Give direct, crisp answer in 2-3 lines
- Include definition if needed

For 3 mark questions:
- Give answer in 3 clear points
- Each point should be one complete sentence
- Use numbered list: 1. 2. 3.

For 4-5 mark questions:
- Give FULL detailed answer with headings
- Include: Definition → Explanation → Types/Parts → Examples → Diagram description if needed
- Use proper points and sub-points

For "summary" or "whole chapter" requests:
- Give COMPLETE chapter summary with ALL important topics
- Cover every concept, formula, definition, and exam question
- Format: Introduction → Key Concepts (numbered) → Important Formulas/Reactions → Types → Diagrams needed → Most important exam questions

For diagram questions:
- Describe EXACTLY what to draw and label
- List all parts that must be labeled
- Give tips for getting full marks

LANGUAGE RULES:
- If question is about Science/Maths: Answer in BOTH Kannada AND English
  Format: First give answer in Kannada, then add "English:" followed by English explanation
- If question is about English subject: Answer only in English
- Use simple language students can understand
- For Maths: show COMPLETE step-by-step working with every calculation

EXAM TIPS:
- For every answer, add "📌 ಪರೀಕ್ಷಾ ಸೂಚನೆ:" with what examiner wants to see
- Mention if diagram is compulsory for full marks
- Mention mark allocation strategy

NEVER give short answers for important topics. Be thorough like a real teacher preparing students for board exams.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: question },
        ],
        max_tokens: 1500,    // increased from 400 → 1500
        temperature: 0.3,    // lower = more factual and consistent
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}