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

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
  number INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) NOT NULL,
  min_accuracy INTEGER NOT NULL DEFAULT 80,
  time_limit INTEGER NOT NULL DEFAULT 60
);

-- Create level_words table
CREATE TABLE IF NOT EXISTS level_words (
  id SERIAL PRIMARY KEY,
  level_number INTEGER NOT NULL REFERENCES levels(number) ON DELETE CASCADE,
  word TEXT NOT NULL
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
CREATE INDEX IF NOT EXISTS idx_level_words_level_number ON level_words(level_number);

-- Seed Levels Metadata
INSERT INTO levels (number, name, description, difficulty, min_accuracy, time_limit) VALUES
(1, 'SECTOR ALPHA', 'Basic typing practice', 'Easy', 80, 60),
(2, 'SECTOR BETA', 'Technical terminology', 'Medium', 85, 50),
(3, 'SECTOR GAMMA', 'Advanced vocabulary', 'Hard', 90, 40)
ON CONFLICT (number) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  min_accuracy = EXCLUDED.min_accuracy,
  time_limit = EXCLUDED.time_limit;

-- Seed Level Words
DELETE FROM level_words WHERE level_number IN (1, 2, 3);

INSERT INTO level_words (level_number, word) VALUES
-- Level 1 Words
(1, 'the quick brown fox'),
(1, 'jumps over lazy dog'),
(1, 'fountain of youth'),
(1, 'crystal clear water'),
(1, 'midnight eclipse'),
(1, 'thundering clouds'),
(1, 'silver moonlight'),
(1, 'golden horizon'),
(1, 'electric storm'),
(1, 'frozen tundra'),

-- Level 2 Words
(2, 'algorithmic complexity'),
(2, 'synchronization barrier'),
(2, 'authentication protocol'),
(2, 'computational efficiency'),
(2, 'distributed consensus'),
(2, 'asynchronous iteration'),
(2, 'cryptographic verification'),
(2, 'polymorphic inheritance'),
(2, 'abstraction layer'),
(2, 'optimization paradigm'),

-- Level 3 Words
(3, 'phenomenological transcendence'),
(3, 'serendipitous concatenation'),
(3, 'ineffable quintessence'),
(3, 'ubiquitous obfuscation'),
(3, 'perspicacious sublimation'),
(3, 'ostentatious manifestation'),
(3, 'ephemeral transfiguration'),
(3, 'inscrutable obfuscation'),
(3, 'evanescent luminescence'),
(3, 'mellifluous perambulation');
