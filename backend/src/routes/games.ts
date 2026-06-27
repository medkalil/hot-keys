import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/client';
import { Game, SubmitGameRequest, ApiResponse } from '../types';

const router = Router();

// Submit game result
router.post('/', async (req: Request, res: Response) => {
  try {
    const { operator_id, level, wpm, accuracy, score } = req.body as SubmitGameRequest;

    if (!operator_id || !level || wpm === undefined || accuracy === undefined || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: operator_id, level, wpm, accuracy, score',
      } as ApiResponse<null>);
    }

    // Verify operator exists
    const operatorCheck = await query(
      'SELECT id FROM operators WHERE id = $1',
      [operator_id]
    );

    if (operatorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      } as ApiResponse<null>);
    }

    const gameId = uuidv4();

    // Insert game
    await query(
      `INSERT INTO games (id, operator_id, level, wpm, accuracy, score, played_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [gameId, operator_id, level, wpm, accuracy, score]
    );

    // Update operator's total score and level if needed
    await query(
      `UPDATE operators 
       SET total_score = total_score + $1,
           current_level = GREATEST(current_level, $2),
           updated_at = NOW()
       WHERE id = $3`,
      [score, Math.min(level + 1, 10), operator_id]
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
