"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { DynamicTable } from "./dynamictable";

interface TableData {
  [key: string]: string;
}

export function TableDataForm() {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [newColumn, setNewColumn] = useState("");
  const [newRow, setNewRow] = useState<TableData>({});

  const addColumns = () => {
    // Split the input by commas, trim whitespace, and filter out duplicates
    const newColumns = newColumn
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col && !columns.includes(col));

    if (newColumns.length > 0) {
      if (columns.length === 0) {
        // If there are no existing columns, clear data before adding new columns
        setData([]);
      }

      // Add new columns
      setColumns((prevColumns) => [...prevColumns, ...newColumns]);

      // Update existing data rows to include new columns with empty values
      setData((prevData) =>
        prevData.map((row) =>
          newColumns.reduce((acc, col) => ({ ...acc, [col]: "" }), row)
        )
      );

      // Update the new row template to include new columns with empty values
      setNewRow((prevNewRow) =>
        newColumns.reduce((acc, col) => ({ ...acc, [col]: "" }), prevNewRow)
      );

      // Clear the input field
      setNewColumn("");
    }
  };

  // Remove column function
  const removeColumn = (columnToRemove: string) => {
    // Remove the column from the columns list
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column !== columnToRemove)
    );

    // Remove the column from each row in data
    setData((prevData) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prevData.map(({ [columnToRemove]: _, ...rest }) => rest)
    );

    // Remove the column from the newRow template
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setNewRow(({ [columnToRemove]: _, ...restNewRow }) => restNewRow);
  };

  // Add row function with validation
  const addRow = () => {
    if (Object.values(newRow).every((value) => value.trim() !== "")) {
      setData([...data, newRow]);
      setNewRow(
        columns.reduce((acc, column) => ({ ...acc, [column]: "" }), {})
      );
    } else {
      alert("All fields must be filled before adding a row.");
    }
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, rowIndex) => rowIndex !== index));
  };

  // Update new row values
  const updateNewRow = (column: string, value: string) => {
    setNewRow({ ...newRow, [column]: value });
  };

  const updateRow = (index: number, updatedRow: TableData) => {
    setData((prevData) =>
      prevData.map((row, rowIndex) => (rowIndex === index ? updatedRow : row))
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  // Disable Add Row button if any field is empty
  const isAddRowDisabled = Object.values(newRow).some(
    (value) => value.trim() === ""
  );

return (
    <div className="space-y-8">
      <section aria-labelledby="add-columns-heading">
        <h2 id="add-columns-heading" className="text-lg font-semibold mb-4">Add Columns</h2>
        <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex-grow space-y-2">
            <Label htmlFor="newColumn">New Columns</Label>
            <Input
              id="newColumn"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              onKeyUp={(e) => handleKeyPress(e, addColumns)}
              placeholder="Separate column names with commas, e.g., First name, Last name, Age"
              aria-describedby="column-instructions"
            />
          </div>
          <Button onClick={addColumns} aria-label="Add columns">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Columns
          </Button>
        </div>
      </section>

      {columns.length > 0 && (
        <section aria-labelledby="add-data-heading">
          <h2 id="add-data-heading" className="text-lg font-semibold mb-4">Add Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {columns.map((column) => (
              <div key={column} className="space-y-2">
                <Label htmlFor={`newRow-${column}`}>{column}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={`newRow-${column}`}
                    value={newRow[column] || ""}
                    onChange={(e) => updateNewRow(column, e.target.value)}
                    onKeyUp={(e) => handleKeyPress(e, addRow)}
                    placeholder={`Enter ${column}`}
                    aria-label={`Enter value for ${column}`}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColumn(column)}
                    aria-label={`Remove ${column} column`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button 
            onClick={addRow} 
            disabled={isAddRowDisabled}
            aria-label="Add new row to table"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Row
          </Button>
        </section>
      )}

      {columns.length > 0 && data.length > 0 && (
        <section aria-labelledby="generated-table-heading">
          <h2 id="generated-table-heading" className="text-xl font-semibold mb-4">Generated Table</h2>
          <DynamicTable
            columns={columns}
            data={data}
            deleteRow={deleteRow}
            updateRow={updateRow}
          />
        </section>
      )}
    </div>
  )
}
