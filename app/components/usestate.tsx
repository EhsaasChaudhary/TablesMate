"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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

interface TableData {
  columns: string[];
  rows: Record<string, string>[];
}

export function EnhancedInputForm() {
  const [tables, setTables] = useState<Record<string, TableData>>({});
  const [currentTable, setCurrentTable] = useState<string>("");
  const [newTableName, setNewTableName] = useState<string>("");

  const [columnName, setColumnName] = useState<string>("");
  const [rowData, setRowData] = useState<Record<string, string>>({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedTablesForDeletion, setSelectedTablesForDeletion] = useState<
    string[]
  >([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTableNames, setEditedTableNames] = useState<
    Record<string, string>
  >({});

  const [editColumnsModalOpen, setEditColumnsModalOpen] = useState(false);
  const [editedColumns, setEditedColumns] = useState<string[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [editedRowData, setEditedRowData] = useState<Record<string, string>>(
    {}
  );

  const { toast } = useToast();

  const addNewTables = () => {
    // some function logic
  };

  const handleDeleteTables = () => {
    // some function logic
  };

  const handleSaveTableEdits = () => {
    // some function logic
  };

  const addColumns = () => {
    // some function logic
  };

  const saveColumnChanges = () => {
    // some function logic
  };

  const deleteColumn = (col: string) => {
    // some function logic
  };

  const addRow = () => {
    // some function logic
  };

  const confirmDeleteRow = () => {
   // some function logic
  };

  const saveEditedRow = () => {
    // some function logic
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedTablesForDeletion([]);
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    setEditedColumns((prev) => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setIsDeleteModalOpen(true);
  };

  const handleEditRow = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setEditedRowData({ ...tables[currentTable]?.rows[rowIndex] });
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Table Management</CardTitle>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedTableNames(
                      Object.fromEntries(
                        Object.keys(tables).map((table) => [table, table])
                      )
                    );
                    setEditModalOpen(true);
                  }}
                >
                  Edit Tables
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Table */}
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="newTableName">New Table Name</Label>
                <Input
                  id="newTableName"
                  type="text"
                  placeholder="Enter table names separated by commas, e.g., Users, Orders, etc"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                />
              </div>
              <Button onClick={addNewTables} className="mt-6">
                Add Table
              </Button>
            </div>
            {/* Select Table */}
            <div>
              <Label htmlFor="tableSelect">Select Table</Label>
              <Select value={currentTable} onValueChange={setCurrentTable}>
                <SelectTrigger id="tableSelect">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(tables).map((tableName) => (
                    <SelectItem key={tableName} value={tableName}>
                      {tableName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Delete Modal */}
        <Dialog
          open={deleteModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              handleCloseModal(); // Clear state when modal is closed
            } else {
              setDeleteModalOpen(true);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tables</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Select tables to delete:</Label>
              <div className="space-y-2">
                {Object.keys(tables).map((tableName) => (
                  <div key={tableName} className="flex items-center space-x-2">
                    <Checkbox
                      id={tableName}
                      checked={selectedTablesForDeletion.includes(tableName)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTablesForDeletion((prev) => [
                            ...prev,
                            tableName,
                          ]);
                        } else {
                          setSelectedTablesForDeletion((prev) =>
                            prev.filter((table) => table !== tableName)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={tableName}>{tableName}</Label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmDeleteModalOpen(true);
                  setDeleteModalOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Modal */}
        <Dialog
          open={confirmDeleteModalOpen}
          onOpenChange={setConfirmDeleteModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete the following tables? This
                action cannot be undone:
              </p>
              <ul className="list-disc list-inside">
                {selectedTablesForDeletion.map((tableName) => (
                  <li key={tableName}>{tableName}</li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteTables();
                  setConfirmDeleteModalOpen(false);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tables</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Edit table names:</Label>
              <div className="space-y-2">
                {Object.keys(editedTableNames).map((tableName) => (
                  <div key={tableName} className="flex items-center space-x-2">
                    <Input
                      value={editedTableNames[tableName]}
                      onChange={(e) =>
                        setEditedTableNames((prev) => ({
                          ...prev,
                          [tableName]: e.target.value,
                        }))
                      }
                      placeholder={`Edit name for ${tableName}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleSaveTableEdits();
                  setEditModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* this is the start of columns and data table section */}

        {/* Edit Columns */}
        <Dialog
          open={editColumnsModalOpen}
          onOpenChange={setEditColumnsModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Columns</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editedColumns.map((col, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label htmlFor={`col-${index}`} className="w-24">
                    Column {index + 1}
                  </Label>
                  <Input
                    id={`col-${index}`}
                    type="text"
                    value={col}
                    onChange={(e) =>
                      handleColumnNameChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditColumnsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  saveColumnChanges();
                  setEditColumnsModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AnimatePresence>
          {currentTable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Working on Table: {currentTable}</CardTitle>
                    <div className="space-x-2">
                      <Button
                        onClick={() => {
                          if (currentTable) {
                            setEditedColumns([...tables[currentTable].columns]);
                            setEditColumnsModalOpen(true);
                          }
                        }}
                        disabled={!currentTable}
                        variant="outline"
                      >
                        Edit Columns
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <Label htmlFor="columnName">Column Name</Label>
                      <Input
                        id="columnName"
                        type="text"
                        placeholder="Enter column names seperated by commas, e.g., First name, Last name, Age, etc"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                      />
                    </div>
                    <Button onClick={addColumns} className="mt-6">
                      Add Column
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Add Row</Label>
                    <div className="flex flex-wrap gap-2">
                      {tables[currentTable]?.columns.map((col) => (
                        <div
                          key={col}
                          className="flex items-center space-x-2 w-full sm:max-w-[calc(33%-8px)]"
                        >
                          <Input
                            type="text"
                            className="w-full"
                            placeholder={col}
                            value={rowData[col] || ""}
                            onChange={(e) =>
                              setRowData({ ...rowData, [col]: e.target.value })
                            }
                            aria-label={`Enter value in ${col}`}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteColumn(col)}
                            aria-label={`Delete column ${col}`}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={addRow}>Add Row</Button>
                  </div>

                  {/* table edit modal */}
                  <Dialog
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Row</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {tables[currentTable]?.columns.map((col) => (
                          <div
                            key={col}
                            className="grid grid-cols-4 items-center gap-4"
                          >
                            <Label
                              htmlFor={`edit-${col}`}
                              className="text-right"
                            >
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
                        <Button
                          variant="outline"
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={saveEditedRow}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* table delete modal */}

                  <Dialog
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this row? This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={confirmDeleteRow}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Table Preview
                    </h3>
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Count</TableHead>
                            {tables[currentTable]?.columns.map((col) => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tables[currentTable]?.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
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
                                    variant="ghost"
                                    onClick={() => handleEditRow(rowIndex)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    onClick={() => handleDeleteRow(rowIndex)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </>
  );
}
