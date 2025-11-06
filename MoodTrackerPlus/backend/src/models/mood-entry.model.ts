/**
 * MoodEntry interface matching the frontend model
 */
export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  timestamp: Date;
}

/**
 * MoodEntry entity for Azure Table Storage
 * PartitionKey: Uses a fixed value 'moods' to keep all entries in same partition for now
 * RowKey: Uses the entry id
 */
export interface MoodEntryEntity {
  partitionKey: string;
  rowKey: string;
  mood: string;
  emoji: string;
  timestamp: Date;
}

/**
 * Convert MoodEntry to Table Storage entity
 */
export function toTableEntity(entry: MoodEntry): MoodEntryEntity {
  return {
    partitionKey: 'moods', // Using single partition for simplicity in MVP
    rowKey: entry.id,
    mood: entry.mood,
    emoji: entry.emoji,
    timestamp: entry.timestamp
  };
}

/**
 * Convert Table Storage entity to MoodEntry
 */
export function fromTableEntity(entity: any): MoodEntry {
  return {
    id: entity.rowKey,
    mood: entity.mood,
    emoji: entity.emoji,
    timestamp: new Date(entity.timestamp)
  };
}
