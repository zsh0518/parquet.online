import ParquetViewer from "@/components/ParquetViewer";

export const metadata = {
  title: "Parquet Schema Viewer - Inspect Column Types & Metadata | Free Tool",
  description:
    "Free online Parquet schema viewer. Inspect column names, data types, and metadata of Apache Parquet files. No upload required - runs entirely in your browser.",
  keywords: [
    "parquet schema",
    "parquet schema viewer",
    "parquet metadata",
    "parquet column types",
    "inspect parquet schema",
    "parquet file structure",
  ],
};

export default function ParquetSchemaViewerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ParquetViewer
        showDescription={true}
        pageTitle="Parquet Schema Viewer"
        pageDescription="Inspect the schema of your Parquet files. View column names, data types, and metadata - all processed locally in your browser for maximum privacy."
        defaultShowSchema={true}
        enableExport={false}
      />
    </div>
  );
}
