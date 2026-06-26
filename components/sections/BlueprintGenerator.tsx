"use client";

import { useState, useEffect } from "react";
import {
  BlueprintAnswers,
  industryOptions,
  companySizeOptions,
  priorityOptions,
  aiJourneyOptions,
  dataReadinessOptions,
  leadershipOptions,
  challengeOptions,
  budgetOptions,
  geographyOptions,
  calculateBlueprintScore,
  getScoreCategory,
  getRecommendedOpportunities,
  getRecommendedSolution,
  getExpectedImpact,
} from "@/lib/blueprint-data";

const compilingMessages = [
  "Analyzing industry process patterns...",
  "Calculating AI Maturity Index...",
  "Compiling dynamic multi-agent DAG topologies...",
  "Synthesizing 90-day enterprise execution roadmap..."
];

export default function BlueprintGenerator() {
  // Wizard state
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<BlueprintAnswers>({
    industry: "",
    companySize: "",
    topPriorities: [],
    aiJourney: "",
    dataReadiness: "",
    leadershipCommitment: "",
    biggestChallenge: "",
    email: "",
    otp: "",
    budget: "",
    geography: "",
  });

  // Verification states
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Validation errors
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isCompiling) return;
    const interval = setInterval(() => {
      setCompilingStep((prev) => {
        if (prev < compilingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsCompiling(false);
          setReportGenerated(true);
          setStep(5);
          return prev;
        }
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isCompiling]);

  // Handle priority multi-selection (max 3)
  const handlePriorityToggle = (val: string) => {
    setError("");
    const current = [...answers.topPriorities];
    if (current.includes(val)) {
      setAnswers({
        ...answers,
        topPriorities: current.filter((x) => x !== val),
      });
    } else {
      if (current.length >= 3) {
        setError("You can select a maximum of 3 top priorities.");
        return;
      }
      setAnswers({
        ...answers,
        topPriorities: [...current, val],
      });
    }
  };

  // Next Step validation
  const validateAndNext = () => {
    setError("");
    if (step === 1) {
      if (!answers.industry || !answers.companySize) {
        setError("Industry and Company Size are required fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!answers.aiJourney || !answers.dataReadiness || !answers.leadershipCommitment || !answers.biggestChallenge) {
        setError("Please complete all strategy and maturity fields.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (answers.topPriorities.length === 0) {
        setError("Please select at least 1 priority (max 3).");
        return;
      }
      setStep(4);
    }
  };

  const requestOtp = () => {
    setError("");
    if (!answers.email || !answers.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setOtpSent(true);
  };

  const verifyOtpAndGenerate = () => {
    setOtpError("");
    if (!enteredOtp) {
      setOtpError("Please enter the verification code.");
      return;
    }
    // Frontend mock validation: allow any 4+ digit OTP
    if (enteredOtp.length < 4) {
      setOtpError("Verification code must be at least 4 digits.");
      return;
    }
    setIsCompiling(true);
  };

  // Calculate scores and output elements
  const score = calculateBlueprintScore(answers);
  const category = getScoreCategory(score);
  const opportunities = getRecommendedOpportunities(answers.industry);
  const solution = getRecommendedSolution(answers.biggestChallenge);
  const impact = getExpectedImpact(answers.topPriorities);

  return (
<div className="w-full max-w-[1400px] mx-auto">   {/* Top Header & Title */}
      <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-[#071426] via-[#050505] to-[#120720]">
        <h2 className="text-[28px] md:text-[34px] lg:text-[40px] leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Get Your Enterprise AI Blueprint in 60 Seconds
        </h2>
        <p className="mt-2 text-xs md:text-sm text-white/60">
          Tailored Operating Model, Topology Nodes, Recommended Solutions, and a 90-Day Roadmap.
        </p>
      </div>

      {/* Step Indicators */}
      {step < 5 && (
        <div className="px-6 md:px-8 py-4 bg-black/40 border-b border-white/5 flex gap-2 items-center justify-between text-xs font-semibold text-white/40">
          <div className="flex gap-4">
            <span className={step === 1 ? "text-[#087DF3]" : step > 1 ? "text-white/80" : ""}>1. Profile</span>
            <span className={step === 2 ? "text-[#087DF3]" : step > 2 ? "text-white/80" : ""}>2. Strategy</span>
            <span className={step === 3 ? "text-[#087DF3]" : step > 3 ? "text-white/80" : ""}>3. Priorities</span>
            <span className={step === 4 ? "text-[#087DF3]" : step > 4 ? "text-white/80" : ""}>4. Verify</span>
          </div>
          <span className="text-white/60">Step {step} of 4</span>
        </div>
      )}

      {/* Main Wizard Area */}
      <div className="p-6 md:p-8 min-h-[320px] flex flex-col justify-between">
        {/* Step 1: Enterprise Profile */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">Industry <span className="text-red-500">*</span></label>
                <select
                  value={answers.industry}
                  onChange={(e) => setAnswers({ ...answers, industry: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Industry --</option>
                  {industryOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">Company Size <span className="text-red-500">*</span></label>
                <select
                  value={answers.companySize}
                  onChange={(e) => setAnswers({ ...answers, companySize: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Size --</option>
                  {companySizeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/40 block">Budget (Optional)</label>
                <select
                  value={answers.budget}
                  onChange={(e) => setAnswers({ ...answers, budget: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white/60 focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Budget --</option>
                  {budgetOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/40 block">Geography (Optional)</label>
                <select
                  value={answers.geography}
                  onChange={(e) => setAnswers({ ...answers, geography: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white/60 focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Region --</option>
                  {geographyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}


        {/* Step 2: Strategy & Maturity */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">AI Journey <span className="text-red-500">*</span></label>
                <select
                  value={answers.aiJourney}
                  onChange={(e) => setAnswers({ ...answers, aiJourney: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select AI Journey Stage --</option>
                  {aiJourneyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">Data Readiness <span className="text-red-500">*</span></label>
                <select
                  value={answers.dataReadiness}
                  onChange={(e) => setAnswers({ ...answers, dataReadiness: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Data Readiness --</option>
                  {dataReadinessOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">Leadership Commitment <span className="text-red-500">*</span></label>
                <select
                  value={answers.leadershipCommitment}
                  onChange={(e) => setAnswers({ ...answers, leadershipCommitment: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Commitment --</option>
                  {leadershipOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 block">Biggest Challenge <span className="text-red-500">*</span></label>
                <select
                  value={answers.biggestChallenge}
                  onChange={(e) => setAnswers({ ...answers, biggestChallenge: e.target.value })}
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition"
                >
                  <option value="">-- Select Challenge --</option>
                  {challengeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}


        {/* Step 3: Top Priorities (Max 3) */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-sm font-semibold text-white/80">Select Top Priorities (Max 3) <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {priorityOptions.map((o) => {
                const isSelected = answers.topPriorities.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => handlePriorityToggle(o.value)}
                    className={`p-4 rounded-xl border text-left transition duration-200 group flex justify-between items-center ${
                      isSelected
                        ? "border-[#087DF3] bg-[#087DF3]/15 text-white"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:bg-black/60"
                    }`}
                  >
                    <span className="text-xs md:text-sm font-medium">{o.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      isSelected ? "border-[#087DF3] bg-[#087DF3]" : "border-white/30"
                    }`}>
                      {isSelected && <span className="text-[10px] text-white">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Verification Flow */}
        {step === 4 && (
          <div className="space-y-6 max-w-[500px] mx-auto w-full animate-fadeIn py-4">
            <h3 className="text-lg font-bold text-white text-center">Secure Verification Check</h3>
            <p className="text-xs text-white/50 text-center">
              Enter your enterprise email to verify instant delivery and view your interactive roadmap.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 block">Enterprise Email</label>
                <input
                  type="email"
                  disabled={otpSent}
                  value={answers.email}
                  onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-white focus:border-[#087DF3] outline-none transition disabled:opacity-50"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={requestOtp}
                  className="w-full h-[46px] rounded-lg bg-[#087DF3] text-sm font-bold text-white hover:bg-[#087DF3]/80 transition mt-4"
                >
                  Generate Free Blueprint
                </button>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-white/70 block">Enter One-Time PIN (OTP)</label>
                      <span className="text-[10px] text-[#087DF3] font-mono font-bold">Suggested Code: 123456</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      className="w-full h-[46px] rounded-lg border border-white/10 bg-black/50 px-4 text-sm text-center tracking-[0.5em] text-white focus:border-[#087DF3] outline-none transition"
                    />
                    {otpError && <p className="text-xs text-red-400 font-semibold">{otpError}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={verifyOtpAndGenerate}
                    className="w-full h-[46px] rounded-lg bg-[#E98828] text-sm font-bold text-white hover:bg-[#E98828]/80 transition"
                  >
                    Verify & Build Blueprint
                  </button>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Compile Loading Screen */}
        {isCompiling && (
          <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center text-center p-4 animate-fadeIn">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#087DF3] animate-spin"></div>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Compiling Custom AI Blueprint</h4>
            <p className="text-sm font-semibold text-[#087DF3] h-6 transition-all animate-pulse">
              {compilingMessages[compilingStep]}
            </p>
          </div>
        )}

        {/* Bottom Wizard Controls */}
        {step < 4 && (
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
            {error && <p className="text-xs md:text-sm text-red-400 font-semibold max-w-[70%]">{error}</p>}
            <div className="flex gap-4 ml-auto">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 h-[42px] rounded-lg border border-white/15 text-xs font-semibold text-white hover:bg-white/5 transition"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={validateAndNext}
                className="px-8 min-w-[150px] h-[46px] rounded-lg bg-[#087DF3] text-xs font-semibold text-white hover:bg-[#1a88f5] hover:shadow-[0_0_18px_rgba(8,125,243,0.35)] transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}


        {/* Step 5: High-Fidelity Enterprise Blueprint Report */}
        {step === 5 && reportGenerated && (
          <div className="space-y-8 animate-fadeIn text-white">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Score Circular Dial & Category Badge */}
              <div className="lg:w-1/3 rounded-xl border border-white/10 bg-black/40 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#087DF3]/5 via-transparent to-[#E98828]/5 pointer-events-none" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-4">Enterprise AI Readiness Score</h3>
                
                {/* Circular Score Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="#087DF3"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="402"
                      strokeDashoffset={402 - (402 * score) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tracking-tight text-white">{score}</span>
                    <span className="text-[10px] text-white/40">/ 100</span>
                  </div>
                </div>

                {/* Score Category Badge with Custom Glows */}
                <div className="px-4 py-1.5 rounded-full border border-[#087DF3]/40 bg-[#087DF3]/10 shadow-[0_0_15px_rgba(8,125,243,0.2)] text-xs font-bold text-[#087DF3] uppercase tracking-wider">
                  {category}
                </div>
              </div>

              {/* Recommended Solution & Business Impact */}
              <div className="lg:w-2/3 flex flex-col justify-between gap-6">
                {/* Recommended GFF Solution */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#087DF3]">RECOMMENDED GFF AI SOLUTION</span>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    {solution.title}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                {/* Expected Business Impact */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-6 space-y-3 relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#087DF3] to-[#E98828]" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#E98828]">EXPECTED BUSINESS IMPACT (MODELLED)</span>
                  <p className="text-sm font-bold text-white/90">
                    {impact.metric}
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed font-mono italic">
                    {impact.disclaimer}
                  </p>
                </div>
              </div>
            </div>


            {/* Top 5 Recommended AI Opportunities */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40 block">Top 5 Recommended AI Opportunities</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {opportunities.map((opp, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition duration-200 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <span className="text-xs font-bold text-[#087DF3] font-mono block mb-2">0{idx + 1}</span>
                      <h5 className="text-xs font-bold text-white/90 leading-snug">{opp}</h5>
                    </div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-4">Node Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Implementation Roadmap */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40 block">90-Day Sovereign Implementation Roadmap</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                
                {/* Roadmap Step 1 */}
                <div className="space-y-2 relative pl-6 border-l border-[#087DF3]/30">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#087DF3] shadow-[0_0_10px_rgba(8,125,243,0.8)]" />
                  <span className="text-[10px] font-bold text-[#087DF3] font-mono">PHASE 1: DAYS 1 - 30</span>
                  <h4 className="text-sm font-bold text-white">Ingestion & Security Baseline</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Deploy GFF secure edge nodes. Map standard data schemas and establish compliance firewalls tailored to {answers.industry} parameters.
                  </p>
                </div>

                {/* Roadmap Step 2 */}
                <div className="space-y-2 relative pl-6 border-l border-[#E98828]/30">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#E98828] shadow-[0_0_10px_rgba(233,136,40,0.8)]" />
                  <span className="text-[10px] font-bold text-[#E98828] font-mono font-semibold">PHASE 2: DAYS 31 - 60</span>
                  <h4 className="text-sm font-bold text-white">Agent Integration & Multi-Agent DAGs</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Synthesize the first 2 high-priority agentic topologies to automate {answers.topPriorities[0] || "operations"}. Configure human-in-the-loop checkpoints.
                  </p>
                </div>

                {/* Roadmap Step 3 */}
                <div className="space-y-2 relative pl-6 border-l border-emerald-500/30">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-bold text-emerald-400 font-mono">PHASE 3: DAYS 61 - 90</span>
                  <h4 className="text-sm font-bold text-white">Production Scale & Token Optimization</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Scale agents to address {answers.topPriorities[1] || "additional targets"}. Perform final optimization checks via GFF Operational Dashboard.
                  </p>
                </div>

              </div>
            </div>

            {/* Reset / Start Over Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setAnswers({
                    industry: "",
                    companySize: "",
                    topPriorities: [],
                    aiJourney: "",
                    dataReadiness: "",
                    leadershipCommitment: "",
                    biggestChallenge: "",
                    email: "",
                    otp: "",
                    budget: "",
                    geography: "",
                  });
                  setOtpSent(false);
                  setEnteredOtp("");
                  setReportGenerated(false);
                }}
                className="px-6 h-[44px] rounded-lg border border-white/10 text-xs font-semibold text-white/65 hover:border-white/20 hover:text-white transition"
              >
                Reset & Generate New Blueprint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

