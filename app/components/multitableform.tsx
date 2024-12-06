"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface TableData {
  columns: string[]
  rows: Record<string, string>[]
}

export function EnhancedInputForm() {
  const [tables, setTables] = useState<Record<string, TableData>>({})
  const [currentTable, setCurrentTable] = useState<string>("")
  const [newTableName, setNewTableName] = useState<string>("")
  const [columnName, setColumnName] = useState<string>("")
  const [rowData, setRowData] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const addNewTable = () => {
    if (newTableName && !tables[newTableName]) {
      setTables((prevTables) => ({
        ...prevTables,
        [newTableName]: { columns: [], rows: [] },
      }))
      setNewTableName("")
      setCurrentTable(newTableName)
      toast({
        title: "Table Created",
        description: `New table "${newTableName}" has been created successfully.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Please enter a unique table name.",
        variant: "destructive",
      })
    }
  }

  const addColumn = () => {
    if (currentTable && columnName) {
      setTables((prevTables) => {
        const updatedTable = {
          ...prevTables[currentTable],
          columns: [...prevTables[currentTable].columns, columnName],
        }
        return { ...prevTables, [currentTable]: updatedTable }
      })
      setColumnName("")
      toast({
        title: "Column Added",
        description: `New column "${columnName}" has been added to "${currentTable}".`,
      })
    }
  }

  const addRow = () => {
    if (currentTable) {
      setTables((prevTables) => {
        const updatedTable = {
          ...prevTables[currentTable],
          rows: [...prevTables[currentTable].rows, { ...rowData }],
        }
        return { ...prevTables, [currentTable]: updatedTable }
      })
      setRowData({})
      toast({
        title: "Row Added",
        description: `New row has been added to "${currentTable}".`,
      })
    }
  }

  return (
    <>
      <div className="container mx-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Table Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="newTableName">New Table Name</Label>
                <Input
                  id="newTableName"
                  type="text"
                  placeholder="Enter table name"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                />
              </div>
              <Button onClick={addNewTable} className="mt-6">Add Table</Button>
            </div>
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
                  <CardTitle>Working on Table: {currentTable}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <Label htmlFor="columnName">Column Name</Label>
                      <Input
                        id="columnName"
                        type="text"
                        placeholder="Enter column name"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                      />
                    </div>
                    <Button onClick={addColumn} className="mt-6">Add Column</Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Add Row</Label>
                    <div className="flex flex-wrap gap-2">
                      {tables[currentTable]?.columns.map((col) => (
                        <Input
                          key={col}
                          type="text"
                          placeholder={col}
                          value={rowData[col] || ""}
                          onChange={(e) =>
                            setRowData({ ...rowData, [col]: e.target.value })
                          }
                          aria-label={`Enter value for ${col}`}
                        />
                      ))}
                    </div>
                    <Button onClick={addRow}>Add Row</Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Table Preview</h3>
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {tables[currentTable]?.columns.map((col) => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tables[currentTable]?.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {tables[currentTable]?.columns.map((col) => (
                                <TableCell key={col}>{row[col] || ""}</TableCell>
                              ))}
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
  )
}

