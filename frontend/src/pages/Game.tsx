import React, { useEffect, useRef, useState } from 'react';
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
  onGameComplete?: () => void;
}

export const Game: React.FC<GameProps> = ({ operator, onGameComplete }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const wordLoadedRef = useRef(false);
  
  const [difficulty, setDifficulty] = useState<string>('');
  const [wordId, setWordId] = useState<number | null>(null);

  const {
    state,
    startCountdown,
    setCurrentWord,
    setUserInput,
    calculateScore,
    resetGame,
    setMaxTime,
  } = useGameState(operator?.current_level || 1);

  // Load initial word & level metadata
  useEffect(() => {
    const loadWord = async () => {
      if (wordLoadedRef.current || !operator) return;
      wordLoadedRef.current = true;

      try {
        const response = await levelsAPI.get(state.currentLevel, operator.id);
        const { word, word_id, difficulty, timeLimit } = response.data.data;
        setCurrentWord(word);
        setWordId(word_id);
        if (difficulty) setDifficulty(difficulty);
        if (timeLimit) setMaxTime(timeLimit);
      } catch (error) {
        console.error('Failed to load word:', error);
        // Handle case where all words are played
        if ((error as any).response?.data?.error === 'All words for this level have been played') {
          // You might want to navigate to a different screen or show a message
          navigate('/level-complete', { state: { ...state, allWordsPlayed: true } });
        }
      }
    };

    loadWord();
  }, [state.currentLevel, setCurrentWord, setMaxTime, operator, navigate]);

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
      if (operator && wordId) {
        await gamesAPI.submit({
          operator_id: operator.id,
          level: state.currentLevel,
          wpm: state.wpm,
          accuracy: state.accuracy,
          score,
          word_id: wordId,
        });
        
        if (onGameComplete) {
          onGameComplete();
        }
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
        difficulty={difficulty}
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
                isError={state.userInput.length > 0 && !state.currentWord.startsWith(state.userInput)}
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
