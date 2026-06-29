"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BlueprintAnswers,
  companySizeOptions,
  budgetOptions,
  geographyOptions,
  calculateBlueprintScore,
  calculateBlueprintDimensions,
  getScoreCategory,
  getRecommendedOpportunities,
  getRecommendedSolution,
  getExpectedImpact,
} from "@/lib/blueprint-data";
import {
  ToolPageShell,
  ToolOptionGrid,
  ToolCTA,
} from "@/components/build/components";
import { WizardStepperSystem, WizardStep, WizardStepperSystemActions } from "@/components/build/WizardStepperSystem";
import { SovereignHistoryDrawer, SavedBlueprint } from "./SovereignHistoryDrawer";
import NextBestAction from "@/components/build/NextBestAction";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";


// Custom type extending BlueprintAnswers to maintain local UI-only wizard states
interface WizardData extends BlueprintAnswers {
  customChallengeText: string;
  otpSent: boolean;
  enteredOtp: string;
}

// Helpers for gorgeous SVG icons matching landing page theme
const getIndustryIcon = (val: string) => {
  switch (val) {
    case "Banking":
      return (
        <svg className="w-5 h-5 text-[#087DF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6" />
        </svg>
      );
    case "Retail":
      return (
        <svg className="w-5 h-5 text-[#E98828]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5" />
        </svg>
      );
    case "Healthcare":
      return (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5" />
        </svg>
      );
    case "Education":
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75L3 11.25l9 4.5 9-4.5-9-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 13.5v3.75c0 1.243 2.35 2.25 5.25 2.25s5.25-1.007 5.25-2.25V13.5" />
        </svg>
      );
    case "Manufacturing":
      return (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0" />
        </svg>
      );
    case "Tech":
      return (
        <svg className="w-5 h-5 text-[#087DF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747" />
        </svg>
      );
  }
};


// Premium Option Items mapped for ToolOptionGrid mapping
const industryOptItems = [
  {
    id: "Banking",
    title: "Banking & Financial Services",
    description: "Hardened transaction ledgers, active AML supervision and SEC compliance auditing.",
    icon: getIndustryIcon("Banking"),
    accentColor: "#087DF3"
  },
  {
    id: "Retail",
    title: "Retail & E-commerce",
    description: "Supply chain heuristics, real-time inventory flow and transactional recommendations.",
    icon: getIndustryIcon("Retail"),
    accentColor: "#E98828"
  },
  {
    id: "Healthcare",
    title: "Healthcare & Life Sciences",
    description: "HIPAA-compliant workflows, local patient clinical enclaves and vector records search.",
    icon: getIndustryIcon("Healthcare"),
    accentColor: "#10B981"
  },
    {
    id: "Education",
    title: "Education",
    description: "AI-powered learning systems, student support copilots, campus operations automation and knowledge search.",
    icon: getIndustryIcon("Education"),
    accentColor: "#22C55E"
  },
  {
    id: "Manufacturing",
    title: "Manufacturing & Automotive",
    description: "Predictive asset analytics, automated supply tracking and safety audit nodes.",
    icon: getIndustryIcon("Manufacturing"),
    accentColor: "#A855F7"
  },
  {
    id: "Tech",
    title: "Technology & Software",
    description: "Code parsing algorithms, sovereign security firewalls and API orchestration.",
    icon: getIndustryIcon("Tech"),
    accentColor: "#087DF3"
  },
  {
    id: "Other",
    title: "Other Services / General",
    description: "Broad-spectrum cognitive automation, scheduling copilots and data vectorization.",
    icon: getIndustryIcon("Other"),
    accentColor: "#94A3B8"
  }
];

const priorityOptItems = [
  {
    id: "Reduce Costs",
    title: "Reduce Costs",
    description: "Reduce operational expenditure and optimize enterprise spending.",
  },
  {
    id: "Increase Revenue",
    title: "Increase Revenue",
    description: "Create new revenue streams and accelerate business growth.",
  },
  {
    id: "Improve Productivity",
    title: "Improve Productivity",
    description: "Increase workforce efficiency through AI-enabled automation.",
  },
  {
    id: "Improve Customer Experience",
    title: "Improve Customer Experience",
    description: "Deliver faster, smarter, and personalized customer interactions.",
  },
  {
    id: "Automate Processes",
    title: "Automate Processes",
    description: "Replace repetitive workflows with intelligent automation.",
  },
  {
    id: "Strengthen Compliance",
    title: "Strengthen Compliance",
    description: "Improve governance, security, and regulatory adherence.",
  },
  {
    id: "AI Transformation",
    title: "AI Transformation",
    description: "Drive enterprise-wide AI adoption and modernization.",
  },
];

const aiJourneyOptItems = [
  {
    id: "No AI",
    title: "No AI",
    description: "No AI implementations in production; currently surveying options.",
    accentColor: "#94A3B8"
  },
  {
    id: "Exploring AI",
    title: "Exploring AI",
    description: "Initial workshops completed; assessing specific operational pilots.",
    accentColor: "#3B82F6"
  },
  {
    id: "Running Pilots",
    title: "Running Pilots",
    description: "Isolated, active pilot workflows or custom isolated GPT instances.",
    accentColor: "#087DF3"
  },
  {
    id: "Scaling AI",
    title: "Scaling AI",
    description: "Multi-department pipelines; production-ready systems scaling.",
    accentColor: "#F59E0B"
  },
  {
    id: "AI-Driven Enterprise",
    title: "AI-Driven Enterprise",
    description: "Agent-centric models are standard for operations and scheduling.",
    accentColor: "#8B5CF6"
  },
  {
    id: "AI-Native",
    title: "AI-Native",
    description: "Workflows are automated by default with human-in-the-loop nodes.",
    accentColor: "#10B981"
  }
];

const dataReadinessOptItems = [
  { id: "Highly fragmented", title: "Highly fragmented", description: "Siloed SQL, spreadsheets and offline legacy datastores." },
  { id: "Partially connected", title: "Partially connected", description: "Some batch databases connected; basic REST API layer exists." },
  { id: "Mostly integrated", title: "Mostly integrated", description: "Central vector cache or data warehouse active with regular syncs." },
  { id: "Fully integrated", title: "Fully integrated", description: "Real-time Kafka streams and event-driven vectorized storage meshes." }
];

const leadershipOptItems = [
  { id: "Not Discussed", title: "Not Discussed", description: "No leadership mandate; exploration at the engineering level only." },
  { id: "Exploring", title: "Exploring", description: "Oversight committee formed; initial budgeting and planning underway." },
  { id: "Budget Approved", title: "Budget Approved", description: "Dedicated funds allocated for sandboxed pilots and proof-of-concepts." },
  { id: "Executive Mandate", title: "Executive Mandate", description: "Sovereign AI transformation listed as a top-3 enterprise corporate priority." }
];

const challengeOptions = [
  { value: "Tech Stack", label: "Legacy Technology Stack" },
  { value: "Budget/ROI", label: "Unclear ROI & Budget Constraint" },
  { value: "Talent Shortage", label: "Talent & Skill Shortage" },
  { value: "Security/Compliance", label: "Security, Privacy & Compliance" },
  { value: "Change Management", label: "Organizational Inertia" },
];

export default function BlueprintGenerator() {
  const [savedList, setSavedList] = useState<SavedBlueprint[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState<string | null>(null);
  const [verifiedBlueprintEmail, setVerifiedBlueprintEmail] = useState("");
const [blueprintLoginError, setBlueprintLoginError] = useState("");

  // Expose stepper actions to load states back in
  const [stepperActions, setStepperActions] = useState<WizardStepperSystemActions<WizardData> | null>(null);

  useEffect(() => {
    // Load initial list from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gff_blueprint_history");
        if (stored) {
          setSavedList(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveLocally = (currentData: WizardData, currentScore: number, currentCategory: string) => {
    const newItem: SavedBlueprint = {
      id: `gff-bp-${Date.now()}`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      data: currentData,
      score: currentScore,
      category: currentCategory,
    };
 

    const updated = [newItem, ...savedList.filter(item => item.data.email !== currentData.email || item.score !== currentScore)];
    setSavedList(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gff_blueprint_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
const loginBlueprintUser = async (email: string, code: string) => {
  try {
    setBlueprintLoginError("");

    const response = await fetch("/api/v1/auth/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "verify",
        email: email.toLowerCase().trim(),
        code,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success || !payload?.accessToken) {
      throw new Error(payload?.message || "Blueprint login failed.");
    }

    localStorage.setItem("gff_ai_access_token", payload.accessToken);
    localStorage.setItem("gff_api_token", payload.accessToken);

    setVerifiedBlueprintEmail(email.toLowerCase().trim());
  } catch (err: any) {
    setBlueprintLoginError(err.message || "Blueprint login failed.");
  }
};

  const initialData: WizardData = {
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
    customChallengeText: "",
    otpSent: false,
    enteredOtp: ""
  };

  const steps: WizardStep<WizardData>[] = [
    {
      id: "organization",
      label: "Organization Context",
      description: "Define your industry vertical, operational scale, and region.",
      duration: "1-2 min",
      validate: (data) => {
        if (!data.industry) return "Industry vertical selection is required.";
        if (!data.companySize) return "Organization scale selection is required.";
        return null;
      },
      render: ({ data, onChange }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              1. Select Industry Vertical <span className="text-[#087DF3]">*</span>
            </span>
            <ToolOptionGrid
              options={industryOptItems}
              selectedId={data.industry}
              onChange={(id) => onChange({ industry: id })}
            />
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              2. Select Organization Scale <span className="text-[#087DF3]">*</span>
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {companySizeOptions.map((opt) => {
                const isSelected = data.companySize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ companySize: opt.value })}
                    className={`p-3.5 rounded-xl border text-center transition-all duration-300 text-xs font-bold leading-normal ${
                      isSelected
                        ? "bg-white/[0.03] border-[#087DF3] text-white shadow-[0_0_15px_rgba(8,125,243,0.15)]"
                        : "bg-white/[0.01] border-white/5 text-white/60 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="blueprint-budget" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block cursor-pointer">Target Budget Range (Optional)</label>
              <select
                id="blueprint-budget"
                value={data.budget || ""}
                onChange={(e) => onChange({ budget: e.target.value })}
                className="w-full h-11 rounded-xl border border-white/10 bg-black/50 px-4 text-xs text-white focus:border-[#087DF3] outline-none transition"
              >
                <option value="" className="bg-black text-white/60">-- Select Target Budget Range --</option>
                {budgetOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blueprint-geography" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block cursor-pointer">Geography / Region (Optional)</label>
              <select
                id="blueprint-geography"
                value={data.geography || ""}
                onChange={(e) => onChange({ geography: e.target.value })}
                className="w-full h-11 rounded-xl border border-white/10 bg-black/50 px-4 text-xs text-white focus:border-[#087DF3] outline-none transition"
              >
                <option value="" className="bg-black text-white/60">-- Select Region / Deployment --</option>
                {geographyOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "priorities",
      label: "Strategic Priorities",
      description: "Select up to 3 priority outcomes for your AI transformation.",
      duration: "1 min",
      validate: (data) => {
        if (!data.topPriorities || data.topPriorities.length === 0) {
          return "Please select at least 1 strategic priority outcome.";
        }
        if (data.topPriorities.length > 3) {
          return "You can select up to 3 strategic priority outcomes.";
        }
        return null;
      },
      render: ({ data, onChange }) => {
        const togglePriority = (id: string) => {
          const current = [...(data.topPriorities || [])];
          if (current.includes(id)) {
            onChange({ topPriorities: current.filter((x) => x !== id) });
          } else {
            if (current.length < 3) {
              onChange({ topPriorities: [...current, id] });
            }
          }
        };

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                Select Strategic Targets (Max 3) <span className="text-[#087DF3]">*</span>
              </span>
              <span className="text-[9px] font-mono text-white/40">{(data.topPriorities || []).length} of 3 selected</span>
            </div>
            <ToolOptionGrid
              options={priorityOptItems}
              selectedId={data.topPriorities}
              onChange={togglePriority}
              multiSelect={true}
            />
          </div>
        );
      }
    },

    {
      id: "ai-journey",
      label: "AI Maturity Stage",
      description: "Assess your current operational AI implementation depth.",
      duration: "1 min",
      validate: (data) => {
        if (!data.aiJourney) return "AI Adoption stage is required.";
        return null;
      },
      render: ({ data, onChange }) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
            Select Current Operational AI Adoption Depth <span className="text-[#087DF3]">*</span>
          </span>
          <ToolOptionGrid
            options={aiJourneyOptItems}
            selectedId={data.aiJourney}
            onChange={(id) => onChange({ aiJourney: id })}
          />
        </div>
      )
    },
    {
      id: "data-leadership",
      label: "Data & Governance",
      description: "Select your data integration readiness and leadership commitment level.",
      duration: "1-2 min",
      validate: (data) => {
        if (!data.dataReadiness) return "Data infrastructure readiness selection is required.";
        if (!data.leadershipCommitment) return "Leadership commitment selection is required.";
        return null;
      },
      render: ({ data, onChange }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              1. Select Data Infrastructure Readiness <span className="text-[#087DF3]">*</span>
            </span>
            <ToolOptionGrid
              options={dataReadinessOptItems}
              selectedId={data.dataReadiness}
              onChange={(id) => onChange({ dataReadiness: id })}
            />
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              2. Select Leadership Alignment & Mandate <span className="text-[#087DF3]">*</span>
            </span>
            <ToolOptionGrid
              options={leadershipOptItems}
              selectedId={data.leadershipCommitment}
              onChange={(id) => onChange({ leadershipCommitment: id })}
            />
          </div>
        </div>
      )
    },
    {
      id: "challenge",
      label: "Sovereign Roadblock",
      description: "Identify your primary roadblock and describe the context.",
      duration: "2 min",
      validate: (data) => {
        if (!data.biggestChallenge) return "Please select a primary bottleneck category.";
        if (!data.customChallengeText || data.customChallengeText.trim().length < 10) {
          return "Please describe your roadblock context (minimum 10 characters).";
        }
        return null;
      },
      render: ({ data, onChange }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
              1. Select Primary Bottleneck Category <span className="text-[#087DF3]">*</span>
            </span>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {challengeOptions.map((opt) => {
                const isSelected = data.biggestChallenge === opt.value;
                const cleanLabel = opt.label.split(" & ").pop()?.split(" Constraint").shift() || opt.label;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ biggestChallenge: opt.value })}
                    className={`p-3 rounded-xl border text-center transition-all duration-300 text-xs font-bold leading-tight ${
                      isSelected
                        ? "bg-white/[0.03] border-[#087DF3] text-white shadow-[0_0_15px_rgba(8,125,243,0.15)]"
                        : "bg-white/[0.01] border-white/5 text-white/60 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {cleanLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center">
              <label htmlFor="blueprint-roadblock" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block cursor-pointer">
                2. Describe Roadblock In Detail <span className="text-[#087DF3]">*</span>
              </label>
              <span className="text-[9px] font-mono text-white/40">{(data.customChallengeText || "").length} characters (min 10)</span>
            </div>
            <textarea
              id="blueprint-roadblock"
              value={data.customChallengeText || ""}
              onChange={(e) => onChange({ customChallengeText: e.target.value })}
              placeholder="E.g., We have legacy databases in SQL and SAP, but no unified knowledge graph. We want to automate invoice ingestion but are worried about security and compliance regulations..."
              className="w-full h-36 rounded-xl border border-white/10 bg-black/50 p-4 text-xs sm:text-sm text-white focus:border-[#087DF3] outline-none transition resize-none leading-relaxed"
            />
          </div>
        </div>
      )
    },

    {
      id: "verification",
      label: "Portal Authorization",
      description: "Verify your email with a simulated, secure GFF credentials checkpoint.",
      duration: "1 min",
      validate: (data) => {
        if (!data.email) return "Enterprise email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) return "Please enter a valid enterprise email address.";
        if (!data.enteredOtp) {
          return "Verification PIN is required. Please request and enter the access PIN.";
        }
        if (data.enteredOtp !== "123456") {
  return "Invalid verification PIN. Use the simulated PIN '123456' to proceed.";
}

if (verifiedBlueprintEmail !== data.email.toLowerCase().trim()) {
  return blueprintLoginError || "Please wait, blueprint login is being completed.";
}
        return null;
      },
      render: ({ data, onChange }) => {
        const requestSimulatedOtp = () => {
          if (!data.email) return;
          onChange({ otpSent: true });
        };

        return (
          <div className="space-y-6 max-w-[540px] mx-auto w-full py-2">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#087DF3]/10 border border-[#087DF3]/20 flex items-center justify-center mx-auto text-[#087DF3]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Portal Gate</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                Authorize access via secure enterprise credential checkpoint to synthesize your interactive topology roadmap.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="blueprint-email" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block cursor-pointer">
                  Enterprise Email Address <span className="text-[#087DF3]">*</span>
                </label>
                <input
                  id="blueprint-email"
                  type="email"
                  value={data.email || ""}
                  onChange={(e) => onChange({ email: e.target.value })}
                  placeholder="yourname@enterprise.com"
                  className="w-full h-[46px] rounded-xl border border-white/10 bg-black/50 px-4 text-xs md:text-sm text-white focus:border-[#087DF3] outline-none transition disabled:opacity-40"
                  disabled={data.otpSent}
                />
              </div>

              {!data.otpSent ? (
                <button
                  type="button"
                  onClick={requestSimulatedOtp}
                  disabled={!data.email}
                  className="w-full h-11 rounded-xl bg-[#087DF3] text-xs font-bold uppercase tracking-wider text-black hover:bg-[#087DF3]/90 transition-all font-mono shadow-[0_0_15px_rgba(8,125,243,0.25)] disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  Request Access PIN
                </button>
              ) : (
                <div className="space-y-4 pt-4 border-t border-white/5 animate-fadeIn">
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-amber-500 font-mono tracking-wider uppercase">Simulated Node</span>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed font-light">
                      No external emails will be dispatched in this sandbox. Use the simulated PIN below to authorize immediately:
                    </p>
                    <div className="flex justify-between items-center py-1 px-3 rounded bg-white/5 border border-white/10">
                      <span className="text-[9px] text-white/40 font-mono font-bold">Suggested PIN:</span>
                      <span className="text-xs font-mono font-extrabold text-[#087DF3] tracking-widest">123456</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="blueprint-otp" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block cursor-pointer">
                      Enter One-Time PIN (OTP) <span className="text-[#087DF3]">*</span>
                    </label>
                    <input
                      id="blueprint-otp"
                      type="text"
                      maxLength={6}
                      value={data.enteredOtp || ""}
                      
                      onChange={(e) => {
  const nextOtp = e.target.value.replace(/\D/g, "");
  onChange({ enteredOtp: nextOtp });

  if (nextOtp === "123456") {
    loginBlueprintUser(data.email || "", nextOtp);
  }
}}
                      placeholder="Enter 6-digit PIN"
                      className="w-full h-[46px] rounded-xl border border-white/10 bg-black/50 px-4 text-xs sm:text-sm text-center tracking-[0.4em] font-mono text-white focus:border-[#087DF3] outline-none transition"
                    />
                  </div>

                  <p className="text-[10px] text-white/30 font-light leading-relaxed">
                    * Note: Use the standard compile buttons below to complete verification and generate your report.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  ];

  const compilingMessages = [
    "Analyzing industry process patterns...",
    "Calculating AI Maturity Index...",
    "Compiling dynamic multi-agent DAG topologies...",
    "Synthesizing 90-day enterprise execution roadmap...",
    "Running compliance audit baseline checks..."
  ];



  const onCompile = (data: WizardData) => {
    const score = calculateBlueprintScore(data);
    const category = getScoreCategory(score);
    const opportunities = getRecommendedOpportunities(data.industry);
    const solution = getRecommendedSolution(data.biggestChallenge);
    const impact = getExpectedImpact(data.topPriorities);
    const dimensions = calculateBlueprintDimensions(data);

    return {
      score,
      category,
      opportunities,
      solution,
      impact,
      dimensions
    };
  };

  const renderResult = (data: WizardData, result: any, onReset: () => void) => {
    return (
      <div className="space-y-8 anim-slide-up text-white" role="region" aria-live="polite" aria-label="Sovereign Enterprise AI Blueprint Report">
        <div className="p-6 md:p-8 rounded-2xl border border-[#087DF3]/30 bg-gradient-to-r from-[#030d1d] to-[#04060c] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#087DF3] uppercase tracking-widest">VERIFIED COMPLETED ASSESSMENT</span>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-1">Your Custom GFF AI Blueprint is Synthesized</h3>
            <p className="text-xs text-white/60 mt-1">
              Generated for enterprise gate credential <span className="text-[#087DF3] font-bold font-mono">{data.email}</span>
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-mono font-bold bg-[#E98828]/15 text-[#E98828] border border-[#E98828]/20 px-3 py-1.5 rounded-lg">PORTAL_VERIFIED_SECURE</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Score Circular Dial */}
          <div className="lg:w-1/3 rounded-2xl border border-white/10 bg-[#030712]/40 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#087DF3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/40 block mb-6 font-mono">AI READINESS MODEL</span>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="64" className="stroke-white/5 fill-none" strokeWidth="6" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="64" 
                  className="stroke-[#087DF3] fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 64}`} 
                  strokeDashoffset={`${2 * Math.PI * 64 * (1 - result.score / 100)}`} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter text-white">{result.score}</span>
                <span className="text-[11px] font-mono text-white/40">/ 100 SCORE</span>
              </div>
            </div>

            <div className="px-5 py-2 rounded-full border border-[#087DF3]/40 bg-[#087DF3]/15 shadow-[0_0_15px_rgba(8,125,243,0.2)] text-xs font-black text-white uppercase tracking-wider">
              {result.category}
            </div>
          </div>


          {/* Recommended Solution & Impact */}
          <div className="lg:w-2/3 flex flex-col justify-between gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#030712]/40 backdrop-blur-md p-6 space-y-3 relative overflow-hidden">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#087DF3]">RECOMMENDED GFF AI SOLUTION</span>
              <h4 className="text-lg md:text-xl font-extrabold text-white">{result.solution.title}</h4>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">{result.solution.description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030712]/40 backdrop-blur-md p-6 space-y-3 relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#087DF3] to-[#E98828]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#E98828]">EXPECTED BUSINESS IMPACT (MODELLED)</span>
              <p className="text-sm md:text-base font-bold text-white/90 leading-normal">{result.impact.metric}</p>
              <p className="text-[10px] text-white/45 leading-relaxed font-mono italic">{result.impact.disclaimer}</p>
            </div>
          </div>
        </div>

        {data.customChallengeText && (
          <div className="rounded-2xl border border-white/5 bg-[#030712]/30 p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-white/40 block">Your Roadblock Context</span>
            <p className="text-xs md:text-sm text-white/70 italic leading-relaxed">"{data.customChallengeText}"</p>
          </div>
        )}

        {/* Dimension Breakdown Section */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#087DF3] block tracking-wider font-mono">Enterprise AI Readiness Dimension Breakdown</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: AI Maturity Index */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030712]/30 hover:border-[#087DF3]/30 hover:bg-[#030712]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#087DF3] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">DIM_01 / MATURITY</span>
                  <span className="text-xs font-mono font-bold text-[#087DF3] bg-[#087DF3]/15 px-2 py-0.5 rounded">20% WT.</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">AI Maturity Index</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">Strategic execution capability and architectural depth.</p>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black font-mono text-white">{result.dimensions?.aiMaturity ?? 0}<span className="text-xs text-white/45">/100</span></span>
                  <span className="text-[10px] font-mono text-white/50">+{((result.dimensions?.aiMaturity ?? 0) * 0.20).toFixed(1)} pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#087DF3] rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.dimensions?.aiMaturity ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* Card 2: Business Need */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030712]/30 hover:border-[#E98828]/30 hover:bg-[#030712]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#E98828] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">DIM_02 / NEED</span>
                  <span className="text-xs font-mono font-bold text-[#E98828] bg-[#E98828]/15 px-2 py-0.5 rounded">25% WT.</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">Business Need Alignment</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">Urgency of productivity, cost, and compliance targets.</p>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black font-mono text-white">{result.dimensions?.businessNeed ?? 0}<span className="text-xs text-white/45">/100</span></span>
                  <span className="text-[10px] font-mono text-white/50">+{((result.dimensions?.businessNeed ?? 0) * 0.25).toFixed(1)} pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E98828] rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.dimensions?.businessNeed ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* Card 3: Data Readiness */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030712]/30 hover:border-emerald-500/30 hover:bg-[#030712]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#10B981] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">DIM_03 / DATA</span>
                  <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">20% WT.</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">Enterprise Data Readiness</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">Integration status of schemas, silos, and vector caching.</p>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black font-mono text-white">{result.dimensions?.dataReadiness ?? 0}<span className="text-xs text-white/45">/100</span></span>
                  <span className="text-[10px] font-mono text-white/50">+{((result.dimensions?.dataReadiness ?? 0) * 0.20).toFixed(1)} pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.dimensions?.dataReadiness ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* Card 4: Process Complexity */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030712]/30 hover:border-[#A855F7]/30 hover:bg-[#030712]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#A855F7] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">DIM_04 / COMPLEXITY</span>
                  <span className="text-xs font-mono font-bold text-[#A855F7] bg-[#A855F7]/15 px-2 py-0.5 rounded">20% WT.</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">Process Complexity</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">Organizational scale, headcount, and friction points.</p>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black font-mono text-white">{result.dimensions?.processComplexity ?? 0}<span className="text-xs text-white/45">/100</span></span>
                  <span className="text-[10px] font-mono text-white/50">+{((result.dimensions?.processComplexity ?? 0) * 0.20).toFixed(1)} pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#A855F7] rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.dimensions?.processComplexity ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* Card 5: Transformation Readiness */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030712]/30 hover:border-pink-500/30 hover:bg-[#030712]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#EC4899] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">DIM_05 / TRANSFORMATION</span>
                  <span className="text-xs font-mono font-bold text-[#EC4899] bg-[#EC4899]/15 px-2 py-0.5 rounded">15% WT.</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">Transformation Readiness</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">Executive sponsors, budget status, and mandate enforcement.</p>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black font-mono text-white">{result.dimensions?.transformationReadiness ?? 0}<span className="text-xs text-white/45">/100</span></span>
                  <span className="text-[10px] font-mono text-white/50">+{((result.dimensions?.transformationReadiness ?? 0) * 0.15).toFixed(1)} pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#EC4899] rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.dimensions?.transformationReadiness ?? 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Print Styling Injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            header, footer, nav, aside, .no-print, .print\\:hidden, button, a, [class*="telemetry"], [class*="InnerPageShell_header"], [class*="InnerPageShell_footer"], .animated-grid {
              display: none !important;
            }
            body, html, main, .print-container {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: ui-sans-serif, system-ui, sans-serif !important;
            }
            .print\\:text-slate-900 { color: #0f172a !important; }
            .print\\:text-slate-700 { color: #334155 !important; }
            .print\\:text-slate-500 { color: #64748b !important; }
            .print\\:text-slate-600 { color: #475569 !important; }
            .print\\:bg-white { background: #ffffff !important; }
            .print\\:bg-slate-50 { background: #f8fafc !important; }
            .print\\:bg-slate-100 { background: #f1f5f9 !important; }
            .print\\:border-slate-200 { border-color: #e2e8f0 !important; }
            .print\\:border-slate-300 { border-color: #cbd5e1 !important; }
            .print\\:border { border: 1px solid #cbd5e1 !important; }
            .print\\:shadow-none { box-shadow: none !important; }
          }
        `}} />

        {/* Opportunities Nodes */}
        <div className="rounded-2xl border border-white/10 bg-[#030712]/45 p-6 space-y-4 print:bg-white print:border-slate-300 print:shadow-none">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/40 block tracking-wider print:text-slate-500">Synthesized Top 5 Recommended AI Opportunity Nodes</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {result.opportunities.map((opp: string, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] transition duration-200 flex flex-col justify-between min-h-[145px] print:bg-white print:border-slate-200 print:shadow-none">
                <div>
                  <span className="text-xs font-mono font-bold text-[#087DF3] block mb-2 print:text-slate-600">NODE_0{idx + 1}</span>
                  <h5 className="text-xs font-bold text-white/95 leading-normal print:text-slate-900">{opp}</h5>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold mt-4 flex items-center gap-1 print:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse print:hidden" />
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>


        {/* Timeline roadmap */}
        <div className="rounded-2xl border border-white/10 bg-[#030712]/45 p-6 space-y-4 relative overflow-hidden">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/40 block tracking-wider font-mono">90-Day Sovereign Implementation Roadmap</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-2 relative pl-6 border-l border-[#087DF3]/30">
              <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#087DF3] shadow-[0_0_10px_rgba(8,125,243,0.8)] animate-pulse" />
              <span className="text-[10px] font-bold text-[#087DF3] font-mono tracking-wider">STAGE 01 / DAYS 1 - 15</span>
              <h4 className="text-sm font-bold text-white">Garage Discovery</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Deploy private GFF secure edge nodes. Run deep-dive discovery workshops with core engineering teams to map high-priority legacy processes and compliance schemas.
              </p>
            </div>

            <div className="space-y-2 relative pl-6 border-l border-[#E98828]/30">
              <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#E98828] shadow-[0_0_10px_rgba(233,136,40,0.8)]" />
              <span className="text-[10px] font-bold text-[#E98828] font-mono tracking-wider">STAGE 02 / DAYS 16 - 45</span>
              <h4 className="text-sm font-bold text-white">Foundry Pilot</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Synthesize initial production-grade {data.topPriorities[0] || 'operations'} agent topologies. Run secure, sandboxed DAG dry-runs to validate compliance boundaries.
              </p>
            </div>

            <div className="space-y-2 relative pl-6 border-l border-emerald-500/30">
              <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider">STAGE 03 / DAYS 46 - 75</span>
              <h4 className="text-sm font-bold text-white">Factory Enterprise Rollout</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Deploy validated agents into secure VPC enclaves. Scale operations to automate {data.topPriorities[1] || 'process optimization'} workflows with human-in-the-loop audit checkpoints.
              </p>
            </div>

            <div className="space-y-2 relative pl-6 border-l border-pink-500/30">
              <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <span className="text-[10px] font-bold text-pink-400 font-mono tracking-wider">STAGE 04 / DAYS 76 - 90+</span>
              <h4 className="text-sm font-bold text-white">Operate Managed AI Operations</h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Continuous optimization, token allocation governance, and weights performance tuning. Supported by GFF's fully-managed on-demand enterprise AI core team.
              </p>
            </div>
          </div>
        </div>

        <NextBestAction currentTool="blueprint" completed={true} />

        {/* Action buttons or Reset */}
        <div className="space-y-4 pt-6 border-t border-white/5 print:hidden">
          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6M12 3v18M12 3a11.959 11.959 0 018.402 3M21 12c0 1.69-.133 3.35-.388 4.97a11.956 11.956 0 01-1.722 3.824M19.5 12c0-1.268-.312-2.46-.864-3.514M16.5 12c0-2.43-.353-4.78-.99-7" />
              </svg>
              <span>
                <strong>Sovereign Privacy Active:</strong> This interactive preview is sandboxed inside your own local browser. No data is stored on external GFF servers.
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase self-start sm:self-center">
              100% Safe Preview
            </span>
          </div>

          {/* Left side actions: Local actions */}
          <div className="flex flex-wrap gap-2.5">
            {/* Copy Summary */}
            <button
              type="button"
              onClick={() => {
                const summaryText = `GFF AI SOVEREIGN ENTERPRISE AI BLUEPRINT REPORT
==================================================
EMAIL CREDENTIAL: ${data.email}
INDUSTRY: ${data.industry}
ORGANIZATION SCALE: ${data.companySize}
AI READINESS SCORE: ${result.score}/100 (${result.category})

RECOMMENDED SOLUTION:
${result.solution.title}
- ${result.solution.description}

EXPECTED BUSINESS IMPACT:
${result.impact.metric}
- Disclaimer: ${result.impact.disclaimer}

STRATEGIC PRIORITIES:
${data.topPriorities.map((p, i) => `${i + 1}. ${p}`).join("\n")}

DIMENSION BREAKDOWN:
- AI Maturity: ${result.dimensions?.aiMaturity ?? 0}/100
- Business Need: ${result.dimensions?.businessNeed ?? 0}/100
- Data Readiness: ${result.dimensions?.dataReadiness ?? 0}/100
- Process Complexity: ${result.dimensions?.processComplexity ?? 0}/100
- Transformation Readiness: ${result.dimensions?.transformationReadiness ?? 0}/100

==================================================
PRIVACY NOTICE: Generated locally on the client edge. No data is stored on server.`;
                navigator.clipboard.writeText(summaryText);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className={`px-4 h-[46px] rounded-lg border text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                isCopied
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "border-white/10 text-white hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 text-[#087DF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5" />
              </svg>
              <span>{isCopied ? "Copied ✔" : "Copy Summary"}</span>
            </button>

            {/* Save locally in browser localStorage */}
            <button
              type="button"
              onClick={() => handleSaveLocally(data, result.score, result.category)}
              className={`px-4 h-[46px] rounded-lg border text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                isSaved
                  ? "bg-[#087DF3]/20 border-[#087DF3]/40 text-[#087DF3]"
                  : "border-white/10 text-white hover:border-[#087DF3]/30 hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 text-[#E98828]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <span>{isSaved ? "Saved ✔" : "Save to Edge"}</span>
            </button>

            {/* Print Blueprint */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 h-[46px] rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:border-white/20 hover:bg-white/5 transition duration-200 font-mono flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l-.24-2.13A3 3 0 003.53 9H3m12.9-.26c.312-.273.685-.414 1.1-.414H18a3 3 0 012.916 2.316l.24 2.13c.121.574-.1 1.156-.563 1.5l-.364.273a3.483 3.483 0 01-1.896.616H5.66c-.69 0-1.35-.224-1.897-.616l-.363-.273a2.006 2.006 0 01-.563-1.5L2.616 11A3 3 0 015.532 9h.45m12 0c0-1.657-1.343-3-3-3h-6c-1.657 0-3 1.343-3 3m12 0H6m3 4v3a1 1 0 001 1h4a1 1 0 001-1v-3" />
              </svg>
              <span>Print Report</span>
            </button>

            {/* Copy Shareable Link */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  try {
                    const serialized = btoa(encodeURIComponent(JSON.stringify(data)));
                    const shareUrl = `${window.location.origin}${window.location.pathname}?blueprint=${serialized}`;
                    navigator.clipboard.writeText(shareUrl);
                    setIsShared(true);
                    setTimeout(() => setIsShared(false), 2000);
                  } catch (e) {
                    console.error("Failed to generate share link:", e);
                  }
                }
              }}
              className={`px-4 h-[46px] rounded-lg border text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                isShared
                  ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                  : "border-white/10 text-white hover:border-purple-500/30 hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span>{isShared ? "Link Copied ✔" : "Copy Share Link"}</span>
            </button>
          </div>

          {/* Right side actions: Reset and Next actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                setHistoryLoaded(null);
                onReset();
              }}
              className="px-6 h-[46px] rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:border-white/20 hover:bg-white/5 transition duration-200 font-mono cursor-pointer"
            >
              Reset Assessment
            </button>
            <a
              href="/contact"
              className="px-6 h-[46px] inline-flex items-center justify-center rounded-lg bg-[#009DFF] text-xs font-bold uppercase tracking-wider text-black hover:bg-[#009DFF]/90 transition duration-200 font-mono shadow-[0_0_15px_rgba(0,157,255,0.25)]"
            >
              Secure Engineering Sync
            </a>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!stepperActions) return;

    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get("blueprint");
        if (encoded) {
          const decodedString = atob(decodeURIComponent(encoded));
          const decodedData = JSON.parse(decodedString);
          if (decodedData && decodedData.industry) {
            // Recompile results on-the-fly
            const compiledResult = onCompile(decodedData);
            stepperActions.loadState(decodedData, compiledResult);
          }
        } else if (params.get("continue") === "true") {
          const stored = localStorage.getItem("gff_blueprint_history");
          if (stored) {
            const list = JSON.parse(stored);
            if (list && list.length > 0) {
              const latestItem = list[0];
              const savedResult = onCompile(latestItem.data);
              stepperActions.loadState(latestItem.data, savedResult);
              setHistoryLoaded(latestItem.id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse blueprint from URL params:", e);
      }
    }
  }, [stepperActions]);


  return (
    <div className="w-full min-h-screen bg-[#020204] space-y-6 ">
      {/* Top Title Section */}
      <div className="relative border-b border-white/5 pb-8 mb-4 print:hidden mt-10">
<div className="space-y-3 max-w-full mx-auto text-center">
            {/* <span className="text-[10px] font-mono text-[#087DF3] font-bold uppercase tracking-widest block">
            Sovereign Self-Assessment Engine
          </span> */}
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
            Sovereign Enterprise{" "}
            <span className="bg-gradient-to-r from-white via-white to-[#087DF3] bg-clip-text text-transparent">
              AI Blueprint Generator
            </span>
          </h1>
<p className="text-white/60 text-xs lg:text-sm font-light max-w-2xl mx-auto leading-relaxed">            Formulate your tailored operating model, target multi-agent DAG architectures, and synthesized 90-day execution roadmap built on standard GFF AI baselines.
          </p>
        </div>

        {/* Local History Vault Button */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold font-mono uppercase tracking-wider text-white hover:border-[#087DF3]/40 hover:bg-[#087DF3]/10 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#087DF3] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span>Sovereign Edge Vault ({savedList.length})</span>
          </button>
        </div>
      </div>

      {/* Stepper System */}
      <WizardStepperSystem<WizardData>
        toolName="Sovereign Enterprise AI Blueprint Generator"
        category="Sovereign Self-Assessment Engine"
        toolDescription="Formulate your tailored operating model, target multi-agent DAG architectures, and synthesized 90-day execution roadmap built on standard GFF AI baselines."
        steps={steps}
        initialData={initialData}
        summaryItems={(d: WizardData) => [
          { label: "01_VERTICAL", value: d.industry || "WAITING", color: d.industry ? "#087DF3" : undefined },
          { label: "02_SCALE", value: d.companySize || "WAITING", color: d.companySize ? "#E98828" : undefined },
          { label: "03_TARGETS", value: d.topPriorities.length > 0 ? `${d.topPriorities.length} Targets` : "WAITING", color: d.topPriorities.length > 0 ? "#10B981" : undefined },
          { label: "04_AI_STAGE", value: d.aiJourney || "WAITING", color: d.aiJourney ? "#A855F7" : undefined },
          { label: "05_DATA", value: d.dataReadiness || "WAITING", color: d.dataReadiness ? "#087DF3" : undefined },
          { label: "06_GATE_STATUS", value: d.email ? "CREDENTIAL_OK" : "WAITING", color: d.email ? "#10B981" : undefined }
        ]}
        onCompile={onCompile}
        renderResult={renderResult}
        compilingMessages={compilingMessages}
        onInit={setStepperActions}
      />

      {/* Premium CTA at bottom */}
      <div className="pt-12 print:hidden">
        <ToolCTA 
          title="Elevate Your Simulated AI Blueprint to Enterprise Scale"
          description="Work with GFF's core architecture engineers to deploy your synthesized DAG topologies inside private, single-tenant secure VPC enclaves."
          buttonText="Initiate Private Architecture Sync"
        />
      </div>

      {/* Strategic Pathways & Related Links */}
      <div className="pt-12 border-t border-white/5 print:hidden">
        <RelatedPagesGrid links={[
          {
            title: "AI Readiness Assessment",
            tag: "Next Step • Diagnostics",
            desc: "Evaluate regulatory compliance thresholds, organizational readiness index, and legacy systems compatibility.",
            href: "/build/assessment"
          },
          {
            title: "ROI Calculator",
            tag: "Next Step • Economic Engine",
            desc: "Model multi-year cost savings, task volume automation, and sovereign license multiplier baseline.",
            href: "/build/roi"
          },
          {
            title: "Proposal Builder",
            tag: "Next Step • Commercial Studio",
            desc: "Compile automated corporate Statements of Work (SOW) and export formatted project presentation decks.",
            href: "/build/proposal"
          },
          {
            title: "Talk to Agent",
            tag: "Next Step • Interactive Synapse",
            desc: "Interface with GFF's cognitive supervisors to co-engineer and map legacy process variables.",
            href: "/build/talk"
          },
          {
            title: "Sovereign Blueprint Platform",
            tag: "GFF Platform Module",
            desc: "Deploy highly hardened single-tenant visual nodes topologies mapped to your technical specifications.",
            href: "/platforms/blueprint"
          },
          {
            title: "Transformation Strategy",
            tag: "Core GFF Capability",
            desc: "Explore how we re-architect legacy stacks into zero-retention private AI engines.",
            href: "/capabilities/strategy"
          }
        ]} />
      </div>

      {/* Sovereign History Vault Drawer */}
      <SovereignHistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedList={savedList}
        onPurge={() => {
          if (confirm("Are you sure you want to delete all cached assessments? This cannot be undone.")) {
            setSavedList([]);
            localStorage.removeItem("gff_blueprint_history");
            setHistoryLoaded(null);
          }
        }}
        onDeleteSingle={(id) => {
          const updated = savedList.filter(x => x.id !== id);
          setSavedList(updated);
          localStorage.setItem("gff_blueprint_history", JSON.stringify(updated));
          if (historyLoaded === id) {
            setHistoryLoaded(null);
          }
        }}
        onLoadItem={(item) => {
          if (stepperActions) {
            const savedResult = onCompile(item.data);
            stepperActions.loadState(item.data, savedResult);
            setHistoryLoaded(item.id);
            setIsDrawerOpen(false);
          }
        }}
        historyLoadedId={historyLoaded}
      />
    </div>
  );
}

