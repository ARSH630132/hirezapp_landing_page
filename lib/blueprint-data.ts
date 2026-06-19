export type BlueprintFieldKey =
  | "industry"
  | "enterpriseSize"
  | "aiGoals"
  | "workforceSize"
  | "existingSystems"
  | "riskAppetite";

export type BlueprintAnswers = Record<BlueprintFieldKey, string>;

export const blueprintFields: {
  key: BlueprintFieldKey;
  label: string;
  description: string;
  options: { value: string; label: string; detail?: string }[];
}[] = [
  {
    key: "industry",
    label: "Select Industry",
    description: "Choose the industry that best represents your organization.",
    options: [
      { value: "financial-services", label: "Financial Services & Trust", detail: "Banking, insurance, wealth, and regulated finance" },
      { value: "industry-resources", label: "Industry & Natural Resources", detail: "Manufacturing, energy, mining, and industrial ops" },
      { value: "health-life-sciences", label: "Health & Life Sciences", detail: "Healthcare providers, payers, and life sciences" },
      { value: "public-education", label: "Public Service & Education", detail: "Government, civic services, and higher education" },
      { value: "consumer-digital", label: "Consumer & Digital Industry", detail: "Retail, telecom, media, and digital commerce" },
    ],
  },
  {
    key: "enterpriseSize",
    label: "Enterprise Size",
    description: "How large is your organization today?",
    options: [
      { value: "startup", label: "Startup", detail: "1–50 employees" },
      { value: "mid-market", label: "Mid-Market", detail: "51–500 employees" },
      { value: "enterprise", label: "Enterprise", detail: "501–5,000 employees" },
      { value: "global", label: "Global Enterprise", detail: "5,000+ employees" },
    ],
  },
  {
    key: "aiGoals",
    label: "AI Transformation Goals",
    description: "What outcomes matter most for your AI journey?",
    options: [
      { value: "efficiency", label: "Cost Reduction & Efficiency", detail: "Automate workflows and reduce operational overhead" },
      { value: "customer-experience", label: "Customer Experience", detail: "Personalize journeys and improve service quality" },
      { value: "automation", label: "Operational Automation", detail: "Agentic workflows across core business processes" },
      { value: "innovation", label: "Innovation & New Products", detail: "Launch AI-native offerings and revenue streams" },
      { value: "decision-intelligence", label: "Decision Intelligence", detail: "Real-time insights for leadership and operations" },
    ],
  },
  {
    key: "workforceSize",
    label: "Workforce Size",
    description: "How many people will interact with or be impacted by AI systems?",
    options: [
      { value: "small", label: "Small", detail: "Under 100 people" },
      { value: "medium", label: "Medium", detail: "100–1,000 people" },
      { value: "large", label: "Large", detail: "1,000–10,000 people" },
      { value: "very-large", label: "Very Large", detail: "10,000+ people" },
    ],
  },
  {
    key: "existingSystems",
    label: "Existing Systems",
    description: "What does your current technology landscape look like?",
    options: [
      { value: "legacy", label: "Legacy On-Premise", detail: "Core systems on-prem with limited cloud adoption" },
      { value: "hybrid", label: "Hybrid Cloud", detail: "Mix of on-prem, SaaS, and cloud workloads" },
      { value: "cloud-native", label: "Cloud-Native", detail: "Modern cloud-first architecture and APIs" },
      { value: "fragmented", label: "Fragmented / Siloed", detail: "Disconnected systems across business units" },
    ],
  },
  {
    key: "riskAppetite",
    label: "Risk Appetite",
    description: "How should your organization balance speed and governance?",
    options: [
      { value: "conservative", label: "Conservative", detail: "Governance-first with phased, controlled rollouts" },
      { value: "moderate", label: "Moderate", detail: "Balanced innovation with standard guardrails" },
      { value: "aggressive", label: "Aggressive", detail: "Fast adoption with targeted risk controls" },
      { value: "experimental", label: "Experimental", detail: "Pilot-heavy approach with rapid iteration" },
    ],
  },
];

export type BlueprintResult = {
  operatingModel: string[];
  agentCount: number;
  agentTypes: string[];
  architecture: string[];
  governance: string[];
  roadmap: { phase: string; title: string; time: string; focus: string }[];
  insights: {
    summary: string;
    recommendations: string[];
    agentEcosystemDetail: string;
    architectureDetail: string;
    governanceDetail: string;
    transformationNotes: string[];
  };
};

export const defaultBlueprint: BlueprintResult = {
  operatingModel: ["Intelligent Workforce", "Agentic Automation", "Decision Intelligence", "Continuous Learning"],
  agentCount: 24,
  agentTypes: ["Workflow Agents", "Service Agents", "Analytics Agents"],
  architecture: ["Data & Intelligence Layer", "AI & Agent Layer", "Orchestration Layer", "Integration Layer"],
  governance: ["Trust", "Risk", "Security", "Compliance", "Ethics"],
  roadmap: [
    { phase: "PHASE 1", title: "Foundation", time: "0-3 Months", focus: "Data readiness, governance baseline, and priority use cases" },
    { phase: "PHASE 2", title: "Scale", time: "3-9 Months", focus: "Agent deployment across high-impact workflows" },
    { phase: "PHASE 3", title: "Optimize", time: "9-18 Months", focus: "Performance tuning, integration depth, and workforce adoption" },
    { phase: "PHASE 4", title: "Autonomous Enterprise", time: "18+ Months", focus: "Cross-functional agent orchestration at enterprise scale" },
  ],
  insights: {
    summary: "A balanced AI enterprise blueprint designed to scale intelligent agents across your operating model, architecture, and governance layers.",
    recommendations: [
      "Start with intelligent workforce capabilities as the anchor for your first production agents.",
      "Deploy agents in waves, prioritizing workflow automation in phase one.",
      "Align architecture investments to your existing systems landscape before scaling.",
      "Establish trust and governance controls as the non-negotiable baseline for every agent release.",
    ],
    agentEcosystemDetail: "24 agents recommended across workflow, service, and analytics domains to support enterprise-wide AI transformation.",
    architectureDetail: "A layered architecture spanning data & intelligence, AI & agent, orchestration, and integration layers — designed for composable enterprise scale.",
    governanceDetail: "Governance should emphasize trust, risk, security, compliance, and ethics before broad rollout across the organization.",
    transformationNotes: [
      "Phase timelines reflect a typical enterprise transformation cadence.",
      "Success metrics should track operational impact within the first 90 days.",
      "Generate a personalized blueprint by completing all inputs on the left.",
    ],
  },
};

const industryOperatingModel: Record<string, string[]> = {
  "financial-services": ["Regulated Agent Workflows", "Fraud & Compliance Intelligence", "Client Service Copilots", "Risk-Aware Decisioning"],
  "industry-resources": ["Plant Operations Copilots", "Predictive Asset Intelligence", "Supply Chain Orchestration", "Field Service Automation"],
  "health-life-sciences": ["Clinical Workflow Assistants", "Patient Journey Intelligence", "Care Coordination Agents", "Research Acceleration"],
  "public-education": ["Citizen Service Agents", "Case Routing Intelligence", "Learning Operations Copilots", "Policy-Aware Automation"],
  "consumer-digital": ["Customer Experience Agents", "Commerce Intelligence", "Support Automation", "Personalization Engines"],
};

const goalAgents: Record<string, { count: number; types: string[] }> = {
  efficiency: { count: 18, types: ["Process Automation Agents", "Document Intelligence Agents", "Ops Copilots"] },
  "customer-experience": { count: 22, types: ["Service Agents", "Journey Orchestration Agents", "Sentiment Intelligence Agents"] },
  automation: { count: 28, types: ["Workflow Agents", "Integration Agents", "Task Orchestration Agents"] },
  innovation: { count: 24, types: ["Product Discovery Agents", "Rapid Prototype Agents", "Market Intelligence Agents"] },
  "decision-intelligence": { count: 20, types: ["Analytics Agents", "Forecasting Agents", "Executive Briefing Agents"] },
};

const systemArchitecture: Record<string, string[]> = {
  legacy: ["Integration Gateway Layer", "Legacy System Connectors", "AI & Agent Layer", "Governed Data Fabric"],
  hybrid: ["Hybrid Integration Layer", "Cloud & On-Prem Bridge", "AI & Agent Layer", "Unified Intelligence Layer"],
  "cloud-native": ["API-First Integration Layer", "Event-Driven Orchestration", "AI & Agent Layer", "Scalable Data Platform"],
  fragmented: ["Enterprise Integration Hub", "Master Data Harmonization", "AI & Agent Layer", "Cross-System Orchestration"],
};

const riskGovernance: Record<string, string[]> = {
  conservative: ["Strict Model Governance", "Human-in-the-Loop Controls", "Audit & Compliance Trails", "Ethics Review Board"],
  moderate: ["Policy-Based Guardrails", "Risk Tiering Framework", "Security & Privacy Controls", "Responsible AI Standards"],
  aggressive: ["Automated Policy Checks", "Rapid Release Gates", "Security Monitoring", "Ethics Guidelines"],
  experimental: ["Sandbox Environments", "Pilot Governance", "Fast Feedback Loops", "Ethics & Safety Reviews"],
};

const sizeRoadmapTiming: Record<string, [string, string, string, string]> = {
  startup: ["0-2 Months", "2-6 Months", "6-12 Months", "12+ Months"],
  "mid-market": ["0-3 Months", "3-9 Months", "9-15 Months", "15+ Months"],
  enterprise: ["0-3 Months", "3-9 Months", "9-18 Months", "18+ Months"],
  global: ["0-4 Months", "4-12 Months", "12-24 Months", "24+ Months"],
};

function getOptionLabel(key: BlueprintFieldKey, value: string) {
  return blueprintFields.find((field) => field.key === key)?.options.find((option) => option.value === value)?.label ?? value;
}

export function getEmptyBlueprintAnswers(): BlueprintAnswers {
  return {
    industry: "",
    enterpriseSize: "",
    aiGoals: "",
    workforceSize: "",
    existingSystems: "",
    riskAppetite: "",
  };
}

export function isBlueprintComplete(answers: BlueprintAnswers) {
  return blueprintFields.every((field) => Boolean(answers[field.key]));
}

export function generateBlueprint(answers: BlueprintAnswers): BlueprintResult {
  const industry = answers.industry;
  const operatingModel = industryOperatingModel[industry] ?? ["Intelligent Workforce", "Agentic Automation", "Decision Intelligence", "Continuous Learning"];
  const agents = goalAgents[answers.aiGoals] ?? { count: 24, types: ["Workflow Agents", "Service Agents", "Analytics Agents"] };
  const architecture = systemArchitecture[answers.existingSystems] ?? ["Data & Intelligence Layer", "AI & Agent Layer", "Orchestration Layer", "Integration Layer"];
  const governance = riskGovernance[answers.riskAppetite] ?? ["Trust", "Risk", "Security", "Compliance", "Ethics"];
  const timings = sizeRoadmapTiming[answers.enterpriseSize] ?? ["0-3 Months", "3-9 Months", "9-18 Months", "18+ Months"];

  const workforceMultiplier =
    answers.workforceSize === "very-large" ? 1.35 : answers.workforceSize === "large" ? 1.2 : answers.workforceSize === "medium" ? 1.05 : 1;
  const agentCount = Math.round(agents.count * workforceMultiplier);

  const industryLabel = getOptionLabel("industry", industry);
  const goalLabel = getOptionLabel("aiGoals", answers.aiGoals);
  const riskLabel = getOptionLabel("riskAppetite", answers.riskAppetite);

  return {
    operatingModel,
    agentCount,
    agentTypes: agents.types,
    architecture,
    governance,
    roadmap: [
      { phase: "PHASE 1", title: "Foundation", time: timings[0], focus: "Data readiness, governance baseline, and priority use cases" },
      { phase: "PHASE 2", title: "Scale", time: timings[1], focus: "Agent deployment across high-impact workflows" },
      { phase: "PHASE 3", title: "Optimize", time: timings[2], focus: "Performance tuning, integration depth, and workforce adoption" },
      { phase: "PHASE 4", title: "Autonomous Enterprise", time: timings[3], focus: "Cross-functional agent orchestration at enterprise scale" },
    ],
    insights: {
      summary: `A ${riskLabel.toLowerCase()} AI enterprise blueprint for ${industryLabel}, designed to deliver ${goalLabel.toLowerCase()} across your organization.`,
      recommendations: [
        `Start with ${operatingModel[0].toLowerCase()} as the anchor capability for your first production agents.`,
        `Deploy ${agentCount} agents in waves, prioritizing ${agents.types[0].toLowerCase()} in phase one.`,
        `Align architecture investments to your ${getOptionLabel("existingSystems", answers.existingSystems).toLowerCase()} landscape before scaling.`,
        `Establish ${governance[0].toLowerCase()} as the non-negotiable control for every agent release.`,
      ],
      agentEcosystemDetail: `${agentCount} agents recommended across ${agents.types.join(", ")}. This mix supports ${goalLabel.toLowerCase()} while matching your ${getOptionLabel("workforceSize", answers.workforceSize).toLowerCase()} workforce footprint.`,
      architectureDetail: `Your ${getOptionLabel("existingSystems", answers.existingSystems).toLowerCase()} environment maps to a layered architecture: ${architecture.join(" → ")}. Integration depth should increase in phases 2 and 3.`,
      governanceDetail: `With a ${riskLabel.toLowerCase()} risk posture, governance should emphasize ${governance.slice(0, 3).join(", ").toLowerCase()} before broad rollout.`,
      transformationNotes: [
        `${industryLabel}: prioritize industry-specific compliance and workflow patterns.`,
        `${getOptionLabel("enterpriseSize", answers.enterpriseSize)} scale: phase timelines reflect your organizational complexity.`,
        `${goalLabel}: success metrics should track operational impact within the first 90 days.`,
      ],
    },
  };
}

export function getFieldLabel(key: BlueprintFieldKey) {
  return blueprintFields.find((field) => field.key === key)?.label ?? key;
}

export function getSelectedOptionLabel(key: BlueprintFieldKey, value: string) {
  return getOptionLabel(key, value);
}
