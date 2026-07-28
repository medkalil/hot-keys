import React, { useMemo } from 'react';

interface GameStatsProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  maxTime: number;
  level: number;
  difficulty?: string;
}

export const GameStats: React.FC<GameStatsProps> = ({
  wpm,
  accuracy,
  elapsedTime,
  maxTime,
  level,
  difficulty,
}) => {
  const timeRemaining = useMemo(() => {
    return Math.max(0, maxTime - elapsedTime);
  }, [elapsedTime, maxTime]);

  const timeDisplay = useMemo(() => {
    const totalSeconds = Math.ceil(timeRemaining);
    return totalSeconds;
  }, [timeRemaining]);

  const difficultyBadgeClass = useMemo(() => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-200 text-green-900 border-hard';
      case 'medium':
        return 'bg-yellow-200 text-yellow-900 border-hard';
      case 'hard':
        return 'bg-red-200 text-red-900 border-hard';
      default:
        return 'bg-gray-200 text-gray-900 border-hard';
    }
  }, [difficulty]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-paper border-b-2 border-hard z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">HOT KEYS</h1>
          <div className="border-l-2 border-hard pl-4 font-mono text-sm font-bold flex items-center gap-3">
            <div>LEVEL {level}</div>
            {difficulty && (
              <span className={`px-2 py-0.5 text-xs border-2 font-mono font-bold uppercase ${difficultyBadgeClass}`}>
                {difficulty}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-8 font-mono">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-600 uppercase">WPM</div>
            <div className="text-2xl font-bold">{wpm}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-600 uppercase">Accuracy</div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-600 uppercase">Time</div>
            <div className="text-2xl font-bold">{timeDisplay}s</div>
          </div>
        </div>
      </div>
    </div>
  );
};
