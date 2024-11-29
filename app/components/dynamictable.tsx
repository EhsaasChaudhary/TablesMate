import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TableProps {
  columns: string[];
  data?: Record<string, string>[];
  deleteRow?: (index: number) => void;
}

export const DynamicTable: React.FC<TableProps> = ({ columns, data = [], deleteRow }) => {
  return (
    <div className="w-full overflow-auto">
      <Table className="table-auto border-collapse border border-gray-300 shadow-md">
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className="text-center bg-gray-200 p-3 border-b border-gray-300 font-semibold"
              >
                {col}
              </TableHead>
            ))}
            {/* Add a header for the delete column */}
            {deleteRow && (
              <TableHead
                className="text-center bg-gray-200 p-3 border-b border-gray-300 font-semibold"
              >
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-50 transition duration-300"
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="text-center p-3 border-b border-gray-200"
                  >
                    {row[col] || "-"}
                  </TableCell>
                ))}
                {/* Add delete button for each row */}
                {deleteRow && (
                  <TableCell className="text-center p-3 border-b border-gray-200">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteRow(rowIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (deleteRow ? 1 : 0)}
                className="text-center p-3 border-b border-gray-200 text-gray-500"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
