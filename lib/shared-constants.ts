/**
 * GFF AI - SHARED CONSTANTS & DATA MODELS
 * Designed for 2026 Sovereign Enterprise AI Platform.
 */

export const SHARED_INDUSTRIES = [
  "Banking", "Healthcare", "Manufacturing", "Retail", "Education", 
  "Government", "Insurance", "Financial Services", "Life Sciences", 
  "Mining", "Energy", "Telecom", "Audit", "Tax", "Legal", "Advisory", "Other"
] as const;

export type SharedIndustry = typeof SHARED_INDUSTRIES[number];

export const SHARED_INDUSTRY_OPTIONS = SHARED_INDUSTRIES.map(ind => ({
  value: ind,
  label: ind === "Other" ? "Other Services / General" : ind + " Enterprise"
}));

export const SHARED_COMPANY_SIZES = ["<100", "100-1000", "1000-10000", "10000+"] as const;
export type SharedCompanySize = typeof SHARED_COMPANY_SIZES[number];

export const SHARED_COMPANY_SIZE_OPTIONS = [
  { value: "<100", label: "<100 employees" },
  { value: "100-1000", label: "100 - 1,000 employees" },
  { value: "1000-10000", label: "1,000 - 10,000 employees" },
  { value: "10000+", label: "10,000+ employees" }
] as const;

export const SHARED_AI_JOURNEYS = [
  "No AI", "Exploring AI", "Running Pilots", "Scaling AI", "AI-Driven Enterprise", "AI-Native"
] as const;
export type SharedAIJourney = typeof SHARED_AI_JOURNEYS[number];

export const SHARED_AI_JOURNEY_OPTIONS = SHARED_AI_JOURNEYS.map(j => ({ value: j, label: j }));

export const SHARED_PRIORITIES = [
  "Reduce Costs", "Increase Revenue", "Improve Productivity", 
  "Improve Customer Experience", "Automate Processes", "Strengthen Compliance", "AI Transformation"
] as const;
export type SharedPriority = typeof SHARED_PRIORITIES[number];

export const SHARED_PRIORITY_OPTIONS = SHARED_PRIORITIES.map(p => ({ value: p, label: p }));

export const SHARED_DATA_READINESS_LEVELS = [
  "Highly fragmented", "Partially connected", "Mostly integrated", "Fully integrated"
] as const;
export type SharedDataReadiness = typeof SHARED_DATA_READINESS_LEVELS[number];

export const SHARED_DATA_READINESS_OPTIONS = [
  { value: "Highly fragmented", label: "Highly fragmented" },
  { value: "Partially connected", label: "Partially connected" },
  { value: "Mostly integrated", label: "Mostly integrated (Mostly Integrated Data)" },
  { value: "Fully integrated", label: "Fully integrated" }
] as const;

export const SHARED_LEADERSHIP_COMMITMENTS = [
  "Not Discussed", "Exploring", "Budget Approved", "Executive Mandate"
] as const;
export type SharedLeadershipCommitment = typeof SHARED_LEADERSHIP_COMMITMENTS[number];

export const SHARED_LEADERSHIP_COMMITMENT_OPTIONS = SHARED_LEADERSHIP_COMMITMENTS.map(c => ({ value: c, label: c }));


export const SHARED_AI_OPPORTUNITIES = [
  "Procurement Copilot", "HR Assistant", "Contract Intelligence", "Knowledge Search", 
  "Executive Dashboard", "Compliance Assistant", "Customer Experience Agent", 
  "Document Intelligence Agent", "Operations Copilot"
] as const;
export type SharedAIOpportunity = typeof SHARED_AI_OPPORTUNITIES[number];

export interface AIOpportunityMetadata {
  name: string;
  description: string;
  primaryValueMetric: string;
  estimatedComplexity: "Low" | "Medium" | "High";
}

export const SHARED_AI_OPPORTUNITY_METADATA: Record<SharedAIOpportunity, AIOpportunityMetadata> = {
  "Procurement Copilot": {
    name: "Procurement Copilot",
    description: "Automates supplier negotiation and matches line-item compliance inside private enclaves.",
    primaryValueMetric: "Save 15-25% in purchasing overhead",
    estimatedComplexity: "Medium"
  },
  "HR Assistant": {
    name: "HR Assistant",
    description: "Sovereign onboarding assistant running on fine-tuned private knowledge models.",
    primaryValueMetric: "30% reduction in HR ticket handling times",
    estimatedComplexity: "Low"
  },
  "Contract Intelligence": {
    name: "Contract Intelligence",
    description: "Parses liability, governing laws, and commercial terms in multi-page documents.",
    primaryValueMetric: "Reduces contract review durations by up to 70%",
    estimatedComplexity: "High"
  },
  "Knowledge Search": {
    name: "Knowledge Search",
    description: "Bridges wikis and document servers to answer deep technical queries securely.",
    primaryValueMetric: "Saves operational personnel up to 6 hours weekly",
    estimatedComplexity: "Medium"
  },
  "Executive Dashboard": {
    name: "Executive Dashboard",
    description: "Continuous dashboard displaying process latency, token usage, and security compliance keys.",
    primaryValueMetric: "Provides 100% cryptographic visibility of operations",
    estimatedComplexity: "Medium"
  },
  "Compliance Assistant": {
    name: "Compliance Assistant",
    description: "Intercepts multi-agent conversational trails to prevent security leakage (GDPR, SOC2).",
    primaryValueMetric: "Enforces 0% critical leak rates in production",
    estimatedComplexity: "High"
  },
  "Customer Experience Agent": {
    name: "Customer Experience Agent",
    description: "Contextual customer service assistant resolving requests without remote log retention.",
    primaryValueMetric: "Enables 4.5x faster customer support resolution cycles",
    estimatedComplexity: "Low"
  },
  "Document Intelligence Agent": {
    name: "Document Intelligence Agent",
    description: "Processes structured and unstructured forms, bills, and diagnostics automatically.",
    primaryValueMetric: "Increases document ingest processing speed by 10x",
    estimatedComplexity: "Medium"
  },
  "Operations Copilot": {
    name: "Operations Copilot",
    description: "Enterprise operations manager coordinating queue logs and automated system alerts.",
    primaryValueMetric: "Modelled 35% reduction in manual execution overhead",
    estimatedComplexity: "High"
  }
};

export const SHARED_GFF_SOLUTIONS = [
  "Agent Factory", "Knowledge Graph", "AI Governance", "Managed AI Operations", 
  "Garage", "Foundry", "Factory", "Control Center"
] as const;
export type SharedGFFSolution = typeof SHARED_GFF_SOLUTIONS[number];

export interface GFFSolutionMetadata {
  name: string;
  category: "Methodology" | "Platform" | "Module" | "Ops";
  tagline: string;
  description: string;
}

export const SHARED_GFF_SOLUTION_METADATA: Record<SharedGFFSolution, GFFSolutionMetadata> = {
  "Agent Factory": {
    name: "GFF Agent Factory™",
    category: "Platform",
    tagline: "High-Throughput Sovereign Agent Generation",
    description: "Rapidly builds sovereign enterprise agents with consensus execution mechanisms and zero landing-page storage."
  },
  "Knowledge Graph": {
    name: "GFF Knowledge Graph™",
    category: "Platform",
    tagline: "Semantic Entity Silo Integration",
    description: "Synthesizes disconnected enterprise databases into a cryptographically secure, unified cognitive vector cache."
  },
  "AI Governance": {
    name: "GFF AI Governance & Telemetry™",
    category: "Platform",
    tagline: "Hardened Security Boundaries",
    description: "Enforces air-gapped security, strict compliance audits, and real-time conversational drift supervision."
  },
  "Managed AI Operations": {
    name: "GFF Managed AI Operations™",
    category: "Ops",
    tagline: "24/7 Monitored Multi-Agent Execution",
    description: "Offers fully managed orchestration, hosting, and continuous active security updates."
  },
  "Garage": {
    name: "GFF Garage™",
    category: "Methodology",
    tagline: "Co-Innovation & Discovery",
    description: "Initial rapid-prototyping sandbox phase, defining compliance rules and localized simulation trials."
  },
  "Foundry": {
    name: "GFF Foundry™",
    category: "Methodology",
    tagline: "Active Scale-Up Integration",
    description: "Core production deployment, connecting sandboxed models to enterprise transactional mainframes."
  },
  "Factory": {
    name: "GFF Factory™",
    category: "Methodology",
    tagline: "Sovereign Production & Tuning",
    description: "Optimization tier, transferring local administration keys with drift prevention audits."
  },
  "Control Center": {
    name: "GFF Sovereign Control Center™",
    category: "Platform",
    tagline: "Autonomous Administration Workspace",
    description: "Secure workspace to configure private subnets and manage single-tenant vector keys."
  }
};

