import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "SQL Query Editor for Parquet | Run SQL on Parquet Online (Free & Private)",
  description:
    "Run SQL queries on Apache Parquet files directly in your browser. No uploads, powered by DuckDB WebAssembly. Filter, aggregate, and inspect Parquet data instantly on Windows, macOS, and Linux.",
  keywords: [
    "run sql on parquet",
    "parquet sql editor online",
    "query parquet in browser",
    "duckdb wasm parquet sql",
    "parquet sql tool mac windows",
    "parquet sql query without spark",
    "parquet select where group by",
    "parquet sql viewer",
  ],
  alternates: {
    canonical: "/sql-editor",
  },
  openGraph: {
    title:
      "SQL Query Editor for Parquet | Run SQL on Parquet Online (Free & Private)",
    description:
      "Query Parquet files with SQL in the browser using DuckDB-WASM. No uploads, fast filtering and aggregation, works on Windows, macOS, and Linux.",
  },
};

const faqItems = [
  {
    question: "How do I run SQL on a Parquet file online?",
    answer:
      "Upload or drag a .parquet file, the SQL Editor opens by default. Type your SELECT query and click Run to get results locally in the browser.",
  },
  {
    question: "What SQL syntax is supported for Parquet queries?",
    answer:
      "DuckDB SQL is supported, including SELECT, WHERE, GROUP BY, ORDER BY, LIMIT, most aggregates, and window functions. Add a LIMIT to sample data faster.",
  },
  {
    question: "Where is my Parquet data processed?",
    answer:
      "All queries run locally in the browser via WebAssembly. Files are never uploaded; closing the tab clears the session.",
  },
  {
    question: "Can this replace Spark or a database for quick checks?",
    answer:
      "It is ideal for ad-hoc sampling, filtering, or schema checks without deploying Spark, Hive, or a database.",
  },
  {
    question: "How do I handle large Parquet files safely?",
    answer:
      "The tool auto-applies a protective LIMIT of up to 10,000 rows. Add your own LIMIT or filters to avoid returning too much data at once.",
  },
];

export default function SQLEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer
        showDescription={true}
        pageTitle="SQL Query Editor for Parquet"
        pageDescription="Query your Parquet files using SQL syntax. Powered by DuckDB WebAssembly - run complex queries entirely in your browser."
        defaultShowSQLEditor={true}
        enableExport={false}
      />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet SQL Query Editor Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Run SQL against Apache Parquet files directly in the browser—ideal
              for data engineering, analytics, and development. No sign-up or
              uploads; DuckDB-WASM powers fast filtering, aggregation, and
              schema validation on modern browsers across Windows, macOS, and
              Linux.
            </p>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
