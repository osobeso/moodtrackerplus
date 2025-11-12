import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { MoodEntry } from '../../models/mood-entry.model';

interface WeatherMoodCorrelation {
  weatherCondition: string;
  weatherIcon: string;
  moodCounts: { mood: string; emoji: string; count: number }[];
  totalCount: number;
}

@Component({
  selector: 'app-mood-history',
  templateUrl: './mood-history.component.html',
  standalone: false,
  styleUrl: './mood-history.component.css'
})
export class MoodHistoryComponent implements OnInit {
  moodEntries: MoodEntry[] = [];
  weatherCorrelations: WeatherMoodCorrelation[] = [];
  showCorrelations = false;

  constructor(
    private moodStorage: MoodStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.moodEntries = this.moodStorage.getMoodEntries();
    this.calculateWeatherCorrelations();
  }

  calculateWeatherCorrelations(): void {
    const entriesWithWeather = this.moodEntries.filter(entry => entry.weather);
    
    if (entriesWithWeather.length === 0) {
      this.weatherCorrelations = [];
      return;
    }

    // Group by weather condition
    const weatherGroups = new Map<string, MoodEntry[]>();
    entriesWithWeather.forEach(entry => {
      const condition = entry.weather!.condition;
      if (!weatherGroups.has(condition)) {
        weatherGroups.set(condition, []);
      }
      weatherGroups.get(condition)!.push(entry);
    });

    // Calculate mood distribution for each weather condition
    this.weatherCorrelations = Array.from(weatherGroups.entries()).map(([condition, entries]) => {
      const moodCounts = new Map<string, { mood: string; emoji: string; count: number }>();
      
      entries.forEach(entry => {
        if (!moodCounts.has(entry.mood)) {
          moodCounts.set(entry.mood, { mood: entry.mood, emoji: entry.emoji, count: 0 });
        }
        moodCounts.get(entry.mood)!.count++;
      });

      // Sort by count descending
      const sortedMoods = Array.from(moodCounts.values()).sort((a, b) => b.count - a.count);

      return {
        weatherCondition: condition,
        weatherIcon: entries[0].weather!.icon,
        moodCounts: sortedMoods,
        totalCount: entries.length
      };
    }).sort((a, b) => b.totalCount - a.totalCount); // Sort weather conditions by frequency
  }

  toggleCorrelations(): void {
    this.showCorrelations = !this.showCorrelations;
  }

  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.moodStorage.deleteMoodEntry(id);
      this.loadEntries();
    }
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all mood history? This cannot be undone.')) {
      this.moodStorage.clearAllEntries();
      this.loadEntries();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Date(date).toLocaleTimeString('en-US', options);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return this.formatDate(date);
  }
}
