"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnResizeMode,
  Header,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Settings2,
  Check,
  Database,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

// 导出类型配置
export type ExportType =
  | "json"
  | "csv"
  | "tsv"
  | "excel"
  | "sql-mysql"
  | "sql-postgres";

export interface ExportConfig {
  type: ExportType;
  filename?: string;
  tableName?: string; // SQL 导出时的表名
}

interface DataTableProps<TData> {
  data: TData[];
  columns: string[];
  totalRows?: number;
  isServerSide?: boolean;
  windowStart?: number;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  toolbarContent?: React.ReactNode;
  afterToolbar?: React.ReactNode; // 工具栏和表格之间的内容
  exportConfig?: ExportConfig;
}

// 排序图标组件
function SortingIndicator({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc") {
    return (
      <div className="p-0.5 rounded bg-blue-100">
        <ArrowUp className="h-3 w-3 text-blue-600" />
      </div>
    );
  }
  if (isSorted === "desc") {
    return (
      <div className="p-0.5 rounded bg-blue-100">
        <ArrowDown className="h-3 w-3 text-blue-600" />
      </div>
    );
  }
  return (
    <div className="p-0.5 rounded opacity-40 group-hover:opacity-100 transition-opacity">
      <ArrowUpDown className="h-3 w-3 text-gray-400" />
    </div>
  );
}

// 列宽调整手柄组件
function ColumnResizer<TData>({
  header,
  isResizing,
}: {
  header: Header<TData, unknown>;
  isResizing: boolean;
}) {
  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={`absolute right-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full cursor-col-resize select-none touch-none transition-all ${
        isResizing
          ? "bg-blue-500 h-full"
          : "bg-gray-300 hover:bg-blue-400 hover:h-6"
      }`}
    />
  );
}

// 列可见性控制组件
function ColumnVisibilityControl({
  allColumns,
  columnVisibility,
  onToggleColumn,
  onToggleAll,
}: {
  allColumns: string[];
  columnVisibility: VisibilityState;
  onToggleColumn: (columnId: string) => void;
  onToggleAll: (visible: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleCount = allColumns.filter(
    (col) => columnVisibility[col] !== false
  ).length;
  const allVisible = visibleCount === allColumns.length;
  const someVisible = visibleCount > 0 && visibleCount < allColumns.length;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
        aria-label="Column settings"
        title="Column settings"
      >
        <Settings2 className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Columns</span>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {visibleCount}/{allColumns.length}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* 头部 */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => onToggleAll(!allVisible)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  allVisible
                    ? "bg-blue-600 border-blue-600"
                    : someVisible
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {allVisible && <Check className="h-3.5 w-3.5 text-white" />}
                {someVisible && !allVisible && (
                  <div className="w-2.5 h-0.5 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">
                {allVisible ? "Hide All" : "Show All"}
              </span>
            </button>
          </div>

          {/* 列列表 */}
          <div className="overflow-y-auto p-2 space-y-1">
            {allColumns.map((col) => {
              const isVisible = columnVisibility[col] !== false;
              return (
                <button
                  key={col}
                  onClick={() => onToggleColumn(col)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isVisible
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {isVisible && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className="truncate font-mono text-xs" title={col}>
                    {col}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// 格式化单元格值
function formatCellValue(value: unknown): {
  display: React.ReactNode;
  type: "null" | "number" | "boolean" | "string" | "object";
} {
  if (value === null || value === undefined) {
    return {
      display: <span className="text-gray-400 italic">null</span>,
      type: "null",
    };
  }

  if (typeof value === "boolean") {
    return {
      display: (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {value ? "true" : "false"}
        </span>
      ),
      type: "boolean",
    };
  }

  if (typeof value === "number" || typeof value === "bigint") {
    const numStr = typeof value === "bigint" ? value.toString() : value;
    return {
      display: (
        <span className="text-indigo-600 font-medium tabular-nums">
          {typeof numStr === "number" ? numStr.toLocaleString() : numStr}
        </span>
      ),
      type: "number",
    };
  }

  if (typeof value === "object") {
    return {
      display: (
        <span className="text-amber-600 font-mono text-xs">
          {JSON.stringify(value)}
        </span>
      ),
      type: "object",
    };
  }

  // 字符串处理
  const strValue = String(value);

  // 检测可能的日期格式
  if (/^\d{4}-\d{2}-\d{2}/.test(strValue)) {
    return {
      display: <span className="text-purple-600">{strValue}</span>,
      type: "string",
    };
  }

  // 检测邮箱
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
    return {
      display: <span className="text-blue-600">{strValue}</span>,
      type: "string",
    };
  }

  // 检测 URL
  if (/^https?:\/\//.test(strValue)) {
    return {
      display: (
        <a
          href={strValue}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {strValue}
        </a>
      ),
      type: "string",
    };
  }

  return {
    display: strValue,
    type: "string",
  };
}

export function DataTable<TData extends Record<string, unknown>>({
  data,
  columns: columnNames,
  totalRows,
  isServerSide = false,
  windowStart = 0,
  onPageChange,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  toolbarContent,
  afterToolbar,
  exportConfig,
}: DataTableProps<TData>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const actualTotalRows = totalRows ?? data.length;
  const pageCount = Math.ceil(actualTotalRows / pageSize);

  const getLocalPageData = useCallback(() => {
    if (!isServerSide) {
      return data;
    }

    const globalStart = pageIndex * pageSize;
    const localStart = globalStart - windowStart;
    const localEnd = localStart + pageSize;

    if (localStart < 0 || localStart >= data.length) {
      return [];
    }

    return data.slice(Math.max(0, localStart), Math.min(data.length, localEnd));
  }, [data, isServerSide, pageIndex, pageSize, windowStart]);

  const displayData = isServerSide ? getLocalPageData() : data;

  const columns = useMemo<ColumnDef<TData>[]>(
    () =>
      columnNames.map((col) => ({
        id: col,
        accessorKey: col,
        header: col,
        enableSorting: !isServerSide,
        enableHiding: true,
        size: 150,
        minSize: 80,
        maxSize: 500,
        cell: ({ getValue }) => {
          const { display } = formatCellValue(getValue());
          return display;
        },
      })),
    [columnNames, isServerSide]
  );

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode,
    enableColumnResizing: true,
    manualPagination: isServerSide,
    pageCount: isServerSide ? pageCount : undefined,
    state: {
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: isServerSide ? 0 : pageIndex,
        pageSize: isServerSide ? pageSize : pageSize,
      },
    },
  });

  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      setPageIndex(newPageIndex);
      if (isServerSide && onPageChange) {
        onPageChange(newPageIndex, pageSize);
      }
    },
    [isServerSide, onPageChange, pageSize]
  );

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(0);
    if (isServerSide && onPageChange) {
      onPageChange(0, newSize);
    }
  };

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const goToFirstPage = () => handlePageChange(0);
  const goToPreviousPage = () => handlePageChange(Math.max(0, pageIndex - 1));
  const goToNextPage = () =>
    handlePageChange(Math.min(pageCount - 1, pageIndex + 1));
  const goToLastPage = () => handlePageChange(pageCount - 1);

  const handleToggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === false ? true : false,
    }));
  };

  const handleToggleAll = (visible: boolean) => {
    const newVisibility: VisibilityState = {};
    columnNames.forEach((col) => {
      newVisibility[col] = visible;
    });
    setColumnVisibility(newVisibility);
  };

  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, actualTotalRows);

  // 格式化 SQL 值
  const formatSQLValue = useCallback(
    (value: unknown, dialect: "mysql" | "postgres"): string => {
      if (value === null || value === undefined) return "NULL";
      if (typeof value === "number" || typeof value === "bigint") {
        return String(value);
      }
      if (typeof value === "boolean") {
        return dialect === "mysql"
          ? value
            ? "1"
            : "0"
          : value
          ? "TRUE"
          : "FALSE";
      }
      // 字符串：转义单引号
      const strValue = String(value).replace(/'/g, "''");
      return `'${strValue}'`;
    },
    []
  );

  // 获取导出按钮显示文本
  const getExportLabel = useCallback((type: ExportType): string => {
    const labels: Record<ExportType, string> = {
      json: "JSON",
      csv: "CSV",
      tsv: "TSV",
      excel: "Excel",
      "sql-mysql": "SQL (MySQL)",
      "sql-postgres": "SQL (PostgreSQL)",
    };
    return labels[type];
  }, []);

  // 导出功能
  const handleExport = useCallback(() => {
    if (!exportConfig) return;

    const visibleColumns = columnNames.filter(
      (col) => columnVisibility[col] !== false
    );
    const filename = exportConfig.filename || `export_${Date.now()}`;
    const tableName =
      exportConfig.tableName || filename.replace(/[^a-zA-Z0-9_]/g, "_");

    // 准备导出数据
    const exportData = data.map((row) => {
      const filteredRow: Record<string, unknown> = {};
      visibleColumns.forEach((col) => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    // 下载文件的通用函数
    const downloadFile = (
      content: string | Blob,
      name: string,
      mimeType?: string
    ) => {
      const blob =
        content instanceof Blob
          ? content
          : new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    };

    switch (exportConfig.type) {
      case "json": {
        const jsonString = JSON.stringify(exportData, null, 2);
        downloadFile(jsonString, `${filename}.json`, "application/json");
        break;
      }

      case "csv": {
        const headers = visibleColumns.join(",");
        const rows = data.map((row) =>
          visibleColumns
            .map((col) => {
              const value = row[col];
              if (value === null || value === undefined) return "";
              const strValue = String(value);
              if (
                strValue.includes(",") ||
                strValue.includes('"') ||
                strValue.includes("\n")
              ) {
                return `"${strValue.replace(/"/g, '""')}"`;
              }
              return strValue;
            })
            .join(",")
        );
        const csvContent = [headers, ...rows].join("\n");
        downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
        break;
      }

      case "tsv": {
        const headers = visibleColumns.join("\t");
        const rows = data.map((row) =>
          visibleColumns
            .map((col) => {
              const value = row[col];
              if (value === null || value === undefined) return "";
              // TSV 中替换制表符和换行符
              return String(value).replace(/\t/g, " ").replace(/\n/g, " ");
            })
            .join("\t")
        );
        const tsvContent = [headers, ...rows].join("\n");
        downloadFile(
          tsvContent,
          `${filename}.tsv`,
          "text/tab-separated-values;charset=utf-8;"
        );
        break;
      }

      case "excel": {
        // 创建工作表数据
        const wsData = [
          visibleColumns,
          ...data.map((row) => visibleColumns.map((col) => row[col])),
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        // 生成 Excel 文件
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        downloadFile(blob, `${filename}.xlsx`);
        break;
      }

      case "sql-mysql":
      case "sql-postgres": {
        const dialect =
          exportConfig.type === "sql-mysql" ? "mysql" : "postgres";
        const quote = dialect === "mysql" ? "`" : '"';

        // 生成 CREATE TABLE 语句
        const createTable = `-- ${
          dialect === "mysql" ? "MySQL" : "PostgreSQL"
        } Export\n-- Generated at ${new Date().toISOString()}\n\n`;

        // 生成 INSERT 语句
        const insertStatements = data.map((row) => {
          const columns = visibleColumns
            .map((col) => `${quote}${col}${quote}`)
            .join(", ");
          const values = visibleColumns
            .map((col) => formatSQLValue(row[col], dialect))
            .join(", ");
          return `INSERT INTO ${quote}${tableName}${quote} (${columns}) VALUES (${values});`;
        });

        const sqlContent = createTable + insertStatements.join("\n");
        downloadFile(sqlContent, `${filename}.sql`, "text/sql;charset=utf-8;");
        break;
      }
    }
  }, [data, columnNames, columnVisibility, exportConfig, formatSQLValue]);

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {toolbarContent}
          {exportConfig && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              title={`Export as ${getExportLabel(exportConfig.type)}`}
            >
              <Download className="h-4 w-4" />
              <span>Export {getExportLabel(exportConfig.type)}</span>
            </button>
          )}
        </div>
        <ColumnVisibilityControl
          allColumns={columnNames}
          columnVisibility={columnVisibility}
          onToggleColumn={handleToggleColumn}
          onToggleAll={handleToggleAll}
        />
      </div>

      {/* 工具栏和表格之间的内容 */}
      {afterToolbar}

      {/* 表格容器 */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table
            className="w-full"
            style={{
              minWidth: table.getCenterTotalSize(),
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-linear-to-b from-gray-50 to-gray-100/80 border-b border-gray-200"
                >
                  {/* 行号列 */}
                  <th className="w-12 px-3 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-linear-to-b from-gray-50 to-gray-100/80 border-r border-gray-200">
                    #
                  </th>
                  {headerGroup.headers.map((header, index) => {
                    const isSorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    const isLastColumn =
                      index === headerGroup.headers.length - 1;

                    return (
                      <th
                        key={header.id}
                        className="relative px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none group"
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            canSort
                              ? "cursor-pointer hover:text-gray-900 transition-colors"
                              : ""
                          }`}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          onKeyDown={(e) => {
                            if (
                              canSort &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={canSort ? 0 : undefined}
                          role={canSort ? "button" : undefined}
                          aria-label={
                            canSort ? `Sort by ${header.column.id}` : undefined
                          }
                        >
                          <span>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                          {canSort && <SortingIndicator isSorted={isSorted} />}
                        </div>

                        {!isLastColumn && (
                          <ColumnResizer
                            header={header}
                            isResizing={header.column.getIsResizing()}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`
                      transition-colors duration-150
                      ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      hover:bg-blue-50/50
                    `}
                  >
                    {/* 行号 */}
                    <td className="w-12 px-3 py-3 text-center text-xs font-medium text-gray-400 tabular-nums sticky left-0 bg-inherit border-r border-gray-100">
                      {isServerSide
                        ? pageIndex * pageSize + rowIndex + 1
                        : (isServerSide ? 0 : pageIndex) * pageSize +
                          rowIndex +
                          1}
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-700 truncate"
                        style={{
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                        }}
                        title={String(cell.getValue() ?? "")}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumnsCount + 1}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Database className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No data available
                      </p>
                      <p className="text-gray-400 text-sm">
                        Upload a file or run a query to see results
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页控制 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        {/* 每页数量选择 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            aria-label="Select page size"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>

        {/* 分页导航 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">
            <span className="font-medium text-gray-900">
              {startRow.toLocaleString()}
            </span>
            {" - "}
            <span className="font-medium text-gray-900">
              {endRow.toLocaleString()}
            </span>
            {" of "}
            <span className="font-medium text-gray-900">
              {actualTotalRows.toLocaleString()}
            </span>
          </span>

          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              onClick={goToFirstPage}
              disabled={!canPreviousPage}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-200"
              aria-label="First page"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4 text-gray-600" />
            </button>

            <button
              onClick={goToPreviousPage}
              disabled={!canPreviousPage}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-200"
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>

            {/* 页码显示 */}
            <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 min-w-[80px] text-center">
              {pageIndex + 1} / {pageCount || 1}
            </div>

            <button
              onClick={goToNextPage}
              disabled={!canNextPage}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-gray-200"
              aria-label="Next page"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>

            <button
              onClick={goToLastPage}
              disabled={!canNextPage}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-gray-200"
              aria-label="Last page"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 总行数 */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {actualTotalRows.toLocaleString()}
            </span>{" "}
            rows
          </span>
        </div>
      </div>
    </div>
  );
}
