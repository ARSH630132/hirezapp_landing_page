"use client";

import React from "react";
import { DataTable, previewProjects, TableColumn, Project } from "@/components/private-app";

export default function AdminProjectsPage() {
  const columns: TableColumn<Project>[] = [
    { key: "id", header: "Project ID", sortable: true },
    { key: "name", header: "Project Name", sortable: true },
    { key: "clientAccountId", header: "Tenant Account", sortable: true },
    { key: "enclaveType", header: "Enclave Mode", sortable: true },
    { key: "nodesCount", header: "Nodes Active", sortable: true },
    { key: "status", header: "Status", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Global Projects Registry</h2>
        <p className="text-xs text-white/50 mt-1">Cross-cluster oversight of sandbox projects and multi-agent lattices.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewProjects}
        pageSize={5}
        searchPlaceholder="Filter global projects by name, ID, or enclave type..."
        searchKeys={["id", "name", "enclaveType", "status"]}
        statusField="status"
        typeField="enclaveType"
        categoryLabel="GLOBAL PROJECT RECORD"
        detailTitle={(row) => row.name}
        renderDetail={(row) => (
          <div className="space-y-5 font-mono text-[11.5px]">
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Project Name</span>
              <p className="text-white font-bold text-[13.5px]">{row.name}</p>
              <p className="text-[#009DFF] text-[11px]">{row.tag}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Project Overview Description</span>
              <p className="text-white/70 leading-relaxed text-[11px]">{row.desc}</p>
            </div>

            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Sandbox Infrastructure Parameters</span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="flex justify-between"><span className="text-white/40">Isolation Type:</span><span className="text-white font-bold">{row.enclaveType}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Active Nodes:</span><span className="text-[#00FFC2] font-bold">{row.nodesCount} Clusters</span></div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40">Last Telemetry Check:</span><span className="text-white/60">{new Date(row.lastUpdated).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
