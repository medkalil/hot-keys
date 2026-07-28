import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI } from '../api/client';
import { LeaderboardEntry, Operator } from '../types/game';

interface LeaderboardProps {
  operator: Operator | null;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ operator }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [operatorRank, setOperatorRank] = useState<LeaderboardEntry | null>(null);

  const LIMIT = 50;

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  useEffect(() => {
    if (operator) {
      fetchOperatorRank();
    }
  }, [operator]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.get(page, LIMIT);
      setEntries(response.data.data.entries);
      setTotal(response.data.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperatorRank = async () => {
    try {
      if (!operator) return;
      const response = await leaderboardAPI.getRank(operator.id);
      setOperatorRank(response.data.data);
    } catch (error) {
      console.error('Failed to fetch operator rank:', error);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-paper animate-slide-down">
      {/* Header */}
      <div className="border-b-2 border-hard bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">HOT KEYS</h1>
            <button onClick={() => navigate('/')} className="button-outline">
              ← TERMINAL
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">GLOBAL RANKINGS</h2>
              <p className="text-sm font-mono text-gray-600">CURRENT SEASON: ECHO PROTOCOL</p>
            </div>

            {operator && (
              <div className="text-right font-mono text-sm">
                <p className="text-gray-600">SEARCH OPERATOR...</p>
                <p className="font-bold text-lg">{operator.callsign}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Your Rank Section */}
        {operatorRank && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold font-mono border-l-4 border-hard pl-3 uppercase tracking-wider text-text">
                👤 YOUR RANKING
              </h3>
            </div>
            <div className="border-hard border-2 bg-white hard-shadow-lg overflow-hidden">
              <div className="grid grid-cols-5 bg-text text-white font-mono font-bold text-sm py-4 px-6">
                <div>RNK</div>
                <div>CALLSIGN</div>
                <div className="text-center">ACCURACY</div>
                <div className="text-center">TOTAL_SCORE</div>
                <div className="text-right">STATUS</div>
              </div>

              <div className="grid grid-cols-5 items-center py-4 px-6 font-mono text-sm bg-yellow-50">
                <div className="font-bold text-lg">#{operatorRank.rank}</div>
                <div className="font-bold flex items-center">
                  <span className="inline-block w-6 h-6 bg-text text-white text-center rounded-full mr-2 text-xs leading-6">
                    ⊙
                  </span>
                  {operatorRank.callsign}
                </div>
                <div className="text-center">{operatorRank.avg_accuracy}%</div>
                <div className="font-bold text-center">{operatorRank.total_score?.toLocaleString()}</div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green-800 bg-green-200 border border-green-600 px-3 py-1 font-mono uppercase">
                    YOU
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold font-mono border-l-4 border-hard pl-3 uppercase tracking-wider text-text">
              🏆 GLOBAL LEADERBOARD
            </h3>
          </div>
          <div className="border-hard border-2 bg-white hard-shadow-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-text text-white font-mono font-bold text-sm py-4 px-6">
              <div>RNK</div>
              <div>CALLSIGN</div>
              <div className="text-center">ACCURACY</div>
              <div className="text-center">TOTAL_SCORE</div>
              <div className="text-center">CURRENT_LEVEL</div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="py-12 text-center text-gray-500 font-mono">
                <p>Loading leaderboard...</p>
              </div>
            )}

            {/* Entries */}
            {!loading && entries.length > 0 ? (
              <div className="divide-y-2 divide-hard">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`
                      grid grid-cols-5 items-center py-4 px-6 font-mono text-sm
                      ${operatorRank?.id === entry.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="font-bold text-lg">
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : '#' + entry.rank}
                    </div>
                    <div className="font-bold">{entry.callsign}</div>
                    <div className="text-center">
                      <div className="w-full bg-gray-200 rounded h-4 relative">
                        <div
                          className="bg-text h-4 rounded transition-all"
                          style={{ width: `${entry.avg_accuracy}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{entry.avg_accuracy}%</div>
                    </div>
                    <div className="font-bold text-center">{entry.total_score?.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 text-center">L{entry.current_level}</div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="py-12 text-center text-gray-500 font-mono">
                  <p>No entries found</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 font-mono">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="button-outline px-4 py-2"
            >
              ←
            </button>
            <span className="font-bold">
              PAGE {page} OF {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="button-outline px-4 py-2"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
