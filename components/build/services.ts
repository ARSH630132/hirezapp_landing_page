import {
  Industry,
  CompanySize,
  DataReadiness,
  Priority,
  AssessmentAnswers,
  AssessmentResult,
  ROIInputs,
  ROIResult,
  ProposalInputs,
  ProposalResult,
  MarketplaceAgent,
  SandboxAgent
} from "./types";

// Static mock marketplace agents for deterministic querying
export const MOCK_MARKETPLACE_AGENTS: MarketplaceAgent[] = [
  {
    id: "agent-01",
    name: "AS-09 Consensus Auditor",
    category: "AUDITOR",
    description: "Performs high-throughput ledger reconciliation and cryptographically secure checksum verification inside isolated network subnets.",
    compatibility: ["banking", "insurance", "audit", "tax", "financial-services"],
    priceToken: "Sovereign Tier",
    rating: 4.95,
    downloads: 1420,
    badge: "FINANCIAL"
  },
  {
    id: "agent-02",
    name: "GFF Policy Watchdog",
    category: "SUPERVISOR",
    description: "Intercepts cloud infrastructure configurations, blocking unauthorized drift and enforcing real-time telemetry adherence to SOC2 and NIST.",
    compatibility: ["healthcare", "life-sciences", "public-sector", "energy", "telecom"],
    priceToken: "Sovereign Tier",
    rating: 4.98,
    downloads: 890,
    badge: "COMPLIANCE"
  },
  {
    id: "agent-03",
    name: "OmniMesh Connector",
    category: "CONNECTOR",
    description: "Bridges legacy relational mainframes to low-latency local vector spaces with zero persistence pipelines.",
    compatibility: ["retail", "manufacturing", "mining", "education", "legal"],
    priceToken: "Standard Tier",
    rating: 4.87,
    downloads: 2150,
    badge: "INTEGRATION"
  },
  {
    id: "agent-04",
    name: "Cognitive Fleet Supervisor",
    category: "SUPERVISOR",
    description: "Dynamic execution coordinator. Constantly monitors DAG performance, routing transaction tokens dynamically to minimize execution latency.",
    compatibility: ["banking", "telecom", "energy", "retail", "manufacturing", "advisory"],
    priceToken: "Premium Tier",
    rating: 4.92,
    downloads: 1680,
    badge: "ORCHESTRATION"
  },
  {
    id: "agent-05",
    name: "Valkyrie Compliance Scanner",
    category: "AUDITOR",
    description: "Inspects multi-agent conversational audit trails for data leaks, ensuring complete zero-retention on sensitive customer identifiers.",
    compatibility: ["healthcare", "banking", "legal", "insurance", "public-sector"],
    priceToken: "Sovereign Tier",
    rating: 4.99,
    downloads: 1120,
    badge: "PRIVACY"
  }
];

export function calculateAssessmentScore(answers: AssessmentAnswers): AssessmentResult {
  const { dataIntegration, vpcIsolation, complianceTelemetry, fleetStrategy } = answers;
  const rawSum = dataIntegration + vpcIsolation + complianceTelemetry + fleetStrategy;
  const score = Math.round((rawSum / 20) * 100);

  let level = "Discovery Sandbox Phase";
  let color = "#E4000F";
  let description =
    "Your data resides in disconnected legacy clusters. Running an isolated sandbox trace in GFF Labs is highly recommended to design custom security schemas.";

  if (score >= 80) {
    level = "Sovereign Production Ready";
    color = "#00FF9D";
    description =
      "Your network edge nodes and unified vector caches are fully optimized for autonomous agent deployment in hardened private subnets.";
  } else if (score >= 55) {
    level = "Strategic Incubation Required";
    color = "#3B82F6";
    description =
      "Solid infrastructural foundations exist, but real-time audit logs and single-tenant hardware isolation policies require further alignment.";
  }

  const dimensionScores = [
    {
      label: "Data Pipeline Integration",
      score: dataIntegration,
      description: dataIntegration >= 4 ? "Excellent vectorized caching" : "Legacy relational bottlenecks present",
      recommendation:
        dataIntegration >= 4
          ? "Maintain secure local cache structures."
          : "Introduce GFF OmniMesh connectors to bridge relational mainframes directly."
    },
    {
      label: "VPC Network Isolation",
      score: vpcIsolation,
      description: vpcIsolation >= 4 ? "Hardened private enclave isolated" : "Shared ingress pathways vulnerable",
      recommendation:
        vpcIsolation >= 4
          ? "Execute quarterly zero-trust dry runs."
          : "Enforce single-tenant subnets with GFF dedicated edge nodes."
    },
    {
      label: "Compliance Telemetry",
      score: complianceTelemetry,
      description: complianceTelemetry >= 4 ? "Continuous real-time SOC2 telemetry" : "Periodic audit checks only",
      recommendation:
        complianceTelemetry >= 4
          ? "Automate policy reporting outputs."
          : "Deploy GFF Policy Watchdog nodes to catch configuration drift instantly."
    },
    {
      label: "Multi-Agent Fleet Strategy",
      score: fleetStrategy,
      description: fleetStrategy >= 4 ? "Orchestrated DAG topology active" : "Ad-hoc task execution",
      recommendation:
        fleetStrategy >= 4
          ? "Scale to cross-department supervisor nodes."
          : "Model multi-agent hierarchies using GFF Foundry Studio DAG designers."
    }
  ];

  return {
    score,
    level,
    color,
    description,
    dimensionScores,
    strategicPriority:
      score >= 80
        ? "Hardened production deployment & scale"
        : score >= 55
        ? "Isolation architecture validation"
        : "VPC topology design & basic sandboxing",
    securityClearance: score >= 80 ? "Sovereign Level 3" : score >= 55 ? "Strategic Level 2" : "Sandbox Level 1"
  };
}

export function calculateROIEstimate(inputs: ROIInputs): ROIResult {
  const { teamSize, avgHourlyRate, inefficientHoursPerWeek, initialInvestment, priority } = inputs;

  const annualHoursSaved = Math.round(teamSize * inefficientHoursPerWeek * 52 * 0.85);
  const grossSavings = annualHoursSaved * avgHourlyRate;
  const netSavings = Math.max(0, grossSavings - initialInvestment);
  const roiPercentage = initialInvestment > 0 ? Math.round((netSavings / initialInvestment) * 100) : 0;

  const monthlySavings = grossSavings / 12;
  const paybackMonths = monthlySavings > 0 ? Math.max(1, Math.round((initialInvestment / monthlySavings) * 10) / 10) : 12;

  let computeCostPct = 15;
  let complianceCostPct = 20;

  if (priority === "compliance_security") {
    complianceCostPct = 40;
    computeCostPct = 10;
  } else if (priority === "cost_reduction") {
    complianceCostPct = 15;
    computeCostPct = 25;
  } else if (priority === "operational_speed") {
    computeCostPct = 30;
  }

  const laborSavedPct = 100 - (computeCostPct + complianceCostPct);

  const costAllocations = [
    {
      label: "Compute Node Infrastructure",
      percentage: computeCostPct,
      amount: Math.round((initialInvestment * computeCostPct) / 100),
      color: "#009DFF"
    },
    {
      label: "Sovereign Audit Pipelines",
      percentage: complianceCostPct,
      amount: Math.round((initialInvestment * complianceCostPct) / 100),
      color: "#E4000F"
    },
    {
      label: "Workforce Amplification Layer",
      percentage: laborSavedPct,
      amount: Math.round((initialInvestment * laborSavedPct) / 100),
      color: "#00FF9D"
    }
  ];

  let efficiencyMultiplier = "1.8x Speedup";
  if (teamSize > 500) efficiencyMultiplier = "3.2x Scale";
  else if (teamSize > 100) efficiencyMultiplier = "2.4x Speedup";

  return {
    annualHoursSaved,
    grossSavings,
    netSavings,
    roiPercentage,
    paybackMonths,
    costAllocations,
    efficiencyMultiplier
  };
}


export function generateProposalBlueprint(inputs: ProposalInputs): ProposalResult {
  const { companyName, industry, companySize, dataReadiness, priorities } = inputs;

  const resolvedName = companyName.trim() || "Enterprise Client";

  let baseWeeks = 12;
  if (companySize === "small") baseWeeks = 6;
  else if (companySize === "medium") baseWeeks = 8;
  else if (companySize === "global-conglomerate") baseWeeks = 16;

  if (dataReadiness === "raw") baseWeeks += 3;
  else if (dataReadiness === "vectorized") baseWeeks -= 2;
  else if (dataReadiness === "fully-governed") baseWeeks -= 3;

  const implementationWeeks = Math.max(4, baseWeeks);

  const p1 = Math.max(1, Math.round(implementationWeeks * 0.15));
  const p2 = Math.max(1, Math.round(implementationWeeks * 0.25));
  const p3 = Math.max(1, Math.round(implementationWeeks * 0.40));
  const p4 = implementationWeeks - (p1 + p2 + p3);

  const architecturePhases = [
    {
      name: "Phase 1: Local Enclave Discovery & Topology Layout",
      weeks: p1,
      objectives: [
        `Audit legacy data endpoints for ${industry} compliance.`,
        "Establish single-tenant secure networking perimeter within GFF virtual enclaves.",
        "Assess relational schemas for real-time vector capability."
      ],
      deliverables: ["Isolated VPC configuration manifest", "Static DAG reference topology layout"]
    },
    {
      name: "Phase 2: OmniMesh Integration & Vector Pipeline Setup",
      weeks: p2,
      objectives: [
        `Connect GFF OmniMesh drivers to source infrastructure.`,
        "Initialize zero-retention embeddings stream with local token isolation.",
        "Perform initial policy scan checks on simulated transaction records."
      ],
      deliverables: ["Unified Vector mesh connection keys", "Encryption policy baseline document"]
    },
    {
      name: "Phase 3: Multi-Agent Topology Compilation & Validation",
      weeks: p3,
      objectives: [
        "Synthesize custom supervisor nodes mapped to departmental rules.",
        "Execute high-throughput benchmark runs (up to 5,000 simulated tx/min).",
        "Verify consensus validation protocols on edge nodes."
      ],
      deliverables: ["Active GFF Foundry DAG blueprint file", "Consensus telemetry logs"]
    },
    {
      name: "Phase 4: Sovereign Sandbox Promotion & Production Handoff",
      weeks: p4,
      objectives: [
        "Deploy governance guardrails for persistent autonomous runs.",
        "Hand over local administration keys to the primary security team.",
        "Schedule regular performance drift updates."
      ],
      deliverables: ["Sovereign execution node license token", "Technical transition guide"]
    }
  ];

  const recommendedAgentTopologies = MOCK_MARKETPLACE_AGENTS.filter(
    (agent) => agent.compatibility.includes(industry) || priorities.some((p) => agent.badge?.toLowerCase().includes(p.replace("_", "")))
  ).map((agent) => ({
    name: agent.name,
    role: agent.category,
    latency: agent.category === "CONNECTOR" ? "< 2ms" : "< 150ms",
    governanceMode: "Decentralized consensus validation"
  }));

  if (recommendedAgentTopologies.length === 0) {
    recommendedAgentTopologies.push({
      name: "GFF Policy Watchdog",
      role: "SUPERVISOR",
      latency: "< 100ms",
      governanceMode: "Strict sovereign compliance scanning"
    });
  }

  let licenseCost = "$45,000 / Year";
  if (companySize === "global-conglomerate") licenseCost = "Custom Enterprise Tier";
  else if (companySize === "small") licenseCost = "$15,000 / Year";

  const exportOutline = [
    "I. EXECUTIVE SUMMARY - THE GFF ARCHITECTURE PROPOSAL",
    "II. CLIENT ENVIRONMENT STATUS & READINESS METRICS",
    `III. THE CUSTOM "${resolvedName.toUpperCase()}" AGENT TOPOLOGY`,
    "IV. SECURITY AND COMPLIANCE BASELINE - ZERO LANDING RETENTION POLICY",
    `V. DETAILED ${implementationWeeks}-WEEK DEPLOYMENT TIMELINE`,
    "VI. ESTIMATED COMMERCIAL STRUCTURE AND LICENSING SCHEME"
  ];

  return {
    projectName: `GFF Sovereign Agent Topology - ${industry.toUpperCase()} STACK`,
    implementationWeeks,
    architecturePhases,
    recommendedAgentTopologies,
    estimatedLicenseCost: licenseCost,
    exportOutline
  };
}

export function filterMarketplaceAgents(industry: Industry, search?: string): MarketplaceAgent[] {
  let list = MOCK_MARKETPLACE_AGENTS;

  if (search) {
    const s = search.toLowerCase();
    list = list.filter((a) => a.name.toLowerCase().includes(s) || a.description.toLowerCase().includes(s));
  }

  return [...list].sort((a, b) => {
    const aCompat = a.compatibility.includes(industry) ? 1 : 0;
    const bCompat = b.compatibility.includes(industry) ? 1 : 0;
    return bCompat - aCompat;
  });
}

export function getInitialSandboxAgent(): SandboxAgent {
  return {
    id: "sandbox-run-active",
    name: "Sovereign Audit Sandbox Node",
    role: "AUDITOR",
    status: "idle",
    latency: "0 ms",
    successRate: "100%",
    steps: [
      { label: "Initialize Virtual Hardware Enclave", status: "pending", detail: "Spawning local sandboxed environment." },
      { label: "Load Zero-Retention Encryption Rules", status: "pending", detail: "Injecting temporary security rules." },
      { label: "Ingest Mock Ledgers & Transactions", status: "pending", detail: "Streaming deterministic sandbox inputs." },
      { label: "Verify Integrity via Consensus Signatures", status: "pending", detail: "Running cryptographic integrity checks." },
      { label: "Excrete Compiled Simulation Reports", status: "pending", detail: "Generating trace logs for performance audit." }
    ]
  };
}

