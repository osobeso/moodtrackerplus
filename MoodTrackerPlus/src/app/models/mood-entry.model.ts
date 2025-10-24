export interface WeatherData {
  temperature: number; // in Celsius
  description: string; // e.g., "Clear sky", "Rainy"
  humidity: number; // percentage
  icon: string; // weather icon code
  condition: string; // main condition (e.g., "Clear", "Clouds", "Rain")
}

export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  emoji: string;
  weather?: WeatherData; // Optional weather data
  location?: string; // Optional location
}

export type MoodType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited';
