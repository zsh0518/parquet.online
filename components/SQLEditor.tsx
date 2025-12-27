"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Play, RotateCcw } from "lucide-react";

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  isExecuting?: boolean;
  placeholder?: string;
}

// 默认 SQL 模板
const DEFAULT_SQL = `-- Write your SQL query here
-- Table name is the uploaded file name, e.g., 'data.parquet'
SELECT * FROM 'your_file.parquet'`;

export function SQLEditor({
  value,
  onChange,
  onExecute,
  isExecuting = false,
  placeholder,
}: SQLEditorProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Ctrl/Cmd + Enter 执行查询
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (!isExecuting) {
          onExecute();
        }
      }
    },
    [isExecuting, onExecute]
  );

  const handleReset = () => {
    onChange(placeholder || DEFAULT_SQL);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400 ml-2">SQL Query</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title="Reset to default"
            aria-label="Reset query"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Execute query (Ctrl+Enter)"
            aria-label="Execute query"
          >
            <Play className="h-4 w-4" />
            <span>{isExecuting ? "Running..." : "Run"}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror 编辑器 */}
      <div onKeyDown={handleKeyDown}>
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[sql()]}
          theme="dark"
          height="200px"
          placeholder={placeholder || DEFAULT_SQL}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          className="text-sm"
        />
      </div>

      {/* 快捷键提示 */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono">
            Enter
          </kbd>{" "}
          to execute
        </span>
      </div>
    </div>
  );
}
