import { TableClient } from '@azure/data-tables';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const tableName = process.env.TABLE_NAME || 'moodentries';

if (!connectionString) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
}

// Create TableClient instance
export const tableClient = TableClient.fromConnectionString(connectionString, tableName);

/**
 * Initialize the table if it doesn't exist
 */
export async function initializeTable(): Promise<void> {
  try {
    await tableClient.createTable();
    console.log(`✅ Table '${tableName}' is ready`);
  } catch (error: any) {
    if (error.statusCode === 409) {
      // Table already exists
      console.log(`✅ Table '${tableName}' already exists`);
    } else {
      console.error('Error initializing table:', error);
      throw error;
    }
  }
}
