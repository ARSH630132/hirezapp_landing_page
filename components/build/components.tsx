"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import AnimatedBackgroundGrid from "@/components/inner-pages/AnimatedBackgroundGrid";

// ==========================================
// 1. ToolPageShell
// ==========================================
interface ToolPageShellProps {
  children: React.ReactNode;
  showContact?: boolean;
}

export function ToolPageShell({ children, showContact = true }: ToolPageShellProps) {
  return (
    <InnerPageShell showContact={showContact}>
      <div className="relative min-h-screen bg-[#020204] overflow-hidden">
        {/* Subtle decorative background laser lines */}
        <div className="absolute top-0 left-1/4 w-px h-96 bg-gradient-to-b from-[#009DFF]/20 via-[#009DFF]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-px h-[600px] bg-gradient-to-b from-[#E4000F]/15 via-[#E4000F]/0 to-transparent pointer-events-none" />
        
        {/* Animated grid from global templates */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <AnimatedBackgroundGrid />
        </div>

        {/* Live telemetry security bar */}
        <div className="relative z-10 w-full border-b border-white/5 bg-[#030306]/95 backdrop-blur-md px-6 py-2.5">
          <div className="max-w-[1795px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono tracking-wider">
            <div className="flex items-center gap-2 text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              <span>GFF ENGINE STATUS: <span className="text-white font-bold text-[#00FF9D]">SOVEREIGN_CONNECTED</span></span>
            </div>
            <div className="flex items-center gap-6 text-white/40">
              <span>ZERO LANDING RETENTION: <span className="text-[#00FF9D]">ENFORCED</span></span>
              <span className="hidden sm:inline">DATA PERIMETER: <span className="text-white font-semibold">SINGLE-TENANT VPC</span></span>
              <span>TOKEN LATENCY: <span className="text-[#009DFF] font-semibold">&lt; 150MS</span></span>
            </div>
          </div>
        </div>

        {/* Main Workspace Frame */}
        <div className="relative z-10 max-w-[1795px] mx-auto px-6 lg:px-16 py-8 pb-32">
          {children}
        </div>
      </div>
    </InnerPageShell>
  );
}

// ==========================================
// 2. ToolHero
// ==========================================
interface ToolHeroProps {
  category: string;
  title: string;
  highlightedWord?: string;
  description: string;
  metricLabel?: string;
  metricValue?: string;
}

export function ToolHero({
  category,
  title,
  highlightedWord,
  description,
  metricLabel,
  metricValue
}: ToolHeroProps) {
  const parts = highlightedWord ? title.split(highlightedWord) : [title];

  return (
    <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeIn">
      <div className="space-y-3 max-w-4xl">
        <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-widest block">
          {category}
        </span>
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
          {highlightedWord && parts.length > 1 ? (
            <>
              {parts[0]}
              <span className="bg-gradient-to-r from-white via-white to-[#009DFF] bg-clip-text text-transparent">
                {highlightedWord}
              </span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-white/60 text-xs lg:text-sm font-light max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {metricLabel && metricValue && (
        <div className="p-4 px-6 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-start min-w-[200px] shrink-0">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{metricLabel}</span>
          <span className="text-xl font-bold text-[#00FF9D] mt-1 font-mono tracking-tight">{metricValue}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. ToolStepLayout
// ==========================================
interface ToolStepLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export function ToolStepLayout({ sidebar, content }: ToolStepLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
        {sidebar}
      </div>
      <div className="lg:col-span-8 order-1 lg:order-2">
        {content}
      </div>
    </div>
  );
}


// ==========================================
// 4. ToolSidebarProgress
// ==========================================
interface Step {
  id: string;
  label: string;
  description?: string;
  duration?: string;
}

interface ToolSidebarProgressProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

export function ToolSidebarProgress({ steps, currentStepIndex, onStepClick }: ToolSidebarProgressProps) {
  const percentage = Math.round((currentStepIndex / (steps.length - 1)) * 100);

  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/80 backdrop-blur-sm space-y-6">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">CONSTRUCT PIPELINE</span>
        <span className="text-xs font-mono text-white/40">{percentage}% COMPLETED</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#009DFF] to-[#00FF9D] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-4 pt-2 relative">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <motion.button
              key={step.id}
              onClick={() => onStepClick && onStepClick(idx)}
              disabled={!onStepClick || (!isCompleted && !isActive)}
              whileHover={isCompleted || isActive ? { x: 3 } : {}}
              transition={{ duration: 0.2 }}
              className={`w-full text-left flex gap-4 p-3 rounded-xl transition border text-xs group relative ${
                isActive
                  ? "text-white border-white/10"
                  : isCompleted
                  ? "bg-transparent border-transparent text-white/50 hover:text-white"
                  : "bg-transparent border-transparent text-white/20 cursor-not-allowed"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveBg"
                  className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Step Marker */}
              <div className="mt-0.5 shrink-0 relative z-10">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] border transition ${
                    isActive
                      ? "border-[#009DFF] text-[#009DFF] bg-[#009DFF]/10"
                      : isCompleted
                      ? "border-[#00FF9D] text-[#00FF9D] bg-[#00FF9D]/5"
                      : "border-white/10 text-white/20"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
              </div>

              {/* Step Info */}
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isActive ? "text-[#009DFF]" : ""}`}>{step.label}</span>
                  {step.duration && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/30 uppercase">
                      {step.duration}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-white/40 font-light leading-relaxed group-hover:text-white/60 transition">
                    {step.description}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}



// ==========================================
// 5. ToolPreviewNotice
// ==========================================
export function ToolPreviewNotice() {
  // return (
  //   <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-start gap-3.5 text-xs">
  //     <div className="p-2 rounded bg-white/5 border border-white/10 shrink-0 mt-0.5 text-[#009DFF]">
  //       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m0-6v2m0-6h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
  //       </svg>
  //     </div>
  //     <div className="space-y-1">
  //       <h4 className="font-bold text-white font-mono text-[10px] uppercase tracking-wider">SANDBOX COMPLIANCE SIMULATION</h4>
  //       <p className="text-white/50 text-[11px] leading-relaxed font-light">
  //         This modeling framework operates as a localized Web Sandbox in compliance with GFF security blueprints. 
  //         Calculations are calculated deterministically on memory buffers. In keeping with our zero-retention architecture, 
  //         no parameter schemas or variables are sent to public clouds.
  //       </p>
  //     </div>
  //   </div>
  // );
}

// ==========================================
// 6. ToolCTA
// ==========================================
interface ToolCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
  href?: string;
}

export function ToolCTA({
  title = "Ready to Execute This Topology?",
  description = "Connect with a GFF Enterprise Architect to compile your simulated sandbox specifications into a production-ready private enclave.",
  buttonText = "Secure Technical Sync",
  onAction,
  href = "/contact"
}: ToolCTAProps) {
  const content = (
    <div className="relative p-8 lg:p-10 rounded-2xl border border-white/5 bg-[#030305] flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#009DFF]/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
        {/* <span className="text-[9px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
          SOVEREIGN ENCLAVE ELEVATION
        </span> */}
        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-white/50 text-xs font-light leading-relaxed max-w-lg">{description}</p>
      </div>

      <div className="relative z-10 shrink-0">
        {onAction ? (
          <button
            onClick={onAction}
            className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#009DFF] hover:bg-[#009DFF]/90 transition uppercase tracking-wider flex items-center gap-2 group/btn shadow-[0_0_20px_rgba(0,157,255,0.2)]"
          >
            <span>{buttonText}</span>
            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <a
            href={href}
            className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#009DFF] hover:bg-[#009DFF]/90 transition uppercase tracking-wider inline-flex items-center gap-2 group/btn shadow-[0_0_20px_rgba(0,157,255,0.2)]"
          >
            <span>{buttonText}</span>
            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );

  return <div className="mt-16">{content}</div>;
}

// ==========================================
// 7. ToolMotionReveal
// ==========================================
interface ToolMotionRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function ToolMotionReveal({ children, delay = 0 }: ToolMotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}



// ==========================================
// 8. ToolResultPanel
// ==========================================
interface ToolResultPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: string;
  headerAction?: React.ReactNode;
}

export function ToolResultPanel({ title, subtitle, children, badge, headerAction }: ToolResultPanelProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#030305]/95 backdrop-blur-sm overflow-hidden shadow-2xl relative group">
      {/* Laser line overlay */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/35 to-transparent pointer-events-none" />

      {/* Panel Header */}
      <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {badge && (
              <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 uppercase tracking-wider">
                {badge}
              </span>
            )}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-white/40 font-light">{subtitle}</p>}
        </div>
        {headerAction && <div className="relative z-10">{headerAction}</div>}
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 9. ToolInputGroup
// ==========================================
interface ToolInputGroupProps {
  label: string;
  valueDisplay: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  accentColor?: string;
}

export function ToolInputGroup({ label, valueDisplay, description, children, accentColor = "#009DFF" }: ToolInputGroupProps) {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all space-y-3 relative group">
      {/* Corner laser glow indicator on hover */}
      <div
        className="absolute top-0 right-0 w-8 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute top-0 right-0 w-[1px] h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex justify-between items-baseline gap-4">
        <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color: accentColor }}>
          {valueDisplay}
        </span>
      </div>
      
      {description && <p className="text-[11px] text-white/40 font-light leading-relaxed">{description}</p>}
      
      <div className="pt-2 w-full">
        {children}
      </div>
    </div>
  );
}



// ==========================================
// 10. ToolOptionGrid
// ==========================================
interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

interface ToolOptionGridProps {
  options: OptionItem[];
  selectedId: string | string[];
  onChange: (id: string) => void;
  multiSelect?: boolean;
}

export function ToolOptionGrid({ options, selectedId, onChange, multiSelect = false }: ToolOptionGridProps) {
  const isSelected = (id: string) => {
    if (multiSelect && Array.isArray(selectedId)) {
      return selectedId.includes(id);
    }
    return selectedId === id;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((opt) => {
        const selected = isSelected(opt.id);
        const accent = opt.accentColor || "#009DFF";

        return (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            type="button"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.995 }}
            transition={{ duration: 0.15 }}
            className={`text-left p-5 rounded-xl border transition-all duration-300 relative group flex gap-4 cursor-pointer ${
              selected
                ? "bg-white/[0.03] border-white/15"
                : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
            }`}
          >
            {/* Custom glowing accent border */}
            <div
              className={`absolute inset-x-0 top-0 h-[1.5px] transition-all duration-300 pointer-events-none ${
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-35"
              }`}
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`
              }}
            />

            {opt.icon && (
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                  selected
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-white/[0.01] border-white/5 text-white/35 group-hover:text-white"
                }`}
                style={selected ? { color: accent, borderColor: `${accent}25` } : {}}
              >
                {opt.icon}
              </div>
            )}

            <div className="space-y-1">
              <span className={`text-xs font-bold transition-colors ${selected ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                {opt.title}
              </span>
              <p className="text-[11px] text-white/40 leading-relaxed font-light group-hover:text-white/50 transition">
                {opt.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ==========================================
// 11. ToolSummaryCard
// ==========================================
interface ToolSummaryCardProps {
  label: string;
  value: string | number;
  description?: string;
  accentColor?: string;
}

export function ToolSummaryCard({ label, value, description, accentColor = "#009DFF" }: ToolSummaryCardProps) {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-[#030305] flex flex-col justify-between hover:border-white/10 transition-all group relative">
      {/* Light edge beam */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
        }}
      />
      <div>
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">{label}</span>
        <span className="text-2xl lg:text-3xl font-bold text-white block mt-2 font-mono tracking-tight" style={{ textShadow: `0 0 15px ${accentColor}10` }}>
          {value}
        </span>
      </div>
      {description && (
        <p className="text-[11px] text-white/40 font-light mt-2 leading-tight">
          {description}
        </p>
      )}
    </div>
  );
}



// ==========================================
// 12. ToolEmptyState
// ==========================================
interface ToolEmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function ToolEmptyState({ title, description, actionText, onAction }: ToolEmptyStateProps) {
  return (
    <div className="p-8 lg:p-12 rounded-2xl border border-white/5 bg-[#030304]/80 backdrop-blur-sm text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
      {/* Schematic SVG Blueprint graphic */}
      <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/20 relative group">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-xl" />
        <svg className="w-8 h-8 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 20l-5.447-2.724A2 2 0 013 15.485V5.515a2 2 0 011.553-1.954l8.944-4.472a2 2 0 011.11 0l8.944 4.472A2 2 0 0121 5.515v9.97a2 2 0 01-1.553 1.954L15 20M9 20l3 1.5 3-1.5M9 20v-5m6 5v-5M12 2.25V15" />
        </svg>
      </div>

      <div className="space-y-2 max-w-sm">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">{title}</h4>
        <p className="text-white/40 text-xs font-light leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 hover:bg-[#009DFF]/10 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

// ==========================================
// 13. ToolTabs
// ==========================================
interface TabItem {
  id: string;
  label: string;
}

interface ToolTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (id: string) => void;
  accentColor?: string;
}

export function ToolTabs({ tabs, activeTabId, onChange, accentColor = "#009DFF" }: ToolTabsProps) {
  return (
    <div className="flex gap-1.5 p-1 rounded-xl bg-[#04060b] border border-white/5 self-start overflow-x-auto scrollbar-none w-full max-w-md">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
            className="relative px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors duration-200 cursor-pointer flex-1 text-center text-white/50 hover:text-white"
          >
            {/* Sliding backdrop indicator */}
            {isActive && (
              <motion.div
                layoutId="active-tool-tab"
                className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  borderTopColor: `${accentColor}30`,
                  borderBottomColor: `${accentColor}30`
                }}
              />
            )}
            
            <span className={`relative z-10 transition-colors ${isActive ? "text-white font-bold" : ""}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}



// ==========================================
// 14. ToolComparisonRail
// ==========================================
interface ComparisonRow {
  feature: string;
  gffSpec: string;
  standardSpec: string;
  isGffBetter?: boolean;
}

interface ToolComparisonRailProps {
  rows: ComparisonRow[];
}

export function ToolComparisonRail({ rows }: ToolComparisonRailProps) {
  return (
    <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.005]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[500px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-white/40">
              <th className="p-4 pl-6 font-medium">Core Metric / Capability</th>
              <th className="p-4 font-medium text-white">GFF Sovereign Nodes</th>
              <th className="p-4 font-medium">Standard Cloud / SaaS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-light">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-4 pl-6 text-white/70 group-hover:text-white transition-colors">{row.feature}</td>
                <td className="p-4 font-mono font-bold text-[#00FF9D] flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{row.gffSpec}</span>
                </td>
                <td className="p-4 text-white/40 font-mono">{row.standardSpec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 15. ToolDataCard
// ==========================================
interface ToolDataCardProps {
  label: string;
  value: string;
  status?: "optimal" | "warning" | "error" | "neutral";
  detail?: string;
}

export function ToolDataCard({ label, value, status = "neutral", detail }: ToolDataCardProps) {
  const statusColors = {
    optimal: "text-[#00FF9D]",
    warning: "text-amber-400",
    error: "text-[#E4000F]",
    neutral: "text-white/70"
  };

  return (
    <div className="p-4 rounded-xl border border-white/5 bg-[#030304]/60 flex flex-col justify-between hover:border-white/10 transition-colors">
      <div className="space-y-1">
        <span className="text-[9px] font-mono text-white/35 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline justify-between gap-4">
          <span className={`text-lg font-bold font-mono tracking-tight ${statusColors[status]}`}>{value}</span>
          
          {/* Miniature sparkline simulation */}
          <div className="w-12 h-6 overflow-hidden pointer-events-none opacity-40">
            <svg className="w-full h-full" viewBox="0 0 50 20">
              <path
                d="M 0 15 Q 12 5 25 12 T 50 8"
                fill="none"
                stroke={status === "optimal" ? "#00FF9D" : status === "error" ? "#E4000F" : "#009DFF"}
                strokeWidth={1.5}
              />
            </svg>
          </div>
        </div>
      </div>
      {detail && <p className="text-[10px] text-white/30 font-light mt-2 leading-none font-mono">{detail}</p>}
    </div>
  );
}

