import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Parquet to CSV Converter Online | Export Parquet to CSV Free (Fast & Private)",
  description:
    "Convert Apache Parquet files to CSV format online for free. Browser-based converter with SQL filtering and instant export. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "parquet to csv",
    "convert parquet to csv online",
    "parquet csv converter free",
    "export parquet to csv",
    "parquet to csv mac windows",
    "parquet csv extraction",
    "parquet to csv browser",
    "read parquet export csv",
  ],
  alternates: {
    canonical: "/parquet-to-csv",
  },
  openGraph: {
    title:
      "Parquet to CSV Converter Online | Export Parquet to CSV Free (Fast & Private)",
    description:
      "Convert Parquet to CSV in your browser using DuckDB-WASM. Filter with SQL, preview data, and export instantly. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a Parquet file to CSV format online?",
    answer:
      "Upload or drag your .parquet file into the converter. Preview the data, optionally filter with SQL, then click 'Export CSV' to download the converted file instantly.",
  },
  {
    question: "What delimiter is used in the exported CSV file?",
    answer:
      "The converter uses standard comma (,) as the delimiter. Values containing commas, quotes, or newlines are automatically quoted and escaped according to CSV standards.",
  },
  {
    question: "Where is my Parquet data processed during CSV conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Parquet file is never uploaded to any server, ensuring complete privacy.",
  },
  {
    question: "Can I select specific columns when converting Parquet to CSV?",
    answer:
      "Yes. Use the SQL editor to SELECT only the columns you need. For example: 'SELECT column1, column2 FROM your_file.parquet' before exporting to CSV.",
  },
  {
    question: "How do I handle large Parquet files when converting to CSV?",
    answer:
      "Use SQL queries with LIMIT or WHERE clauses to export only the rows you need. This reduces the CSV file size and speeds up the conversion and download process.",
  },
];

export default function ParquetToCsv() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer exportType="csv" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet to CSV Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Apache Parquet files to CSV format online. Perfect for
              importing Parquet data into spreadsheets, databases, and legacy
              systems. Powered by DuckDB-WASM for fast, private, local
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
                filter, select specific columns, or transform data before
                converting to CSV format.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Standard CSV Format
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Exports properly formatted CSV with comma delimiters, quoted
                strings, and escaped special characters. Compatible with Excel,
                Google Sheets, and all CSV-reading tools.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
