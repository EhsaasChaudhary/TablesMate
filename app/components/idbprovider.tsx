"use client"
import React, { createContext, useState, useEffect } from "react";
import { getFromIndexedDB, saveToIndexedDB } from "@/utils/indexedDBUtils";

// Type for table data
interface TableData {
  columns: string[];
  rows: Record<string, string>[];
}

// Context type
interface TableStateContextType {
  tables: Record<string, TableData>;
  setTables: React.Dispatch<React.SetStateAction<Record<string, TableData>>>;
  currentTable: string;
  setCurrentTable: React.Dispatch<React.SetStateAction<string>>;
}

// Context
export const TableStateContext = createContext<
  TableStateContextType | undefined
>(undefined);

export default function IDBProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tables, setTables] = useState<Record<string, TableData>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTable, setCurrentTable] = useState<string>("");

  useEffect(() => {
    if (isLoaded && Object.keys(tables).length > 0) {
      saveToIndexedDB("TableState", tables).catch((err) =>
        console.error("Failed to save state to IndexedDB:", err)
      );
    }
  }, [tables, isLoaded]);

  useEffect(() => {
    async function loadState() {
      try {
        const savedState = await getFromIndexedDB<Record<string, TableData>>(
          "TableState"
        );
        if (savedState) {
          setTables(savedState);
          const firstTableName = Object.keys(savedState)[0];
          if (firstTableName) {
            setCurrentTable(firstTableName);
          }
        }
      } catch (error) {
        console.error("Failed to load state from IndexedDB:", error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadState();
  }, []);

  return (
    <TableStateContext.Provider
      value={{ tables, setTables, currentTable, setCurrentTable }}
    >
      {children}
    </TableStateContext.Provider>
  );
}
