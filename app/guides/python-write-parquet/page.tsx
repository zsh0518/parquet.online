import { GuideToc } from "@/components/GuideToc";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "How to Write Parquet Files in Python",
  description:
    "Pandas and PyArrow snippets for saving DataFrames to Parquet with compression and partitioning best practices.",
};

const tocItems = [
  { id: "save", label: "Saving DataFrame to Parquet" },
  { id: "compression", label: "Understanding Compression" },
  { id: "partitioning", label: "Partitioning Data" },
];

export default function PythonWriteParquetGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Python • Pandas</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How to Write Parquet Files in Python
          </h1>
          <p className="text-gray-700">
            Save DataFrames to efficient columnar storage with compression and
            partitioning. Use these ready-to-run snippets and adopt best
            practices to keep files small and queryable.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <GuideToc items={tocItems} />

          <div className="flex-1 space-y-10">
            <section id="save" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Saving DataFrame to Parquet
              </h2>
              <p className="text-gray-700">
                The simplest way is via pandas
                <code className="text-sm"> DataFrame.to_parquet</code>, which
                uses PyArrow by default when available.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.DataFrame({"id": [1, 2], "country": ["US", "CA"]})

# Default: Snappy compression when pyarrow is installed
df.to_parquet("output.parquet", index=False)

# Control engine explicitly
df.to_parquet("output.parquet", index=False, engine="pyarrow")`}
                />
                <p className="text-sm text-gray-700">
                  Tip: Set <code className="text-sm">index=False</code> to avoid
                  persisting the pandas index unless you need it for joins.
                </p>
              </div>
            </section>

            <section id="compression" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Understanding Compression (Snappy, Gzip)
              </h2>
              <p className="text-gray-700">
                Choose a codec that balances speed and size. Snappy is fast;
                Gzip yields smaller files but slower writes/reads.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.read_parquet("input.parquet")

# Snappy (default, balanced)
df.to_parquet("out-snappy.parquet", compression="snappy", index=False)

# Gzip (smaller, slower)
df.to_parquet("out-gzip.parquet", compression="gzip", index=False)

# Brotli (good ratio, moderate speed)
df.to_parquet("out-brotli.parquet", compression="brotli", index=False)`}
                />
                <p className="text-sm text-gray-700">
                  Tip: Stay consistent across a dataset; mixing codecs within
                  the same table can surprise downstream readers.
                </p>
              </div>
            </section>

            <section id="partitioning" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Partitioning Data
              </h2>
              <p className="text-gray-700">
                Partitioning creates directory-level splits (e.g.,
                <code className="text-sm"> country=US/</code>) to speed up reads
                when filters match those keys. Avoid tiny files—target 100–500MB
                per file for analytics engines.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.read_parquet("input.parquet")

# Write to a directory with partitions
df.to_parquet(
    "s3://bucket/analytics/users/",
    index=False,
    partition_cols=["country", "year"],
)`}
                />
                <p className="text-sm text-gray-700">
                  Tip: After partitioned writes, check partition balance and
                  consider <code className="text-sm">repartition</code> or
                  <code className="text-sm"> coalesce</code> in Spark to reduce
                  small files.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
