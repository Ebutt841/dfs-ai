// Best Ball Draft Assistant
// Provides real-time value analysis during drafts

export interface DraftPlayer {
  name: string;
  position: string;
  team: string;
  adp: number;           // Average Draft Position (lower = drafted earlier)
  adpRank: number;       // Overall rank
  projectedPoints: number;
  tier: number;
}

export interface DraftAnalysis {
  player: DraftPlayer;
  fairValue: number;           // What pick they should go at
  isSteal: boolean;            // Great value (available later than ADP)
  isReach: boolean;            // Overpriced (drafted earlier than ADP)
  valueScore: number;          // + is steal, - is reach
  recommendation: string;
}

// ADP data - in production, fetch from FantasyPros API
const BESTBALL_ADP_2026: DraftPlayer[] = [
  // QBs - tiered
  { name: 'Josh Allen', position: 'QB', team: 'BUF', adp: 20, adpRank: 20, projectedPoints: 385, tier: 1 },
  { name: 'Jalen Hurts', position: 'QB', team: 'PHI', adp: 35, adpRank: 35, projectedPoints: 365, tier: 1 },
  { name: 'Jared Goff', position: 'QB', team: 'DET', adp: 85, adpRank: 85, projectedPoints: 320, tier: 2 },
  { name: 'Sam Howell', position: 'QB', team: 'WAS', adp: 120, adpRank: 120, projectedPoints: 295, tier: 3 },
  { name: 'Geno Smith', position: 'QB', team: 'SEA', adp: 145, adpRank: 145, projectedPoints: 280, tier: 3 },
  
  // RBs - high value in best ball
  { name: 'Saquon Barkley', position: 'RB', team: 'PHI', adp: 8, adpRank: 8, projectedPoints: 285, tier: 1 },
  { name: 'Bijan Robinson', position: 'RB', team: 'ATL', adp: 12, adpRank: 12, projectedPoints: 275, tier: 1 },
  { name: 'Derrick Henry', position: 'RB', team: 'BAL', adp: 22, adpRank: 22, projectedPoints: 265, tier: 1 },
  { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', adp: 18, adpRank: 18, projectedPoints: 270, tier: 1 },
  { name: 'Kyren Williams', position: 'RB', team: 'LAR', adp: 15, adpRank: 15, projectedPoints: 272, tier: 1 },
  { name: 'James Cook', position: 'RB', team: 'BUF', adp: 28, adpRank: 28, projectedPoints: 250, tier: 2 },
  { name: 'Rachaad White', position: 'RB', team: 'TB', adp: 45, adpRank: 45, projectedPoints: 235, tier: 2 },
  { name: 'David Montgomery', position: 'RB', team: 'DET', adp: 55, adpRank: 55, projectedPoints: 220, tier: 2 },
  { name: 'Tony Pollard', position: 'RB', team: 'TEN', adp: 65, adpRank: 65, projectedPoints: 215, tier: 2 },
  { name: 'Aaron Jones', position: 'RB', team: 'MIN', adp: 75, adpRank: 75, projectedPoints: 210, tier: 2 },
  { name: 'Josh Jacobs', position: 'RB', team: 'GB', adp: 40, adpRank: 40, projectedPoints: 230, tier: 2 },
  { name: 'Jonathon Taylor', position: 'RB', team: 'IND', adp: 32, adpRank: 32, projectedPoints: 245, tier: 1 },
  
  // WRs - the engine of best ball
  { name: 'Justin Jefferson', position: 'WR', team: 'MIN', adp: 5, adpRank: 5, projectedPoints: 295, tier: 1 },
  { name: 'Tyreek Hill', position: 'WR', team: 'MIA', adp: 10, adpRank: 10, projectedPoints: 285, tier: 1 },
  { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', adp: 7, adpRank: 7, projectedPoints: 290, tier: 1 },
  { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', adp: 6, adpRank: 6, projectedPoints: 288, tier: 1 },
  { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', adp: 9, adpRank: 9, projectedPoints: 282, tier: 1 },
  { name: 'A.J. Brown', position: 'WR', team: 'PHI', adp: 14, adpRank: 14, projectedPoints: 275, tier: 1 },
  { name: 'DeVonta Smith', position: 'WR', team: 'PHI', adp: 30, adpRank: 30, projectedPoints: 248, tier: 2 },
  { name: 'Terry McLaurin', position: 'WR', team: 'WAS', adp: 48, adpRank: 48, projectedPoints: 230, tier: 2 },
  { name: 'Garrett Wilson', position: 'WR', team: 'NYJ', adp: 38, adpRank: 38, projectedPoints: 238, tier: 2 },
  { name: 'Drake London', position: 'WR', team: 'ATL', adp: 36, adpRank: 36, projectedPoints: 240, tier: 2 },
  { name: 'Chris Olave', position: 'WR', team: 'NO', adp: 42, adpRank: 42, projectedPoints: 235, tier: 2 },
  { name: 'Tank Dell', position: 'WR', team: 'HOU', adp: 58, adpRank: 58, projectedPoints: 220, tier: 2 },
  { name: 'George Pickens', position: 'WR', team: 'PIT', adp: 62, adpRank: 62, projectedPoints: 215, tier: 3 },
  { name: 'Brandon Aiyuk', position: 'WR', team: 'SF', adp: 25, adpRank: 25, projectedPoints: 255, tier: 1 },
  { name: 'Puka Nacua', position: 'WR', team: 'LAR', adp: 24, adpRank: 24, projectedPoints: 258, tier: 1 },
  { name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', adp: 11, adpRank: 11, projectedPoints: 280, tier: 1 },
  
  // TEs - wait on these in best ball
  { name: 'Travis Kelce', position: 'TE', team: 'KC', adp: 50, adpRank: 50, projectedPoints: 220, tier: 1 },
  { name: 'Sam LaPorta', position: 'TE', team: 'DET', adp: 60, adpRank: 60, projectedPoints: 205, tier: 2 },
  { name: 'George Kittle', position: 'TE', team: 'SF', adp: 70, adpRank: 70, projectedPoints: 195, tier: 2 },
  { name: 'Jake Ferguson', position: 'TE', team: 'DAL', adp: 95, adpRank: 95, projectedPoints: 180, tier: 3 },
  { name: 'David Njoku', position: 'TE', team: 'CLE', adp: 110, adpRank: 110, projectedPoints: 170, tier: 3 },
  
  // DST - late round targets
  { name: 'San Francisco 49ers', position: 'DST', team: 'SF', adp: 130, adpRank: 130, projectedPoints: 155, tier: 2 },
  { name: 'Philadelphia Eagles', position: 'DST', team: 'PHI', adp: 140, adpRank: 140, projectedPoints: 150, tier: 2 },
  { name: 'New York Giants', position: 'DST', team: 'NYG', adp: 175, adpRank: 175, projectedPoints: 135, tier: 3 },
];

export function getADPData(): DraftPlayer[] {
  return BESTBALL_ADP_2026;
}

export function analyzePick(player: DraftPlayer, currentPick: number): DraftAnalysis {
  const fairValue = player.adp;
  const valueScore = fairValue - currentPick; // + means steal, - means reach
  
  let recommendation = '';
  let isSteal = false;
  let isReach = false;
  
  if (valueScore >= 15) {
    isSteal = true;
    recommendation = `💎 STEAL! ${player.name} is going way later than ADP (${player.adp}). Grab him!`;
  } else if (valueScore <= -15) {
    isReach = true;
    recommendation = `📈 REACH ALERT: ${player.name} is being drafted way earlier than ADP (${player.adp}). Pass or wait.`;
  } else if (valueScore >= 5) {
    recommendation = `✅ Good value: ${player.name} is a bit underpriced. Solid pick.`;
  } else if (valueScore <= -5) {
    recommendation = `⚠️ Overpriced: ${player.name} is going earlier than ADP. Consider waiting.`;
  } else {
    recommendation = `📊 Fair market value for ${player.name}.`;
  }
  
  return {
    player,
    fairValue,
    isSteal,
    isReach,
    valueScore,
    recommendation
  };
}

export function getBestAvailable(
  drafted: string[], 
  position: string, 
  limit = 5
): DraftAnalysis[] {
  const available = BESTBALL_ADP_2026
    .filter(p => !drafted.includes(p.name) && p.position === position)
    .sort((a, b) => a.adp - b.adp)
    .slice(0, limit * 2)
    .map(p => analyzePick(p, 100)); // Using 100 as "current pick" for sorting
  
  return available
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, limit);
}

export function getSteals(drafted: string[]): DraftAnalysis[] {
  return BESTBALL_ADP_2026
    .filter(p => !drafted.includes(p.name))
    .map(p => analyzePick(p, 120)) // Simulating late draft
    .filter(a => a.isSteal)
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 5);
}

export function getValueByPosition(drafted: string[]): Record<string, DraftAnalysis[]> {
  const positions = ['QB', 'RB', 'WR', 'TE', 'DST'];
  const result: Record<string, DraftAnalysis[]> = {};
  
  for (const pos of positions) {
    result[pos] = getBestAvailable(drafted, pos, 3);
  }
  
  return result;
}