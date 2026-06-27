import React, { useEffect, useState } from 'react';

interface CountdownProps {
  count: number;
  isActive: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ count, isActive }) => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      return;
    }

    if (count > 0) {
      setDisplayText(count.toString());
    } else {
      setDisplayText('GO');
    }
  }, [count, isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`text-center ${count === 0 ? 'animate-flash' : ''}`}
        style={{
          animation: isActive ? 'fadeIn 0.2s ease-in' : 'fadeOut 0.2s ease-out',
        }}
      >
        <div className="text-9xl font-bold font-mono text-text border-hard hard-shadow-lg p-16">
          {displayText}
        </div>
      </div>
    </div>
  );
};
