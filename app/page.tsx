import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { TOOL_GROUPS } from "@/lib/tools-config";
import ParquetViewer from "@/components/ParquetViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero + Parquet Viewer Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Apache Parquet Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Free online tools to view, read, convert and export Apache Parquet
              files. Supports convert json/csv/excel to parquet, and export
              parquet to json/csv/tsv/excel/sql. No signup required.
            </p>
          </div>

          {/* Parquet Viewer */}
          <ParquetViewer showDescription={false} />
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              All Apache Parquet Tools
            </h2>
            <p className="text-gray-600">
              Everything you need to work with Apache Parquet file
            </p>
          </div>

          {/* Tool Groups */}
          <div className="space-y-12">
            {TOOL_GROUPS.map((group) => (
              <div key={group.id}>
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <group.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {group.title}
                    </h3>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.tools.map((tool) => {
                    const isComingSoon = tool.badge === "Coming Soon";

                    return isComingSoon ? (
                      <div
                        key={tool.href}
                        className="group relative p-5 rounded-xl border border-gray-200 bg-white opacity-60 cursor-not-allowed"
                      >
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
                            <tool.icon className="h-5 w-5" />
                          </div>
                          {tool.badge && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-4 font-semibold text-gray-500">
                          {tool.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                          {tool.desc}
                        </p>
                      </div>
                    ) : (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group relative p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <tool.icon className="h-5 w-5" />
                          </div>
                          {tool.badge && (
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 `}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-4 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {tool.desc}
                        </p>
                        <div className="mt-3 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Open tool</span>
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>
            Built with{" "}
            <a
              href="https://duckdb.org/docs/stable/clients/wasm/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              DuckDB-WASM
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
