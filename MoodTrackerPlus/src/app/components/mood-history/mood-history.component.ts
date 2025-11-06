import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { MoodEntry } from '../../models/mood-entry.model';

@Component({
  selector: 'app-mood-history',
  templateUrl: './mood-history.component.html',
  standalone: false,
  styleUrl: './mood-history.component.css'
})
export class MoodHistoryComponent implements OnInit {
  moodEntries: MoodEntry[] = [];

  constructor(
    private moodStorage: MoodStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.moodStorage.getMoodEntries()
      .then(entries => {
        this.moodEntries = entries;
      })
      .catch(error => {
        console.error('Error loading mood entries:', error);
        this.moodEntries = [];
      });
  }

  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.moodStorage.deleteMoodEntry(id)
        .then(() => {
          this.loadEntries();
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete entry. Please try again.');
        });
    }
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all mood history? This cannot be undone.')) {
      this.moodStorage.clearAllEntries()
        .then(() => {
          this.loadEntries();
        })
        .catch(error => {
          console.error('Error clearing entries:', error);
          alert('Failed to clear entries. Please try again.');
        });
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
