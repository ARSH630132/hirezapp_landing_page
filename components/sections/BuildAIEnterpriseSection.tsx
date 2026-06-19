"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { pageFadeVariants } from "@/lib/animations";
import {
  blueprintFields,
  defaultBlueprint,
  generateBlueprint,
  getEmptyBlueprintAnswers,
  getFieldLabel,
  getSelectedOptionLabel,
  isBlueprintComplete,
  type BlueprintAnswers,
  type BlueprintFieldKey,
  type BlueprintResult,
} from "@/lib/blueprint-data";

function GlassDialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="blueprint-dialog-title">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/60 backdrop-blur-[10px] cursor-default"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,rgba(10,16,32,0.82)_0%,rgba(4,8,18,0.9)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-[20px]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="h-[4px] w-full bg-[linear-gradient(90deg,#087DF3_0%,#4835C6_50%,#B11C58_100%)]" />
            <div className="p-6 sm:p-8">
              <h3 id="blueprint-dialog-title" className="text-[22px] sm:text-[26px] font-semibold text-white">
                {title}
              </h3>
              {description && <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.5] text-white/65">{description}</p>}
              <div className="mt-6">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function BuildAIEnterpriseSection() {
  const [answers, setAnswers] = useState<BlueprintAnswers>(getEmptyBlueprintAnswers);
  const [activeField, setActiveField] = useState<BlueprintFieldKey | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintResult>(defaultBlueprint);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const activeFieldConfig = blueprintFields.find((field) => field.key === activeField);

  const openField = useCallback((key: BlueprintFieldKey) => {
    setValidationError(null);
    setActiveField(key);
  }, []);

  const closeField = useCallback(() => setActiveField(null), []);

  const selectOption = useCallback(
    (key: BlueprintFieldKey, value: string) => {
      setAnswers((current) => ({ ...current, [key]: value }));
      setValidationError(null);
      setActiveField(null);
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (!isBlueprintComplete(answers)) {
      const firstMissing = blueprintFields.find((field) => !answers[field.key]);
      setValidationError("Please complete all fields before generating your blueprint.");
      if (firstMissing) setActiveField(firstMissing.key);
      return;
    }

    setValidationError(null);
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setBlueprint(generateBlueprint(answers));
    setHasGenerated(true);
    setIsGenerating(false);
  }, [answers]);

  const operatingModelItems = blueprint.operatingModel;
  const architectureItems = blueprint.architecture;
  const roadmapPhases = blueprint.roadmap;

  return (
    <motion.section
      id="blueprint"
      className="w-[calc(100%-24px)] lg:w-[calc(100%-128px)] max-w-[1792px] mx-auto rounded-[20px] border border-[#151926] bg-[#000613] px-4 sm:px-6 py-16 overflow-hidden"
      variants={pageFadeVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_320px] xl:grid-cols-[430px_1fr_340px] gap-6 xl:gap-8">
        <div className="pl-0 lg:pl-[22px]">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] leading-none font-semibold text-[#E8EDFF] uppercase">
            BUILD YOUR <br /> AI ENTERPRISE
          </h2>

          <p className="mt-6 text-[#C1C1C1] text-[15px] lg:text-[18px] leading-[1.45] font-medium max-w-[414px]">
            Answer a few questions. Our AI engine will design your operating model, architecture, agent ecosystem and transformation roadmap.
          </p>

          <div className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-3 w-full max-w-[550px]">
            {blueprintFields.map((field) => {
              const selected = answers[field.key];
              const isComplete = Boolean(selected);

              return (
                <button
                  key={field.key}
                  type="button"
                  onClick={() => openField(field.key)}
                  className={`w-full min-h-[48px] rounded-[10px] border text-left text-[15px] lg:text-[16px] leading-tight font-semibold px-5 py-3 flex items-center gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-colors ${
                    isComplete
                      ? "border-[#087DF3]/50 bg-[#0a1630] text-white"
                      : "border-[#2F2B3E] bg-[#070D1D] text-white hover:border-[#3d4660]"
                  }`}
                >
                  <Image src="/ai_enterprise/Arrow - Right 4.png" alt="" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                  <span className="min-w-0">
                    {isComplete ? (
                      <>
                        <span className="block text-[12px] font-medium text-[#8EA6D8]">{field.label}</span>
                        <span className="block truncate">{getSelectedOptionLabel(field.key, selected)}</span>
                      </>
                    ) : (
                      field.label
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {validationError && (
            <p className="mt-4 text-[14px] font-medium text-[#FF6B6B] max-w-[550px]">{validationError}</p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-8 w-full max-w-[550px] h-[50px] rounded-[10px] text-white text-[16px] font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(270deg, #087DF3 0%, #4835C6 50%, #B11C58 100%)" }}
          >
            {isGenerating ? "GENERATING..." : "GENERATE BLUEPRINT →"}
          </button>
        </div>

        <div className="lg:col-span-1 xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-center sm:text-left text-white text-[20px] sm:text-[24px] leading-none font-semibold uppercase tracking-[0.02em]">
              YOUR AI ENTERPRISE BLUEPRINT
            </h3>
            <button
              type="button"
              onClick={() => setInsightsOpen(true)}
              className="mx-auto sm:mx-0 shrink-0 h-[42px] px-5 rounded-[10px] border border-white/20 bg-white/[0.06] backdrop-blur-[8px] text-white text-[14px] font-semibold hover:bg-white/[0.1] transition-colors"
            >
              View Detailed Insights →
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[302px_1fr_302px] gap-6">
                <div className="space-y-5">
                  <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-[22px] py-6">
                    <h4 className="text-white text-[18px] leading-none font-semibold text-center">AI OPERATING MODEL</h4>
                    <div className="mt-5 space-y-4">
                      {operatingModelItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-[16px] font-semibold text-white">
                          <Image src="/ai_enterprise/Arrow - Right 4.png" alt="" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[14px] border border-white/20 bg-[#07101f] p-6">
                    <h4 className="text-white text-[18px] leading-none font-semibold">AGENT ECOSYSTEM</h4>
                    <p className="mt-3 text-[#C1C1C1] text-[18px] leading-none font-medium">{blueprint.agentCount} Agents Recommended</p>
                    <div className="mt-4 space-y-2">
                      {blueprint.agentTypes.map((type) => (
                        <p key={type} className="text-[14px] text-white/75 font-medium">
                          • {type}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Image src="/ai_enterprise/main.png" alt="AI Enterprise Blueprint" width={637} height={404} className="w-full max-w-[720px] h-auto object-contain" />
                </div>

                <div className="space-y-5">
                  <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6">
                    <h4 className="text-white text-[16px] lg:text-[18px] leading-none font-semibold text-center">AI ARCHITECTURE</h4>
                    <div className="mt-5 space-y-4">
                      {architectureItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 min-w-0">
                          <Image src="/ai_enterprise/Arrow - Right 4.png" alt="" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-[15px] lg:text-[16px] font-semibold text-white">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-white text-[16px] lg:text-[18px] leading-none font-semibold">GOVERNANCE FRAMEWORK</h4>
                    <p className="mt-3 text-[#C1C1C1] text-[16px] lg:text-[18px] leading-[1.5] font-medium">
                      {blueprint.governance.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full rounded-[16px] border border-white/20 bg-[#07101f] px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {roadmapPhases.map(({ phase, title, time, focus }) => (
                  <div key={phase} className="flex items-start gap-3">
                    <Image src="/intellegent_enterprise/robot.svg" alt="" width={50} height={50} className="w-[44px] h-[44px] lg:w-[50px] lg:h-[50px] object-contain shrink-0" />
                    <div>
                      <p className="text-[#C1C1C1] text-[15px] leading-none font-medium uppercase">{phase}</p>
                      <h5 className="text-[18px] leading-[1.2] font-semibold text-white">{title}</h5>
                      <p className="text-[#C1C1C1] text-[16px] leading-none font-medium">{time}</p>
                      <p className="mt-2 text-[13px] leading-[1.4] text-white/55">{focus}</p>
                    </div>
                  </div>
                ))}
              </div>
        </div>
      </div>

      <GlassDialog
        open={Boolean(activeField && activeFieldConfig)}
        onClose={closeField}
        title={activeFieldConfig?.label ?? ""}
        description={activeFieldConfig?.description}
      >
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {activeFieldConfig?.options.map((option) => {
            const isSelected = activeField ? answers[activeField] === option.value : false;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => activeField && selectOption(activeField, option.value)}
                className={`w-full rounded-[12px] border px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-[#087DF3] bg-[#087DF3]/15"
                    : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                }`}
              >
                <p className="text-[16px] font-semibold text-white">{option.label}</p>
                {option.detail && <p className="mt-1 text-[13px] leading-[1.45] text-white/60">{option.detail}</p>}
              </button>
            );
          })}
        </div>
      </GlassDialog>

      <GlassDialog open={insightsOpen} onClose={() => setInsightsOpen(false)} title="Detailed Blueprint Insights" description={blueprint.insights.summary}>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {hasGenerated && (
              <div>
                <h4 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#8EA6D8]">Your Inputs</h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(answers) as BlueprintFieldKey[]).map((key) => (
                    <div key={key} className="rounded-[10px] bg-white/[0.04] border border-white/8 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-white/45">{getFieldLabel(key)}</p>
                      <p className="mt-1 text-[14px] font-medium text-white">{getSelectedOptionLabel(key, answers[key])}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#8EA6D8]">Key Recommendations</h4>
              <ul className="mt-3 space-y-2">
                {blueprint.insights.recommendations.map((item) => (
                  <li key={item} className="flex gap-2 text-[14px] leading-[1.5] text-white/80">
                    <span className="text-[#087DF3] shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
                <h5 className="text-[15px] font-semibold text-white">Agent Ecosystem</h5>
                <p className="mt-2 text-[14px] leading-[1.55] text-white/70">{blueprint.insights.agentEcosystemDetail}</p>
              </div>
              <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
                <h5 className="text-[15px] font-semibold text-white">AI Architecture</h5>
                <p className="mt-2 text-[14px] leading-[1.55] text-white/70">{blueprint.insights.architectureDetail}</p>
              </div>
              <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
                <h5 className="text-[15px] font-semibold text-white">Governance Framework</h5>
                <p className="mt-2 text-[14px] leading-[1.55] text-white/70">{blueprint.insights.governanceDetail}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#8EA6D8]">Transformation Notes</h4>
              <ul className="mt-3 space-y-2">
                {blueprint.insights.transformationNotes.map((note) => (
                  <li key={note} className="text-[14px] leading-[1.5] text-white/75">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setInsightsOpen(false)}
              className="w-full h-[44px] rounded-[10px] text-white text-[15px] font-semibold"
              style={{ background: "linear-gradient(270deg, #087DF3 0%, #4835C6 50%, #B11C58 100%)" }}
            >
              Close
            </button>
          </div>
      </GlassDialog>
    </motion.section>
  );
}
