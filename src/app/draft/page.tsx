'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface Player {
  name: string;
  position: string;
  team: string;
  adp: number;
  projectedPoints: number;
}

interface DraftPick {
  player: string;
  position: string;
  team: string;
  pickNumber: number;
}

const ADP_DATA: Player[] = [
  { name: 'Justin Jefferson', position: 'WR', team: 'MIN', adp: 5, projectedPoints: 295 },
  { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', adp: 7, projectedPoints: 290 },
  { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', adp: 6, projectedPoints: 288 },
  { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', adp: 9, projectedPoints: 282 },
  { name: 'Tyreek Hill', position: 'WR', team: 'MIA', adp: 10, projectedPoints: 285 },
  { name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', adp: 11, projectedPoints: 280 },
  { name: 'Saquon Barkley', position: 'RB', team: 'PHI', adp: 8, projectedPoints: 285 },
  { name: 'Bijan Robinson', position: 'RB', team: 'ATL', adp: 12, projectedPoints: 275 },
  { name: 'Kyren Williams', position: 'RB', team: 'LAR', adp: 15, projectedPoints: 272 },
  { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', adp: 18, projectedPoints: 270 },
  { name: 'Derrick Henry', position: 'RB', team: 'BAL', adp: 22, projectedPoints: 265 },
  { name: 'Jonathon Taylor', position: 'RB', team: 'IND', adp: 32, projectedPoints: 245 },
  { name: 'Josh Allen', position: 'QB', team: 'BUF', adp: 20, projectedPoints: 385 },
  { name: 'Jalen Hurts', position: 'QB', team: 'PHI', adp: 35, projectedPoints: 365 },
  { name: 'Travis Kelce', position: 'TE', team: 'KC', adp: 50, projectedPoints: 220 },
  { name: 'Sam LaPorta', position: 'TE', team: 'DET', adp: 60, projectedPoints: 205 },
  { name: 'George Kittle', position: 'TE', team: 'SF', adp: 70, projectedPoints: 195 },
  { name: 'Brandon Aiyuk', position: 'WR', team: 'SF', adp: 25, projectedPoints: 255 },
  { name: 'Puka Nacua', position: 'WR', team: 'LAR', adp: 24, projectedPoints: 258 },
  { name: 'A.J. Brown', position: 'WR', team: 'PHI', adp: 14, projectedPoints: 275 },
  { name: 'James Cook', position: 'RB', team: 'BUF', adp: 28, projectedPoints: 250 },
  { name: 'Rachaad White', position: 'RB', team: 'TB', adp: 45, projectedPoints: 235 },
  { name: 'Garrett Wilson', position: 'WR', team: 'NYJ', adp: 38, projectedPoints: 238 },
  { name: 'Drake London', position: 'WR', team: 'ATL', adp: 36, projectedPoints: 240 },
  { name: 'Chris Olave', position: 'WR', team: 'NO', adp: 42, projectedPoints: 235 },
  { name: 'Tank Dell', position: 'WR', team: 'HOU', adp: 58, projectedPoints: 220 },
  { name: 'DeVonta Smith', position: 'WR', team: 'PHI', adp: 30, projectedPoints: 248 },
  { name: 'Deebo Samuel', position: 'WR', team: 'SF', adp: 33, projectedPoints: 245 },
  { name: 'David Montgomery', position: 'RB', team: 'DET', adp: 55, projectedPoints: 220 },
  { name: 'Tony Pollard', position: 'RB', team: 'TEN', adp: 65, projectedPoints: 215 },
  { name: 'Aaron Jones', position: 'RB', team: 'MIN', adp: 75, projectedPoints: 210 },
  { name: 'Josh Jacobs', position: 'RB', team: 'GB', adp: 40, projectedPoints: 230 },
  { name: 'Jared Goff', position: 'QB', team: 'DET', adp: 85, projectedPoints: 320 },
  { name: 'Jake Ferguson', position: 'TE', team: 'DAL', adp: 95, projectedPoints: 180 },
  { name: 'David Njoku', position: 'TE', team: 'CLE', adp: 110, projectedPoints: 170 },
  { name: 'Sam Howell', position: 'QB', team: 'WAS', adp: 120, projectedPoints: 295 },
  { name: 'Geno Smith', position: 'QB', team: 'SEA', adp: 145, projectedPoints: 280 },
  { name: 'Terry McLaurin', position: 'WR', team: 'WAS', adp: 48, projectedPoints: 230 },
  { name: 'George Pickens', position: 'WR', team: 'PIT', adp: 62, projectedPoints: 215 },
  { name: 'Christian Kirk', position: 'WR', team: 'JAC', adp: 52, projectedPoints: 215 },
  { name: 'D.K. Metcalf', position: 'WR', team: 'PIT', adp: 46, projectedPoints: 220 },
  { name: 'San Francisco 49ers', position: 'DST', team: 'SF', adp: 130, projectedPoints: 155 },
  { name: 'Philadelphia Eagles', position: 'DST', team: 'PHI', adp: 140, projectedPoints: 150 },
  { name: 'New York Giants', position: 'DST', team: 'NYG', adp: 175, projectedPoints: 135 },
];

const TEAMS = Array.from({ length: 12 }, (_, i) => `Team ${i + 1}`);
const PICKS_PER_ROUND = 12;
const TOTAL_ROUNDS = 15;
const MY_TEAM = 'Team 1'; // Can be changed by user

export default function DraftRoom() {
  const [currentPick, setCurrentPick] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'select' | 'board'>('select');
  const [myTeam, setMyTeam] = useState<string>(MY_TEAM);

  useEffect(() => {
    async function loadDraftState() {
      try {
        const res = await fetch('/api/draft');
        const data = await res.json();
        if (data.state && data.state.picks) {
          setPicks(data.state.picks);
          setCurrentPick(data.state.currentPick);
        }
      } catch (err) {
        console.error('Error loading draft state:', err);
      }
    }
    loadDraftState();
  }, []);

  const draftedPlayers = picks.map(p => p.player);
  
  const availablePlayers = useMemo(() => {
    let players = ADP_DATA.filter(p => !draftedPlayers.includes(p.name));
    if (filterPosition !== 'all') {
      players = players.filter(p => p.position === filterPosition);
    }
    if (searchQuery) {
      players = players.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return players.sort((a, b) => a.adp - b.adp);
  }, [draftedPlayers, filterPosition, searchQuery]);

  // Get best available at each position
  const bestAvailable = useMemo(() => {
    const positions = ['QB', 'RB', 'WR', 'TE', 'DST'];
    const result: Record<string, Player[]> = {};
    const available = ADP_DATA.filter(p => !draftedPlayers.includes(p.name));
    
    for (const pos of positions) {
      result[pos] = available
        .filter(p => p.position === pos)
        .sort((a, b) => a.adp - b.adp)
        .slice(0, 3);
    }
    return result;
  }, [draftedPlayers]);

  // Get my team's roster
  const myTeamPicks = useMemo(() => {
    return picks.filter(pick => {
      const pickTeamNum = Math.ceil(pick.pickNumber / PICKS_PER_ROUND);
      return pickTeamNum === parseInt(myTeam.replace('Team ', ''));
    });
  }, [picks, myTeam]);

  // Calculate position needs
  const positionNeeds = useMemo(() => {
    const needs: Record<string, number> = { QB: 1, RB: 3, WR: 3, TE: 1, DST: 1, FLEX: 2 };
    const positions = ['QB', 'RB', 'WR', 'TE', 'DST'];
    const filled: Record<string, number> = { QB: 0, RB: 0, WR: 0, TE: 0, DST: 0 };
    
    for (const pick of myTeamPicks) {
      if (filled[pick.position] !== undefined) {
        filled[pick.position] = (filled[pick.position] || 0) + 1;
      }
    }
    
    const result: { position: string; filled: number; needed: number; priority: string }[] = [];
    for (const pos of positions) {
      const filledCount = pos === 'DST' ? filled.DST : filled[pos as keyof typeof filled];
      const neededCount = pos === 'DST' ? 1 : needs[pos];
      if (filledCount < neededCount) {
        result.push({
          position: pos,
          filled: filledCount,
          needed: neededCount,
          priority: filledCount === 0 ? 'HIGH' : 'MEDIUM'
        });
      }
    }
    return result.sort((a, b) => (a.priority === 'HIGH' ? -1 : 1));
  }, [myTeamPicks]);

  // Total projected points
  const totalProjected = useMemo(() => {
    return myTeamPicks.reduce((sum, pick) => {
      const player = ADP_DATA.find(p => p.name === pick.player);
      return sum + (player?.projectedPoints || 0);
    }, 0);
  }, [myTeamPicks]);

  const handlePlayerSelect = async (player: Player) => {
    if (!selectedTeam) return;
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addPick',
          playerName: player.name,
          pickNumber: currentPick
        })
      });
      const data = await res.json();
      if (data.success) {
        const newPick: DraftPick = {
          player: player.name,
          position: player.position,
          team: player.team,
          pickNumber: currentPick
        };
        setPicks([...picks, newPick]);
        setLastAnalysis(data.analysis);
        setShowAnalysis(true);
        setCurrentPick(currentPick + 1);
        setSelectedTeam(null);
      }
    } catch (err) {
      console.error('Error adding pick:', err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Start a new draft? This will clear all picks.')) return;
    try {
      await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      setPicks([]);
      setCurrentPick(1);
    } catch (err) {
      console.error('Error resetting draft:', err);
    }
  };

  const currentTeam = `Team ${Math.ceil(currentPick / PICKS_PER_ROUND)}`;
  const round = Math.ceil(currentPick / PICKS_PER_ROUND);
  const pickInRound = ((currentPick - 1) % PICKS_PER_ROUND) + 1;
  const isMyTurn = selectedTeam === myTeam || currentTeam === myTeam;

  const getTeamPicks = (teamIndex: number) => {
    const teamNum = teamIndex + 1;
    return picks.filter((_, i) => Math.ceil((i + 1) / PICKS_PER_ROUND) === teamNum);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">🏈</div>
          <div>
            <h1 className="font-bold">DFS Draft Room</h1>
            <p className="text-zinc-500 text-xs">Best Ball 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={myTeam}
            onChange={(e) => setMyTeam(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-1 rounded text-sm"
          >
            {TEAMS.map(t => <option key={t} value={t}>{t} (You)</option>)}
          </select>
          <button 
            onClick={handleReset}
            className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900 rounded text-red-300"
          >
            Reset
          </button>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setMode('select')}
              className={`px-3 py-1 rounded text-sm ${mode === 'select' ? 'bg-blue-600' : ''}`}
            >
              Select
            </button>
            <button
              onClick={() => setMode('board')}
              className={`px-3 py-1 rounded text-sm ${mode === 'board' ? 'bg-blue-600' : ''}`}
            >
              Board
            </button>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-400">Pick #{currentPick}</p>
            <p className="text-zinc-500 text-xs">Round {round}, Pick {pickInRound}</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel: My Team Roster */}
        <div className="w-72 border-r border-zinc-800 p-4 bg-zinc-900/50">
          <h3 className="font-bold text-lg mb-3">Your Roster</h3>
          
          {/* Projected Points */}
          <div className="bg-zinc-800 rounded-lg p-3 mb-4">
            <p className="text-zinc-500 text-xs">Projected Points</p>
            <p className="text-2xl font-bold text-green-400">{totalProjected}</p>
          </div>

          {/* Position Needs */}
          <div className="mb-4">
            <p className="text-zinc-500 text-xs mb-2">POSITION NEEDS</p>
            {positionNeeds.map(p => (
              <div key={p.position} className="flex items-center justify-between py-1">
                <span className="text-sm">{p.position}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  p.priority === 'HIGH' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {p.filled}/{p.needed} {p.priority}
                </span>
              </div>
            ))}
          </div>

          {/* My Picks */}
          <div>
            <p className="text-zinc-500 text-xs mb-2">YOUR PICKS</p>
            <div className="space-y-1">
              {myTeamPicks.map((pick, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-800 rounded px-2 py-1">
                  <span className="text-sm font-medium">{pick.player}</span>
                  <span className="text-xs text-zinc-500">{pick.position}</span>
                </div>
              ))}
              {myTeamPicks.length === 0 && (
                <p className="text-zinc-600 text-sm italic">No picks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {mode === 'select' && (
            <div className="p-4">
              {/* My Turn Banner */}
              {isMyTurn && !selectedTeam && !showAnalysis && (
                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 mb-4 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-bold text-lg">🎯 YOUR TURN TO PICK</p>
                      <p className="text-zinc-400 text-sm">Based on your needs:</p>
                    </div>
                    <div className="text-right">
                      {positionNeeds.slice(0, 2).map(p => (
                        <div key={p.position} className="text-sm">
                          <span className="text-yellow-400 font-bold">{bestAvailable[p.position]?.[0]?.name}</span>
                          <span className="text-zinc-500"> ({p.position})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!selectedTeam && !showAnalysis && (
                <div className="bg-zinc-900 rounded-xl p-4 mb-4 text-center">
                  <p className="text-zinc-400 mb-2">Who's picking?</p>
                  <p className="text-3xl font-bold text-yellow-400 mb-2">{currentTeam}</p>
                  {isMyTurn && <p className="text-green-400 font-bold">YOUR TURN!</p>}
                </div>
              )}

              {!selectedTeam && !showAnalysis && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {TEAMS.map((team) => {
                    const isCurrentTeam = team === currentTeam;
                    const isMe = team === myTeam;
                    return (
                      <button
                        key={team}
                        onClick={() => setSelectedTeam(team)}
                        className={`p-2 rounded-lg font-medium text-sm transition-all ${
                          isCurrentTeam 
                            ? isMe ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white' 
                            : isMe ? 'bg-green-900/50 hover:bg-green-900 text-green-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {team.replace('Team ', 'T')}
                        {isMe && <span className="block text-xs opacity-75">YOU</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTeam && !showAnalysis && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setSelectedTeam(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      ← Back
                    </button>
                    <h2 className="text-xl font-bold">{selectedTeam} selects:</h2>
                    <div className="flex gap-2">
                      {['all', 'QB', 'RB', 'WR', 'TE', 'DST'].map(pos => (
                        <button
                          key={pos}
                          onClick={() => setFilterPosition(pos)}
                          className={`px-2 py-1 rounded text-xs ${
                            filterPosition === pos ? 'bg-blue-600' : 'bg-zinc-800'
                          }`}
                        >
                          {pos.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search player name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 mb-4 text-white"
                  />

                  {/* Best Available Tips */}
                  <div className="bg-zinc-800/50 rounded-lg p-3 mb-4">
                    <p className="text-zinc-500 text-xs mb-2">BEST AVAILABLE</p>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(bestAvailable).map(([pos, players]) => (
                        <div key={pos}>
                          <p className="text-xs text-zinc-500 mb-1">{pos}</p>
                          {players.slice(0, 2).map(p => (
                            <div key={p.name} className="text-xs text-yellow-400 truncate">
                              {p.name.split(' ').slice(-1)[0]}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
                    {availablePlayers.map((player) => (
                      <button
                        key={player.name}
                        onClick={() => handlePlayerSelect(player)}
                        className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-left"
                      >
                        <div>
                          <span className="font-medium">{player.name}</span>
                          <span className="text-zinc-500 text-sm ml-2">({player.team})</span>
                          <span className="text-xs text-green-400 ml-2">{player.projectedPoints}pts</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-500 block">{player.position}</span>
                          <span className="text-yellow-400 font-bold">#{player.adp}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showAnalysis && lastAnalysis && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                  <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full">
                    {lastAnalysis.isSteal ? (
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">💎</div>
                        <h2 className="text-2xl font-bold text-green-400">STEAL!</h2>
                      </div>
                    ) : lastAnalysis.isReach ? (
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">📈</div>
                        <h2 className="text-2xl font-bold text-red-400">REACH</h2>
                      </div>
                    ) : (
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">👍</div>
                        <h2 className="text-2xl font-bold text-blue-400">FAIR VALUE</h2>
                      </div>
                    )}

                    <div className="mb-4 text-center">
                      <h3 className="text-xl font-bold">{lastAnalysis.player.name}</h3>
                      <p className="text-zinc-400">{lastAnalysis.player.position} • {lastAnalysis.player.team}</p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-500">Current Pick</span>
                        <span className="font-bold">#{lastAnalysis.player.adp + lastAnalysis.valueScore}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-500">ADP</span>
                        <span className="font-bold">#{lastAnalysis.player.adp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Projected Pts</span>
                        <span className="font-bold text-green-400">{lastAnalysis.player.projectedPoints}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAnalysis(false)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
                    >
                      Continue Draft →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'board' && (
            <div className="p-2 overflow-auto">
              <div className="grid grid-cols-12 gap-1 min-w-[1200px]">
                <div className="col-span-1"></div>
                {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                  <div key={i} className="text-center text-xs text-zinc-500 py-1">R{i + 1}</div>
                ))}

                {TEAMS.map((team, teamIndex) => {
                  const isCurrentTeam = team === currentTeam;
                  const isMyTeam = team === myTeam;
                  
                  return (
                    <div key={team} className="contents">
                      <div className={`p-2 flex items-center text-xs font-medium ${
                        isMyTeam ? 'bg-green-900/30 text-green-400' : isCurrentTeam ? 'bg-yellow-900/30 text-yellow-400' : 'bg-zinc-800'
                      }`}>
                        {team.replace('Team ', 'T')}
                        {isMyTeam && ' ★'}
                      </div>

                      {Array.from({ length: TOTAL_ROUNDS }, (_, roundIndex) => {
                        const pickNum = (roundIndex * 12) + teamIndex + 1;
                        const pick = picks.find(p => p.pickNumber === pickNum);
                        
                        return (
                          <div 
                            key={roundIndex}
                            className={`p-1 flex items-center justify-center text-xs min-h-[40px] ${
                              pick ? 'bg-green-900/30' : isCurrentTeam && pickNum === currentPick ? 'bg-yellow-900/50 animate-pulse' : 'bg-zinc-900'
                            }`}
                          >
                            {pick ? (
                              <div className="text-center">
                                <div className="font-medium truncate w-full text-[10px]">{pick.player.split(' ').slice(-1)[0]}</div>
                              </div>
                            ) : (
                              <span className="text-zinc-700">{pickNum}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}