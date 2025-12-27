import ToParquetConverter from "@/components/ToParquetConverter";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "CSV to Parquet Converter Online | Convert CSV to Parquet Free (Fast & Private)",
  description:
    "Convert CSV files to Apache Parquet format online for free. Browser-based converter with custom delimiters, compression options, and schema validation. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "csv to parquet",
    "convert csv to parquet online",
    "csv to parquet converter free",
    "csv parquet conversion tool",
    "csv to parquet mac windows linux",
    "csv parquet compression",
  ],
  alternates: {
    canonical: "/csv-to-parquet",
  },
  openGraph: {
    title:
      "CSV to Parquet Converter Online | Convert CSV to Parquet Free (Fast & Private)",
    description:
      "Convert CSV to Parquet in your browser using DuckDB-WASM. Choose delimiters, compression, and export instantly. No server uploads, works offline.",
  },
};

const faqItems = [
  {
    question: "How do I convert a CSV file to Parquet format online?",
    answer:
      "Upload or drag your CSV file into the converter. Configure delimiter and header options if needed, then click 'Download Parquet' to export the converted file instantly.",
  },
  {
    question: "What CSV delimiters are supported?",
    answer:
      "Auto-detect, comma (,), semicolon (;), tab (\\t), pipe (|), and custom delimiters are all supported. The tool can also handle TSV and other text-delimited formats.",
  },
  {
    question: "Where is my CSV data processed during conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your CSV file is never uploaded to any server, ensuring complete privacy.",
  },
  {
    question: "Can I choose Parquet compression when converting from CSV?",
    answer:
      "Yes. Select from Snappy (default), Zstandard (best compression), Gzip (wide compatibility), or uncompressed before downloading your Parquet file.",
  },
  {
    question:
      "How do I handle CSV files with mixed data types or special null values?",
    answer:
      "Use the CSV import options to define custom null strings (like 'N/A' or '-') and enable 'Force All Varchar' if columns contain mixed types to avoid conversion errors.",
  },
];

export default function CSVToParquetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToParquetConverter sourceType="csv" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              CSV to Parquet Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert CSV to Apache Parquet format online. Ideal for data
              engineering, analytics, and ETL workflows. Powered by DuckDB-WASM
              for fast, private, local conversion in any modern browser on
              Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Flexible CSV Parsing
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Configure delimiters, header detection, null value handling, and
                type inference. Supports standard CSV, European CSV (semicolon),
                TSV, pipe-delimited, and custom formats.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Compression & Schema
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Choose Snappy, Zstandard, Gzip, or no compression. Preview
                schema and data types before exporting to ensure compatibility
                with your data pipeline.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
