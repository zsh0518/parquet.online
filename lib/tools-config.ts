import {
  FileSpreadsheet,
  Database,
  FileJson,
  FileText,
  FileInput,
  FileCode,
  Code2,
  Table,
  Eye,
  FileSearch,
  TableProperties,
  Search,
  LucideIcon,
} from "lucide-react";

export interface Tool {
  name: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string; // 可选的徽章，如 "New", "Popular" 等
}

export interface ToolGroup {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "viewer",
    title: "View & Explore",
    description: "Open and explore Parquet files directly in your browser",
    icon: Eye,
    tools: [
      {
        name: "Parquet Viewer/Reader",
        desc: "View and browse Parquet file contents online",
        href: "/parquet-viewer",
        icon: Eye,
      },
      {
        name: "SQL Query Editor",
        desc: "Query Parquet files using SQL syntax",
        href: "/sql-editor",
        icon: Search,
      },
    ],
  },
  {
    id: "export-convert",
    title: "Export & Convert",
    description: "Convert Parquet files to human-readable formats",
    icon: FileText,
    tools: [
      {
        name: "Parquet to JSON",
        desc: "Convert Parquet to JSON",
        href: "/parquet-to-json",
        icon: FileJson,
      },
      {
        name: "Parquet to CSV",
        desc: "Convert Parquet to CSV",
        href: "/parquet-to-csv",
        icon: FileSpreadsheet,
      },
      {
        name: "Parquet to TSV",
        desc: "Convert Parquet to TSV",
        href: "/parquet-to-tsv",
        icon: Table,
      },
      {
        name: "Parquet to Excel",
        desc: "Convert Parquet to Excel",
        href: "/parquet-to-excel",
        icon: FileSpreadsheet,
      },
      {
        name: "Parquet to MySQL",
        desc: "Convert Parquet to MySQL INSERT statements",
        href: "/parquet-to-sql-mysql",
        icon: Database,
      },
      {
        name: "Parquet to PostgreSQL",
        desc: "Convert Parquet to PostgreSQL INSERT statements",
        href: "/parquet-to-sql-postgres",
        icon: Database,
      },
    ],
  },
  {
    id: "create-build",
    title: "Create & Build",
    description: "Compress your data into efficient columnar Parquet format",
    icon: FileInput,
    tools: [
      {
        name: "CSV to Parquet",
        desc: "Convert CSV files to Parquet",
        href: "/csv-to-parquet",
        icon: FileInput,
      },
      {
        name: "JSON to Parquet",
        desc: "Convert JSON files to Parquet",
        href: "/json-to-parquet",
        icon: FileCode,
      },
      {
        name: "Excel to Parquet",
        desc: "Convert Excel files to Parquet",
        href: "/excel-to-parquet",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "Python Parquet guides and ready-to-use code snippets",
    icon: Code2,
    tools: [
      {
        name: "Python: Read Parquet",
        desc: "Pandas, PyArrow, PySpark read snippets",
        href: "/guides/python-read-parquet",
        icon: Code2,
      },
      {
        name: "Python: Convert Parquet",
        desc: "Parquet to CSV/JSON/Excel code",
        href: "/guides/python-convert-parquet",
        icon: Code2,
      },
      {
        name: "Python: Write Parquet",
        desc: "Save DataFrames with compression/partitioning",
        href: "/guides/python-write-parquet",
        icon: Code2,
      },
    ],
  },
];
