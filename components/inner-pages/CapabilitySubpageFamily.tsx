"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";
import { CheckCircle, ArrowRight, Compass, Wrench, Cpu, Shield, Database, FlaskConical, Activity, Layers, GraduationCap, Network, Settings, Workflow } from "lucide-react";

export interface UseCase {
  title: string;
  description: string;
  badge: string;
  metric?: { value: string; label: string };
}

export interface DeliveryModel {
  name: string;
  desc: string;
  features: string[];
}

export interface BusinessOutcome {
  value: string;
  label: string;
  desc: string;
}

export interface RelatedPage {
  title: string;
  tag: string;
  desc: string;
  href: string;
}

interface CapabilitySubpageProps {
  slug: string;
  category: string;
  title: string;
  highlightedWord: string;
  description: string;
  useCases: UseCase[];
  activeLayerId: "experience" | "agentic" | "knowledge" | "data" | "governance" | "operations";
  deliveryModels: DeliveryModel[];
  outcomes: BusinessOutcome[];
  nextSteps: RelatedPage[];
  relatedPlatform: string;
  relatedPlatformHref: string;
}

const layersInfo = {
  experience: { name: "Experience Layer", spec: "Sub-50ms render loop, secure portal clients." },
  agentic: { name: "Agentic AI Layer", spec: "State isolation, multi-agent orchestrations." },
  knowledge: { name: "Knowledge Graph Layer", spec: "10M+ relational nodes with hybrid search." },
  data: { name: "Data & Integration Layer", spec: "Real-time CDC syncing and high-volume pipelines." },
  governance: { name: "Governance & Safety Layer", spec: "99.9% PII scrubbing and compliance firewalls." },
  operations: { name: "Managed AI Operations Layer", spec: "Telemetry monitoring, cost curves, and failovers." }
};

const iconMap: Record<string, React.ReactNode> = {
  strategy: <Compass className="w-8 h-8 text-[#E4000F]" />,
  engineering: <Wrench className="w-8 h-8 text-[#009DFF]" />,
  agents: <Cpu className="w-8 h-8 text-purple-400" />,
  governance: <Shield className="w-8 h-8 text-emerald-400" />,
  data: <Database className="w-8 h-8 text-amber-400" />,
  labs: <FlaskConical className="w-8 h-8 text-pink-400" />,
  operations: <Activity className="w-8 h-8 text-cyan-400" />,
  twins: <Layers className="w-8 h-8 text-indigo-400" />,
  universities: <GraduationCap className="w-8 h-8 text-teal-400" />,
  "knowledge-graph": <Network className="w-8 h-8 text-violet-400" />,
  "managed-services": <Settings className="w-8 h-8 text-[#E4000F]" />
};

export default function CapabilitySubpageFamily({
  slug,
  category,
  title,
  highlightedWord,
  description,
  useCases,
  activeLayerId,
  deliveryModels,
  outcomes,
  nextSteps,
  relatedPlatform,
  relatedPlatformHref
}: CapabilitySubpageProps) {
  const [activeModel, setActiveModel] = useState(0);
  const activeIcon = iconMap[slug] || <Settings className="w-8 h-8 text-[#009DFF]" />;

  return (
    <InnerPageShell>
      <InnerPageHero
        category={category}
        title={title}
        highlightedWord={highlightedWord}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/capabilities" },
          { label: title }
        ]}
      />

      {/* Hero Visual Panel */}
      <section className="relative w-full px-6 lg:px-16 pb-16 -mt-8">
        <div className="max-w-[1795px] mx-auto border border-white/5 bg-[#030304]/40 backdrop-blur-md rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <span className="text-[10px] font-mono tracking-widest text-[#009DFF] uppercase font-bold">SYSTEM VECTOR</span>
            <h3 className="text-[20px] font-bold text-white mt-2">Architectural Blueprint</h3>
            <p className="mt-2 text-[13px] text-white/50 font-light leading-[1.6]">
              This specialized capability runs natively inside GFF enterprise models. It conforms to strict regulatory parameters while keeping sub-second execution speeds.
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
            {activeIcon}
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="relative w-full px-6 lg:px-16 pb-20 pt-8 border-t border-white/5">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">TACTICAL VECTOR</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Enterprise Use Cases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="group relative p-6 rounded-2xl border border-white/5 bg-[#030304]/60 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">{uc.badge}</span>
                  <h4 className="text-[17px] font-semibold text-white tracking-tight mt-4">{uc.title}</h4>
                  <p className="mt-2 text-[13px] leading-[1.6] text-white/50 font-light group-hover:text-white/70 transition-colors">{uc.description}</p>
                </div>
                {uc.metric && (
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <span className="text-[24px] font-bold text-white tracking-tight leading-none">{uc.metric.value}</span>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-1">{uc.metric.label}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Integration Spot */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="bg-[#030304]/60 border border-white/5 rounded-2xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 block">STACK PLACEMENT</span>
              {Object.entries(layersInfo).map(([id, info]) => {
                const isActive = activeLayerId === id;
                return (
                  <div key={id} className={`p-3 rounded-xl border transition-all flex justify-between items-center ${isActive ? "bg-white/5 border-[#009DFF]" : "bg-black/20 border-white/5 opacity-55"}`}>
                    <div>
                      <h4 className="text-[13px] font-semibold text-white">{info.name}</h4>
                      <span className="text-[10px] text-white/40 font-mono uppercase">0{Object.keys(layersInfo).indexOf(id)+1} . {isActive ? "PRIMARY ACTIVE LAYER" : "COMPATIBLE"}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-[#009DFF]" : "bg-white/10"}`} />
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase bg-[#009DFF]/5 px-2 py-0.5 rounded border border-[#009DFF]/10">INTEGRATION DETAIL</span>
                <h3 className="text-[18px] font-bold text-white mt-3">Housed inside: {layersInfo[activeLayerId].name}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50 font-light font-sans">Runs directly on GFF {layersInfo[activeLayerId].name}. Complies with strict {layersInfo[activeLayerId].spec} standards.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <a href="/capabilities" className="text-[12px] font-mono text-[#009DFF] hover:text-white transition-colors flex items-center gap-1.5">
                  <span>VIEW FULL ARCHITECTURE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Models */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">OPERATIONAL MODEL</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Delivery & Deployment Models</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col gap-2">
              {deliveryModels.map((m, idx) => (
                <button key={idx} onClick={() => setActiveModel(idx)} className={`w-full text-left p-4 rounded-xl border transition-all ${activeModel === idx ? "bg-white/5 border-[#009DFF] text-white" : "bg-[#030304]/30 border-white/5 text-white/50 hover:border-white/10"}`}>
                  <span className="text-[9px] font-mono block text-[#009DFF] mb-1">MODULE 0${idx+1}</span>
                  <span className="text-[14px] font-semibold">{m.name}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-8 bg-[#030304]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase bg-[#009DFF]/5 px-2 py-0.5 rounded border border-[#009DFF]/10">ACTIVE FRAMEWORK</span>
                <h3 className="text-[18px] font-bold text-white mt-3">{deliveryModels[activeModel].name}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/55 font-light">{deliveryModels[activeModel].desc}</p>
                <div className="mt-5">
                  <span className="text-[9.5px] font-mono uppercase text-white/40 tracking-wider">Features & Protocols</span>
                  <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {deliveryModels[activeModel].features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[12px] text-white/80 font-light">
                        <CheckCircle className="w-3.5 h-3.5 text-[#009DFF] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Outcomes */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold">OUTCOME METRIC</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Operational Impact & Milestones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outcomes.map((out, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#030304]/40 flex flex-col justify-between">
                <div>
                  <span className="text-[30px] font-bold text-white tracking-tight leading-none">{out.value}</span>
                  <p className="text-[10px] font-mono text-[#E4000F] uppercase tracking-wider mt-1">{out.label}</p>
                  <p className="mt-3 text-[12.5px] leading-[1.5] text-white/50 font-light">{out.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Platform Redirect */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto bg-[#030304]/60 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest">ECOSYSTEM MATRIX CONNECTION</span>
            <h3 className="text-[17px] font-bold text-white mt-1">Utilizes platform: {relatedPlatform}</h3>
            <p className="mt-1 text-[12.5px] text-white/55 font-light font-sans">This capability is actively supported by GFF {relatedPlatform} protocols.</p>
          </div>
          <a href={relatedPlatformHref} className="px-5 py-2.5 rounded-full text-[12.5px] font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition-all flex items-center gap-1.5 shrink-0">
            <span>Inspect {relatedPlatform}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Next Steps / Related Capabilities */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <RelatedPagesGrid links={nextSteps} />
      </div>

      {/* CTA */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA
          title={`Ready to Operationalize ${title}?`}
          description="Schedule a strict technical architecture session with GFF lead engineers to map custom endpoints and verify compliance."
          primaryLabel="Schedule Deep-Dive"
          secondaryLabel="View Capability Command"
          secondaryHref="/capabilities"
        />
      </div>
    </InnerPageShell>
  );
}
