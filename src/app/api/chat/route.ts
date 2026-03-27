import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const DFS_SYSTEM_PROMPT = `You are an expert DFS (Daily Fantasy Sports) analyst. You help users with:
- DraftKings and FanDuel lineups
- Player projections and value plays
- Stack strategies (QB/WR, TE stacks)
- GPP and cash game advice
- Injury news and lineup impacts
- Player matchups and floor/ceiling analysis

When answering questions:
1. Be specific and actionable
2. Provide reasoning behind your picks
3. Consider salary cap constraints
4. Mention ownership percentages when relevant
5. Give context about tournament vs cash game play styles

If asked about a specific slate, provide the best value plays, top stacks, and fade candidates.
If asked to analyze a lineup, look for value mismatches, ownership overlaps, and optimal stack combinations.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key not configured. Please contact the admin." }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DFS_SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return NextResponse.json({
      response,
      sources: ["Web Search", "DFS Knowledge Base"]
    });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
