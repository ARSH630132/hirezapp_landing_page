"use client";

import React, { useState } from "react";
import { 
  PrivateAppShell, TableColumn, BreadcrumbItem 
} from "@/components/private-app";
import { 
  adminUser, sidebarLinks, nodesData, ClusterNode 
} from "./mock-data";
import { 
  OversightDeckTab, EnclaveClustersTab, GuardrailLedgerTab 
} from "./admin-tabs";
import { 
  FinancialLedgerTab, SlaTicketsTab 
} from "./admin-tabs-part2";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState<"Client" | "Administrator">("Administrator");
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Oversight", href: "/admin" },
    { label: activeTab.toUpperCase() }
  ];

  const columns: TableColumn<ClusterNode>[] = [
    { key: "nodeId", header: "NODE IDENTIFIER", sortable: true, render: (row) => <span className="font-bold text-white">{row.nodeId}</span> },
    { key: "client", header: "ENTERPRISE CLIENT", sortable: true },
    { key: "status", header: "COMPLIANCE STATE", sortable: true, render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
        row.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
        row.status === "stable" ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/20" :
        row.status === "warning" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
        "bg-white/5 text-white/40 border-white/10"
      }`}>
        {row.status}
      </span>
    )},
    { key: "load", header: "THREAD CPU LOAD" },
    { key: "uptime", header: "EPOCH UPTIME" }
  ];

  const filteredNodes = nodesData.filter(node => 
    node.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PrivateAppShell
      user={adminUser}
      breadcrumbs={breadcrumbs}
      links={sidebarLinks}
      activeLink={activeTab}
      onLinkChange={(id) => setActiveTab(id)}
      role={role}
      onRoleChange={(r) => {
        setRole(r);
        if (r === "Client") {
          window.location.href = "/portal";
        }
      }}
    >
      {activeTab === "dashboard" && <OversightDeckTab />}

      {activeTab === "nodes" && (
        <EnclaveClustersTab 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          columns={columns}
          filteredNodes={filteredNodes}
        />
      )}

      {activeTab === "governance" && <GuardrailLedgerTab />}
      {activeTab === "billing" && <FinancialLedgerTab />}
      {activeTab === "support" && <SlaTicketsTab />}
    </PrivateAppShell>
  );
}
