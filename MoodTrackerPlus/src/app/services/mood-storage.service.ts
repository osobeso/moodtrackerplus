import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { MoodEntry } from '../models/mood-entry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodStorageService {
  private readonly apiUrl = `${environment.apiUrl}/moods`;

  constructor(private http: HttpClient) { }

  getMoodEntries(): Promise<MoodEntry[]> {
    return firstValueFrom(
      this.http.get<MoodEntry[]>(this.apiUrl)
    ).then(entries => 
      entries.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))
    );
  }

  saveMoodEntry(mood: string, emoji: string): Promise<MoodEntry> {
    return firstValueFrom(
      this.http.post<MoodEntry>(this.apiUrl, { mood, emoji })
    ).then(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
  }

  deleteMoodEntry(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`)
    );
  }

  clearAllEntries(): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(this.apiUrl)
    );
  }
}
