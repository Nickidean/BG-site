import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXTRACT_PROMPT = `Extract all copywriting text visible in this screenshot.

Return only the raw text content — no commentary, no descriptions of images, no explanations. Preserve the structure using line breaks to separate headings, subheadings, body paragraphs, CTAs, and other distinct elements. If there are multiple distinct sections, separate them with a blank line.

Do not include any of your own words. Only output what is written in the screenshot.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "imageBase64 and mimeType are required" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json({ error: "Unsupported image type. Use JPEG, PNG, GIF, or WebP." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: EXTRACT_PROMPT,
            },
          ],
        },
      ],
    });

    const extractedText = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    if (!extractedText) {
      return NextResponse.json({ error: "No text could be extracted from the image." }, { status: 422 });
    }

    return NextResponse.json({ extractedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
