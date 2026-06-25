"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import WorldMap from "@/components/ui/world-map";

const presenceDots = [
  { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 51.5074, lng: -0.1278 } },
  { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 12.9716, lng: 77.5946 } },
  { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 40.7128, lng: -74.0060 } },
  { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 25.2048, lng: 55.2708 } },
  { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: -33.8688, lng: 151.2093 } },
];

const hubs = [
  { id: "sg", name: "Singapore", role: "Global Headquarters", desc: "Central governance, IP custody, and core platform development steering.", spec: "Strategic Orchestration", color: "#F74539", badge: "HQ" },
  { id: "ldn", name: "London, UK", role: "Client Innovation Centre", desc: "Sovereign deployment planning, secure client sandboxes, and advisory.", spec: "Client Co-Innovation", color: "#E98828", badge: "CIC" },
  { id: "ind", name: "India", role: "AI Engineering Factory", desc: "Industrialized continuous model training and automated build pipelines.", spec: "Build Shop & Dev", color: "#0186E4", badge: "BUILD" },
];

const futures = [
  { name: "United States", spec: "North America Node", desc: "Future sovereign cloud cluster for localized North American workloads.", color: "#9D00FF" },
  { name: "Middle East", spec: "Sovereign AI Node", desc: "Future high-performance regional cluster addressing sovereign computing compliance.", color: "#10B981" },
  { name: "Australia", spec: "APAC Edge Node", desc: "Planned secure edge node supporting low-latency localized inference executions.", color: "#EC4899" },
];

export default function GlobalPresenceSection() {
  const [active, setActive] = useState("sg");
  const activeHub = hubs.find((h) => h.id === active) || hubs[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-[#010101] px-6 lg:px-16 lg:py-24 py-16 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#009DFF]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={<h2 className="text-[28px] sm:text-[36px] leading-none font-semibold text-center uppercase text-white tracking-wide">GLOBAL <span className="text-[#009DFF]">PRESENCE</span></h2>}
          titleClassName="text-center" dividerWidthClassName="w-[200px]"
        />
        <p className="mt-4 text-center text-xs sm:text-sm text-white/45 max-w-2xl mx-auto font-medium uppercase tracking-[0.2em] mb-12">
          SECURE BORDERLESS ENTERPRISE AI ARCHITECTURE
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          <div className="xl:col-span-7 flex flex-col justify-between rounded-[24px] border border-white/5 bg-[#030303]/40 p-6 min-h-[400px] lg:min-h-[500px] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 z-10 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="bg-emerald-500 rounded-full h-2 w-2"></span>
                </span>
                <span className="text-emerald-400 font-bold uppercase">SYSTEM STATUS: ONLINE</span>
              </div>
              <div className="text-white/40 uppercase">PEER PROTOCOL: SECURE TUNNEL</div>
            </div>

            <div className="relative flex-1 w-full min-h-[250px] flex items-center justify-center">
              <WorldMap dots={presenceDots} lineColor="#009DFF" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-4 mt-4 z-10 text-[10px] font-mono">
              <div><span className="text-white/30 block mb-0.5">Primary Core</span><span className="text-white font-semibold uppercase">{activeHub.name}</span></div>
              <div><span className="text-white/30 block mb-0.5">Transit Security</span><span className="text-white/70 font-semibold">AES-256-GCM</span></div>
              <div><span className="text-white/30 block mb-0.5">Topology</span><span className="text-emerald-400 font-semibold uppercase">ACTIVE PEER GRID</span></div>
              <div><span className="text-white/30 block mb-0.5">Latency SLA</span><span className="text-[#009DFF] font-semibold">OPTIMIZED</span></div>
            </div>
          </div>

          <div className="xl:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50">PRIMARY OPERATIONAL HUBS</h3>
                <span className="text-[10px] font-mono text-[#009DFF] bg-[#009DFF]/10 px-2 py-0.5 rounded-md font-bold">ACTIVE</span>
              </div>

              <div className="space-y-2.5">
                {hubs.map((hub) => {
                  const isActive = active === hub.id;
                  return (
                    <div
                      key={hub.id}
                      onClick={() => setActive(hub.id)}
                      onMouseEnter={() => setActive(hub.id)}
                      className={`cursor-pointer rounded-[20px] p-[1px] transition-all duration-300 ${isActive ? "bg-gradient-to-r from-white/15 to-white/5 shadow-lg" : "bg-transparent"}`}
                    >
                      <div className={`rounded-[19px] p-4 transition-all duration-500 relative overflow-hidden ${isActive ? "bg-[#060606]" : "bg-[#030303]/40 border border-white/5 hover:border-white/10"}`}>
                        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: isActive ? hub.color : "transparent" }} />
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 pl-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white tracking-wide">{hub.name}</h4>
                              <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border" style={{ color: hub.color, borderColor: `${hub.color}25`, backgroundColor: `${hub.color}05` }}>{hub.badge}</span>
                            </div>
                            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{hub.role}</p>
                          </div>
                          <span className="relative flex h-2 w-2 mt-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: hub.color }}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: hub.color }}></span>
                          </span>
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <p className="mt-3 text-xs text-white/60 leading-relaxed pl-1 border-l border-white/5">{hub.desc}</p>
                              <div className="mt-3.5 flex items-center gap-1.5 text-[10px] font-mono pl-1 text-white/50 pt-2 border-t border-white/[0.03]">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hub.color }} />
                                {hub.spec}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40">FUTURE EXPANSION & LOCALIZATION</h3>
                <span className="text-[10px] font-mono text-[#9D00FF] bg-[#9D00FF]/10 px-2 py-0.5 rounded-md font-bold">PLANNING</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {futures.map((region) => (
                  <div key={region.name} className="group relative rounded-[18px] border border-white/5 bg-[#030303]/20 hover:bg-[#030303]/60 hover:border-white/10 p-4 transition-all duration-300 flex flex-col justify-between min-h-[110px]">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#009DFF] transition-colors">{region.name}</h4>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#9D00FF] transition-colors" />
                      </div>
                      <p className="text-[10px] font-mono text-white/30 group-hover:text-white/50 mb-2">{region.spec}</p>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-light">{region.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
