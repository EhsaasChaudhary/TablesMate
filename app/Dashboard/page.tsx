"use client";

import { useState, useMemo, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Database,
  TableIcon,
  Columns,
  Rows,
  FileSpreadsheet,
  Table2,
  Info,
  PlusCircle,
} from "lucide-react";
import { TableStateContext } from "../components/idbprovider";
import Link from "next/link";
import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const navItems = [
  {
    name: "Table Workspace",
    href: "/TableWorkspace",
    icon: <Table2 className="mr-2 h-4 w-4" />,
  },
  {
    name: "Data Workspace",
    href: "/DataWorkspace",
    icon: <FileSpreadsheet className="mr-2 h-4 w-4" />,
  },
  {
    name: "Add Data",
    href: "/TableWorkspace",
    icon: <Table2 className="mr-2 h-4 w-4" />,
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#A4DE6C",
  "#D0ED57",
];

export default function Dashboard() {
  const context = useContext(TableStateContext);
  if (!context) {
    throw new Error("Context Not found reload the App");
  }
  const { tables } = context;

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  useEffect(() => {
    const firstTable = Object.keys(tables)[0] || null;
    setSelectedTable(firstTable);
  }, [tables]);

  const stats = useMemo(() => {
    const totalTables = Object.keys(tables).length;
    let totalRows = 0;
    let totalColumns = 0;
    let mostPopulatedTable = { name: "", count: 0 };
    let mostColumnsTable = { name: "", count: 0 };

    Object.entries(tables).forEach(([name, data]) => {
      totalRows += data.rows.length;
      totalColumns += data.columns.length;

      if (data.rows.length > mostPopulatedTable.count) {
        mostPopulatedTable = { name, count: data.rows.length };
      }

      if (data.columns.length > mostColumnsTable.count) {
        mostColumnsTable = { name, count: data.columns.length };
      }
    });

    return {
      totalTables,
      totalRows,
      totalColumns,
      mostPopulatedTable,
      mostColumnsTable,
    };
  }, [tables]);

  const pieChartData = useMemo(() => {
    return Object.entries(tables).map(([name, data]) => ({
      name,
      value: data.rows.length,
    }));
  }, [tables]);

  const barChartData = useMemo(() => {
    return Object.entries(tables).map(([name, data]) => ({
      name,
      rows: data.rows.length,
    }));
  }, [tables]);

  const selectedTableStats = useMemo(() => {
    if (!selectedTable) return null;

    const tableData = tables[selectedTable];
    return {
      name: selectedTable,
      columns: tableData.columns.length,
      rows: tableData.rows.length,
      columnNames: tableData.columns,
    };
  }, [selectedTable, tables]);
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-3xl font-bold text-primary">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="default"
              asChild
              className="text-xs sm:text-sm"
            >
              <Link href={item.href} className="flex items-center space-x-1">
                {item.icon}
                <span className="sm:inline">{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTables}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <Rows className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRows}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Columns</CardTitle>
            <Columns className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalColumns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Populated Table
            </CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.mostPopulatedTable.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.mostPopulatedTable.count} rows
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Table with Most Columns
            </CardTitle>
            <Columns className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.mostColumnsTable.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.mostColumnsTable.count} columns
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(tables).length === 0 ? (
        // Render when no tables are available

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              No Data Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <Info className="h-4 w-4" />
              <DialogTitle>Getting Started</DialogTitle>
              <DialogDescription>
                To begin using the application, you will need to add columns and
                rows to your tables.
              </DialogDescription>
            </Dialog>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Create your first table and start organizing your data
                efficiently.
              </p>
              <Table className="h-16 w-16 mx-auto text-primary" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="default" size="lg" asChild>
              <Link href={"/TableWorkspace"} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Table
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Render Table-Specific Statistics when tables exist
        <>
          <Card>
            <CardHeader>
              <CardTitle>Table-Specific Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={setSelectedTable}
                value={selectedTable || undefined}
              >
                <SelectTrigger className="w-full">
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

              {selectedTableStats && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Table Name
                        </CardTitle>
                        <TableIcon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          {selectedTableStats.name}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Columns
                        </CardTitle>
                        <Columns className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          {selectedTableStats.columns}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Rows
                        </CardTitle>
                        <Rows className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          {selectedTableStats.rows}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Column Names</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column Name</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTableStats.columnNames.length > 0 ? (
                              selectedTableStats.columnNames.map(
                                (columnName) => (
                                  <TableRow key={columnName}>
                                    <TableCell>{columnName}</TableCell>
                                  </TableRow>
                                )
                              )
                            ) : (
                              <TableRow>
                                <TableCell className="text-center">
                                  No columns found, Please add columns on Table
                                  Workspace
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Render statistics section only if there are columns and rows */}
          {Object.values(tables).some(
            (table) => table.columns.length > 0 && table.rows.length > 0
          ) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Distribution Across Tables</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Row Count per Table</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rows" fill="#8884d8">
                        {barChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="mt-6">
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground sm:text-lg font-semibold">
                  No data available. Please add columns and rows to your tables.
                </p>
                <Button
                  variant="default"
                  asChild
                  className="text-xs sm:text-sm"
                >
                  <Link
                    href={navItems[2].href}
                    className="flex items-center space-x-1"
                  >
                    {navItems[2].icon}
                    <span className="sm:inline">{navItems[2].name}</span>
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
