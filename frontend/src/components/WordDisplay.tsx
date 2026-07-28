import React, { useEffect, useState } from 'react';

interface WordDisplayProps {
  word: string;
  userInput: string;
  isError: boolean;
  isGameStarted: boolean;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  userInput,
  isError,
  isGameStarted,
}) => {
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (isError) {
      // Re-trigger shake on every keystroke while an error exists
      setShakeKey((prev) => prev + 1);
    } else {
      setShakeKey(0);
    }
  }, [userInput, word, isError]);

  const renderWord = () => {
    return word.split('').map((char, index) => {
      const inputChar = userInput[index];
      let charClass = 'text-gray-400';

      if (index < userInput.length) {
        if (inputChar === char) {
          charClass = 'text-text font-bold';
        } else {
          charClass = 'text-red-500 font-bold underline';
        }
      } else if (index === userInput.length) {
        charClass = 'text-text font-bold border-b-2 border-text animate-pulse';
      }

      return (
        <span key={index} className={charClass}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      key={isError ? shakeKey : 'no-shake'}
      className={`${isError ? 'animate-shake' : ''} transition-all`}
    >
      <div className="text-center py-16">
        <div className="text-6xl font-mono font-bold tracking-wider break-words">
          {isGameStarted ? renderWord() : <span className="text-gray-300">{word}</span>}
        </div>
      </div>
    </div>
  );
};
