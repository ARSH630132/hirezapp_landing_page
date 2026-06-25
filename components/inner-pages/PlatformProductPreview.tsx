"use client";

import React, { useState } from "react";

const LOGS = [
  { id: "tx-1", node: "Strategy", latency: "124ms" },
  { id: "tx-2", node: "Compliance", latency: "84ms" },
  { id: "tx-3", node: "Architect", latency: "410ms" }
];

export default function PlatformProductPreview() {
  const [tab, setTab] = useState<"overview" | "logs" | "rules">("overview");
  const [rules, setRules] = useState({ pii: true, toxicity: true });

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] overflow-hidden flex flex-col md:flex-row shadow-xl">
      <div className="w-full md:w-[160px] bg-black/40 border-r border-white/5 p-4 flex flex-col gap-1 shrink-0">
        <span className="text-[9px] font-bold text-white/40 uppercase font-mono mb-2">GFF Console</span>
        {["overview", "logs", "rules"].map((t) => (
          <button
            key={t} onClick={() => setTab(t as any)}
            className={`w-full text-left px-3 py-1.5 rounded-[6px] text-[11px] capitalize ${
              tab === t ? "bg-white/5 text-white border-l-2 border-[#009DFF]" : "text-white/50 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-grow p-5 bg-black/20 min-h-[200px] flex flex-col justify-between">
        {tab === "overview" && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Metrics Engine</h4>
            <div className="w-full h-[80px] relative rounded-[6px] border border-white/5 bg-black/40">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path d="M0 80 Q 100 20, 200 60 T 400 30 T 500 40" fill="none" stroke="url(#c)" strokeWidth="2" />
                <defs><linearGradient id="c"><stop stopColor="#E4000F" /><stop offset="1" stopColor="#009DFF" /></linearGradient></defs>
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: "481,209", l: "Queries" }, { v: "2.4B", l: "Tokens" }, { v: "12ms", l: "Overhead" }].map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[14px] font-bold text-white">{m.v}</span>
                  <span className="text-[8px] uppercase text-white/40">{m.l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "logs" && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Live Logs</h4>
            <table className="w-full text-left text-[10px] font-mono">
              <thead>
                <tr className="border-b border-white/5 text-white/40"><th>ID</th><th>Node</th><th className="text-right">Latency</th></tr>
              </thead>
              <tbody>
                {LOGS.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 last:border-0 text-white/70">
                    <td className="py-1.5">{l.id}</td><td>{l.node}</td><td className="text-right">{l.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "rules" && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Guardrail Policy</h4>
            {[{ id: "pii", t: "PII Obfuscation" }, { id: "toxicity", t: "Toxicity Filter" }].map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-[6px] border border-white/5 bg-black/20 text-[11px]">
                <span className="text-white/80">{r.t}</span>
                <button
                  onClick={() => setRules((p) => ({ ...p, [r.id]: !p[r.id as keyof typeof p] }))}
                  className={`w-7 h-4 rounded-full p-0.5 relative transition-colors ${rules[r.id as keyof typeof rules] ? "bg-[#009DFF]" : "bg-white/10"}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${rules[r.id as keyof typeof rules] ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
