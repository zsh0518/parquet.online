import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Parquet to Excel Converter Online | Export Parquet to XLSX Free (Fast & Private)",
  description:
    "Convert Apache Parquet files to Excel (.xlsx) format online for free. Browser-based converter with SQL filtering and instant export. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "parquet to excel",
    "convert parquet to excel online",
    "parquet xlsx converter free",
    "export parquet to excel",
    "parquet to excel mac windows",
    "parquet to xlsx",
    "parquet spreadsheet export",
    "parquet to excel browser",
  ],
  alternates: {
    canonical: "/parquet-to-excel",
  },
  openGraph: {
    title:
      "Parquet to Excel Converter Online | Export Parquet to XLSX Free (Fast & Private)",
    description:
      "Convert Parquet to Excel in your browser using DuckDB-WASM. Filter with SQL, preview data, and export instantly. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a Parquet file to Excel format online?",
    answer:
      "Upload or drag your .parquet file into the converter. Preview the data, optionally filter with SQL, then click 'Export Excel' to download the .xlsx file instantly.",
  },
  {
    question: "What Excel format is generated from Parquet files?",
    answer:
      "The converter exports modern Excel format (.xlsx). Data is placed in the first worksheet with column headers, preserving data types and formatting for immediate use in Excel or Google Sheets.",
  },
  {
    question: "Where is my Parquet data processed during Excel conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Parquet file is never uploaded to any server, ensuring complete privacy for sensitive business data.",
  },
  {
    question: "Can I filter Parquet data before exporting to Excel?",
    answer:
      "Yes. Use the built-in SQL editor to filter rows, select specific columns, or aggregate data with SELECT, WHERE, GROUP BY, and other SQL clauses before exporting to Excel.",
  },
  {
    question: "How do I handle large Parquet files when converting to Excel?",
    answer:
      "Excel has a limit of ~1 million rows per sheet. Use SQL queries with LIMIT or WHERE clauses to export only the data you need, or split large datasets into multiple exports.",
  },
];

export default function ParquetToExcel() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer exportType="excel" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet to Excel Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Apache Parquet files to Excel (.xlsx) format online.
              Perfect for sharing data with business users, creating reports,
              and importing into spreadsheet applications. Powered by
              DuckDB-WASM for fast, private, local conversion in any modern
              browser on Windows, macOS, and Linux.
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
                converting to Excel format.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Excel-Ready Output
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Exports modern .xlsx format with column headers and proper data
                types. Opens directly in Microsoft Excel, Google Sheets, and
                other spreadsheet applications.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
