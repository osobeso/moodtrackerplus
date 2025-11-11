import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodStorageService } from '../../services/mood-storage.service';
import { MoodEntry } from '../../models/mood-entry.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  moods: MoodEntry[];
}

@Component({
  selector: 'app-mood-history',
  templateUrl: './mood-history.component.html',
  standalone: false,
  styleUrl: './mood-history.component.css'
})
export class MoodHistoryComponent implements OnInit {
  moodEntries: MoodEntry[] = [];
  viewMode: 'list' | 'calendar' = 'list';
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

  toggleView(): void {
    this.viewMode = this.viewMode === 'list' ? 'calendar' : 'list';
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  getCurrentMonthYear(): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return this.currentMonth.toLocaleDateString('en-US', options);
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate start date (including previous month days)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    // Generate 42 days (6 weeks) for a complete calendar grid
    this.calendarDays = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const dayMoods = this.getMoodsForDate(currentDate);
      
      this.calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth,
        moods: dayMoods
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getMoodsForDate(date: Date): MoodEntry[] {
    return this.moodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.getFullYear() === date.getFullYear() &&
             entryDate.getMonth() === date.getMonth() &&
             entryDate.getDate() === date.getDate();
    });
  }

  getDayNumber(date: Date): number {
    return date.getDate();
  }

  loadEntries(): void {
    this.moodEntries = this.moodStorage.getMoodEntries();
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
