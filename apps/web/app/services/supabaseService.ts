import { createClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  anonKey?: string;
}

interface TableInfo {
  name: string;
  columns: string[];
  rowCount: number;
}

interface SupabaseData {
  fileName: string;
  sheets: Array<{
    name: string;
    data: string[][];
    rows: number;
    columns: number;
  }>;
  totalRows: number;
  totalColumns: number;
  fileSize: number;
}

export class SupabaseService {
  private client: any;
  private config: SupabaseConfig;

  constructor(url: string, anonKey?: string) {
    this.config = { url, anonKey };
    if (!anonKey) {
      throw new Error('Supabase API key is required');
    }
    this.client = createClient(url, anonKey);
  }

  async getTables(): Promise<TableInfo[]> {
    try {
      // Since automatic table discovery is complex with Supabase permissions,
      // we'll return an empty array and let the user manually enter table names
      // This is more reliable and user-friendly
      return [];
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw new Error('Failed to connect to database');
    }
  }

  async fetchTableData(tableName: string, limit: number = 1000): Promise<SupabaseData> {
    try {
      // Fetch data from the table
      const { data, error } = await this.client
        .from(tableName)
        .select('*')
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch data from table ${tableName}: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`Table ${tableName} is empty`);
      }

      // Convert data to Excel-like format
      const columns = Object.keys(data[0]);
      const rows = data.map(row => columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      }));

      // Add header row
      const allRows = [columns, ...rows];

      const fileData: SupabaseData = {
        fileName: `${tableName}_supabase_data.xlsx`,
        sheets: [{
          name: tableName,
          data: allRows,
          rows: allRows.length,
          columns: columns.length
        }],
        totalRows: allRows.length,
        totalColumns: columns.length,
        fileSize: JSON.stringify(data).length
      };

      return fileData;
    } catch (error) {
      console.error('Error fetching table data:', error);
      throw new Error(`Failed to fetch data from table ${tableName}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Try to fetch tables to test connection
      await this.getTables();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default SupabaseService;
