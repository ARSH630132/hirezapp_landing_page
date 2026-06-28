"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  CreditCard,
  FileText,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PrivatePageHeader, InfoTooltip } from "@/components/private-app";

type AdminDashboardData = {
  success: boolean;
  summary: {
    clients: { totalCount: number; recent: any[] };
    projects: { activeCount: number; totalCount: number; recent: any[] };
    aiOperations: { activeCount: number; totalCount: number; recent: any[] };
    documents: { verifiedCount: number; totalCount: number; recent: any[] };
    invoices: { unpaidCount: number; totalCount: number; recent: any[] };
    support: { openCount: number; totalCount: number; recent: any[] };
    governance: { flaggedCount: number; totalCount: number; recent: any[] };
  };
};

function MetricCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
  tooltip,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 hover:border-white/10 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] uppercase tracking-widest text-white/45">{label}</p>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
          <p className="text-2xl font-semibold text-white">{value}</p>
          <p className="text-[11px] text-white/55">{detail}</p>
        </div>
        <Icon className="w-5 h-5 text-[#009DFF]" />
      </div>
    </Link>
  );
}

function RecentList({
  title,
  href,
  emptyLabel,
  items,
  renderItem,
}: {
  title: string;
  href: string;
  emptyLabel: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#050505]/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white">{title}</h2>
        <Link href={href} className="text-[11px] text-[#009DFF] hover:underline">
          View all
        </Link>
      </div>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-white/45">{emptyLabel}</p>
      )}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token")
          : null;

      if (!token) {
        throw new Error("Your session is missing. Please sign in again.");
      }

      const response = await fetch("/api/v1/dashboard/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to load the admin dashboard.");
      }

      setData(payload);
    } catch (err: any) {
      setError(err.message || "Failed to load the admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PrivatePageHeader
          title="Admin Dashboard"
          desc="Overview of clients, projects, AI operations, documents, billing, support, and governance."
        />
        <button
          onClick={fetchDashboard}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-[11px] font-mono font-bold text-white hover:bg-white/[0.06]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#009DFF]" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-6 text-[12px] text-white/60">
          Loading admin dashboard...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-[12px] text-red-200">
          {error}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Clients"
              value={String(data.summary.clients.totalCount)}
              detail="Registered client accounts"
              href="/admin/clients"
              icon={Users}
              tooltip="The global registry of enterprise client accounts active on the GFF platform."
            />
            <MetricCard
              label="AI Operations"
              value={`${data.summary.aiOperations.activeCount}/${data.summary.aiOperations.totalCount}`}
              detail="Running and total AI operations"
              href="/admin/ai-operations"
              icon={Bot}
              tooltip="Total counts and status checks of hardware-isolated model partitions running across all tenant boundaries."
            />
            <MetricCard
              label="Documents"
              value={`${data.summary.documents.verifiedCount}/${data.summary.documents.totalCount}`}
              detail="Verified and total documents"
              href="/admin/documents"
              icon={FileText}
              tooltip="Total NDAs, project blueprints, and hardware-compliance certificates securely loaded into AWS S3."
            />
            <MetricCard
              label="Open Support"
              value={`${data.summary.support.openCount}`}
              detail="Support tickets still open"
              href="/admin/support"
              icon={HelpCircle}
              tooltip="Incoming customer technical requests, system re-attestation tickets, or configuration questions pending SLA review."
            />
            <MetricCard
              label="Projects"
              value={`${data.summary.projects.activeCount}/${data.summary.projects.totalCount}`}
              detail="Active and total projects"
              href="/admin/projects"
              icon={Users}
              tooltip="Enterprise program lifecycle stages tracked globally across all registered organizations."
            />
            <MetricCard
              label="Billing"
              value={`${data.summary.invoices.unpaidCount}`}
              detail="Invoices still pending"
              href="/admin/billing"
              icon={CreditCard}
              tooltip="Active and pending invoice items tracked globally across all clients for computing time and hosting fees."
            />
            <MetricCard
              label="Governance"
              value={`${data.summary.governance.flaggedCount}`}
              detail="Items that need attention"
              href="/admin/governance"
              icon={ShieldCheck}
              tooltip="System compliance violations, alignment issues, or policy drift warnings globally flagged by the guardrail audits."
            />
            <MetricCard
              label="Analytics"
              value={String(data.summary.projects.totalCount + data.summary.aiOperations.totalCount)}
              detail="Projects and AI operations tracked"
              href="/admin/analytics"
              icon={RefreshCw}
              tooltip="Global platform workload volume and computing performance metrics aggregated from node sensors."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentList
              title="Recent Clients"
              href="/admin/clients"
              emptyLabel="No clients available."
              items={data.summary.clients.recent.slice(0, 5)}
              renderItem={(client) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{client.name}</p>
                  <p className="text-[11px] text-white/55">
                    {client.industry || "No industry"} • {client.region || "No region"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Recent Projects"
              href="/admin/projects"
              emptyLabel="No projects available."
              items={data.summary.projects.recent.slice(0, 5)}
              renderItem={(project) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{project.name}</p>
                  <p className="text-[11px] text-white/55">
                    {project.client_name || project.client_id || "No client"} • {project.status || "Unknown status"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Recent AI Operations"
              href="/admin/ai-operations"
              emptyLabel="No AI operations available."
              items={data.summary.aiOperations.recent.slice(0, 5)}
              renderItem={(operation) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{operation.name}</p>
                  <p className="text-[11px] text-white/55">
                    {operation.client_name || operation.client_id || "No client"} • {operation.status || "Unknown status"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Support And Governance"
              href="/admin/support"
              emptyLabel="No support or governance items available."
              items={[
                ...data.summary.support.recent.slice(0, 2).map((item) => ({ ...item, _type: "support" })),
                ...data.summary.governance.recent.slice(0, 2).map((item) => ({ ...item, _type: "governance" })),
              ]}
              renderItem={(item) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">
                    {item._type === "support" ? item.subject || item.title : item.title}
                  </p>
                  <p className="text-[11px] text-white/55">
                    {item._type === "support"
                      ? `${item.client_name || "No client"} • ${item.status || "Unknown status"}`
                      : `${item.client_name || "No client"} • ${item.severity || "Unknown severity"}`}
                  </p>
                </div>
              )}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
