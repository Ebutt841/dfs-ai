import { NextRequest, NextResponse } from "next/server";
import { addPick, getDraftState, getDraftAnalysis, resetDraft, getBestAvailable } from "@/lib/draft";

export async function GET() {
  const state = getDraftState();
  const analysis = getDraftAnalysis();
  
  return NextResponse.json({
    state,
    analysis
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, playerName, pickNumber, position } = await request.json();
    
    if (action === 'addPick') {
      if (!playerName || !pickNumber) {
        return NextResponse.json({ error: 'playerName and pickNumber required' }, { status: 400 });
      }
      
      const analysis = addPick(playerName, pickNumber);
      
      if (!analysis) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        analysis,
        currentPick: getDraftState().currentPick
      });
    }
    
    if (action === 'reset') {
      resetDraft();
      return NextResponse.json({ success: true, message: 'Draft reset' });
    }
    
    if (action === 'bestAvailable') {
      const best = getBestAvailable(position);
      return NextResponse.json({ bestAvailable: best });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}