"use client";

import { Upload, Loader2 } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  isProcessing?: boolean;
  onFileSelect: (file: File) => void;
  title?: string;
  description?: string;
}

export function FileUploader({
  accept = ".parquet",
  isProcessing = false,
  onFileSelect,
  title = "Click to Upload or Drag File",
  description = "Data will never be uploaded to any server",
}: FileUploaderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // 重置 input 值，允许重复选择同一文件
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200 cursor-pointer relative group"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          const input = e.currentTarget.querySelector("input");
          input?.click();
        }
      }}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
        aria-hidden="true"
      />

      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
        {isProcessing ? (
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        ) : (
          <Upload className="h-8 w-8 text-blue-600" />
        )}
      </div>

      <p className="text-lg font-medium text-gray-700">
        {isProcessing ? "Processing..." : title}
      </p>

      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
  );
}
