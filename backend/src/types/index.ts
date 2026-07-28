export interface Operator {
  id: string;
  callsign: string;
  passcode_hash: string;
  total_score: number;
  current_level: number;
  rank_position: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Game {
  id: string;
  operator_id: string;
  level: number;
  wpm: number;
  accuracy: number;
  score: number;
  played_at: Date;
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

export interface CreateOperatorRequest {
  callsign: string;
  passcode: string;
}

export interface SubmitGameRequest {
  operator_id: string;
  level: number;
  wpm: number;
  accuracy: number;
  score: number;
  word_id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
