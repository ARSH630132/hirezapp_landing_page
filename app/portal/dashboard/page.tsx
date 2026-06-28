"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bot,
  CreditCard,
  FileText,
  HelpCircle,
  Layers,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PrivatePageHeader } from "@/components/private-app";

type ClientDashboardData = {
  success: boolean;
  client_id: string;
  client_name?: string;
  summary: {
    projects: { activeCount: number; totalCount: number; recent: any[] };
    aiOperations: { activeCount: number; totalCount: number; recent: any[] };
    documents: { verifiedCount: number; totalCount: number; recent: any[] };
    invoices: { unpaidCount: number; totalCount: number; recent: any[] };
    supportTickets: { openCount: number; totalCount: number; recent: any[] };
    governance: { flaggedCount: number; totalCount: number; recent: any[] };
  };
};

function MetricCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 hover:border-white/10 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-white/45">{label}</p>
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

export default function ClientDashboardPage() {
  const [data, setData] = useState<ClientDashboardData | null>(null);
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

      const response = await fetch("/api/v1/dashboard/client", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to load the client dashboard.");
      }

      setData(payload);
    } catch (err: any) {
      setError(err.message || "Failed to load the client dashboard.");
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
          title="Client Dashboard"
          desc="Your projects, AI operations, documents, billing, support, analytics, and governance in one place."
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
          Loading client dashboard...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-[12px] text-red-200">
          {error}
        </div>
      ) : data ? (
        <>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-[11px] text-white/75">
            You are viewing data for <span className="font-semibold text-emerald-400">{data.client_name || data.client_id}</span>.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Projects"
              value={`${data.summary.projects.activeCount}/${data.summary.projects.totalCount}`}
              detail="Active and total projects"
              href="/portal/projects"
              icon={Layers}
            />
            <MetricCard
              label="AI Operations"
              value={`${data.summary.aiOperations.activeCount}/${data.summary.aiOperations.totalCount}`}
              detail="Running and total AI operations"
              href="/portal/ai-operations"
              icon={Bot}
            />
            <MetricCard
              label="Documents"
              value={`${data.summary.documents.verifiedCount}/${data.summary.documents.totalCount}`}
              detail="Verified and total documents"
              href="/portal/documents"
              icon={FileText}
            />
            <MetricCard
              label="Billing"
              value={`${data.summary.invoices.unpaidCount}`}
              detail="Invoices still pending"
              href="/portal/billing"
              icon={CreditCard}
            />
            <MetricCard
              label="Support"
              value={`${data.summary.supportTickets.openCount}`}
              detail="Support tickets still open"
              href="/portal/support"
              icon={HelpCircle}
            />
            <MetricCard
              label="Governance"
              value={`${data.summary.governance.flaggedCount}`}
              detail="Items that need attention"
              href="/portal/governance"
              icon={ShieldCheck}
            />
            <MetricCard
              label="Analytics"
              value={String(data.summary.projects.totalCount + data.summary.aiOperations.totalCount)}
              detail="Projects and AI operations tracked"
              href="/portal/analytics"
              icon={BarChart3}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentList
              title="Recent Projects"
              href="/portal/projects"
              emptyLabel="No projects available."
              items={data.summary.projects.recent.slice(0, 5)}
              renderItem={(project) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{project.name}</p>
                  <p className="text-[11px] text-white/55">
                    {project.phase || "No phase"} • {project.status || "Unknown status"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Recent AI Operations"
              href="/portal/ai-operations"
              emptyLabel="No AI operations available."
              items={data.summary.aiOperations.recent.slice(0, 5)}
              renderItem={(operation) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{operation.name}</p>
                  <p className="text-[11px] text-white/55">
                    {operation.agent_type || "No type"} • {operation.status || "Unknown status"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Recent Documents"
              href="/portal/documents"
              emptyLabel="No documents available."
              items={data.summary.documents.recent.slice(0, 5)}
              renderItem={(document) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">{document.title}</p>
                  <p className="text-[11px] text-white/55">
                    {document.status || "Unknown status"} • {document.fileSize || "Unknown size"}
                  </p>
                </div>
              )}
            />
            <RecentList
              title="Billing, Support And Governance"
              href="/portal/support"
              emptyLabel="No billing, support, or governance items available."
              items={[
                ...data.summary.invoices.recent.slice(0, 2).map((item) => ({ ...item, _type: "invoice" })),
                ...data.summary.supportTickets.recent.slice(0, 2).map((item) => ({ ...item, _type: "support" })),
                ...data.summary.governance.recent.slice(0, 2).map((item) => ({ ...item, _type: "governance" })),
              ]}
              renderItem={(item) => (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-white">
                    {item._type === "invoice"
                      ? item.invoice_number || item.id
                      : item._type === "support"
                        ? item.subject || item.title
                        : item.title}
                  </p>
                  <p className="text-[11px] text-white/55">
                    {item._type === "invoice"
                      ? `${item.currency || "USD"} ${item.amount} • ${item.status || "Unknown status"}`
                      : item._type === "support"
                        ? `${item.priority || "No priority"} • ${item.status || "Unknown status"}`
                        : `${item.severity || "No severity"} • ${item.status || "Unknown status"}`}
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
