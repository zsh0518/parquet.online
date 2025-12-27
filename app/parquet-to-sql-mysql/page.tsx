import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Parquet to MySQL Converter Online | Export Parquet to MySQL SQL Free (Fast & Private)",
  description:
    "Convert Apache Parquet files to MySQL INSERT statements online for free. Browser-based converter with SQL filtering and instant export. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "parquet to mysql",
    "convert parquet to mysql online",
    "parquet mysql converter free",
    "export parquet to mysql",
    "parquet to mysql insert",
    "parquet mysql sql statements",
    "parquet to mysql browser",
    "parquet mysql migration",
  ],
  alternates: {
    canonical: "/parquet-to-sql-mysql",
  },
  openGraph: {
    title:
      "Parquet to MySQL Converter Online | Export Parquet to MySQL SQL Free (Fast & Private)",
    description:
      "Convert Parquet to MySQL INSERT statements in your browser using DuckDB-WASM. Filter with SQL, preview data, and export instantly. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a Parquet file to MySQL INSERT statements?",
    answer:
      "Upload or drag your .parquet file into the converter. Preview the data, optionally filter with SQL, then click 'Export MySQL SQL' to download the .sql file with INSERT statements.",
  },
  {
    question: "What MySQL SQL syntax is generated from Parquet files?",
    answer:
      "The converter generates standard MySQL INSERT statements with proper value escaping and quoting. Each row becomes an INSERT statement, ready to execute in MySQL databases.",
  },
  {
    question: "Where is my Parquet data processed during MySQL conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Parquet file is never uploaded to any server, ensuring complete privacy for sensitive database data.",
  },
  {
    question: "Can I filter or transform data before exporting to MySQL?",
    answer:
      "Yes. Use the built-in SQL editor to filter rows, select specific columns, or transform data with WHERE, SELECT, and other SQL clauses before generating MySQL INSERT statements.",
  },
  {
    question: "How do I import the generated SQL file into MySQL?",
    answer:
      "After downloading the .sql file, run 'mysql -u username -p database_name < file.sql' in your terminal, or use MySQL Workbench to execute the SQL statements directly.",
  },
];

export default function ParquetToMySql() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer exportType="sql-mysql" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet to MySQL Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Apache Parquet files to MySQL INSERT statements online.
              Perfect for migrating data to MySQL databases, creating test data,
              and importing Parquet data into MySQL. Powered by DuckDB-WASM for
              fast, private, local conversion in any modern browser on Windows,
              macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                SQL Filtering & Preview
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Preview Parquet data before exporting. Use SQL queries to
                filter, select specific columns, or transform data before
                generating MySQL INSERT statements.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                MySQL-Ready SQL
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Generates standard MySQL INSERT statements with proper escaping
                and quoting. Ready to execute directly in MySQL databases or
                import via mysql command-line tool.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
