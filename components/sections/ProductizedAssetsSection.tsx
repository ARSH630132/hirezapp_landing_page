"use client";

import Image from "next/image";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { pageFadeVariants } from "@/lib/animations";
import { productizedColumns, productizedFeatures } from "@/lib/landing-data";

const productizedTags = ["Agent-ready", "Governed", "Composable", "Enterprise scale"];

const blueprintLabels = [
  ["left-[8%] top-[12%]", "AI workflow"],
  ["right-[8%] top-[16%]", "Governance"],
  ["left-[10%] bottom-[12%]", "Runtime"],
  ["right-[10%] bottom-[12%]", "Scale"],
] as const;

const featureAccents = [
  "from-[#FF5F6D] to-[#FFD36D]",
  "from-[#7C5CFF] to-[#29B7FF]",
  "from-[#24D39B] to-[#7DDEFF]",
  "from-[#FF7A59] to-[#FFB84A]",
];

export default function ProductizedAssetsSection() {
  return (
    <motion.section
      id="productized-assets"
      className="w-full px-6 lg:px-16 py-12 lg:py-20"
      variants={pageFadeVariants}
    >
      <div className="max-w-[1795px] mx-auto">
        <SectionHeading
          title={
            <h2 className="text-white text-[24px] sm:text-[30px] leading-none font-medium uppercase text-center">
              PRODUCTIZED ASSETS
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[200px]"
        />

        <p className="mt-5 mx-auto max-w-[880px] text-center text-white/68 text-[15px] sm:text-[17px] leading-[28px]">
          Practical tools and repeatable systems that help teams move from idea to delivery with less friction and more confidence.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {productizedTags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] text-white/76">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {productizedFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex h-full flex-col rounded-[20px] border border-[#18223C] bg-[linear-gradient(180deg,rgba(8,12,24,0.95)_0%,rgba(3,6,14,0.98)_100%)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_0_24px_rgba(41,183,255,0.1)]"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br ${featureAccents[index]}`}>
                  <Icon className="h-5 w-5 text-[#07111D]" />
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-[24px] text-white/66">{item.desc}</p>
                <span className="mt-5 text-[13px] font-medium text-[#8DC6FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="relative overflow-hidden rounded-[24px] border border-[#18223C] bg-[radial-gradient(circle_at_top,rgba(16,213,255,0.14),transparent_48%),linear-gradient(180deg,rgba(4,9,20,0.96)_0%,rgba(2,4,10,1)_100%)] p-6 lg:col-span-5 min-h-[360px] lg:min-h-0 flex items-center justify-center">
            <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[#29B7FF]/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,213,255,0.12)_0%,transparent_62%)]" />
            <div className="relative w-full max-w-[360px] aspect-square">
              <div className="absolute inset-10 rounded-full bg-[#10D5FF]/20 blur-3xl" />
              {blueprintLabels.map(([pos, label]) => (
                <div
                  key={label}
                  className={`absolute ${pos} rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] text-white/80 backdrop-blur-md`}
                >
                  {label}
                </div>
              ))}
              <Image
                src="/intellegent_enterprise/blueprint.png"
                alt="Productized assets blueprint"
                width={840}
                height={840}
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_26px_rgba(16,213,255,0.34)]"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="rounded-[20px] border border-[#18223C] bg-[linear-gradient(180deg,rgba(7,12,28,0.94)_0%,rgba(3,6,14,0.98)_100%)] px-5 py-4">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#8DC6FF]">Platform layers</p>
              <h3 className="mt-1 text-[22px] font-semibold text-white">Core capabilities and building blocks</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              {productizedColumns.map((column) => {
                const Icon = column.icon;
                return (
                  <div
                    key={column.title}
                    className="flex h-full flex-col rounded-[20px] border border-white/8 bg-[#0A0F1F] p-5 transition-all duration-300 hover:border-white/15 hover:bg-[#0D1324]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/5">
                        <Icon className="h-5 w-5 text-[#8DC6FF]" />
                      </div>
                      <h3 className="text-[15px] font-semibold uppercase text-white">{column.title}</h3>
                    </div>
                    <div className="mt-4 h-px w-full bg-white/10" />
                    <ul className="mt-4 space-y-3 text-[14px] leading-[22px] font-medium text-white/84">
                      {column.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#29B7FF]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
