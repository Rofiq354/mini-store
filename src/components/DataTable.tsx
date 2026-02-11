"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  searchable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  initialPageSize?: number;
  searchPlaceholder?: string;
}

export function DataTable<T>({
  data,
  columns,
  initialPageSize = 10,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) => {
      return columns.some((col) => {
        if (!col.searchable) return false;
        const value =
          typeof col.accessor === "function" ? "" : String(item[col.accessor]);
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-10 bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={`h-12 px-4 font-semibold text-foreground ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="mb-2 h-8 w-8 opacity-40" />
                    <p className="text-sm font-medium">No results found</p>
                    {searchQuery && (
                      <p className="text-xs mt-1">
                        Try adjusting your search to find what you're looking
                        for.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className="px-4 py-4">
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline">
            Rows per page
          </span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-9 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            <span className="font-medium text-foreground">
              {filteredData.length > 0 ? startIndex + 1 : 0}
            </span>
            {" - "}
            <span className="font-medium text-foreground">
              {Math.min(startIndex + pageSize, filteredData.length)}
            </span>
            {" of "}
            <span className="font-medium text-foreground">
              {filteredData.length}
            </span>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <div className="flex items-center justify-center text-sm font-medium min-w-25">
              Page {currentPage} of {totalPages || 1}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
