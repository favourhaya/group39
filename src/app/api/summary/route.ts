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
  
    correct_clarity: z.string(),
    incorrect_clarity: z.string(),
  
    correct_grammar: z.string(),
    incorrect_grammar: z.string(),
  
    correct_coherence: z.string(),
    incorrect_coherence: z.string(),
  
  
    conclusion: z.string(),
    rating: z.enum(["poor", "good", "excellent"]),
  
    improvement_suggestions: z.array(z.string()),
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
          content: `Your job is to take a transcript between a user and a chatbot and analyze the user in 3 main areas: clarity, grammar, coherence.
        
Format your response like this:

#overall_summary
[Your overall summary here.] it should have a your this and this are good however your this could be better 
this is only if there is anything positive or negative to say

#rating
Give a rating based on the following criteria which should also be lenient  and not nitpicky on the user but not be afraid to say that they are doing poor that is fundemetal in english:
for the ratings the excellent  it should mimic an native english speaker. 
if there are little to no comments to make on a category or if the said category is very good compared to the other feel freee to write very little about it


#clarity 
- Correct: [Example of clear communication and why its correct]
- Incorrect: [Example of unclear communication and why its incorrect]

#grammar 
- Correct: [Example of correct grammar and why its correct]
- Incorrect: [Example of grammatical mistakes and why its incorrect]

#coherence 
- Correct: [Example of logical, coherent speech and why its correct]
- Incorrect: [Example of incoherence and why its incorrect]

#response_specification
Give an overall conclusion of how they can improve.



# when and when to not add info

if a field example fluency.correct_examples doesnt have enough information based on the info to be filled out to a very high standard turn it into an empty string




#making the suggestions
Lastly you should take away the key struggles of the user and give them a list of things they can do to improve their results
          while giving them resources(with links) and practice excercises. when giving feedback we should 
          eg.them strugling with past tense
          give resources when available like "Read or listen to clear sentences daily" should also offer some sites for reading books and audiobooks
          this recommendation should be concrete and not anything vague and try to use metrics whenever possible eg.Make an effort to learn new adjectives and verbs weekly to spice up your sentences and express yourself better.
          the more metrics the better
          try not to use words like a few or some try to give specific metrics. 


# Notes
- the response should be directed to the user and it should also be informal like talking to a friend
- Ignore '[inaudible]' completely. It is a bug not from the user
`,
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
