import { GuideToc } from "@/components/GuideToc";
import { CodeTabs } from "@/components/CodeTabs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title:
    "How to Read and Load Parquet Files in Python (Pandas, PyArrow, Spark)",
  description:
    "Step-by-step code snippets for reading Parquet files with pandas, PyArrow, and PySpark. Includes troubleshooting tips for common errors.",
};

const tocItems = [
  { id: "pandas", label: "Using Pandas" },
  { id: "pyarrow", label: "Using PyArrow" },
  { id: "pyspark", label: "Using PySpark" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

const readTabs = [
  {
    id: "pandas",
    label: "Pandas",
    description:
      "Fast for local analysis; requires pandas with pyarrow engine.",
    code: `import pandas as pd

df = pd.read_parquet("file.parquet")
print(df.head())`,
  },
  {
    id: "pyarrow",
    label: "PyArrow",
    description: "Lower-level control with excellent performance and metadata.",
    code: `import pyarrow.parquet as pq

table = pq.read_table("file.parquet")
df = table.to_pandas()
print(df.head())`,
  },
  {
    id: "pyspark",
    label: "PySpark",
    description:
      "For big datasets; supports predicate pushdown and partitioning.",
    code: `from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()
df = spark.read.parquet("s3://bucket/path/file.parquet")
df.show(5)`,
  },
];

export default function PythonReadParquetGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Python • Pandas • PyArrow • Spark
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How to Read and Load Parquet Files in Python (Pandas, PyArrow,
            Spark)
          </h1>
          <p className="text-gray-700">
            Copy-paste ready snippets for the most common ways to open Parquet
            data. Use tabs to switch libraries and jump directly to the section
            you need.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <GuideToc items={tocItems} />

          <div className="flex-1 space-y-12">
            <section id="pandas" className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Using Pandas (pd.read_parquet)
                </h2>
                <p className="text-gray-700">
                  Ideal for local analysis and quick exploration. Install
                  <span className="font-semibold"> pandas</span> with a Parquet
                  engine such as <span className="font-semibold">pyarrow</span>.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Best for single-node workloads and exploratory analysis.
                  </li>
                  <li>
                    Supports filters with{" "}
                    <code className="text-sm">columns=</code> and row-level
                    predicates via PyArrow.
                  </li>
                  <li>
                    Use <code className="text-sm">engine="pyarrow"</code>{" "}
                    (default in recent pandas) for performance and type
                    fidelity.
                  </li>
                </ul>
              </div>

              <CodeTabs
                tabs={readTabs}
                ctaHref="/parquet-viewer"
                ctaLabel="Use Parquet Tools Online"
              />
            </section>

            <section id="pyarrow" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Using PyArrow (For better performance)
              </h2>
              <p className="text-gray-700">
                PyArrow exposes Parquet metadata, statistics, and row groups. It
                is excellent when you need control over columns, filters, or
                schema inspection before converting to pandas.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pyarrow.parquet as pq

table = pq.read_table("file.parquet", columns=["id", "country"])
print(table.schema)

# Filter rows by predicate pushdown (supported when statistics exist)
dataset = pq.ParquetDataset("file.parquet")
filtered = dataset.read(columns=["id", "country"])
df = filtered.to_pandas()`}
                />
                <p className="text-sm text-gray-700">
                  Tip: call <code className="text-sm">pq.read_metadata</code> to
                  inspect row groups, compression, and column types without
                  loading the full dataset.
                </p>
              </div>
            </section>

            <section id="pyspark" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Using PySpark (For big data)
              </h2>
              <p className="text-gray-700">
                Spark handles partitioned datasets on cloud storage with
                predicate pushdown and column pruning. Use it when the dataset
                exceeds single-machine memory.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = SparkSession.builder.appName("read-parquet").getOrCreate()

df = spark.read.parquet("s3://bucket/path/to/table/")

# Column pruning + predicate pushdown
filtered = df.select("id", "country").where(col("country") == "US")

filtered.show(10)
filtered.write.mode("overwrite").parquet("s3://bucket/tmp/us-users/")`}
                />
                <p className="text-sm text-gray-700">
                  Tip: Keep partitions balanced (avoid millions of small files)
                  and prefer column pruning to reduce shuffle costs.
                </p>
              </div>
            </section>

            <section id="troubleshooting" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Troubleshooting (Common errors)
              </h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>
                  <span className="font-semibold">ModuleNotFoundError:</span>{" "}
                  install <code className="text-sm">pyarrow</code> or
                  <code className="text-sm">fastparquet</code> (
                  <code className="text-sm">pip install "pandas[parquet]"</code>
                  ).
                </li>
                <li>
                  <span className="font-semibold">
                    ArrowInvalid / schema mismatch:
                  </span>{" "}
                  ensure column names and types match across row groups; check
                  with <code className="text-sm">pq.read_metadata</code>.
                </li>
                <li>
                  <span className="font-semibold">Corrupted small files:</span>{" "}
                  merge tiny Parquet files or rewrite with
                  <code className="text-sm"> repartition</code> in Spark.
                </li>
                <li>
                  <span className="font-semibold">
                    Memory errors in pandas:
                  </span>{" "}
                  load selected columns only, chunk with
                  <code className="text-sm">
                    {" "}
                    dataset.to_pandas(split_blocks=True)
                  </code>
                  , or sample via Spark then export.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
