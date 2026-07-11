import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import levelWordsJson from '../data/levels.json';

const router = Router();

// Level word lists - loaded from external JSON file
const levelWords: { [key: number]: string[] } = {};
for (const [key, value] of Object.entries(levelWordsJson)) {
  levelWords[parseInt(key)] = value;
}


// Get level data
router.get('/:level', async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1 || levelNum > 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level. Valid levels: 1, 2, 3',
      } as ApiResponse<null>);
    }

    const words = levelWords[levelNum];

    if (!words) {
      return res.status(404).json({
        success: false,
        error: 'Level not found',
      } as ApiResponse<null>);
    }

    // Return a random word from the level
    const randomWord = words[Math.floor(Math.random() * words.length)];

    return res.json({
      success: true,
      data: {
        level: levelNum,
        word: randomWord,
        difficulty: levelNum === 1 ? 'Easy' : levelNum === 2 ? 'Medium' : 'Hard',
        timeLimit: 60 - (levelNum - 1) * 10, // 60s for level 1, 50s for level 2, 40s for level 3
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

    if (isNaN(levelNum) || levelNum < 1 || levelNum > 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid level',
      } as ApiResponse<null>);
    }

    const levelInfo = {
      1: {
        name: 'SECTOR ALPHA',
        description: 'Basic typing practice',
        difficulty: 'Easy',
        minAccuracy: 80,
        timeLimit: 60,
      },
      2: {
        name: 'SECTOR BETA',
        description: 'Technical terminology',
        difficulty: 'Medium',
        minAccuracy: 85,
        timeLimit: 50,
      },
      3: {
        name: 'SECTOR GAMMA',
        description: 'Advanced vocabulary',
        difficulty: 'Hard',
        minAccuracy: 90,
        timeLimit: 40,
      },
    };

    return res.json({
      success: true,
      data: levelInfo[levelNum as keyof typeof levelInfo],
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
