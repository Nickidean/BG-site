import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a British Gas senior content designer. You have already produced a tone-of-voice rewrite of some copy. The user has now provided additional context or requirements. Produce a revised rewrite that:
- Incorporates the user's context and requirements
- Still follows British Gas tone of voice (warm, working, contractions, active voice, second person, short sentences)
- Only edits tone — do not add facts beyond what is in the original copy or what the user explicitly specifies as a clarification of existing facts
- Keeps the same section structure as the current rewrite

Return ONLY valid JSON:
{ "rewriteSections": [{ "label": "<Heading|Subheading|Body|CTA|Intro|Sign-off|Legal>", "text": "<revised text>" }] }`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { copy, contentType, audience, currentRewrite, context } = body;

    if (!copy || !context) {
      return NextResponse.json({ error: "copy and context are required" }, { status: 400 });
    }

    const rewriteText = Array.isArray(currentRewrite)
      ? currentRewrite.map((s: { label: string; text: string }) => `[${s.label}]\n${s.text}`).join("\n\n")
      : "";

    const userMessage = `${contentType ? `Content type: ${contentType}\n` : ""}Audience: ${audience || "General customers"}

Original copy:
---
${copy}
---

Current rewrite:
---
${rewriteText}
---

Additional context / requirements from the user:
${context}

Please revise the rewrite taking this context into account.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch
      ? jsonMatch[0]
      : raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
