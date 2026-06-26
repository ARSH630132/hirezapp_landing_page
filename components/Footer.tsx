"use client";
import { useState } from "react";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const footerCols = [
  {
    title: "Quick Links",
    items: [
      { n: "Home", h: "/" },
      { n: "Why GFF AI", h: "/why-gff-ai" },
      { n: "Build With GFF", h: "/build" },
      { n: "Resources", h: "/resources" },
      { n: "Contact", h: "/contact" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { n: "Capabilities Hub", h: "/capabilities" },
      { n: "Agentic AI", h: "/capabilities#agentic-ai" },
      { n: "AI Governance", h: "/capabilities#governance" },
      { n: "Managed AI", h: "/capabilities#managed-ai" },
      { n: "AI Labs", h: "/capabilities#labs" },
    ],
  },
  {
    title: "Industries",
    items: [
      { n: "Industries Hub", h: "/industries" },
      { n: "Financial Services", h: "/industries#finance" },
      { n: "Advanced Manufacturing", h: "/industries#manufacturing" },
      { n: "Supply Chain", h: "/industries#logistics" },
    ],
  },
  {
    title: "Platforms",
    items: [
      { n: "Platforms Hub", h: "/platforms" },
      { n: "Foundry Studio", h: "/platforms/foundry" },
      { n: "Marketplace", h: "/platforms/marketplace" },
    ],
  },
  {
    title: "Company",
    items: [
      { n: "About Us", h: "/about-us" },
      { n: "Company Profile", h: "/company" },
      { n: "Mission & Values", h: "/company#mission" },
      { n: "Careers", h: "/careers" },
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
  }
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState(false);
  return (
    <footer className="w-full bg-black pt-16 border-t border-white/5">
      <div className="max-w-[1795px] mx-auto px-6 sm:px-8 lg:px-12 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-8">
          <div className="sm:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src="/footer/logo.svg" alt="Logo" className="h-[55px]" />
                <img src="/footer/text.png" alt="GFF" className="h-[32px]" />
              </div>
              <p className="mt-4 text-white/70 text-[13.5px] max-w-[320px] leading-relaxed">
                Premium enterprise AI consulting, agentic automation, and intelligent systems from Garage to Foundry to Factory.
              </p>
              <div className="mt-6 max-w-[320px]">
                <h4 className="text-white text-[13px] font-semibold uppercase tracking-wider">Newsletter</h4>
                <div className="mt-1 h-[1px] w-[50px] bg-gradient-to-r from-red-600 to-black" />
                <p className="mt-2 text-white/50 text-[12px]">Subscribe to our weekly enterprise briefing. Benchmarks & architectures.</p>
                {sub ? (
                  <div className="mt-3 text-emerald-400 text-[12px]">✓ Subscription simulated. (FastAPI integration coming soon)</div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if (email) { setSub(true); setEmail(""); } }} className="mt-3 flex gap-2">
                    <input type="email" placeholder="enterprise@company.com" aria-label="Email address for newsletter" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-white focus:border-[#009DFF] flex-grow" />
                    <button type="submit" aria-label="Subscribe to newsletter" className="bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg">Join</button>
                  </form>
                )}
              </div>
            </div>
          </div>
          {footerCols.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h3 className="text-white text-[16px] font-semibold">{col.title}</h3>
              <div className="mt-1.5 h-[1px] w-[60px] bg-gradient-to-r from-red-600 to-black" />
              <div className="mt-4 space-y-2 text-[13px]">
                {col.items.map((it) => (
                  <Link key={it.n} href={it.h} className="block text-white/60 hover:text-[#009DFF] transition-colors">{it.n}</Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col">
            <h3 className="text-white text-[16px] font-semibold">Contact</h3>
            <div className="mt-1.5 h-[1px] w-[60px] bg-gradient-to-r from-red-600 to-black" />
            <div className="mt-4 space-y-3 text-white/60 text-[13px]">
              <p className="flex items-center gap-2">
                <MdEmail className="text-[#009DFF]" />
                <a href="mailto:contact@gff.ai" className="hover:text-white">contact@gff.ai</a>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#009DFF]" />
                <span>+1 (800) 555-GFF-AI</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-white/40 text-[11.5px]">
        © 2026 GFF AI. All Rights Reserved. Enterprise Grade Artificial Intelligence.
      </div>
    </footer>
  );
}
