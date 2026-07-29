import React, { useEffect } from 'react';

interface LevelUpAnimationProps {
  fromLevel: number;
  toLevel: number;
  onComplete: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ fromLevel, toLevel, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000); // Animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-paper flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold font-mono mb-8">LEVEL UP!</h2>
        <div className="relative h-24 border-b-4 border-dashed border-text">
          {/* Player */}
          <div className="absolute bottom-0 w-10 h-10 bg-text animate-run"></div>
          
          {/* Level Markers */}
          <div className="absolute bottom-4 left-8 font-mono text-lg">LVL {fromLevel}</div>
          <div className="absolute bottom-4 right-8 font-mono text-lg">LVL {toLevel}</div>
        </div>
        <p className="mt-8 font-mono text-gray-600 animate-pulse">Promoting to next sector...</p>
      </div>

      <style>{`
        @keyframes run {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw - 100px)); }
        }
        .animate-run {
          animation: run 3s ease-in-out 1s forwards;
        }
      `}</style>
    </div>
  );
};
