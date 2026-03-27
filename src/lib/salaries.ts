// Salary data management for DFS
// Fetches and stores DraftKings/FanDuel salary data

export interface PlayerSalary {
  name: string;
  position: string;
  team: string;
  salary: number;
  opponent: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface SlateData {
  sport: string;
  date: string;
  week?: number;
  year: number;
  draftkings: PlayerSalary[];
  fanduel: PlayerSalary[];
}

// Mock data for NFL Week 1 - will be replaced with real API data
const NFL_WEEK1_2026: SlateData = {
  sport: 'NFL',
  date: '2026-09-01',
  week: 1,
  year: 2026,
  draftkings: [
    // QB
    { name: 'Josh Allen', position: 'QB', team: 'BUF', salary: 9200, opponent: 'MIA', trend: 'stable' },
    { name: 'Jalen Hurts', position: 'QB', team: 'PHI', salary: 8800, opponent: 'DAL', trend: 'stable' },
    { name: 'Jared Goff', position: 'QB', team: 'DET', salary: 7500, opponent: 'CHI', trend: 'up' },
    { name: 'Sam Howell', position: 'QB', team: 'WAS', salary: 6000, opponent: 'PHI', trend: 'up' },
    { name: 'Geno Smith', position: 'QB', team: 'SEA', salary: 5800, opponent: 'LAR', trend: 'stable' },
    // RB
    { name: 'Saquon Barkley', position: 'RB', team: 'PHI', salary: 8200, opponent: 'DAL', trend: 'stable' },
    { name: 'Bijan Robinson', position: 'RB', team: 'ATL', salary: 7800, opponent: 'NO', trend: 'up' },
    { name: 'Derrick Henry', position: 'RB', team: 'BAL', salary: 7200, opponent: 'PIT', trend: 'down' },
    { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', salary: 7000, opponent: 'CHI', trend: 'stable' },
    { name: 'Kyren Williams', position: 'RB', team: 'LAR', salary: 6800, opponent: 'SEA', trend: 'up' },
    { name: 'James Cook', position: 'RB', team: 'BUF', salary: 6200, opponent: 'MIA', trend: 'stable' },
    { name: 'Rachaad White', position: 'RB', team: 'TB', salary: 5800, opponent: 'CAR', trend: 'up' },
    { name: 'David Montgomery', position: 'RB', team: 'DET', salary: 5400, opponent: 'CHI', trend: 'stable' },
    { name: 'Tony Pollard', position: 'RB', team: 'TEN', salary: 5200, opponent: 'IND', trend: 'stable' },
    { name: 'Aaron Jones', position: 'RB', team: 'MIN', salary: 5000, opponent: 'NYG', trend: 'down' },
    // WR
    { name: 'Justin Jefferson', position: 'WR', team: 'MIN', salary: 8800, opponent: 'NYG', trend: 'stable' },
    { name: 'Tyreek Hill', position: 'WR', team: 'MIA', salary: 8600, opponent: 'BUF', trend: 'stable' },
    { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', salary: 8400, opponent: 'CLE', trend: 'stable' },
    { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', salary: 8200, opponent: 'PHI', trend: 'stable' },
    { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', salary: 8000, opponent: 'CHI', trend: 'stable' },
    { name: 'A.J. Brown', position: 'WR', team: 'PHI', salary: 7600, opponent: 'DAL', trend: 'up' },
    { name: 'DeVonta Smith', position: 'WR', team: 'PHI', salary: 7000, opponent: 'DAL', trend: 'stable' },
    { name: 'Terry McLaurin', position: 'WR', team: 'WAS', salary: 6600, opponent: 'PHI', trend: 'up' },
    { name: 'Garrett Wilson', position: 'WR', team: 'NYJ', salary: 6400, opponent: 'NE', trend: 'stable' },
    { name: 'Drake London', position: 'WR', team: 'ATL', salary: 6200, opponent: 'NO', trend: 'stable' },
    { name: 'Chris Olave', position: 'WR', team: 'NO', salary: 6000, opponent: 'ATL', trend: 'stable' },
    { name: 'Tank Dell', position: 'WR', team: 'HOU', salary: 5600, opponent: 'IND', trend: 'up' },
    { name: 'George Pickens', position: 'WR', team: 'PIT', salary: 5400, opponent: 'BAL', trend: 'up' },
    // TE
    { name: 'Travis Kelce', position: 'TE', team: 'KC', salary: 7200, opponent: 'LAC', trend: 'down' },
    { name: 'Sam LaPorta', position: 'TE', team: 'DET', salary: 6400, opponent: 'CHI', trend: 'stable' },
    { name: 'George Kittle', position: 'TE', team: 'SF', salary: 6200, opponent: 'ARI', trend: 'stable' },
    { name: 'Jake Ferguson', position: 'TE', team: 'DAL', salary: 5400, opponent: 'PHI', trend: 'up' },
    { name: 'David Njoku', position: 'TE', team: 'CLE', salary: 5000, opponent: 'CIN', trend: 'stable' },
    // DST
    { name: 'San Francisco 49ers', position: 'DST', team: 'SF', salary: 4200, opponent: 'ARI', trend: 'stable' },
    { name: 'Philadelphia Eagles', position: 'DST', team: 'PHI', salary: 4000, opponent: 'DAL', trend: 'stable' },
    { name: 'New York Giants', position: 'DST', team: 'NYG', salary: 3200, opponent: 'MIN', trend: 'stable' },
  ],
  fanduel: [
    // QB
    { name: 'Josh Allen', position: 'QB', team: 'BUF', salary: 9500, opponent: 'MIA' },
    { name: 'Jalen Hurts', position: 'QB', team: 'PHI', salary: 9000, opponent: 'DAL' },
    { name: 'Jared Goff', position: 'QB', team: 'DET', salary: 7700, opponent: 'CHI' },
    { name: 'Sam Howell', position: 'QB', team: 'WAS', salary: 6100, opponent: 'PHI' },
    // RB
    { name: 'Saquon Barkley', position: 'RB', team: 'PHI', salary: 8500, opponent: 'DAL' },
    { name: 'Bijan Robinson', position: 'RB', team: 'ATL', salary: 8000, opponent: 'NO' },
    { name: 'Derrick Henry', position: 'RB', team: 'BAL', salary: 7400, opponent: 'PIT' },
    { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', salary: 7200, opponent: 'CHI' },
    { name: 'Kyren Williams', position: 'RB', team: 'LAR', salary: 7000, opponent: 'SEA' },
    { name: 'James Cook', position: 'RB', team: 'BUF', salary: 6400, opponent: 'MIA' },
    // WR
    { name: 'Justin Jefferson', position: 'WR', team: 'MIN', salary: 9000, opponent: 'NYG' },
    { name: 'Tyreek Hill', position: 'WR', team: 'MIA', salary: 8800, opponent: 'BUF' },
    { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', salary: 8600, opponent: 'CLE' },
    { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', salary: 8400, opponent: 'PHI' },
    { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', salary: 8200, opponent: 'CHI' },
    // TE
    { name: 'Travis Kelce', position: 'TE', team: 'KC', salary: 7400, opponent: 'LAC' },
    { name: 'Sam LaPorta', position: 'TE', team: 'DET', salary: 6600, opponent: 'CHI' },
    // DST
    { name: 'San Francisco 49ers', position: 'DST', team: 'SF', salary: 4500, opponent: 'ARI' },
  ]
};

// In-memory cache (would use Redis/DB in production)
let cachedSalaries: SlateData | null = null;
let lastUpdated: Date | null = null;

export async function getNFLSalaries(): Promise<SlateData> {
  // For now, return cached/mock data
  // In production, this would fetch from DraftKings API
  if (cachedSalaries) {
    return cachedSalaries;
  }
  
  cachedSalaries = NFL_WEEK1_2026;
  lastUpdated = new Date();
  
  return cachedSalaries;
}

export function getPositionsBySalary(salaries: PlayerSalary[], position: string, limit = 10): PlayerSalary[] {
  return salaries
    .filter(p => p.position === position)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, limit);
}

export function findValuePlays(salaries: PlayerSalary[], minSalary = 3000, maxSalary = 6500): PlayerSalary[] {
  return salaries
    .filter(p => p.salary >= minSalary && p.salary <= maxSalary)
    .sort((a, b) => a.salary - b.salary);
}

export function formatSalaryData(salaries: PlayerSalary[]): string {
  const byPosition: Record<string, PlayerSalary[]> = {};
  
  for (const player of salaries) {
    if (!byPosition[player.position]) {
      byPosition[player.position] = [];
    }
    byPosition[player.position].push(player);
  }
  
  let result = '## Current NFL DFS Salary Data\n\n';
  
  for (const [position, players] of Object.entries(byPosition)) {
    result += `### ${position}\n`;
    for (const p of players.sort((a, b) => b.salary - a.salary)) {
      result += `- **${p.name}** (${p.team}): $${p.salary.toLocaleString()} vs ${p.opponent}\n`;
    }
    result += '\n';
  }
  
  return result;
}