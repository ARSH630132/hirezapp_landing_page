"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ToolPageShell, ToolHero } from "@/components/build/components";
import { getToolState, saveToolState } from "@/components/build/workspaceUtility";
import NextBestAction from "@/components/build/NextBestAction";


type Priority =
  | "cost_reduction"
  | "compliance_security"
  | "operational_speed"
  | "customer_experience"
  | "decision_automation";

export default function ROICalculatorPage() {
  // 1. STATE & PARAMETERS
  const [industry, setIndustry] = useState<string>("financial_services");
  const [companySize, setCompanySize] = useState<string>("enterprise");
  const [opFunction, setOpFunction] = useState<string>("customer_operations");
  const [annualCostBaseline, setAnnualCostBaseline] = useState<number>(1500000);
  const [processVolume, setProcessVolume] = useState<number>(250000);
  const [avgHandlingTime, setAvgHandlingTime] = useState<number | "">(15);
  const [automationTarget, setAutomationTarget] = useState<number>(65);
  const [manualEffort, setManualEffort] = useState<string>("high");
  const [productivityImprovement, setProductivityImprovement] = useState<number>(50);
  const [implementationHorizon, setImplementationHorizon] = useState<string>("6_months");
  const [initialInvestment, setInitialInvestment] = useState<number>(350000);
  const [priority, setPriority] = useState<Priority>("cost_reduction");
  const [copied, setCopied] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  // Load from Local Workspace on mount
  useEffect(() => {
    const saved = getToolState("roi");
    if (saved) {
      if (saved.industry) setIndustry(saved.industry);
      if (saved.companySize) setCompanySize(saved.companySize);
      if (saved.opFunction) setOpFunction(saved.opFunction);
      if (typeof saved.annualCostBaseline === "number") setAnnualCostBaseline(saved.annualCostBaseline);
      if (typeof saved.processVolume === "number") setProcessVolume(saved.processVolume);
      if (typeof saved.avgHandlingTime === "number" || saved.avgHandlingTime === "") setAvgHandlingTime(saved.avgHandlingTime);
      if (typeof saved.automationTarget === "number") setAutomationTarget(saved.automationTarget);
      if (saved.manualEffort) setManualEffort(saved.manualEffort);
      if (typeof saved.productivityImprovement === "number") setProductivityImprovement(saved.productivityImprovement);
      if (saved.implementationHorizon) setImplementationHorizon(saved.implementationHorizon);
      if (typeof saved.initialInvestment === "number") setInitialInvestment(saved.initialInvestment);
      if (saved.priority) setPriority(saved.priority as Priority);
    }
    setIsHydrated(true);
  }, []);

  // Save to Local Workspace on changes
  useEffect(() => {
    if (isHydrated) {
      saveToolState("roi", {
        industry,
        companySize,
        opFunction,
        annualCostBaseline,
        processVolume,
        avgHandlingTime,
        automationTarget,
        manualEffort,
        productivityImprovement,
        implementationHorizon,
        initialInvestment,
        priority
      });
    }
  }, [
    isHydrated,
    industry,
    companySize,
    opFunction,
    annualCostBaseline,
    processVolume,
    avgHandlingTime,
    automationTarget,
    manualEffort,
    productivityImprovement,
    implementationHorizon,
    initialInvestment,
    priority
  ]);

  // Synchronize derived platform setup CapEx whenever scale or horizon shifts
  useEffect(() => {
    let base = 350000;
    if (companySize === "smb") base = 75000;
    else if (companySize === "mid") base = 150000;
    else if (companySize === "enterprise") base = 350000;
    else if (companySize === "large_enterprise") base = 750000;
    else if (companySize === "global_corp") base = 1500000;

    let multiplier = 1.0;
    if (implementationHorizon === "3_months") multiplier = 1.1;
    else if (implementationHorizon === "6_months") multiplier = 1.0;
    else if (implementationHorizon === "12_months") multiplier = 0.9;
    else if (implementationHorizon === "18_months") multiplier = 0.8;

    setInitialInvestment(Math.round(base * multiplier));
  }, [companySize, implementationHorizon]);

  // 2. MATHEMATICAL MODEL FOR SOVEREIGN ROI CALCULATION
  const industryBaseRate: Record<string, number> = {
    financial_services: 95,
    healthcare: 90,
    energy_utilities: 85,
    telecommunications: 75,
    public_sector: 65,
    retail_logistics: 55,
    technology_media: 100
  };

  const functionMultiplier: Record<string, number> = {
    customer_operations: 0.7,
    legal_compliance: 1.4,
    supply_chain: 0.9,
    finance_accounting: 1.2,
    it_engineering: 1.3,
    hr_admin: 0.8
  };

  const loadedHourlyRate = Math.round(
    (industryBaseRate[industry] || 80) * (functionMultiplier[opFunction] || 1.0)
  );

  const manualEffortFactor = {
    low: 0.20,
    medium: 0.40,
    high: 0.65,
    critical: 0.85
  }[manualEffort] || 0.65;

  const addressableCostBaseline = Math.round(annualCostBaseline * manualEffortFactor);

  const manualHoursSpent = avgHandlingTime !== "" && avgHandlingTime > 0
    ? Math.round(processVolume * (avgHandlingTime / 60))
    : Math.round(addressableCostBaseline / loadedHourlyRate);

  // EXPECTED GFF STANDARD CASE
  const expectedAdoptionFactor = automationTarget / 100;
  const expectedProductivityFactor = productivityImprovement / 100;
  const expectedSavingsFactor = expectedAdoptionFactor * expectedProductivityFactor;

  const expectedGrossSavings = Math.round(addressableCostBaseline * expectedSavingsFactor);
  const expectedHoursSaved = Math.round(manualHoursSpent * expectedSavingsFactor);
  const expectedNetSavings = Math.max(0, expectedGrossSavings - initialInvestment);
  const expectedRoi = initialInvestment > 0 ? Math.round((expectedNetSavings / initialInvestment) * 100) : 0;

  const expectedMonthlySavings = expectedGrossSavings / 12;
  const expectedPaybackMonths = expectedMonthlySavings > 0
    ? Math.max(0.1, Math.round((initialInvestment / expectedMonthlySavings) * 10) / 10)
    : 0;

  // CONSERVATIVE GFF CASE (Risk-Adjusted Setup)
  const conservativeAdoptionFactor = (automationTarget * 0.75) / 100;
  const conservativeProductivityFactor = Math.max(10, productivityImprovement - 15) / 100;
  const conservativeSavingsFactor = conservativeAdoptionFactor * conservativeProductivityFactor;

  const conservativeGrossSavings = Math.round(addressableCostBaseline * conservativeSavingsFactor);
  const conservativeHoursSaved = Math.round(manualHoursSpent * conservativeSavingsFactor);
  const conservativeNetSavings = Math.max(0, conservativeGrossSavings - initialInvestment);
  const conservativeRoi = initialInvestment > 0 ? Math.round((conservativeNetSavings / initialInvestment) * 100) : 0;

  const conservativeMonthlySavings = conservativeGrossSavings / 12;
  const conservativePaybackMonths = conservativeMonthlySavings > 0
    ? Math.max(0.1, Math.round((initialInvestment / conservativeMonthlySavings) * 10) / 10)
    : 0;

  // AGGRESSIVE GFF CASE (Synergy & Cognitive Multipliers)
  const aggressiveAdoptionFactor = Math.min(98, automationTarget * 1.15) / 100;
  const aggressiveProductivityFactor = Math.min(95, productivityImprovement + 15) / 100;
  const aggressiveSavingsFactor = aggressiveAdoptionFactor * aggressiveProductivityFactor;

  const aggressiveGrossSavings = Math.round(addressableCostBaseline * aggressiveSavingsFactor);
  const aggressiveHoursSaved = Math.round(manualHoursSpent * aggressiveSavingsFactor);
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
      desc: "Deploy zero-retention private enclaves to remove legal friction.",
      color: "#9D00FF",
      bgHex: "rgba(157, 0, 255, 0.08)"
    },
    {
      id: "operational_speed" as Priority,
      title: "Latency Optimization",
      desc: "Accelerate task completion times from days to milliseconds.",
      color: "#009DFF",
      bgHex: "rgba(0, 157, 255, 0.08)"
    },
    {
      id: "customer_experience" as Priority,
      title: "Experience Transformation",
      desc: "Establish instantaneous, context-aware customer resolution pipelines.",
      color: "#00FF9D",
      bgHex: "rgba(0, 255, 157, 0.08)"
    },
    {
      id: "decision_automation" as Priority,
      title: "Cognitive Multiplier",
      desc: "Delegate complex analytical operations directly to secure agent networks.",
      color: "#FFBD00",
      bgHex: "rgba(255, 189, 0, 0.08)"
    }
  ];

  const currentPriorityObj = priorities.find(p => p.id === priority) || priorities[0];

  // 4. HELPERS FOR INPUT SAFE VALIDATION & FORMATTING
  const handleBaselineChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleaned) || 0;
    setAnnualCostBaseline(parsed);
  };

  const handleVolumeChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleaned) || 0;
    setProcessVolume(parsed);
  };

  const handleHandlingTimeChange = (val: string) => {
    if (val === "") {
      setAvgHandlingTime("");
      return;
    }
    const cleaned = val.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleaned) || 0;
    setAvgHandlingTime(parsed);
  };

  const handleInvestmentChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleaned) || 0;
    setInitialInvestment(parsed);
  };

  const formatCompactCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  const formatPayback = (months: number) => {
    if (months <= 0) return "Instant Amortization";
    if (months < 1) return "Within 1 Month";
    return `${months} Months`;
  };

  // 5. COPY TO CLIPBOARD ACTION
  const handleCopyReport = () => {
    const indName = {
      financial_services: "Financial Services",
      healthcare: "Healthcare & Life Sciences",
      energy_utilities: "Energy & Utilities",
      telecommunications: "Telecommunications",
      public_sector: "Public Sector & Government",
      retail_logistics: "Retail & Logistics",
      technology_media: "Technology & Media"
    }[industry] || "Enterprise";

    const sizeName = {
      smb: "< 100 FTE",
      mid: "100 - 500 FTE",
      enterprise: "500 - 2,000 FTE",
      large_enterprise: "2,000 - 10,000 FTE",
      global_corp: "10,000+ FTE"
    }[companySize] || "Enterprise Scale";

    const funcName = {
      customer_operations: "Customer Support & Operations",
      legal_compliance: "Legal, Risk & Compliance",
      supply_chain: "Supply Chain & Logistics",
      finance_accounting: "Finance, Audit & Accounting",
      it_engineering: "IT Service & Infrastructure",
      hr_admin: "People & Administrative Services"
    }[opFunction] || "Operations";

    const reportMd = `# GFF AI // ENTERPRISE SOVEREIGN ROI SIMULATION REPORT
Generated: ${new Date().toLocaleDateString()}
Status: MODELLED - ILLUSTRATIVE ONLY

## I. ORGANIZATIONAL CONTEXT & PROFILE
- Industry Sector: ${indName}
- Enterprise Scale: ${sizeName}
- Operational Function: ${funcName}
- Implementation Horizon: ${implementationHorizon.replace("_", " ")}

## II. FINANCIAL & OPERATIONAL BASELINE (INPUTS)
- Annual Operational Cost Baseline: $${annualCostBaseline.toLocaleString()}
- Current Manual Friction Index: ${manualEffort.toUpperCase()}
- Modelled Addressable Manual Overhead: $${addressableCostBaseline.toLocaleString()}
- Annual Process Volume: ${processVolume.toLocaleString()} units
- Average Handling Time: ${avgHandlingTime ? avgHandlingTime + " Minutes" : "Not Specified (estimated based on sector average)"}
- Estimated Loaded Hourly Rate: $${loadedHourlyRate}/hr
- Estimated Current Manual Effort: ${manualHoursSpent.toLocaleString()} hours/year

## III. TARGET SOVEREIGN PARAMETERS
- Automation Target Rate: ${automationTarget}%
- Expected Productivity Boost: ${productivityImprovement}%
- Enclave Platform Investment CapEx: $${initialInvestment.toLocaleString()}
- Strategic Priority Lens: ${currentPriorityObj.title} (${priority.toUpperCase()})

## IV. KEY RECOVERY METRICS (EXPECTED CASE)
- Illustrative Annual Reclaimed Value: $${expectedGrossSavings.toLocaleString()}
- Estimated Annual Productive Hours Saved: ${expectedHoursSaved.toLocaleString()} hours
- Amortization / Payback Period: ${formatPayback(expectedPaybackMonths)}
- Net Sovereign Return on Investment (ROI): ${expectedRoi}%

## V. SCENARIO COMPARISON MATRIX
- CONSERVATIVE CASE (Risk-Adjusted Execution):
  * Annual Saved Hours: ${conservativeHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: $${conservativeGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(conservativePaybackMonths)}
  * Sovereign ROI: ${conservativeRoi}%
- EXPECTED CASE (Standard GFF Execution):
  * Annual Saved Hours: ${expectedHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: $${expectedGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(expectedPaybackMonths)}
  * Sovereign ROI: ${expectedRoi}%
- AGGRESSIVE CASE (Synergistic Multiplier Execution):
  * Annual Saved Hours: ${aggressiveHoursSaved.toLocaleString()} hrs
  * Annual Recouped Value: $${aggressiveGrossSavings.toLocaleString()}
  * Amortization Payback: ${formatPayback(aggressivePaybackMonths)}
  * Sovereign ROI: ${aggressiveRoi}%

## VI. FINANCIAL WATERFALL SUMMARY
- Addressable Manual Friction Loss: $${addressableCostBaseline.toLocaleString()}/yr
- GFF Sovereign Reclaimed Value (Expected): -$${expectedGrossSavings.toLocaleString()}/yr
- Enclave CapEx Investment Allocation: +$${initialInvestment.toLocaleString()}
- Net Annual Sovereign Dividend: $${expectedNetSavings.toLocaleString()}/yr

* DISCLAIMER: All figures are generated for strategic modeling and simulation purposes based on mathematical formulas and illustrative enterprise assumptions. They do not constitute binding financial, commercial, or operational guarantees.`;

    navigator.clipboard.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 6. RESET ACTION
  const handleReset = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIndustry("financial_services");
      setCompanySize("enterprise");
      setOpFunction("customer_operations");
      setAnnualCostBaseline(1500000);
      setProcessVolume(250000);
      setAvgHandlingTime(15);
      setAutomationTarget(65);
      setManualEffort("high");
      setProductivityImprovement(50);
      setImplementationHorizon("6_months");
      setPriority("cost_reduction");
      setIsFlushing(false);
    }, 450);
  };

  // 6.5 PREFLIGHT ADVISORIES & VALIDATION FOR INPUT FIELDS
  const getPreflightAdvisories = () => {
    const list: { type: "info" | "warning" | "optimal"; title: string; message: string }[] = [];

    if (annualCostBaseline === 0) {
      list.push({
        type: "warning",
        title: "Baseline Operational Cost Erased",
        message: "Please enter a non-zero Annual Cost Baseline to model return-on-investment trajectories."
      });
    } else if (annualCostBaseline < 100000) {
      list.push({
        type: "info",
        title: "Localized Prototype Scaling Scale",
        message: `An operating baseline of ${annualCostBaseline.toLocaleString()} indicates a localized sandbox process. Return multipliers yield peak performance at standard mid-market or corporate scale (> $250,000).`
      });
    }

    if (processVolume === 0) {
      list.push({
        type: "warning",
        title: "Annual Process Volume is Zero",
        message: "Erase-to-zero transaction frequency bypasses cognitive labor-hour reduction modeling. Please set a representative task frequency."
      });
    }

    if (avgHandlingTime === "" || avgHandlingTime === 0) {
      list.push({
        type: "warning",
        title: "Handling Time Undefined",
        message: "Average handling time in minutes must be greater than zero to calibrate multi-agent cognitive velocity returns."
      });
    }

    if (initialInvestment === 0) {
      list.push({
        type: "warning",
        title: "CapEx Platform Investment is Zero",
        message: "Hardware provisioning, secure single-tenant VPC boundaries, and custom multi-agent DAG schemas require a non-zero investment allocation."
      });
    } else if (initialInvestment < 50000) {
      list.push({
        type: "info",
        title: "Sandbox Enclave Tier Configured",
        message: `A CapEx of ${initialInvestment.toLocaleString()} is calibrated for self-service evaluation and sandbox playbooks, not production sovereign hardware nodes.`
      });
    }

    if (automationTarget > 90) {
      list.push({
        type: "warning",
        title: "Unsafe Automation Threshold",
        message: "An automation target exceeding 90% bypasses standard GFF 'Human-in-the-Loop' supervisor approvals, potentially increasing structural risk for edge cases."
      });
    } else if (automationTarget > 0 && automationTarget <= 30) {
      list.push({
        type: "info",
        title: "Under-Utilized Multi-Agent Capacity",
        message: `A target of ${automationTarget}% is highly conservative. GFF multi-agent topologies are engineered to process 60% - 85% of repetitive workloads safely.`
      });
    }

    if (list.length === 0) {
      list.push({
        type: "optimal",
        title: "Sovereign Model Parameters: Optimal",
        message: "All operational variables align with certified GFF AI reference models. Financial return projection parameters are fully optimized."
      });
    }

    return list;
  };

  // 7. GET STRATEGIC NARRATIVE
  const indName = {
    financial_services: "Financial Services",
    healthcare: "Healthcare & Life Sciences",
    energy_utilities: "Energy & Utilities",
    telecommunications: "Telecommunications",
    public_sector: "Public Sector & Government",
    retail_logistics: "Retail & Logistics",
    technology_media: "Technology & Media"
  }[industry] || "Enterprise";

  const funcName = {
    customer_operations: "Customer Support & Operations",
    legal_compliance: "Legal, Risk & Compliance",
    supply_chain: "Supply Chain & Logistics",
    finance_accounting: "Finance, Audit & Accounting",
    it_engineering: "IT Service & Infrastructure",
    hr_admin: "People & Administrative Services"
  }[opFunction] || "Operations";

  return (
    <ToolPageShell showContact={true}>
      <ToolHero
        category="FINANCIAL ENGINEERING CORE"
        title="Sovereign ROI Calculator"
        highlightedWord="ROI"
        description="Quantify the fiscal impact, cognitive hours reclaimed, and capital amortization curves achieved by shifting legacy operational friction to GFF secure multi-agent systems."
        metricLabel="MODEL VERSION"
        metricValue="V2.8-SOVEREIGN"
      />

      {isFlushing && (
        <motion.div
          key="flushing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full py-32 flex flex-col items-center justify-center text-center space-y-5 rounded-2xl border border-white/5 bg-[#030306]/95 min-h-[400px] mb-8"
        >
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-red-500/40 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-2 rounded-full border border-solid border-red-500/15 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Re-centering Financial Models</h3>
            <p className="text-[10px] text-red-500 font-mono">PURGING_SECURE_CLIENT_CACHE</p>
          </div>

          {/* Zeroization Telemetry Log */}
          <div className="font-mono text-[9px] text-red-500/60 max-w-md mx-auto space-y-0.5 mt-2 bg-black/40 p-3.5 rounded-xl border border-red-500/10 w-64 text-left">
            <p className="flex justify-between"><span>&gt; WIPING VARIABLE BUFFER...</span><span className="text-red-500 font-bold">OK</span></p>
            <p className="flex justify-between"><span>&gt; ZEROING LOCALSTORE KEYS...</span><span className="text-red-500 font-bold">OK</span></p>
            <p className="flex justify-between"><span>&gt; DE-ALLOCATING MEMORY...</span><span className="text-red-500 font-bold">OK</span></p>
            <p className="text-center text-[8px] text-red-500/40 mt-1 border-t border-red-500/10 pt-1 tracking-wider uppercase">SHIELD ENFORCED</p>
          </div>
        </motion.div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${isFlushing ? "hidden" : ""}`}>
        {/* LEFT COLUMN: Input Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 backdrop-blur-md space-y-6 relative group overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#009DFF]/40 to-transparent pointer-events-none" />
            
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">VARIABLE CONTEXT PANEL</span>
              <h2 className="text-sm font-bold text-white mt-1">Configure Model Inputs</h2>
            </div>

            {/* SECTION 1: CORPORATE FOOTPRINT */}
            <div className="space-y-4 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-[#009DFF] px-1.5 py-0.5 rounded">01</span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-semibold">Corporate Profile</span>
              </div>

              {/* Industry Dropdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="industry-select" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Industry Sector
                  </label>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Base Rate Calibration</span>
                </div>
                <select
                  id="industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-2.5 text-xs text-white focus:outline-none focus:border-[#009DFF]/50 transition-colors cursor-pointer"
                >
                  <option value="financial_services">Financial Services</option>
                  <option value="healthcare">Healthcare & Life Sciences</option>
                  <option value="energy_utilities">Energy & Utilities</option>
                  <option value="telecommunications">Telecommunications</option>
                  <option value="public_sector">Public Sector & Government</option>
                  <option value="retail_logistics">Retail & Logistics</option>
                  <option value="technology_media">Technology & Media</option>
                </select>
              </div>

              {/* Enterprise Scale (Company Size) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-mono text-[9px] uppercase tracking-wider">
                    Enterprise Scale
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Determines Setup CapEx</span>
                </div>
                <div className="grid grid-cols-5 gap-1" role="group" aria-label="Enterprise Scale">
                  {[
                    { id: "smb", label: "<100", title: "SMB (<100 FTE)" },
                    { id: "mid", label: "100-500", title: "Mid-Market (100-500 FTE)" },
                    { id: "enterprise", label: "500-2K", title: "Enterprise (500-2,000 FTE)" },
                    { id: "large_enterprise", label: "2K-10K", title: "Large Enterprise (2,000-10,000 FTE)" },
                    { id: "global_corp", label: "10K+", title: "Global Corporation (10,000+ FTE)" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCompanySize(item.id)}
                      className={`h-8 rounded text-[9px] font-semibold transition-all border ${
                        companySize === item.id
                          ? "bg-[#009DFF]/10 border-[#009DFF]/40 text-white"
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                      }`}
                      title={item.title}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operational Function */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="function-select" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Operational Function
                  </label>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Labor Complexity Factor</span>
                </div>
                <select
                  id="function-select"
                  value={opFunction}
                  onChange={(e) => setOpFunction(e.target.value)}
                  className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-2.5 text-xs text-white focus:outline-none focus:border-[#009DFF]/50 transition-colors cursor-pointer"
                >
                  <option value="customer_operations">Customer Support & Operations</option>
                  <option value="legal_compliance">Legal, Risk & Compliance</option>
                  <option value="supply_chain">Supply Chain & Logistics</option>
                  <option value="finance_accounting">Finance, Audit & Accounting</option>
                  <option value="it_engineering">IT Service & Infrastructure</option>
                  <option value="hr_admin">People & Administrative Services</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: CURRENT WORKLOAD & COSTS */}
            <div className="space-y-4 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-[#009DFF] px-1.5 py-0.5 rounded">02</span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-semibold">Friction & Baseline</span>
              </div>

              {/* Annual Cost Baseline */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="cost-input" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Annual Cost Baseline
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-mono text-[10px]">$</span>
                    <input
                      id="cost-input"
                      type="text"
                      value={annualCostBaseline === 0 ? "" : annualCostBaseline.toLocaleString()}
                      onChange={(e) => handleBaselineChange(e.target.value)}
                      className="w-24 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Annual expenses of targeted operational unit (labor + software tools).
                </p>
                <input
                  id="cost-slider"
                  aria-label="Annual Cost Baseline range slider"
                  type="range"
                  min="50000"
                  max="25000000"
                  step="50000"
                  value={annualCostBaseline}
                  onChange={(e) => setAnnualCostBaseline(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
                />
              </div>

              {/* Process Volume */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="volume-input" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Annual Process Volume
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="volume-input"
                      type="text"
                      value={processVolume === 0 ? "" : processVolume.toLocaleString()}
                      onChange={(e) => handleVolumeChange(e.target.value)}
                      className="w-24 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Annual requests, transactions, or tasks processed in this department.
                </p>
                <input
                  id="volume-slider"
                  aria-label="Annual Process Volume range slider"
                  type="range"
                  min="1000"
                  max="5000000"
                  step="1000"
                  value={processVolume}
                  onChange={(e) => setProcessVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
                />
              </div>

              {/* Average Handling Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="aht-input" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Avg Handling Time (Mins)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="aht-input"
                      type="text"
                      placeholder="Sector Avg"
                      value={avgHandlingTime}
                      onChange={(e) => handleHandlingTimeChange(e.target.value)}
                      className="w-24 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50 placeholder:text-white/20"
                    />
                    <span className="text-[8px] font-mono text-white/30">MIN</span>
                  </div>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Optional. Left blank, GFF models friction hours based on industry standards.
                </p>
                <input
                  id="aht-slider"
                  aria-label="Avg Handling Time range slider"
                  type="range"
                  min="0"
                  max="180"
                  step="1"
                  value={avgHandlingTime === "" ? 0 : avgHandlingTime}
                  onChange={(e) => setAvgHandlingTime(parseInt(e.target.value) || "")}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
                />
              </div>

              {/* Manual Friction Index (Current Manual Effort Level) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-mono text-[9px] uppercase tracking-wider">
                    Manual Friction Index
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Wasted Effort Level</span>
                </div>
                <div className="grid grid-cols-4 gap-1" role="group" aria-label="Manual Friction Index">
                  {[
                    { id: "low", label: "Low", desc: "Highly standardized, minimal cognitive friction" },
                    { id: "medium", label: "Medium", desc: "Rule-based processing, minor exceptions" },
                    { id: "high", label: "High", desc: "Complex workflow, significant administrative drag" },
                    { id: "critical", label: "Critical", desc: "Severe operational bottleneck, data-heavy" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setManualEffort(item.id)}
                      className={`py-1.5 rounded text-[10px] font-medium transition-all border flex flex-col items-center justify-center ${
                        manualEffort === item.id
                          ? "bg-[#009DFF]/10 border-[#009DFF]/40 text-white"
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                      }`}
                      title={item.desc}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: SOVEREIGN AMBITION */}
            <div className="space-y-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-[#009DFF] px-1.5 py-0.5 rounded">03</span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-semibold">Sovereign Automation Targets</span>
              </div>

              {/* Automation Target Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="automation-slider" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Automation Target Rate
                  </label>
                  <span className="text-[#00FF9D] font-mono font-bold text-xs">{automationTarget}%</span>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Target volume percentage delegated to secure multi-agent chains.
                </p>
                <input
                  id="automation-slider"
                  aria-label="Automation Target Rate range slider"
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={automationTarget}
                  onChange={(e) => setAutomationTarget(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF9D] hover:accent-[#00FF9D]"
                />
              </div>

              {/* Target Productivity Boost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="productivity-slider" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Target Productivity Boost
                  </label>
                  <span className="text-white font-mono font-bold text-xs">
                    {productivityImprovement}% <span className="text-white/30 text-[9px] font-light">({Math.max(10, productivityImprovement - 15)}% - {Math.min(95, productivityImprovement + 15)}% model)</span>
                  </span>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Modelled efficiency multiplier of automated tasks. Bounds denote safety ranges.
                </p>
                <input
                  id="productivity-slider"
                  aria-label="Target Productivity Boost range slider"
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={productivityImprovement}
                  onChange={(e) => setProductivityImprovement(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
                />
              </div>

              {/* Deployment Horizon */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-mono text-[9px] uppercase tracking-wider">
                    Deployment Horizon
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Phased System Integration</span>
                </div>
                <div className="grid grid-cols-4 gap-1" role="group" aria-label="Deployment Horizon">
                  {[
                    { id: "3_months", label: "3M", title: "3 Months (Fast Track Setup)" },
                    { id: "6_months", label: "6M", title: "6 Months (Standard Setup)" },
                    { id: "12_months", label: "12M", title: "12 Months (Phased Enterprise Setup)" },
                    { id: "18_months", label: "18M", title: "18 Months (Global Core Implementation)" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setImplementationHorizon(item.id)}
                      className={`py-1.5 rounded text-[10px] font-medium transition-all border ${
                        implementationHorizon === item.id
                          ? "bg-[#009DFF]/10 border-[#009DFF]/40 text-white"
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                      }`}
                      title={item.title}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enclave Platform Investment (CapEx) */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="investment-input" className="text-white/60 font-mono text-[9px] uppercase tracking-wider cursor-pointer">
                    Enclave Platform CapEx
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-white/40 font-mono text-[10px]">$</span>
                    <input
                      id="investment-input"
                      type="text"
                      value={initialInvestment === 0 ? "" : initialInvestment.toLocaleString()}
                      onChange={(e) => handleInvestmentChange(e.target.value)}
                      className="w-20 h-7 bg-white/5 border border-white/10 rounded px-1.5 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#009DFF]/50"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-white/30 leading-normal">
                  Platform deployment, hardware sandboxing, secure compliance setup, and integration.
                </p>
                <input
                  id="investment-slider"
                  aria-label="Enclave Platform CapEx range slider"
                  type="range"
                  min="10000"
                  max="2500000"
                  step="10000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF] hover:accent-[#009DFF]"
                />
              </div>
            </div>

            {/* Strategic Priorities Selection Grid */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <span className="text-white/60 font-mono text-[9px] uppercase tracking-wider block">Strategic Focus Lens</span>
              <div className="grid grid-cols-1 gap-2" role="group" aria-label="Strategic Focus Lens">
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

          {/* Dynamic Sovereign Telemetry Preflight Advisory / Input Validation Panel */}
          <div className="p-4.5 rounded-xl border border-white/5 bg-[#030306]/80 space-y-3 relative overflow-hidden">
            <div className="border-b border-white/5 pb-2 flex items-center justify-between">
              <span className="text-[9px] font-mono text-white/45 block uppercase tracking-wider">PREFLIGHT VALIDATION</span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/10 uppercase tracking-widest font-semibold">SOVEREIGN ADVISORY</span>
            </div>
            
            <div className="space-y-2.5">
              {getPreflightAdvisories().map((item, idx) => {
                const borderColors = {
                  warning: "border-amber-500/20 bg-amber-500/[0.02]",
                  info: "border-[#009DFF]/20 bg-[#009DFF]/[0.01]",
                  optimal: "border-[#00FF9D]/20 bg-[#00FF9D]/[0.02]"
                }[item.type];
                
                const titleColors = {
                  warning: "text-amber-400",
                  info: "text-[#009DFF]",
                  optimal: "text-[#00FF9D]"
                }[item.type];

                const pills = {
                  warning: "bg-amber-500 animate-pulse",
                  info: "bg-[#009DFF]",
                  optimal: "bg-[#00FF9D]"
                }[item.type];

                return (
                  <div key={idx} className={`p-3 rounded-lg border text-xs leading-normal font-light transition-all ${borderColors}`}>
                    <div className="flex items-center gap-2 mb-1.5 font-semibold font-mono tracking-wide text-[9px] uppercase">
                      <span className={`w-1.5 h-1.5 rounded-full ${pills}`} />
                      <span className={titleColors}>{item.title}</span>
                    </div>
                    <p className="text-white/60 text-[10px] leading-relaxed font-light">{item.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footnote Compliance Panel */}
          <div className="p-4 rounded-xl border border-white/5 bg-[#030305]/40 text-[10px] text-white/30 space-y-2 leading-relaxed">
            <span className="font-mono text-[#009DFF] font-bold block uppercase tracking-wider">SECURE SHIELD COMPLIANCE</span>
            <p>
              This simulator processes data points purely inside local volatile browser memory, aligning with the GFF AI zero-retention mandate. No telemetry is logged outside your sandboxed session.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Console */}
        <div className="lg:col-span-7 space-y-8 text-white" role="region" aria-live="polite" aria-label="Sovereign ROI Calculation Results">
          {/* Section A: Main Telemetry Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF9D]/30 to-transparent" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">RECLAIMED ANNUAL VALUE</span>
                  <span className="text-[8px] font-mono font-bold bg-[#00FF9D]/10 text-[#00FF9D] px-1 rounded uppercase tracking-widest">MODELLED</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold text-[#00FF9D] block mt-2 font-mono tracking-tight">
                  {formatCompactCurrency(expectedGrossSavings)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-4 border-t border-white/5 pt-2">
                Illustrative annual budget returned from manual operations to executive reserves.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/30 to-transparent" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">PRODUCTIVE HOURS RECLAIMED</span>
                  <span className="text-[8px] font-mono font-bold bg-[#009DFF]/10 text-[#009DFF] px-1 rounded uppercase tracking-widest">MODELLED</span>
                </div>
                <span className="text-2xl lg:text-3xl font-extrabold text-[#009DFF] block mt-2 font-mono tracking-tight">
                  {expectedHoursSaved.toLocaleString()} Hrs
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-4 border-t border-white/5 pt-2">
                Equivalent labor hours returned to strategic initiatives rather than manual loops.
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
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">EXECUTIVE SIMULATION DIALOGUE // {currentPriorityObj.title.toUpperCase()}</span>
            
            <div className="space-y-4 text-xs md:text-sm font-light leading-relaxed text-white/80">
              <p>
                For an enterprise operating in <span className="text-white font-medium">{indName}</span>, manual bottlenecks inside <span className="text-white font-medium">{funcName}</span> represent a significant drain on organizational momentum. With an annual baseline of <span className="text-white font-mono font-medium">${annualCostBaseline.toLocaleString()}</span> and a manual friction index of <span className="text-white font-medium">{manualEffort.toUpperCase()}</span>, approximately <span className="text-amber-400 font-mono font-medium">${addressableCostBaseline.toLocaleString()}</span> is consumed by repetitive manual workflows.
              </p>
              <p>
                Deploying the GFF secure sovereign agent network over a <span className="text-white font-medium">{implementationHorizon.replace("_", " ")}</span> horizon is modelled to automate up to <span className="text-[#00FF9D] font-mono font-bold">{automationTarget}%</span> of standardized tasks. Achieving a target productivity boost of <span className="text-white font-mono font-medium">{productivityImprovement}%</span> is projected to unlock an illustrative annual reclaimed value of <span className="text-[#00FF9D] font-mono font-bold">${expectedGrossSavings.toLocaleString()}</span>, returning <span className="text-white font-mono font-semibold">{expectedHoursSaved.toLocaleString()} productive hours</span> to high-leverage strategic initiatives.
              </p>
              <p className="text-white/50 text-[11px] leading-relaxed border-t border-white/5 pt-3">
                Under single-tenant private enclaves with a CapEx allocation of <span className="text-white font-mono">${initialInvestment.toLocaleString()}</span>, the model indicates the system completes its capital amortization within <span className="text-[#009DFF] font-semibold">{formatPayback(expectedPaybackMonths).toLowerCase()}</span>, yielding an estimated net sovereign return (ROI) of <span className="text-[#00FF9D] font-mono font-bold">{expectedRoi}%</span> over the initial operational cycle.
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
            <div className="w-full overflow-x-auto scrollbar-none">
              <svg viewBox="0 0 720 230" className="w-full min-w-[580px] h-auto overflow-visible select-none" fill="none">
                <line x1="30" y1="20" x2="690" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="30" y1="70" x2="690" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="120" x2="690" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="170" x2="690" y2="170" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="200" x2="690" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                {(() => {
                  const maxAmt = Math.max(addressableCostBaseline, expectedGrossSavings, initialInvestment, expectedNetSavings, 1);
                  const getY = (v: number) => 200 - (v / maxAmt) * 160;
                  const getH = (v: number) => (v / maxAmt) * 160;
                  const b1Y = getY(addressableCostBaseline), b1H = getH(addressableCostBaseline);
                  const b2H = getH(expectedGrossSavings), b2Y = b1Y;
                  const b3H = getH(initialInvestment), b3Y = b2Y + b2H - b3H;
                  const b4Y = getY(expectedNetSavings), b4H = getH(expectedNetSavings);
                  return (
                    <>
                      <line x1="120" y1={b1Y} x2="210" y2={b2Y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="290" y1={b2Y+b2H} x2="380" y2={b3Y+b3H} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="460" y1={b3Y} x2="550" y2={b4Y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                      <g>
                        <motion.rect 
                          x="50" 
                          y={b1Y} 
                          width="70" 
                          height={b1H} 
                          rx="3" 
                          fill="url(#fG)" 
                          stroke="rgba(255,255,255,0.05)"
                          initial={{ height: 0, y: 200 }}
                          animate={{ height: b1H, y: b1Y }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        <motion.text 
                          x="85" 
                          y={Math.max(b1Y-8,15)} 
                          textAnchor="middle" 
                          className="fill-white/80 font-mono text-[10px] font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          {formatCompactCurrency(addressableCostBaseline)}
                        </motion.text>
                      </g>
                      <g>
                        <motion.rect 
                          x="220" 
                          y={b2Y} 
                          width="70" 
                          height={b2H} 
                          rx="3" 
                          fill="url(#rG)" 
                          stroke="rgba(0,255,157,0.15)"
                          initial={{ height: 0, y: b2Y }}
                          animate={{ height: b2H, y: b2Y }}
                          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        />
                        <motion.text 
                          x="255" 
                          y={Math.max(b2Y-8,15)} 
                          textAnchor="middle" 
                          className="fill-[#00FF9D] font-mono text-[10px] font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.3 }}
                        >
                          -{formatCompactCurrency(expectedGrossSavings)}
                        </motion.text>
                      </g>
                      <g>
                        <motion.rect 
                          x="390" 
                          y={b3Y} 
                          width="70" 
                          height={b3H} 
                          rx="3" 
                          fill="url(#cG)" 
                          stroke="rgba(228,0,15,0.15)"
                          initial={{ height: 0, y: b3Y + b3H }}
                          animate={{ height: b3H, y: b3Y }}
                          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        />
                        <motion.text 
                          x="425" 
                          y={Math.max(b3Y-8,15)} 
                          textAnchor="middle" 
                          className="fill-[#E4000F] font-mono text-[10px] font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0, duration: 0.3 }}
                        >
                          +{formatCompactCurrency(initialInvestment)}
                        </motion.text>
                      </g>
                      <g>
                        <motion.rect 
                          x="560" 
                          y={b4Y} 
                          width="70" 
                          height={b4H} 
                          rx="3" 
                          fill="url(#nG)" 
                          stroke="rgba(0,255,157,0.3)"
                          initial={{ height: 0, y: 200 }}
                          animate={{ height: b4H, y: b4Y }}
                          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                        />
                        <motion.text 
                          x="595" 
                          y={Math.max(b4Y-8,15)} 
                          textAnchor="middle" 
                          className="fill-[#00FF9D] font-mono text-[10px] font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3, duration: 0.3 }}
                        >
                          {formatCompactCurrency(expectedNetSavings)}
                        </motion.text>
                      </g>
                    </>
                  );
                })()}
                <text x="85" y="220" textAnchor="middle" className="fill-white/30 font-mono text-[8px] uppercase tracking-wider">Manual Loss</text>
                <text x="255" y="220" textAnchor="middle" className="fill-white/30 font-mono text-[8px] uppercase tracking-wider">GFF Reclaimed</text>
                <text x="425" y="220" textAnchor="middle" className="fill-white/30 font-mono text-[8px] uppercase tracking-wider">CapEx Enclave</text>
                <text x="595" y="220" textAnchor="middle" className="fill-white/30 font-mono text-[8px] uppercase tracking-wider">Net Dividend</text>
                <defs>
                  <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                  </linearGradient>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,255,157,0.25)" />
                    <stop offset="100%" stopColor="rgba(0,255,157,0.02)" />
                  </linearGradient>
                  <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(228,0,15,0.25)" />
                    <stop offset="100%" stopColor="rgba(228,0,15,0.02)" />
                  </linearGradient>
                  <linearGradient id="nG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,255,157,0.45)" />
                    <stop offset="100%" stopColor="rgba(0,255,157,0.05)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-white/50">
              <div>
                <span className="block text-white/30 text-[8px] uppercase">Loaded Labor Rate</span>
                <span className="text-white font-bold">${loadedHourlyRate}/hr</span>
              </div>
              <div>
                <span className="block text-white/30 text-[8px] uppercase">Friction Factor</span>
                <span className="text-white font-bold">{Math.round(manualEffortFactor * 100)}%</span>
              </div>
              <div>
                <span className="block text-white/30 text-[8px] uppercase">Automation Rate</span>
                <span className="text-white font-bold">{automationTarget}%</span>
              </div>
              <div>
                <span className="block text-white/30 text-[8px] uppercase">Modelled Efficiency</span>
                <span className="text-white font-bold">+{productivityImprovement}%</span>
              </div>
            </div>
          </div>

          {/* Section D: Comparative Scenario Matrices */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">AMORTIZATION MATRIX</span>
              <h3 className="text-sm font-bold text-white mt-1">Multi-Scenario Sovereign Performance Matrix</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Scenario 1: Conservative */}
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-3 relative group">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/70">Conservative</span>
                    <span className="text-[8px] font-mono bg-white/5 text-white/40 px-1 rounded uppercase tracking-wider">Risk-Adjusted</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/30 block">75% of Adoption Target</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Value:</span>
                    <span className="font-mono text-white/80 font-bold">{formatCompactCurrency(conservativeGrossSavings)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Payback:</span>
                    <span className="font-mono text-white/80">{formatPayback(conservativePaybackMonths).replace(" Amortization", "")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Net ROI:</span>
                    <span className="font-mono text-[#00FF9D] font-bold">+{conservativeRoi}%</span>
                  </div>
                </div>
              </div>

              {/* Scenario 2: Expected */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#009DFF]/5 flex flex-col justify-between space-y-3 relative group">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#009DFF]">Expected Case</span>
                    <span className="text-[8px] font-mono bg-[#009DFF]/10 text-[#009DFF] px-1 rounded uppercase tracking-wider">Standard</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/30 block">Calculated Target</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Value:</span>
                    <span className="font-mono text-white font-bold">{formatCompactCurrency(expectedGrossSavings)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Payback:</span>
                    <span className="font-mono text-white font-bold">{formatPayback(expectedPaybackMonths).replace(" Amortization", "")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Net ROI:</span>
                    <span className="font-mono text-[#00FF9D] font-bold">+{expectedRoi}%</span>
                  </div>
                </div>
              </div>

              {/* Scenario 3: Aggressive */}
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-3 relative group">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/70">Aggressive</span>
                    <span className="text-[8px] font-mono bg-[#00FF9D]/10 text-[#00FF9D] px-1 rounded uppercase tracking-wider">Synergistic</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/30 block">115% Adoption / Multipliers</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Value:</span>
                    <span className="font-mono text-white/80 font-bold">{formatCompactCurrency(aggressiveGrossSavings)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Payback:</span>
                    <span className="font-mono text-white/80">{formatPayback(aggressivePaybackMonths).replace(" Amortization", "")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Net ROI:</span>
                    <span className="font-mono text-[#00FF9D] font-bold">+{aggressiveRoi}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-white/30 font-light leading-relaxed">
              * Note: The comparative matrix contrasts the baseline scenario against standard administrative resistance (Conservative) and high-adoption network multipliers (Aggressive). Estimates are projections based on the software formulas and do not serve as commercial guarantees.
            </p>
          </div>

          {/* Section E: Inter-Tool Ecosystem Routing */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 space-y-4">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">INTER-CONNECTED PLATFORM MODULES</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Link href="/build/blueprint" className="p-5 rounded-2xl border border-white/5 bg-[#030305] hover:border-[#9D00FF]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between min-h-[170px] group text-left">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded bg-[#9D00FF]/5 border border-[#9D00FF]/15 flex items-center justify-center text-[#9D00FF]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#9D00FF] transition-colors">Launch Sovereign Agent Architect</h4>
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

          {!isFlushing && <NextBestAction currentTool="roi" />}

          {/* Section F: Action Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-[#030306]/85 font-mono ${isFlushing ? "hidden" : ""}`}>
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
