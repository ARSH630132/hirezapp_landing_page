"use client";

import React from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function ClientGovernancePage() {
  const rules = [
    { id: "RULE_01", text: "Block unauthorized external API calls", state: "Active" },
    { id: "RULE_02", text: "Enforce cryptographic verification hashes on ledger state", state: "Active" },
    { id: "RULE_03", text: "Decouple admin dashboard requests from production threads", state: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Guardrail Policies</h2>
        <p className="text-xs text-white/50 mt-1">Active guardrail rulebooks, sandbox boundaries, and regulatory policy compliance parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Continuous Policy Verification</h3>
          </div>

          <div className="space-y-3 font-mono text-[11px] text-white/70">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 rounded-lg border border-white/5 bg-black/30 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#009DFF] font-bold block">[{rule.id}]</span>
                  <span className="text-white mt-1 block">{rule.text}</span>
                </div>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-400/5 border border-emerald-400/25 px-2 py-0.5 rounded">
                  {rule.state}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Compliance Status</h3>
          </div>
          
          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3 rounded bg-green-500/5 border border-green-500/20 text-green-400 font-bold flex items-center justify-between">
              <span>ISO-27001 STATUS:</span>
              <span>COMPLIANT</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Every sandbox micro-enclave automatically triggers continuous verification checks across 12 ISO modules. If compliance drift is detected, automatic decoupling occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
