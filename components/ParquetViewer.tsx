"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDuckDB } from "@/lib/duckdb";
import {
  Loader2,
  Table as TableIcon,
  Database,
  Code2,
  X,
  CheckCircle2,
  Clock,
  FileCode,
} from "lucide-react";
import * as duckdb from "@duckdb/duckdb-wasm";
import { FileUploader } from "./FileUploader";
import { DataTable, ExportType } from "./DataTable";
import { SQLEditor } from "./SQLEditor";

// 阈值配置
const FULL_LOAD_THRESHOLD = 10000; // 小于此值直接全部加载
const WINDOW_SIZE = 1000; // 大数据量时每次加载的窗口大小
const SQL_RESULT_LIMIT = 10000; // SQL 查询结果最大行数

// 导出类型配置映射
const EXPORT_CONFIG: Record<
  ExportType,
  { title: string; description: string; fileExt: string }
> = {
  json: {
    title: "Parquet to JSON Converter",
    description: "Convert Parquet files to JSON format online",
    fileExt: ".json",
  },
  csv: {
    title: "Parquet to CSV Converter",
    description: "Convert Parquet files to CSV format online",
    fileExt: ".csv",
  },
  tsv: {
    title: "Parquet to TSV Converter",
    description: "Convert Parquet files to TSV format online",
    fileExt: ".tsv",
  },
  excel: {
    title: "Parquet to Excel Converter",
    description: "Convert Parquet files to Excel (.xlsx) format online",
    fileExt: ".xlsx",
  },
  "sql-mysql": {
    title: "Parquet to MySQL Converter",
    description: "Convert Parquet files to MySQL INSERT statements",
    fileExt: ".sql",
  },
  "sql-postgres": {
    title: "Parquet to PostgreSQL Converter",
    description: "Convert Parquet files to PostgreSQL INSERT statements",
    fileExt: ".sql",
  },
};

interface ParquetData {
  rows: Record<string, unknown>[];
  columns: string[];
  fileName: string;
  totalRows: number;
  isFullyLoaded: boolean;
  windowStart: number;
}

interface SQLQueryResult {
  rows: Record<string, unknown>[];
  columns: string[];
  executionTime: number;
  rowCount: number;
}

interface SchemaColumn {
  name: string;
  type: string;
}

// 根据数据类型返回对应的颜色类名
function getTypeColor(type: string): string {
  const lowerType = type.toLowerCase();

  // 整数类型
  if (
    lowerType.includes("int") ||
    lowerType.includes("integer") ||
    lowerType.includes("bigint") ||
    lowerType.includes("smallint") ||
    lowerType.includes("tinyint")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  // 浮点类型
  if (
    lowerType.includes("float") ||
    lowerType.includes("double") ||
    lowerType.includes("decimal") ||
    lowerType.includes("numeric") ||
    lowerType.includes("real")
  ) {
    return "bg-cyan-100 text-cyan-700";
  }

  // 字符串类型
  if (
    lowerType.includes("varchar") ||
    lowerType.includes("char") ||
    lowerType.includes("string") ||
    lowerType.includes("text")
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  // 布尔类型
  if (lowerType.includes("bool") || lowerType.includes("boolean")) {
    return "bg-amber-100 text-amber-700";
  }

  // 日期时间类型
  if (
    lowerType.includes("date") ||
    lowerType.includes("time") ||
    lowerType.includes("timestamp")
  ) {
    return "bg-purple-100 text-purple-700";
  }

  // 二进制类型
  if (
    lowerType.includes("blob") ||
    lowerType.includes("binary") ||
    lowerType.includes("bytes")
  ) {
    return "bg-gray-200 text-gray-700";
  }

  // 数组/列表类型
  if (lowerType.includes("list") || lowerType.includes("array")) {
    return "bg-orange-100 text-orange-700";
  }

  // 结构体/对象类型
  if (
    lowerType.includes("struct") ||
    lowerType.includes("map") ||
    lowerType.includes("json")
  ) {
    return "bg-pink-100 text-pink-700";
  }

  // 默认颜色
  return "bg-gray-100 text-gray-700";
}

interface ParquetViewerProps {
  exportType?: ExportType;
  showDescription?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  defaultShowSchema?: boolean;
  defaultShowSQLEditor?: boolean;
  enableExport?: boolean;
}

export default function ParquetViewer({
  exportType = "json",
  showDescription = true,
  pageTitle,
  pageDescription,
  defaultShowSchema = false,
  defaultShowSQLEditor = false,
  enableExport = true,
}: ParquetViewerProps) {
  const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState<ParquetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SQL 编辑器相关状态
  const [showSQLEditor, setShowSQLEditor] = useState(defaultShowSQLEditor);
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState<SQLQueryResult | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [isExecutingSQL, setIsExecutingSQL] = useState(false);

  // Schema 查看相关状态
  const [showSchema, setShowSchema] = useState(defaultShowSchema);
  const [schema, setSchema] = useState<SchemaColumn[] | null>(null);

  // 获取当前导出配置
  const currentConfig = EXPORT_CONFIG[exportType];

  // 保存当前文件名
  const currentFileRef = useRef<string | null>(null);

  // 初始化数据库
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await getDuckDB();
        setDb(database);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Failed to initialize DuckDB");
        setLoading(false);
      }
    };
    initDB();
  }, []);

  // 当文件变化时，更新 SQL 模板
  useEffect(() => {
    if (data?.fileName) {
      setSqlQuery(`-- Query your data using SQL
-- Table: '${data.fileName}'

SELECT * FROM '${data.fileName}'`);
    }
  }, [data?.fileName]);

  // 查询数据窗口
  const queryDataWindow = useCallback(
    async (fileName: string, offset: number, limit: number) => {
      if (!db) return null;

      const conn = await db.connect();
      try {
        const result = await conn.query(
          `SELECT * FROM '${fileName}' LIMIT ${limit} OFFSET ${offset}`
        );
        return result.toArray().map((row) => row.toJSON());
      } finally {
        await conn.close();
      }
    },
    [db]
  );

  // 处理文件上传与初始查询
  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!db) return;

      setProcessing(true);
      setError(null);
      setSqlResult(null);
      setSqlError(null);
      setSchema(null);
      currentFileRef.current = file.name;

      try {
        await db.registerFileHandle(
          file.name,
          file,
          duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
          true
        );

        const conn = await db.connect();

        // 查询 Schema
        const schemaResult = await conn.query(
          `DESCRIBE SELECT * FROM '${file.name}'`
        );
        const schemaArray = schemaResult.toArray().map((row) => {
          const rowData = row.toJSON();
          return {
            name: String(rowData.column_name),
            type: String(rowData.column_type),
          };
        });
        setSchema(schemaArray);

        const countResult = await conn.query(
          `SELECT COUNT(*) as cnt FROM '${file.name}'`
        );
        const totalRows = Number(countResult.toArray()[0].cnt);

        const isSmallDataset = totalRows <= FULL_LOAD_THRESHOLD;
        const limit = isSmallDataset ? totalRows : WINDOW_SIZE;

        const result = await conn.query(
          `SELECT * FROM '${file.name}' LIMIT ${limit}`
        );

        const resultArray = result.toArray().map((row) => row.toJSON());

        if (resultArray.length > 0 || totalRows === 0) {
          setData({
            rows: resultArray,
            columns: resultArray.length > 0 ? Object.keys(resultArray[0]) : [],
            fileName: file.name,
            totalRows,
            isFullyLoaded: isSmallDataset,
            windowStart: 0,
          });
        } else {
          setData(null);
          setError("File is empty or could not be parsed.");
        }

        await conn.close();
      } catch (err: unknown) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "Error processing parquet file";
        setError(errorMessage);
      } finally {
        setProcessing(false);
      }
    },
    [db]
  );

  // 处理分页请求
  const handlePageChange = useCallback(
    async (pageIndex: number, pageSize: number) => {
      if (!data || data.isFullyLoaded || !currentFileRef.current) return;

      const requiredStart = pageIndex * pageSize;
      const requiredEnd = requiredStart + pageSize;

      const currentWindowEnd = data.windowStart + data.rows.length;

      if (
        requiredStart >= data.windowStart &&
        requiredEnd <= currentWindowEnd
      ) {
        return;
      }

      const newWindowStart = Math.max(
        0,
        requiredStart - Math.floor(WINDOW_SIZE / 4)
      );

      setProcessing(true);

      try {
        const newRows = await queryDataWindow(
          currentFileRef.current,
          newWindowStart,
          WINDOW_SIZE
        );

        if (newRows) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  rows: newRows,
                  windowStart: newWindowStart,
                }
              : null
          );
        }
      } catch (err) {
        console.error("Failed to load data window:", err);
      } finally {
        setProcessing(false);
      }
    },
    [data, queryDataWindow]
  );

  // 执行 SQL 查询
  const handleExecuteSQL = useCallback(async () => {
    if (!db || !sqlQuery.trim()) return;

    setIsExecutingSQL(true);
    setSqlError(null);

    const startTime = performance.now();

    try {
      const conn = await db.connect();

      // 添加 LIMIT 保护，防止返回过多数据
      let queryToExecute = sqlQuery.trim();
      const hasLimit = /\bLIMIT\s+\d+/i.test(queryToExecute);
      if (!hasLimit) {
        queryToExecute = `${queryToExecute} LIMIT ${SQL_RESULT_LIMIT}`;
      }

      const result = await conn.query(queryToExecute);
      const resultArray = result.toArray().map((row) => row.toJSON());

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      setSqlResult({
        rows: resultArray,
        columns: resultArray.length > 0 ? Object.keys(resultArray[0]) : [],
        executionTime,
        rowCount: resultArray.length,
      });

      await conn.close();
    } catch (err: unknown) {
      console.error("SQL execution error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "SQL execution failed";
      setSqlError(errorMessage);
      setSqlResult(null);
    } finally {
      setIsExecutingSQL(false);
    }
  }, [db, sqlQuery]);

  // 关闭 SQL 结果
  const handleCloseSQLResult = () => {
    setSqlResult(null);
    setSqlError(null);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Initializing Engine...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* 头部区域 */}
      {showDescription && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {pageTitle || currentConfig.title}
          </h1>
        </div>
      )}

      {/* 上传区域 */}
      <FileUploader
        accept=".parquet"
        isProcessing={processing}
        onFileSelect={handleFileSelect}
        title="Click to Upload or Drag Parquet File"
        description="Data will never be uploaded to any server"
      />

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      {/* 文件已加载后的功能区 */}
      {data && (
        <div className="space-y-6">
          {/* 文件信息栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TableIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">{data.fileName}</h2>
              {/* 数据统计 */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Database className="h-4 w-4" />
                <span>{data.totalRows.toLocaleString()} rows</span>
              </div>
              {!data.isFullyLoaded && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                  Virtual Scroll Mode
                </div>
              )}
            </div>
            {processing && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>

          {/* 数据表格（SQL Editor 在工具栏和表格之间） */}
          <DataTable
            data={sqlResult ? sqlResult.rows : data.rows}
            columns={sqlResult ? sqlResult.columns : data.columns}
            totalRows={sqlResult ? sqlResult.rowCount : data.totalRows}
            isServerSide={sqlResult ? false : !data.isFullyLoaded}
            windowStart={sqlResult ? 0 : data.windowStart}
            onPageChange={sqlResult ? undefined : handlePageChange}
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 50, 100]}
            exportConfig={
              enableExport
                ? {
                    type: exportType,
                    filename: data.fileName.replace(".parquet", ""),
                    tableName: data.fileName
                      .replace(".parquet", "")
                      .replace(/[^a-zA-Z0-9_]/g, "_"),
                  }
                : undefined
            }
            toolbarContent={
              <>
                {/* SQL Editor 按钮 */}
                <button
                  onClick={() => {
                    setShowSQLEditor(!showSQLEditor);
                    if (!showSQLEditor) setShowSchema(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-all shadow-sm ${
                    showSQLEditor
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <Code2 className="h-4 w-4" />
                  <span>SQL Editor</span>
                </button>

                {/* Schema 按钮 */}
                <button
                  onClick={() => {
                    setShowSchema(!showSchema);
                    if (!showSchema) setShowSQLEditor(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-all shadow-sm ${
                    showSchema
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <FileCode className="h-4 w-4" />
                  <span>Schema</span>
                </button>

                {/* SQL 结果关闭按钮 */}
                {sqlResult && (
                  <button
                    onClick={handleCloseSQLResult}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    title="Clear SQL results"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Results</span>
                  </button>
                )}

                {/* SQL 执行状态 */}
                {sqlResult && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{sqlResult.executionTime.toFixed(2)}ms</span>
                    </div>
                    <div className="text-gray-500">
                      {sqlResult.rowCount.toLocaleString()} rows
                    </div>
                  </div>
                )}
              </>
            }
            afterToolbar={
              <>
                {/* Schema 显示区域 */}
                {showSchema && schema && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Schema
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {schema.length} columns
                        </span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Column
                            </th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {schema.map((col, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-2.5 font-mono text-gray-900">
                                {col.name}
                              </td>
                              <td className="px-4 py-2.5">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(
                                    col.type
                                  )}`}
                                >
                                  {col.type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SQL Editor 区域 */}
                {showSQLEditor && (
                  <div className="space-y-4">
                    <SQLEditor
                      value={sqlQuery}
                      onChange={setSqlQuery}
                      onExecute={handleExecuteSQL}
                      isExecuting={isExecutingSQL}
                    />

                    {/* SQL 错误提示 */}
                    {sqlError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-start gap-3">
                        <X className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Query Error</p>
                          <p className="text-sm mt-1 font-mono">{sqlError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
