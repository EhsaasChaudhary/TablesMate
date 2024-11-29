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
    // Split the input by commas and trim whitespace
    const newColumns = newColumn
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col && !columns.includes(col)); // Avoid empty and duplicate columns

    if (newColumns.length > 0) {
      setColumns([...columns, ...newColumns]); // Add new columns
      setNewColumn("");

      // Update existing data rows to include the new columns with empty values
      
      setData(
        data.map((row) =>
          newColumns.reduce((acc, col) => ({ ...acc, [col]: "" }), row)
        )
      );

      // Update the new row template to include the new columns with empty values

      const updatedNewRow = newColumns.reduce(
        (acc, col) => ({ ...acc, [col]: "" }),
        newRow
      );
      setNewRow(updatedNewRow);
    }
  };

  // Remove column function
  const removeColumn = (columnToRemove: string) => {
    setColumns(columns.filter((column) => column !== columnToRemove));
    setData(
      data.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnToRemove]: _, ...rest } = row;
        return rest;
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [columnToRemove]: _, ...restNewRow } = newRow;
    setNewRow(restNewRow);
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

  // Disable Add Row button if any field is empty
  const isAddRowDisabled = Object.values(newRow).some(
    (value) => value.trim() === ""
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Add Columns</h2>
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Label htmlFor="newColumn">New Columns:</Label>
            <Input
              id="newColumn"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              placeholder="Enter column names seperated by commas: e.g., First name, Last name, Age"
            />
          </div>
          <Button onClick={addColumns}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Columns
          </Button>
        </div>
      </div>

      {columns.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Add Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {columns.map((column) => (
              <div key={column} className="space-y-2">
                <Label htmlFor={`newRow-${column}`}>{column}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={`newRow-${column}`}
                    value={newRow[column] || ""}
                    onChange={(e) => updateNewRow(column, e.target.value)}
                    placeholder={`Enter ${column}`}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColumn(column)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={addRow} disabled={isAddRowDisabled}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Row
          </Button>
        </div>
      )}

      {columns.length > 0 && data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Generated Table</h2>
          <DynamicTable columns={columns} data={data} deleteRow={deleteRow} />
        </div>
      )}
    </div>
  );
}