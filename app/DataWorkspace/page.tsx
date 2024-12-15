"use client";

import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Table2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { TableStateContext } from "../components/idbprovider";
import Link from "next/link";

export default function Dataspace() {
  const context = useContext(TableStateContext);

  if (!context) {
    throw new Error("Context Not found reload the App");
  }

  const { tables, setTables } = context;
  const { currentTable, setCurrentTable } = context;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [rowData, setRowData] = useState<Record<string, string>>({});
  const [editedRowData, setEditedRowData] = useState<Record<string, string>>(
    {}
  );
  const [selectedColumnsForDeletion, setSelectedColumnsForDeletion] = useState<
    string[]
  >([]);
  const [confirmDeleteColumnsModalOpen, setConfirmDeleteColumnsModalOpen] =
    useState(false);
  const { toast } = useToast();

  const addRow = () => {
    if (currentTable) {
      setTables((prevTables) => {
        const updatedTable = {
          ...prevTables[currentTable],
          rows: [...prevTables[currentTable].rows, { ...rowData }],
        };
        return { ...prevTables, [currentTable]: updatedTable };
      });
      setRowData({});
      toast({
        title: "Row Added",
        description: `New row has been added to "${currentTable}".`,
      });
    }
  };

  const confirmDeleteRow = () => {
    if (currentRowIndex !== null && currentTable) {
      setTables((prevTables) => {
        const updatedRows = prevTables[currentTable].rows.filter(
          (_, index) => index !== currentRowIndex
        );
        return {
          ...prevTables,
          [currentTable]: {
            ...prevTables[currentTable],
            rows: updatedRows,
          },
        };
      });
      toast({
        title: "Success",
        description: "Row has been successfully deleted.",
      });
    }
    setIsDeleteModalOpen(false);
  };

  const saveEditedRow = () => {
    if (currentRowIndex !== null && currentTable) {
      setTables((prevTables) => {
        const updatedRows = [...prevTables[currentTable].rows];
        updatedRows[currentRowIndex] = editedRowData;
        return {
          ...prevTables,
          [currentTable]: {
            ...prevTables[currentTable],
            rows: updatedRows,
          },
        };
      });
      toast({
        title: "Success",
        description: "Row data has been successfully updated.",
      });
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteColumns = () => {
    if (!currentTable) {
      toast({
        title: "Error",
        description: "No table selected to delete columns from.",
        variant: "destructive",
      });
      return;
    }

    setTables((prevTables) => {
      const updatedTable = {
        ...prevTables[currentTable],
        columns: prevTables[currentTable].columns.filter(
          (column) => !selectedColumnsForDeletion.includes(column)
        ),
        rows: prevTables[currentTable].rows.map((row) => {
          const updatedRow = { ...row };
          selectedColumnsForDeletion.forEach((col) => {
            delete updatedRow[col];
          });
          return updatedRow;
        }),
      };
      return { ...prevTables, [currentTable]: updatedTable };
    });

    // Clear selected columns and show toast
    setSelectedColumnsForDeletion([]);
    toast({
      title: "Columns Deleted",
      description: `Columns "${selectedColumnsForDeletion.join(
        ", "
      )}" have been deleted.`,
    });
  };

  const handleEditRow = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setEditedRowData({ ...tables[currentTable]?.rows[rowIndex] });
    setIsEditModalOpen(true);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setIsDeleteModalOpen(true);
  };
  return (
    <>
      <div className="w-full p-4 max-w-8xl mx-auto">
        <Card className="bg-card shadow w-full max-w-8xl mx-auto">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold text-primary">
              Table Data Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <Label htmlFor="tableSelect" className="text-sm font-medium">
                Select Table
              </Label>
              <Select
                value={currentTable || ""}
                onValueChange={setCurrentTable}
              >
                <SelectTrigger id="tableSelect" className="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(tables).length > 0 ? (
                    Object.keys(tables).map((tableName) => (
                      <SelectItem key={tableName} value={tableName}>
                        {tableName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No Table Found, Please Add Table" disabled>
                      No Table Found, Please Add Table
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {currentTable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full pb-4 pr-4 pl-4 max-w-8xl mx-auto"
          >
            {tables[currentTable]?.columns.length > 0 ? (
              <Card className="bg-card shadow-lg w-full max-w-8xl mx-auto">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Working on Table: {currentTable}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Add Row Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Add Row
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {tables[currentTable]?.columns.map((col) => (
                        <div key={col} className="space-y-2">
                          <Label
                            htmlFor={`input-${col}`}
                            className="text-sm font-medium"
                          >
                            {col}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`input-${col}`}
                              type="text"
                              className="flex-grow"
                              placeholder={`Enter ${col}`}
                              value={rowData[col] || ""}
                              onChange={(e) =>
                                setRowData({
                                  ...rowData,
                                  [col]: e.target.value,
                                })
                              }
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                setSelectedColumnsForDeletion([col]);
                                setConfirmDeleteColumnsModalOpen(true);
                              }}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={addRow} className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Data
                    </Button>
                  </div>

                  {/* Table Preview Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Table Preview
                    </h3>

                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted">
                            <TableHead className="w-[100px] font-bold">
                              Count
                            </TableHead>
                            {tables[currentTable]?.columns.map((col) => (
                              <TableHead key={col} className="font-bold">
                                {col}
                              </TableHead>
                            ))}
                            <TableHead className="font-bold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {tables[currentTable]?.rows.length > 0 ? (
                            tables[currentTable]?.rows.map((row, rowIndex) => (
                              <TableRow
                                key={rowIndex}
                                className="hover:bg-muted/50 transition-colors"
                              >
                                <TableCell className="font-medium">
                                  {rowIndex + 1}
                                </TableCell>
                                {tables[currentTable]?.columns.map((col) => (
                                  <TableCell key={col}>
                                    {row[col] || ""}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditRow(rowIndex)}
                                    >
                                      <Edit2 className="mr-2 h-4 w-4" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteRow(rowIndex)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={
                                  tables[currentTable]?.columns.length + 2
                                }
                              >
                                <div className="text-center text-sm text-black">
                                  No data available. Please add data.
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-card p-6 text-center rounded-md shadow space-y-4">
                <p className="text-lg font-semibold text-black">
                  Add columns to start working on this table.
                </p>
                <Button variant="default" className="ml-10" asChild>
                  <Link href={"/TableWorkspace"}>
                    <Table2 className="mr-2 h-4 w-4" />
                    Add Columns
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* table row edit modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {tables[currentTable]?.columns.map((col) => (
              <div key={col} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`edit-${col}`} className="text-right">
                  {col}
                </Label>
                <Input
                  id={`edit-${col}`}
                  value={editedRowData[col] || ""}
                  onChange={(e) =>
                    setEditedRowData((prev) => ({
                      ...prev,
                      [col]: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedRow}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* table row delete modal */}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this row? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRow}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Columns Modal */}
      <Dialog
        open={confirmDeleteColumnsModalOpen}
        onOpenChange={setConfirmDeleteColumnsModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Column Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete the following columns? This action
              cannot be undone:
            </p>
            <ul className="list-disc list-inside">
              {selectedColumnsForDeletion.map((col) => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteColumnsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteColumns();
                setConfirmDeleteColumnsModalOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
