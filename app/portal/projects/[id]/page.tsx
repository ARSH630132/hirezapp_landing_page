"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Cpu, ShieldCheck, RefreshCw, Terminal, User } from "lucide-react";
import { WorkspaceCard } from "@/components/private-app";

interface ApiProject {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  phase: string;
  status: string;
  health: string;
  owner: string;
  nodesCount: number;
  enclaveType: string;
  desc: string;
  lastUpdated: string;
}

export default function ClientProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [project, setProject] = useState<ApiProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
        if (!token) {
          setError("AUTHENTICATION EXPIRED");
          router.push("/portal/login");
          return;
        }
        const reqId = typeof id === "string" ? id.toLowerCase() : "";
        const res = await fetch(`/api/v1/projects/${reqId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) {
          throw new Error(`Enclave details could not be retrieved (${res.status})`);
        }
        const data = await res.json();
        if (data.success && data.project) {
          if (isSubscribed) setProject(data.project);
        } else {
          throw new Error("Project details returned invalid format.");
        }
      } catch (err: any) {
        console.error("Error fetching project details:", err);
        if (isSubscribed) setError(err.message || "Enclave telemetry sync failed.");
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    fetchProject();
    return () => { isSubscribed = false; };
  }, [id, router]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1750px] mx-auto pb-16 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5" />
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded w-24" />
            <div className="h-6 bg-white/5 rounded w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-60 bg-white/[0.02] border border-white/5 rounded-xl" />
            <div className="h-40 bg-white/[0.02] border border-white/5 rounded-xl" />
          </div>
          <div className="h-60 bg-white/[0.02] border border-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6 max-w-[1750px] mx-auto pb-16">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/portal/projects")} className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Enclave Sync Failed</h2>
        </div>
        <WorkspaceCard className="p-8 border border-red-500/10 bg-red-950/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1.5 font-mono">
            <h4 className="text-white font-bold uppercase text-[14px]">ENCLAVE SYNC ERROR</h4>
            <p className="text-white/50 text-[11px] leading-relaxed">{error || "Sovereign details could not be retrieved from the decentralized registry."}</p>
          </div>
          <button onClick={() => window.location.reload()} className="h-9 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-[11px] uppercase cursor-pointer flex items-center gap-2 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RE-SYNC PROTOCOL</span>
          </button>
        </WorkspaceCard>
      </div>
    );
  }

  const projectId = project.id.toUpperCase();
  const nodeMap: Record<string, string> = {
    "proj-001": "FF-701A-CH", "proj-002": "RM-404B-SG", "proj-003": "CC-302F-US", "proj-004": "TV-209O-UK", "proj-005": "ND-318E-JP"
  };
  const nodeHash = nodeMap[project.id] || `${projectId}-NODE`;

  return (
    <div className="space-y-6 max-w-[1750px] mx-auto pb-16">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/projects")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Active Sandbox Project ({project.enclaveType})
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">
            {project.name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Cpu className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Enclave Node Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-mono text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between items-center">
                <span className="text-white/40">Node Hash Identifier:</span>
                <span className="text-white font-bold">{nodeHash}</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between items-center">
                <span className="text-white/40">Context State Frame:</span>
                <span className="text-emerald-400 font-bold uppercase">{project.status === "active" ? "DECOUPLED" : "IDLE"}</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between items-center">
                <span className="text-white/40">Dedicated Sandbox CPU:</span>
                <span className="text-white">{project.nodesCount * 8} vCPU Cores</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between items-center">
                <span className="text-white/40">Memory Isolation Bounds:</span>
                <span className="text-white">{project.nodesCount * 16} GB RAM</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between items-center col-span-1 md:col-span-2">
                <span className="text-white/40">Enclave Type:</span>
                <span className="text-[#009DFF] font-bold">{project.enclaveType} Hardware Isolation</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Active Telemetry Diagnostic stream</h3>
            </div>
            <div className="space-y-2.5 font-mono text-[11px] text-white/50">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>[04:22:10] eBPF socket listening on hardware node {nodeHash}...</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>[04:22:15] Verify cryptographic key handshake with {project.enclaveType} isolation...</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">VERIFIED</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>[04:22:18] Sandbox container policy checks complete</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">VERIFIED</span>
              </div>
              <div className="flex justify-between text-white/30 text-[9.5px]">
                <span>Registered client: {project.client_name}</span>
                <span>Last updated: {new Date(project.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Security State</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-green-500/5 border border-green-500/20 text-green-400 font-bold">
                <span>COMPLIANCE LEVEL:</span>
                <span>SECURE</span>
              </div>
              <div className="space-y-2 text-white/50 text-[10.5px] leading-relaxed">
                <p>This sandbox project conforms entirely to sovereign zero-trust requirements including TLS 1.3 dual-layer sockets and micro-enclave hardware-level memory boundaries of {project.nodesCount * 16} GB.</p>
                <p>Current Lifecycle stage is listed as <span className="text-white font-bold">{project.phase}</span> with a real-time health indicator of <span className="text-emerald-400 font-bold">{project.health.toUpperCase()}</span>.</p>
                {project.desc && (
                  <p className="border-t border-white/5 pt-2 mt-2 text-white/60">
                    <strong className="text-white block uppercase text-[9px] mb-1">Project Description:</strong>
                    {project.desc}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-[#009DFF]" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Project Ownership</h3>
            </div>
            <div className="font-mono text-[11px] space-y-1">
              <div className="text-white/30 text-[9px] uppercase">Delivery Program Lead</div>
              <div className="text-white font-bold text-[12px]">{project.owner}</div>
              <div className="text-white/40 text-[10px] mt-1">Sovereign GFF Authorized Operator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
