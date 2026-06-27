-- Create operators table (local players)
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  callsign VARCHAR(50) UNIQUE NOT NULL,
  passcode_hash VARCHAR(255) NOT NULL,
  total_score INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  rank_position INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create games table (game sessions)
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  score INTEGER NOT NULL,
  played_at TIMESTAMP DEFAULT NOW()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  row_number() OVER (ORDER BY SUM(games.score) DESC) as rank,
  operators.id,
  operators.callsign,
  operators.current_level,
  SUM(games.score) as total_score,
  COUNT(games.id) as games_played,
  ROUND(AVG(games.accuracy)::numeric, 2) as avg_accuracy,
  MAX(games.wpm) as best_wpm
FROM operators
LEFT JOIN games ON operators.id = games.operator_id
GROUP BY operators.id, operators.callsign, operators.current_level
ORDER BY total_score DESC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_operator_id ON games(operator_id);
CREATE INDEX IF NOT EXISTS idx_games_level ON games(level);
CREATE INDEX IF NOT EXISTS idx_operators_callsign ON operators(callsign);

-- Seed some demo data
INSERT INTO operators (callsign, passcode_hash, total_score, current_level) 
VALUES ('VOID_WALKER', '$2a$10$abcdefghijklmnopqrst.uvwxyz123456789012345678901234567', 1450290, 5)
ON CONFLICT (callsign) DO NOTHING;

INSERT INTO operators (callsign, passcode_hash, total_score, current_level)
VALUES ('GHOST_IN_SHELL', '$2a$10$abcdefghijklmnopqrst.uvwxyz123456789012345678901234567', 1420100, 4)
ON CONFLICT (callsign) DO NOTHING;

INSERT INTO operators (callsign, passcode_hash, total_score, current_level)
VALUES ('SYNTAX_ERROR', '$2a$10$abcdefghijklmnopqrst.uvwxyz123456789012345678901234567', 1380500, 4)
ON CONFLICT (callsign) DO NOTHING;

INSERT INTO operators (callsign, passcode_hash, total_score, current_level)
VALUES ('NULL_PTR', '$2a$10$abcdefghijklmnopqrst.uvwxyz123456789012345678901234567', 835900, 2)
ON CONFLICT (callsign) DO NOTHING;
