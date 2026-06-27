import { Router, Request, Response } from 'express';
import { query } from '../database/client';
import { LeaderboardEntry, ApiResponse } from '../types';

const router = Router();

// Get global leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const result = await query(
      `SELECT rank, id, callsign, current_level, total_score, games_played, avg_accuracy, best_wpm 
       FROM leaderboard 
       LIMIT $1 OFFSET $2`,
      [limitNum, offset]
    );

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM operators');
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      data: {
        entries: result.rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
    } as ApiResponse<null>);
  }
});

// Get operator's rank
router.get('/rank/:operator_id', async (req: Request, res: Response) => {
  try {
    const { operator_id } = req.params;

    const result = await query(
      `SELECT rank, callsign, total_score, games_played, avg_accuracy, best_wpm 
       FROM leaderboard 
       WHERE id = $1`,
      [operator_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found in leaderboard',
      } as ApiResponse<null>);
    }

    return res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<LeaderboardEntry>);
  } catch (error) {
    console.error('Error fetching operator rank:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch operator rank',
    } as ApiResponse<null>);
  }
});

export default router;
