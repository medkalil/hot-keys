import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';

const router = Router();

// Level word lists - can be expanded later
const levelWords: { [key: number]: string[] } = {
  1: [
    'the quick brown fox',
    'jumps over lazy dog',
    'fountain of youth',
    'crystal clear water',
    'midnight eclipse',
    'thundering clouds',
    'silver moonlight',
    'golden horizon',
    'electric storm',
    'frozen tundra',
  ],
  2: [
    'algorithmic complexity',
    'synchronization barrier',
    'authentication protocol',
    'computational efficiency',
    'distributed consensus',
    'asynchronous iteration',
    'cryptographic verification',
    'polymorphic inheritance',
    'abstraction layer',
    'optimization paradigm',
  ],
  3: [
    'phenomenological transcendence',
    'serendipitous concatenation',
    'ineffable quintessence',
    'ubiquitous obfuscation',
    'perspicacious sublimation',
    'ostentatious manifestation',
    'ephemeral transfiguration',
    'inscrutable obfuscation',
    'evanescent luminescence',
    'mellifluous perambulation',
  ],
};

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
