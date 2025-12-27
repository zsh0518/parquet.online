# Parquet Tools

[English](./README.md) | [中文](./README.zh-CN.md)

一个基于浏览器的 Parquet 文件在线工具集，使用 DuckDB-WASM 提供高性能的数据处理能力。

## 特性

- **在线查看** - 无需安装任何软件，直接在浏览器中查看 Parquet 文件内容
- **SQL 查询** - 使用 SQL 语法对 Parquet 文件进行查询和分析
- **格式转换** - 支持 Parquet 与 CSV/JSON/Excel/SQL 之间的相互转换
- **Schema 查看** - 查看 Parquet 文件的列结构、数据类型等元信息
- **完全本地** - 所有处理均在浏览器端完成，文件不会上传到服务器

## 功能列表

### 查看与探索

| 功能           | 说明                            |
| -------------- | ------------------------------- |
| Parquet Viewer | 在线查看和浏览 Parquet 文件内容 |
| SQL Editor     | 使用 SQL 语法查询 Parquet 数据  |

### 导出转换 (Parquet → 其他格式)

| 功能                 | 说明                        |
| -------------------- | --------------------------- |
| Parquet → JSON       | 转换为 JSON 格式            |
| Parquet → CSV        | 转换为 CSV 格式             |
| Parquet → TSV        | 转换为 TSV 格式             |
| Parquet → Excel      | 转换为 Excel (.xlsx) 格式   |
| Parquet → MySQL      | 生成 MySQL INSERT 语句      |
| Parquet → PostgreSQL | 生成 PostgreSQL INSERT 语句 |

### 创建构建 (其他格式 → Parquet)

| 功能            | 说明                        |
| --------------- | --------------------------- |
| CSV → Parquet   | 将 CSV 文件转换为 Parquet   |
| JSON → Parquet  | 将 JSON 文件转换为 Parquet  |
| Excel → Parquet | 将 Excel 文件转换为 Parquet |

### 开发者指南

- Python 读取 Parquet 文件代码示例
- Python 转换 Parquet 文件代码示例
- Python 写入 Parquet 文件代码示例

## 技术栈

- **框架**: Next.js 16 / React 19
- **数据引擎**: DuckDB-WASM
- **样式**: Tailwind CSS
- **表格**: TanStack Table
- **代码编辑**: CodeMirror

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## License

MIT

