// NFL Data API utilities
// Uses balldontlie.io (free tier available)

const BALLDONTLIE_BASE = 'https://api.balldontlie.io/v1';

// Get API key from environment
function getApiKey() {
  return process.env.BALLDONTLIE_API_KEY || '';
}

// Fetch with error handling
async function nflFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BALLDONTLIE_BASE}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': getApiKey() || 'DEMO_KEY' // balldontlie has a demo key
      }
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('NFL API Error:', error);
    return null;
  }
}

// Get all NFL players
export async function getPlayers(search?: string) {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  
  return await nflFetch('/players', params);
}

// Get player by ID
export async function getPlayer(playerId: number) {
  return await nflFetch(`/players/${playerId}`);
}

// Get current NFL injuries
export async function getInjuries() {
  return await nflFetch('/injuries', {
    // Could filter by date, team, etc.
  });
}

// Get upcoming games for a week
export async function getGames(week?: number, season?: number) {
  const params: Record<string, string> = {};
  if (week) params.week = week.toString();
  if (season) params.season = season.toString();
  
  return await nflFetch('/games', params);
}

// Get team by ID
export async function getTeam(teamId: number) {
  return await nflFetch(`/teams/${teamId}`);
}

// Get all teams
export async function getTeams() {
  return await nflFetch('/teams');
}

// Get average stats (for projections)
export async function getAverages(playerId: number, season?: number) {
  return await nflFetch(`/averages/${playerId}`, {
    season: season?.toString() || '2025'
  });
}

// Simple injury parser for the morning briefing
export function parseInjuries(injuryData: any) {
  if (!injuryData?.data) return [];
  
  return injuryData.data
    .filter((i: any) => i.status === 'OUT' || i.status === 'QUESTIONABLE')
    .map((i: any) => ({
      player: i.player?.full_name || 'Unknown',
      team: i.team?.name || 'Unknown',
      status: i.status,
      injury: i.injury?.type || 'Unknown',
      details: i.injury?.detail || ''
    }));
}