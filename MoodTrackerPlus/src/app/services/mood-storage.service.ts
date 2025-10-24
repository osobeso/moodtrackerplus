import { Injectable } from '@angular/core';
import { MoodEntry, WeatherData } from '../models/mood-entry.model';

@Injectable({
  providedIn: 'root'
})
export class MoodStorageService {
  private readonly STORAGE_KEY = 'mood-tracker-entries';

  constructor() { }

  getMoodEntries(): MoodEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const entries = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    return [];
  }

  saveMoodEntry(mood: string, emoji: string, weather?: WeatherData, location?: string): MoodEntry {
    const entries = this.getMoodEntries();
    const newEntry: MoodEntry = {
      id: this.generateId(),
      mood,
      emoji,
      timestamp: new Date(),
      weather,
      location
    };
    entries.unshift(newEntry); // Add to the beginning
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  }

  deleteMoodEntry(id: string): void {
    const entries = this.getMoodEntries().filter(entry => entry.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
  }

  clearAllEntries(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
