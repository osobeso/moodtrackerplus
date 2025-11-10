import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { MoodEntry } from '../../models/mood-entry.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  entries: MoodEntry[];
}

@Component({
  selector: 'app-mood-history',
  templateUrl: './mood-history.component.html',
  standalone: false,
  styleUrl: './mood-history.component.css'
})
export class MoodHistoryComponent implements OnInit {
  moodEntries: MoodEntry[] = [];
  viewMode: 'list' | 'calendar' = 'calendar';
  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private moodStorage: MoodStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntries();
    this.generateCalendar();
  }

  loadEntries(): void {
    this.moodEntries = this.moodStorage.getMoodEntries();
    this.generateCalendar();
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

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'calendar' : 'list';
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the previous month to fill the calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End at the next month to complete the calendar grid
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    this.calendarDays = [];
    const currentDateIter = new Date(startDate);

    while (currentDateIter <= endDate) {
      const isCurrentMonth = currentDateIter.getMonth() === month;
      const dayEntries = this.getEntriesForDate(currentDateIter);

      this.calendarDays.push({
        date: new Date(currentDateIter),
        isCurrentMonth,
        entries: dayEntries
      });

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
  }

  getEntriesForDate(date: Date): MoodEntry[] {
    return this.moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.getFullYear() === date.getFullYear() &&
             entryDate.getMonth() === date.getMonth() &&
             entryDate.getDate() === date.getDate();
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  getCurrentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}
