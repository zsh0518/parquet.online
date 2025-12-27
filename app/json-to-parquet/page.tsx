import ToParquetConverter from "@/components/ToParquetConverter";
import { Faq } from "@/components/Faq";

export const metadata = {
  title: "JSON to Parquet Converter Online | Convert JSON to Parquet Free",
  description:
    "Convert JSON files to Apache Parquet format online for free. No uploads, works on Windows, macOS, and Linux.",
  keywords: [
    "json to parquet",
    "convert json to parquet online for free",
    "json to parquet mac windows linux",
  ],
  alternates: {
    canonical: "/json-to-parquet",
  },
  openGraph: {
    title: "JSON to Parquet Converter Online | Convert JSON to Parquet Free",
    description:
      "Convert JSON to Parquet in your browser using DuckDB-WASM. Automatic schema detection, compression options, and instant export. No server uploads.",
  },
};

const faqItems = [
  {
    question: "How do I convert a JSON file to Parquet format online?",
    answer:
      "Upload or drag your JSON file into the converter. The tool automatically detects the schema and converts your data. Then click 'Download Parquet' to export the file.",
  },
  {
    question: "What JSON structure is required for conversion to Parquet?",
    answer:
      "The JSON file should contain an array of objects (e.g., [{...}, {...}]). If your JSON is a single object with an array property, the tool will automatically detect and use that array.",
  },
  {
    question: "Where is my JSON data processed during conversion?",
    answer:
      "All conversion happens locally in your browser via WebAssembly. Your JSON file is never uploaded to any server, ensuring complete data privacy and security.",
  },
  {
    question: "Can I convert nested JSON objects to Parquet?",
    answer:
      "Yes. The converter handles nested JSON structures and automatically maps them to Parquet's columnar format with appropriate data types.",
  },
  {
    question: "How do I optimize Parquet file size when converting from JSON?",
    answer:
      "Select Zstandard compression for the best compression ratio, or choose Snappy for a balance between speed and size. Preview the schema to verify data types are optimal.",
  },
];

export default function JSONToParquetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToParquetConverter sourceType="json" />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              JSON to Parquet Converter Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Convert JSON files to Apache Parquet format online. Perfect for
              transforming API responses, log files, and JSON exports into
              efficient columnar storage. Powered by DuckDB-WASM for fast,
              private, local conversion in any modern browser on Windows, macOS,
              and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Automatic Schema Detection
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Automatically detects JSON structure and data types. Handles
                arrays of objects, nested structures, and mixed data types.
                Preview schema before exporting.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                Efficient Columnar Storage
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Convert row-based JSON to columnar Parquet format for better
                compression and faster analytics. Choose from multiple
                compression algorithms to optimize file size.
              </p>
            </div>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
