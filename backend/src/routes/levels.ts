import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import pool from '../database/client';

const router = Router();

// Get level data (word, difficulty, time limit)
router.get('/:level', async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level number',
      } as ApiResponse<null>);
    }

    // Query level info and level words from PostgreSQL
    const levelRes = await pool.query(
      'SELECT number, name, difficulty, time_limit FROM levels WHERE number = $1',
      [levelNum]
    );

    if (levelRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Level not found',
      } as ApiResponse<null>);
    }

    const levelData = levelRes.rows[0];

    const wordsRes = await pool.query(
      'SELECT word FROM level_words WHERE level_number = $1',
      [levelNum]
    );

    if (wordsRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No words found for this level',
      } as ApiResponse<null>);
    }

    const words = wordsRes.rows.map((row: { word: string }) => row.word);
    const randomWord = words[Math.floor(Math.random() * words.length)];

    return res.json({
      success: true,
      data: {
        level: levelData.number,
        word: randomWord,
        difficulty: levelData.difficulty,
        timeLimit: levelData.time_limit,
      },
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching level data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch level data',
    } as ApiResponse<null>);
  }
});

// Get level metadata
router.get('/:level/info', async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level',
      } as ApiResponse<null>);
    }

    const levelRes = await pool.query(
      'SELECT name, description, difficulty, min_accuracy as "minAccuracy", time_limit as "timeLimit" FROM levels WHERE number = $1',
      [levelNum]
    );

    if (levelRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Level not found',
      } as ApiResponse<null>);
    }

    return res.json({
      success: true,
      data: levelRes.rows[0],
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching level info:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch level info',
    } as ApiResponse<null>);
  }
});

export default router;
