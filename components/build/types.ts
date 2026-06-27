export type Industry =
  | "banking"
  | "insurance"
  | "healthcare"
  | "life-sciences"
  | "retail"
  | "manufacturing"
  | "telecom"
  | "energy"
  | "mining"
  | "public-sector"
  | "education"
  | "tax"
  | "audit"
  | "legal"
  | "advisory";

export type CompanySize = "small" | "medium" | "enterprise" | "global-conglomerate";

export type AIJourney =
  | "exploring"  // Discovery phase
  | "piloting"   // Integration setup
  | "scaling"    // Deep orchestration
  | "optimized"; // Continuous adaptation

export type DataReadiness = "raw" | "structured" | "hybrid" | "vectorized" | "fully-governed";

export type Priority =
  | "cost_reduction"
  | "compliance_security"
  | "operational_speed"
  | "customer_experience"
  | "decision_automation";

export interface AssessmentAnswers {
  dataIntegration: number;     // Range 1 to 5
  vpcIsolation: number;        // Range 1 to 5
  complianceTelemetry: number; // Range 1 to 5
  fleetStrategy: number;       // Range 1 to 5
  industry: Industry;
}

export interface AssessmentResult {
  score: number;
  level: string;
  color: string;
  description: string;
  dimensionScores: {
    label: string;
    score: number;
    description: string;
    recommendation: string;
  }[];
  strategicPriority: string;
  securityClearance: string;
}

export interface ROIInputs {
  teamSize: number;
  avgHourlyRate: number;
  inefficientHoursPerWeek: number;
  initialInvestment: number;
  priority: Priority;
}

export interface ROIResult {
  annualHoursSaved: number;
  grossSavings: number;
  netSavings: number;
  roiPercentage: number;
  paybackMonths: number;
  costAllocations: {
    label: string;
    percentage: number;
    amount: number;
    color: string;
  }[];
  efficiencyMultiplier: string;
}

export interface ProposalInputs {
  companyName: string;
  industry: Industry;
  companySize: CompanySize;
  dataReadiness: DataReadiness;
  priorities: Priority[];
  budgetRange: string;
}

export interface ProposalResult {
  projectName: string;
  implementationWeeks: number;
  architecturePhases: {
    name: string;
    weeks: number;
    objectives: string[];
    deliverables: string[];
  }[];
  recommendedAgentTopologies: {
    name: string;
    role: string;
    latency: string;
    governanceMode: string;
  }[];
  estimatedLicenseCost: string;
  exportOutline: string[];
}

export interface SandboxAgent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "completed" | "error";
  latency: string;
  successRate: string;
  steps: {
    label: string;
    status: "pending" | "running" | "success" | "error";
    detail: string;
  }[];
}

export interface MarketplaceAgent {
  id: string;
  name: string;
  category: "CONNECTOR" | "COGNITIVE_NODE" | "AUDITOR" | "SUPERVISOR";
  description: string;
  compatibility: string[];
  priceToken: string;
  rating: number;
  downloads: number;
  badge?: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  timestamp: string;
  type: "roi" | "assessment" | "proposal" | "blueprint";
  summary: string;
  score?: number;
  savingsEstimate?: number;
  recommendedSteps: string[];
  metadata: Record<string, string | number | boolean>;
}
