import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyPreview = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + "..." : "NOT FOUND";
  
  return NextResponse.json({
    hasApiKey: hasKey,
    keyPreview: keyPreview,
    allEnvVars: Object.keys(process.env).filter(k => k.includes("OPENAI"))
  });
}
