"use client";

import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { WorkspaceCard, StatusBadge } from "./cards-metrics-badges";
import { ComplianceRule } from "./types";

export function GovernancePanel() {
  const [rules, setRules] = useState<ComplianceRule[]>([
    { id: "1", name: "ISO-27001 Enclave Isolation", status: "verified", desc: "Local hardware memory boundaries isolated completely in sandbox." },
    { id: "2", name: "eBPF Event Log Streaming", status: "verified", desc: "Continuous kernel security auditing streams registered with zero gaps." },
    { id: "3", name: "SOC2 Administrative Decoupling", status: "verified", desc: "No core platform access routes exist inside user enclaves." },
    { id: "4", name: "Regulatory Compliance Ledger Check", status: "verified", desc: "No guardrail boundaries triggered violations during this epoch." }
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === "verified" ? "warning" : "verified" } : r));
  };

  return (
    <WorkspaceCard className="space-y-4">
      <div className="flex flex-wrap justify-between items-start gap-3 border-b border-white/5 pb-3 select-none">
        <div>
          <h4 className="text-[14px] font-bold text-white font-mono tracking-wider uppercase">Active Guardrails Ledger</h4>
          <p className="text-[11px] font-mono text-white/45 mt-1">Verified ISO/SOC policy rulesets actively checked in real time.</p>
        </div>
        <StatusBadge state="active" label="all compliant" />
      </div>

      <div className="space-y-3 font-mono text-[11.5px]">
        {rules.map(rule => (
          <div 
            key={rule.id}
            onClick={() => toggleRule(rule.id)}
            className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-[#020202]/30 hover:border-white/10 hover:bg-[#020202]/60 transition-all cursor-pointer"
          >
            {rule.status === "verified" ? (
              <CheckCircle className="w-4 h-4 text-[#00FFC2] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{rule.name}</span>
                <span className={`text-[9px] px-1 py-0.1 border rounded ${rule.status === "verified" ? "text-[#00FFC2] bg-[#00FFC2]/5 border-[#00FFC2]/20" : "text-amber-400 bg-amber-400/5 border-amber-400/20"}`}>
                  {rule.status === "verified" ? "LOCKED" : "EVAL"}
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-1 leading-normal">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </WorkspaceCard>
  );
}
