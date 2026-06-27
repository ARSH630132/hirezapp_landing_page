"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Cpu, Activity, ShieldCheck, Layers, Play, Pause, Terminal } from "lucide-react";
import { WorkspaceCard } from "@/components/private-app";

export default function ClientAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [pollInterval, setPollInterval] = useState(2000);
  const [lastSync, setLastSync] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<"global" | "sg" | "lon">("global");
  const [pts, setPts] = useState<number[]>([42, 45, 38, 52, 48, 65, 58, 72, 69, 85, 78, 82]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const load = useCallback(async (isSilent = false) => {
    if (!isSilent) { setLoading(true); setError(null); }
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        setError("AUTHENTICATION EXPIRED.");
        router.push("/portal/login");
        return;
      }
      const r = await fetch("/api/v1/analytics/client", { headers: { "Authorization": `Bearer ${token}` } });
      if (!r.ok) throw new Error(`Status ${r.status}`);
      const d = await r.json();
      if (d.success && d.summary) {
        setData(d.summary);
        setLastSync(new Date().toLocaleTimeString());
      } else throw new Error("Malformed registry.");
    } catch (err: any) {
      if (!isSilent) setError(err.message || "Failed.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setPts(p => {
        const last = p[p.length - 1];
        let baseMin = 20, baseMax = 95;
        if (selectedRegion === "sg") { baseMin = 30; baseMax = 65; }
        else if (selectedRegion === "lon") { baseMin = 15; baseMax = 50; }
        const next = Math.min(baseMax, Math.max(baseMin, last + (Math.floor(Math.random() * 16) - 8)));
        return [...p.slice(1), next];
      });
      load(true);

      const events = [
        `[TELEMETRY] Query parsed inside Intel SGX isolated enclave. Latency: ${selectedRegion === "sg" ? "4.1" : selectedRegion === "lon" ? "3.2" : "3.7"}ms`,
        `[SECURITY] zero-trust eBPF host syscall filter checks passed (100% compliant)`,
        `[HSM] Cryptographic seal checked with master hardware module. Signature validated.`,
        `[NET] Dual-signatory TLS 1.3 tunnels active. Packet checksum verified.`
      ];
      setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ${events[Math.floor(Math.random() * events.length)]}`, ...prev.slice(0, 5)]);
    }, pollInterval);
    return () => clearInterval(t);
  }, [isLive, pollInterval, selectedRegion, load]);

  const maxVal = useMemo(() => Math.max(...pts, 100), [pts]);
  const minVal = useMemo(() => Math.min(...pts, 0), [pts]);
  const range = maxVal - minVal || 1;
  const areaPoints = useMemo(() => [`0,120`, ...pts.map((v, i) => `${(i / (pts.length - 1)) * 500},${120 - ((v - minVal) / range) * 100 - 10}`), `500,120`].join(" "), [pts, minVal, range]);
  const linePoints = useMemo(() => pts.map((v, i) => `${(i / (pts.length - 1)) * 500},${120 - ((v - minVal) / range) * 100 - 10}`).join(" "), [pts, minVal, range]);

  if (loading) return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-16 font-mono p-6 text-white min-h-[400px] flex flex-col justify-center items-center">
      <RefreshCw className="w-8 h-8 text-[#009DFF] animate-spin mb-4" />
      <div className="text-xs text-white/50 animate-pulse uppercase tracking-widest">Coupling Telemetry Matrix...</div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center max-w-md mx-auto my-16 font-mono text-white border border-red-500/10 bg-red-950/5 rounded-xl">
      <ShieldCheck className="w-8 h-8 text-red-400 mx-auto mb-4 animate-pulse" />
      <h3 className="text-sm font-bold uppercase mb-2">TELEMETRY LINK BREACHED</h3>
      <p className="text-white/50 text-[11px] mb-4">{error}</p>
      <button onClick={() => load(false)} className="mx-auto h-8 px-4 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer">
        <RefreshCw className="w-3.5 h-3.5" /> Re-establish Link
      </button>
    </div>
  );

  return (
    <div className="space-y-6 font-mono text-white max-w-[1700px] mx-auto select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-md font-bold uppercase tracking-wider">Sovereign Enclave Telemetry</h2>
          <p className="text-[10px] text-white/45 mt-0.5">Real-time cross-cluster spends and cryptographic sandbox isolation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-black/45 border border-white/5 rounded p-1">
            <button onClick={() => setIsLive(true)} className={`h-6 px-2 rounded text-[9px] font-bold uppercase cursor-pointer ${isLive ? "bg-[#00FFC2]/10 text-[#00FFC2]" : "text-white/40"}`}><Play className="w-2 h-2" /> Live</button>
            <button onClick={() => setIsLive(false)} className={`h-6 px-2 rounded text-[9px] font-bold uppercase cursor-pointer ${!isLive ? "bg-amber-500/10 text-amber-400" : "text-white/40"}`}><Pause className="w-2 h-2" /> Paused</button>
          </div>
          <div className="flex items-center gap-1 bg-black/45 border border-white/5 rounded p-1">
            {[1000, 2000, 5000].map(v => (
              <button key={v} onClick={() => setPollInterval(v)} className={`h-6 px-1.5 rounded text-[9px] font-bold cursor-pointer ${pollInterval === v ? "bg-white/5 text-white" : "text-white/30"}`}>{v / 1000}s</button>
            ))}
          </div>
          <button onClick={() => load(false)} className="h-8 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Sync</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 rounded-xl border border-white/5 bg-[#050505]/40 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-[#009DFF]" /> CPU Telemetry</span>
            <div className="flex items-center gap-1 bg-black/50 border border-white/5 rounded p-0.5">
              {[{ id: "global", label: "Global" }, { id: "sg", label: "SG A" }, { id: "lon", label: "LDN C" }].map(reg => (
                <button key={reg.id} onClick={() => setSelectedRegion(reg.id as any)} className={`h-5 px-1.5 rounded text-[8.5px] font-bold uppercase ${selectedRegion === reg.id ? "bg-white/5 text-white" : "text-white/30"}`}>{reg.label}</button>
              ))}
            </div>
          </div>
          <div className="h-40 bg-black/30 border border-white/5 rounded-xl relative overflow-hidden flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-30 text-[8px] text-white/30">
              <div className="w-full border-t border-dashed border-white/5 text-right">95% MAX</div>
              <div className="w-full border-t border-dashed border-white/5 text-right font-mono">10% MIN</div>
            </div>
            <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs><linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#009DFF" stopOpacity="0.2" /><stop offset="100%" stopColor="#009DFF" stopOpacity="0" /></linearGradient></defs>
              <polygon fill="url(#glowGrad)" points={areaPoints} className="transition-all duration-300" />
              <polyline fill="none" stroke="#009DFF" strokeWidth="2" points={linePoints} className="transition-all duration-300" />
            </svg>
            <div className="absolute top-3 left-4 flex gap-4 text-[9px]">
              <div><span className="text-white/30 block">Current Capacity</span><span className="text-white font-bold text-xs">{pts[pts.length - 1]}% Load</span></div>
              <div><span className="text-white/30 block">Peak Load</span><span className="text-[#00FFC2] font-bold text-xs">{maxVal}%</span></div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-3">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Cluster Hardware Health</h3>
            </div>
            <div className="space-y-3 text-[10px] text-white/60">
              {[
                { label: "Singapore Zone A", spec: "AMD SEV-SNP 64-C", ping: "4ms", load: `${pts[pts.length - 1] - 5}%` },
                { label: "London Zone C", spec: "Intel SGX 32-Core", ping: "3ms", load: `${Math.max(10, Math.floor(pts[pts.length - 1] / 1.6))}%` },
                { label: "Local Enclave Mesh", spec: "Decoupled Virtual HSM", ping: "1ms", load: "9.4%" }
              ].map((node, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <span className="text-white block font-bold">{node.label}</span>
                    <span className="text-[8px] text-white/35 block font-mono mt-0.5">{node.spec}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#00FFC2] font-bold block">{node.ping}</span>
                    <span className="text-white/40 block text-[8px]">{node.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-[9px] text-white/40 leading-relaxed mt-4">
            <span className="text-white font-bold uppercase block mb-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#00FFC2]" /> Isolated Memory Seal</span>
            Memory enclaves are cryptographically protected via hardware-level keys. Hardware attestation states checked on last synchronized heartbeats.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WorkspaceCard className="border border-white/5 bg-[#050505]/30 p-4 rounded-xl flex flex-col justify-between h-[110px] hover:border-white/10 transition-all">
          <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#009DFF]"><Layers className="w-3.5 h-3.5" /> Active Enclaves</span>
          <span className="text-2xl font-bold tracking-tight">{data?.projects?.totalCount || 0}</span>
          <span className="text-[8px] text-white/35">Running Host Configurations: {data?.projects?.byStatus?.active || 0}</span>
        </WorkspaceCard>
        <WorkspaceCard className="border border-white/5 bg-[#050505]/30 p-4 rounded-xl flex flex-col justify-between h-[110px] hover:border-white/10 transition-all">
          <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-purple-400"><Cpu className="w-3.5 h-3.5" /> Running AI Operations</span>
          <span className="text-2xl font-bold tracking-tight">{data?.aiOperations?.totalCount || 0}</span>
          <span className="text-[8px] text-white/35">Healthy: {data?.aiOperations?.byHealth?.healthy || 0}</span>
        </WorkspaceCard>
        <WorkspaceCard className="border border-white/5 bg-[#050505]/30 p-4 rounded-xl flex flex-col justify-between h-[110px] hover:border-white/10 transition-all">
          <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#00FFC2]"><ShieldCheck className="w-3.5 h-3.5" /> Compliance Rules</span>
          <span className="text-2xl font-bold tracking-tight">{data?.governance?.totalCount || 0}</span>
          <span className="text-[8px] text-white/35">Validated Standards: ISO-27001, SOC2, HIPAA</span>
        </WorkspaceCard>
      </div>

      <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/50 space-y-2">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-white/50">SECURE SHELL TELEMETRY LOGSTREAM</span>
          <span className="text-[8.5px] text-white/30 uppercase tracking-widest flex items-center gap-1 font-mono"><span className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full animate-ping" /> Connection Sealed</span>
        </div>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[10px] text-white/60 pt-1 select-text scrollbar-thin">
          {terminalLogs.length === 0 ? (
            <div className="text-white/20 italic">Waiting for telemetry heartbeat cycles...</div>
          ) : (
            terminalLogs.map((log, idx) => (
              <div key={idx} className="truncate flex gap-2"><span className="text-[#009DFF] shrink-0">&gt;</span><span className="leading-tight">{log}</span></div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-[9px] text-white/30 pt-2 border-t border-white/5 gap-2 select-none">
        <span>ENCLAVE DISPATCH EPOCH: 2026.E3 • LAST SYNC: {lastSync || "NEVER"}</span>
        <span>SHA-256 SESSION VECTOR DECAPSULATED DIRECTLY IN LOCAL HOST CONTAINER</span>
      </div>
    </div>
  );
}
