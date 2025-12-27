import Link from "next/link";
import { GuideToc } from "@/components/GuideToc";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "How to Convert Parquet Files in Python (CSV, JSON, Excel)",
  description:
    "One-page Python snippets for converting Parquet to CSV, JSON, and Excel using pandas. Includes common parameters and pitfalls.",
};

const tocItems = [
  { id: "csv", label: "Parquet to CSV" },
  { id: "json", label: "Parquet to JSON" },
  { id: "excel", label: "Parquet to Excel" },
  { id: "tips", label: "Tips & Pitfalls" },
];

export default function PythonConvertParquetGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Python • Pandas • Conversions
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How to Convert Parquet Files in Python (CSV, JSON, Excel)
          </h1>
          <p className="text-gray-700">
            Keep all conversion snippets on one page so you can jump to the
            exact format you need. Use the anchor links or copy the ready-to-run
            code blocks below.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <GuideToc items={tocItems} />

          <div className="flex-1 space-y-10">
            <section id="csv" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Parquet to CSV
              </h2>
              <p className="text-gray-700">
                The most searched conversion. Mind delimiter, encoding, and
                whether you want the index column.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.read_parquet("input.parquet")

# UTF-8 with comma delimiter (default)
df.to_csv("output.csv", index=False, encoding="utf-8")

# Custom delimiter & compression
df.to_csv(
    "output.tsv.gz",
    sep="\\t",
    index=False,
    compression="gzip",
    encoding="utf-8",
)`}
                />
                <p className="text-sm text-gray-700">
                  Tip: For large exports, write to gzip or bz2 to reduce file
                  size; most tools can read compressed CSV directly.
                </p>
                <div className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm text-gray-800">
                  <span>Need a browser-based converter?</span>
                  <Link
                    href="/parquet-to-csv"
                    className="rounded-md bg-primary px-3 py-1 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    Open Parquet → CSV
                  </Link>
                </div>
              </div>
            </section>

            <section id="json" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Parquet to JSON
              </h2>
              <p className="text-gray-700">
                Choose the orientation that matches your downstream consumer.
                <code className="text-sm">records</code> is usually best for
                APIs.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.read_parquet("input.parquet")

# Records (list of objects) for APIs
df.to_json("output.json", orient="records", lines=False)

# Line-delimited JSON for streaming/BigQuery
df.to_json("output.ndjson", orient="records", lines=True)`}
                />
                <p className="text-sm text-gray-700">
                  Tip: If you see bytes objects, set
                  <code className="text-sm"> df.convert_dtypes()</code> before
                  export to normalize types.
                </p>
                <div className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm text-gray-800">
                  <span>Convert online without Python?</span>
                  <Link
                    href="/parquet-to-json"
                    className="rounded-md bg-primary px-3 py-1 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    Open Parquet → JSON
                  </Link>
                </div>
              </div>
            </section>

            <section id="excel" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Parquet to Excel
              </h2>
              <p className="text-gray-700">
                Great for sharing smaller slices of data. Keep row counts
                modest—Excel struggles beyond ~1M rows.
              </p>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                <CodeBlock
                  code={`import pandas as pd

df = pd.read_parquet("input.parquet")

with pd.ExcelWriter("output.xlsx", engine="xlsxwriter") as writer:
    df.to_excel(writer, sheet_name="data", index=False)`}
                />
                <p className="text-sm text-gray-700">
                  Tip: For multiple sheets, call
                  <code className="text-sm"> to_excel</code> repeatedly with
                  different <code className="text-sm">sheet_name</code> while
                  reusing the same writer instance.
                </p>
                <div className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm text-gray-800">
                  <span>Prefer a quick browser export?</span>
                  <Link
                    href="/parquet-to-excel"
                    className="rounded-md bg-primary px-3 py-1 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    Open Parquet → Excel
                  </Link>
                </div>
              </div>
            </section>

            <section id="tips" className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Tips & Pitfalls
              </h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>
                  <span className="font-semibold">Encoding errors:</span> always
                  set
                  <code className="text-sm"> encoding="utf-8"</code> when
                  writing CSV with non-ASCII characters.
                </li>
                <li>
                  <span className="font-semibold">Memory pressure:</span> select
                  only needed columns in{" "}
                  <code className="text-sm">read_parquet</code> and consider
                  chunked writes for very large datasets.
                </li>
                <li>
                  <span className="font-semibold">Data types:</span> call
                  <code className="text-sm"> convert_dtypes()</code> to
                  normalize nullable types before export.
                </li>
                <li>
                  <span className="font-semibold">Column order:</span> reorder
                  with
                  <code className="text-sm"> df[["colA", "colB"]]</code> before
                  writing to guarantee consistent schemas.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
