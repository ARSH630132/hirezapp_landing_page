"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ToolPageShell, ToolHero } from "@/components/build/components";

type Priority =
  | "cost_reduction"
  | "compliance_security"
  | "operational_speed"
  | "customer_experience"
  | "decision_automation";

export default function ROICalculatorPage() {
  // 1. STATE & PARAMETERS
  const [teamSize, setTeamSize] = useState<number>(120);
  const [avgHourlyRate, setAvgHourlyRate] = useState<number>(85);
  const [inefficientHoursPerWeek, setInefficientHoursPerWeek] = useState<number>(8);
  const [initialInvestment, setInitialInvestment] = useState<number>(250000);
  const [priority, setPriority] = useState<Priority>("cost_reduction");
  const [copied, setCopied] = useState(false);

  // 2. FORMULAS & DETERMINISTIC CALCULATIONS
  const totalWastedHoursPerYear = teamSize * inefficientHoursPerWeek * 52;
  const totalWastedCostPerYear = totalWastedHoursPerYear * avgHourlyRate;

  // Expected GFF Case (85% efficiency recovery)
  const expectedAdoptionFactor = 0.85;
  const expectedHoursSaved = Math.round(totalWastedHoursPerYear * expectedAdoptionFactor);
  const expectedGrossSavings = expectedHoursSaved * avgHourlyRate;
  const expectedNetSavings = Math.max(0, expectedGrossSavings - initialInvestment);
  const expectedRoi = initialInvestment > 0 ? Math.round((expectedNetSavings / initialInvestment) * 100) : 0;
  
  const expectedMonthlySavings = expectedGrossSavings / 12;
  const expectedPaybackMonths = expectedMonthlySavings > 0 
    ? Math.max(0.1, Math.round((initialInvestment / expectedMonthlySavings) * 10) / 10) 
    : 0;

  // Conservative Case (50% efficiency recovery)
  const conservativeAdoptionFactor = 0.50;
  const conservativeHoursSaved = Math.round(totalWastedHoursPerYear * conservativeAdoptionFactor);
  const conservativeGrossSavings = conservativeHoursSaved * avgHourlyRate;
  const conservativeNetSavings = Math.max(0, conservativeGrossSavings - initialInvestment);
  const conservativeRoi = initialInvestment > 0 ? Math.round((conservativeNetSavings / initialInvestment) * 100) : 0;
  
  const conservativeMonthlySavings = conservativeGrossSavings / 12;
  const conservativePaybackMonths = conservativeMonthlySavings > 0 
    ? Math.max(0.1, Math.round((initialInvestment / conservativeMonthlySavings) * 10) / 10) 
    : 0;

  // Aggressive Case (120% efficiency recovery due to synergistic agent multipliers)
  const aggressiveAdoptionFactor = 1.20;
  const aggressiveHoursSaved = Math.round(totalWastedHoursPerYear * aggressiveAdoptionFactor);
  const aggressiveGrossSavings = aggressiveHoursSaved * avgHourlyRate;
  const aggressiveNetSavings = Math.max(0, aggressiveGrossSavings - initialInvestment);
  const aggressiveRoi = initialInvestment > 0 ? Math.round((aggressiveNetSavings / initialInvestment) * 100) : 0;
  
  const aggressiveMonthlySavings = aggressiveGrossSavings / 12;
  const aggressivePaybackMonths = aggressiveMonthlySavings > 0 
    ? Math.max(0.1, Math.round((initialInvestment / aggressiveMonthlySavings) * 10) / 10) 
    : 0;

  // 3. PRIORITIES METADATA
  const priorities = [
    {
      id: "cost_reduction" as Priority,
      title: "Cost Elimination",
      desc: "Remove manual operational overhead & SaaS redundancies.",
      color: "#E4000F",
      bgHex: "rgba(228, 0, 15, 0.08)"
    },
    {
      id: "compliance_security" as Priority,
      title: "Sovereign Compliance",
      desc: "Deploy zero-retention audits & policy guards.",
      color: "#00FF9D",
      bgHex: "rgba(0, 255, 157, 0.08)"
    },
    {
      id: "operational_speed" as Priority,
      title: "Operational Velocity",
      desc: "Shrink multi-day approvals into sub-second cycles.",
      color: "#009DFF",
      bgHex: "rgba(0, 157, 255, 0.08)"
    },
    {
      id: "customer_experience" as Priority,
      title: "Client Intimacy",
      desc: "Scale tailored conversational context air-gapped.",
      color: "#9D00FF",
      bgHex: "rgba(157, 0, 255, 0.08)"
    },
    {
      id: "decision_automation" as Priority,
      title: "Cognitive Autonomy",
      desc: "Delegate continuous ledger audit to multi-agent DAGs.",
      color: "#F59E0B",
      bgHex: "rgba(245, 158, 11, 0.08)"
    }
  ];

  const currentPriorityObj = priorities.find(p => p.id === priority) || priorities[0];

  // 4. HELPERS
  const formatCompactCurrency = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return `${num}`;
  };

  const formatPayback = (months: number) => {
    if (months <= 0) return "Instant";
    if (months < 1) return "Within 1 Month";
    return `${months} Months`;
  };

  // 5. COPY TO CLIPBOARD ACTION
  const handleCopyReport = () => {
    const reportMd = `# GFF AI // SOVEREIGN ROI SIMULATION REPORT
Generated: ${new Date().toLocaleDateString()}
Status: MODELLED - ILLUSTRATIVE ONLY

## I. SIMULATION PARAMETERS (INPUTS)
- Target Workforce Size: ${teamSize} Analysts/Workers
- Average Hourly Labor Rate: ${avgHourlyRate}/hr
- Inefficient Hours Per Week: ${inefficientHoursPerWeek} hrs
- Initial CapEx Allocation: ${initialInvestment.toLocaleString()}
- Strategic Priority: ${currentPriorityObj.title} (${priority.toUpperCase()})

## II. KEY RECOVERY METRICS (EXPECTED EXPECTED CASE)
- Illustrative Annual Efficiency Opportunity: ${expectedGrossSavings.toLocaleString()}
- Estimated Annual Labor Hours Saved: ${expectedHoursSaved.toLocaleString()} hours
- Amortization / Payback Period: ${formatPayback(expectedPaybackMonths)}
- Net Sovereign Return on Investment: ${expectedRoi}%

## III. SCENARIO COMPARISON MATRIX
- CONSERVATIVE CASE (50% Adoption):
  * Annual Saved Hours: ${conservativeHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: ${conservativeGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(conservativePaybackMonths)}
- EXPECTED CASE (85% Adoption - GFF Target):
  * Annual Saved Hours: ${expectedHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: ${expectedGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(expectedPaybackMonths)}
- AGGRESSIVE CASE (120% Adoption - Synergy Multiplier):
  * Annual Saved Hours: ${aggressiveHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: ${aggressiveGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(aggressivePaybackMonths)}

## IV. WATERFALL ALLOCATION & VALUE DRIFT
- Initial Operational Friction Loss: ${totalWastedCostPerYear.toLocaleString()}/yr
- GFF Sovereign Reclaimed Value (Expected): -${expectedGrossSavings.toLocaleString()}/yr
- Initial CapEx Enclave Allocation: +${initialInvestment.toLocaleString()}
- Net Annual Sovereign Dividend: ${expectedNetSavings.toLocaleString()}/yr

* DISCLAIMER: All figures are generated for strategic modeling purposes based on software formulas and illustrative assumptions. They do not constitute binding financial, commercial, or operational guarantees.`;

    navigator.clipboard.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 6. RESET ACTION
  const handleReset = () => {
    setTeamSize(120);
    setAvgHourlyRate(85);
    setInefficientHoursPerWeek(8);
    setInitialInvestment(250000);
    setPriority("cost_reduction");
  };

  return (
    <ToolPageShell showContact={true}>
      <ToolHero
        category="FINANCIAL ENGINEERING CORE"
        title="Sovereign ROI Calculator"
        highlightedWord="ROI"
        description="Quantify the fiscal impact, cognitive hours reclaimed, and capital amortization curves achieved by shifting legacy operational friction to GFF secure multi-agent systems."
        metricLabel="MODEL VERSION"
        metricValue="V2.6-SOVEREIGN"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 backdrop-blur-md space-y-6 relative group overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#009DFF]/40 to-transparent pointer-events-none" />
            
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">VARIABLE CONTEXT PANEL</span>
              <h2 className="text-sm font-bold text-white mt-1">Configure Local Inputs</h2>
            </div>

            {/* Variable 1: Team Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="teamSize-input" className="text-white/60 font-mono text-[10px] uppercase cursor-pointer">
                  Workforce Size
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="teamSize-input"
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-16 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                  />
                  <span className="text-white/40 font-mono text-[9px]">FTE</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-light leading-relaxed">
                The number of analysts, operations agents, or specialists engaged in manual workflows.
              </p>
              <input
                id="teamSize-slider"
                aria-label="Workforce Size range slider"
                type="range"
                min="5"
                max="5000"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
              />
            </div>

            {/* Variable 2: Hourly Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="avgHourlyRate-input" className="text-white/60 font-mono text-[10px] uppercase cursor-pointer">
                  Avg Hourly Labor Rate
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-white/40 font-mono text-[10px]">$</span>
                  <input
                    id="avgHourlyRate-input"
                    type="number"
                    value={avgHourlyRate}
                    onChange={(e) => setAvgHourlyRate(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-16 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                  />
                  <span className="text-white/40 font-mono text-[9px]">/ HR</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-light leading-relaxed">
                Fully loaded wage of targeted workforce, including operations, benefits, and tools.
              </p>
              <input
                id="avgHourlyRate-slider"
                aria-label="Avg Hourly Labor Rate range slider"
                type="range"
                min="15"
                max="350"
                step="5"
                value={avgHourlyRate}
                onChange={(e) => setAvgHourlyRate(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
              />
            </div>

            {/* Variable 3: Inefficient Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="inefficientHours-input" className="text-white/60 font-mono text-[10px] uppercase cursor-pointer">
                  Wasted Hours per FTE / Wk
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="inefficientHours-input"
                    type="number"
                    value={inefficientHoursPerWeek}
                    onChange={(e) => setInefficientHoursPerWeek(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                  />
                  <span className="text-white/40 font-mono text-[9px]">HRS</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-light leading-relaxed">
                Average hours wasted per week per analyst on compliance paperwork, manual audit, or waiting.
              </p>
              <input
                id="inefficientHours-slider"
                aria-label="Wasted Hours per FTE / Wk range slider"
                type="range"
                min="1"
                max="40"
                step="1"
                value={inefficientHoursPerWeek}
                onChange={(e) => setInefficientHoursPerWeek(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
              />
            </div>

            {/* Variable 4: Initial CapEx */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="initialInvestment-input" className="text-white/60 font-mono text-[10px] uppercase cursor-pointer">
                  Initial CapEx Allocation
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-white/40 font-mono text-[10px]">$</span>
                  <input
                    id="initialInvestment-input"
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-light leading-relaxed">
                Anticipated infrastructure setup cost, licensing fee, and engineering resource alignment for GFF enclaves.
              </p>
              <input
                id="initialInvestment-slider"
                aria-label="Initial CapEx Allocation range slider"
                type="range"
                min="5000"
                max="1500000"
                step="5000"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
              />
            </div>

            {/* Strategic Priorities Selection Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-white/60 font-mono text-[10px] uppercase block">Strategic Core Objective</span>
              <div className="grid grid-cols-1 gap-2">
                {priorities.map((item) => {
                  const isActive = item.id === priority;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPriority(item.id)}
                      type="button"
                      className={`relative text-left p-2.5 rounded-lg border transition-all text-xs flex items-start gap-3 overflow-hidden ${
                        isActive
                          ? "border-white/20 text-white"
                          : "border-white/5 bg-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.01]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePriorityBg"
                          className="absolute inset-0 bg-white/[0.03] -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="relative z-10">
                        <span className={`font-semibold block text-[11px] ${isActive ? "text-white" : "text-white/70"}`}>
                          {item.title}
                        </span>
                        <span className="text-[9px] text-white/40 block leading-tight font-light mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footnote Compliance Panel */}
          <div className="p-4 rounded-xl border border-white/5 bg-[#030305]/40 text-[10px] text-white/30 space-y-2 leading-relaxed">
            <span className="font-mono text-[#009DFF] font-bold block uppercase tracking-wider">SECURE SHIELD COMPLIANCE</span>
            <p>
              This simulator processes data points purely inside local volatile browser memory. It adheres to the GFF AI zero-retention mandate. No telemetry is logged outside your sandboxed session.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Console */}
        <div className="lg:col-span-8 space-y-8 text-white">
          {/* Section A: Main Telemetry Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF9D]/30 to-transparent" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">ANNUAL EFFICIENCY GAP</span>
                  <span className="text-[8px] font-mono font-bold bg-[#00FF9D]/10 text-[#00FF9D] px-1 rounded uppercase tracking-widest">MODELLED</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold text-[#00FF9D] block mt-2 font-mono tracking-tight">
                  {formatCompactCurrency(expectedGrossSavings)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-4 border-t border-white/5 pt-2">
                Illustrative recouped cost based on expected 85% workforce velocity optimization.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/30 to-transparent" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">RECLAIMED ANNUAL CAPACITY</span>
                  <span className="text-[8px] font-mono font-bold bg-[#009DFF]/10 text-[#009DFF] px-1 rounded uppercase tracking-widest">MODELLED</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold text-[#009DFF] block mt-2 font-mono tracking-tight">
                  {expectedHoursSaved.toLocaleString()} Hrs
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-4 border-t border-white/5 pt-2">
                Equivalent full-time hours returned to strategic initiatives rather than administrative friction.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">CAPITAL AMORTIZATION</span>
                  <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 px-1 rounded uppercase tracking-widest">MODELLED</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold text-amber-400 block mt-2 font-mono tracking-tight">
                  {formatPayback(expectedPaybackMonths)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-4 border-t border-white/5 pt-2">
                The computed timeframe before recouped hours balance the initial CapEx allocation.
              </p>
            </div>
          </div>

          {/* Section B: Payback-Style Strategic Narrative */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/80 backdrop-blur-sm space-y-4">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">EXECUTIVE EVALUATION SUMMARY // {currentPriorityObj.title.toUpperCase()} TARGET</span>
            <div className="space-y-3">
              <p className="text-sm lg:text-base text-white/80 font-light leading-relaxed">
                By deploying the GFF sovereign agent network across your <span className="font-semibold text-white">{teamSize} FTE</span> workforce footprint, the organization is projected to achieve an illustrative Net Sovereign Return of <span className="text-[#00FF9D] font-mono font-bold">{expectedRoi}%</span>. The model indicates full amortization completes <span className="text-white font-semibold">{formatPayback(expectedPaybackMonths).toLowerCase()}</span>, establishing an air-gapped margin optimization boundary.
              </p>
              <p className="text-xs text-white/50 font-light leading-relaxed">
                Under the strategic lens of <span className="font-semibold text-[#009DFF]">{currentPriorityObj.title}</span>, GFF's multi-agent hierarchies eliminate repetitive operational loops to reclaim <span className="text-white font-semibold font-mono">{expectedHoursSaved.toLocaleString()} hours</span> of analytical runway per year. Telemetry is securely validated on single-tenant enclaves, reducing audit and speed friction to zero.
              </p>
            </div>
          </div>

          {/* Section C: Pure CSS/SVG Waterfall Chart */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/20 to-transparent" />
            <div className="flex justify-between items-baseline border-b border-white/5 pb-4 mb-4">
              <div>
                <span className="text-[9px] font-mono text-[#009DFF] font-bold block uppercase tracking-wider">VALUE CONSTRUCT MATRIX</span>
                <h3 className="text-sm font-bold text-white mt-1">Sovereign Financial Value Waterfall Chart</h3>
              </div>
              <span className="text-[9px] font-mono text-white/30 hidden md:inline">UNIT: USD ($) // ANNUALIZED MODEL</span>
            </div>
            <div className="w-full">
              <svg viewBox="0 0 720 230" className="w-full h-auto overflow-visible select-none" fill="none">
                <line x1="30" y1="20" x2="690" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="30" y1="70" x2="690" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="120" x2="690" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="170" x2="690" y2="170" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="200" x2="690" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                {(() => {
                  const maxAmt = Math.max(totalWastedCostPerYear, expectedGrossSavings, initialInvestment, expectedNetSavings, 1);
                  const getY = (v: number) => 200 - (v / maxAmt) * 160;
                  const getH = (v: number) => (v / maxAmt) * 160;
                  const b1Y = getY(totalWastedCostPerYear), b1H = getH(totalWastedCostPerYear);
                  const b2H = getH(expectedGrossSavings), b2Y = b1Y;
                  const b3H = getH(initialInvestment), b3Y = b2Y + b2H - b3H;
                  const b4Y = getY(expectedNetSavings), b4H = getH(expectedNetSavings);
                  return (
                    <>
                      <line x1="120" y1={b1Y} x2="210" y2={b2Y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="290" y1={b2Y+b2H} x2="380" y2={b3Y+b3H} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="460" y1={b3Y} x2="550" y2={b4Y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <g>
                        <rect x="50" y={b1Y} width="70" height={b1H} rx="3" fill="url(#fG)" stroke="rgba(255,255,255,0.05)" />
                        <text x="85" y={Math.max(b1Y-8,15)} textAnchor="middle" className="fill-white/80 font-mono text-[10px] font-bold">{formatCompactCurrency(totalWastedCostPerYear)}</text>
                      </g>
                      <g>
                        <rect x="220" y={b2Y} width="70" height={b2H} rx="3" fill="url(#rG)" stroke="rgba(0,255,157,0.15)" />
                        <text x="255" y={Math.max(b2Y-8,15)} textAnchor="middle" className="fill-[#00FF9D] font-mono text-[10px] font-bold">-{formatCompactCurrency(expectedGrossSavings)}</text>
                      </g>
                      <g>
                        <rect x="390" y={b3Y} width="70" height={b3H} rx="3" fill="url(#cG)" stroke="rgba(228,0,15,0.15)" />
                        <text x="425" y={Math.max(b3Y-8,15)} textAnchor="middle" className="fill-[#E4000F] font-mono text-[10px] font-bold">+{formatCompactCurrency(initialInvestment)}</text>
                      </g>
                      <g>
                        <rect x="560" y={b4Y} width="70" height={b4H} rx="3" fill="url(#nG)" stroke="rgba(0,255,157,0.3)" />
                        <text x="595" y={Math.max(b4Y-8,15)} textAnchor="middle" className="fill-white font-mono text-[11px] font-extrabold">{formatCompactCurrency(expectedNetSavings)}</text>
                      </g>
                    </>
                  );
                })()}
                <defs>
                  <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity="0.2"/><stop offset="100%" stopColor="#fff" stopOpacity="0.03"/></linearGradient>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00FF9D" stopOpacity="0.3"/><stop offset="100%" stopColor="#00FF9D" stopOpacity="0.05"/></linearGradient>
                  <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4000F" stopOpacity="0.3"/><stop offset="100%" stopColor="#E4000F" stopOpacity="0.05"/></linearGradient>
                  <linearGradient id="nG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00FF9D" stopOpacity="0.55"/><stop offset="50%" stopColor="#009DFF" stopOpacity="0.3"/><stop offset="100%" stopColor="#000" stopOpacity="0"/></linearGradient>
                </defs>
              </svg>
              <div className="grid grid-cols-4 gap-2 pt-3 font-mono text-[9px] uppercase tracking-wider text-white/50 text-center border-t border-white/[0.03] mt-2">
                <div>01. Operational Friction</div>
                <div>02. GFF Reclaim</div>
                <div>03. Setup Expense</div>
                <div className="text-white font-bold">04. Sovereign Dividend</div>
              </div>
            </div>
            <p className="text-[9px] text-white/30 font-light italic mt-3 text-center">* All metrics are illustrative based on mathematical models and not performance guarantees.</p>
          </div>

          {/* Section D: Three Scenario Comparisons (Conservative, Expected, Aggressive) */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">DEVIANCE RUNWAY // SCENARIO SIMULATION</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Conservative Scenario Card */}
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 hover:border-white/10 transition flex flex-col justify-between h-full relative group">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-white/35 uppercase">CONSERVATIVE CASE</span>
                    <span className="text-[8px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">50% ADOPTION</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white/80 block font-mono">{formatCompactCurrency(conservativeGrossSavings)}</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Annual Illustrative Opportunity</span>
                  </div>
                  <div className="space-y-1 text-xs pt-2 border-t border-white/[0.03]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Saved Hours:</span>
                      <span className="font-mono text-white/70">{conservativeHoursSaved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Payback:</span>
                      <span className="font-mono text-white/70">{formatPayback(conservativePaybackMonths)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">ROI Net:</span>
                      <span className="font-mono text-white/70">{conservativeRoi}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 font-light leading-relaxed mt-4 pt-2 border-t border-white/5">
                  Models restricted rollout. Limited to basic air-gapped automation nodes with manual approvals.
                </p>
              </div>

              {/* Expected GFF Target Card - Highlighted */}
              <div className="p-5 rounded-2xl border border-[#00FF9D]/20 bg-[#04090b] shadow-[0_0_20px_rgba(0,255,157,0.03)] transition flex flex-col justify-between h-full relative group">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent" />
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-[#00FF9D] font-bold uppercase tracking-wider">EXPECTED COGNITIVE</span>
                    <span className="text-[8px] font-mono text-[#00FF9D] font-bold px-1.5 py-0.5 rounded bg-[#00FF9D]/10 border border-[#00FF9D]/20">85% ADOPTION</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-[#00FF9D] block font-mono tracking-tight">{formatCompactCurrency(expectedGrossSavings)}</span>
                    <span className="text-[9px] text-white/50 block mt-0.5">Annual Illustrative Opportunity</span>
                  </div>
                  <div className="space-y-1 text-xs pt-2 border-t border-[#00FF9D]/10">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Saved Hours:</span>
                      <span className="font-mono text-white font-bold">{expectedHoursSaved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Payback:</span>
                      <span className="font-mono text-[#00FF9D] font-bold">{formatPayback(expectedPaybackMonths)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">ROI Net:</span>
                      <span className="font-mono text-white font-bold">{expectedRoi}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/60 font-light leading-relaxed mt-4 pt-2 border-t border-white/5">
                  GFF Standard. Complete single-tenant VPC deployment with autonomous policy watchdogs.
                </p>
              </div>

              {/* Aggressive Scenario Card */}
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 hover:border-white/10 transition flex flex-col justify-between h-full relative group">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-white/35 uppercase">AGGRESSIVE FLEET</span>
                    <span className="text-[8px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">120% SPEED</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white/80 block font-mono">{formatCompactCurrency(aggressiveGrossSavings)}</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Annual Illustrative Opportunity</span>
                  </div>
                  <div className="space-y-1 text-xs pt-2 border-t border-white/[0.03]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Saved Hours:</span>
                      <span className="font-mono text-white/70">{aggressiveHoursSaved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Payback:</span>
                      <span className="font-mono text-white/70">{formatPayback(aggressivePaybackMonths)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">ROI Net:</span>
                      <span className="font-mono text-white/70">{aggressiveRoi}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 font-light leading-relaxed mt-4 pt-2 border-t border-white/5">
                  Full cross-department multi-agent hierarchy with automated scaling and zero-latency pipelines.
                </p>
              </div>
            </div>
          </div>

          {/* Section E: Interconnected Strategic Elevation Pipeline */}
          <div className="space-y-4 pt-4">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">SOVEREIGN PIPELINE ELEVATION</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <Link href="/build/assessment" className="p-5 rounded-2xl border border-white/5 bg-[#030305] hover:border-[#009DFF]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between min-h-[170px] group text-left">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded bg-[#009DFF]/5 border border-[#009DFF]/15 flex items-center justify-center text-[#009DFF]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#009DFF] transition-colors">Launch Diagnostic Assessor</h4>
                  <p className="text-[10px] text-white/40 font-light leading-relaxed">
                    Evaluate operational legacy bottlenecks, VPC setup, and compliance telemetry scores.
                  </p>
                </div>
                <div className="text-[9px] font-mono text-white/30 pt-3 border-t border-white/5 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>DEPLOY DIAGNOSTIC GATE</span>
                  <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link href="/build/blueprint" className="p-5 rounded-2xl border border-white/5 bg-[#030305] hover:border-[#9D00FF]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between min-h-[170px] group text-left">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded bg-[#9D00FF]/5 border border-[#9D00FF]/15 flex items-center justify-center text-[#9D00FF]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#9D00FF] transition-colors">Launch Blueprint Architect</h4>
                  <p className="text-[10px] text-white/40 font-light leading-relaxed">
                    Graph custom agent topologies and map reclaimed workforce hours directly to multi-agent execution steps.
                  </p>
                </div>
                <div className="text-[9px] font-mono text-white/30 pt-3 border-t border-white/5 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>MODEL AGENT TOPOLOGY</span>
                  <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link href="/build/proposal" className="p-5 rounded-2xl border border-white/5 bg-[#030305] hover:border-[#00FF9D]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between min-h-[170px] group text-left">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded bg-[#00FF9D]/5 border border-[#00FF9D]/15 flex items-center justify-center text-[#00FF9D]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#00FF9D] transition-colors">Launch SOW Proposal Studio</h4>
                  <p className="text-[10px] text-white/40 font-light leading-relaxed">
                    Translate your calculated amortization model instantly into an enterprise-grade Statement of Work.
                  </p>
                </div>
                <div className="text-[9px] font-mono text-white/30 pt-3 border-t border-white/5 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>BUILD PROPOSAL DECK</span>
                  <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform text-[#00FF9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

            </div>
          </div>

          {/* Section F: Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-[#030306]/85 font-mono">
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all text-white/40 cursor-pointer"
            >
              Reset Inputs
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopyReport}
                type="button"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-[#00FF9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
                <span>{copied ? "Report Copied!" : "Copy Markdown Report"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
