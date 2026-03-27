import { NextRequest, NextResponse } from "next/server";
import { getADPData, analyzePick, getBestAvailable, getSteals, getValueByPosition } from "@/lib/bestball";

export async function GET() {
  try {
    const players = getADPData();
    
    return NextResponse.json({
      sport: 'NFL',
      season: 2026,
      type: 'Best Ball',
      players: players.map(p => ({
        name: p.name,
        position: p.position,
        team: p.team,
        adp: p.adp,
        adpRank: p.adpRank,
        projectedPoints: p.projectedPoints,
        tier: p.tier
      })),
      count: players.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, playerName, currentPick, drafted = [] } = await request.json();
    
    if (action === 'analyze') {
      // Analyze a specific player's value
      const players = getADPData();
      const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
      
      if (!player) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
      
      const analysis = analyzePick(player, currentPick);
      return NextResponse.json(analysis);
    }
    
    if (action === 'bestAvailable') {
      // Get best available at each position
      const valueByPos = getValueByPosition(drafted);
      return NextResponse.json(valueByPos);
    }
    
    if (action === 'steals') {
      // Get best steals (value plays)
      const stealers = getSteals(drafted);
      return NextResponse.json({ steals: stealers });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}