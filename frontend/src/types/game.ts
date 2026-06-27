export interface Operator {
  id: string;
  callsign: string;
  total_score: number;
  current_level: number;
  created_at: string;
}

export interface OperatorResponse {
  data: Operator;
  success: boolean;
}

export interface GameResult {
  operator_id: string;
  level: number;
  wpm: number;
  accuracy: number;
  score: number;
}

export interface Game {
  id: string;
  operator_id: string;
  level: number;
  wpm: number;
  accuracy: number;
  score: number;
  played_at: string;
}

export interface GamesResponse {
  data: Game[];
  success: boolean;
}

export interface OperatorStats {
  total_score: number;
  current_level: number;
  games_played: number;
  avg_accuracy: number;
  best_wpm: number;
}

export interface OperatorStatsResponse {
  data: OperatorStats;
  success: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  callsign: string;
  current_level: number;
  total_score: number;
  games_played: number;
  avg_accuracy: number;
  best_wpm: number;
}

export interface GameState {
  currentLevel: number;
  gameStarted: boolean;
  countdownActive: boolean;
  countdown: number;
  currentWord: string;
  userInput: string;
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  maxTime: number;
  isCorrect: boolean;
  gameComplete: boolean;
  score: number;
  operatorId: string | null;
}

export interface LevelInfo {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  minAccuracy: number;
  timeLimit: number;
}
