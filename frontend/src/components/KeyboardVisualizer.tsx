import React, { useEffect, useState } from 'react';

interface KeyboardVisualizerProps {
  userInput: string;
  word: string;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  // userInput,
  // word,
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setPressedKeys((prev) => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyStatus = (key: string) => {
    if (pressedKeys.has(key)) {
      return 'pressed';
    }
    return 'default';
  };

  const KeyButton = ({ letter }: { letter: string }) => (
    <button
      className={`
        w-10 h-10 border-hard font-mono font-bold text-xs
        transition-all duration-75
        ${
          getKeyStatus(letter) === 'pressed'
            ? 'bg-text text-paper hard-shadow'
            : 'bg-paper hard-shadow text-text'
        }
      `}
      disabled
    >
      {letter}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      {KEYBOARD_ROWS.map((row: string[], rowIndex: number) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((key: string) => (
            <KeyButton key={key} letter={key} />
          ))}
        </div>
      ))}
      <div className="w-96 mt-2">
        <button
          className="w-full h-10 border-hard font-mono font-bold text-xs bg-paper hard-shadow text-text"
          disabled
        >
          SPACE
        </button>
      </div>
    </div>
  );
};
