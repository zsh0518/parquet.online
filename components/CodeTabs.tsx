"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";

interface CodeTab {
  id: string;
  label: string;
  code: string;
  description?: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  ctaHref: string;
  ctaLabel: string;
}

export function CodeTabs({ tabs, ctaHref, ctaLabel }: CodeTabsProps) {
  if (!tabs.length) return null;

  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const theme = useMemo(() => {
    const nightOwl = themes.nightOwl;
    return {
      ...nightOwl,
      plain: { ...nightOwl.plain, backgroundColor: "#0b1221" },
    };
  }, []);

  const handleCopy = async () => {
    if (!activeTab?.code) return;
    try {
      await navigator.clipboard?.writeText(activeTab.code);
      setCopiedId(activeTab.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3"
        role="tablist"
        aria-label="Code snippet tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-primary/10"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 px-4 py-4">
        {activeTab.description ? (
          <p className="text-sm text-gray-700">{activeTab.description}</p>
        ) : null}

        <div className="relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-3 rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Copy code"
          >
            {copiedId === activeTab.id ? "Copied" : "Copy"}
          </button>
          <Highlight code={activeTab.code} language="python" theme={theme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} overflow-x-auto rounded-lg p-4 text-sm`}
                style={style}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>

        <div className="rounded-lg bg-primary/5 px-4 py-3 text-sm text-gray-800">
          <p className="font-semibold text-gray-900">
            Code not working as expected?
          </p>
          <p className="mt-1">
            Dependency issues or errors loading your Parquet file? Try it
            instantly in the browser.
          </p>
          <Link
            href={ctaHref}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
