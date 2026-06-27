"use client";

import React, { useState } from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import { WorkspaceCard } from "./cards-metrics-badges";

export function DocumentCard({ 
  title, 
  fileSize, 
  type = "PDF", 
  sha256,
  onDownload 
}: { 
  title: string; 
  fileSize: string; 
  type?: string; 
  sha256: string;
  onDownload?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!onDownload) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onDownload();
    }, 1200);
  };

  return (
    <WorkspaceCard className="flex flex-col h-full justify-between">
      <div className="space-y-2">
        <div className="flex justify-between items-start select-none">
          <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-mono font-bold text-white/30 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            {type}
          </span>
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug">{title}</h4>
          <span className="text-[10px] font-mono text-white/35 mt-1 block select-none">FILE SIZE: {fileSize}</span>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3.5 mt-4 space-y-3 font-mono">
        <div className="text-[9.5px] text-white/30 select-none">
          <span className="font-bold text-white/50 block mb-0.5">SHA-256 SUM:</span>
          <span className="truncate block font-mono text-[9px] text-[#009DFF]/60">{sha256}</span>
        </div>

        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="w-full inline-flex h-8 items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.01] text-[10.5px] font-bold text-white hover:bg-white/[0.04] hover:border-white/25 transition-all disabled:opacity-50 cursor-pointer select-none"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>PULLING FILE...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD RECOGNIZED</span>
            </>
          )}
        </button>
      </div>
    </WorkspaceCard>
  );
}
