'use client';

import { useState, useEffect, useRef } from 'react';

// Types
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
  timestamp?: number;
}

// ADP data
const ADP_DATA: Player[] = [
  { name: 'Justin Jefferson', position: 'WR', team: 'MIN', adp: 5, projectedPoints: 295 },
  { name: 'Tyreek Hill', position: 'WR', team: 'MIA', adp: 10, projectedPoints: 285 },
  { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', adp: 7, projectedPoints: 290 },
  { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', adp: 6, projectedPoints: 288 },
  { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', adp: 9, projectedPoints: 282 },
  { name: 'Saquon Barkley', position: 'RB', team: 'PHI', adp: 8, projectedPoints: 285 },
  { name: 'Bijan Robinson', position: 'RB', team: 'ATL', adp: 12, projectedPoints: 275 },
  { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', adp: 18, projectedPoints: 270 },
  { name: 'Kyren Williams', position: 'RB', team: 'LAR', adp: 15, projectedPoints: 272 },
  { name: 'Derrick Henry', position: 'RB', team: 'BAL', adp: 22, projectedPoints: 265 },
  { name: 'Josh Allen', position: 'QB', team: 'BUF', adp: 20, projectedPoints: 385 },
  { name: 'Jalen Hurts', position: 'QB', team: 'PHI', adp: 35, projectedPoints: 365 },
  { name: 'Jared Goff', position: 'QB', team: 'DET', adp: 85, projectedPoints: 320 },
  { name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', adp: 11, projectedPoints: 280 },
  { name: 'Puka Nacua', position: 'WR', team: 'LAR', adp: 24, projectedPoints: 258 },
  { name: 'A.J. Brown', position: 'WR', team: 'PHI', adp: 14, projectedPoints: 275 },
  { name: 'Travis Kelce', position: 'TE', team: 'KC', adp: 50, projectedPoints: 220 },
  { name: 'Sam LaPorta', position: 'TE', team: 'DET', adp: 60, projectedPoints: 205 },
  { name: 'Brandon Aiyuk', position: 'WR', team: 'SF', adp: 25, projectedPoints: 255 },
  { name: 'James Cook', position: 'RB', team: 'BUF', adp: 28, projectedPoints: 250 },
  { name: 'Jonathon Taylor', position: 'RB', team: 'IND', adp: 32, projectedPoints: 245 },
  { name: 'Rachaad White', position: 'RB', team: 'TB', adp: 45, projectedPoints: 235 },
  { name: 'George Kittle', position: 'TE', team: 'SF', adp: 70, projectedPoints: 195 },
  { name: 'Garrett Wilson', position: 'WR', team: 'NYJ', adp: 38, projectedPoints: 238 },
  { name: 'Drake London', position: 'WR', team: 'ATL', adp: 36, projectedPoints: 240 },
  { name: 'Chris Olave', position: 'WR', team: 'NO', adp: 42, projectedPoints: 235 },
  { name: 'Tank Dell', position: 'WR', team: 'HOU', adp: 58, projectedPoints: 220 },
  { name: 'David Montgomery', position: 'RB', team: 'DET', adp: 55, projectedPoints: 220 },
  { name: 'Tony Pollard', position: 'RB', team: 'TEN', adp: 65, projectedPoints: 215 },
  { name: 'Aaron Jones', position: 'RB', team: 'MIN', adp: 75, projectedPoints: 210 },
  { name: 'Josh Jacobs', position: 'RB', team: 'GB', adp: 40, projectedPoints: 230 },
  { name: 'Jake Ferguson', position: 'TE', team: 'DAL', adp: 95, projectedPoints: 180 },
  { name: 'David Njoku', position: 'TE', team: 'CLE', adp: 110, projectedPoints: 170 },
  { name: 'Sam Howell', position: 'QB', team: 'WAS', adp: 120, projectedPoints: 295 },
  { name: 'Geno Smith', position: 'QB', team: 'SEA', adp: 145, projectedPoints: 280 },
  { name: 'Terry McLaurin', position: 'WR', team: 'WAS', adp: 48, projectedPoints: 230 },
  { name: 'DeVonta Smith', position: 'WR', team: 'PHI', adp: 30, projectedPoints: 248 },
  { name: 'George Pickens', position: 'WR', team: 'PIT', adp: 62, projectedPoints: 215 },
  { name: 'Christian Kirk', position: 'WR', team: 'JAC', adp: 52, projectedPoints: 215 },
  { name: 'D.K. Metcalf', position: 'WR', team: 'PIT', adp: 46, projectedPoints: 220 },
  { name: 'Deebo Samuel', position: 'WR', team: 'SF', adp: 33, projectedPoints: 245 },
];

const TEAMS = Array.from({ length: 12 }, (_, i) => `Team ${i + 1}`);
const PICKS_PER_ROUND = 12;
const TOTAL_ROUNDS = 15;

export default function DraftRoom() {
  const [currentPick, setCurrentPick] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [mode, setMode] = useState<'select' | 'board'>('select');
  const boardRef = useRef<HTMLDivElement>(null);

  const draftedPlayers = picks.map(p => p.player);
  const availablePlayers = ADP_DATA.filter(p => !draftedPlayers.includes(p.name));
  const displayPlayers = filterPosition === 'all' 
    ? availablePlayers 
    : availablePlayers.filter(p => p.position === filterPosition);
  displayPlayers.sort((a, b) => a.adp - b.adp);

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

  // Get current team info
  const currentTeam = `Team ${Math.ceil(currentPick / PICKS_PER_ROUND)}`;
  const round = Math.ceil(currentPick / PICKS_PER_ROUND);
  const pickInRound = ((currentPick - 1) % PICKS_PER_ROUND) + 1;

  // Get picks for each team
  const getTeamPicks = (teamIndex: number) => {
    const teamNum = teamIndex + 1;
    return picks.filter((_, i) => {
      const pickTeam = Math.ceil((i + 1) / PICKS_PER_ROUND);
      return pickTeam === teamNum;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">🏈</div>
          <div>
            <h1 className="font-bold">DFS Draft Room</h1>
            <p className="text-zinc-500 text-xs">Best Ball 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setMode('select')}
              className={`px-3 py-1 rounded text-sm ${mode === 'select' ? 'bg-blue-600' : ''}`}
            >
              Select Player
            </button>
            <button
              onClick={() => setMode('board')}
              className={`px-3 py-1 rounded text-sm ${mode === 'board' ? 'bg-blue-600' : ''}`}
            >
              Draft Board
            </button>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-400">Pick #{currentPick}</p>
            <p className="text-zinc-500 text-xs">Round {round}, Pick {pickInRound}</p>
          </div>
        </div>
      </header>

      {/* Mode: Player Selection */}
      {mode === 'select' && (
        <div className="p-4 max-w-4xl mx-auto">
          {!selectedTeam && !showAnalysis && (
            <div className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
              <p className="text-zinc-400 mb-2">Who's picking?</p>
              <p className="text-3xl font-bold text-yellow-400 mb-4">{currentTeam}</p>
              <p className="text-zinc-500 text-sm">Click a team below to log their pick</p>
            </div>
          )}

          {!selectedTeam && !showAnalysis && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {TEAMS.map((team) => {
                const isCurrentTeam = team === currentTeam;
                return (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      isCurrentTeam 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {team}
                    {isCurrentTeam && <span className="block text-xs opacity-75">YOUR TURN</span>}
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
                  {['all', 'QB', 'RB', 'WR', 'TE'].map(pos => (
                    <button
                      key={pos}
                      onClick={() => setFilterPosition(pos)}
                      className={`px-3 py-1 rounded text-sm ${
                        filterPosition === pos ? 'bg-blue-600' : 'bg-zinc-800'
                      }`}
                    >
                      {pos.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                {displayPlayers.map((player) => (
                  <button
                    key={player.name}
                    onClick={() => handlePlayerSelect(player)}
                    className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-left"
                  >
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-zinc-500 text-sm ml-2">({player.team})</span>
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

          {/* Analysis Popup */}
          {showAnalysis && lastAnalysis && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full">
                {lastAnalysis.isSteal ? (
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">💎</div>
                    <h2 className="text-2xl font-bold text-green-400">STEAL!</h2>
                  </div>
                ) : lastAnalysis.isReach ? (
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">📈</div>
                    <h2 className="text-2xl font-bold text-red-400">REACH</h2>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">👍</div>
                    <h2 className="text-2xl font-bold text-blue-400">FAIR VALUE</h2>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold">{lastAnalysis.player.name}</h3>
                  <p className="text-zinc-400">{lastAnalysis.player.position} • {lastAnalysis.player.team}</p>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4 mb-6">
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
                    <span className="font-bold">{lastAnalysis.player.projectedPoints}</span>
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

      {/* Mode: Draft Board */}
      {mode === 'board' && (
        <div className="p-2 overflow-auto" ref={boardRef}>
          <div className="grid grid-cols-12 gap-1 min-w-[1200px]">
            {/* Header Row */}
            <div className="col-span-1"></div>
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <div key={i} className="text-center text-xs text-zinc-500 py-1">
                R{i + 1}
              </div>
            ))}

            {/* Team Rows */}
            {TEAMS.map((team, teamIndex) => {
              const isCurrentTeam = team === currentTeam;
              const teamPicks = getTeamPicks(teamIndex);
              
              return (
                <div key={team} className="contents">
                  {/* Team Name */}
                  <div className={`p-2 flex items-center text-xs font-medium ${
                    isCurrentTeam ? 'bg-yellow-900/30 text-yellow-400' : 'bg-zinc-800'
                  }`}>
                    {team}
                    {isCurrentTeam && <span className="ml-1 text-yellow-400">→</span>}
                  </div>

                  {/* Picks for each round */}
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
                            <div className="font-medium truncate w-full">{pick.player.split(' ')[0]}</div>
                            <div className="text-zinc-500 text-[10px]">{pick.position}</div>
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
  );
}