import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/client';
import { Game, SubmitGameRequest, ApiResponse } from '../types';

const router = Router();

// Submit game result
router.post('/', async (req: Request, res: Response) => {
  try {
    const { operator_id, level, wpm, accuracy, score, word_id } = req.body as SubmitGameRequest & { word_id: number };

    if (!operator_id || !level || wpm === undefined || accuracy === undefined || score === undefined || !word_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: operator_id, level, wpm, accuracy, score, word_id',
      } as ApiResponse<null>);
    }

    // Verify operator exists
    const operatorCheck = await query(
      'SELECT id, current_level FROM operators WHERE id = $1',
      [operator_id]
    );

    if (operatorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      } as ApiResponse<null>);
    }

    const operator = operatorCheck.rows[0];
    const gameId = uuidv4();

    // Insert game
    await query(
      `INSERT INTO games (id, operator_id, level, wpm, accuracy, score, played_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [gameId, operator_id, level, wpm, accuracy, score]
    );

    // Mark word as played
    try {
      await query(
        'INSERT INTO operator_played_words (operator_id, word_id, level_number) VALUES ($1, $2, $3)',
        [operator_id, word_id, level]
      );
    } catch (error) {
      // Ignore unique constraint violation if word is already marked as played
      if ((error as any).code !== '23505') {
        throw error;
      }
    }

    // Check for level progression
    const playedWordsCountRes = await query(
      'SELECT COUNT(*) as count FROM operator_played_words WHERE operator_id = $1 AND level_number = $2',
      [operator_id, level]
    );
    const playedWordsCount = parseInt(playedWordsCountRes.rows[0].count, 10);

    const totalWordsCountRes = await query(
      'SELECT COUNT(*) as count FROM level_words WHERE level_number = $1',
      [level]
    );
    const totalWordsCount = parseInt(totalWordsCountRes.rows[0].count, 10);

    const maxLevelRes = await query(
      'SELECT MAX(number) as max_level FROM levels',
      []
    );
    const maxLevel = parseInt(maxLevelRes.rows[0].max_level, 10);

    let newLevel = operator.current_level;
    if (playedWordsCount >= totalWordsCount && operator.current_level === level) {
      newLevel = Math.min(operator.current_level + 1, maxLevel); 
    }

    // Update operator's total score and potentially their level
    await query(
      `UPDATE operators 
       SET total_score = total_score + $1,
           current_level = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [score, newLevel, operator_id]
    );

    const result = await query(
      `SELECT id, operator_id, level, wpm, accuracy, score, played_at FROM games WHERE id = $1`,
      [gameId]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Game>);
  } catch (error) {
    console.error('Error submitting game:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit game',
    } as ApiResponse<null>);
  }
});

// Get operator's game history
router.get('/operator/:operator_id', async (req: Request, res: Response) => {
  try {
    const { operator_id } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const result = await query(
      `SELECT id, operator_id, level, wpm, accuracy, score, played_at FROM games 
       WHERE operator_id = $1 
       ORDER BY played_at DESC 
       LIMIT $2 OFFSET $3`,
      [operator_id, parseInt(limit as string), parseInt(offset as string)]
    );

    return res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<Game[]>);
  } catch (error) {
    console.error('Error fetching game history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch game history',
    } as ApiResponse<null>);
  }
});

// Get operator's stats
router.get('/operator/:operator_id/stats', async (req: Request, res: Response) => {
  try {
    const { operator_id } = req.params;

    const result = await query(
      `SELECT 
        COUNT(id) as total_games,
        ROUND(AVG(wpm)::numeric, 2) as avg_wpm,
        MAX(wpm) as best_wpm,
        ROUND(AVG(accuracy)::numeric, 2) as avg_accuracy,
        SUM(score) as total_score
       FROM games WHERE operator_id = $1`,
      [operator_id]
    );

    return res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch game stats',
    } as ApiResponse<null>);
  }
});

export default router;
