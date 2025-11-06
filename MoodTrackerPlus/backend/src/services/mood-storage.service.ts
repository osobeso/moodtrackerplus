import { tableClient } from '../config/table-storage.config';
import { MoodEntry, toTableEntity, fromTableEntity } from '../models/mood-entry.model';
import { odata } from '@azure/data-tables';

/**
 * Service for managing mood entries in Azure Table Storage
 */
export class MoodStorageService {
  /**
   * Get all mood entries sorted by timestamp (newest first)
   */
  async getMoodEntries(): Promise<MoodEntry[]> {
    try {
      const partitionKey = 'moods';
      const entities = tableClient.listEntities({
        queryOptions: {
          filter: odata`PartitionKey eq ${partitionKey}`
        }
      });

      const moodEntries: MoodEntry[] = [];
      for await (const entity of entities) {
        moodEntries.push(fromTableEntity(entity));
      }

      // Sort by timestamp descending (newest first)
      moodEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return moodEntries;
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      throw error;
    }
  }

  /**
   * Get a single mood entry by ID
   */
  async getMoodEntryById(id: string): Promise<MoodEntry | null> {
    try {
      const partitionKey = 'moods';
      const entity = await tableClient.getEntity(partitionKey, id);
      return fromTableEntity(entity);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      console.error('Error fetching mood entry:', error);
      throw error;
    }
  }

  /**
   * Save a new mood entry
   */
  async saveMoodEntry(mood: string, emoji: string): Promise<MoodEntry> {
    try {
      const newEntry: MoodEntry = {
        id: this.generateId(),
        mood,
        emoji,
        timestamp: new Date()
      };

      const entity = toTableEntity(newEntry);
      await tableClient.createEntity(entity);

      return newEntry;
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  }

  /**
   * Delete a mood entry by ID
   */
  async deleteMoodEntry(id: string): Promise<boolean> {
    try {
      const partitionKey = 'moods';
      await tableClient.deleteEntity(partitionKey, id);
      return true;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return false;
      }
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  }

  /**
   * Clear all mood entries
   */
  async clearAllEntries(): Promise<void> {
    try {
      const entries = await this.getMoodEntries();
      const deletePromises = entries.map(entry => this.deleteMoodEntry(entry.id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing all entries:', error);
      throw error;
    }
  }

  /**
   * Generate a unique ID for mood entries
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const moodStorageService = new MoodStorageService();
