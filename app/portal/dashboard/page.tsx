"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  Bot, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  History, 
  Settings,
  ShieldAlert,
  Terminal,
  Zap,
  HelpCircle,
  ExternalLink
} from "lucide-react";

import { 
  MetricTile, 
  WorkspaceCard, 
  StatusBadge,
  PrivatePageHeader,
  AgentHealthCard,
  ProjectCard,
  DocumentCard,
  InvoiceCard,
  SupportTicketCard,
  AnalyticsPanel,
  GovernancePanel,
  ActivityFeed,
  Timeline
} from "@/components/private-app";

import { 
  previewProjects,
  previewAgentOperations,
  previewDocuments,
  previewInvoices,
  previewSupportTickets,
  previewAnalyticsMetrics,
  previewActivityEvents,
  PREVIEW_META
} from "@/lib/mock-data-model";

export default function ClientDashboardPage() {
  // Map preview projects to expected ProjectSpec structure
  const mappedProjects = previewProjects.slice(0, 2).map(proj => ({
    id: proj.id,
    name: proj.name,
    status: (proj.status === "active" ? "verified" : "evaluating") as "verified" | "evaluating",
    desc: proj.desc,
    nodesCount: proj.nodesCount,
    lastUpdated: new Date(proj.lastUpdated).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }));

  // Map preview agent operations to AgentSpec
  const mappedAgents = previewAgentOperations.slice(0, 2).map(agent => ({
    id: agent.id,
    name: agent.name,
    status: (agent.status === "active" ? "verified" : agent.status === "decoupled" ? "decoupled" : "evaluating") as "verified" | "evaluating" | "decoupled",
    threads: agent.threads,
    memory: agent.memory,
    logs: agent.logs
  }));

  return (
    <div className="space-y-6 max-w-[1750px] mx-auto pb-12 select-none">
      
      {/* 1. SECURE DISCLOSURE BANNER */}
      <div className="border border-[#009DFF]/20 bg-[#009DFF]/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2.5 text-white/70">
          <ShieldAlert className="w-4 h-4 text-[#009DFF] shrink-0" />
          <span>
            <strong className="text-white">PREVIEW TELEMETRY MODE:</strong> This cockpit displays simulated transaction streams and deterministic sandbox environments for demonstration purposes.
          </span>
        </div>
        <span className="text-[9.5px] text-[#009DFF]/80 font-bold bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          DEMO ENVIRONMENT ACTIVE
        </span>
      </div>

      {/* 2. PRIVATE PAGE WELCOME HEADER */}
      <PrivatePageHeader
        title="Oversight Core Workspace"
        desc="Central cryptographic dashboard monitoring decoupled sandbox enclaves, active model guardrails, and compliance logs."
        badgeLabel="Level III Clearance"
        actions={
          <div className="flex gap-2 w-full md:w-auto">
            <Link
              href="/portal/support"
              className="flex-grow md:flex-grow-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-[11px] font-mono font-bold text-white hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#009DFF]" />
              <span>LAUNCH PRIORITY WIRE</span>
            </Link>
            <Link
              href="/portal/settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
              title="Enclave Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        }
      />

      {/* 3. ENCLAVE HANDSHAKE ARCHITECTURE VISUAL */}
      <WorkspaceCard className="p-4 bg-[#050505]/40 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Handshake Established
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          {/* Left Part: Client local node */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#009DFF]/10 border border-[#009DFF]/25 text-[#009DFF]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[12px] font-bold text-white font-mono">PORTAL PRESENTER</h5>
              <p className="text-[10px] text-white/40 font-mono">IP: 192.168.42.100 [Simulated Browser Session]</p>
            </div>
          </div>

          {/* Center Part: SVG animated pipeline */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center justify-center">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-[#009DFF]/30 via-emerald-500/30 to-[#E4000F]/30" />
              <div className="relative z-10 flex gap-8 font-mono text-[9px] text-white/40 px-4 bg-[#020202]/80 border border-white/5 rounded-full py-1">
                <span>TLS 1.3 SECURE</span>
                <span>AES-256-GCM</span>
                <span>eBPF AUDITED</span>
              </div>
            </div>
          </div>

          {/* Right Part: GFF Hardware Core */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#E4000F]/10 border border-[#E4000F]/25 text-[#E4000F]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[12px] font-bold text-white font-mono">GFF CO-PROCESSOR</h5>
              <p className="text-[10px] text-white/40 font-mono">ID: SECURE-ENCLAVE-02 [Hardware Partition]</p>
            </div>
          </div>
        </div>
      </WorkspaceCard>

      {/* 4. ACCOUNT SUMMARY - PREMIUM METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {previewAnalyticsMetrics.map((metric) => (
          <MetricTile
            key={metric.id}
            title={metric.name}
            value={String(metric.value)}
            delta={metric.delta}
            direction={metric.direction}
            status={metric.status === "critical" ? "error" : metric.status}
            sparkPoints={metric.sparkPoints}
          />
        ))}
      </div>

      {/* 5. MAIN CONTENT BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PORTION (8 COLS): Operations, Projects, Analytics */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Projects Block */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#009DFF]" />
                <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Active Sandbox Environments</h3>
              </div>
              <Link href="/portal/projects" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
                View All Projects <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mappedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                />
              ))}
            </div>
          </div>

          {/* AI Operations Status Block */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#00FFC2]" />
                <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">AI Operations & Models</h3>
              </div>
              <Link href="/portal/ai-operations" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
                View All Agents <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mappedAgents.map((agent) => (
                <AgentHealthCard
                  key={agent.id}
                  agent={agent}
                  onRestart={() => console.log(`Enclave ${agent.name} reboot cycle completed.`)}
                />
              ))}
            </div>
          </div>

          {/* Real-time Telemetry Analytics Highlights */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Real-time Computing Telemetry</h3>
              </div>
              <Link href="/portal/analytics" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
                Full Telemetry Stream <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <AnalyticsPanel />
          </div>

        </div>

        {/* RIGHT PORTION (4 COLS): Governance, Actions, Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recommended Next Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Recommended Next Actions</h3>
            </div>
            <WorkspaceCard className="p-5">
              <Timeline
                steps={[
                  {
                    title: "Resolve HSM Key Key-Rotation",
                    desc: "The automatic 30-day ISO-27001 key rollover requires administrator manual handshake confirmation bypass inside Support Ticket SLA-TKT-9912.",
                    status: "current",
                    timestamp: "Action Needed"
                  },
                  {
                    title: "Audit Q2 Compliance Signed Report",
                    desc: "Confirm and archive signed receipt logs that Auditor Jenkins generated on the secure system ledger.",
                    status: "pending",
                    timestamp: "Step 2"
                  },
                  {
                    title: "Verify Core Sandbox 02 Parameters",
                    desc: "Double-check kernel-level isolated boundaries to prevent thread overhead on local geological nodes.",
                    status: "pending",
                    timestamp: "Step 3"
                  }
                ]}
              />
            </WorkspaceCard>
          </div>

          {/* Governance Alerts Ledger */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Active Guardrails Ledger</h3>
              </div>
              <Link href="/portal/governance" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
                All Policies <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <GovernancePanel />
          </div>

          {/* Recent Handshake Activity Stream */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Recent Sandbox Activity</h3>
              </div>
              <span className="text-[10px] font-mono text-white/35">POLLING ACTIVE</span>
            </div>
            
            <WorkspaceCard className="p-5">
              <ActivityFeed
                items={previewActivityEvents.slice(0, 3).map(evt => ({
                  id: evt.id,
                  category: evt.category as "security" | "compile" | "ledger" | "health",
                  title: evt.title,
                  desc: evt.desc,
                  timestamp: evt.timestamp,
                  meta: evt.meta
                }))}
              />
            </WorkspaceCard>
          </div>

        </div>

      </div>

      {/* 6. BOTTOM ROW: Documents, Billing, Support & Premium CTA */}
      <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Document Updates Block */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Compliance Documents</h3>
            </div>
            <Link href="/portal/documents" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
              Vault <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {previewDocuments.slice(0, 1).map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.name}
                fileSize={doc.size}
                type={doc.format}
                sha256={doc.hash}
                onDownload={() => alert(`Initiating secure container download: ${doc.name}`)}
              />
            ))}
          </div>
        </div>

        {/* Billing Snapshot Block */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Ledgers & Invoices</h3>
            </div>
            <Link href="/portal/billing" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
              Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {previewInvoices.slice(0, 1).map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoiceNo={invoice.id}
                issueDate={invoice.date}
                amount={invoice.amount}
                status={invoice.status === "paid" ? "settled" : "pending"}
                signature={invoice.hash}
              />
            ))}
          </div>
        </div>

        {/* Support Tickets & Premium SLA CTA Card */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-400" />
              <h3 className="text-[12px] font-bold text-white font-mono uppercase tracking-widest">Support Wire</h3>
            </div>
            <Link href="/portal/support" className="text-[11px] text-[#009DFF] hover:underline flex items-center gap-1 font-mono uppercase font-semibold">
              Support <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {previewSupportTickets.slice(0, 1).map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticketId={ticket.id}
                subject={ticket.title}
                slaTimer="45 mins"
                priority="P1"
                status={ticket.status.toUpperCase()}
              />
            ))}
          </div>
        </div>

      </div>

      {/* 7. PREMIUM SECURE ACTION CTA CARD */}
      <WorkspaceCard className="border border-[#009DFF]/30 bg-gradient-to-br from-[#040914] to-[#010307] p-6 space-y-4 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldCheck className="w-40 h-40 text-[#009DFF]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#009DFF]">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Sovereign Hardware Provisioning</span>
            </div>
            <h4 className="text-[15px] font-bold text-white font-mono">Need to provision a new dedicated AMD SEV-SNP hardware cluster?</h4>
            <p className="text-[11px] text-white/60 leading-relaxed font-mono">
              Authorized operators can request transient hardware allocation boundaries directly over our cryptographic priority support wire. Memory partitions are isolated instantly with SOC2 compliance locks.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/portal/support"
              className="inline-flex h-9 px-5 items-center justify-center gap-2 rounded-lg bg-[#009DFF] hover:bg-[#009DFF]/90 text-white font-mono font-bold text-[10.5px] uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,157,255,0.3)]"
            >
              Request Hardware Allocation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </WorkspaceCard>

    </div>
  );
}
