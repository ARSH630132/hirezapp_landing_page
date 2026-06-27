"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { 
  PrivatePageHeader, MetricTile, DataTable, FilterBar, ActivityFeed, 
  Timeline, AnalyticsPanel, GovernancePanel, AgentHealthCard, TableColumn 
} from "@/components/private-app";
import { feedItems, timelineSteps, ClusterNode } from "./mock-data";

// ==========================================
// 1. OVERSIGHT DECK TAB
// ==========================================
export function OversightDeckTab() {
  return (
    <div className="space-y-6">
      <PrivatePageHeader 
        title="Global Oversight Deck" 
        desc="Sovereign enterprise telemetry, isolated enclave thread mappings, and real-time security checking."
        actions={
          <>
            <button className="h-9 px-4 rounded border border-white/10 bg-white/[0.01] text-[11px] font-mono font-bold uppercase tracking-wider text-white hover:bg-white/[0.03] transition-all cursor-pointer">
              Export Audit Trail
            </button>
            <button className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]">
              <span>Provision Enclave</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricTile 
          title="Global Active Threads" 
          value="128 Core Loops" 
          delta="12.4%" 
          direction="up" 
          status="normal"
          sparkPoints={[32, 45, 38, 52, 48, 65, 58, 72, 69, 85, 78, 82]}
        />
        <MetricTile 
          title="Mean Node Latency" 
          value="14.2 milliseconds" 
          delta="2.1%" 
          direction="down" 
          status="stable"
          sparkPoints={[18, 16, 17, 15, 14, 15, 14, 13, 14, 14, 13, 14]}
        />
        <MetricTile 
          title="Active Compliance Level" 
          value="100.00% SECURE" 
          delta="0.0%" 
          direction="neutral" 
          status="normal"
          sparkPoints={[100, 100, 100, 100, 100, 100, 100, 100, 100, 100]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsPanel />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AgentHealthCard 
              agent={{
                id: "1",
                name: "RETAIL-CORE-A1",
                status: "verified",
                threads: 24,
                memory: "4.2 GB / 8.0 GB",
                logs: [
                  "Core verification complete (SHA-256: FF81)",
                  "Local memory state synchronized successfully",
                  "eBPF telemetry boundary active"
                ]
              }}
            />
            <AgentHealthCard 
              agent={{
                id: "4",
                name: "MED-CLINIC-H9",
                status: "evaluating",
                threads: 16,
                memory: "7.1 GB / 8.0 GB",
                logs: [
                  "Warning: Thread load above safety line (85%)",
                  "Triggered telemetry frame check...",
                  "Awaiting auto-scaling context re-allocator"
                ]
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-white/5 rounded-2xl bg-[#050505]/40 backdrop-blur-sm p-5 space-y-4">
            <h4 className="text-[13px] font-bold font-mono tracking-widest text-white uppercase border-b border-white/5 pb-2.5">INTEGRITY STREAM</h4>
            <ActivityFeed items={feedItems} />
          </div>

          <div className="border border-white/5 rounded-2xl bg-[#050505]/40 backdrop-blur-sm p-5 space-y-4">
            <h4 className="text-[13px] font-bold font-mono tracking-widest text-white uppercase border-b border-white/5 pb-2.5">DEPLOYMENT MILESTONES</h4>
            <Timeline steps={timelineSteps} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ENCLAVE CLUSTERS TAB
// ==========================================
export function EnclaveClustersTab({ 
  searchQuery, 
  setSearchQuery, 
  columns, 
  filteredNodes 
}: { 
  searchQuery: string; 
  setSearchQuery: (val: string) => void;
  columns: TableColumn<ClusterNode>[];
  filteredNodes: ClusterNode[];
}) {
  return (
    <div className="space-y-6">
      <PrivatePageHeader 
        title="Isolated Enclave Clusters" 
        desc="Examine, verify, and filter hardware-isolated sandbox enclaves."
      />
      
      <FilterBar 
        searchPlaceholder="Search clusters by identifier or enterprise client..."
        onSearchChange={setSearchQuery}
      />

      <DataTable 
        columns={columns}
        data={filteredNodes}
        pageSize={5}
      />
    </div>
  );
}

// ==========================================
// 3. GUARDRAIL LEDGER TAB
// ==========================================
export function GuardrailLedgerTab() {
  return (
    <div className="space-y-6">
      <PrivatePageHeader 
        title="ISO-27001 Policy Checklists" 
        desc="Simulate compliance check overrides and enforce organizational rulesets on local sandbox enclaves."
      />
      <div className="max-w-3xl">
        <GovernancePanel />
      </div>
    </div>
  );
}
