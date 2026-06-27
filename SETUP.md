# HOT KEYS - Quick Start Guide

## 🚀 Fastest Way to Run

### Using Docker Compose (Recommended - One Command)

```bash
cd /vercel/share/v0-project
docker-compose up --build
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000
- **Database**: localhost:5432

This starts:
- ✅ PostgreSQL database (auto-initialized with seed data)
- ✅ Express.js API backend
- ✅ React Vite frontend

### Local Development (Without Docker)

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Ensure PostgreSQL is running locally on port 5432
# With default credentials: user=hotkeys_user, password=hotkeys_password

# Start dev server
npm run dev
```

The API will be available at `http://localhost:5000`

#### Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📋 What You Get

### Screens Implemented

1. **Onboarding** - Create operator identity with callsign + passcode
2. **Home** - Landing page with game instructions
3. **Game** - Core typing challenge with countdown, word display, keyboard visualizer
4. **Level Complete** - Results screen with progression animation
5. **Leaderboard** - Global rankings with pagination and search

### Features

✅ **Real-time Game Mechanics**
- 5-second countdown timer
- Live WPM calculation
- Accuracy tracking
- Word highlighting (correct/error states)
- Interactive keyboard visualization

✅ **User System**
- Local operator identities
- Passcode-protected accounts
- Persistent profile data

✅ **Leaderboard**
- Global rankings
- Pagination support
- Personal rank tracking
- Performance aggregation

✅ **Design System**
- Brutalist aesthetic (hard shadows, sharp corners)
- Achromatic palette (white, grey, black)
- Grid background
- Material typography

## 🎮 How to Play

1. **Open the app** → http://localhost:5173
2. **Create Operator** → Enter callsign + passcode
3. **Start Game** → Click "START GAME"
4. **Wait for Countdown** → 5... 4... 3... 2... 1... GO!
5. **Type the Word** → Appears on screen, type it as fast as possible
6. **See Results** → WPM, accuracy, score
7. **Progress to Next Level** → Or return to home

## 🏗️ Architecture Overview

```
Frontend (React + Vite)
├── Pages (Onboarding, Home, Game, LevelComplete, Leaderboard)
├── Components (Countdown, WordDisplay, KeyboardVisualizer, GameStats)
├── Custom Hooks (useGameState)
└── Styling (Tailwind CSS + Custom Design System)
    │
    ↓ (axios)
    
Backend (Express + TypeScript)
├── REST API Routes
├── PostgreSQL Database
├── Game Logic
└── Leaderboard Aggregation
    │
    ↓
    
Database (PostgreSQL)
├── Operators Table
├── Games Table
└── Leaderboard View
```

## 📊 API Endpoints

### Operators
- `POST /api/operators` - Create new operator
- `GET /api/operators/:id` - Get operator profile
- `POST /api/operators/:id/verify` - Verify passcode

### Games
- `POST /api/games` - Submit game result
- `GET /api/games/operator/:id` - Get game history

### Leaderboard
- `GET /api/leaderboard?page=1&limit=50` - Get rankings
- `GET /api/leaderboard/rank/:id` - Get operator's rank

### Levels
- `GET /api/levels/:level` - Get random word
- `GET /api/levels/:level/info` - Get level info

## 🛠️ Development Commands

### Backend
```bash
cd backend

npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run typecheck    # Check types only
npm start            # Run compiled code
```

### Frontend
```bash
cd frontend

pnpm dev             # Start dev server
pnpm build           # Build for production
pnpm preview         # Preview production build
pnpm type-check      # Check types only
```

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port
lsof -i :5173        # Find process on port 5173
kill -9 <PID>        # Kill it
```

### "Database connection refused"
```bash
# Check PostgreSQL is running
docker ps            # If using Docker
psql -U hotkeys_user # If local

# Or use Docker Compose
docker-compose logs postgres
```

### "API not found" errors
- Check `VITE_API_URL` in frontend `.env` points to backend
- Ensure backend is running: `curl http://localhost:5000/health`

### Frontend stuck on "Initializing..."
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls

## 📁 Key Files

- `docker-compose.yml` - Complete stack orchestration
- `backend/src/database/init.sql` - Schema + seed data
- `backend/src/routes/` - API endpoints
- `frontend/src/pages/` - Full-page screens
- `frontend/src/components/` - Reusable UI components
- `frontend/src/hooks/useGameState.ts` - Game logic
- `tailwind.config.js` - Design system configuration

## 🎨 Customization

### Change Level Words
Edit `backend/src/routes/levels.ts` → `levelWords` object

### Modify Scoring Formula
Edit `frontend/src/hooks/useGameState.ts` → `calculateScore()`

### Adjust Design Colors
Edit `frontend/tailwind.config.js` → `theme.extend.colors`

### Change Time Limits
Edit `backend/src/routes/levels.ts` → `timeLimit` values

## 🚢 Deployment

### Deploy to Vercel

```bash
# Frontend (Vite)
vercel deploy --prod

# Backend (Node.js)
vercel deploy --prod --cwd backend
```

### Deploy to Cloud Providers

**AWS/GCP/Azure:**
- Push Docker images to container registry
- Use managed PostgreSQL (RDS/Cloud SQL/etc)
- Deploy containers to Kubernetes/App Engine/etc

## 📝 Notes

- Demo data is seeded on first database initialization
- Passcodes are hashed with bcryptjs (10 rounds)
- All game data is persistent in PostgreSQL
- No external API dependencies (standalone stack)
- Design matches provided Figma mockups exactly

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Manual](https://www.postgresql.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

---

**Ready to play? Start typing!** ⚡
