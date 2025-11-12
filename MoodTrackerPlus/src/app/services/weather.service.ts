import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { WeatherData } from '../models/mood-entry.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Seattle, WA coordinates
  private readonly SEATTLE_LAT = 47.6062;
  private readonly SEATTLE_LON = -122.3321;
  
  // Open-Meteo API (free, no API key required)
  private readonly API_URL = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  getCurrentWeather(): Observable<WeatherData | null> {
    const url = `${this.API_URL}?latitude=${this.SEATTLE_LAT}&longitude=${this.SEATTLE_LON}&current=temperature_2m,weathercode&temperature_unit=fahrenheit&timezone=America/Los_Angeles`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.current) {
          const temp = response.current.temperature_2m;
          const weatherCode = response.current.weathercode;
          const weatherInfo = this.getWeatherInfo(weatherCode);
          
          return {
            temperature: Math.round(temp),
            condition: weatherInfo.condition,
            description: weatherInfo.description,
            icon: weatherInfo.icon
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return of(null);
      })
    );
  }

  // Map WMO Weather interpretation codes to readable conditions
  private getWeatherInfo(code: number): { condition: string; description: string; icon: string } {
    // WMO Weather interpretation codes
    // Reference: https://open-meteo.com/en/docs
    if (code === 0) return { condition: 'Clear', description: 'Clear sky', icon: '☀️' };
    if (code === 1) return { condition: 'Mostly Clear', description: 'Mainly clear', icon: '🌤️' };
    if (code === 2) return { condition: 'Partly Cloudy', description: 'Partly cloudy', icon: '⛅' };
    if (code === 3) return { condition: 'Cloudy', description: 'Overcast', icon: '☁️' };
    if (code >= 45 && code <= 48) return { condition: 'Foggy', description: 'Fog', icon: '🌫️' };
    if (code >= 51 && code <= 55) return { condition: 'Drizzle', description: 'Light drizzle', icon: '🌦️' };
    if (code >= 56 && code <= 57) return { condition: 'Freezing Drizzle', description: 'Freezing drizzle', icon: '🌧️' };
    if (code >= 61 && code <= 65) return { condition: 'Rainy', description: 'Rain', icon: '🌧️' };
    if (code >= 66 && code <= 67) return { condition: 'Freezing Rain', description: 'Freezing rain', icon: '🌧️' };
    if (code >= 71 && code <= 75) return { condition: 'Snowy', description: 'Snow', icon: '❄️' };
    if (code === 77) return { condition: 'Snow Grains', description: 'Snow grains', icon: '❄️' };
    if (code >= 80 && code <= 82) return { condition: 'Rain Showers', description: 'Rain showers', icon: '🌧️' };
    if (code >= 85 && code <= 86) return { condition: 'Snow Showers', description: 'Snow showers', icon: '🌨️' };
    if (code === 95) return { condition: 'Thunderstorm', description: 'Thunderstorm', icon: '⛈️' };
    if (code >= 96 && code <= 99) return { condition: 'Thunderstorm', description: 'Thunderstorm with hail', icon: '⛈️' };
    
    // Default fallback
    return { condition: 'Unknown', description: 'Unknown conditions', icon: '🌈' };
  }
}
