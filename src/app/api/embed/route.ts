// 


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function splitIntoChunks(text: string, chunkSize = 500, overlap = 60): string[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।\n])\s+/)
    .filter(s => s.trim().length > 20);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      const words = current.split(" ");
      current = words.slice(-12).join(" ") + " " + sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current.trim().length > 50) chunks.push(current.trim());
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { text, classNum, subject, chapterId, chapterTitle, sourceFile } = await req.json();

    if (!text || !classNum || !subject || !chapterId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanText = text.replace(/\s+/g, " ").trim();
    if (cleanText.length < 100) {
      return NextResponse.json({ error: "Text too short. Use a text-based PDF, not a scanned image." }, { status: 400 });
    }

    const chunks = splitIntoChunks(cleanText);
    console.log(`Storing ${chunks.length} chunks for ${chapterId} (text-search mode)`);

    // Delete existing chunks for this chapter
    await supabase.from("chapter_embeddings")
      .delete()
      .eq("chapter_id", chapterId)
      .eq("class", classNum);

    // Store with dummy vectors — retrieval uses Groq LLM, not vector search
    const dummyVec = `[${new Array(384).fill(0).join(",")}]`;

    const rows = chunks.map((chunk, i) => ({
      class:         classNum,
      subject,
      chapter_id:    chapterId,
      chapter_title: chapterTitle,
      chunk_index:   i,
      content:       chunk,
      embedding:     dummyVec,
      source_file:   sourceFile || "upload",
    }));

    // Batch insert
    let inserted = 0;
    for (let i = 0; i < rows.length; i += 10) {
      const { error } = await supabase.from("chapter_embeddings").insert(rows.slice(i, i + 10));
      if (!error) inserted += Math.min(10, rows.length - i);
      else console.error("Batch insert error:", error.message);
    }

    return NextResponse.json({
      success:         true,
      chunksProcessed: inserted,
      totalChunks:     chunks.length,
      chapterId,
    });
  } catch (err: any) {
    console.error("Embed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}