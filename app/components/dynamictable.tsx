import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableProps {
  columns: string[]; // Array of column headers
  data?: Record<string, string>[]; // Optional array of data objects
}

export const DynamicTable: React.FC<TableProps> = ({ columns, data = [] }) => {
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
                    {row[col] || "-"} {/* Displaying '-' if the value is empty */}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
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
