"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function ROICalculatorPage() {
  const [size, setSize] = useState(250);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(65);
  const [invest, setInvest] = useState(35000);

  const annualHours = Math.round(size * hours * 52 * 0.85);
  const grossSavings = annualHours * rate;
  const netSavings = Math.max(0, grossSavings - invest);
  const roi = invest > 0 ? Math.round((netSavings / invest) * 100) : 0;

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="Operational ROI Calculator"
        description="Quantify structural cost reductions, productivity reclaimed, and net financial ROI of deploying autonomous agent fleets."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders */}
        <div className="lg:col-span-6 space-y-6 p-6 rounded-2xl border border-white/10 bg-[#04060b]">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Financial Model Variables</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Enterprise Team Size</span>
              <span className="text-[#E4000F] font-bold">{size} Employees</span>
            </div>
            <input type="range" min="10" max="1000" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[#E4000F]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Weekly Process Hours/Employee Reclaimed</span>
              <span className="text-[#E4000F] font-bold">{hours} Hours</span>
            </div>
            <input type="range" min="2" max="20" step="1" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-[#E4000F]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Blended Hourly Labor Cost</span>
              <span className="text-[#E4000F] font-bold">${rate}/Hour</span>
            </div>
            <input type="range" min="25" max="150" step="5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[#E4000F]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Annual GFF Licensing & Sandbox Investment</span>
              <span className="text-[#E4000F] font-bold">${invest.toLocaleString()}</span>
            </div>
            <input type="range" min="15000" max="150000" step="5000" value={invest} onChange={(e) => setInvest(Number(e.target.value))} className="w-full accent-[#E4000F]" />
          </div>
        </div>

        {/* Outputs */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#050101] flex flex-col justify-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">Annual Labor Saved</span>
            <span className="text-2xl font-bold text-white mt-1.5">{annualHours.toLocaleString()} Hrs</span>
          </div>
          <div className="p-5 rounded-2xl border border-white/10 bg-[#050101] flex flex-col justify-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">Gross Productivity Value</span>
            <span className="text-2xl font-bold text-[#00FF9D] mt-1.5">${grossSavings.toLocaleString()}</span>
          </div>
          <div className="p-5 rounded-2xl border border-white/10 bg-[#050101] flex flex-col justify-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">Net Annual Cost Savings</span>
            <span className="text-2xl font-bold text-[#009DFF] mt-1.5">${netSavings.toLocaleString()}</span>
          </div>
          <div className="p-5 rounded-2xl border border-white/10 bg-[#050101] flex flex-col justify-center">
            <span className="text-xs text-white/40 uppercase tracking-wider">Projected Investment ROI</span>
            <span className="text-2xl font-bold text-[#E4000F] mt-1.5">{roi}%</span>
          </div>
          <div className="col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/50">
            Model calculations assume 85% multi-agent task execution efficiency over 52 standard operating business weeks.
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}
