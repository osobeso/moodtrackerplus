import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
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
    private router: Router
  ) {}

  selectMood(mood: Mood): void {
    this.moodStorage.saveMoodEntry(mood.name, mood.emoji)
      .then(entry => {
        this.lastSavedEntry = entry;
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
      })
      .catch(error => {
        console.error('Error saving mood:', error);
        this.toastMessage = 'Failed to save mood. Please try again.';
        this.toastEmoji = '❌';
        this.showToast = true;
      });
  }

  revertLastMood(): void {
    if (this.lastSavedEntry) {
      this.moodStorage.deleteMoodEntry(this.lastSavedEntry.id)
        .then(() => {
          this.lastSavedEntry = null;
          this.hideToast();
        })
        .catch(error => {
          console.error('Error reverting mood:', error);
        });
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
}
