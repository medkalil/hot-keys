import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { operatorsAPI } from './api/client';
import { Operator } from './types/game';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { Game } from './pages/Game';
import { LevelComplete } from './pages/LevelComplete';
import { Leaderboard } from './pages/Leaderboard';

export default function App() {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperator();
  }, []);

  const loadOperator = async () => {
    const operatorId = localStorage.getItem('operatorId');
    if (operatorId) {
      try {
        const response = await operatorsAPI.get(operatorId);
        setOperator(response.data.data);
      } catch (error) {
        console.error('Failed to load operator:', error);
        localStorage.removeItem('operatorId');
      }
    }
    setLoading(false);
  };

  const handleOperatorCreated = (newOperator: Operator) => {
    setOperator(newOperator);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">HOT KEYS</h1>
          <p className="font-mono text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home operator={operator} />} />
        <Route
          path="/onboarding"
          element={<Onboarding onOperatorCreated={handleOperatorCreated} />}
        />
        <Route
          path="/game"
          element={<Game operator={operator} />}
        />
        <Route
          path="/level-complete"
          element={<LevelComplete operator={operator} />}
        />
        <Route path="/leaderboard" element={<Leaderboard operator={operator} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
