import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { levelsAPI, gamesAPI } from '../api/client';
import { Countdown } from '../components/Countdown';
import { WordDisplay } from '../components/WordDisplay';
import { KeyboardVisualizer } from '../components/KeyboardVisualizer';
import { GameStats } from '../components/GameStats';
import { Operator } from '../types/game';

interface GameProps {
  operator: Operator | null;
  // onGameComplete: (updatedOperator: Operator) => void;
}

export const Game: React.FC<GameProps> = ({ operator }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const wordLoadedRef = useRef(false);
  
  const {
    state,
    startCountdown,
    setCurrentWord,
    setUserInput,
    calculateScore,
    resetGame,
  } = useGameState();

  // Load initial word
  useEffect(() => {
    const loadWord = async () => {
      if (wordLoadedRef.current) return;
      wordLoadedRef.current = true;

      try {
        const response = await levelsAPI.get(state.currentLevel);
        setCurrentWord(response.data.data.word);
      } catch (error) {
        console.error('Failed to load word:', error);
      }
    };

    loadWord();
  }, [state.currentLevel]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-start countdown if operator exists
  useEffect(() => {
    if (operator && !state.countdownActive && !state.gameStarted) {
      startCountdown();
    }
  }, [operator, state.countdownActive, state.gameStarted, startCountdown]);

  // Handle correct word submission
  useEffect(() => {
    if (state.isCorrect && state.gameStarted && state.userInput.trim() === state.currentWord.trim()) {
      handleCorrectSubmission();
    }
  }, [state.isCorrect, state.gameStarted]);

  // Handle game timeout
  useEffect(() => {
    if (state.elapsedTime >= state.maxTime && state.gameStarted) {
      handleGameEnd();
    }
  }, [state.elapsedTime, state.maxTime, state.gameStarted]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.gameStarted || state.gameComplete) {
        if (e.key === 'Tab') {
          e.preventDefault();
          resetGameAndReload();
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        resetGameAndReload();
        return;
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameStarted, state.gameComplete]);

  const handleCorrectSubmission = async () => {
    const score = calculateScore();
    
    try {
      if (operator) {
        await gamesAPI.submit({
          operator_id: operator.id,
          level: state.currentLevel,
          wpm: state.wpm,
          accuracy: state.accuracy,
          score,
        });
      }

      // Navigate to completion screen
      navigate('/level-complete', {
        state: {
          level: state.currentLevel,
          wpm: state.wpm,
          accuracy: state.accuracy,
          score,
        },
      });
    } catch (error) {
      console.error('Failed to submit game:', error);
    }
  };

  const handleGameEnd = () => {
    // Game timeout reached
    handleCorrectSubmission();
  };

  const resetGameAndReload = () => {
    wordLoadedRef.current = false;
    resetGame();
    window.location.reload();
  };

  if (!operator) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Please log in first</h1>
          <button onClick={() => navigate('/onboarding')} className="button-base">
            Create Operator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-16">
      <GameStats
        wpm={state.wpm}
        accuracy={state.accuracy}
        elapsedTime={state.elapsedTime}
        maxTime={state.maxTime}
        level={state.currentLevel}
      />

      <Countdown count={state.countdown} isActive={state.countdownActive} />

      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          {!state.countdownActive && !state.gameStarted && (
            <div className="text-center py-32">
              <p className="text-gray-500 text-lg font-mono">Press any key to start...</p>
            </div>
          )}

          {state.gameStarted && (
            <>
              <WordDisplay
                word={state.currentWord}
                userInput={state.userInput}
                isError={state.userInput.length > 0 && !state.isCorrect && state.userInput.length <= state.currentWord.length}
                isGameStarted={state.gameStarted}
              />

              <KeyboardVisualizer userInput={state.userInput} word={state.currentWord} />
            </>
          )}
        </div>
      </div>

      {/* Hidden input for capturing typing */}
      <input
        ref={inputRef}
        type="text"
        value={state.userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="absolute -left-96 opacity-0 pointer-events-none"
        autoComplete="off"
        spellCheck="false"
        disabled={!state.gameStarted}
      />
    </div>
  );
};
