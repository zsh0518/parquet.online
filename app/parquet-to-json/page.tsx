import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Parquet to JSON Converter Online | Export Parquet to JSON Free (Fast & Private)",
  description:
    "Convert Apache Parquet files to JSON format online for free. Browser-based converter with SQL filtering and instant export. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "parquet to json",
    "convert parquet to json online",
    "parquet json converter free",
    "export parquet to json",
    "parquet to json mac windows",
    "parquet json extraction",
    "parquet to json browser",
    "read parquet export json",
  ],
  alternates: {
    canonical: "/parquet-to-json",
  },
  openGraph: {
    title:
      "Parquet to JSON Converter Online | Export Parquet to JSON Free (Fast & Private)",
    description:
      "Convert Parquet to JSON in your browser using DuckDB-WASM. Filter with SQL, preview data, and export instantly. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a Parquet file to JSON format online?",
    answer:
      "Upload or drag your .parquet file into the converter. Preview the data, optionally filter with SQL, then click 'Export JSON' to download the converted file instantly.",
  },
  {
    question: "What JSON structure is generated from Parquet files?",
    answer:
      "The converter exports an array of JSON objects, where each object represents a row from the Parquet file. Column names become JSON keys, and values are properly typed.",
  },
  {
    question: "Where is my Parquet data processed during JSON conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Parquet file is never uploaded to any server, ensuring complete privacy.",
  },
  {
    question: "Can I filter Parquet data before exporting to JSON?",
    answer:
      "Yes. Use the built-in SQL editor to filter, transform, or aggregate your Parquet data with SELECT, WHERE, and other SQL clauses before exporting to JSON.",
  },
  {
    question: "How do I handle large Parquet files when converting to JSON?",
    answer:
      "Use SQL queries with LIMIT or WHERE clauses to export only the data you need. This reduces the JSON file size and speeds up the conversion process.",
  },
];

export default function ParquetToJson() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer exportType="json" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet to JSON Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Apache Parquet files to JSON format online. Perfect for
              extracting data from Parquet for APIs, web applications, and data
              interchange. Powered by DuckDB-WASM for fast, private, local
              conversion in any modern browser on Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                SQL Filtering & Preview
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Preview Parquet data before exporting. Use SQL queries to
                filter, select specific columns, or aggregate data before
                converting to JSON format.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Structured JSON Output
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Exports properly formatted JSON with correct data types. Each
                Parquet row becomes a JSON object with column names as keys,
                ready for immediate use in applications.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
