"use client";

import React, { useState } from "react";
import { DYNAMODB_SCHEMAS } from "./dynamodb-schemas";
import DynamoDbModelingSection from "./DynamoDbModelingSection";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

// 1. Terminals Tabs Data
const TERMINAL_TABS = {
  cli: {
    label: "GFF CLI Installation",
    title: "Sovereign CLI Toolkit",
    subtitle: "Install and authenticate your local agentic development terminal.",
    code: `# Install secure GFF sovereign agentic workspace toolkit
curl -sS https://get.gff.ai/install.sh | sh

# Authenticate local hardware sandbox
gff auth login --local-sandbox-only

# Verify container runtime integrity
gff verify --integrity`,
    notes: "Requires Unix-like shell environment (macOS/Linux/WSL) with curl."
  },
  sdk: {
    label: "TypeScript SDK Setup",
    title: "Client-Side Orchestrator",
    subtitle: "Initialize isolation loops and dynamic verification guards.",
    code: `import { GffAgentOrchestrator } from "@gff-ai/sdk";

// Initialize isolation loop with local security sandbox
const cluster = await GffAgentOrchestrator.initialize({
  sandboxId: "sg-garage-0x8f",
  memoryIsolation: "aes-256-gcm",
  safetyFallback: "human-in-the-loop"
});

console.log("Integrity: verified ✅");`,
    notes: "Requires Node.js v18.x or later. Compatible with Next.js & React."
  },
  backend: {
    label: "FastAPI MVP Setup",
    title: "Local MVP Backend Gateway",
    subtitle: "Install dependencies, run idempotent seeders, and boot local server.",
    code: `# 1. Automated Virtualenv Setup & Package Installation
npm run backend:install

# 2. Initialize and Seed SQLite Database (dev.db)
npm run backend:seed

# 3. Boot Uvicorn ASGI Server on http://localhost:8000
npm run backend:dev

# 4. Bind Frontend by adding to root .env:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`,
    notes: "Requires Python v3.12+ and SQLite3. Creates local SQLite database file."
  }
};

type TerminalKey = keyof typeof TERMINAL_TABS;

// 2. Pre-Seeded Developer Accounts Data
const DEV_USERS = [
  {
    email: "gff_admin@gff.ai",
    role: "gff_admin",
    tenant: "Platform Global",
    pass: "password123",
    desc: "Oversee enterprise client registries, query system-wide usage logs, review support ticket queues, and verify network telemetry metrics."
  },
  {
    email: "client_admin@apex.com",
    role: "client_admin",
    tenant: "Apex Global",
    pass: "password123",
    desc: "Manage Apex-specific project sandboxes, audit dynamic LLM computational invoices, review secure service agreements, and issue support tickets."
  },
  {
    email: "client_member@apex.com",
    role: "client_member",
    tenant: "Apex Global",
    pass: "password123",
    desc: "Collaborate on multi-agent execution pipelines, raise developer support requests, and inspect real-time tenant compliance standards."
  },
  {
    email: "client@chevron.com",
    role: "client",
    tenant: "Chevron Corp",
    pass: "chevron_secure_pass_2026",
    desc: "Legacy client portal access, tailored specifically to Chevron's private operational pipelines and audit matrices."
  }
];


// 3. Sandbox Boundaries Bento Grid
const BOUNDARIES = [
  {
    title: "Decoupled Local DB",
    badge: "Local MVP Only",
    color: "from-blue-500/10 to-cyan-500/5",
    border: "border-blue-500/20",
    text: "SQLite database storage mapped directly to local 'dev.db' with no cloud database setups required. Fast, direct, and simple.",
    prod: "Amazon DynamoDB Single-Table Design Cluster"
  },
  {
    title: "Standard JWT Sandbox",
    badge: "Local MVP Only",
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
    text: "Standard local bcrypt cryptography and JWT authentication. Token state persists inside standard browser storage.",
    prod: "SSO Providers, Real OTP, Multi-Factor Identity Verification"
  },
  {
    title: "Static Media Mocking",
    badge: "Local MVP Only",
    color: "from-blue-500/10 to-purple-500/5",
    border: "border-blue-500/20",
    text: "Physical document management is handled using premium client-side mocks and simulations. No actual disk upload occurs.",
    prod: "Secure AWS S3 Bucket storage + AES-256 Object Encryption"
  },
  {
    title: "Local API Integrations",
    badge: "Local MVP Only",
    color: "from-blue-500/10 to-pink-500/5",
    border: "border-blue-500/20",
    text: "Interactive sandbox tooling, code generator wizard, and proposal engines execute mock pipelines client-side.",
    prod: "High-Performance AWS Bedrock / Open-Source LLM Execution Hubs"
  }
];

// 4. Interactive Diagram Elements
const DIAGRAM_NODES = {
  frontend: {
    title: "Next.js Frontend Workspace",
    desc: "Premium, Apple-like cockpit displaying multi-tenant dashboards, telemetry widgets, and sandbox configurations.",
    details: "Runs locally on port 3000. Communicates with local API endpoints using NEXT_PUBLIC_API_BASE_URL. Falls back to client-side mocks if the backend is down."
  },
  api: {
    title: "FastAPI Local MVP Engine",
    desc: "Fast, asynchronous Python API routing secure handshakes, role authorizations (RBAC), and multi-tenant ledger synchronization.",
    details: "Runs locally on port 8000. Generates automated interactive API specifications via Swagger UI (/docs) and routes endpoints under /api/v1."
  },
  db: {
    title: "Idempotent SQLite Database",
    desc: "Zero-configuration SQL engine storing relational records inside the 'backend/dev.db' binary payload file.",
    details: "Pre-populated with rich mock datasets including secure documents, project pipelines, compliance logs, and billing invoices via app/seed.py."
  }
};

type DiagramKey = keyof typeof DIAGRAM_NODES;

// 5. Troubleshooting Data
const FAQ_ITEMS = [
  {
    q: "How do I resolve Cross-Origin Resource Sharing (CORS) connection errors?",
    a: "CORS blocks occur when the backend does not authorize requests originating from the frontend domain. Verify your backend/.env contains the exact frontend URL (usually CORS_ORIGINS='http://localhost:3000'). Separate multiple origins by commas with no spaces. Restart the FastAPI server to register modifications."
  },
  {
    q: "The terminal displays 'SQLite OperationalError: no such table' — what is missing?",
    a: "Your SQLite database is not yet initialized or has missing schemas. Run the seeder from the root directory: 'npm run backend:seed' to bootstrap schemas and default multi-tenant accounts in the dev.db file. Make sure your Python venv is correctly activated."
  },
  {
    q: "Why do subsequent queries return 401 Unauthorized or redirect back to login?",
    a: "Your local JSON Web Token (JWT) is invalid, expired, or was signed using a different secret key. If you modified JWT_SECRET in your backend/.env, open the browser developer console and execute 'localStorage.clear();' to clear expired tokens, then re-authenticate."
  },
  {
    q: "The database seeder fails due to duplicate key or unique constraint violations.",
    a: "The seeder is designed to be idempotent and ignore duplicate keys under normal operations. If structural schema modifications have occurred, drop the tables and trigger a fresh database rebuild by executing 'npm run backend:seed -- --reset' from the root workspace."
  }
];


export default function DeveloperDocsPage() {
  const [activeTab, setActiveTab] = useState<TerminalKey>("cli");
  const [selectedNode, setSelectedNode] = useState<DiagramKey>("api");
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<"gff_users" | "gff_clients" | "gff_portal_items">("gff_portal_items");
  const [selectedEntity, setSelectedEntity] = useState<"projects" | "ai_ops" | "documents" | "invoices" | "support_tickets" | "governance">("projects");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Sovereign Developer Hub"
        title="Local Sandbox & Developer Guide"
        highlightedWord="Developer Guide"
        visualType="developerDocs"
        description="Comprehensive setup specifications, cryptographic handshake protocols, and interactive references for configuring the Phase 5 local MVP backend."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Developer Sandbox" }
        ]}
      />

      {/* Narrative Section */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Terminal Section */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-[20px] font-bold text-white tracking-tight uppercase tracking-wider font-mono">
                    1. Sandbox Code & Terminal
                  </h2>
                  <p className="text-[12px] text-white/50 font-light mt-1">
                    Select a workflow paradigm to inspect core commands and package guidelines.
                  </p>
                </div>

                <div className="flex gap-2 bg-[#050505]/60 border border-white/5 rounded-xl p-1">
                  {(Object.keys(TERMINAL_TABS) as TerminalKey[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all uppercase tracking-wider ${
                        activeTab === tab
                          ? "bg-white text-black font-semibold shadow-md"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {TERMINAL_TABS[tab].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Code Display */}
              <div className="rounded-[20px] border border-white/5 bg-[#030304] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-[#080809] border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-3 font-mono text-[9px] uppercase tracking-widest text-white/40">
                      SECURE COGNITIVE SHELL v1.5 // {TERMINAL_TABS[activeTab].title}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(TERMINAL_TABS[activeTab].code)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/60 hover:text-white hover:bg-white/10 font-mono transition-all uppercase tracking-wider"
                  >
                    {copied ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Copied
                      </>
                    ) : (
                      "Copy Shell"
                    )}
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-[13px] text-white/70 font-light mb-4 italic">
                    💡 {TERMINAL_TABS[activeTab].subtitle}
                  </p>
                  
                  <div className="font-mono text-[12px] text-white/85 leading-relaxed bg-black/40 rounded-xl p-5 overflow-x-auto border border-white/5">
                    <pre className="whitespace-pre">{TERMINAL_TABS[activeTab].code}</pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-white/40 text-[11px]">
                    <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-light italic">{TERMINAL_TABS[activeTab].notes}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Interactive Architecture Flow Section */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[20px] font-bold text-white tracking-tight uppercase tracking-wider font-mono">
                  2. Architectural Sync Protocol
                </h2>
                <p className="text-[12px] text-white/50 font-light mt-1">
                  Click any primary architectural entity in the local stack model to inspect port configurations, data routes, and loopback flows.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Interactive Diagram Component */}
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <svg className="w-full max-w-[400px] h-auto aspect-[1/1] py-4" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      
                      {/* Flow Connections */}
                      <path d="M200 95 L200 165" stroke="url(#blueRedGlow)" strokeWidth="1.5" strokeDasharray="5 3" className="opacity-80" />
                      <path d="M200 225 L200 295" stroke="url(#blueRedGlow)" strokeWidth="1.5" strokeDasharray="5 3" className="opacity-80" />

                      {/* Node 1: Next.js Frontend */}
                      <g 
                        onClick={() => setSelectedNode("frontend")}
                        className="cursor-pointer group focus:outline-none"
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedNode === "frontend"}
                      >
                        <rect 
                          x="50" y="30" width="300" height="65" rx="12" 
                          fill={selectedNode === "frontend" ? "rgba(228, 0, 15, 0.08)" : "#0c0c0e"} 
                          stroke={selectedNode === "frontend" ? "#E4000F" : "rgba(255,255,255,0.06)"} 
                          strokeWidth="1.5"
                          className="transition-all duration-300 hover:stroke-white/30"
                        />
                        <text x="200" y="58" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" className="uppercase tracking-[0.08em] font-mono">
                          Next.js UI Cockpit
                        </text>
                        <text x="200" y="76" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" className="font-mono">
                          localhost:3000
                        </text>
                        {selectedNode === "frontend" && (
                          <circle cx="330" cy="62" r="3" fill="#E4000F" className="animate-ping" />
                        )}
                      </g>

                      {/* Node 2: FastAPI Backend */}
                      <g 
                        onClick={() => setSelectedNode("api")}
                        className="cursor-pointer group focus:outline-none"
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedNode === "api"}
                      >
                        <rect 
                          x="50" y="165" width="300" height="65" rx="12" 
                          fill={selectedNode === "api" ? "rgba(0, 157, 255, 0.08)" : "#0c0c0e"} 
                          stroke={selectedNode === "api" ? "#009DFF" : "rgba(255,255,255,0.06)"} 
                          strokeWidth="1.5"
                          className="transition-all duration-300 hover:stroke-white/30"
                        />
                        <text x="200" y="193" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" className="uppercase tracking-[0.08em] font-mono">
                          FastAPI REST Engine
                        </text>
                        <text x="200" y="211" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" className="font-mono">
                          localhost:8000
                        </text>
                        {selectedNode === "api" && (
                          <circle cx="330" cy="197" r="3" fill="#009DFF" className="animate-ping" />
                        )}
                      </g>


                      {/* Node 3: SQLite Database */}
                      <g 
                        onClick={() => setSelectedNode("db")}
                        className="cursor-pointer group focus:outline-none"
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedNode === "db"}
                      >
                        <rect 
                          x="50" y="295" width="300" height="65" rx="12" 
                          fill={selectedNode === "db" ? "rgba(0, 157, 255, 0.08)" : "#0c0c0e"} 
                          stroke={selectedNode === "db" ? "white" : "rgba(255,255,255,0.06)"} 
                          strokeWidth="1.5"
                          className="transition-all duration-300 hover:stroke-white/30"
                        />
                        <text x="200" y="323" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" className="uppercase tracking-[0.08em] font-mono">
                          SQLite DB Core
                        </text>
                        <text x="200" y="341" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" className="font-mono">
                          backend/dev.db (SQLite3)
                        </text>
                        {selectedNode === "db" && (
                          <circle cx="330" cy="327" r="3" fill="white" className="animate-ping" />
                        )}
                      </g>

                      <defs>
                        <linearGradient id="blueRedGlow" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#E4000F" />
                          <stop offset="1" stopColor="#009DFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Inspector Panel */}
                  <div className="lg:col-span-6 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 min-h-[220px]">
                    <span className="px-2 py-0.5 text-[8.5px] font-bold text-white/50 bg-white/5 rounded-full uppercase tracking-widest font-mono self-start">
                      Sandbox Entity Inspector
                    </span>
                    <h3 className="mt-3 text-[18px] font-bold text-white tracking-tight">
                      {DIAGRAM_NODES[selectedNode].title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-white/70 font-light">
                      {DIAGRAM_NODES[selectedNode].desc}
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11px] text-white/50 leading-relaxed">
                      <span className="text-white/80 font-bold block mb-1">LOOPBACK GUIDELINES:</span>
                      {DIAGRAM_NODES[selectedNode].details}
                    </div>
                  </div>

                </div>
              </div>
            </div>


            {/* Seeded Developer Accounts Grid */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[20px] font-bold text-white tracking-tight uppercase tracking-wider font-mono">
                  3. Pre-Seeded RBAC Sandbox Profiles
                </h2>
                <p className="text-[12px] text-white/50 font-light mt-1">
                  Authenticate your sandbox workspace using these seeded database-persistent profiles to audit client-specific multi-tenant isolation schemas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEV_USERS.map((user) => (
                  <div 
                    key={user.email}
                    className="p-5 rounded-[20px] border border-white/5 bg-[#050505]/30 hover:border-white/10 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md">
                          {user.role}
                        </span>
                        <span className="text-[10px] font-mono text-white/30 group-hover:text-white/50 transition-colors">
                          {user.tenant}
                        </span>
                      </div>

                      <h4 className="text-[14px] font-mono font-bold text-white tracking-tight">
                        {user.email}
                      </h4>
                      <p className="text-[12px] text-white/50 font-light mt-2 leading-relaxed">
                        {user.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="text-white/40">Password:</span>
                      <span className="text-white/80 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {user.pass}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* DynamoDB Production Schema Section */}
            <DynamoDbModelingSection />


            {/* Troubleshooting Panel */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[20px] font-bold text-white tracking-tight uppercase tracking-wider font-mono">
                  5. Sandbox Troubleshooting Protocol
                </h2>
                <p className="text-[12px] text-white/50 font-light mt-1">
                  Common diagnostic scenarios encountered when configuring the local SQLite & FastAPI state managers.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {FAQ_ITEMS.map((item, idx) => (
                  <div 
                    key={idx}
                    className="rounded-xl border border-white/5 bg-black/20 overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-[13.5px] text-white/90 font-medium font-mono leading-snug">
                        {idx + 1}. {item.q}
                      </span>
                      <svg 
                        className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeFaq === idx && (
                      <div className="px-6 pb-5 border-t border-white/5 pt-3 bg-white/[0.01]">
                        <p className="text-[12.5px] leading-[1.6] text-white/60 font-light">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Sidebar Notice 1: Sandbox Boundaries */}
            <div className="rounded-[24px] border border-white/5 bg-gradient-to-b from-[#070709] to-[#040405] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[30px]" />
              
              <h3 className="text-[12px] font-mono text-[#009DFF] font-bold uppercase tracking-widest mb-4">
                Sovereign Sandbox Boundaries
              </h3>
              
              <p className="text-[12.5px] text-white/60 font-light leading-relaxed mb-6">
                In alignment with GFF AI's strict security protocols, the developer workspace is isolated to physical client-side sandbox simulators for demonstration accuracy.
              </p>

              <div className="flex flex-col gap-4">
                {BOUNDARIES.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border ${item.border} bg-gradient-to-br ${item.color} flex flex-col gap-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-mono font-bold text-white">
                        {item.title}
                      </span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2 py-0.5 rounded border border-[#009DFF]/20">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-white/50 leading-relaxed font-light">
                      {item.text}
                    </p>
                    <div className="border-t border-white/5 pt-2 mt-1 text-[10px] font-mono text-white/45">
                      <span className="text-white/20">PROD PARADIGM:</span> {item.prod}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Notice 2: Reference Manual */}
            <div className="rounded-[24px] border border-white/5 bg-black/40 p-6 flex flex-col gap-4">
              <h4 className="text-[12px] font-mono text-white/40 font-bold uppercase tracking-widest">
                API Reference Specs
              </h4>
              <p className="text-[12.5px] text-white/60 font-light leading-relaxed">
                Refer to the comprehensive API specifications file inside the local repository for JSON-schema validation specs, token validation payloads, and health checks:
              </p>
              <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 font-mono text-[11px] text-[#009DFF] tracking-wider">
                📄 docs/PHASE_5_MVP_BACKEND.md
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA 
          title="Require Enterprise Custom Integrations?" 
          description="Schedule an engineering workshop to build secure, dedicated multi-tenant agency enclaves mapped to your hardware infrastructure." 
        />
      </div>
    </InnerPageShell>
  );
}

