import React, { useEffect, useState } from 'react';

interface FlipDigitProps {
  digit: string;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ digit }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [prevDigit, setPrevDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPrevDigit(currentDigit);
      setCurrentDigit(digit);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  return (
    <div className="relative w-20 h-28 sm:w-24 sm:h-36 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col items-center justify-center font-sans font-extrabold text-black text-6xl sm:text-7xl select-none perspective-500">
      {/* Middle split line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-900 z-20 shadow-sm" />

      {/* Left Hinge Clip */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-5 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-200 border border-gray-400 rounded-sm z-30 shadow-md" />

      {/* Right Hinge Clip */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 border border-gray-400 rounded-sm z-30 shadow-md" />

      {/* TOP HALF STATIC (Current/New Digit) */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-white rounded-t-lg flex items-end justify-center border-b border-gray-200">
        <span className="translate-y-1/2 leading-none font-black text-black tracking-tighter">
          {currentDigit}
        </span>
      </div>

      {/* BOTTOM HALF STATIC (Old or Current Digit) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-white rounded-b-lg flex items-start justify-center">
        <span className="-translate-y-1/2 leading-none font-black text-black tracking-tighter">
          {isFlipping ? prevDigit : currentDigit}
        </span>
      </div>

      {/* TOP HALF FLIPPING DOWN */}
      {isFlipping && (
        <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-white rounded-t-lg flex items-end justify-center z-10 origin-bottom animate-flip-top">
          <span className="translate-y-1/2 leading-none font-black text-black tracking-tighter">
            {prevDigit}
          </span>
        </div>
      )}

      {/* BOTTOM HALF FLIPPING UP */}
      {isFlipping && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-white rounded-b-lg flex items-start justify-center z-10 origin-top animate-flip-bottom">
          <span className="-translate-y-1/2 leading-none font-black text-black tracking-tighter">
            {currentDigit}
          </span>
        </div>
      )}
    </div>
  );
};

interface SplitFlapCountdownProps {
  seconds: number;
  label?: string;
}

export const SplitFlapCountdown: React.FC<SplitFlapCountdownProps> = ({
  seconds,
  label = 'AUTO ADVANCING IN',
}) => {
  const formattedSeconds = Math.max(0, seconds).toString().padStart(2, '0');
  const tensDigit = formattedSeconds[0];
  const onesDigit = formattedSeconds[1];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-hard hard-shadow-lg rounded-none">
      {label && (
        <div className="font-mono text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-ping" />
          {label}
        </div>
      )}
      <div className="flex items-center gap-4 sm:gap-6">
        <FlipDigit digit={tensDigit} />
        <FlipDigit digit={onesDigit} />
      </div>
      <div className="mt-3 text-xs font-mono text-gray-500">
        PRESS <span className="font-bold text-black border border-black px-1">ENGAGE</span> TO SKIP
      </div>
    </div>
  );
};
