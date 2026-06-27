"use client";

import React, { useState } from "react";
import { TableColumn } from "./types";

// ==========================================
// 1. DATA TABLE
// ==========================================
export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  pageSize = 5,
  onRowClick
}: { 
  columns: TableColumn<T>[]; 
  data: T[]; 
  pageSize?: number;
  onRowClick?: (row: T) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(data.length / pageSize) || 1;

  const handleSort = (key: keyof T | string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const processedData = [...data];
  if (sortKey) {
    processedData.sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });
  }

  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11.5px] text-white/70">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[9.5px] uppercase select-none">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`p-4 font-bold tracking-wider ${col.sortable ? "hover:text-white cursor-pointer" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-[9px] text-[#009DFF]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-[11px] text-white/35">
                  No core records match current queries.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr 
                  key={row.id || rIdx} 
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${onRowClick ? "hover:bg-white/[0.02] cursor-pointer" : "hover:bg-white/[0.005]"}`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-4 leading-normal">
                      {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/[0.01] border-t border-white/5 p-4 select-none">
          <span className="text-[10px] font-mono text-white/35">
            PAGE {currentPage} OF {totalPages} ({data.length} RECORDS)
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-white/5 text-[10px] text-white font-mono hover:bg-white/5 disabled:opacity-25 transition-all cursor-pointer"
            >
              PREVIOUS
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-white/5 text-[10px] text-white font-mono hover:bg-white/5 disabled:opacity-25 transition-all cursor-pointer"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
