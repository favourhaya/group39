import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import fs from "fs/promises";
// import dotenv from "dotenv";

// dotenv.config();

// const apiKey = process.env.OPENAI_API_KEY;
// if (!apiKey) {
//   throw new Error("Please set the OPENAI_API_KEY environment variable.");
// }

// const openai = new OpenAI({ apiKey });
const openai = new OpenAI();

const AnalysisSchema = z.object({
  overall_summary: z.string(),
  fluency: z.string(),
  correct_fluency: z.string(),
  incorrect_fluency: z.string(),
  clarity: z.string(),
  correct_clarity: z.string(),
  incorrect_clarity: z.string(),
  grammar: z.string(),
  correct_grammar: z.string(),
  incorrect_grammar: z.string(),
  coherence: z.string(),
  correct_coherence: z.string(),
  incorrect_coherence: z.string(),
  vocab_variety: z.string(),
  correct_variety: z.string(),
  incorrect_variety: z.string(),
  conclusion: z.string(),
  rating: z.enum(["poor", "okay", "amazing"]),
});

export async function POST(req: Request) {
  try {
    const transcript = await req.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: "Missing transcript in request body." }, { status: 400 });
    }


    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Your job is to analyze a user-chatbot conversation transcript in five areas: fluency, clarity, grammar, coherence, and vocabulary variety.
          
Format response as:

#overall_summary
[Your overall summary here.]

#fluency
- Correct: [Example & explanation] 
- Incorrect: [Example & explanation]

#clarity
- Correct: [Example & explanation]
- Incorrect: [Example & explanation]

#grammar
- Correct: [Example & explanation]
- Incorrect: [Example & explanation]

#coherence
- Correct: [Example & explanation]
- Incorrect: [Example & explanation]

#vocab_variety
- Correct: [Example & explanation]
- Incorrect: [Example & explanation]

#conclusion
Provide an overall conclusion with improvement suggestions.
Also include a rating ("poor", "okay", or "amazing").
Use an informal tone as if talking to a friend.`,
        },
        // { role: "user", content: transcript },
        ...transcript
      ],
      response_format: zodResponseFormat(AnalysisSchema, "analysis"),
    });

    const analysis = completion.choices[0].message.parsed;

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
    }, { status: 500 });
  }
}
