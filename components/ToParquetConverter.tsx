"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDuckDB } from "@/lib/duckdb";
import {
  Loader2,
  Table as TableIcon,
  Database,
  Download,
  FileCode,
  CheckCircle2,
  Settings,
  ChevronDown,
  X,
  Plus,
  AlertCircle,
  Info,
} from "lucide-react";
import * as duckdb from "@duckdb/duckdb-wasm";
import * as XLSX from "xlsx";
import { FileUploader } from "./FileUploader";
import { DataTable } from "./DataTable";

// 阈值配置
const FULL_LOAD_THRESHOLD = 10000;
const WINDOW_SIZE = 1000;

// 源文件类型
type SourceType = "csv" | "json" | "excel";

// 压缩类型
type CompressionType = "snappy" | "zstd" | "gzip" | "uncompressed";

// 压缩选项配置
const COMPRESSION_OPTIONS: {
  value: CompressionType;
  label: string;
  description: string;
  badge?: string;
}[] = [
  {
    value: "snappy",
    label: "Snappy",
    description: "Fast compression, good balance",
    badge: "Default",
  },
  {
    value: "zstd",
    label: "Zstandard",
    description: "Best compression ratio",
    badge: "Recommended",
  },
  {
    value: "gzip",
    label: "Gzip",
    description: "Wide compatibility",
  },
  {
    value: "uncompressed",
    label: "None",
    description: "No compression, fastest",
  },
];

// 分隔符选项
const DELIMITER_OPTIONS = [
  { value: "auto", label: "Auto Detect", description: "Let DuckDB detect" },
  { value: ",", label: "Comma (,)", description: "Standard CSV" },
  { value: ";", label: "Semicolon (;)", description: "European CSV" },
  { value: "\t", label: "Tab (\\t)", description: "TSV format" },
  { value: "|", label: "Pipe (|)", description: "Pipe-delimited" },
  { value: "custom", label: "Custom", description: "Enter custom delimiter" },
];

// 默认 NULL 字符串
const DEFAULT_NULL_STRINGS = ["", "NULL", "null", "N/A", "NA", "n/a", "-"];

// 类型配置
const SOURCE_CONFIG: Record<
  SourceType,
  {
    title: string;
    description: string;
    accept: string;
    fileDescription: string;
    showCsvOptions: boolean;
  }
> = {
  csv: {
    title: "CSV to Parquet Converter",
    description: "Convert CSV files to Apache Parquet format",
    accept: ".csv,.tsv,",
    fileDescription: "Your data never leaves your browser",
    showCsvOptions: true,
  },
  json: {
    title: "JSON to Parquet Converter",
    description: "Convert JSON files to Apache Parquet format",
    accept: ".json",
    fileDescription: "Your data never leaves your browser",
    showCsvOptions: false,
  },
  excel: {
    title: "Excel to Parquet Converter",
    description: "Convert Excel files to Apache Parquet format",
    accept: ".xlsx,.xls",
    fileDescription: "Your data never leaves your browser",
    showCsvOptions: false,
  },
};

interface ConvertedData {
  rows: Record<string, unknown>[];
  columns: string[];
  fileName: string;
  totalRows: number;
  isFullyLoaded: boolean;
  windowStart: number;
}

interface SchemaColumn {
  name: string;
  type: string;
}

// CSV 配置接口
interface CSVOptions {
  delimiter: string;
  customDelimiter: string;
  hasHeader: boolean;
  nullStrings: string[];
  allVarchar: boolean;
}

// 根据数据类型返回对应的颜色类名
function getTypeColor(type: string): string {
  const lowerType = type.toLowerCase();

  if (
    lowerType.includes("int") ||
    lowerType.includes("integer") ||
    lowerType.includes("bigint")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    lowerType.includes("float") ||
    lowerType.includes("double") ||
    lowerType.includes("decimal")
  ) {
    return "bg-cyan-100 text-cyan-700";
  }

  if (
    lowerType.includes("varchar") ||
    lowerType.includes("char") ||
    lowerType.includes("string")
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (lowerType.includes("bool")) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    lowerType.includes("date") ||
    lowerType.includes("time") ||
    lowerType.includes("timestamp")
  ) {
    return "bg-purple-100 text-purple-700";
  }

  return "bg-gray-100 text-gray-700";
}

interface ToParquetConverterProps {
  sourceType: SourceType;
  showDescription?: boolean;
}

export default function ToParquetConverter({
  sourceType,
  showDescription = true,
}: ToParquetConverterProps) {
  const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState<ConvertedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Schema 相关状态
  const [showSchema, setShowSchema] = useState(false);
  const [schema, setSchema] = useState<SchemaColumn[] | null>(null);

  // 导出状态
  const [isExporting, setIsExporting] = useState(false);

  // 压缩选项
  const [compression, setCompression] = useState<CompressionType>("snappy");
  const [showCompressionMenu, setShowCompressionMenu] = useState(false);

  // CSV 选项
  const [showCsvOptions, setShowCsvOptions] = useState(false);
  const [csvOptions, setCsvOptions] = useState<CSVOptions>({
    delimiter: "auto",
    customDelimiter: "",
    hasHeader: true,
    nullStrings: [...DEFAULT_NULL_STRINGS],
    allVarchar: false,
  });
  const [newNullString, setNewNullString] = useState("");

  // 保存待处理的文件
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // 获取当前配置
  const currentConfig = SOURCE_CONFIG[sourceType];

  // 保存当前文件名
  const currentFileRef = useRef<string | null>(null);
  const registeredTableRef = useRef<string | null>(null);

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

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-compression-menu]")) {
        setShowCompressionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 查询数据窗口
  const queryDataWindow = useCallback(
    async (tableName: string, offset: number, limit: number) => {
      if (!db) return null;

      const conn = await db.connect();
      try {
        const result = await conn.query(
          `SELECT * FROM "${tableName}" LIMIT ${limit} OFFSET ${offset}`
        );
        return result.toArray().map((row) => row.toJSON());
      } finally {
        await conn.close();
      }
    },
    [db]
  );

  // 构建 CSV 读取选项字符串
  const buildCsvOptions = useCallback(() => {
    const options: string[] = [];

    // 分隔符
    if (csvOptions.delimiter !== "auto") {
      const delim =
        csvOptions.delimiter === "custom"
          ? csvOptions.customDelimiter
          : csvOptions.delimiter;
      if (delim) {
        // 转义特殊字符
        const escapedDelim = delim.replace(/'/g, "''");
        options.push(`delim='${escapedDelim}'`);
      }
    }

    // 表头
    options.push(`header=${csvOptions.hasHeader}`);

    // NULL 字符串
    if (csvOptions.nullStrings.length > 0) {
      const nullStrList = csvOptions.nullStrings
        .map((s) => `'${s.replace(/'/g, "''")}'`)
        .join(", ");
      options.push(`nullstr=[${nullStrList}]`);
    }

    // 强制所有列为字符串
    if (csvOptions.allVarchar) {
      options.push("all_varchar=true");
    }

    return options.length > 0 ? `, ${options.join(", ")}` : "";
  }, [csvOptions]);

  // 处理 CSV 文件
  const processCSV = useCallback(
    async (file: File) => {
      if (!db) return;

      // 注册文件到 DuckDB
      await db.registerFileHandle(
        file.name,
        file,
        duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
        true
      );

      const tableName = `csv_${Date.now()}`;
      registeredTableRef.current = tableName;

      const conn = await db.connect();
      try {
        // 构建读取选项
        const csvOpts = buildCsvOptions();

        // 从 CSV 创建表
        await conn.query(
          `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv('${file.name}'${csvOpts})`
        );

        return tableName;
      } finally {
        await conn.close();
      }
    },
    [db, buildCsvOptions]
  );

  // 处理 JSON 文件
  const processJSON = useCallback(
    async (file: File) => {
      if (!db) return;

      // 读取 JSON 文件内容
      const text = await file.text();
      let jsonData: unknown[];

      try {
        const parsed = JSON.parse(text);
        // 确保是数组
        if (Array.isArray(parsed)) {
          jsonData = parsed;
        } else if (typeof parsed === "object" && parsed !== null) {
          // 如果是对象，尝试找到包含数组的属性
          const arrayKey = Object.keys(parsed).find((key) =>
            Array.isArray(parsed[key])
          );
          if (arrayKey) {
            jsonData = parsed[arrayKey];
          } else {
            // 将单个对象包装成数组
            jsonData = [parsed];
          }
        } else {
          throw new Error("JSON must be an array or an object");
        }
      } catch (e) {
        throw new Error(
          `Invalid JSON format: ${
            e instanceof Error ? e.message : "Unknown error"
          }`
        );
      }

      if (jsonData.length === 0) {
        throw new Error("JSON array is empty");
      }

      // 将 JSON 数据转换为 CSV 格式以便 DuckDB 处理
      const columns = Object.keys(jsonData[0] as Record<string, unknown>);
      const csvContent = [
        columns.join(","),
        ...jsonData.map((row) =>
          columns
            .map((col) => {
              const value = (row as Record<string, unknown>)[col];
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
        ),
      ].join("\n");

      // 创建虚拟 CSV 文件
      const csvBlob = new Blob([csvContent], { type: "text/csv" });
      const csvFile = new File([csvBlob], `${file.name}.csv`, {
        type: "text/csv",
      });

      await db.registerFileHandle(
        csvFile.name,
        csvFile,
        duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
        true
      );

      const tableName = `json_${Date.now()}`;
      registeredTableRef.current = tableName;

      const conn = await db.connect();
      try {
        await conn.query(
          `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${csvFile.name}')`
        );
        return tableName;
      } finally {
        await conn.close();
      }
    },
    [db]
  );

  // 处理 Excel 文件
  const processExcel = useCallback(
    async (file: File) => {
      if (!db) return;

      // 读取 Excel 文件
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 转换为 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        throw new Error("Excel sheet is empty");
      }

      // 将数据转换为 CSV
      const columns = Object.keys(jsonData[0] as Record<string, unknown>);
      const csvContent = [
        columns.join(","),
        ...jsonData.map((row) =>
          columns
            .map((col) => {
              const value = (row as Record<string, unknown>)[col];
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
        ),
      ].join("\n");

      // 创建虚拟 CSV 文件
      const csvBlob = new Blob([csvContent], { type: "text/csv" });
      const csvFile = new File([csvBlob], `${file.name}.csv`, {
        type: "text/csv",
      });

      await db.registerFileHandle(
        csvFile.name,
        csvFile,
        duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
        true
      );

      const tableName = `excel_${Date.now()}`;
      registeredTableRef.current = tableName;

      const conn = await db.connect();
      try {
        await conn.query(
          `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${csvFile.name}')`
        );
        return tableName;
      } finally {
        await conn.close();
      }
    },
    [db]
  );

  // 实际处理文件的函数
  const processFile = useCallback(
    async (file: File) => {
      if (!db) return;

      setProcessing(true);
      setError(null);
      setSchema(null);
      currentFileRef.current = file.name;

      try {
        let tableName: string | undefined;

        // 根据源类型处理文件
        switch (sourceType) {
          case "csv":
            tableName = await processCSV(file);
            break;
          case "json":
            tableName = await processJSON(file);
            break;
          case "excel":
            tableName = await processExcel(file);
            break;
        }

        if (!tableName) {
          throw new Error("Failed to process file");
        }

        const conn = await db.connect();

        // 查询 Schema
        const schemaResult = await conn.query(
          `DESCRIBE SELECT * FROM "${tableName}"`
        );
        const schemaArray = schemaResult.toArray().map((row) => {
          const rowData = row.toJSON();
          return {
            name: String(rowData.column_name),
            type: String(rowData.column_type),
          };
        });
        setSchema(schemaArray);

        // 查询总行数
        const countResult = await conn.query(
          `SELECT COUNT(*) as cnt FROM "${tableName}"`
        );
        const totalRows = Number(countResult.toArray()[0].cnt);

        // 加载数据
        const isSmallDataset = totalRows <= FULL_LOAD_THRESHOLD;
        const limit = isSmallDataset ? totalRows : WINDOW_SIZE;

        const result = await conn.query(
          `SELECT * FROM "${tableName}" LIMIT ${limit}`
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
          err instanceof Error ? err.message : "Error processing file";
        setError(errorMessage);
      } finally {
        setProcessing(false);
      }
    },
    [db, sourceType, processCSV, processJSON, processExcel]
  );

  // 处理文件上传
  const handleFileSelect = useCallback(
    async (file: File) => {
      setPendingFile(file);

      // 如果是 CSV 类型，先展示配置面板让用户确认
      if (sourceType === "csv") {
        setShowCsvOptions(true);
      } else {
        // 非 CSV 直接处理
        await processFile(file);
      }
    },
    [sourceType, processFile]
  );

  // 确认 CSV 配置并处理
  const handleConfirmCsvOptions = useCallback(async () => {
    if (!pendingFile) return;
    setShowCsvOptions(false);
    await processFile(pendingFile);
  }, [pendingFile, processFile]);

  // 处理分页
  const handlePageChange = useCallback(
    async (pageIndex: number, pageSize: number) => {
      if (!data || data.isFullyLoaded || !registeredTableRef.current) return;

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
          registeredTableRef.current,
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

  // 添加 NULL 字符串
  const handleAddNullString = () => {
    if (newNullString && !csvOptions.nullStrings.includes(newNullString)) {
      setCsvOptions((prev) => ({
        ...prev,
        nullStrings: [...prev.nullStrings, newNullString],
      }));
      setNewNullString("");
    }
  };

  // 移除 NULL 字符串
  const handleRemoveNullString = (str: string) => {
    setCsvOptions((prev) => ({
      ...prev,
      nullStrings: prev.nullStrings.filter((s) => s !== str),
    }));
  };

  // 导出为 Parquet
  const handleExportParquet = useCallback(async () => {
    if (!db || !registeredTableRef.current) return;

    setIsExporting(true);
    setError(null);

    try {
      const conn = await db.connect();

      // 生成唯一的 Parquet 文件名（避免缓存问题）
      const timestamp = Date.now();
      const baseName = currentFileRef.current
        ? currentFileRef.current.replace(/\.[^/.]+$/, "")
        : "export";
      const parquetFileName = `${baseName}_${timestamp}.parquet`;

      // 构建压缩选项 - DuckDB 使用大写的压缩算法名称
      const compressionMap: Record<CompressionType, string> = {
        snappy: "SNAPPY",
        zstd: "ZSTD",
        gzip: "GZIP",
        uncompressed: "UNCOMPRESSED",
      };
      const compressionValue = compressionMap[compression];

      // 构建 COPY 语句
      const copyQuery = `COPY "${registeredTableRef.current}" TO '${parquetFileName}' (FORMAT PARQUET, COMPRESSION ${compressionValue})`;

      console.log("Export query:", copyQuery);
      console.log("Selected compression:", compression, "->", compressionValue);

      // 使用 COPY 导出为 Parquet
      await conn.query(copyQuery);

      // 获取导出的文件
      const parquetBuffer = await db.copyFileToBuffer(parquetFileName);

      console.log("Exported file size:", parquetBuffer.byteLength, "bytes");

      // 下载文件 - 使用原始文件名
      const downloadFileName = currentFileRef.current
        ? currentFileRef.current.replace(/\.[^/.]+$/, ".parquet")
        : "export.parquet";

      const blob = new Blob([new Uint8Array(parquetBuffer)], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      a.click();
      URL.revokeObjectURL(url);

      await conn.close();
    } catch (err) {
      console.error("Export error:", err);
      setError(
        `Export failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsExporting(false);
    }
  }, [db, compression]);

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
            {currentConfig.title}
          </h1>
        </div>
      )}

      {/* 上传区域 */}
      <FileUploader
        accept={currentConfig.accept}
        isProcessing={processing}
        onFileSelect={handleFileSelect}
        title={`Click to Upload or Drag ${sourceType.toUpperCase()} File`}
        description={currentConfig.fileDescription}
      />

      {/* CSV 配置面板 */}
      {showCsvOptions && pendingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    CSV Import Options
                  </h3>
                  <p className="text-sm text-gray-500">{pendingFile.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCsvOptions(false);
                  setPendingFile(null);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* 分隔符 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Delimiter
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DELIMITER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setCsvOptions((prev) => ({
                          ...prev,
                          delimiter: opt.value,
                        }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        csvOptions.delimiter === opt.value
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {opt.description}
                      </div>
                    </button>
                  ))}
                </div>
                {csvOptions.delimiter === "custom" && (
                  <input
                    type="text"
                    value={csvOptions.customDelimiter}
                    onChange={(e) =>
                      setCsvOptions((prev) => ({
                        ...prev,
                        customDelimiter: e.target.value,
                      }))
                    }
                    placeholder="Enter custom delimiter"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    maxLength={1}
                  />
                )}
              </div>

              {/* 表头 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Has Header Row
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCsvOptions((prev) => ({ ...prev, hasHeader: true }))
                    }
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      csvOptions.hasHeader
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">Yes</div>
                    <div className="text-xs text-gray-500">
                      First row is column names
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      setCsvOptions((prev) => ({ ...prev, hasHeader: false }))
                    }
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      !csvOptions.hasHeader
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">No</div>
                    <div className="text-xs text-gray-500">
                      No header, generate names
                    </div>
                  </button>
                </div>
              </div>

              {/* NULL 值处理 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Null Value Strings
                  </label>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      These strings will be treated as NULL values
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {csvOptions.nullStrings.map((str) => (
                    <span
                      key={str}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <code className="font-mono">
                        {str === "" ? '""' : str}
                      </code>
                      <button
                        onClick={() => handleRemoveNullString(str)}
                        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNullString}
                    onChange={(e) => setNewNullString(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddNullString()
                    }
                    placeholder="Add custom null string..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                  <button
                    onClick={handleAddNullString}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 类型推断 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type Inference
                  </label>
                  <div className="group relative">
                    <AlertCircle className="h-4 w-4 text-amber-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-64 pointer-events-none">
                      If your data has mixed types (e.g., numbers and text in
                      same column), enable &quot;Force All Varchar&quot; to
                      avoid conversion errors
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCsvOptions((prev) => ({ ...prev, allVarchar: false }))
                    }
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      !csvOptions.allVarchar
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      Auto Detect
                    </div>
                    <div className="text-xs text-gray-500">
                      Infer types automatically
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      setCsvOptions((prev) => ({ ...prev, allVarchar: true }))
                    }
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      csvOptions.allVarchar
                        ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      Force All Varchar
                    </div>
                    <div className="text-xs text-gray-500">
                      Treat all as strings
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCsvOptions(false);
                  setPendingFile(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCsvOptions}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Import CSV
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* 数据表格 */}
          <DataTable
            data={data.rows}
            columns={data.columns}
            totalRows={data.totalRows}
            isServerSide={!data.isFullyLoaded}
            windowStart={data.windowStart}
            onPageChange={handlePageChange}
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 50, 100]}
            toolbarContent={
              <>
                {/* 压缩选择下拉菜单 */}
                <div className="relative" data-compression-menu>
                  <button
                    onClick={() => setShowCompressionMenu(!showCompressionMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    <span>Compression:</span>
                    <span className="font-semibold">
                      {
                        COMPRESSION_OPTIONS.find((o) => o.value === compression)
                          ?.label
                      }
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showCompressionMenu && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {COMPRESSION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setCompression(opt.value);
                            setShowCompressionMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            compression === opt.value ? "bg-blue-50" : ""
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium text-sm ${
                                  compression === opt.value
                                    ? "text-blue-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {opt.label}
                              </span>
                              {opt.badge && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    opt.badge === "Recommended"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {opt.description}
                            </div>
                          </div>
                          {compression === opt.value && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 导出 Parquet 按钮 */}
                <button
                  onClick={handleExportParquet}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>
                    {isExporting ? "Exporting..." : "Download Parquet"}
                  </span>
                </button>

                {/* Schema 按钮 */}
                <button
                  onClick={() => setShowSchema(!showSchema)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-all shadow-sm ${
                    showSchema
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <FileCode className="h-4 w-4" />
                  <span>Schema</span>
                </button>

                {/* 转换成功提示 */}
                <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Ready to export</span>
                </div>
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
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
