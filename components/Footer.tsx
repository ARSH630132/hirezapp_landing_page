"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { ChevronDown } from "lucide-react";

const footerCols = [
  {
    title: "Quick Links",
    items: [
      { n: "Home", h: "/" },
      { n: "Why GFF AI", h: "/why-gff-ai" },
      { n: "Build With GFF", h: "/build" },
      { n: "Resources", h: "/resources" },
      { n: "Executive Insights", h: "/insights" },
      { n: "Contact", h: "/contact" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { n: "Capabilities Hub", h: "/capabilities" },
      { n: "Agentic AI", h: "/capabilities/agents" },
      { n: "AI Governance", h: "/capabilities/governance" },
      { n: "Managed AI", h: "/capabilities/managed-services" },
      { n: "AI Labs", h: "/capabilities/labs" },
    ],
  },
  {
    title: "Industries",
    items: [
      { n: "Industries Hub", h: "/industries" },
      { n: "Financial Services", h: "/industries/financial-services" },
      { n: "Advanced Manufacturing", h: "/industries/manufacturing" },
      { n: "Sovereign Audit", h: "/industries/audit" },
    ],
  },
  {
    title: "Platforms",
    items: [
      { n: "Platforms Hub", h: "/platforms" },
      { n: "Foundry Studio", h: "/platforms/foundry" },
      { n: "Agent Marketplace", h: "/platforms/marketplace" },
      { n: "Control Center", h: "/platforms/control-center" },
    ],
  },
  {
    title: "Company",
    items: [
      { n: "Company Profile", h: "/company" },
      { n: "Mission & Values", h: "/company/mission" },
      { n: "Executive Leadership", h: "/company/leadership" },
      { n: "Careers", h: "/company/careers" },
    ],
  },
  {
    title: "Legal",
    items: [
      { n: "Privacy Policy", h: "/privacy" },
      { n: "NDA Agreement", h: "/nda" },
      { n: "Terms of Service", h: "/terms" },
      { n: "Investor Relations", h: "/investor-relations" },
      { n: "Client Portal", h: "/portal" },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    h: "https://www.linkedin.com/company/gff-ai/",
    icon: "/footer/linkedin.png",
  },
  {
    name: "Twitter",
    h: "https://x.com/gffai",
    icon: "/footer/twitter.png",
  },
  {
    name: "Email",
    h: "mailto:contact@gff.ai",
    icon: "/footer/mail.png",
  },
  {
    name: "YouTube",
    h: "https://www.youtube.com/@gffai",
    icon: "/footer/youtube.png",
  },
  {
    name: "Instagram",
    h: "https://www.instagram.com/gffai/",
    icon: "/footer/instagram.png",
  },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className="text-white text-[16px] font-semibold">{children}</h3>
      <div className="mt-2 h-[1px] w-12 bg-gradient-to-r from-red-600 to-transparent" />
    </>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSub(true);
    setEmail("");
  };

  return (
    <footer className="w-full bg-black border-t border-white/5">
      <div className="max-w-[1795px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-12 lg:py-14">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5 xl:gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img src="/footer/logo.svg" alt="GFF AI mark" className="h-[58px]" />
              <img src="/footer/text.png" alt="GFF AI" className="h-[34px]" />
            </div>

            <p className="mt-5 text-white/70 text-[15px] leading-[1.7] max-w-[300px]">
              Premium enterprise AI consulting, agentic automation, and
              intelligent systems from Garage to Foundry to Factory.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.h}
                  target={item.h.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.h.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={item.name}
                  className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-[#009DFF]/60 hover:bg-[#009DFF]/10 transition-all"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="h-5 w-5 object-contain brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:block min-w-0">
            <div className="grid grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content_250px] gap-x-10 gap-y-10">
              {footerCols.map((col) => (
                <div key={col.title} className="min-w-0">
                  <SectionTitle>{col.title}</SectionTitle>

                  <div className="mt-5 space-y-3">
                    {col.items.map((it) => (
                      <Link
                        key={it.n}
                        href={it.h}
                        className="block whitespace-nowrap text-white/55 hover:text-[#009DFF] text-[14px] leading-[1.35] transition-colors"
                      >
                        {it.n}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="w-[240px]">
                <SectionTitle>Contact</SectionTitle>

                <div className="mt-5 space-y-4 text-white/55 text-[14px]">
                  <p className="flex items-start gap-2">
                    <MdEmail className="text-[#009DFF] mt-1 shrink-0" />
                    <a
                      href="mailto:contact@gff.ai"
                      className="hover:text-white whitespace-nowrap"
                    >
                      contact@gff.ai
                    </a>
                  </p>
                  <p className="flex items-start gap-2">
                    <FaPhone className="text-[#009DFF] mt-1 shrink-0" />
                    <span className="whitespace-nowrap">+1 (800) 555-GFF-AI</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 w-[103%] rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h4 className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
                Newsletter
              </h4>
              <div className="mt-2 h-[1px] w-12 bg-gradient-to-r from-red-600 to-transparent" />

              <div className="mt-4 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-center">
                <p className="text-white/50 text-[13px] leading-relaxed">
                  Subscribe to our weekly enterprise briefing. Benchmarks & architectures.
                </p>

                {sub ? (
                  <div className="text-emerald-400 text-[13px]">
                    ✓ Subscription simulated. FastAPI integration coming soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-3">
                    <input
                      type="email"
                      placeholder="enterprise@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="min-w-0 flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[#009DFF]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white text-[13px] font-bold px-7 py-3 rounded-xl"
                    >
                      Join
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="lg:hidden border-t border-white/10">
            {[...footerCols, { title: "Contact", items: [] }].map((col) => (
              <div key={col.title} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(open === col.title ? null : col.title)}
                  className="w-full py-4 flex items-center justify-between text-white text-[15px] font-semibold"
                >
                  {col.title}
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      open === col.title ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open === col.title && (
                  <div className="pb-4 space-y-3 text-[13px]">
                    {col.title === "Contact" ? (
                      <>
                        <p className="flex items-center gap-2 text-white/60">
                          <MdEmail className="text-[#009DFF]" />
                          <a href="mailto:contact@gff.ai">contact@gff.ai</a>
                        </p>
                        <p className="flex items-center gap-2 text-white/60">
                          <FaPhone className="text-[#009DFF]" />
                          <span className="whitespace-nowrap">+1 (800) 555-GFF-AI</span>
                        </p>
                      </>
                    ) : (
                      col.items.map((it) => (
                        <Link
                          key={it.n}
                          href={it.h}
                          className="block text-white/55 hover:text-[#009DFF]"
                        >
                          {it.n}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
                Newsletter
              </h4>
              <div className="mt-2 h-[1px] w-12 bg-gradient-to-r from-red-600 to-transparent" />
              <p className="mt-3 text-white/50 text-[13px] leading-relaxed">
                Subscribe to our weekly enterprise briefing. Benchmarks &
                architectures.
              </p>

              {sub ? (
                <div className="mt-4 text-emerald-400 text-[13px]">
                  ✓ Subscription simulated. FastAPI integration coming soon.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-4 flex gap-3">
                  <input
                    type="email"
                    placeholder="enterprise@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[#009DFF]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white text-[13px] font-bold px-5 py-3 rounded-xl"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 text-center text-white/40 text-[12px] px-4">
        © 2026 GFF AI. All Rights Reserved. Enterprise Grade Artificial
        Intelligence.
      </div>
    </footer>
  );
}