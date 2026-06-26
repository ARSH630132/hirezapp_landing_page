"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolStepLayout, ToolSidebarProgress, ToolPreviewNotice } from "./components";

export interface WizardStep<T = any> {
  id: string;
  label: string;
  description: string;
  duration?: string;
  validate?: (data: T) => string | null;
  render: (params: {
    data: T;
    onChange: (newData: Partial<T>) => void;
    error: string | null;
  }) => React.ReactNode;
}

export interface WizardStepperSystemActions<T = any> {
  loadState: (data: T, result: any) => void;
  reset: () => void;
}

interface WizardStepperSystemProps<T = any> {
  toolName: string;
  category: string;
  toolDescription: string;
  steps: WizardStep<T>[];
  initialData: T;
  summaryItems: (data: T) => { label: string; value: string; color?: string }[];
  onCompile: (data: T) => Promise<any> | any;
  renderResult: (data: T, result: any, onReset: () => void) => React.ReactNode;
  compilingMessages?: string[];
  metricLabel?: string;
  metricValue?: string;
  onInit?: (actions: WizardStepperSystemActions<T>) => void;
}

export function WizardStepperSystem<T = any>({
  toolName,
  category,
  toolDescription,
  steps,
  initialData,
  summaryItems,
  onCompile,
  renderResult,
  compilingMessages = [
    "Establishing secure network baseline...",
    "Scanning database schemas...",
    "Compiling sovereign execution graphs...",
    "Synthesizing dynamic specifications..."
  ],
  metricLabel,
  metricValue,
  onInit
}: WizardStepperSystemProps<T>) {
  const [data, setData] = useState<T>(initialData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isCompiling) return;
    const interval = setInterval(() => {
      setCompilingStep((prev) => {
        if (prev < compilingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setResult(onCompile(data));
          setIsCompiling(false);
          setShowResult(true);
          return prev;
        }
      });
    }, 700);
    return () => clearInterval(interval);
  }, [isCompiling, data, compilingMessages, onCompile]);

  const handleNext = () => {
    setError(null);
    if (currentStep.validate) {
      const valErr = currentStep.validate(data);
      if (valErr) {
        setError(valErr);
        return;
      }
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompiling(true);
      setCompilingStep(0);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setData(initialData);
    setCurrentStepIndex(0);
    setError(null);
    setResult(null);
    setShowResult(false);
    setIsCompiling(false);
  };

  const handleDataChange = (newData: Partial<T>) => {
    setError(null);
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleStepClick = (index: number) => {
    if (index === currentStepIndex) return;
    if (index > currentStepIndex) {
      for (let i = currentStepIndex; i < index; i++) {
        if (steps[i].validate) {
          const err = steps[i].validate!(data);
          if (err) {
            setError(`Step "${steps[i].label}" error: ${err}`);
            setCurrentStepIndex(i);
            return;
          }
        }
      }
    }
    setError(null);
    setCurrentStepIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        if (e.key === "Enter" && tag === "INPUT") {
          e.preventDefault();
          handleNext();
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handleBack();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, data]);

  useEffect(() => {
    if (onInit) {
      onInit({
        loadState: (savedData: T, savedResult: any) => {
          setData(savedData);
          setResult(savedResult);
          setShowResult(true);
          setIsCompiling(false);
          setCurrentStepIndex(steps.length - 1);
        },
        reset: () => {
          setData(initialData);
          setCurrentStepIndex(0);
          setError(null);
          setResult(null);
          setShowResult(false);
          setIsCompiling(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, steps.length, onInit]);

  const manifest = summaryItems(data);

  return (
    <div className="w-full space-y-8 animate-fadeIn text-white">
      <AnimatePresence mode="wait">
        {isCompiling && (
          <motion.div key="compiling" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-3xl mx-auto min-h-[350px] rounded-2xl border border-white/5 bg-[#030306]/95 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-t-[#009DFF] animate-spin" />
                <div>
                  <h3 className="text-sm font-bold font-mono">SOVEREIGN SYNTHESIZER CORE</h3>
                  <p className="text-[10px] text-[#00FF9D] font-mono">STATUS: COMPILING</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-white/70 min-h-[160px] flex flex-col justify-end">
                <p className="text-white/30">&gt; GFF COMPILER SESSION INITIALIZED...</p>
                {compilingMessages.slice(0, compilingStep + 1).map((msg, i) => (
                  <p key={i} className="text-[#00FF9D]">&gt; ✔ {msg}</p>
                ))}
              </div>
            </div>
            <p className="text-[9px] font-mono text-white/35">AIR-GAPPED SHIELD • 0% STORAGE RETENTION ENFORCED</p>
          </motion.div>
        )}

        {showResult && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            {renderResult(data, result, handleReset)}
          </motion.div>
        )}

        {!isCompiling && !showResult && (
          <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <ToolStepLayout
              sidebar={
                <div className="space-y-6">
                  <ToolSidebarProgress steps={steps.map(s => ({ id: s.id, label: s.label, description: s.description, duration: s.duration }))} currentStepIndex={currentStepIndex} onStepClick={handleStepClick} />
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#030305]/95 relative overflow-hidden">
                    <div className="border-b border-white/5 pb-2 mb-3">
                      <span className="text-[9px] font-mono text-[#00FF9D] font-bold block">LIVE VARIABLE BUFFER</span>
                    </div>
                    <div className="space-y-2">
                      {manifest.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-white/[0.02]">
                          <span className="text-white/40 font-mono text-[9px]">{item.label}</span>
                          <span className="font-bold truncate max-w-[150px]" style={item.color ? { color: item.color } : undefined}>{item.value || "WAITING"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ToolPreviewNotice />
                </div>
              }
              content={
                <div className="p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/90 min-h-[440px] flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 uppercase tracking-wider font-bold">GATE {currentStepIndex + 1} OF {steps.length}</span>
                      <h2 className="text-xl font-bold tracking-tight mt-2">{currentStep.label}</h2>
                      <p className="text-white/50 text-xs mt-1 font-light">{currentStep.description}</p>
                    </div>
                    <div className="py-2 min-h-[140px]">{currentStep.render({ data, onChange: handleDataChange, error })}</div>
                  </div>
                  <div className="space-y-4 border-t border-white/5 pt-6 mt-4">
                    {error && (
                      <div className="p-3.5 rounded-xl bg-[#E4000F]/5 border border-[#E4000F]/15 flex gap-2 text-xs text-white/80">
                        <span className="text-[#E4000F] font-bold">!</span>
                        <p>{error}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-4">
                      <button type="button" onClick={handleBack} disabled={currentStepIndex === 0} className={`px-5 h-10 rounded-lg border text-xs font-semibold uppercase flex items-center gap-2 ${currentStepIndex === 0 ? "border-white/5 text-white/10 cursor-not-allowed" : "border-white/10 text-white hover:bg-white/5"}`}>Back</button>
                      {currentStepIndex > 0 && <button type="button" onClick={handleReset} className="text-[10px] font-mono text-white/30 hover:text-white uppercase">[Reset]</button>}
                      <button type="button" onClick={handleNext} className="px-6 h-10 rounded-lg text-xs font-bold uppercase bg-[#009DFF] text-black hover:bg-[#009DFF]/90 font-mono shadow-[0_0_15px_rgba(0,157,255,0.25)] flex items-center gap-2">
                        <span>{currentStepIndex === steps.length - 1 ? "Sovereign Compile" : "Next Gate"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
