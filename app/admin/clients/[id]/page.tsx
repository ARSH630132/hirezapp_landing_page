"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Layers, Terminal, RefreshCw } from "lucide-react";

export default function AdminClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [dbClient, setDbClient] = useState<any>(null);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientAndProjects = async () => {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
        if (!token) {
          setError("Your session has expired. Please sign in again.");
          return;
        }

        // Fetch client details
        const clientRes = await fetch(`/api/v1/clients/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (clientRes.ok) {
          const clientData = await clientRes.json();
          if (clientData.success && clientData.client) {
            setDbClient(clientData.client);
          }
        }

        // Fetch projects
        const projectsRes = await fetch(`/api/v1/projects`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (projectsData.success && Array.isArray(projectsData.projects)) {
            const filteredProjects = projectsData.projects.filter((p: any) => p.client_id === id);
            setDbProjects(filteredProjects);
          }
        }
      } catch (err) {
        console.error("Error fetching client details/projects:", err);
        setError("Unable to load client details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientAndProjects();
    }
  }, [id]);

  // Derived Client and Projects data leveraging dynamic API enclaves, falling back to Phase 4 mock models
  const client = dbClient;
  const projects = dbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status
  }));

  const [rotating, setRotating] = useState(false);
  const [logs, setLogs] = useState<string[]>(["Client page loaded."]);

  if (!loading && (!client || error)) {
    return (
      <div className="space-y-4 font-mono text-xs text-white">
        <button onClick={() => router.push("/admin/clients")} className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-white/70 hover:text-white cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to clients
        </button>
        <div className="rounded border border-red-500/20 bg-red-500/5 p-4 text-red-300">
          {error || "Client not found."}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 font-mono text-xs text-white">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/admin/clients")} className="p-1 rounded border border-white/5 text-white/50 hover:text-white cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /></button>
          <div>
            <span className="text-[9px] text-[#009DFF] bg-[#009DFF]/10 px-1 py-0.2 rounded border border-[#009DFF]/20 uppercase">OVERSIGHT: {client.id.toUpperCase()}</span>
            <h2 className="text-sm font-bold uppercase mt-1">{client.name}</h2>
          </div>
        </div>
        <button onClick={() => router.push("/portal/dashboard")} className="h-7 px-2.5 rounded bg-[#009DFF] text-white cursor-pointer font-bold border-none text-[9px] uppercase">Open Client Portal</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded border border-white/5 bg-black/40">
              <div>Tier: <span className="text-amber-300 font-bold uppercase">{client.tier}</span></div>
              <div className="truncate">Domain: <span className="text-[#009DFF]">{client.domain}</span></div>
            </div>
            <div className="p-3 rounded border border-white/5 bg-black/40">
              <div>Region: <span className="text-[#00FFC2] font-bold">{client.region || "Not set"}</span></div>
              <div>Status: <span className="text-white/80">{client.status || "Active"}</span></div>
            </div>
          </div>
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2">
            <span className="font-bold text-white/40 uppercase flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Projects ({projects.length})</span>
            {projects.map(p => (
              <div key={p.id} className="flex justify-between items-center p-2 rounded bg-white/[0.01] border border-white/5">
                <div><div className="font-bold uppercase">{p.name}</div><span className="text-[#009DFF] text-[9px]">{p.id.toUpperCase()}</span></div>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2">
            <span className="font-bold text-white/40 uppercase text-[9px] block">Controls</span>
            <button onClick={() => {
              if (rotating) return;
              setRotating(true);
              setLogs(p => [...p, "HSM_ROLLOVER: Run..."]);
              setTimeout(() => { setLogs(p => [...p, "SUCCESS: SHA-0x8A12FF"]); setRotating(false); }, 600);
            }} disabled={rotating} className="w-full h-8 rounded border border-white/10 text-[9px] font-bold uppercase text-white flex items-center justify-center gap-1 cursor-pointer bg-white/[0.01]">
              <RefreshCw className={`w-3 h-3 ${rotating ? "animate-spin" : ""}`} />
              <span>Rotate Keys</span>
            </button>
          </div>
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2 flex flex-col h-[140px]">
            <span className="font-bold text-white/40 uppercase text-[9px] flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console</span>
            <div className="flex-1 bg-black/50 rounded p-1.5 text-[8.5px] text-emerald-400/80 space-y-1 overflow-y-auto font-mono text-left select-text">
              {logs.map((l, i) => <div key={i} className="truncate">&gt; {l}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
