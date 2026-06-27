import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query } from '../database/client';
import { Operator, CreateOperatorRequest, ApiResponse } from '../types';

const router = Router();

// Create new operator
router.post('/', async (req: Request, res: Response) => {
  try {
    const { callsign, passcode } = req.body as CreateOperatorRequest;

    if (!callsign || !passcode) {
      return res.status(400).json({
        success: false,
        error: 'Callsign and passcode required',
      } as ApiResponse<null>);
    }

    if (passcode.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Passcode must be at least 8 characters',
      } as ApiResponse<null>);
    }

    // Check if callsign already exists
    const existingCheck = await query(
      'SELECT id FROM operators WHERE callsign = $1',
      [callsign]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Callsign already exists',
      } as ApiResponse<null>);
    }

    // Hash passcode
    const passcode_hash = await bcrypt.hash(passcode, 10);
    const id = uuidv4();

    // Insert operator
    await query(
      `INSERT INTO operators (id, callsign, passcode_hash, total_score, current_level, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [id, callsign, passcode_hash, 0, 1]
    );

    const result = await query(
      'SELECT id, callsign, total_score, current_level FROM operators WHERE id = $1',
      [id]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Partial<Operator>>);
  } catch (error) {
    console.error('Error creating operator:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create operator',
    } as ApiResponse<null>);
  }
});

// Get operator by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, callsign, total_score, current_level, created_at 
       FROM operators WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      } as ApiResponse<null>);
    }

    return res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Partial<Operator>>);
  } catch (error) {
    console.error('Error fetching operator:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch operator',
    } as ApiResponse<null>);
  }
});

// Verify operator passcode (for login)
router.post('/:id/verify', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { passcode } = req.body as { passcode: string };

    if (!passcode) {
      return res.status(400).json({
        success: false,
        error: 'Passcode required',
      } as ApiResponse<null>);
    }

    const result = await query(
      'SELECT id, passcode_hash FROM operators WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      } as ApiResponse<null>);
    }

    const isValid = await bcrypt.compare(passcode, result.rows[0].passcode_hash);

    return res.json({
      success: isValid,
      data: isValid ? { verified: true } : undefined,
      error: isValid ? undefined : 'Invalid passcode',
    } as ApiResponse<{ verified: boolean } | null>);
  } catch (error) {
    console.error('Error verifying passcode:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
    } as ApiResponse<null>);
  }
});

export default router;
