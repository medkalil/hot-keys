import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Operator } from '../types/game';

interface LevelCompleteProps {
  operator: Operator | null;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({ operator }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const gameData = location.state || {
    level: 1,
    wpm: 0,
    accuracy: 0,
    score: 0,
  };

  const handleNextLevel = async () => {
    setLoading(true);
    try {
      // Small delay for animation
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate('/game');
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">HOT KEYS</h1>
          <p className="text-xl text-gray-700">SECTOR COMPLETE</p>
        </div>

        {/* Score Card */}
        <div className="border-hard border-2 bg-white hard-shadow-lg p-12 mb-8 animate-slide-up">
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Level Info */}
            <div className="border-r-2 border-hard pr-8">
              <div className="font-mono text-xs font-bold text-gray-600 mb-2">LEVEL COMPLETED</div>
              <div className="text-5xl font-bold font-mono">{gameData.level}</div>
            </div>

            {/* Score */}
            <div className="pl-8">
              <div className="font-mono text-xs font-bold text-gray-600 mb-2">TOTAL SCORE</div>
              <div className="text-5xl font-bold font-mono">{gameData.score.toLocaleString()}</div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="border-t-2 border-hard pt-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-gray-600 mb-2">WPM</div>
                <div className="text-3xl font-bold font-mono">{gameData.wpm}</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-gray-600 mb-2">ACCURACY</div>
                <div className="text-3xl font-bold font-mono">{gameData.accuracy}%</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xs font-bold text-gray-600 mb-2">PROGRESSION</div>
                <div className="text-3xl font-bold font-mono">{gameData.level}/3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual progression indicator */}
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`
                  h-24 border-hard border-2 flex items-center justify-center font-mono font-bold text-2xl
                  ${
                    level <= gameData.level
                      ? 'bg-text text-paper'
                      : 'bg-paper text-text'
                  }
                  ${level === gameData.level ? 'hard-shadow-lg scale-105' : ''}
                  transition-all duration-300
                `}
              >
                {level <= gameData.level ? '✓' : level}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {gameData.level < 3 ? (
            <button
              onClick={handleNextLevel}
              disabled={loading}
              className="w-full button-base text-lg py-4 hard-shadow-lg"
            >
              {loading ? 'LOADING...' : '▶ ENGAGE LEVEL ' + (gameData.level + 1)}
            </button>
          ) : (
            <button
              onClick={handleBackHome}
              className="w-full button-base text-lg py-4 hard-shadow-lg"
            >
              🏆 ALL SECTORS UNLOCKED
            </button>
          )}

          <button
            onClick={handleBackHome}
            className="w-full button-outline text-lg py-4"
          >
            ← BACK TO TERMINAL
          </button>
        </div>

        {/* Rankings preview */}
        {operator && (
          <div className="mt-12 border-hard border-2 bg-gray-50 p-8">
            <h3 className="font-mono text-xs font-bold mb-4">OPERATOR STATUS</h3>
            <div className="font-mono text-sm space-y-2">
              <p>Callsign: <span className="font-bold">{operator.callsign}</span></p>
              <p>Current Level: <span className="font-bold">{operator.current_level}</span></p>
              <p>Total Score: <span className="font-bold">{operator.total_score.toLocaleString()}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
