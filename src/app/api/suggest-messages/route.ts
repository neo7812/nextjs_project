// app/api/suggest-questions/route.ts

import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    type GeminiResponse = {
      candidates?: {
        content?: {
          parts?: { text?: string }[];
        };
      }[];
    };

    const data = (await res.json()) as GeminiResponse;

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return NextResponse.json({ success: false, message: "No questions generated" }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions: output }, { status: 200 });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ success: false, message: "AI generation failed" }, { status: 500 });
  }
}
