import React, { useMemo } from 'react';

interface GameStatsProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  maxTime: number;
  level: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  wpm,
  accuracy,
  elapsedTime,
  maxTime,
  level,
}) => {
  const timeRemaining = useMemo(() => {
    return Math.max(0, maxTime - elapsedTime);
  }, [elapsedTime, maxTime]);

  const timeDisplay = useMemo(() => {
    const totalSeconds = Math.ceil(timeRemaining);
    return totalSeconds;
  }, [timeRemaining]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-paper border-b-2 border-hard">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">HOT KEYS</h1>
          <div className="border-l-2 border-hard pl-4 font-mono text-sm font-bold">
            <div>LEVEL {level}</div>
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
