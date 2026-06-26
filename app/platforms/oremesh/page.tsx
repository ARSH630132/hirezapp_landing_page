"use client";

import { useState } from "react";
import { 
  Activity, 
  Zap, 
  Compass, 
  Shield, 
  Wifi, 
  WifiOff, 
  Radio, 
  FileCheck, 
  Layers, 
  Cpu, 
  Gauge, 
  Lock 
} from "lucide-react";
import { 
  InnerPageShell, 
  InnerPageHero, 
  MotionReveal, 
  BentoGrid, 
  BentoCard, 
  Carousel, 
  RelatedPagesGrid, 
  PremiumCTA 
} from "@/components/inner-pages";

const MODULES = [
  { 
    title: "Field Ingest Gateway", 
    tag: "Edge Ingest", 
    desc: "Collects high-frequency sensor streams directly from raw extraction faces and pneumatic drills.", 
    metric: "Offline-First Buffer" 
  },
  { 
    title: "Differential Sync Router", 
    tag: "Bandwidth Compression", 
    desc: "Compresses and prioritizes SCADA state syncs over low-capacity, intermittent satellite links.", 
    metric: "99% Ratio" 
  },
  { 
    title: "Sovereign Dispatch Hub", 
    tag: "Local Compliance", 
    desc: "Cryptographically verifies machinery dispatch coordinates locally before physical actuation.", 
    metric: "Immutable Keys" 
  },
  {
    title: "Adaptive Safety Coordinator",
    tag: "Atmospheric Monitoring",
    desc: "Triggers immediate fan acceleration and heavy-fleet throttle-back when gas thresholds are exceeded.",
    metric: "12ms Autonomy"
  }
];

const ARCH_NODES = [
  {
    id: "shaft",
    name: "Subterranean Shaft Node 4",
    status: "Active - Isolated",
    depth: "1,200m Deep Face",
    connectivity: "Local Fiber Ring",
    agent: "Atmospheric Safety Monitor",
    telemetry: "CH4: 0.2% | CO: 4ppm | Temp: 28°C",
    scada: "Ventilation Fan #4: 100% capacity"
  },
  {
    id: "fleet",
    name: "Heavy Fleet Router (Truck #9)",
    status: "Active - Mobile",
    depth: "Surface Transport",
    connectivity: "900MHz UHF Mesh",
    agent: "Machine Telematics Predictor",
    telemetry: "Vibration: 4.2mm/s | Oil Temp: 92°C | Hydr. Press: 185 bar",
    scada: "Throttle Limit: 85% (Braking thermal curve)"
  },
  {
    id: "satellite",
    name: "Sovereign Satellite Uplink Gateway",
    status: "Intermittent Sync",
    depth: "Surface Base",
    connectivity: "LEO Satellite (High Orbit)",
    agent: "Sync Orchestrator",
    telemetry: "Bandwidth: 128 kbps | Latency: 640ms | Queue: 12,400 pkts",
    scada: "Batch Sync pending next orbit window"
  }
];

export default function OREMeshPlatformPage() {
  const [selectedArchNode, setSelectedArchNode] = useState("shaft");
  const [satelliteOnline, setSatelliteOnline] = useState(false);
  const [logConsole, setLogConsole] = useState<string[]>([
    "Initialize OREMesh local node execution...",
    "Self-test: Sovereign Crypto Engine (AES-256) [PASS]",
    "Satellite Link: [OFFLINE] - Queueing differential telemetry batches.",
  ]);
  const [simulationActive, setSimulationActive] = useState(false);

  const activeNodeInfo = ARCH_NODES.find(n => n.id === selectedArchNode) || ARCH_NODES[0];

  const triggerSimulation = (simType: "telemetry" | "safety") => {
    setSimulationActive(true);
    const timestamp = new Date().toLocaleTimeString();
    
    if (simType === "telemetry") {
      setLogConsole(prev => [
        `[${timestamp}] 📡 Ingesting high-frequency telemetry from ${activeNodeInfo.name}...`,
        `[${timestamp}] 🔒 Local cryptographic digest signed: MD5-SHA256-${Math.random().toString(16).substring(2, 8)}`,
        `[${timestamp}] 📦 Compressed differential packet size: 1.4 KB (99.1% bandwidth reduction ratio)`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setLogConsole(prev => [
        `[${timestamp}] ⚠️ EMERGENCY SAFETY THRESHOLD EVALUATION REACHED.`,
        `[${timestamp}] 🤖 Sovereign Agent locally dispatched. Verdict: Vent fan speed adjusted.`,
        `[${timestamp}] ⚡ Edge Autonomy Latency: 12.4 milliseconds. No satellite roundtrip required.`,
        `[${timestamp}] ✅ Safe operating threshold re-established. Sync batch appended to persistent memory.`,
        ...prev.slice(0, 5)
      ]);
    }
    
    setTimeout(() => {
      setSimulationActive(false);
    }, 800);
  };

  const toggleSatellite = () => {
    const nextState = !satelliteOnline;
    setSatelliteOnline(nextState);
    const timestamp = new Date().toLocaleTimeString();
    if (nextState) {
      setLogConsole(prev => [
        `[${timestamp}] 📡 Satellite Link: [CONNECTED]`,
        `[${timestamp}] 🚀 Syncing persistent differential ledger to high-level cloud foundry...`,
        `[${timestamp}] ✅ 12,400 state updates synchronized successfully. Queue cleared.`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setLogConsole(prev => [
        `[${timestamp}] 📡 Satellite Link: [OFFLINE] (Expected Orbit Degrade)`,
        `[${timestamp}] 💾 Diverting outgoing payloads to persistent storage buffers. Zero-loss mode active.`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  return (
    <InnerPageShell>
      {/* SECTION 1: HERO */}
      <InnerPageHero
        category="Industrial Mesh • Edge Autonomy"
        title="OREMesh Edge Platform"
        highlightedWord="OREMesh"
        description="A ruggedized, sovereign edge mesh coordinating multi-agent operations, fleet telemetry, and real-time safety compliance across remote, offline-first mining operations and extraction faces."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "OREMesh" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* SECTION 2: STATEMENT */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 bg-white/[0.01] px-8 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E4000F]/5 via-transparent to-[#009DFF]/5 pointer-events-none" />
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">Resilient Engineering</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2 leading-tight">Ruggedized Edge Autonomy</h2>
          </div>
          <div className="lg:col-span-7 flex items-center">
            <p className="text-white/70 font-light text-base leading-relaxed">
              Subterranean and extreme industrial sites cannot depend on high-bandwidth, continuous cloud connectivity. OREMesh functions as a completely decentralized edge-native mesh. It aggregates SCADA sensor telemetry, executes local agent compliance loops under 15 milliseconds, and queues ledger-backed differential updates to sync only when uplink channels become available.
            </p>
          </div>
        </MotionReveal>

        {/* SECTION 3: TOPOLOGY */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">System Blueprint</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Subterranean Node Architecture</h2>
            <p className="text-white/50 text-sm font-light">
              Click elements inside the industrial topological diagram below to inspect specialized hardware interfaces, dedicated telemetry agents, and active offline data buffers.
            </p>
          </div>

          <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive Topological Diagram */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-6 rounded-xl border border-white/5 relative min-h-[350px]">
                <span className="absolute top-3 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">OREMesh Physical-Logical Topology</span>
                
                <svg className="w-full max-w-[480px] h-[300px]" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Sat Uplink Connection */}
                  <path d="M250 180 L250 80" stroke={satelliteOnline ? "#009DFF" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" strokeDasharray="5 5" className="transition-all duration-500" />
                  <path d="M120 220 L250 180" stroke="#E4000F" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M380 220 L250 180" stroke="#009DFF" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Satellite Uplink Point */}
                  <g onClick={() => setSelectedArchNode("satellite")} className="cursor-pointer group">
                    <circle cx="250" cy="60" r="30" fill={selectedArchNode === "satellite" ? "url(#satelliteG)" : "#0A0A0C"} stroke={selectedArchNode === "satellite" ? "#009DFF" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300" />
                    <path d="M242 52 L258 52 M250 44 L250 60 M245 68 L255 68" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <text x="250" y="105" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">LEO GATEWAY</text>
                  </g>

                  {/* Heavy Fleet Node */}
                  <g onClick={() => setSelectedArchNode("fleet")} className="cursor-pointer group">
                    <rect x="70" y="200" width="100" height="50" rx="10" fill={selectedArchNode === "fleet" ? "#E4000F" : "#0A0A0C"} stroke={selectedArchNode === "fleet" ? "white" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" className="transition-all duration-300" />
                    <text x="120" y="225" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" className="tracking-wider">FLEET #9</text>
                    <text x="120" y="238" fill="white" fontSize="7" opacity="0.6" textAnchor="middle">MOBILE MESH</text>
                  </g>

                  {/* Mine Shaft Node */}
                  <g onClick={() => setSelectedArchNode("shaft")} className="cursor-pointer group">
                    <rect x="330" y="200" width="100" height="50" rx="10" fill={selectedArchNode === "shaft" ? "#009DFF" : "#0A0A0C"} stroke={selectedArchNode === "shaft" ? "white" : "rgba(255,255,255,0.1)"} strokeWidth="1.5" className="transition-all duration-300" />
                    <text x="380" y="225" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" className="tracking-wider">SHAFT FACE #4</text>
                    <text x="380" y="238" fill="white" fontSize="7" opacity="0.6" textAnchor="middle">DEEP SENSOR RING</text>
                  </g>

                  <defs>
                    <linearGradient id="satelliteG" x1="220" y1="30" x2="280" y2="90" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#009DFF" />
                      <stop offset="1" stopColor="#0A0A0C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Node Inspector Panel */}
              <div className="lg:col-span-5 flex flex-col border-l border-white/5 lg:pl-6 min-h-[300px] justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/10 rounded-full uppercase tracking-widest">
                      Node Spec Inspector
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-white tracking-tight">{activeNodeInfo.name}</h3>
                    <div className="flex gap-2 mt-1.5 items-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeNodeInfo.status.includes("Isolated") ? "bg-amber-400" : activeNodeInfo.status.includes("Active") ? "bg-emerald-400" : "bg-blue-400"}`} />
                      <span className="text-xs font-mono text-white/50">{activeNodeInfo.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">OPERATIONAL DEPTH</span>
                      <span className="text-white font-medium">{activeNodeInfo.depth}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">LOCAL BACKHAUL</span>
                      <span className="text-white font-medium">{activeNodeInfo.connectivity}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">DEDICATED EDGE AGENT</span>
                      <span className="text-white font-mono text-[#009DFF]">{activeNodeInfo.agent}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">Live Stream Telemetry</span>
                    <p className="text-xs font-mono text-emerald-400">{activeNodeInfo.telemetry}</p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">SCADA Actuator Command Status</span>
                    <p className="text-xs font-mono text-white/80">{activeNodeInfo.scada}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5">
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Engineered Layer Stack</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {["eBPF Ingest", "AES-256 Keys", "gRPC Batch", "SQLite Encrypted"].map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* SECTION 4: SIMULATOR */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-wider font-semibold">Simulated Control Console</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Edge Autonomy & Backhaul Simulator</h2>
            <p className="text-white/50 text-sm font-light">
              Toggle the Satellite Link offline to test how the mesh buffers, cryptographically signs, and runs autonomous local safety decisions.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#04060b] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            {/* Interactive Selector Left Column */}
            <div className="flex-grow p-6 lg:p-8 bg-black/40 border-r border-white/5 flex flex-col justify-between relative min-h-[320px]">
              <span className="absolute top-4 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">OREMesh Sandbox Gateway</span>
              
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase block">Step 1: Set Satellite Connectivity</label>
                  <button 
                    onClick={toggleSatellite}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all font-mono font-semibold ${
                      satelliteOnline 
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10" 
                        : "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    {satelliteOnline ? <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
                    LINK: {satelliteOnline ? "CONNECTED (REAL-TIME)" : "OFFLINE (BATCH QUEUEING)"}
                  </button>
                  <span className="text-[10px] text-white/30 font-light block">
                    {satelliteOnline 
                      ? "Differential queue is syncing instantly to Cloud Foundry. 0ms local storage backup." 
                      : "Sovereign local nodes are queuing transactions with cryptographic persistent signatures locally."
                    }
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-white/40 uppercase block">Step 2: Trigger Site Simulation Event on {activeNodeInfo.name}</label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => triggerSimulation("telemetry")}
                      disabled={simulationActive}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <Gauge className="w-3.5 h-3.5 text-[#009DFF]" />
                      Ingest SCADA Stream
                    </button>
                    <button
                      onClick={() => triggerSimulation("safety")}
                      disabled={simulationActive}
                      className="px-4 py-2 bg-[#E4000F]/10 hover:bg-[#E4000F]/20 border border-[#E4000F]/20 rounded-lg text-xs font-medium text-white flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#E4000F]" />
                      Trigger Threshold Alert
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center text-[10px] font-mono text-white/40">
                <span>Active Target Node: <span className="text-white">{activeNodeInfo.name}</span></span>
                <span className="text-emerald-400 uppercase">SANDBOX STATUS: READY</span>
              </div>
            </div>
            {/* Simulated Live Terminal Right Column */}
            <div className="w-full md:w-[360px] p-6 flex flex-col justify-between bg-black/20 text-xs border-t md:border-t-0 md:border-l border-white/5">
              <div className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Live Audit Ledger</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-[#009DFF]">SECURE-TTY</span>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {logConsole.map((logStr, i) => (
                      <pre key={i} className="text-[10px] font-mono text-emerald-400/90 whitespace-pre-wrap leading-tight border-b border-white/[0.02] pb-1.5 last:border-0">
                        {logStr}
                      </pre>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                    <span>QUEUE BUFFER</span>
                    <span className="text-white font-bold">{satelliteOnline ? "0%" : "2.4% Full (Persisted)"}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${satelliteOnline ? "bg-emerald-500" : "bg-amber-500"}`} 
                      style={{ width: satelliteOnline ? "0%" : "24%" }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* SECTION 5: CAROUSEL */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-wider font-semibold">Engineered Systems</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">Platform Modules</h2>
          </div>
          <Carousel items={MODULES} />
        </div>

        {/* SECTION 6: BENTO */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">Decoupled Resilience</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">Industrial-Grade Boundaries</h2>
          </div>

          <BentoGrid className="max-w-5xl mx-auto">
            <BentoCard 
              title="AES-256 Crypto Seals" 
              description="Each telemetry telemetry stream is hashed and signed on the physical node before satellite replication to secure pipeline integrity." 
              badge="Security" 
              icon={<Lock className="w-5 h-5 text-[#E4000F]" />} 
            />
            <BentoCard 
              title="Differential Syncing" 
              description="Syncing mechanism aggregates local log changes and transmits metadata differences, slashing bandwidth waste by 99%." 
              badge="Bandwidth" 
              icon={<Zap className="w-5 h-5 text-amber-400" />} 
            />
            <BentoCard 
              title="12ms Local Dispatch" 
              description="Immediate automated task scaling when machinery tolerances drift, preserving uptime without cloud dependencies." 
              badge="Latency" 
              icon={<Activity className="w-5 h-5 text-[#009DFF]" />} 
            />
          </BentoGrid>
        </MotionReveal>

        {/* SECTION 7: RELATED */}
        <RelatedPagesGrid links={[
          { title: "Mining Solutions", tag: "Industry Core", desc: "Discover GFF's multi-agent architectures for heavy mining operations.", href: "/industries/mining" },
          { title: "Control Center", tag: "Cockpit Console", desc: "Monitor edge swarm health, compute spend, and rule audit logs.", href: "/platforms/control-center" }
        ]} />

        {/* SECTION 8: CTA */}
        <PremiumCTA
          title="Deploy Ruggedized Agent Intelligence to Your Extraction Sites"
          description="Schedule a technical engineering architectural assessment with our mining systems leads to secure your low-bandwidth remote-site links."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}