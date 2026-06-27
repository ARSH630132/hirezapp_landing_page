"use client";

export interface GFFWorkspace {
  assessment?: { answers: Record<string, number>; activeDimensionIndex: number; showResult: boolean; lastUpdated?: string };
  roi?: { industry: string; companySize: string; opFunction: string; annualCostBaseline: number; processVolume: number; avgHandlingTime: number | ""; automationTarget: number; manualEffort: string; productivityImprovement: number; implementationHorizon: string; initialInvestment: number; priority: string; lastUpdated?: string };
  proposal?: { companyName: string; industry: string; companySize: string; primaryChallenge: string; customChallenge: string; priorityOutcomes: string[]; targetTimeline: string; preferredEngagementPath: string; budgetRange: string; geography: string; stakeholders: string; lastUpdated?: string };
  talk?: { currentStep: number; data: any; showResults: boolean; lastUpdated?: string };
  sandbox?: { selectedIndustry: string; selectedFunction: string; selectedAgentType: string; searchQuery: string; activeAgentId: string; lastUpdated?: string };
  marketplace?: { activeTab: string; industryFilter: string; functionFilter: string; maturityFilter: string; platformFilter: string; searchQuery: string; compareIds: string[]; lastUpdated?: string };
  foundryStudio?: { selectedPresetId: string; selectedPattern: string; stages: any[]; knowledgeSources: string[]; lastUpdated?: string };
}

const WORKSPACE_KEY = "gff_local_workspace_continuity";
const BLUEPRINT_KEY = "gff_blueprint_history";
const PROPOSAL_KEY = "gff_proposal_draft_intake";

const isBrowser = typeof window !== "undefined";

export function getFullWorkspace(): GFFWorkspace {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("GFF Workspace read error:", err);
    return {};
  }
}

export function saveFullWorkspace(ws: GFFWorkspace) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(ws));
  } catch (err) {
    console.error("GFF Workspace save error:", err);
  }
}

export function getToolState<K extends keyof GFFWorkspace>(tool: K): GFFWorkspace[K] {
  if (!isBrowser) return undefined;
  if (tool === "proposal") {
    const consolidated = getFullWorkspace().proposal;
    if (consolidated) return consolidated as GFFWorkspace[K];
    try {
      const rawLegacy = localStorage.getItem(PROPOSAL_KEY);
      if (rawLegacy) return JSON.parse(rawLegacy) as GFFWorkspace[K];
    } catch {}
  }
  return getFullWorkspace()[tool];
}

export function saveToolState<K extends keyof GFFWorkspace>(tool: K, state: any) {
  if (!isBrowser) return;
  const ws = getFullWorkspace();
  const updated = { ...state, lastUpdated: new Date().toISOString() };
  ws[tool] = updated;
  saveFullWorkspace(ws);

  if (tool === "proposal") {
    try {
      localStorage.setItem(PROPOSAL_KEY, JSON.stringify(state));
    } catch {}
  }
}

export function getBlueprintHistory(): any[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(BLUEPRINT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearToolState(tool: keyof GFFWorkspace | "blueprint") {
  if (!isBrowser) return;
  if (tool === "blueprint") {
    try {
      localStorage.removeItem(BLUEPRINT_KEY);
    } catch {}
    return;
  }
  const ws = getFullWorkspace();
  delete ws[tool];
  saveFullWorkspace(ws);
  if (tool === "proposal") {
    try {
      localStorage.removeItem(PROPOSAL_KEY);
    } catch {}
  }
}

export function purgeAllWorkspace() {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(WORKSPACE_KEY);
    localStorage.removeItem(BLUEPRINT_KEY);
    localStorage.removeItem(PROPOSAL_KEY);
  } catch {}
}

export function hasAnyWorkspace(): boolean {
  if (!isBrowser) return false;
  const ws = getFullWorkspace();
  if (Object.keys(ws).length > 0) return true;
  if (getBlueprintHistory().length > 0) return true;
  if (localStorage.getItem(PROPOSAL_KEY)) return true;
  return false;
}
