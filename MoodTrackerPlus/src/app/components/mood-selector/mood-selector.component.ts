import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { WeatherService } from '../../services/weather.service';
import { MoodEntry } from '../../models/mood-entry.model';

interface Mood {
  name: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-mood-selector',
  templateUrl: './mood-selector.component.html',
  standalone: false,
  styleUrl: './mood-selector.component.css'
})
export class MoodSelectorComponent {
  moods: Mood[] = [
    { name: 'Happy', emoji: '😊', color: '#FFD93D' },
    { name: 'Sad', emoji: '😢', color: '#6C9BCF' },
    { name: 'Angry', emoji: '😠', color: '#FF6B6B' },
    { name: 'Anxious', emoji: '😰', color: '#A8DADC' },
    { name: 'Calm', emoji: '😌', color: '#B8E0D2' },
    { name: 'Excited', emoji: '🤩', color: '#FF9FF3' }
  ];

  showToast: boolean = false;
  toastMessage: string = '';
  toastEmoji: string = '';
  lastSavedEntry: MoodEntry | null = null;
  private toastTimeout: any;

  constructor(
    private moodStorage: MoodStorageService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  async selectMood(mood: Mood): Promise<void> {
    // Fetch weather data
    let weather = null;
    let location = undefined;
    
    try {
      const locationData = await this.weatherService.getCurrentLocation();
      if (locationData) {
        weather = await this.weatherService.getCurrentWeather(locationData.lat, locationData.lon);
        location = locationData.city;
      }
    } catch (error) {
      console.warn('Could not fetch weather data:', error);
    }

    this.lastSavedEntry = this.moodStorage.saveMoodEntry(mood.name, mood.emoji, weather || undefined, location);
    this.toastMessage = `${mood.name} mood recorded!`;
    this.toastEmoji = mood.emoji;
    this.showToast = true;

    // Auto-hide toast after 5 seconds
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  revertLastMood(): void {
    if (this.lastSavedEntry) {
      this.moodStorage.deleteMoodEntry(this.lastSavedEntry.id);
      this.lastSavedEntry = null;
      this.hideToast();
    }
  }

  private hideToast(): void {
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  viewHistory(): void {
    this.router.navigate(['/history']);
  }

  viewWeatherInsights(): void {
    this.router.navigate(['/weather-insights']);
  }
}
