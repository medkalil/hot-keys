import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Operator } from '../types/game';

interface HomeProps {
  operator: Operator | null;
}

export const Home: React.FC<HomeProps> = ({ operator }) => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (operator) {
      navigate('/game');
    } else {
      navigate('/onboarding');
    }
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center animate-slide-down">
        <h1 className="text-7xl font-bold mb-4">HOT KEYS</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Prepare for the ultimate typing challenge. Speed, precision, and focus are your only allies
          in the grid.
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleStartGame}
        className="button-base text-lg px-8 py-4 mb-16 hard-shadow-lg animate-fade-in"
      >
        ⚡ START GAME
      </button>

      {/* How to Play */}
      <div className="w-full max-w-4xl border-hard border-2 bg-white hard-shadow-lg p-12 mb-8">
        <h2 className="text-2xl font-bold mb-8 uppercase">HOW TO PLAY</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="border-hard border-2 p-6 bg-gray-50">
            <div className="text-4xl mb-4 text-center">⏱️</div>
            <h3 className="text-xl font-bold mb-2">The Countdown</h3>
            <p className="text-sm leading-relaxed">
              Focus your eyes. When the timer hits zero, the grid activates. Every millisecond counts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border-hard border-2 p-6 bg-gray-50">
            <div className="text-4xl mb-4 text-center">⌨️</div>
            <h3 className="text-xl font-bold mb-2">Precision Typing</h3>
            <p className="text-sm leading-relaxed">
              Type the highlighted words flawlessly. <span className="bg-text text-paper px-1">Black</span> means correct,{' '}
              <span className="bg-red-500 text-paper px-1">Red</span> means error.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border-hard border-2 p-6 bg-gray-50">
            <div className="text-4xl mb-4 text-center">🏛️</div>
            <h3 className="text-xl font-bold mb-2">Dominate</h3>
            <p className="text-sm leading-relaxed">
              Maintain your flow state to maximize WPM and climb the global leaderboards.
            </p>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="border-hard border-2 bg-gray-50 p-6">
          <p className="text-sm font-mono">
            <span className="font-bold">PRO TIP:</span> Use <span className="bg-text text-paper px-1">Tab</span> to quickly restart the test.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleLeaderboard}
          className="button-outline px-8 py-3"
        >
          VIEW LEADERBOARD
        </button>
        {operator && (
          <button
            onClick={() => navigate('/profile')}
            className="button-outline px-8 py-3"
          >
            MY PROFILE
          </button>
        )}
      </div>

      {/* Current Operator Info */}
      {operator && (
        <div className="mt-12 text-center font-mono text-sm">
          <p>Logged in as: <span className="font-bold">{operator.callsign}</span></p>
          <p>Level: {operator.current_level} | Score: {operator.total_score.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};
