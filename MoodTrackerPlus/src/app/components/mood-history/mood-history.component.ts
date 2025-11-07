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
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

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

  toggleView(mode: 'list' | 'calendar'): void {
    this.viewMode = mode;
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days to show from previous month
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate days to show from next month (to complete the grid)
    const totalDays = lastDay.getDate();
    const daysFromNextMonth = (7 - ((daysFromPrevMonth + totalDays) % 7)) % 7;
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        entries: this.getEntriesForDate(date)
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        entries: this.getEntriesForDate(date)
      });
    }
    
    // Add days from next month
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        entries: this.getEntriesForDate(date)
      });
    }
    
    this.calendarDays = days;
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
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  getMonthYearString(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    return this.currentMonth.toLocaleDateString('en-US', options);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
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
