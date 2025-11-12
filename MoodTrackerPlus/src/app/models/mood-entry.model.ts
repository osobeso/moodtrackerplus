export interface WeatherData {
  temperature: number;  // in Fahrenheit
  condition: string;    // e.g., "Sunny", "Cloudy", "Rainy"
  description: string;  // e.g., "Clear sky", "Partly cloudy"
  icon: string;         // emoji or icon representation
}

export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  emoji: string;
  weather?: WeatherData;  // Optional weather data
}

export type MoodType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited';
