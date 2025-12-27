import ParquetViewer from "@/components/ParquetViewer";
import { Faq } from "@/components/Faq";

export const metadata = {
  title:
    "Free Parquet File Viewer Online | Apache Parquet Viewer for Windows, Mac, Linux",
  description:
    "Open and view Apache Parquet files online in your browser with schema and SQL tools. No uploads; works on Windows, macOS, and Linux.",
  keywords: [
    "apache parquet",
    "parquet viewer",
    "parquet file viewer",
    "parquet file viewer online",
    "parquet file viewer online free",
    "open parquet file",
    "open parquet files",
    "parquet viewer windows",
    "parquet viewer mac",
    "parquet viewer linux",
    "how to open parquet file",
    "how to open parquet files",
  ],
};

const faqItems = [
  {
    question: "What is a Parquet file?",
    answer:
      "Apache Parquet is a columnar file format designed for analytics. It stores data by columns to compress better and scan faster than row-based formats like CSV.",
  },
  {
    question: "How do I open an Apache Parquet file online for free?",
    answer:
      "Click “Upload” or drag your parquet file into the viewer. Processing happens locally in your browser—no account or server upload required.",
  },
  {
    question: "Does this parquet viewer work on Windows, Mac, and Linux?",
    answer:
      "Yes. It is browser-based, so the same experience works on Windows, macOS, and Linux without installing desktop apps.",
  },
  {
    question: "Can I inspect schema and column types?",
    answer:
      "Use the Schema panel to review column names, data types, and metadata before sharing or loading the file into pipelines.",
  },
  {
    question: "How can I query parquet files with SQL in the browser?",
    answer:
      "Open the SQL editor, write a SELECT query, and run it. Results stay on your device for privacy and quick iteration.",
  },
];

export default function ParquetViewerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer
        showDescription={true}
        pageTitle="Parquet Viewer Online"
        pageDescription="Open and view Apache Parquet files directly in your browser. Browse data, inspect schema, and query with SQL - all without uploading to any server."
        enableExport={false}
      />
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Apache Parquet file viewer overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              View Apache Parquet files online for free. Works in any modern
              browser on Windows, macOS, and Linux—no uploads, installs, or
              accounts required.
            </p>
          </div>

          <Faq items={faqItems} />
        </div>
      </section>
    </div>
  );
}
