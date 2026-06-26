"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Multi-Agent Systems Engineer",
      team: "Core Infrastructure",
      loc: "Remote Hub (Americas/Europe)",
      desc: "Design and implement high-throughput asynchronous DAG executors, zero-trust sandboxes, and low-latency state synchronizers."
    },
    {
      title: "AI Safety & Alignment Researcher",
      team: "Cognitive Security",
      loc: "Remote Hub (Asia/Americas)",
      desc: "Develop advanced semantic compliance filters, real-time adversarial input detectors, and eBPF-integrated network log monitors."
    },
    {
      title: "Solutions Architect (Enterprise AI)",
      team: "Delivery & Delivery Excellence",
      loc: "San Francisco, CA / London, UK / Remote",
      desc: "Lead deep technical discovery workshops, configure custom interactive sandboxes, and bridge the transition from Garage to Foundry."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Join the Mission"
        title="Careers at GFF AI"
        highlightedWord="Careers"
        description="We are looking for expert systems engineers, cognitive researchers, and technical architects to build the next layer of industrial automation."
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 space-y-10">
        <div className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
          <h2 className="text-[20px] font-semibold text-white tracking-tight">Our Operational Philosophy</h2>
          <p className="text-white/70 leading-[1.7] text-[15px] font-light">
            We value clean code, deterministic systems, and high performance. At GFF AI, we reject unnecessary complexity and build targeted, scalable multi-agent networks that solve concrete enterprise problems today.
          </p>
        </div>

        <h2 className="text-[24px] font-bold text-white tracking-tight mt-12 mb-6">Open Technical Roles</h2>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.title} className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/50">{job.team}</span>
                  <span className="text-[10px] font-mono uppercase bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded-full text-[#009DFF]">{job.loc}</span>
                </div>
                <h3 className="text-[18px] font-semibold text-white tracking-tight mt-1">{job.title}</h3>
                <p className="text-white/60 text-[14px] leading-[1.6] font-light max-w-[800px]">{job.desc}</p>
              </div>

              <div className="shrink-0">
                <a href="mailto:careers@gff.ai" className="inline-flex h-[42px] px-6 items-center justify-center rounded-xl bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white text-[13.5px] font-semibold hover:opacity-95 transition-opacity">
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}