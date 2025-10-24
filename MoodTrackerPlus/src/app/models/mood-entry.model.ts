export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  emoji: string;
}

export type MoodType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited';
