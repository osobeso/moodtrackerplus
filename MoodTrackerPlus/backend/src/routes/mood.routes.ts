import { Router, Request, Response } from 'express';
import { moodStorageService } from '../services/mood-storage.service';

const router = Router();

/**
 * GET /api/moods - Get all mood entries
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const entries = await moodStorageService.getMoodEntries();
    res.json(entries);
  } catch (error) {
    console.error('Error in GET /api/moods:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

/**
 * GET /api/moods/:id - Get a single mood entry by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entry = await moodStorageService.getMoodEntryById(id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error in GET /api/moods/:id:', error);
    res.status(500).json({ error: 'Failed to fetch mood entry' });
  }
});

/**
 * POST /api/moods - Create a new mood entry
 * Body: { mood: string, emoji: string }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { mood, emoji } = req.body;
    
    if (!mood || !emoji) {
      return res.status(400).json({ error: 'Mood and emoji are required' });
    }
    
    const newEntry = await moodStorageService.saveMoodEntry(mood, emoji);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error in POST /api/moods:', error);
    res.status(500).json({ error: 'Failed to create mood entry' });
  }
});

/**
 * DELETE /api/moods/:id - Delete a mood entry by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await moodStorageService.deleteMoodEntry(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/moods/:id:', error);
    res.status(500).json({ error: 'Failed to delete mood entry' });
  }
});

/**
 * DELETE /api/moods - Clear all mood entries
 */
router.delete('/', async (req: Request, res: Response) => {
  try {
    await moodStorageService.clearAllEntries();
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/moods:', error);
    res.status(500).json({ error: 'Failed to clear mood entries' });
  }
});

export default router;
