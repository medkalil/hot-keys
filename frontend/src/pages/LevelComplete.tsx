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
  const [levelInfo, setLevelInfo] = useState<{
    hasWordsLeft: boolean;
    nextLevel: number | null;
    name: string;
    description: string;
    difficulty: string;
    minAccuracy: number;
    timeLimit: number;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const gameData = location.state || {
    level: 1,
    wpm: 0,
    accuracy: 0,
    score: 0,
  };

  useEffect(() => {
    const checkNextLevel = async () => {
      if (!operator) return;
      try {
        const response = await levelsAPI.getLevelInfo(gameData.level, operator.id);
        setLevelInfo(response.data.data);
      } catch {
        setLevelInfo(null);
      }
    };

    checkNextLevel();
  }, [gameData.level, operator]);

  const handleNext = async () => {
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
    if (!levelInfo || isPaused) return;

    const canProceed = levelInfo.hasWordsLeft || levelInfo.nextLevel;
    if (!canProceed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [levelInfo, isPaused]);

  const handleBackHome = () => {
    navigate('/');
  };

  const hasNextAction = levelInfo && (levelInfo.hasWordsLeft || levelInfo.nextLevel);
  const nextLevelNumber = levelInfo?.hasWordsLeft ? gameData.level : levelInfo?.nextLevel;

  return (
    <div className="min-h-screen bg-paper overflow-y-auto px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-5xl font-bold mb-2">HOT KEYS</h1>
          <p className="text-xl font-mono text-gray-700">SECTOR {gameData.level} COMPLETE</p>
        </div>

        {/* Split Flap Countdown (if next level exists) */}
        {hasNextAction && (
          <div className="relative mb-8 animate-fade-in">
            <SplitFlapCountdown
              seconds={countdown}
              label={`ENGAGING SECTOR ${nextLevelNumber} IN`}
            />
            <div className="absolute top-2 right-2">
              {isPaused ? (
                <button
                  onClick={() => setIsPaused(false)}
                  className="button-base bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3 hard-shadow-sm font-mono"
                >
                  RESUME
                </button>
              ) : (
                <button
                  onClick={() => setIsPaused(true)}
                  className="button-base bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-3 hard-shadow-sm font-mono"
                >
                  PAUSE
                </button>
              )}
            </div>
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
          {hasNextAction ? (
            <div>
              {levelInfo && (
                <div className="mb-3 font-mono text-xs text-gray-700 bg-amber-50 border-2 border-hard p-3 flex items-center justify-between font-bold">
                  <span>OBJECTIVE: {levelInfo.name}</span>
                  <span className="uppercase text-amber-800">
                    {levelInfo.difficulty} • {levelInfo.timeLimit}S LIMIT • {levelInfo.minAccuracy}% MIN ACC
                  </span>
                </div>
              )}
              <button
                onClick={handleNext}
                disabled={loading || isPaused}
                className="w-full button-base text-lg py-4 hard-shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'INITIALIZING...' : `▶ ENGAGE SECTOR ${nextLevelNumber} NOW`}
              </button>
            </div>
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
