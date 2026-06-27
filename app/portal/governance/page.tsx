"use client";

import React from "react";
import { DataTable, previewGovernanceItems, TableColumn, GovernanceItem } from "@/components/private-app";

export default function ClientGovernancePage() {
  const columns: TableColumn<GovernanceItem>[] = [
    { key: "id", header: "Rule ID", sortable: true },
    { key: "name", header: "Policy Guardrail Name", sortable: true },
    { key: "standard", header: "Compliance standard", sortable: true },
    { key: "lastChecked", header: "Last Verified" },
    { key: "status", header: "Audit State", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Guardrail Policies</h2>
        <p className="text-xs text-white/50 mt-1">Active guardrail rulebooks, sandbox boundaries, and regulatory policy compliance parameters.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewGovernanceItems}
        pageSize={5}
        searchPlaceholder="Search guardrails by standards or name..."
        searchKeys={["id", "name", "standard", "status"]}
        statusField="status"
        typeField="standard"
        categoryLabel="GOVERNANCE POLICY"
        detailTitle={(row) => row.name}
        renderDetail={(row) => (
          <div className="space-y-5 font-mono text-[11.5px]">
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Policy Summary</span>
              <p className="text-white font-bold text-[13px]">{row.name}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Enforcement Boundary</span>
              <p className="text-white/75 leading-relaxed">{row.desc}</p>
            </div>

            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Audit Ledger Details</span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="flex justify-between"><span className="text-white/40">Standard:</span><span className="text-white font-bold">{row.standard}</span></div>
                <div className="flex justify-between"><span className="text-white/40">State:</span><span className="text-[#00FFC2] font-bold">{row.status.toUpperCase()}</span></div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40">Last Verified:</span><span className="text-white/60">{new Date(row.lastChecked).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
