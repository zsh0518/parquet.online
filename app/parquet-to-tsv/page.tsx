import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Parquet to TSV Converter Online | Export Parquet to TSV Free (Fast & Private)",
  description:
    "Convert Apache Parquet files to TSV (Tab-Separated Values) format online for free. Browser-based converter with SQL filtering and instant export. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "parquet to tsv",
    "convert parquet to tsv online",
    "parquet tsv converter free",
    "export parquet to tsv",
    "parquet to tsv mac windows",
    "parquet tab separated",
    "parquet to tsv browser",
    "tab delimited from parquet",
  ],
  alternates: {
    canonical: "/parquet-to-tsv",
  },
  openGraph: {
    title:
      "Parquet to TSV Converter Online | Export Parquet to TSV Free (Fast & Private)",
    description:
      "Convert Parquet to TSV in your browser using DuckDB-WASM. Filter with SQL, preview data, and export instantly. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a Parquet file to TSV format online?",
    answer:
      "Upload or drag your .parquet file into the converter. Preview the data, optionally filter with SQL, then click 'Export TSV' to download the tab-separated file instantly.",
  },
  {
    question: "What is the difference between TSV and CSV?",
    answer:
      "TSV uses tab characters (\\t) as delimiters instead of commas. This is useful when your data contains many commas, as tabs are less common in text data and reduce the need for quoting.",
  },
  {
    question: "Where is my Parquet data processed during TSV conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your Parquet file is never uploaded to any server, ensuring complete privacy.",
  },
  {
    question: "Can I use SQL to filter data before exporting to TSV?",
    answer:
      "Yes. Use the built-in SQL editor to filter rows, select specific columns, or transform data with WHERE, SELECT, and other SQL clauses before exporting to TSV.",
  },
  {
    question: "How are special characters handled in TSV export?",
    answer:
      "Tab characters within data values are escaped, and newlines are properly quoted. The converter follows TSV standards to ensure data integrity and compatibility with TSV-reading tools.",
  },
];

export default function ParquetToTsv() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer exportType="tsv" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Parquet to TSV Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert Apache Parquet files to TSV (Tab-Separated Values) format
              online. Ideal for data containing commas or when tab delimiters
              are preferred. Powered by DuckDB-WASM for fast, private, local
              conversion in any modern browser on Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Tab-Delimited Format
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Exports data with tab characters as delimiters. Perfect for data
                containing commas or when working with tools that prefer TSV
                over CSV format.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                SQL Filtering & Preview
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Preview Parquet data before exporting. Use SQL queries to
                filter, select specific columns, or transform data before
                converting to TSV format.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
