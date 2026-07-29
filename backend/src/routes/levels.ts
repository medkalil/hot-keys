import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import pool from '../database/client';

const router = Router();

// Get level data (word, difficulty, time limit)
router.get('/:level', async (req: Request, res: Response) => {
  try { 
    const { level } = req.params;
    const { operator_id } = req.query;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level number',
      } as ApiResponse<null>);
    }

    if (!operator_id) {
      return res.status(400).json({
        success: false,
        error: 'operator_id is required',
      } as ApiResponse<null>);
    }

    // Query level info from PostgreSQL
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

    // Query for a random word that the operator has not played yet
    const wordsRes = await pool.query(
      `SELECT id, word FROM level_words
       WHERE level_number = $1 AND id NOT IN (
         SELECT word_id FROM operator_played_words
         WHERE operator_id = $2 AND level_number = $1
       )
       ORDER BY RANDOM()
       LIMIT 1`,
      [levelNum, operator_id]
    );

    if (wordsRes.rows.length === 0) {
      // This means the player has played all words for this level
      return res.status(404).json({
        success: false,
        error: 'All words for this level have been played',
      } as ApiResponse<null>);
    }

    const randomWord = wordsRes.rows[0];

    return res.json({
      success: true,
      data: {
        level: levelData.number,
        word_id: randomWord.id,
        word: randomWord.word,
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
    const { operator_id } = req.query;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level',
      } as ApiResponse<null>);
    }

    if (!operator_id) {
      return res.status(400).json({
        success: false,
        error: 'operator_id is required',
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

    const levelData = levelRes.rows[0];

    // Check if there are words left for the operator in this level
    const playedWordsRes = await pool.query(
      'SELECT COUNT(*) FROM operator_played_words WHERE operator_id = $1 AND level_number = $2',
      [operator_id, levelNum]
    );
    const playedWordsCount = parseInt(playedWordsRes.rows[0].count);

    const totalWordsRes = await pool.query(
      'SELECT COUNT(*) FROM level_words WHERE level_number = $1',
      [levelNum]
    );
    const totalWordsCount = parseInt(totalWordsRes.rows[0].count);

    const hasWordsLeft = playedWordsCount < totalWordsCount;

    let nextLevel = null;
    if (!hasWordsLeft) {
      const nextLevelRes = await pool.query(
        'SELECT number FROM levels WHERE number > $1 ORDER BY number ASC LIMIT 1',
        [levelNum]
      );
      if (nextLevelRes.rows.length > 0) {
        nextLevel = nextLevelRes.rows[0].number;
      }
    }

    return res.json({
      success: true,
      data: {
        ...levelData,
        hasWordsLeft,
        nextLevel,
      },
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
