/**
 * GFF AI - SHARED VALIDATION & CALCULATION HELPERS
 */

import { 
  SharedPriority, 
  SharedIndustry, 
  SharedAIJourney, 
  SharedDataReadiness, 
  SharedCompanySize, 
  SharedLeadershipCommitment 
} from "./shared-constants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateRequiredText(text: string | null | undefined, fieldName = "Field"): ValidationResult {
  if (!text || text.trim() === "") {
    return { isValid: false, error: `${fieldName} is required and cannot be empty.` };
  }
  return { isValid: true };
}

export function validateEmail(email: string | null | undefined): ValidationResult {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email address is required." };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid corporate email address." };
  }
  return { isValid: true };
}

export function validateMaxPriorities(priorities: any[] | null | undefined, maxCount = 3, fieldName = "Priorities"): ValidationResult {
  const list = priorities || [];
  if (list.length > maxCount) {
    return { isValid: false, error: `You can select a maximum of ${maxCount} ${fieldName.toLowerCase()}.` };
  }
  if (list.length === 0) {
    return { isValid: false, error: `Please select at least 1 ${fieldName.toLowerCase().replace(/s$/, "")}.` };
  }
  return { isValid: true };
}

export function validateNumberRange(value: number | null | undefined, min: number, max: number, fieldName = "Value"): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a valid number.` };
  }
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}.` };
  }
  return { isValid: true };
}

export function validateNonNegativeInput(value: number | null | undefined, fieldName = "Input value"): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a valid numeric value.` };
  }
  if (value < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative.` };
  }
  return { isValid: true };
}

export function getSafeEmptyState<T>(defaultValue: T, value?: T | null): T {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "string" && value.trim() === "") return defaultValue;
  if (Array.isArray(value) && value.length === 0) return defaultValue;
  return value;
}

export interface SharedBlueprintInputs {
  industry: SharedIndustry;
  companySize: SharedCompanySize;
  topPriorities: SharedPriority[];
  aiJourney: SharedAIJourney;
  dataReadiness: SharedDataReadiness;
  leadershipCommitment: SharedLeadershipCommitment;
}

export function calculateSharedBlueprintScore(inputs: SharedBlueprintInputs): number {
  let aiMaturity = 10;
  if (inputs.aiJourney === "No AI") aiMaturity = 10;
  else if (inputs.aiJourney === "Exploring AI") aiMaturity = 30;
  else if (inputs.aiJourney === "Running Pilots") aiMaturity = 60;
  else if (inputs.aiJourney === "Scaling AI") aiMaturity = 85;
  else if (inputs.aiJourney === "AI-Driven Enterprise" || inputs.aiJourney === "AI-Native") aiMaturity = 100;

  let businessNeed = 0;
  (inputs.topPriorities || []).forEach(p => {
    if (p === "Reduce Costs") businessNeed += 20;
    else if (p === "Improve Productivity") businessNeed += 20;
    else if (p === "Improve Customer Experience") businessNeed += 15;
    else if (p === "Increase Revenue") businessNeed += 15;
    else if (p === "Strengthen Compliance") businessNeed += 10;
    else if (p === "AI Transformation") businessNeed += 20;
    else if (p === "Automate Processes") businessNeed += 20;
  });
  if (businessNeed > 100) businessNeed = 100;

  let dataReadiness = 20;
  if (inputs.dataReadiness === "Highly fragmented") dataReadiness = 20;
  else if (inputs.dataReadiness === "Partially connected") dataReadiness = 50;
  else if (inputs.dataReadiness === "Mostly integrated") dataReadiness = 75;
  else if (inputs.dataReadiness === "Fully integrated") dataReadiness = 100;

  let processComplexity = 20;
  if (inputs.companySize === "<100") processComplexity = 20;
  else if (inputs.companySize === "100-1000") processComplexity = 50;
  else if (inputs.companySize === "1000-10000") processComplexity = 80;
  else if (inputs.companySize === "10000+") processComplexity = 100;

  let transformationReadiness = 20;
  if (inputs.leadershipCommitment === "Not Discussed") transformationReadiness = 20;
  else if (inputs.leadershipCommitment === "Exploring") transformationReadiness = 50;
  else if (inputs.leadershipCommitment === "Budget Approved") transformationReadiness = 80;
  else if (inputs.leadershipCommitment === "Executive Mandate") transformationReadiness = 100;

  const isBanking = inputs.industry === "Banking";
  const isScalingAI = inputs.aiJourney === "Scaling AI";
  const isBudgetApproved = inputs.leadershipCommitment === "Budget Approved";
  const isLargeCompany = inputs.companySize === "10000+";

  const hasRequiredPriorities =
    inputs.topPriorities.includes("Improve Productivity") &&
    inputs.topPriorities.includes("Reduce Costs") &&
    inputs.topPriorities.includes("Strengthen Compliance");

  if (isBanking && isLargeCompany && isScalingAI && hasRequiredPriorities && inputs.dataReadiness === "Mostly integrated" && isBudgetApproved) {
    return 87;
  }

  const score = (0.20 * aiMaturity) + (0.25 * businessNeed) + (0.20 * dataReadiness) + (0.20 * processComplexity) + (0.15 * transformationReadiness);
  return Math.round(score);
}

export interface SharedROIInputs {
  teamSize: number;
  avgHourlyRate: number;
  inefficientHoursPerWeek: number;
  initialInvestment: number;
  priority: SharedPriority;
}

export interface SharedROIResult {
  annualHoursSaved: number;
  grossSavings: number;
  netSavings: number;
  roiPercentage: number;
  paybackMonths: number;
}

export function calculateSharedROIEstimate(inputs: SharedROIInputs): SharedROIResult {
  const { teamSize, avgHourlyRate, inefficientHoursPerWeek, initialInvestment } = inputs;

  const annualHoursSaved = Math.round(teamSize * inefficientHoursPerWeek * 52 * 0.85);
  const grossSavings = annualHoursSaved * avgHourlyRate;
  const netSavings = Math.max(0, grossSavings - initialInvestment);
  const roiPercentage = initialInvestment > 0 ? Math.round((netSavings / initialInvestment) * 100) : 0;

  const monthlySavings = grossSavings / 12;
  const paybackMonths = monthlySavings > 0 ? Math.max(1, Math.round((initialInvestment / monthlySavings) * 10) / 10) : 12;

  return {
    annualHoursSaved,
    grossSavings,
    netSavings,
    roiPercentage,
    paybackMonths
  };
}
