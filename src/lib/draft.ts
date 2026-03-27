// Live Draft Tracker
// Tracks picks in real-time during a best ball draft

import { getADPData, analyzePick, DraftPlayer, DraftAnalysis } from './bestball';

export interface DraftPick {
  player: string;
  position: string;
  team: string;
  pickNumber: number;
  timestamp: number;
}

export interface DraftState {
  picks: DraftPick[];
  currentPick: number;
  yourTeam: DraftPick[];
  analysis: DraftAnalysis[];
}

// In-memory draft state (would use Redis in production)
let draftState: DraftState = {
  picks: [],
  currentPick: 1,
  yourTeam: [],
  analysis: []
};

export function resetDraft() {
  draftState = {
    picks: [],
    currentPick: 1,
    yourTeam: [],
    analysis: []
  };
}

export function addPick(playerName: string, pickNumber: number): DraftAnalysis | null {
  const players = getADPData();
  const player = players.find(p => 
    p.name.toLowerCase().includes(playerName.toLowerCase())
  );

  if (!player) {
    return null;
  }

  const pick: DraftPick = {
    player: player.name,
    position: player.position,
    team: player.team,
    pickNumber,
    timestamp: Date.now()
  };

  draftState.picks.push(pick);
  draftState.currentPick = pickNumber + 1;

  // Analyze this pick
  const analysis = analyzePick(player, pickNumber);
  draftState.analysis.push(analysis);

  return analysis;
}

export function getDraftState(): DraftState {
  return draftState;
}

export function getBestAvailable(position?: string): DraftAnalysis[] {
  const drafted = draftState.picks.map(p => p.player);
  const players = getADPData();
  
  let available = players.filter(p => !drafted.includes(p.name));
  
  if (position) {
    available = available.filter(p => p.position === position);
  }
  
  return available
    .sort((a, b) => a.adp - b.adp)
    .slice(0, 5)
    .map(p => analyzePick(p, draftState.currentPick));
}

export function getDraftAnalysis() {
  const latest = draftState.analysis[draftState.analysis.length - 1];
  
  // Get best available at each position
  const bestAvailable = {
    QB: getBestAvailable('QB'),
    RB: getBestAvailable('RB'),
    WR: getBestAvailable('WR'),
    TE: getBestAvailable('TE'),
    DST: getBestAvailable('DST')
  };
  
  // Find biggest steals and reaches
  const allAnalysis = draftState.analysis;
  const steals = allAnalysis.filter(a => a.isSteal).sort((a, b) => b.valueScore - a.valueScore).slice(0, 3);
  const reaches = allAnalysis.filter(a => a.isReach).sort((a, b) => a.valueScore - b.valueScore).slice(0, 3);
  
  return {
    latestPick: latest,
    totalPicks: draftState.picks.length,
    currentPick: draftState.currentPick,
    bestAvailable,
    steals,
    reaches
  };
}