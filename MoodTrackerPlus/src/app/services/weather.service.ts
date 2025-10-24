import { Injectable } from '@angular/core';
import { WeatherData } from '../models/mood-entry.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Using OpenWeatherMap API - users will need to get their own free API key
  private readonly API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  constructor() { }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // Check if API key is set
      if (this.API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Weather API key not configured. Using mock data.');
        return this.getMockWeather();
      }

      const url = `${this.API_URL}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        condition: data.weather[0].main
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getMockWeather();
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lon: number; city: string } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            city: 'Current Location'
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        }
      );
    });
  }

  private getMockWeather(): WeatherData {
    // Mock weather data for when API is not available
    const conditions = [
      { condition: 'Clear', description: 'clear sky', icon: '01d', temp: 22 },
      { condition: 'Clouds', description: 'few clouds', icon: '02d', temp: 18 },
      { condition: 'Rain', description: 'light rain', icon: '10d', temp: 15 }
    ];
    
    const mock = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: mock.temp,
      description: mock.description,
      humidity: 65,
      icon: mock.icon,
      condition: mock.condition
    };
  }
}
