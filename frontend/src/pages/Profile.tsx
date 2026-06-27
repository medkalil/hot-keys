import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI, operatorsAPI } from '../api/client';
import { Operator, OperatorStats, GamesResponse } from '../types/game';

const Profile = () => {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [stats, setStats] = useState<OperatorStats | null>(null);
  const [games, setGames] = useState<GamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const operatorId = localStorage.getItem('operatorId');
        if (!operatorId) {
          setError('No operator found. Please create an identity first.');
          setLoading(false);
          return;
        }

        const [opRes, statsRes, gamesRes] = await Promise.all([
          operatorsAPI.get(operatorId),
          gamesAPI.getStats(operatorId),
          gamesAPI.getHistory(operatorId),
        ]);

        setOperator(opRes.data);
        setStats(statsRes.data);
        setGames(gamesRes.data);
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="text-center p-8 font-mono">Loading Profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 font-mono">
        <p>{error}</p>
        <Link to="/onboarding" className="text-blue-500 underline">Go to Onboarding</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 tracking-tighter">
        OPERATOR PROFILE
      </h1>
      <div
        className="bg-white p-6 border-2 border-black hard-shadow mb-8"
      >
        <h2 className="text-3xl font-bold text-black tracking-tighter">
          {operator?.callsign || '...'}
        </h2>
        <p className="text-gray-500 font-mono">LEVEL {stats?.current_level || '...'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Score" value={stats?.total_score} />
        <StatCard title="Best WPM" value={stats?.best_wpm} />
        <StatCard title="Avg Accuracy" value={stats?.avg_accuracy ? Math.round(stats.avg_accuracy) : undefined} unit="%" />
        <StatCard title="Games Played" value={stats?.games_played} />
      </div>

      <h2 className="text-2xl font-bold mb-4 tracking-tighter">GAME HISTORY</h2>
      <div className="bg-white border-2 border-black hard-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black">
              <tr>
                <th className="p-4 font-mono">Level</th>
                <th className="p-4 font-mono">WPM</th>
                <th className="p-4 font-mono">Accuracy</th>
                <th className="p-4 font-mono">Score</th>
                <th className="p-4 font-mono">Date</th>
              </tr>
            </thead>
            <tbody>
              {games.data.map((game) => (
                <tr key={game.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-4">{game.level}</td>
                  <td className="p-4">{game.wpm}</td>
                  <td className="p-4">{game.accuracy}%</td>
                  <td className="p-4">{game.score}</td>
                  <td className="p-4 font-mono text-sm">{new Date(game.played_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {games.length === 0 && <p className="p-4 text-center font-mono">No games played yet.</p>}
      </div>
      
      <div className="text-center mt-8">
        <Link to="/" className="button-base hard-shadow">
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit = '' }: { title: string; value?: number; unit?: string }) => (
  <div className="bg-white p-4 border-2 border-black hard-shadow">
    <p className="text-sm text-gray-500 font-mono">{title}</p>
    <p className="text-3xl font-bold">
      {value !== undefined ? `${value}${unit}` : '...'}
    </p>
  </div>
);

export default Profile;
