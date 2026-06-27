import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types/game';

const INITIAL_STATE: GameState = {
  currentLevel: 1,
  gameStarted: false,
  countdownActive: false,
  countdown: 5,
  currentWord: '',
  userInput: '',
  wpm: 0,
  accuracy: 0,
  elapsedTime: 0,
  maxTime: 60,
  isCorrect: false,
  gameComplete: false,
  score: 0,
  operatorId: null,
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const timerRef = useRef<number>();
  const countdownRef = useRef<number>();

  // Start countdown
  const startCountdown = useCallback(() => {
    setState((prev) => ({
      ...prev,
      countdownActive: true,
      countdown: 5,
    }));

    let count = 5;
    countdownRef.current = setInterval(() => {
      count--;
      setState((prev) => ({
        ...prev,
        countdown: count,
      }));

      if (count === 0) {
        clearInterval(countdownRef.current);
        setState((prev) => ({
          ...prev,
          countdownActive: false,
          gameStarted: true,
          elapsedTime: 0,
        }));
      }
    }, 1000);
  }, []);

  // Start game timer
  useEffect(() => {
    if (state.gameStarted && !state.gameComplete) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.elapsedTime >= prev.maxTime) {
            clearInterval(timerRef.current);
            return {
              ...prev,
              gameComplete: true,
              elapsedTime: prev.maxTime,
            };
          }
          return {
            ...prev,
            elapsedTime: prev.elapsedTime + 0.1,
          };
        });
      }, 100);
    }

    return () => clearInterval(timerRef.current);
  }, [state.gameStarted, state.gameComplete]);

  // Update WPM calculation
  const updateWPM = useCallback((input: string, targetWord: string) => {
    if (state.elapsedTime === 0) return;
    
    const words = input.length / 5;
    const minutes = state.elapsedTime / 60;
    const wpm = Math.max(0, Math.round(words / minutes));
    
    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < Math.min(input.length, targetWord.length); i++) {
      if (input[i] === targetWord[i]) correct++;
    }
    const accuracy = targetWord.length > 0 
      ? Math.round((correct / targetWord.length) * 100)
      : 0;

    setState((prev) => ({
      ...prev,
      wpm,
      accuracy,
      isCorrect: input.trim() === targetWord.trim(),
    }));
  }, [state.elapsedTime]);

  // Set current word
  const setCurrentWord = useCallback((word: string) => {
    setState((prev) => ({
      ...prev,
      currentWord: word,
      userInput: '',
      isCorrect: false,
    }));
  }, []);

  // Set user input
  const setUserInput = useCallback((input: string) => {
    setState((prev) => ({
      ...prev,
      userInput: input,
    }));
    updateWPM(input, state.currentWord);
  }, [state.currentWord, updateWPM]);

  // Calculate score
  const calculateScore = useCallback(() => {
    const scoreValue = Math.round(
      (state.wpm * state.accuracy) / 100 * (2 - (state.currentLevel - 1) * 0.2)
    );
    setState((prev) => ({
      ...prev,
      score: scoreValue,
    }));
    return scoreValue;
  }, [state.wpm, state.accuracy, state.currentLevel]);

  // Level up
  const levelUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentLevel: Math.min(prev.currentLevel + 1, 3),
      gameStarted: false,
      gameComplete: false,
      countdown: 5,
      countdownActive: false,
      currentWord: '',
      userInput: '',
      wpm: 0,
      accuracy: 0,
      elapsedTime: 0,
      maxTime: 60 - (prev.currentLevel) * 10,
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    startCountdown,
    setCurrentWord,
    setUserInput,
    calculateScore,
    levelUp,
    resetGame,
    updateWPM,
  };
};
