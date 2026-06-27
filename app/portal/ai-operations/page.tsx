"use client";

import React from "react";
import { DataTable, previewAgentOperations, TableColumn, AgentOperation } from "@/components/private-app";

export default function ClientAiOperationsPage() {
  const columns: TableColumn<AgentOperation>[] = [
    { key: "id", header: "Agent ID", sortable: true },
    { key: "name", header: "Identifier Name", sortable: true },
    { key: "projectId", header: "Project Bounds", sortable: true },
    { key: "threads", header: "Thread Count", sortable: true },
    { key: "memory", header: "Isolated RAM" },
    { key: "status", header: "Pulse State", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">AI Operations Ledger</h2>
        <p className="text-xs text-white/50 mt-1">Configure and coordinate active sandboxed multi-agent runtimes, context states, and memory allocations.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewAgentOperations}
        pageSize={5}
        searchPlaceholder="Filter agents by name, project, or status..."
        searchKeys={["id", "name", "projectId", "status"]}
        statusField="status"
        typeField="projectId"
        categoryLabel="AGENT TELEMETRY"
        detailTitle={(row) => `Runtime: ${row.name}`}
      />
    </div>
  );
}
