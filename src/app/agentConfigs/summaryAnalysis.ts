import { AgentConfig } from "@/app/types";
const { z } = require('zod');

// Define schemas
const AnalysisCategorySchema = z.object({
  description: z.string(),
  correct_examples: z.string(),
  incorrect_examples: z.string(),
});

const AnalysisSchema = z.object({
  overall_summary: z.string(),
  fluency: AnalysisCategorySchema,
  clarity: AnalysisCategorySchema,
  grammar: AnalysisCategorySchema,
  coherence: AnalysisCategorySchema,
  vocab_variety: AnalysisCategorySchema,
  conclusion: z.string(),
});

const summaryAnalysis: AgentConfig = {
  name: "summaryAnalysis",
  publicDescription: "Analyzes conversation transcripts and provides detailed feedback on various aspects of the interaction.",
  instructions: `You are an expert conversation analyst who evaluates chat transcripts for quality, clarity, and effectiveness.

When analyzing a transcript, focus on these 5 key areas:
- Fluency: How natural the conversation flows
- Clarity: How clear and understandable the messages are
- Grammar: Proper language usage and structure
- Coherence: Logical flow and connection between messages
- Vocabulary Variety: Range and appropriateness of word choices

For each category, provide:
- A brief explanation of what it means
- Examples of correct usage from the transcript
- Examples of incorrect usage from the transcript

Start with an overall summary and end with improvement suggestions.
Keep the tone informal and friendly, like giving advice to a friend.`,
  tools: [
    {
      type: "function",
      name: "analyzeTranscript",
      description: "Analyzes a conversation transcript and provides structured feedback",
      parameters: {
        type: "object",
        properties: {
          transcript: {
            type: "string",
            description: "The full conversation transcript to analyze",
          }
        },
        required: ["transcript"],
      },
    }
  ],
  toolLogic: {
    analyzeTranscript: async ({ transcript }, transcriptLogs) => {
      try {
        const response = await fetch("/api/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Analyze a user-chatbot transcript in 5 areas: fluency, clarity, grammar, coherence, and vocabulary variety.
                
For each category, provide:
- A brief explanation of what it means
- Examples of correct usage from the transcript
- Examples of incorrect usage from the transcript

Start with an overall summary and end with improvement suggestions.
Keep the tone informal and friendly, like giving advice to a friend.`
              },
              { role: "user", content: transcript }
            ],
            response_format: { type: "json_object" }
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get analysis");
        }

        const completion = await response.json();
        const analysis = AnalysisSchema.parse(JSON.parse(completion.choices[0].message.content));
        return { result: analysis };
      } catch (error) {
        console.error("Error analyzing transcript:", error);
        return { error: "Failed to analyze transcript" };
      }
    }
  }
};

export default summaryAnalysis;
