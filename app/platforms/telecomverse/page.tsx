"use client";

import { useState } from "react";
import { 
  Activity, 
  Zap, 
  Radio, 
  Shield, 
  Lock, 
  Wifi, 
  WifiOff, 
  Database, 
  Cpu, 
  Gauge, 
  Server, 
  Layers 
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
    title: "Carrier Ingestion Core", 
    tag: "Ingest Gateway", 
    desc: "Aggregates raw telecom signal logs, optical power levels, and microwave loading metrics in real time.", 
    metric: "Carrier-Grade Uptime" 
  },
  { 
    title: "Network Telemetry Parser", 
    tag: "SCADA Core", 
    desc: "Parses up to 1.2M logs/sec from distributed cell antennas and transport lines under 10ms overhead.", 
    metric: "1.2M logs/sec" 
  },
  { 
    title: "Field Dispatch Coordinator", 
    tag: "Workflows", 
    desc: "Automates field engineer ticket dispatches and routes service teams based on cell degradation trends.", 
    metric: "Optimal Routing" 
  },
  {
    title: "Sovereign Network Sandbox",
    tag: "Security Gateway",
    desc: "Decouples sensitive network telemetry routing from live consumer traffic using cryptographic airgaps.",
    metric: "Zero-Trust Mesh"
  }
];

const ARCH_NODES = [
  {
    id: "alpha",
    name: "Sector 4 Cellular Tower (Node Alpha)",
    status: "Active - Peak Load",
    type: "Cell Tower Endpoints",
    backhaul: "Fiber transport loop",
    agent: "Adaptive Traffic Coordinator",
    telemetry: "Loading: 84% | Antennas: 4 Active | Temp: 42°C",
    loadStatus: "Warning: Fiber congestion detected."
  },
  {
    id: "beta",
    name: "Microwave Base Station (Node Beta)",
    status: "Active - Idle Buffer",
    type: "Microwave Relay Mesh",
    backhaul: "High-Freq UHF Radio Line",
    agent: "Resilience Routing Broker",
    telemetry: "UHF Link: 99.9% margin | Latency: 4.2ms | Power: 24W",
    loadStatus: "Ready: Standing by to route overflow packets."
  },
  {
    id: "gamma",
    name: "Optical Central Exchange (Node Gamma)",
    status: "Active - Balanced",
    type: "Optical Ring Core",
    backhaul: "Sovereign DWDM Backbone",
    agent: "Ingest Load Scheduler",
    telemetry: "Core Bandwidth: 100Gbps | Ingest Ratio: 1.2M logs/sec",
    loadStatus: "Normal: Sync paths operating optimally."
  }
];

export default function TelecomVersePlatformPage() {
  const [selectedArchNode, setSelectedArchNode] = useState("alpha");
  const [fiberCutSimulated, setFiberCutSimulated] = useState(false);
  const [trafficMode, setTrafficMode] = useState<"normal" | "peak">("normal");
  const [logConsole, setLogConsole] = useState<string[]>([
    "Initialize TelecomVerse carrier-grade gateway...",
    "Telemetry: Monitoring 1.2M logs/sec under 10ms overhead.",
    "Status: Sovereign network corridors operating normally.",
  ]);
  const [dispatchActive, setDispatchActive] = useState(false);

  const activeNodeInfo = ARCH_NODES.find(n => n.id === selectedArchNode) || ARCH_NODES[0];

  const triggerIngestSim = () => {
    const timestamp = new Date().toLocaleTimeString();
    const rate = trafficMode === "peak" ? "1.85M logs/sec" : "1.20M logs/sec";
    setLogConsole(prev => [
      `[${timestamp}] 📡 Ingesting live carrier telemetry streams...`,
      `[${timestamp}] 📊 Log Parser Speed: ${rate} // Active Antennas: 3,400`,
      `[${timestamp}] 🛡️ Encryption verification: DWDM Ring sealed securely with sovereign TLS keys.`,
      ...prev.slice(0, 5)
    ]);
  };

  const triggerDispatchSim = () => {
    setDispatchActive(true);
    const timestamp = new Date().toLocaleTimeString();
    const ticketId = `TK-TEL-${Math.floor(1000 + Math.random() * 9000)}`;
    setLogConsole(prev => [
      `[${timestamp}] ⚠️ SYSTEM DEGRADATION DETECTED on Sector 4 Fiber Loop.`,
      `[${timestamp}] 🤖 Triggering GFF automated dispatch agent...`,
      `[${timestamp}] 📋 Field Service Ticket generated successfully. ID: ${ticketId}`,
      `[${timestamp}] 🚚 Dispatch queue updated: Engineering crew dispatched to Sector 4.`,
      ...prev.slice(0, 5)
    ]);
    setTimeout(() => setDispatchActive(false), 800);
  };

  const toggleFiberCut = () => {
    const nextState = !fiberCutSimulated;
    setFiberCutSimulated(nextState);
    const timestamp = new Date().toLocaleTimeString();
    if (nextState) {
      setLogConsole(prev => [
        `[${timestamp}] 🛑 WARNING: SIMULATED FIBER LOOP CUT ON SECTOR 4!`,
        `[${timestamp}] 🤖 Resilience Routing Agent triggered in 12 microseconds.`,
        `[${timestamp}] 📡 REROUTING PACKETS: Traffic successfully redirected via UHF Microwave Base Station (Node Beta).`,
        `[${timestamp}] ✅ Carrier Uptime preserved: 0 packet drops registered.`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setLogConsole(prev => [
        `[${timestamp}] 🔧 Sector 4 Fiber Loop restored.`,
        `[${timestamp}] 🤖 Rerouting back to optical DWDM ring. UHF link returned to standby mode.`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  return (
    <InnerPageShell>
      {/* SECTION 1: HERO */}
      <InnerPageHero
        category="Sovereign Network Mesh • Carrier Layer"
        title="TelecomVerse Core"
        highlightedWord="TelecomVerse"
        description="A high-throughput, carrier-grade network orchestration mesh enabling telecom providers to optimize network workloads, dynamically route microwave traffic, and secure private cell corridors."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "TelecomVerse" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* SECTION 2: STATEMENT */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 bg-white/[0.01] px-8 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E4000F]/5 via-transparent to-[#009DFF]/5 pointer-events-none" />
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">Carrier Orchestration</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2 leading-tight">High-Throughput Resiliency</h2>
          </div>
          <div className="lg:col-span-7 flex items-center">
            <p className="text-white/70 font-light text-base leading-relaxed">
              Managing millions of concurrent optical routing pipelines requires sub-microsecond failovers. TelecomVerse operates as a sovereign network orchestration mesh, continuously parsing fiber degradation patterns, automating field service ticketing, and executing immediate traffic rerouting across LEO satellite and microwave corridors during physical link drops.
            </p>
          </div>
        </MotionReveal>

        {/* SECTION 3: TOPOLOGY */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">Optical Backhaul Grid</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Carrier Telemetry Topology</h2>
            <p className="text-white/50 text-sm font-light">
              Select elements inside the optical network diagram below to inspect cellular sector nodes, microwave meshes, and central optical exchanges.
            </p>
          </div>

          <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive Topological Diagram */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-6 rounded-xl border border-white/5 relative min-h-[350px]">
                <span className="absolute top-3 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">TelecomVerse Optical Grid</span>
                
                <svg className="w-full max-w-[480px] h-[300px]" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection paths */}
                  {/* Primary Fiber Loop - cuts or glows */}
                  <path 
                    d="M100 160 L400 160" 
                    stroke={fiberCutSimulated ? "#E4000F" : "#009DFF"} 
                    strokeWidth="2" 
                    strokeDasharray={fiberCutSimulated ? "5 5" : "none"} 
                    className="transition-all duration-500" 
                  />
                  
                  {/* Backup UHF Microwave Link */}
                  <path 
                    d="M100 160 L250 80 L400 160" 
                    stroke={fiberCutSimulated ? "#22C55E" : "rgba(255,255,255,0.08)"} 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                    className="transition-all duration-500" 
                  />

                  {/* Node 1: Sector 4 Cell Tower */}
                  <g 
                    onClick={() => setSelectedArchNode("alpha")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("alpha");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "alpha"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="100" cy="160" r="30" fill={selectedArchNode === "alpha" ? "#009DFF" : "#0A0A0C"} stroke={selectedArchNode === "alpha" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <path d="M100 145 L100 175 M90 155 L110 155 M95 165 L105 165" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <text x="100" y="210" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">SECTOR 4 TOWER</text>
                  </g>

                  {/* Node 2: UHF Microwave base */}
                  <g 
                    onClick={() => setSelectedArchNode("beta")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("beta");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "beta"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="250" cy="80" r="30" fill={selectedArchNode === "beta" ? "#22C55E" : "#0A0A0C"} stroke={selectedArchNode === "beta" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <path d="M242 72 Q250 64 258 72 M245 80 Q250 74 255 80 M248 88 L252 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <text x="250" y="130" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">UHF MICROWAVE</text>
                  </g>

                  {/* Node 3: Optical exchange */}
                  <g 
                    onClick={() => setSelectedArchNode("gamma")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("gamma");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "gamma"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="400" cy="160" r="30" fill={selectedArchNode === "gamma" ? "url(#brandG)" : "#0A0A0C"} stroke={selectedArchNode === "gamma" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <rect x="385" y="150" width="30" height="20" rx="4" fill="none" stroke="white" strokeWidth="1.5" />
                    <circle cx="392" cy="160" r="1.5" fill="white" />
                    <circle cx="400" cy="160" r="1.5" fill="white" />
                    <circle cx="408" cy="160" r="1.5" fill="white" />
                    <text x="400" y="210" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">OPTICAL CORE</text>
                  </g>

                  <defs>
                    <linearGradient id="brandG" x1="370" y1="130" x2="430" y2="190" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#E4000F" />
                      <stop offset="1" stopColor="#009DFF" />
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
                      <span className={`w-1.5 h-1.5 rounded-full ${activeNodeInfo.status.includes("Peak") ? "bg-amber-400" : "bg-emerald-400"}`} />
                      <span className="text-xs font-mono text-white/50">{activeNodeInfo.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">BACKHAUL GRID INTERFACE</span>
                      <span className="text-white font-medium">{activeNodeInfo.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">LINK MEDIUM</span>
                      <span className="text-white font-medium">{activeNodeInfo.backhaul}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">SOVEREIGN AGENT</span>
                      <span className="text-white font-mono text-[#009DFF]">{activeNodeInfo.agent}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">Live Node Metrics</span>
                    <p className="text-xs font-mono text-emerald-400">{activeNodeInfo.telemetry}</p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">Active Load Actions</span>
                    <p className="text-xs font-mono text-white/80">{activeNodeInfo.loadStatus}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5">
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Engineered Layer Stack</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {["UHF Microwave", "DWDM Ring", "eBPF Kernel", "TLS 1.3 Corridors"].map((tech) => (
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
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-wider font-semibold">Resiliency Console</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Carrier Load & Resiliency Simulator</h2>
            <p className="text-white/50 text-sm font-light">
              Toggle the Sector 4 fiber line cut to watch traffic immediately transition to microwave backhaul streams in real-time.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#04060b] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            {/* Interactive Selector Left Column */}
            <div className="flex-grow p-6 lg:p-8 bg-black/40 border-r border-white/5 flex flex-col justify-between relative min-h-[320px]">
              <span className="absolute top-4 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">CARRIER CONTROLS</span>
              
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase block">Step 1: Set Link Backhaul Status</label>
                  <button 
                    onClick={toggleFiberCut}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all font-mono font-semibold ${
                      fiberCutSimulated 
                        ? "border-[#E4000F]/30 bg-[#E4000F]/5 text-[#E4000F] hover:bg-[#E4000F]/10" 
                        : "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    {fiberCutSimulated ? <WifiOff className="w-4 h-4 text-[#E4000F] animate-pulse" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
                    LINK: {fiberCutSimulated ? "DEGRADED (FIBER LOOP CUT)" : "NORMAL (OPTICAL SEALED)"}
                  </button>
                  <span className="text-[10px] text-white/30 font-light block">
                    {fiberCutSimulated 
                      ? "Sector 4 fiber loop has experienced a physical shear. UHF microwave link routing has engaged."
                      : "Primary DWDM optical ring is running optimally. UHF microwave link is on standby." 
                    }
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-white/40 uppercase block">Step 2: Trigger Operations on {activeNodeInfo.name}</label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={triggerIngestSim}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white flex items-center gap-2 transition-all"
                    >
                      <Gauge className="w-3.5 h-3.5 text-[#009DFF]" />
                      Ingest Telemetry Log
                    </button>
                    <button
                      onClick={triggerDispatchSim}
                      disabled={dispatchActive}
                      className="px-4 py-2 bg-[#E4000F]/10 hover:bg-[#E4000F]/20 border border-[#E4000F]/20 rounded-lg text-xs font-medium text-white flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#E4000F]" />
                      Automate Field Dispatch
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
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Carrier Operations Ledger</span>
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

                <div className="pt-4 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                    <span>MICROWAVE BACKUP LOAD</span>
                    <span className="text-white font-bold">{fiberCutSimulated ? "84% (ACTIVE)" : "0% (STANDBY)"}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${fiberCutSimulated ? "bg-[#E4000F]" : "bg-emerald-500"}`} 
                      style={{ width: fiberCutSimulated ? "84%" : "0%" }} 
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
            <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">Resilient Grid</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">Carrier Resiliency Benchmarks</h2>
          </div>

          <BentoGrid className="max-w-5xl mx-auto">
            <BentoCard 
              title="Sovereign Corridors" 
              description="Isolates core carrier data routing from live public tunnels, preventing cross-leakage of network configurations." 
              badge="Security" 
              icon={<Shield className="w-5 h-5 text-[#E4000F]" />} 
            />
            <BentoCard 
              title="12µs Dynamic Rerouting" 
              description="Intelligent agentic routing triggers microwave path shifts in under 12 microseconds during core fiber failure." 
              badge="Reliability" 
              icon={<Zap className="w-5 h-5 text-amber-400" />} 
            />
            <BentoCard 
              title="1.2M logs/sec Parser" 
              description="Ingestion layer processes high-frequency telemetry logs continuously with sub-10ms processing latency." 
              badge="Throughput" 
              icon={<Activity className="w-5 h-5 text-[#009DFF]" />} 
            />
          </BentoGrid>
        </MotionReveal>

        {/* SECTION 7: RELATED */}
        <RelatedPagesGrid links={[
          { title: "Telecom Solutions", tag: "Industry Core", desc: "Discover how GFF's carrier-grade architectures optimize network loads.", href: "/industries/telecom" },
          { title: "Control Center", tag: "Cockpit Console", desc: "Monitor edge swarm health, compute spend, and rule audit logs.", href: "/platforms/control-center" }
        ]} />

        {/* SECTION 8: CTA */}
        <PremiumCTA
          title="Scale Carrier Network Operations Securely"
          description="Schedule a technical workspace review with our telecom systems engineers to secure telemetry streams and deploy sovereign airgaps."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}