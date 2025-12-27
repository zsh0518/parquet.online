"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home } from "lucide-react";
import { TOOL_GROUPS } from "@/lib/tools-config";
import Image from "next/image";

export function Header() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsToolsOpen(false);
      }
    };

    if (isToolsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isToolsOpen]);

  const handleToolClick = () => {
    setIsToolsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo / Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-4 transition-colors"
        >
          <Image
            src="/favicon.ico"
            alt="Parquet Tools"
            width={20}
            height={20}
          />
          <span>Parquet Tools</span>
        </Link>

        {/* Tools Dropdown */}
        <nav className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors"
            aria-expanded={isToolsOpen}
            aria-haspopup="true"
          >
            Tools
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isToolsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isToolsOpen && (
            <div className="absolute right-0 mt-2 w-[900px] max-w-[95vw] rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="max-h-[80vh] overflow-y-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.id} className="space-y-2">
                      {/* Group Header - Simple */}
                      <div className="flex items-center gap-2 px-2 pb-2 border-b border-gray-200">
                        <div className="rounded-md bg-gray-900 p-1 text-white">
                          <group.icon className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          {group.title}
                        </h3>
                      </div>

                      {/* Tools List */}
                      <div className="space-y-0.5">
                        {group.tools.map((tool) => {
                          const isComingSoon = tool.badge === "Coming Soon";
                          const isActive = pathname === tool.href;

                          return isComingSoon ? (
                            <div
                              key={tool.href}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-400 cursor-not-allowed"
                            >
                              <tool.icon className="h-3.5 w-3.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0 truncate">
                                {tool.name}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={handleToolClick}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                                isActive
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <tool.icon className="h-3.5 w-3.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0 truncate">
                                {tool.name}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
