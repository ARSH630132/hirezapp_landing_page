"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const S_DATA = [
  {
    id: "financial-services",
    title: "Financial Services",
    path: "/industries/financial-services",
    desc: "Deploy multi-asset auditing, compliance checks, and transaction risk surveillance.",
    challenges: ["Legacy system isolation", "Compliance pressure", "Manual document gaps"],
    agents: ["Compliance Assistant", "Risk Review Agent", "Customer Intelligence Agent"]
  },
  {
    id: "banking",
    title: "Banking",
    path: "/industries/banking",
    desc: "Unify mainframes with AI interfaces and copilots.",
    challenges: ["Inquiry bottlenecks", "Fragmented archives", "Manual validation tasks"],
    agents: ["Banking Knowledge Agent", "Relationship Manager Copilot", "Contract Intelligence Agent"]
  },
  {
    id: "insurance",
    title: "Insurance",
    path: "/industries/insurance",
    desc: "Accelerate claim lifecycle velocity and automate risk assessment.",
    challenges: ["Claims overhead", "Unstructured policy search", "Document workflows"],
    agents: ["Claims Triage Agent", "Policy Intelligence Agent", "Underwriting Copilot"]
  },
  {
    id: "healthcare",
    title: "Healthcare",
    path: "/industries/healthcare",
    desc: "Deploy HIPAA-aligned cognitive routing layers to automate complex care workflows.",
    challenges: ["Operational Complexity", "Patient Communications", "Staff Knowledge Access"],
    agents: ["Care Operations Copilot", "Knowledge Search Agent", "Document Intelligence Agent"]
  },
  {
    id: "life-sciences",
    title: "Life Sciences",
    path: "/industries/life-sciences",
    desc: "Accelerate regulatory compilation, secure compound search, and trial operations.",
    challenges: ["Research Documentation", "Regulatory Workflows", "Trial Operations Support"],
    agents: ["Research Knowledge Agent", "Regulatory Document Assistant", "Trial Operations Copilot"]
  },
  {
    id: "education",
    title: "Education",
    path: "/industries/education",
    desc: "Empower academic institutions, automate registrar services, and deploy interactive learning sandboxes.",
    challenges: ["Student Support", "Faculty Enablement", "AI Labs & Learning"],
    agents: ["Student Support Agent", "Faculty Assistant", "Learning Assistant"]
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    path: "/industries/manufacturing",
    desc: "Unify SCADA, MES, and ERP telemetry to automate maintenance routing and audit quality compliance.",
    challenges: ["Production visibility", "Maintenance workflows", "Quality management"],
    agents: ["Maintenance Copilot", "Quality Intelligence Agent", "Procurement Copilot"]
  },
  {
    id: "retail",
    title: "Retail",
    path: "/industries/retail",
    desc: "Streamline customer experience, manage merchandising operations, and enable real-time inventory visibility.",
    challenges: ["Customer experience", "Merchandising operations", "Inventory visibility"],
    agents: ["Customer Experience Agent", "Store Operations Copilot", "Merchandising Intelligence Agent"]
  },
  {
    id: "mining",
    title: "Mining",
    path: "/industries/mining",
    desc: "Deploy field operations support, automated hazard checklists, and remote site asset visibility.",
    challenges: ["Field operations", "Safety workflows", "Asset visibility"],
    agents: ["Field Operations Agent", "Safety Knowledge Agent", "Executive Dashboard Agent"]
  },
  {
    id: "energy",
    title: "Energy",
    path: "/industries/energy",
    desc: "Deploy field service support, automated asset maintenance ticketing, and regulatory documentation search.",
    challenges: ["Asset operations latency", "Field service coordinating", "Grid & plant fragmentation"],
    agents: ["Asset Operations Agent", "Field Service Copilot", "Document Intelligence Agent"]
  },
  {
    id: "telecom",
    title: "Telecom",
    path: "/industries/telecom",
    desc: "Streamline network operations, automate customer query routing, and enable real-time service delivery visibility.",
    challenges: ["Network downtime response", "Customer inquiry bottlenecks", "Service delivery visibility"],
    agents: ["Network Operations Copilot", "Customer Experience Agent", "Field Service Copilot"]
  },
  {
    id: "government",
    title: "Government",
    path: "/industries/government",
    desc: "Enable digital policy search, streamlined case intake triage, and high-transparency governance logs.",
    challenges: ["Policy search latencies", "Case processing backlogs", "Documentation opacity"],
    agents: ["Citizen Service Agent", "Policy Intelligence Agent", "Case Triage Agent"]
  },
  {
    id: "public-sector",
    title: "Public Sector",
    path: "/industries/public-sector",
    desc: "Upgrade public administration, citizen service portals, and record intelligence networks.",
    challenges: ["Citizen service backlogs", "Policy search friction", "Process transparency"],
    agents: ["Citizen Service Agent", "Policy Intelligence Agent", "Document Intelligence Agent"]
  },
  {
    id: "audit",
    title: "Audit",
    path: "/industries/audit",
    desc: "Deploy secure, read-only sovereign agents to augment auditing workflows.",
    challenges: ["Evidence collection", "Documentation review", "Risk assessment"],
    agents: ["Evidence Review Agent", "Audit Knowledge Assistant", "Risk Review Agent"]
  },
  {
    id: "tax",
    title: "Tax",
    path: "/industries/tax",
    desc: "Integrate high-accuracy document intelligence layers and dynamic compliance search.",
    challenges: ["Document-heavy workflows", "Compliance tracking", "Client response time"],
    agents: ["Tax Knowledge Agent", "Compliance Assistant", "Document Intelligence Agent"]
  },
  {
    id: "legal",
    title: "Legal",
    path: "/industries/legal",
    desc: "Deploy corporate memory networks and private legal research workflows.",
    challenges: ["Contract review", "Matter knowledge", "Research workflows"],
    agents: ["Contract Intelligence Agent", "Legal Knowledge Search Agent", "Matter Assistant"]
  },
  {
    id: "advisory",
    title: "Advisory",
    path: "/industries/advisory",
    desc: "Accelerate research, streamline delivery operations, and scale proposal pipelines.",
    challenges: ["Research acceleration", "Proposal development", "Delivery operations"],
    agents: ["Advisory Copilot", "Advisory Research Agent", "Proposal Copilot"]
  }
];

export default function IndustriesPage() {
  const [tab, setTab] = useState("financial-services");
  const active = S_DATA.find((x) => x.id === tab) || S_DATA[0];
  const [arch, setArch] = useState("cognitive");

  return (
    <InnerPageShell>
      <InnerPageHero category="Enterprise Verticals" title="AI Engineered for Your Industry" highlightedWord="Industry" description="GFF AI engineers custom cognitive frameworks calibrated for strict security and compliance." />
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {S_DATA.map((ind) => (
            <button key={ind.id} onClick={() => setTab(ind.id)} className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${tab === ind.id ? "bg-white text-black border-white" : "bg-white/5 text-white/70 border-white/5 hover:text-white"}`}>{ind.title}</button>
          ))}
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#050507]/80 p-6 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col justify-between min-h-[140px]">
            <div>
              <h3 className="text-xl font-bold text-white">{active.title}</h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">{active.desc}</p>
            </div>
            <div className="mt-4">
              <a href={active.path} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white bg-white/5 border border-white/10 hover:bg-white/10 font-medium">Explore Strategy →</a>
            </div>
          </div>
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2 font-bold">Challenges</h4>
            <ul className="space-y-1">
              {active.challenges.map((c, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/80 font-light"><span className="text-[#E4000F] font-bold">•</span> {c}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2 font-bold">Agents</h4>
            <div className="space-y-1">
              {active.agents.map((a, i) => (
                <div key={i} className="p-2 rounded bg-white/[0.01] border border-white/5 text-xs text-white">{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-white">Reference Architecture</h2>
            <div className="mt-4 space-y-1">
              {["ingest", "cognitive", "action"].map((k) => (
                <button key={k} onClick={() => setArch(k)} className={`w-full p-2 rounded-xl text-left border text-xs font-semibold transition-all ${arch === k ? "bg-white/5 border-white/10 text-white" : "border-transparent text-white/50 hover:text-white"}`}>{k === "ingest" ? "Data Ingestion" : k === "cognitive" ? "Cognitive Core" : "Action Dispatch"}</button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050506]/60">
            <h4 className="text-sm font-bold text-white uppercase">{arch === "ingest" ? "Data Ingestion" : arch === "cognitive" ? "Sovereign Cognitive Core" : "Secure Outbound Dispatch"}</h4>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              {arch === "ingest" ? "Ingest data from systems, transactional records, and document queues securely." : arch === "cognitive" ? "Assess query intent, isolate tool logic execution, and route workloads." : "Dispatch action payloads to legacy systems with human validation trails."}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <PremiumCTA title="Build AI for Your Industry" description="Speak with our systems engineers to map your operational boundaries and custom sandbox deployments." primaryLabel="Connect with GFF AI" primaryHref="/contact" />
      </div>
    </InnerPageShell>
  );
}
