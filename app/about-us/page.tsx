"use client";

import { useState } from "react";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";

const navItems = [
  { label: "Home", href: "/landing_page#home" },
  { label: "Capabilities", href: "/landing_page#capabilities" },
  { label: "Industries", href: "/landing_page#industries" },
  { label: "Company", href: "/landing_page#contact" },
];

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#010101] text-white overflow-x-hidden">
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-[84px] bg-black/60 backdrop-blur-[20px] border-b border-white/5 flex items-center justify-between px-6 lg:px-16">
          <Link href="/landing_page#home" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              src="/footer/logo.svg"
              alt="GFF AI"
              className="w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] object-contain"
            />

            <div className="flex flex-col">
              <div className="text-white text-[22px] sm:text-[28px] leading-[24px] sm:leading-[30px] font-semibold tracking-[0.02em]">
                GFF AI
              </div>

              <div className="flex items-center gap-[4px] sm:gap-[6px] text-[8px] sm:text-[11px] leading-[12px] sm:leading-[14px] font-bold tracking-[0.08em]">
                <span className="text-[#E4000F]">GARAGE</span>
                <span className="text-white">|</span>
                <span className="text-white">FOUNDRY</span>
                <span className="text-white">|</span>
                <span className="text-[#009DFF]">FACTORY</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-[55px] text-white absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white text-[16px] leading-[24px] font-medium cursor-pointer hover:text-red-400 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <a
            href="/landing_page#contact"
            className="hidden md:flex w-[207px] h-[48px] items-center justify-center rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 shrink-0 text-center"
            style={{
              background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
            }}
          >
            Book a Consultation
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-[6px] cursor-pointer"
          >
            <span className="w-[34px] h-[4px] bg-white rounded-full" />
            <span className="w-[34px] h-[4px] bg-white rounded-full" />
            <span className="w-[34px] h-[4px] bg-white rounded-full" />
          </button>
        </header>

        {isMenuOpen && (
          <div
            className="fixed inset-0 z-[999] md:hidden bg-black/65"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="absolute left-0 right-0 bottom-0 h-auto rounded-t-[28px] bg-[#050505] px-6 pt-6 pb-8 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div>
                  <p className="text-white text-[18px] font-semibold">GFF AI</p>
                  <p className="text-white/50 text-[13px]">Navigation Menu</p>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white text-[34px] leading-none cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-4 border-b border-white/10 text-white/80 text-[18px] leading-[24px] font-semibold text-left hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/landing_page#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-6 w-full h-[56px] rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer flex items-center justify-center text-center"
                  style={{
                    background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
                  }}
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>
        )}

        <section className="pt-[84px]">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,157,255,0.12),_transparent_45%),linear-gradient(180deg,#090909_0%,#010101_100%)]" />
            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-16 py-20 lg:py-28">
              <div className="max-w-[920px]">
                <p className="text-[#408CFF] text-[16px] sm:text-[18px] font-semibold tracking-[0.22em] uppercase">
                  About Us
                </p>
                <h1 className="mt-4 text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.95] font-semibold">
                  Building enterprise AI with the same precision we bring to
                  every product experience.
                </h1>
                <p className="mt-6 max-w-[780px] text-white/75 text-[16px] sm:text-[18px] leading-[30px]">
                  We help teams move from idea to execution with practical AI
                  systems, thoughtful automation, and a design approach that
                  stays usable at enterprise scale.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Strategy",
                    desc: "We align business goals, operating models, and AI opportunities before anything is built.",
                  },
                  {
                    title: "Delivery",
                    desc: "Our team focuses on shipping interfaces and workflows that feel polished and dependable.",
                  },
                  {
                    title: "Scale",
                    desc: "We design systems that can grow with the enterprise without losing clarity or speed.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px]"
                  >
                    <h2 className="text-white text-[24px] font-semibold">
                      {item.title}
                    </h2>
                    <p className="mt-4 text-white/70 text-[15px] leading-[28px]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactSection />

        <footer className="w-full mt-0 bg-black">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14">
            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr_1fr_1.2fr] gap-12">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/footer/logo.svg"
                    alt="Logo"
                    className="h-[55px] w-auto object-contain"
                  />

                  <img
                    src="/footer/text.png"
                    alt="GFF AI"
                    className="h-[32px] w-auto object-contain"
                  />
                </div>

                <p className="mt-6 text-white/70 text-[14px] leading-8 max-w-[380px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s.
                </p>

                <div className="flex items-center gap-3 mt-8 text-white text-xl">
                  {[
                    { src: "/footer/linkedin.png", alt: "LinkedIn" },
                    { src: "/footer/twitter.png", alt: "Twitter" },
                    { src: "/footer/mail.png", alt: "Mail" },
                    { src: "/footer/youtube.png", alt: "YouTube" },
                    { src: "/footer/instagram.png", alt: "Instagram" },
                  ].map((icon) => (
                    <button
                      key={icon.alt}
                      type="button"
                      aria-label={icon.alt}
                      title={icon.alt}
                      className="group inline-flex h-10 w-10 items-center justify-center text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95 cursor-pointer"
                    >
                      <img
                        src={icon.src}
                        alt={icon.alt}
                        className="h-5 w-5 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {[
                {
                  title: "Information",
                  items: [
                    "Responsible AI",
                    "Careers",
                    "Resources",
                    "About Us",
                    "Contact Us",
                    "Privacy Policy",
                    "Terms & Conditions",
                  ],
                },
                {
                  title: "Service",
                  items: [
                    "AI Chips",
                    "Authentication",
                    "Edtech",
                    "Femtech",
                    "TravelTech",
                    "Proptech",
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h3 className="text-white text-[28px] font-semibold">
                    {col.title}
                  </h3>

                  <div
                    className="mt-[10px] h-[1px] w-[149px]"
                    style={{
                      background:
                        "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                    }}
                  />

                  <div className="mt-[34px] space-y-[18px] text-[14px]">
                    {col.items.map((item) => (
                      item === "About Us" ? (
                        <Link
                          key={item}
                          href="/about-us"
                          className="block text-white/70 hover:text-white transition-colors duration-300 cursor-pointer text-left"
                        >
                          {item}
                        </Link>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className="block text-white/70 hover:text-white transition-colors duration-300 cursor-pointer text-left"
                        >
                          {item}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="text-white text-[28px] font-semibold">
                  Contact Info
                </h3>

                <div
                  className="mt-[10px] h-[1px] w-[149px]"
                  style={{
                    background:
                      "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-5 text-center text-white/60 text-[13px]">
            © 2026 GFF AI All Rights Reserved
          </div>
        </footer>
      </div>
    </main>
  );
}
