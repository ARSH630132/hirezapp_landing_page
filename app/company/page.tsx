"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function CompanyPage() {
  const leadership = [
    { name: "Dr. Elena Vance", role: "Chief Science Officer", bio: "Former Lead AI Architect at DARPA, specializing in distributed agentic reasoning models." },
    { name: "Marcus Thorne", role: "Head of Infrastructure", bio: "Experienced cloud systems engineer specialized in zero-trust sandboxing and sub-millisecond networks." },
    { name: "Sarah Lin", role: "VP of Enterprise Delivery", bio: "Steered AI transformation projects for three fortune-50 retail banks before joining GFF AI." }
  ];

  const values = [
    { title: "Rigorous Safety", desc: "Every autonomous agent must execute within deterministic sandbox boundaries with SOC2 audit loops." },
    { title: "Heuristic Efficiency", desc: "No bloated neural networks where light, fast, and structured rule nodes can resolve tasks." },
    { title: "Absolute Transparency", desc: "Token consumption, execution DAGs, and memory states must remain fully inspectable by clients." }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Corporate Profile"
        title="Our Company and Vision"
        highlightedWord="Company"
        description="GFF AI was founded to turn abstract cognitive intelligence models into concrete high-throughput enterprise infrastructure."
      />

      <div id="mission" className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-6">Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val) => (
            <div key={val.title} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all">
              <h3 className="text-[18px] font-semibold text-white tracking-tight">{val.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-white/60 font-light">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="leadership" className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-6">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((leader) => (
            <div key={leader.name} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all">
              <h3 className="text-[18px] font-semibold text-white tracking-tight">{leader.name}</h3>
              <span className="text-[11px] font-mono uppercase text-[#009DFF] tracking-wider font-semibold block mt-1">{leader.role}</span>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-white/60 font-light">{leader.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="locations" className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-4">Locations & Global Presence</h2>
        <p className="text-[14.5px] text-white/70 max-w-[800px] font-light leading-[1.6]">
          GFF AI operates a remote-first organizational model with physical collaboration hubs in major technological corridors. Our engineering cores remain globally distributed to ensure continuous network coverage and 24/7 client operations monitoring.
        </p>
      </div>
    </InnerPageShell>
  );
}