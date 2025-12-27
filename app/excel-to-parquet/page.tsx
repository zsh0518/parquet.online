import ToParquetConverter from "@/components/ToParquetConverter";
import { Faq } from "@/components/Faq";

export const metadata = {
  title: "Excel to Parquet Converter Online | Convert XLSX to Parquet Free",
  description:
    "Convert Excel (.xlsx, .xls) files to Apache Parquet format online for free. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "excel to parquet",
    "convert excel to parquet online for free",
    "excel to parquet mac windows linux",
  ],
  alternates: {
    canonical: "/excel-to-parquet",
  },
  openGraph: {
    title: "Excel to Parquet Converter Online | Convert XLSX to Parquet Free",
    description:
      "Convert Excel to Parquet in your browser using DuckDB-WASM. Automatic schema detection, compression options, and instant export. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert an Excel file to Parquet format online?",
    answer:
      "Upload or drag your .xlsx or .xls file into the converter. The tool automatically reads the first worksheet, detects the schema, and converts your data. Then click 'Download Parquet' to export.",
  },
  {
    question: "What Excel file formats are supported for Parquet conversion?",
    answer:
      "Both modern Excel (.xlsx) and legacy Excel (.xls) formats are supported. The converter reads the first worksheet by default and preserves column names and data types.",
  },
  {
    question: "Where is my Excel data processed during conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Excel file is never uploaded to any server, ensuring complete privacy for sensitive business data.",
  },
  {
    question:
      "Can I convert Excel files with formulas and formatting to Parquet?",
    answer:
      "The converter extracts the calculated values from cells. Formulas are evaluated and their results are stored in Parquet. Formatting (colors, fonts) is not preserved as Parquet is a data-only format.",
  },
  {
    question:
      "How do I handle large Excel spreadsheets when converting to Parquet?",
    answer:
      "The tool efficiently processes large Excel files in the browser. For very large files (100k+ rows), the conversion may take a few seconds. Choose Zstandard compression to minimize the output Parquet file size.",
  },
];

export default function ExcelToParquetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToParquetConverter sourceType="excel" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Excel to Parquet Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Excel spreadsheets (.xlsx, .xls) to Apache Parquet format
              online. Perfect for transforming business reports, data exports,
              and spreadsheets into efficient columnar storage for analytics.
              Powered by DuckDB-WASM for fast, private, local conversion in any
              modern browser on Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Seamless Excel Import
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Automatically reads Excel worksheets and preserves column names
                and data types. Supports both .xlsx and .xls formats with
                formula evaluation and data extraction.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Analytics-Ready Output
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Convert spreadsheet data to columnar Parquet format optimized
                for analytics tools like Spark, Pandas, and DuckDB. Choose
                compression to reduce file size significantly.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
