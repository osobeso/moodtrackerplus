import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { MoodEntry } from '../../models/mood-entry.model';

interface WeatherMoodStats {
  weatherCondition: string;
  count: number;
  moods: { [key: string]: number };
  avgTemperature: number;
  avgHumidity: number;
}

interface MoodWeatherInsight {
  mood: string;
  emoji: string;
  weatherStats: {
    mostCommon: string;
    avgTemp: number;
    avgHumidity: number;
  };
  count: number;
}

@Component({
  selector: 'app-weather-correlation',
  templateUrl: './weather-correlation.component.html',
  standalone: false,
  styleUrl: './weather-correlation.component.css'
})
export class WeatherCorrelationComponent implements OnInit {
  moodEntries: MoodEntry[] = [];
  entriesWithWeather: MoodEntry[] = [];
  weatherStats: WeatherMoodStats[] = [];
  moodInsights: MoodWeatherInsight[] = [];
  selectedFilter: string = 'all';
  hasWeatherData: boolean = false;

  constructor(
    private moodStorage: MoodStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.moodEntries = this.moodStorage.getMoodEntries();
    this.entriesWithWeather = this.moodEntries.filter(entry => entry.weather);
    this.hasWeatherData = this.entriesWithWeather.length > 0;

    if (this.hasWeatherData) {
      this.calculateWeatherStats();
      this.calculateMoodInsights();
    }
  }

  calculateWeatherStats(): void {
    const weatherMap = new Map<string, WeatherMoodStats>();

    this.entriesWithWeather.forEach(entry => {
      if (!entry.weather) return;

      const condition = entry.weather.condition;
      
      if (!weatherMap.has(condition)) {
        weatherMap.set(condition, {
          weatherCondition: condition,
          count: 0,
          moods: {},
          avgTemperature: 0,
          avgHumidity: 0
        });
      }

      const stats = weatherMap.get(condition)!;
      stats.count++;
      stats.moods[entry.mood] = (stats.moods[entry.mood] || 0) + 1;
      stats.avgTemperature += entry.weather.temperature;
      stats.avgHumidity += entry.weather.humidity;
    });

    this.weatherStats = Array.from(weatherMap.values()).map(stats => ({
      ...stats,
      avgTemperature: Math.round(stats.avgTemperature / stats.count),
      avgHumidity: Math.round(stats.avgHumidity / stats.count)
    })).sort((a, b) => b.count - a.count);
  }

  calculateMoodInsights(): void {
    const moodMap = new Map<string, {
      emoji: string;
      temps: number[];
      humidities: number[];
      conditions: string[];
    }>();

    this.entriesWithWeather.forEach(entry => {
      if (!entry.weather) return;

      if (!moodMap.has(entry.mood)) {
        moodMap.set(entry.mood, {
          emoji: entry.emoji,
          temps: [],
          humidities: [],
          conditions: []
        });
      }

      const moodData = moodMap.get(entry.mood)!;
      moodData.temps.push(entry.weather.temperature);
      moodData.humidities.push(entry.weather.humidity);
      moodData.conditions.push(entry.weather.condition);
    });

    this.moodInsights = Array.from(moodMap.entries()).map(([mood, data]) => {
      const conditionCounts = data.conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const mostCommonCondition = Object.entries(conditionCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      return {
        mood,
        emoji: data.emoji,
        weatherStats: {
          mostCommon: mostCommonCondition,
          avgTemp: Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length),
          avgHumidity: Math.round(data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length)
        },
        count: data.temps.length
      };
    }).sort((a, b) => b.count - a.count);
  }

  getFilteredEntries(): MoodEntry[] {
    if (this.selectedFilter === 'all') {
      return this.entriesWithWeather;
    }
    return this.entriesWithWeather.filter(entry => 
      entry.weather?.condition.toLowerCase() === this.selectedFilter.toLowerCase()
    );
  }

  getWeatherIcon(condition: string): string {
    const icons: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
  }

  getMostCommonMood(moods: { [key: string]: number }): string {
    const entries = Object.entries(moods);
    if (entries.length === 0) return '';
    return entries.sort(([, a], [, b]) => b - a)[0][0];
  }

  filterByWeather(condition: string): void {
    this.selectedFilter = condition.toLowerCase();
  }

  clearFilter(): void {
    this.selectedFilter = 'all';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  viewHistory(): void {
    this.router.navigate(['/history']);
  }
}
