// tableUtils.ts

export interface TableData {
    columns: string[];
    rows: Record<string, string>[];
  }
  
  export type TablesState = Record<string, TableData>;
  
  export function convertTablesToJson(tables: TablesState): string {
    return JSON.stringify(tables, null, 2); // Pretty prints the JSON with 2 spaces indentation
  }
