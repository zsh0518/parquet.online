# Parquet Tools

[English](./README.md) | [中文](./README.zh-CN.md)

A browser-based Parquet file toolset powered by DuckDB-WASM for high-performance data processing.

## Features

- **Online Viewer** - View Parquet file contents directly in your browser, no installation required
- **SQL Query** - Query and analyze Parquet files using SQL syntax
- **Format Conversion** - Convert between Parquet and CSV/JSON/Excel/SQL formats
- **Schema Viewer** - Inspect column structure, data types, and metadata of Parquet files
- **Fully Local** - All processing happens in your browser, files never leave your machine

## Tools

### View & Explore

| Tool           | Description                           |
| -------------- | ------------------------------------- |
| Parquet Viewer | View and browse Parquet file contents |
| SQL Editor     | Query Parquet data using SQL syntax   |

### Export & Convert (Parquet → Other Formats)

| Tool                 | Description                           |
| -------------------- | ------------------------------------- |
| Parquet → JSON       | Convert to JSON format                |
| Parquet → CSV        | Convert to CSV format                 |
| Parquet → TSV        | Convert to TSV format                 |
| Parquet → Excel      | Convert to Excel (.xlsx) format       |
| Parquet → MySQL      | Generate MySQL INSERT statements      |
| Parquet → PostgreSQL | Generate PostgreSQL INSERT statements |

### Create & Build (Other Formats → Parquet)

| Tool            | Description                    |
| --------------- | ------------------------------ |
| CSV → Parquet   | Convert CSV files to Parquet   |
| JSON → Parquet  | Convert JSON files to Parquet  |
| Excel → Parquet | Convert Excel files to Parquet |

### Developer Guides

- Python: Read Parquet files code snippets
- Python: Convert Parquet files code snippets
- Python: Write Parquet files code snippets

## Tech Stack

- **Framework**: Next.js 16 / React 19
- **Data Engine**: DuckDB-WASM
- **Styling**: Tailwind CSS
- **Table**: TanStack Table
- **Code Editor**: CodeMirror

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## License

MIT
