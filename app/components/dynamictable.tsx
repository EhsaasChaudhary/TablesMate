import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TableProps {
  columns: string[];
  data?: Record<string, string>[];
  deleteRow?: (index: number) => void;
  updateRow?: (index: number, updatedRow: Record<string, string>) => void;
}

export const DynamicTable: React.FC<TableProps> = ({
  columns,
  data = [],
  deleteRow,
  updateRow,
}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track row being edited
  const [editedRow, setEditedRow] = useState<Record<string, string>>({}); // Track changes for the edited row

  const handleEditClick = (index: number, row: Record<string, string>) => {
    setEditIndex(index);
    setEditedRow({ ...row }); // Clone the row for editing
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedRow({});
  };

  const handleSaveEdit = () => {
    if (updateRow && editIndex !== null) {
      updateRow(editIndex, editedRow);
    }
    setEditIndex(null);
    setEditedRow({});
  };

  const handleInputChange = (column: string, value: string) => {
    setEditedRow((prev) => ({ ...prev, [column]: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const minColumnWidth = `${Math.max(100 / (columns.length + 1), 150)}px`
  const totalColumns = columns.length + 2

  return (
    <div className="w-full">
      <Table className="w-full border-collapse border border-gray-200 shadow-md">
        <TableHeader>
          <TableRow>
            <TableHead
              className="bg-gray-100 p-2 text-left font-semibold text-gray-700 border-b border-r border-gray-200"
              style={{ width: '50px' }}
            >
              #
            </TableHead>
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className="bg-gray-100 p-2 text-left font-semibold text-gray-700 border-b border-r border-gray-200"
                style={{ minWidth: minColumnWidth }}
              >
                <div className="truncate">{col}</div>
              </TableHead>
            ))}
            <TableHead 
              className="bg-gray-100 p-2 text-left font-semibold text-gray-700 border-b border-gray-200"
              style={{ minWidth: minColumnWidth }}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-50 transition duration-300"
              >
                <TableCell
                  className="p-2 border-b border-r border-gray-200 text-center"
                  style={{ width: '50px' }}
                >
                  {rowIndex + 1}
                </TableCell>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="p-2 border-b border-r border-gray-200"
                    style={{ minWidth: minColumnWidth }}
                  >
                    {editIndex === rowIndex ? (
                      <Input
                        type="text"
                        value={editedRow[col] || ""}
                        onChange={(e) => handleInputChange(col, e.target.value)}
                        onKeyUp={(e) => handleKeyPress(e, handleSaveEdit)}
                        aria-label={`Edit ${col}`}
                        className="w-full bg-white border-2 border-primary/20 focus:border-primary hover:border-primary/50 transition-colors"
                      />
                    ) : (
                      <div className="truncate">{row[col] || "-"}</div>
                    )}
                  </TableCell>
                ))}
                <TableCell className="p-3 border-b border-gray-200">
                  {editIndex === rowIndex ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveEdit}
                        aria-label="Save changes"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCancelEdit}
                        aria-label="Cancel edit"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEditClick(rowIndex, row)}
                        aria-label={`Edit row ${rowIndex + 1}`}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {deleteRow && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRow(rowIndex)}
                          aria-label={`Delete row ${rowIndex + 1}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="p-2 text-center text-gray-500 border-b border-gray-200"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
};
