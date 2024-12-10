"use client";
import localFont from "next/font/local";
import "./globals.css";
import React, { createContext, useState, useEffect } from "react";
import { getFromIndexedDB, saveToIndexedDB } from "@/utils/indexedDBUtils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tables, setTables] = useState<Record<string, TableData>>({});
  const [isLoaded, setIsLoaded] = useState(false); // Flag to prevent redundant saves
  const [currentTable, setCurrentTable] = useState<string>("");

  // Save tables to IndexedDB
  useEffect(() => {
    if (isLoaded && Object.keys(tables).length > 0) {
      saveToIndexedDB("TableState", tables).catch((err) =>
        console.error("Failed to save state to IndexedDB:", err)
      );
    }
  }, [tables, isLoaded]);

  // Load tables from IndexedDB
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
            setCurrentTable(firstTableName); // Set the first table's name as currentTable
          }
        }
      } catch (error) {
        console.error("Failed to load state from IndexedDB:", error);
      } finally {
        setIsLoaded(true); // Mark loading as complete
      }
    }
    loadState();
  }, []);

  return (
    <TableStateContext.Provider
      value={{ tables, setTables, currentTable, setCurrentTable }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </TableStateContext.Provider>
  );
}
