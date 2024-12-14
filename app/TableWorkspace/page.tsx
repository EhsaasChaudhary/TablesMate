"use client";

import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { TableStateContext } from "../components/idbprovider";

interface TableData {
  columns: string[];
  rows: Record<string, string>[];
}

export default function Tablespace() {
  const context = useContext(TableStateContext);

  if (!context) {
    throw new Error("Context Not found reload the App");
  }

  const { tables, setTables } = context;
  const { currentTable, setCurrentTable } = context;

  // this is states for table

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState<string>("");
  const [selectedTablesForDeletion, setSelectedTablesForDeletion] = useState<
    string[]
  >([]);
  const [editedTableNames, setEditedTableNames] = useState<
    Record<string, string>
  >({});

  // this is states for columns

  const [columnName, setColumnName] = useState<string>("");
  const [editColumnsModalOpen, setEditColumnsModalOpen] = useState(false);
  const [editedColumns, setEditedColumns] = useState<string[]>([]);

  const { toast } = useToast();

  //   this is function start for table
  const addNewTables = () => {
    if (!newTableName) {
      toast({
        title: "Error",
        description:
          "Please enter one or more table names separated by commas.",
        variant: "destructive",
      });
      return;
    }

    const newTableNames = newTableName
      .split(",")
      .map((table) => table.trim())
      .filter((table) => table && !tables[table]); // Ensure non-empty and unique table names

    if (newTableNames.length > 0) {
      setTables((prevTables) => {
        const updatedTables = { ...prevTables };
        newTableNames.forEach((table) => {
          updatedTables[table] = { columns: [], rows: [] };
        });
        return updatedTables;
      });

      toast({
        title: "Tables Created",
        description: `New tables "${newTableNames.join(
          ", "
        )}" have been created successfully.`,
      });
      setNewTableName(""); // Clear the input field
      setCurrentTable(newTableNames[0]); // Set the first new table as current
    } else {
      toast({
        title: "Error",
        description: "Please enter unique table names.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTables = () => {
    setTables((prevTables) => {
      const updatedTables = { ...prevTables };
  
      // Delete selected tables
      selectedTablesForDeletion.forEach((tableName) => {
        delete updatedTables[tableName];
      });
  
      // Reset `currentTable` if it was deleted
      if (selectedTablesForDeletion.includes(currentTable)) {
        const remainingTables = Object.keys(updatedTables);
        setCurrentTable(remainingTables[0] || ""); // Set to the first remaining table or clear it
      }
  
      return updatedTables;
    });
  
    // Clear selection and show toast
    setSelectedTablesForDeletion([]);
    toast({
      title: "Tables Deleted",
      description: `The tables "${selectedTablesForDeletion.join(", ")}" were successfully deleted.`,
    });
  };
  

  const handleSaveTableEdits = () => {
    const newTableNames = Object.values(editedTableNames);

    // Check for duplicate or empty names
    const hasDuplicates = new Set(newTableNames).size !== newTableNames.length;
    const hasEmptyNames = newTableNames.some((name) => !name.trim());

    if (hasDuplicates || hasEmptyNames) {
      toast({
        title: "Error",
        description:
          "Table names must be unique and non-empty. Please fix the errors and try again.",
        variant: "destructive",
      });
      return;
    }

    setTables((prevTables) => {
      const updatedTables: Record<string, TableData> = {};
      Object.entries(prevTables).forEach(([oldName, data]) => {
        const newName = editedTableNames[oldName];
        updatedTables[newName] = data;
      });
      return updatedTables;
    });

    // Update the current table if its name was changed
    if (editedTableNames[currentTable]) {
      setCurrentTable(editedTableNames[currentTable]);
    }

    toast({
      title: "Changes Saved",
      description: "Table names have been updated successfully.",
    });
  };

  //   this is function start for columns

  const addColumns = () => {
    if (!currentTable) {
      toast({
        title: "Error",
        description: "Please select a table to add columns.",
        variant: "destructive",
      });
      return;
    }

    if (!columnName) {
      toast({
        title: "Error",
        description:
          "Please enter one or more column names separated by commas.",
        variant: "destructive",
      });
      return;
    }

    const newColumns = columnName
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col && !tables[currentTable].columns.includes(col)); // Ensure non-empty and unique column names

    if (newColumns.length > 0) {
      setTables((prevTables) => {
        const updatedTable = { ...prevTables[currentTable] };

        // If there are no existing columns, clear the rows
        if (updatedTable.columns.length === 0) {
          updatedTable.rows = [];
        }

        // Add the new columns
        updatedTable.columns = [...updatedTable.columns, ...newColumns];

        return { ...prevTables, [currentTable]: updatedTable };
      });

      toast({
        title: "Columns Added",
        description: `New columns "${newColumns.join(
          ", "
        )}" have been added to "${currentTable}".`,
      });
      setColumnName(""); // Clear the input field
    } else {
      toast({
        title: "Error",
        description: "Please enter unique column names.",
        variant: "destructive",
      });
    }
  };

  const saveColumnChanges = () => {
    if (currentTable) {
      const oldColumns = tables[currentTable].columns; // Original column names
      const columnMapping = oldColumns.reduce<Record<string, string>>(
        (acc, col, index) => {
          acc[col] = editedColumns[index] || col; // Map old to new or keep the same
          return acc;
        },
        {}
      );

      // Update table with new column names and updated rows
      setTables((prevTables) => {
        const updatedRows = prevTables[currentTable].rows.map((row) =>
          Object.keys(row).reduce<Record<string, string>>((updatedRow, key) => {
            const newKey = columnMapping[key] || key; // Get new column name
            updatedRow[newKey] = row[key]; // Preserve data
            return updatedRow;
          }, {})
        );

        return {
          ...prevTables,
          [currentTable]: {
            ...prevTables[currentTable],
            columns: editedColumns, // Save the new column names
            rows: updatedRows, // Update rows with new column names
          },
        };
      });

      toast({
        title: "Success",
        description: "Columns updated successfully.",
      });
      setEditColumnsModalOpen(false);
    }
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


  return (
    <>
      <div className="w-full max-w-8xl mx-auto p-4 space-y-6">
        <Card className="bg-card">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-2xl font-bold text-primary">
                Table Management
              </CardTitle>
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
                  className="w-full sm:w-auto"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Tables
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full sm:w-auto mt-2 sm:mt-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label htmlFor="newTableName" className="text-sm font-medium">
                New Table Name
              </Label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  id="newTableName"
                  type="text"
                  placeholder="Enter table names separated by commas"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={addNewTables} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </div>
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

        <AnimatePresence>
          {currentTable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Table Card */}
              <Card className="bg-card">
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <CardTitle className="text-xl font-semibold text-primary">
                      Working on Table: {currentTable}
                    </CardTitle>
                    <Button
                      onClick={() => {
                        if (currentTable) {
                          setEditedColumns([...tables[currentTable].columns]);
                          setEditColumnsModalOpen(true);
                        }
                      }}
                      disabled={!currentTable}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Columns
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <Label htmlFor="columnName" className="text-sm font-medium">
                      Column Name
                    </Label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        id="columnName"
                        type="text"
                        placeholder="Enter column names separated by commas"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                        className="flex-grow"
                      />
                      <Button onClick={addColumns} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Column
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Card for Displaying Columns */}
              <Card className="bg-card mt-6">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Columns in {currentTable}
                    <Button variant="default" className="ml-14" asChild>
                      <a href="/DataWorkspace">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Add Data
                      </a>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[100px]">
                            Column ID
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                            Column Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {tables[currentTable]?.columns.map((column, index) => (
                          <tr
                            key={index}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                              {index + 1}
                            </td>
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                              {column}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* modals start here */}

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
              Are you sure you want to delete the following tables? This action
              cannot be undone:
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
      <Toaster />
    </>
  );
}
