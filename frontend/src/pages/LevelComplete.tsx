import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Operator } from '../types/game';
import { SplitFlapCountdown } from '../components/SplitFlapCountdown';
import { levelsAPI } from '../api/client';

interface LevelCompleteProps {
  operator: Operator | null;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({ operator }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasNextLevel, setHasNextLevel] = useState<boolean | null>(null);

  const gameData = location.state || {
    level: 1,
    wpm: 0,
    accuracy: 0,
    score: 0,
  };

  // Dynamically check if the next level exists in the system via API
  useEffect(() => {
    const checkNextLevel = async () => {
      try {
        await levelsAPI.getInfo(gameData.level + 1);
        setHasNextLevel(true);
      } catch {
        setHasNextLevel(false);
      }
    };

    checkNextLevel();
  }, [gameData.level]);

  const handleNextLevel = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate('/game');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasNextLevel) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextLevel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasNextLevel]);

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-5xl font-bold mb-2">HOT KEYS</h1>
          <p className="text-xl font-mono text-gray-700">SECTOR {gameData.level} COMPLETE</p>
        </div>

        {/* Split Flap Countdown (if next level exists) */}
        {hasNextLevel && (
          <div className="mb-8 animate-fade-in">
            <SplitFlapCountdown
              seconds={countdown}
              label={`ENGAGING SECTOR ${gameData.level + 1} IN`}
            />
          </div>
        )}

        {/* Score Card */}
        <div className="border-hard border-2 bg-white hard-shadow-lg p-8 sm:p-12 mb-8 animate-slide-up">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Level Info */}
            <div className="border-r-2 border-hard pr-4 sm:pr-8">
              <div className="font-mono text-xs font-bold text-gray-600 mb-2">LEVEL COMPLETED</div>
              <div className="text-5xl font-bold font-mono">SECTOR {gameData.level}</div>
            </div>

            {/* Score */}
            <div className="pl-4 sm:pl-8">
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
                <div className="font-mono text-xs font-bold text-gray-600 mb-2">CURRENT LEVEL</div>
                <div className="text-3xl font-bold font-mono">L{gameData.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual progression indicator */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`
                  h-20 border-hard border-2 flex items-center justify-center font-mono font-bold text-xl
                  ${
                    level <= gameData.level
                      ? 'bg-text text-paper'
                      : 'bg-paper text-text'
                  }
                  ${level === gameData.level ? 'hard-shadow-lg scale-105' : ''}
                  transition-all duration-300
                `}
              >
                {level <= gameData.level ? '✓ SECTOR ' + level : 'SECTOR ' + level}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {hasNextLevel ? (
            <button
              onClick={handleNextLevel}
              disabled={loading}
              className="w-full button-base text-lg py-4 hard-shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? 'INITIALIZING...' : `▶ ENGAGE SECTOR ${gameData.level + 1} NOW`}
            </button>
          ) : (
            <button
              onClick={handleBackHome}
              className="w-full button-base text-lg py-4 hard-shadow-lg"
            >
              🏆 ALL SECTORS UNLOCKED - MISSION COMPLETE
            </button>
          )}

          <button
            onClick={handleBackHome}
            className="w-full button-outline text-lg py-4 font-mono"
          >
            ← BACK TO TERMINAL
          </button>
        </div>

        {/* Rankings preview */}
        {operator && (
          <div className="mt-8 border-hard border-2 bg-gray-50 p-6 font-mono text-xs">
            <h3 className="font-bold mb-3 uppercase tracking-wider">OPERATOR DOSSIER</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>Callsign: <span className="font-bold">{operator.callsign}</span></div>
              <div>Current Level: <span className="font-bold">L{operator.current_level}</span></div>
              <div>Score: <span className="font-bold">{operator.total_score.toLocaleString()}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
