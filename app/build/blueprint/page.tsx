"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function BlueprintGeneratorPage() {
  const [scale, setScale] = useState("multi");
  const [db, setDb] = useState("postgres");
  const [sec, setSec] = useState("vpc");
  const [blueprint, setBlueprint] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setBlueprint({
        scale,
        db,
        sec,
        nodes: [
          { name: "Sovereign Ingestion Node", type: "Data Trigger" },
          { name: "Cognitive Supervisor v4", type: "Core Reasoner" },
          { name: "Compliance Shield Policies", type: "Security Guardrail" },
          { name: "Output REST Dispatcher", type: "Sync Action" }
        ],
        readiness: scale === "global" ? "92%" : "78%",
        latency: "450ms"
      });
      setGenerating(false);
    }, 800);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="Blueprint Generator"
        description="Design and compile specialized multi-agent DAG topologies optimized for legacy enterprise backends."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-2xl border border-white/10 bg-[#04060b]">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Topology Configurations</h3>
          <div className="space-y-3">
            <label className="text-xs text-white/60 block">Scale Objective</label>
            <select value={scale} onChange={(e) => { setScale(e.target.value); setBlueprint(null); }} className="w-full h-[40px] rounded-lg border border-white/10 bg-black/40 px-3 text-xs text-white">
              <option value="dept">Department Productivity</option>
              <option value="multi">Multi-Agent Ecosystem</option>
              <option value="global">Global Enterprise Fleet</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs text-white/60 block">Database Storage Ingest</label>
            <select value={db} onChange={(e) => { setDb(e.target.value); setBlueprint(null); }} className="w-full h-[40px] rounded-lg border border-white/10 bg-black/40 px-3 text-xs text-white">
              <option value="postgres">PostgreSQL Schema</option>
              <option value="snowflake">Snowflake Cluster</option>
              <option value="s3">AWS S3 Vector Cache</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs text-white/60 block">Compute Subnet Environment</label>
            <select value={sec} onChange={(e) => { setSec(e.target.value); setBlueprint(null); }} className="w-full h-[40px] rounded-lg border border-white/10 bg-black/40 px-3 text-xs text-white">
              <option value="cloud">Cloud-Hosted Shared Tenant</option>
              <option value="vpc">Private VPC Single-Tenant</option>
              <option value="sovereign">Sovereign Air-Gapped Cluster</option>
            </select>
          </div>
          <button onClick={handleGenerate} disabled={generating} className="w-full h-[42px] rounded-lg bg-[#E98828] text-xs font-semibold text-white hover:bg-[#E98828]/80 transition-all mt-4">
            {generating ? "Mapping DAG..." : "Generate Architecture Map"}
          </button>
        </div>

        {/* Blueprint Visualization */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#04060b] p-6 min-h-[400px] flex flex-col justify-center">
          {blueprint ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-[#E98828] uppercase">DAG Map Compiled</span>
                <span className="text-[10px] text-white/40">SLA: {blueprint.latency}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <p className="text-white/40">Readiness Score</p>
                  <p className="text-lg font-bold text-white mt-1">{blueprint.readiness}</p>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <p className="text-white/40">Runtime Environment</p>
                  <p className="text-lg font-bold text-white mt-1 uppercase">{blueprint.sec}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase">Topological Nodes</p>
                {blueprint.nodes.map((node: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-black/40 text-xs">
                    <span className="text-white font-semibold">{node.name}</span>
                    <span className="text-white/40">{node.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/40">
              <span className="text-4xl block mb-3">🛠️</span>
              <p className="text-xs">Configure your variables on the left and click &quot;Generate&quot; to build topology maps.</p>
            </div>
          )}
        </div>
      </div>
    </InnerPageShell>
  );
}
