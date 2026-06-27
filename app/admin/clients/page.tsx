"use client";

import React from "react";
import { DataTable, previewClientAccounts, TableColumn, ClientAccount } from "@/components/private-app";

export default function AdminClientsPage() {
  const columns: TableColumn<ClientAccount>[] = [
    { key: "id", header: "Client ID", sortable: true },
    { key: "name", header: "Enterprise Name", sortable: true },
    { key: "domain", header: "Domain Namespace", sortable: true },
    { key: "tier", header: "Subscription Tier", sortable: true },
    { key: "region", header: "Enclave Region", sortable: true },
    { key: "status", header: "Status", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Enterprise Clients Registry</h2>
        <p className="text-xs text-white/50 mt-1">Manage active corporate domains, configure zero-trust sandboxes, and inspect live loads.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewClientAccounts}
        pageSize={5}
        searchPlaceholder="Filter clients by domain, name, tier, or region..."
        searchKeys={["id", "name", "domain", "tier", "region"]}
        statusField="status"
        typeField="tier"
        categoryLabel="ENTERPRISE CLIENT ACCOUNT"
        detailTitle={(row) => row.name}
        renderDetail={(row) => (
          <div className="space-y-5 font-mono text-[11.5px]">
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Sovereign Tenant Name</span>
              <p className="text-white font-bold text-[13.5px]">{row.name}</p>
              <p className="text-[#009DFF] text-[11px]">{row.domain}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Primary Enclave Administrator</span>
              <p className="text-white font-semibold text-[12px]">{row.contactName}</p>
              <p className="text-white/50 text-[11px]">{row.contactEmail}</p>
            </div>

            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">System Allocation Parameters</span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="flex justify-between"><span className="text-white/40">Tier level:</span><span className="text-amber-400 font-bold">{row.tier.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Enclave region:</span><span className="text-white font-bold">{row.region}</span></div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40 font-semibold uppercase">Compliance Score:</span><span className="text-[#00FFC2] font-bold">{row.complianceLevel}</span></div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
