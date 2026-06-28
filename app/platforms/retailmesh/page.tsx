"use client";

import { useState } from "react";
import { 
  Activity, 
  Zap, 
  ShoppingBag, 
  Shield, 
  Lock, 
  CheckCircle, 
  EyeOff, 
  Eye, 
  Layers, 
  Cpu, 
  Coins,
  Gauge,
  Database
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
    title: "POS Ingestion Gateway", 
    tag: "POS Core", 
    desc: "Ingests raw, high-frequency transaction logs, loyalty checkouts, and refund sequences securely.", 
    metric: "PCI-DSS Cryptography" 
  },
  { 
    title: "Predictive Stock Router", 
    tag: "Inventory Forecasts", 
    desc: "Monitors local inventory thresholds and coordinates predictive reorders with central supply warehouses.", 
    metric: "Real-time Sync" 
  },
  { 
    title: "Associate Support Engine", 
    tag: "Local Support Hub", 
    desc: "Provides in-store managers with sub-second, offline-first access to corporate return and service guidelines.", 
    metric: "Local Vector Search" 
  },
  {
    title: "Dynamic Loyalty Connector",
    tag: "CRM Engagement",
    desc: "Coordinates checkouts with active buyer profiles to apply personalized discounts and target trends.",
    metric: "Anonymized Matching"
  }
];

const ARCH_NODES = [
  {
    id: "registers",
    name: "POS Registers & Terminals",
    status: "Active - Endpoints secured",
    location: "In-Store Floor",
    connectivity: "WPA3 Private LAN",
    agent: "Local Checkout Integrity Agent",
    telemetry: "Ingest: 4.8 tx/sec | Active Terminals: 12",
    compliance: "PCI-DSS v4.0 Scanned & Masked Locally"
  },
  {
    id: "storeserver",
    name: "In-Store Edge Gateway Server",
    status: "Active - Buffering active",
    location: "Back-Office Rack",
    connectivity: "Dual-WAN (Fiber + 5G Backup)",
    agent: "Local Store Sync Coordinator",
    telemetry: "DB Size: 240MB | Buffered Updates: 0",
    compliance: "Sovereign local sandbox boundary enforced"
  },
  {
    id: "cloud",
    name: "Corporate Agentic Cluster",
    status: "Active - Synced",
    location: "Sovereign Cloud Zone",
    connectivity: "TLS 1.3 SD-WAN",
    agent: "Global Demand Planner & Router",
    telemetry: "Central Queue: 0ms lag | Multi-Store Sync: 100%",
    compliance: "Anonymized analytics pipeline active"
  }
];

export default function RetailMeshPlatformPage() {
  const [selectedArchNode, setSelectedArchNode] = useState("registers");
  const [piiMaskingEnabled, setPiiMaskingEnabled] = useState(true);
  const [transactionAmount, setTransactionAmount] = useState("124.50");
  const [customerName, setCustomerName] = useState("Charlotte Dubois");
  const [cardNumber, setCardNumber] = useState("4111-2222-3333-4444");
  const [logConsole, setLogConsole] = useState<string[]>([
    "Initialize RetailMesh point-of-sale network gateway...",
    "Self-test: Local PII Obfuscation Filter [PASS]",
    "Zero-Trust Handshake with Store Edge Server [SECURED]",
  ]);
  const [processingState, setProcessingState] = useState(false);

  const activeNodeInfo = ARCH_NODES.find(n => n.id === selectedArchNode) || ARCH_NODES[0];

  const triggerSimulation = () => {
    setProcessingState(true);
    const timestamp = new Date().toLocaleTimeString();
    
    const maskedName = piiMaskingEnabled ? "C********* D******" : customerName;
    const maskedCard = piiMaskingEnabled ? "****-****-****-4444" : cardNumber;
    
    setLogConsole(prev => [
      `[${timestamp}] 💳 Processing transaction for amount ${transactionAmount}...`,
      `[${timestamp}] 🔒 PII Filter State: [${piiMaskingEnabled ? "ENFORCED" : "BYPASSED - WARNING"}]`,
      `[${timestamp}] 👤 Customer Identity: ${maskedName}`,
      `[${timestamp}] 💳 Account Token: ${maskedCard}`,
      `[${timestamp}] ✅ Transaction processed & signed locally with HSM keys. Syncing to corporate cluster.`,
      ...prev.slice(0, 5)
    ]);
    
    setTimeout(() => {
      setProcessingState(false);
    }, 800);
  };

  return (
    <InnerPageShell>
      {/* SECTION 1: HERO */}
      <InnerPageHero
        category="Omnichannel Mesh • Secure Visibility"
        title="RetailMesh Platform"
        highlightedWord="RetailMesh"
        description="A secure retail mesh unifying point-of-sale telemetry, inventory visibility, and real-time associate support across thousands of physical storefronts and digital hubs."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "RetailMesh" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* SECTION 2: STATEMENT */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 bg-white/[0.01] px-8 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E4000F]/5 via-transparent to-[#009DFF]/5 pointer-events-none" />
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">Omnichannel Excellence</span> */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2 leading-tight">Decoupled Retail Visibility</h2>
          </div>
          <div className="lg:col-span-7 flex items-center">
            <p className="text-white/70 font-light text-base leading-relaxed">
              Unifying physical storefront registers with central inventory forecasting is a latency and privacy challenge. RetailMesh solves this by operating local cryptographic edge sandboxes directly inside storefront servers. POS checkouts, inventory stock drops, and associate policy queries are completed locally, and only masked, compliance-validated metadata is synchronized with central retail clusters.
            </p>
          </div>
        </MotionReveal>

        {/* SECTION 3: TOPOLOGY */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            {/* <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">Distributed Architecture</span> */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Storefront-to-Cloud Topology</h2>
            <p className="text-white/50 text-sm font-light">
              Select elements inside the distributed transactional diagram below to inspect point-of-sale endpoints, back-office edge servers, and cloud routing clusters.
            </p>
          </div>

          <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive Topological Diagram */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-6 rounded-xl border border-white/5 relative min-h-[350px]">
                <span className="absolute top-3 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">RetailMesh Network Architecture</span>
                
                <svg className="w-full max-w-[480px] h-[300px]" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Glowing Connection lines */}
                  <path d="M100 160 L250 160" stroke="#009DFF" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M250 160 L400 160" stroke={selectedArchNode === "cloud" ? "#E4000F" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" strokeDasharray="5 5" className="transition-all duration-500" />

                  {/* Node 1: Registers */}
                  <g 
                    onClick={() => setSelectedArchNode("registers")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("registers");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "registers"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="100" cy="160" r="30" fill={selectedArchNode === "registers" ? "#009DFF" : "#0A0A0C"} stroke={selectedArchNode === "registers" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <rect x="85" y="150" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="1.5" />
                    <line x1="85" y1="170" x2="115" y2="170" stroke="white" strokeWidth="1.5" />
                    <text x="100" y="210" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">POS REGISTERS</text>
                  </g>

                  {/* Node 2: Local Store Server */}
                  <g 
                    onClick={() => setSelectedArchNode("storeserver")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("storeserver");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "storeserver"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="250" cy="160" r="30" fill={selectedArchNode === "storeserver" ? "url(#brandG)" : "#0A0A0C"} stroke={selectedArchNode === "storeserver" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <rect x="238" y="145" width="24" height="30" rx="4" fill="none" stroke="white" strokeWidth="1.5" />
                    <line x1="238" y1="155" x2="262" y2="155" stroke="white" strokeWidth="1" />
                    <line x1="238" y1="165" x2="262" y2="165" stroke="white" strokeWidth="1" />
                    <circle cx="250" cy="150" r="1.5" fill="white" />
                    <circle cx="250" cy="160" r="1.5" fill="white" />
                    <circle cx="250" cy="170" r="1.5" fill="white" />
                    <text x="250" y="210" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">STORE EDGE SERVER</text>
                  </g>

                  {/* Node 3: Cloud Agentic Cluster */}
                  <g 
                    onClick={() => setSelectedArchNode("cloud")} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedArchNode("cloud");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedArchNode === "cloud"}
                    className="cursor-pointer group focus:outline-none"
                  >
                    <circle cx="400" cy="160" r="30" fill={selectedArchNode === "cloud" ? "#E4000F" : "#0A0A0C"} stroke={selectedArchNode === "cloud" ? "white" : "rgba(255,255,255,0.15)"} strokeWidth="2" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[3px]" />
                    <path d="M388 152 A6 6 0 0 1 400 148 A8 8 0 0 1 412 152 A6 6 0 0 1 408 164 L392 164 A6 6 0 0 1 388 152 Z" fill="none" stroke="white" strokeWidth="1.5" />
                    <text x="400" y="210" fill="white" fontSize="10" fontWeight="600" textAnchor="middle" className="tracking-wider">SOVEREIGN CLOUD</text>
                  </g>

                  <defs>
                    <linearGradient id="brandG" x1="220" y1="130" x2="280" y2="190" gradientUnits="userSpaceOnUse">
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
                      <span className={`w-1.5 h-1.5 rounded-full ${activeNodeInfo.status.includes("secured") ? "bg-emerald-400" : "bg-[#009DFF]"}`} />
                      <span className="text-xs font-mono text-white/50">{activeNodeInfo.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">LOCATION BOUNDARY</span>
                      <span className="text-white font-medium">{activeNodeInfo.location}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">BACKHAUL TELEMETRY</span>
                      <span className="text-white font-medium">{activeNodeInfo.connectivity}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-mono">DEDICATED LOCAL AGENT</span>
                      <span className="text-white font-mono text-[#009DFF]">{activeNodeInfo.agent}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">Real-time Stream Metrics</span>
                    <p className="text-xs font-mono text-emerald-400">{activeNodeInfo.telemetry}</p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/30 tracking-wider block">Security Compliance Audit Standard</span>
                    <p className="text-xs font-mono text-white/80">{activeNodeInfo.compliance}</p>
                  </div>
                </div>

                {/* <div className="mt-6 pt-3 border-t border-white/5">
                  <span className="text-[9px] uppercase text-white/30 tracking-wider">Engineered Layer Stack</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {["PCI-DSS Masking", "Local SQLite", "TLS 1.3 SD-WAN", "eBPF Auditor"].map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* SECTION 4: SIMULATOR */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-wider font-semibold">Zero-Trust Sandbox</span> */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white">PII Masking & Sync Simulator</h2>
            <p className="text-white/50 text-sm font-light">
              Toggle GFF's local PII masking shield below, then process a test transaction to watch identifiers anonymized instantly on the edge before syncing.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#04060b] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            {/* Interactive Selector Left Column */}
            <div className="flex-grow p-6 lg:p-8 bg-black/40 border-r border-white/5 flex flex-col justify-between relative min-h-[340px]">
              <span className="absolute top-4 left-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">POS TERMINAL CONSOLE</span>
              
              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/40 uppercase block">Customer Name</label>
                    <input 
                      type="text" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-[#009DFF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/40 uppercase block">TX Amount ($)</label>
                    <input 
                      type="text" 
                      value={transactionAmount} 
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-[#009DFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/40 uppercase block">Card Account Number</label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-[#009DFF]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] mt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-medium text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#009DFF]" />
                      PII MASKING SHIELD
                    </span>
                    <span className="text-[9px] text-white/40">Encrypt names and account cards on the store edge server.</span>
                  </div>
                  <button 
                    onClick={() => setPiiMaskingEnabled(!piiMaskingEnabled)}
                    className={`w-10 h-6 rounded-full p-0.5 relative transition-colors ${piiMaskingEnabled ? "bg-[#009DFF]" : "bg-white/10"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${piiMaskingEnabled ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                <button
                  onClick={triggerSimulation}
                  disabled={processingState}
                  className="px-5 py-2 bg-[#009DFF]/10 hover:bg-[#009DFF]/20 border border-[#009DFF]/20 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  <Lock className="w-3.5 h-3.5 text-[#009DFF]" />
                  Process Transaction
                </button>
                <span className="text-[10px] font-mono text-white/30">Target Node: POS</span>
              </div>
            </div>
            {/* Simulated Live Terminal Right Column */}
            <div className="w-full md:w-[360px] p-6 flex flex-col justify-between bg-black/20 text-xs border-t md:border-t-0 md:border-l border-white/5">
              <div className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Edge Cryptography Ledger</span>
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
                    <span>SECURITY MASK RATIO</span>
                    <span className="text-white font-bold">{piiMaskingEnabled ? "100% Encrypted" : "0% (INSECURE)"}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${piiMaskingEnabled ? "bg-emerald-500" : "bg-[#E4000F]"}`} 
                      style={{ width: piiMaskingEnabled ? "100%" : "0%" }} 
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
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-wider font-semibold">Engineered Systems</span> */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">Platform Modules</h2>
          </div>
          <Carousel items={MODULES} />
        </div>

        {/* SECTION 6: BENTO */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            {/* <span className="text-xs font-mono text-[#E4000F] uppercase tracking-wider font-semibold">Reliable Storefronts</span> */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">High Availability Benchmarks</h2>
          </div>

          <BentoGrid className="max-w-5xl mx-auto">
            <BentoCard 
              title="PCI-DSS v4.0 Compliant" 
              description="Automatic, hardware-level masking of user phone records, card data, and loyalty profiles before syncing." 
              badge="Compliance" 
              icon={<Shield className="w-5 h-5 text-[#E4000F]" />} 
            />
            <BentoCard 
              title="99.99% Storefront Uptime" 
              description="Hybrid SQLite state storage ensures continuous associate checkout and support during connection failures." 
              badge="Uptime" 
              icon={<Zap className="w-5 h-5 text-amber-400" />} 
            />
            <BentoCard 
              title="Sub-second Inventory Search" 
              description="Real-time multi-agent vector search returns nearby inventory availability in under 20ms." 
              badge="Latency" 
              icon={<Activity className="w-5 h-5 text-[#009DFF]" />} 
            />
          </BentoGrid>
        </MotionReveal>

        {/* SECTION 7: RELATED */}
        <RelatedPagesGrid links={[
          { title: "Retail Solutions", tag: "Industry Core", desc: "Discover how GFF's multi-agent architectures optimize retail chains.", href: "/industries/retail" },
          { title: "Control Center", tag: "Cockpit Console", desc: "Monitor edge swarm health, compute spend, and rule audit logs.", href: "/platforms/control-center" }
        ]} />

        {/* SECTION 8: CTA */}
        <PremiumCTA
          title="Optimize Your Multi-Store Enterprise Flow"
          description="Schedule a technical workspace audit with GFF retail systems leads to connect your registers and inventory secure."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}