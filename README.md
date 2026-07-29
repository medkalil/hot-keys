# HOT KEYS - Typing Speed Game

A brutalist-styled competitive typing speed game with real-time scoring, level progression, and global leaderboards.

## 🎮 Features

- **Operator Identity System**: Create unique callsigns with passcode protection (local authentication)
- **Level-Based Gameplay**: 3 difficulty levels with progressive challenge
- **Real-Time Stats**: Live WPM, accuracy tracking, and scoring calculations
- **Countdown Timer**: 5-second countdown before each level begins
- **Visual Keyboard**: Interactive keyboard display showing pressed keys
- **Global Leaderboard**: Competitive rankings with pagination
- **Brutalist Design**: Hard shadows, sharp borders, minimalist aesthetic with achromatic palette

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- React Router v6 (navigation)
- Tailwind CSS (styling with custom design system)
- Axios (HTTP client)

**Backend:**
- Express.js with TypeScript
- PostgreSQL (database)
- Node.js 20

**Infrastructure:**
- Docker & Docker Compose for containerized development
- PostgreSQL 15 Alpine

### Deployment Architecture

The application is deployed across various cloud platforms:

-   **Frontend (React App):** Hosted on [Vercel](https://vercel.com/). Vercel provides seamless deployment for frontend applications, offering automatic scaling, global CDN, and continuous deployment from Git repositories.
(https://hot-keys-lake.vercel.app).
-   **Backend (Express.js API):** Deployed on [Render](https://render.com/). Render is a unified cloud platform that allows hosting web services, databases, and more. It provides a managed environment for the Node.js Express API.
-   **Database (PostgreSQL):** Utilizes [Neon](https://neon.tech/) for the PostgreSQL database. Neon is a serverless PostgreSQL that separates storage and compute, offering autoscaling, branching, and a generous free tier.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Or locally: Node.js 20+, PostgreSQL 15+

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd /vercel/share/v0-project

# Start all services
docker-compose up --build

# Access the app
Frontend: http://localhost:5173
API: http://localhost:5000
Database UI: http://localhost:8080
Database: localhost:5433
```

For detailed database management commands, see `DB_MANAGEMENT.md`.

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start PostgreSQL locally
# Make sure PostgreSQL is running on localhost:5433

# Run migrations & seed data
npm run typecheck

# Start development server
npm run dev

# API runs on http://localhost:5000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start dev server
pnpm dev

# App runs on http://localhost:5173
```

### Option 3: Hybrid Setup (Local Apps + Docker DB)

This approach is recommended for active development. It runs the database in Docker but keeps the frontend and backend applications running directly on your machine for faster hot-reloading and debugging.

**1. Configure Backend Environment**

Create or update the `.env` file in the `/backend` directory with the following to connect to the Dockerized database:

```ini
# backend/.env
PORT=5000
NODE_ENV=development

# Connect to Docker DB on localhost
DB_HOST=localhost
DB_PORT=5433
DB_USER=hotkeys_user
DB_PASSWORD=hotkeys_password
DB_NAME=hotkeys_db
```

**2. Start the Database**

Run the following command from the project root to start only the PostgreSQL and Adminer services:

```bash
docker-compose up -d postgres adminer
```

**3. Run the Backend**

In a new terminal, navigate to the backend directory and start the development server:

```bash
cd backend
npm install
npm run dev
```

**4. Run the Frontend**

In a third terminal, navigate to the frontend directory and start the development server:

```bash
cd frontend
pnpm install
pnpm dev
```

**Access the services:**
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:5000](http://localhost:5000)
- **Database UI**: [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure

```
hotkeys/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── database/          # PostgreSQL client & schema
│   │   ├── types/             # TypeScript interfaces
│   │   ├── middleware/        # Express middleware
│   │   ├── app.ts             # Express app setup
│   │   └── index.ts           # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── pages/             # Full-page screens
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── api/               # API client
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── DB_MANAGEMENT.md
└── README.md
```

## 🎯 Game Flow

1. **Onboarding**: Create operator identity (callsign + passcode)
2. **Home Screen**: View instructions and start game
3. **Countdown**: 5-second timer before game begins (5→4→3→2→1→GO)
4. **Gameplay**: Type the displayed word accurately and quickly
   - Real-time WPM & accuracy tracking
   - Visual keyboard feedback
   - Automatic submission on correct input
5. **Level Complete**: View results with score, WPM, accuracy
6. **Progression**: Unlock next level or return to home
7. **Leaderboard**: Check global rankings and your position

## 📊 Game Mechanics

### Scoring Formula
```
Score = (WPM × Accuracy%) × Level Difficulty Multiplier
```

### Level Structure
- **Level 1 - Sector Alpha**: Easy words, 60s time limit
- **Level 2 - Sector Beta**: Technical terminology, 50s time limit
- **Level 3 - Sector Gamma**: Advanced vocabulary, 40s time limit

### Metrics
- **WPM** (Words Per Minute): (Character Count ÷ 5) ÷ Time in Minutes
- **Accuracy**: (Correct Characters ÷ Target Length) × 100%

## ➕ Extending the Game: Adding New Levels and Words

The game's levels and words are managed directly within the database schema and seed data. To add new content:

### 1. Add New Levels

To introduce a new level, you need to add an entry to the `levels` table in `backend/src/database/init.sql`.

Locate the `Seed Levels Metadata` section and add a new `INSERT` statement:

```sql
-- Seed Levels Metadata
INSERT INTO levels (number, name, description, difficulty, min_accuracy, time_limit) VALUES
(1, 'SECTOR ALPHA', 'Basic typing practice', 'Easy', 80, 60),
(2, 'SECTOR BETA', 'Technical terminology', 'Medium', 85, 50),
(3, 'SECTOR GAMMA', 'Advanced vocabulary', 'Hard', 90, 40),
(4, 'SECTOR DELTA', 'New challenging words', 'Extreme', 95, 30) -- <--- Add your new level here
ON CONFLICT (number) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  min_accuracy = EXCLUDED.min_accuracy,
  time_limit = EXCLUDED.time_limit;
```

*   **`number`**: A unique integer for your new level (e.g., `4`).
*   **`name`**: A descriptive name for the level (e.g., `'SECTOR DELTA'`).
*   **`description`**: A brief description.
*   **`difficulty`**: A string indicating difficulty (e.g., `'Extreme'`).
*   **`min_accuracy`**: The minimum accuracy percentage required for this level.
*   **`time_limit`**: The time limit in seconds for this level.

### 2. Add New Level Words

After defining your new level, you can add words specifically for it to the `level_words` table in `backend/src/database/init.sql`.

Locate the `Seed Level Words` section and add `INSERT` statements, ensuring you link them to your new level number:

```sql
-- Seed Level Words
DELETE FROM level_words WHERE level_number IN (1, 2, 3); -- Update this to include your new level number if you want to re-seed all words

INSERT INTO level_words (level_number, word) VALUES
-- Level 1 Words
(1, 'the quick brown fox'),
-- ... existing Level 1 words ...

-- Level 2 Words
(2, 'algorithmic complexity'),
-- ... existing Level 2 words ...

-- Level 3 Words
(3, 'phenomenological transcendence'),
-- ... existing Level 3 words ...

-- Level 4 Words (for SECTOR DELTA) <--- Add your new words here
(4, 'quantum entanglement theory'),
(4, 'superposition principle'),
(4, 'cryptographic hash function'),
(4, 'decentralized autonomous organization');
```

*   Ensure the `level_number` matches the `number` of your new level.
*   Add as many words as you like. Each word should be a separate `INSERT` entry.

### 3. Apply Database Changes

After modifying `backend/src/database/init.sql`:

*   **For Docker Compose users:** You will typically need to rebuild and restart your database service to apply these schema changes.
    ```bash
    docker-compose down
    docker-compose up --build
    ```
*   **For local PostgreSQL users:** You would need to manually run the SQL script against your database or use a migration tool if one were set up.

### 4. Frontend Considerations

*   **Level Progression Indicator:** The visual level progression indicator in `frontend/src/pages/LevelComplete.tsx` currently hardcodes `[1, 2, 3]`. If you add more than 3 levels, you might want to update this array dynamically or extend it manually to reflect all available levels.
    ```typescript
    // In frontend/src/pages/LevelComplete.tsx
    {[1, 2, 3, 4].map((level) => ( // Extend this array for more levels
      // ...
    ))}
    ```
    Alternatively, you could fetch the total number of levels from the backend to make this dynamic.

*   **Level-Specific Logic:** If your new levels introduce new game mechanics or require specific frontend handling, you will need to update the frontend logic accordingly.

By following these steps, you can easily expand the content of your HOT KEYS typing game.

### Color Palette
- **Paper**: #F8F8F8 (background)
- **Text**: #1A1A1A (foreground)
- **Border**: #1A1A1A (hard edges)
- **Grid**: #EFEFEF (background pattern)

### Typography
- **Headings**: Hanken Grotesk (bold)
- **Body**: Hanken Grotesk (regular)
- **Monospace**: JetBrains Mono (code & stats)

### Visual Elements
- **Hard Shadows**: `4px 4px 0px rgba(0, 0, 0, 1)`
- **Sharp Corners**: `0px border-radius`
- **Grid Background**: 16px grid pattern
- **Animations**: Subtle fades and slides

## 🔌 API Endpoints

### Operators
- `POST /api/operators` - Create operator
- `GET /api/operators/:id` - Get operator profile
- `POST /api/operators/:id/verify` - Verify passcode

### Games
- `POST /api/games` - Submit game result
- `GET /api/games/operator/:id` - Get game history
- `GET /api/games/operator/:id/stats` - Get operator stats

### Leaderboard
- `GET /api/leaderboard` - Get global rankings
- `GET /api/leaderboard/rank/:id` - Get operator's rank

### Levels
- `GET /api/levels/:level` - Get random word for level
- `GET /api/levels/:level/info` - Get level metadata

## 🛠️ Development

### Building

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
pnpm build
```

### Type Checking

```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
pnpm type-check
```

## 📝 Database Schema

### Operators Table
```sql
CREATE TABLE operators (
  id UUID PRIMARY KEY,
  callsign VARCHAR(50) UNIQUE NOT NULL,
  passcode_hash VARCHAR(255) NOT NULL,
  total_score INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Games Table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  operator_id UUID REFERENCES operators(id),
  level INTEGER,
  wpm INTEGER,
  accuracy DECIMAL(5,2),
  score INTEGER,
  played_at TIMESTAMP DEFAULT NOW()
);
```

### Leaderboard View
```sql
CREATE VIEW leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY SUM(score) DESC) as rank,
  callsign,
  current_level,
  SUM(score) as total_score,
  COUNT(*) as games_played,
  AVG(accuracy) as avg_accuracy
FROM operators
LEFT JOIN games ON operators.id = games.operator_id
GROUP BY operators.id;
```

## 🚨 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `docker-compose logs postgres`
- Check credentials in `.env` match `docker-compose.yml`
- Wait for database health check: `docker-compose logs --follow postgres`

### Frontend API 404 Errors
- Ensure `VITE_API_URL` in `.env` points to backend: `http://localhost:5000`
- Check backend is running: `curl http://localhost:5000/health`
- Clear browser cache and restart dev server

### Port Already in Use
- Frontend (5173): `lsof -i :5173` | `kill -9 <PID>`
- API (5000): `lsof -i :5000` | `kill -9 <PID>`
- Database (5433): `lsof -i :5433` | `kill -9 <PID>`

## 📄 License

MIT

## 🎯 Future Enhancements

- [ ] OAuth social login
- [ ] Seasonal rankings
- [ ] Practice mode with unlimited words
- [ ] Multiplayer real-time racing
- [ ] Custom difficulty settings
- [ ] Replay & statistics tracking
- [ ] Mobile app version
- [ ] Sound effects & haptic feedback
