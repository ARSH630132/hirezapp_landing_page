"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { getToolState, saveToolState } from "@/components/build/workspaceUtility";
import NextBestAction from "@/components/build/NextBestAction";


// Define TypeScript interfaces for static agent data
interface AgentStep {
  title: string;
  description: string;
  role: string;
}

interface AgentLog {
  timeOffset: number; // seconds from launch
  type: "system" | "info" | "agent" | "success" | "warning";
  text: string;
}

interface AgentDemo {
  id: string;
  name: string;
  category: string;
  purpose: string;
  recommendedIndustry: string;
  relatedPlatform: string;
  agentType: string;
  status: string;
  securityRating: string;
  metrics: {
    cpu: string;
    memory: string;
    isolation: string;
    compliance: string;
  };
  ingressLabel: string;
  egressLabel: string;
  steps: AgentStep[];
  logs: AgentLog[];
  challenge?: string;
  interpretation?: string;
  knowledgeNeeded?: string[];
  humanApproval?: string;
  governanceCheck?: string;
  outputPreview?: string;
}

// Full 8 representative agent demos using local static data only
const AGENTS: AgentDemo[] = [
  {
    id: "knowledge-search",
    name: "Cognitive Knowledge Engine",
    category: "Knowledge Search",
    purpose: "Autonomous deep-reasoning search across distributed unstructured enterprise archives and live telemetry pipelines.",
    recommendedIndustry: "Energy & Utilities",
    relatedPlatform: "Foundry / Knowledge Graph",
    agentType: "Deep Reasoning / DAG",
    status: "Ready for Simulation",
    securityRating: "High (SOC2 Enclave)",
    metrics: {
      cpu: "16-Core vCPU",
      memory: "64GB Isolated",
      isolation: "AMD SEV-SNP",
      compliance: "Sovereign GDPR"
    },
    ingressLabel: "Thermal Telemetry & PDFs",
    egressLabel: "Engineering Mitigation Report",
    steps: [
      {
        title: "Parse Semantic Context",
        description: "Ingests high-volume unstructured search parameters to construct hyper-dimensional vector embeddings within memory.",
        role: "Semantic Embedding Model"
      },
      {
        title: "Federated Graph Query",
        description: "Dispatches secure sub-agents to query and resolve relationship clusters in the GFF Sovereign Knowledge Graph.",
        role: "Graph Resolver Agent"
      },
      {
        title: "Cross-Attention Re-ranking",
        description: "Evaluates context fragments using semantic relevancy layers and filters noise before memory-unlocked aggregation.",
        role: "Context Scorer Pipeline"
      },
      {
        title: "Sovereign Synthesis",
        description: "Compiles a certified Failure Mode and Effects Analysis (FMEA) document complete with absolute provenance citations.",
        role: "Executive Synthesis Model"
      }
    ],
    challenge: "An offshore gas platform operator reports a sudden 4.2% pressure anomaly in Pipeline Sector-4. Engineers must instantly cross-reference 25,000 pages of scanned 1998 legacy manuals, physical sensor schematics, and live thermal SCADA telemetry to identify the correct isolation valve.",
    interpretation: "Translates high-volume unstructured search parameters into ISO-14224 compliant failure modes, maps connectivity graphs, and filters telemetry noise before memory-unlocked aggregation.",
    knowledgeNeeded: [
      "Sovereign Knowledge Graph (Sector-4 Topology Map)",
      "ISO-14224 Equipment taxonomy database",
      "Historical sensor SCADA telemetry log archives (1998-Present)",
      "Sector-4 legacy engineering manuals and schematics"
    ],
    humanApproval: "Control Room Engineer must manually verify and sign off on the proposed Isolation Valve #12-B closure recommendation before executing the physical safety dispatch.",
    governanceCheck: "Sovereign GDPR compliance mask filters all proprietary names and locations. Zero-egress sandbox blockages deny raw data transit to unapproved external servers.",
    outputPreview: "{\n  \"incident_id\": \"INC-2026-098F\",\n  \"recommended_action\": \"Isolate Sector-4 Valve #12-B within 14 minutes.\",\n  \"confidence_score\": \"0.982\",\n  \"matched_documentation\": [\n    \"Sec-4-Pipeline-Specs-1998.pdf (Page 412)\",\n    \"SCADA-Thermal-Log-S4-Active.csv\"\n  ],\n  \"isolation_instructions\": \"Close pneumatic actuator S4-PA-12B, verify downstream pressure drops below 12.4 bar.\"\n}",
    logs: [
      { timeOffset: 0.2, type: "system", text: "Initializing cryptographic secure enclave on node SECURE_ENCLAVE_NODE-09..." },
      { timeOffset: 0.8, type: "info", text: "Mounting unstructured raw file system (containing engineering PDFs, sensor history)..." },
      { timeOffset: 1.5, type: "agent", text: "[EmbeddingAgent] Transforming query 'Sector-4 thermal anomaly' into 1536-dimensional vector space." },
      { timeOffset: 2.2, type: "agent", text: "[GraphAgent] Querying Knowledge Graph cluster: resolved 42 nodes and 115 sovereign relations." },
      { timeOffset: 2.9, type: "warning", text: "[Retriever] Re-ranking flagged 2 candidate documents with unverified signatures. Suppressing." },
      { timeOffset: 3.5, type: "agent", text: "[SynthesisAgent] Consolidating 8 high-confidence matching sections (FMEA Standard ISO-14224)..." },
      { timeOffset: 4.2, type: "success", text: "Dry-run report generated. SHA-256: 0x9e43b17... Simulation successfully completed." }
    ]
  },
  {
    id: "procurement-copilot",
    name: "Autonomous Procurement Copilot",
    category: "Procurement Copilot",
    purpose: "Automates raw material requisition validation, supplier contractual compliance checking, and SAP ERP orchestration.",
    recommendedIndustry: "Retail & Supply Chain",
    relatedPlatform: "RetailMesh / ERP Connector",
    agentType: "Transactional / Actions",
    status: "Enclave Verified",
    securityRating: "ISO-27001 Certified",
    metrics: {
      cpu: "8-Core vCPU",
      memory: "32GB Isolated",
      isolation: "Intel SGX Enclave",
      compliance: "HIPAA/SOC2 Compliant"
    },
    ingressLabel: "Supplier Invoice PDFs",
    egressLabel: "SAP ERP Ledger Adjustment",
    steps: [
      {
        title: "Multimodal Invoice Parsing",
        description: "Parses structured invoice tables and unstructured clauses using high-fidelity vision agents within secure boundaries.",
        role: "Multimodal Vision Agent"
      },
      {
        title: "Master Agreement Audit",
        description: "Extracts agreed-upon rates from stored Master Services Agreements and compares against current invoice line items.",
        role: "Contract Compliance Agent"
      },
      {
        title: "Variance Tagging & Scoring",
        description: "Computes financial variance, determines budget impact, and applies decision threshold algorithms.",
        role: "Variance Audit Model"
      },
      {
        title: "Secure SAP Gateway Hook",
        description: "Queues ledger adjustments and issues human-in-the-loop review tickets within the enterprise ERP client.",
        role: "ERP Secure Gateway"
      }
    ],
    challenge: "A global retail operator receives 1,200 raw material invoices daily from 85 international vendors. Contract pricing terms fluctuate daily, leading to invoice-to-contract mismatches, manual ledger errors, and delayed SAP settlement cycles.",
    interpretation: "Validates received PDF invoices against registered master purchase agreements. Identifies deviation percentages in unit pricing, and queries SAP ERP ledger state.",
    knowledgeNeeded: [
      "Vendor Master Service Agreements (MSAs)",
      "SAP ERP active ledger balances",
      "Real-time FX currency conversion rates",
      "Authorized corporate procurement limits directory"
    ],
    humanApproval: "Finance Analyst must review and electronically authorize any invoice matching deviation exceeding +/- 2.5% variance before SAP ledger posting.",
    governanceCheck: "SOC2 boundary checks evaluate vendor banking routing numbers against the authorized OFAC sanctions database before initiating any pending ledger adjusting entry.",
    outputPreview: "{\n  \"invoice_id\": \"INV-DE-88291\",\n  \"supplier\": \"Krupp Logistics GmbH\",\n  \"validation_status\": \"DISCREPANCY_DETECTED\",\n  \"discrepancy_details\": \"Unit price on Line Item 3 ($142.50) exceeds Master Agreement Contract Rate ($139.00) by 2.51%.\",\n  \"escalation_route\": \"Routed to Procurement Officer (Approver #4)\"\n}",
    logs: [
      { timeOffset: 0.3, type: "system", text: "Connecting to internal SAP gateway mock listener on port 8083..." },
      { timeOffset: 0.9, type: "info", text: "Ingesting invoice-77491.pdf (multimodal parser active on 3 pages)..." },
      { timeOffset: 1.6, type: "agent", text: "[ParserAgent] Found Line Item 1: Steel Roll C-Grade, quoted price: $142.50/unit." },
      { timeOffset: 2.4, type: "agent", text: "[AuditAgent] Querying MSA-2026-X4 contract: stipulated Unit Cost is capped at $138.00." },
      { timeOffset: 3.1, type: "warning", text: "[VarianceAgent] Variance of +$4.50/unit identified (Total deviation: $13,500.00). Alert raised." },
      { timeOffset: 3.8, type: "agent", text: "[GatewayAgent] Drafting reconciliation ticket and parking invoice within SAP pending revision." },
      { timeOffset: 4.5, type: "success", text: "Sovereign ledgers aligned. Enclave transaction logs written." }
    ]
  },
  {
    id: "hr-assistant",
    name: "Enterprise HR Orchestration Agent",
    category: "HR Assistant",
    purpose: "Manages complex multi-system onboarding pipelines, regulatory background checks, and personalized skill provisioning.",
    recommendedIndustry: "Professional Services",
    relatedPlatform: "University OneVerse",
    agentType: "Collaborative / HITL",
    status: "Ready for Simulation",
    securityRating: "Sovereign Private",
    metrics: {
      cpu: "4-Core vCPU",
      memory: "16GB Secure",
      isolation: "AWS Nitro Enclave",
      compliance: "Full EU-GDPR"
    },
    ingressLabel: "Signed Offer & Resume",
    egressLabel: "Enterprise AD Provisioning",
    steps: [
      {
        title: "Offer Verification",
        description: "Authenticates cryptographic digital signatures and ingests core candidate metadata.",
        role: "Offer Authenticator Agent"
      },
      {
        title: "Encrypted Clearance Check",
        description: "Dispatches anonymized identity strings to third-party secure APIs to run background certifications.",
        role: "Background Inspector Agent"
      },
      {
        title: "Directory Provisioning",
        description: "Generates ephemeral Active Directory accounts and provisions roles using strict least-privilege schemas.",
        role: "Enterprise Directory Agent"
      },
      {
        title: "OneVerse Path Injection",
        description: "Generates custom learning modules and security training paths matching the onboarding profile.",
        role: "Curriculum Customizer"
      }
    ],
    challenge: "Enterprise HR departments struggle to parse, screen, and schedule interviews for thousands of high-security cleared candidate profiles across disparate sovereign regions without exposing personally identifiable information (PII) to global networks.",
    interpretation: "Masks PII elements in PDF resumes. Compiles verified skills matrices against custom job requirement blueprints, and generates secure self-scheduling portals.",
    knowledgeNeeded: [
      "Enterprise Role Specifications Blueprint",
      "Candidate Resume Repositories",
      "Sovereign PII Redaction Ruleset",
      "Outlook/GSuite Calendar APIs"
    ],
    humanApproval: "Talent Acquisition Lead must manually verify the candidate's cleared credentials and confirm the interview panel schedule.",
    governanceCheck: "Sovereign localization check ensures candidate CV data never exits physical cloud servers located in Germany (Sovereign Cloud Zone EU-Central-1).",
    outputPreview: "{\n  \"candidate_ref\": \"ANON-88392-EU\",\n  \"clearance_verified\": \"Level 4 (Sovereign Secure)\",\n  \"skills_alignment\": \"94% Match (Rust, Cryptographic Enclaves, Next.js)\",\n  \"pii_redacted\": \"True\",\n  \"interview_status\": \"Scheduled for Tuesday, 14:00 CET via Secure Room\"\n}",
    logs: [
      { timeOffset: 0.2, type: "system", text: "Onboarding daemon activated for Candidate_88301..." },
      { timeOffset: 1.0, type: "info", text: "Signed contract verified using Adobe Sign secure hash validator." },
      { timeOffset: 1.8, type: "agent", text: "[InspectorAgent] Running automated background checks via encrypted API handshake..." },
      { timeOffset: 2.5, type: "success", text: "[InspectorAgent] Clear status received from screening bureau. Zero exceptions found." },
      { timeOffset: 3.2, type: "agent", text: "[DirectoryAgent] Injecting secure Active Directory group: HR-Sec-Access-L3." },
      { timeOffset: 3.9, type: "agent", text: "[CurriculumAgent] Creating personalized training tracks inside University OneVerse portal." },
      { timeOffset: 4.6, type: "success", text: "Workflow complete. New hire notification dispatched to supervisor." }
    ]
  },
  {
    id: "contract-intelligence",
    name: "Sovereign Contract Auditor",
    category: "Contract Intelligence",
    purpose: "Scans high-liability agreements, analyzes indemnity exposures, and flags compliance deviations in active vendor portfolios.",
    recommendedIndustry: "Regulated / Legal",
    relatedPlatform: "Runtime Governance",
    agentType: "Analytical / Extraction",
    status: "Enclave Verified",
    securityRating: "State-Grade Audit",
    metrics: {
      cpu: "12-Core vCPU",
      memory: "48GB Isolated",
      isolation: "AMD SEV-SNP",
      compliance: "SEC/FINRA Compliant"
    },
    ingressLabel: "Unsigned Master Contract",
    egressLabel: "High-Risk Legal Scorecard",
    steps: [
      {
        title: "Segment & Clean",
        description: "Partitions unstructured contracts into logical semantic blocks inside isolated temporary sandboxes.",
        role: "Contract Ingestion Agent"
      },
      {
        title: "Clause Extraction",
        description: "Identifies indemnification, severe liability limits, governing law jurisdictions, and termination terms.",
        role: "Clause Classification Agent"
      },
      {
        title: "Playbook Compliance Check",
        description: "Correlates extracted rules against standard company policy and highlights non-conforming parameters.",
        role: "Compliance Scoring Agent"
      },
      {
        title: "Draft Remediation Fallbacks",
        description: "Synthesizes standard fallback clauses and injects inline annotations with risk scoring levels.",
        role: "Remediation Draft Engine"
      }
    ],
    challenge: "In-house legal teams at multinational enterprises spend hundreds of hours manually comparing legacy supplier master service agreements (MSAs) against updated regional liability laws, missing critical indemnity exposure clauses.",
    interpretation: "Conducts deep semantic clause analysis. Identifies missing or weak liability caps, cross-references with local court databases, and drafts remedial amendment clauses.",
    knowledgeNeeded: [
      "Corporate Legal MSA Templates",
      "Regional Civil Code liability tables",
      "Local judicial precedents database",
      "Active enterprise compliance manuals"
    ],
    humanApproval: "General Counsel must approve the suggested replacement indemnity clause wording before sending the formal contract addendum to the counterparty.",
    governanceCheck: "Zero-retention LLM privacy guard ensures third-party contractual terms are never ingested into global training weights, keeping all legal intellectual property strictly isolated.",
    outputPreview: "{\n  \"contract_id\": \"MSA-2026-RETAIL\",\n  \"risk_level\": \"ELEVATED\",\n  \"vulnerabilities\": [\n    {\n      \"clause\": \"Section 14.2 (Limitation of Liability)\",\n      \"issue\": \"Liability cap is uncapped for indirect damages under German Civil Code Section 307.\",\n      \"remedy\": \"Insert: 'Liability for indirect damages shall be capped at 150% of annual fees paid under this Agreement.'\"\n    }\n  ]\n}",
    logs: [
      { timeOffset: 0.3, type: "system", text: "Spinning up secure temporary runtime container..." },
      { timeOffset: 0.9, type: "info", text: "Ingested 145-page Master Supplier Agreement (PDF structure decoded)..." },
      { timeOffset: 1.7, type: "agent", text: "[IngesterAgent] Divided text into 48 distinct legal segments for parallel processing." },
      { timeOffset: 2.4, type: "agent", text: "[ClassifierAgent] Scanning section 14.8: 'Indemnification of Third-Party IP Claims'..." },
      { timeOffset: 3.1, type: "warning", text: "[ScoringAgent] Flagged Clause: Supplier provides zero indemnity for software dependencies. High Risk." },
      { timeOffset: 3.8, type: "agent", text: "[DraftEngine] Injecting company standard alternative text: 'Supplier warrants full IP clearance...'" },
      { timeOffset: 4.5, type: "success", text: "Risk analysis completed. Scoring index: 78/100 (Unfavorable). Report archived." }
    ]
  },
  {
    id: "executive-dashboard",
    name: "Executive Intelligence Synthesis Engine",
    category: "Executive Dashboard",
    purpose: "Queries running enterprise systems autonomously to build daily cross-division briefings and flag operational anomalies.",
    recommendedIndustry: "Financial Services",
    relatedPlatform: "Control Center / Analytics",
    agentType: "Multi-Agent Synthesis",
    status: "Ready for Simulation",
    securityRating: "Corporate Top Secret",
    metrics: {
      cpu: "8-Core vCPU",
      memory: "32GB Secure",
      isolation: "Intel SGX Enclave",
      compliance: "Sovereign Financial"
    },
    ingressLabel: "Global Transaction Streams",
    egressLabel: "C-Suite Strategic Summary",
    steps: [
      {
        title: "Consolidated Data Gathering",
        description: "Pulls state summaries, active performance records, and risk indices from running corporate platforms.",
        role: "Telemetry Gathering Agent"
      },
      {
        title: "Statistical Anomaly Check",
        description: "Applies outlier models against historical performance ranges to identify statistical fluctuations.",
        role: "Outlier Discovery Agent"
      },
      {
        title: "Executive Editorial Synthesis",
        description: "Compiles operational highlights, emerging risks, and financial ratios into highly readable business prose.",
        role: "Business Editorial Model"
      },
      {
        title: "Secure Device Publication",
        description: "Encrypts synthesized intelligence packages with device-specific public keys for immediate executive access.",
        role: "Secure Distribution Node"
      }
    ],
    challenge: "Chief Financial Officers struggle to reconcile liquidity risk across multiple disparate digital asset vaults, sovereign bank accounts, and active DeFi smart contracts in real-time, leaving them exposed to overnight market volatility.",
    interpretation: "Fetches real-time multi-vault balances, calculates portfolio value-at-risk (VaR) using Monte Carlo distributions, and models hedging strategies.",
    knowledgeNeeded: [
      "Multi-signature vault telemetry status",
      "Real-time Bloomberg & Chainlink oracle price feeds",
      "Corporate treasury allocation policy parameters",
      "Active interest-bearing token yielding curves"
    ],
    humanApproval: "CFO or Treasury Director must sign a multi-signature transaction on their physical HSM hardware device to execute any suggested portfolio rebalancing transfers.",
    governanceCheck: "Anti-Money Laundering (AML) checks evaluate recipient address risks; the smart contract execution path runs inside a FIPS 140-2 Level 4 HSM container.",
    outputPreview: "{\n  \"portfolio_value_usd\": \"242,501,902.00\",\n  \"24h_value_at_risk_99_confidence\": \"1,420,900.00\",\n  \"alert_status\": \"NOMINAL\",\n  \"hedging_recommendation\": \"Allocate 5% of passive stablecoin treasury to short-duration sovereign bonds to neutralize overnight volatility.\",\n  \"required_signatures\": \"2 of 3 (CFO + Controller)\"\n}",
    logs: [
      { timeOffset: 0.4, type: "system", text: "Gathering telemetry streams across 14 global ledger clusters..." },
      { timeOffset: 1.1, type: "info", text: "Synchronized state records for RetailMesh and OreMesh deployments." },
      { timeOffset: 1.9, type: "agent", text: "[TelemetryAgent] Aggregating daily transaction throughput: $14.8M reconciled, normal limits." },
      { timeOffset: 2.6, type: "agent", text: "[OutlierAgent] Identified atypical database activity spikes in European node between 03:00-03:15 UTC." },
      { timeOffset: 3.3, type: "info", text: "[OutlierAgent] Spike resolved to standard system backup routine. No active threat." },
      { timeOffset: 4.0, type: "agent", text: "[EditorialModel] Formatting executive brief: Focus areas, Revenue stability, Operational alerts." },
      { timeOffset: 4.6, type: "success", text: "Brief compiled, encrypted, and synchronized. Delivery secure." }
    ]
  },
  {
    id: "compliance-assistant",
    name: "Sovereign Regulatory Compliance Auditor",
    category: "Compliance Assistant",
    purpose: "Monitors active database migrations and system modifications for PII leaks, storage location violations, and rule breaches.",
    recommendedIndustry: "Government & Sovereign",
    relatedPlatform: "Assessment Mesh / Auditor",
    agentType: "Guardrail / Audit",
    status: "Enclave Verified",
    securityRating: "Military-Grade Secure",
    metrics: {
      cpu: "16-Core vCPU",
      memory: "64GB Isolated",
      isolation: "AMD SEV-SNP",
      compliance: "GDPR / HIPAA / FedRAMP"
    },
    ingressLabel: "Database Config & Commits",
    egressLabel: "Compliance Block / Approval",
    steps: [
      {
        title: "Boundary Scanning",
        description: "Scans new code commits, schema files, and storage bucket descriptors for geopolitical regulatory alignment.",
        role: "Sovereign Boundary Agent"
      },
      {
        title: "PII Deep Scanning",
        description: "Analyzes system outputs, log files, and API structures for unmasked identity attributes.",
        role: "PII Pattern Agent"
      },
      {
        title: "Sovereign Enclave Validation",
        description: "Verifies that processing nodes remain fully inside localized geo-redundant boundaries.",
        role: "Hardware Enclave Validator"
      },
      {
        title: "Automated Pipeline Interlock",
        description: "Forces automated rollback locks on compliance breaches and reports telemetry directly to the CISO dashboard.",
        role: "Lockout Protocol Agent"
      }
    ],
    challenge: "Enterprise data pipelines crossing international borders face immediate fines if they transmit sensitive customer records outside sovereign borders. Compliance officers cannot inspect millions of high-velocity payload streams manually.",
    interpretation: "Inspects incoming and outgoing streaming data payloads at the API Gateway level. Detects and blocks PII, health information (PHI), or localized data transgressions in real time.",
    knowledgeNeeded: [
      "EU GDPR directives handbook",
      "CCPA regulatory frameworks",
      "HIPAA Protected Health Information (PHI) identifiers catalog",
      "Enterprise custom localized data categorization schema"
    ],
    humanApproval: "Data Protection Officer (DPO) is alerted to review blocked payloads and decide whether to whitelist specific encrypted tokens.",
    governanceCheck: "Zero-Trust gateway prevents egress of non-anonymized data; automated audit-trail hash is written to the immutable compliance ledger.",
    outputPreview: "{\n  \"gateway_session\": \"GW-9921-X\",\n  \"packets_inspected\": \"41,209\",\n  \"violations_detected\": \"1 (PII/Social Security Number detected in Outbound Payload #882)\",\n  \"action_taken\": \"PAYLOAD_MUTED_AND_REDACTED\",\n  \"compliance_status\": \"SECURED\"\n}",
    logs: [
      { timeOffset: 0.2, type: "system", text: "Listening on CI/CD production deployment pipeline webhook..." },
      { timeOffset: 0.8, type: "info", text: "Analyzing pending database migration script (Commit: #10941)." },
      { timeOffset: 1.5, type: "agent", text: "[BoundaryAgent] Scanning region. Destination: Frankfurt-Zone-1. Status: Sovereign Compliant." },
      { timeOffset: 2.2, type: "agent", text: "[PIIAgent] Parsing table structure 'UserBillingDetails'..." },
      { timeOffset: 2.9, type: "warning", text: "[PIIAgent] Found unencrypted field 'TaxID'. Violation of GDPR Article 32: Privacy by Design." },
      { timeOffset: 3.6, type: "agent", text: "[LockoutAgent] INTERLOCK ENGAGED: Halting build deployment. Rejecting code promotion." },
      { timeOffset: 4.3, type: "success", text: "CISO notified. Rollback completed successfully inside sandbox." }
    ]
  },
  {
    id: "customer-experience",
    name: "Sovereign Support & Resolution Agent",
    category: "Customer Experience Agent",
    purpose: "Resolves billing inquiries, diagnostic anomalies, and service adjustments within zero-trust sandboxed limits.",
    recommendedIndustry: "Telecom",
    relatedPlatform: "TelecomVerse",
    agentType: "Real-time / Interactive",
    status: "Ready for Simulation",
    securityRating: "Hardened Gateway",
    metrics: {
      cpu: "4-Core vCPU",
      memory: "16GB Secure",
      isolation: "Intel SGX Enclave",
      compliance: "TCPA / HIPAA Compliant"
    },
    ingressLabel: "User Support Chat Thread",
    egressLabel: "Billing Credit & SMS Alert",
    steps: [
      {
        title: "Intent Parsing & Verification",
        description: "Resolves primary customer request topic while validating user secure-token claims.",
        role: "Customer Intent Classifier"
      },
      {
        title: "Database Telemetry Query",
        description: "Retrieves network registers, historical invoices, and billing traces inside secured read-only memory.",
        role: "Billing Database Connector"
      },
      {
        title: "Resolution Strategy Engine",
        description: "Computes loyalty credits or service tier modifications based on enterprise policy guidelines.",
        role: "Policy Execution Agent"
      },
      {
        title: "Secured Transaction Run",
        description: "Fires secure webhooks to credit billing profiles and sends cryptographically verified notifications.",
        role: "Transaction Runner Agent"
      }
    ],
    challenge: "Large-scale customer support centers suffer from slow resolution times and high operational costs, yet generic AI chatbots frustrate high-net-worth customers by giving repetitive, unhelpful, and generic answers.",
    interpretation: "Analyzes user history and emotional sentiment. Cross-references internal knowledge bases, and formulates precise, highly contextual, empathetic resolutions.",
    knowledgeNeeded: [
      "Customer CRM transaction records",
      "Internal product resolution logs",
      "Live courier and shipping status APIs",
      "Tone of Voice & Sentiment Guardrails"
    ],
    humanApproval: "Support Supervisor reviews and edits responses for ultra-high-priority VIP clients before sending the final email or message.",
    governanceCheck: "Safety filter blocks toxic language, and prevents the agent from promising refunds or credits beyond pre-approved thresholds.",
    outputPreview: "{\n  \"client_tier\": \"VIP_PLATINUM\",\n  \"sentiment\": \"FRUSTRATED\",\n  \"detected_issue\": \"Delayed delivery of custom industrial server rack\",\n  \"proposed_solution\": \"Express courier redirection + $200 service credit\",\n  \"response_draft\": \"Dear Mr. Vance, we sincerely apologize for the delay. We have upgraded your shipping to overnight express...\"\n}",
    logs: [
      { timeOffset: 0.1, type: "system", text: "Initializing Customer Support Enclave inside isolated sandbox host..." },
      { timeOffset: 0.8, type: "info", text: "Successfully linked with Salesforce CRM & DHL Logistics API connectors." },
      { timeOffset: 1.5, type: "agent", text: "[SentimentClassifier] Ticket ID #9921 analyzed. Customer emotional index: FRUSTRATED." },
      { timeOffset: 2.3, type: "agent", text: "[CRMIntegrator] Client is marked Platinum. Historical billing total exceeds $420,000." },
      { timeOffset: 3.2, type: "warning", text: "[ResolutionSynthesizer] Delivery delayed at regional customs. Auto-generating overnight priority courier bypass." },
      { timeOffset: 4.1, type: "success", text: "Resolution email drafted. Sent to Support Supervisor interface for review. Dry-run complete." }
    ]
  },
  {
    id: "operations-copilot",
    name: "Predictive Maintenance Operations Agent",
    category: "Operations Copilot",
    purpose: "Analyzes high-frequency vibration and heat telemetry, predicts failure timelines, and dispatches warehouse resources.",
    recommendedIndustry: "Heavy Industry & Mining",
    relatedPlatform: "OreMesh / Telemetry",
    agentType: "Reactive / Hardware Integration",
    status: "Enclave Verified",
    securityRating: "Safety-Critical Enclave",
    metrics: {
      cpu: "16-Core vCPU",
      memory: "64GB Isolated",
      isolation: "AWS Nitro Enclave",
      compliance: "ISO-55001 Asset Management"
    },
    ingressLabel: "Vibration Sensor Stream",
    egressLabel: "Field Dispatch Work Order",
    steps: [
      {
        title: "Telemetry Signal Parsing",
        description: "Ingests and parses real-time sensor streams and applies Fast Fourier Transforms (FFT).",
        role: "Signal Processing Agent"
      },
      {
        title: "Mechanical Failure Predictor",
        description: "Evaluates wear patterns against digital-twin anomalies to estimate remaining useful machine life.",
        role: "Digital Twin Engine"
      },
      {
        title: "Material Stock Audit",
        description: "Queries localized warehouse systems to confirm critical replacement part counts.",
        role: "Inventory Audit Agent"
      },
      {
        title: "Work-Order Dispatch",
        description: "Generates preventative maintenance tickets and routes them to regional field crews.",
        role: "Maintenance Coordinator"
      }
    ],
    challenge: "Manufacturing plant operators struggle to predict equipment failure in industrial turbines, leading to catastrophic unscheduled downtime costing up to $500k per hour.",
    interpretation: "Polls vibrational and thermal sensors. Compiles deviation profiles against physics-based baseline models, and identifies structural wear metrics.",
    knowledgeNeeded: [
      "Vibration frequency baselines specifications",
      "Equipment manufacturing design sheets",
      "Turbine past maintenance log history",
      "Weather, ambient humidity, and load telemetry data"
    ],
    humanApproval: "Plant Director must manually sign off on the preventive maintenance dispatch order to shut down Turbine-3 for 2 hours.",
    governanceCheck: "Compliance check validates that all scheduled technicians have active safety certifications for High-Voltage Phase-3 equipment.",
    outputPreview: "{\n  \"asset_id\": \"TURBINE-03\",\n  \"anomaly_rating\": \"CRITICAL_92%\",\n  \"wear_indicator\": \"Bearing-B radial oscillation is 1.8mm/s above design limits\",\n  \"scheduled_maintenance\": \"Preventive maintenance recommended within 48 hours\",\n  \"required_parts\": \"ISO-Bearing-883-X\"\n}",
    logs: [
      { timeOffset: 0.2, type: "system", text: "Establishing physical communication with turbine IoT gateway buffer..." },
      { timeOffset: 0.9, type: "info", text: "Successfully connected. Collecting SCADA turbine telemetry stream..." },
      { timeOffset: 1.6, type: "agent", text: "[TelemetryIngestion] Pulled bearing vibration logs: 42Hz oscillations observed." },
      { timeOffset: 2.4, type: "agent", text: "[AnomalyDetector] CRITICAL DEVIATION: Bearing radial displacement is 1.8mm over threshold limit." },
      { timeOffset: 3.2, type: "warning", text: "[ManualRetriever] Retrieved maintenance file ISO-B-883-REPLACEMENT.pdf. Compiling instructions." },
      { timeOffset: 4.1, type: "success", text: "SAP Work Order drafted. Routed to Plant Director dashboard. Dry-run complete." }
    ]
  }
];

// List of all filters available
const INDUSTRIES = [
  "All Industries",
  "Energy & Utilities",
  "Retail & Supply Chain",
  "Professional Services",
  "Regulated / Legal",
  "Financial Services",
  "Government & Sovereign",
  "Telecom",
  "Heavy Industry & Mining"
];

const FUNCTIONS = [
  "All Functions",
  "Knowledge Search",
  "Procurement Copilot",
  "HR Assistant",
  "Contract Intelligence",
  "Executive Dashboard",
  "Compliance Assistant",
  "Customer Experience Agent",
  "Operations Copilot"
];

const AGENT_TYPES = [
  "All Agent Types",
  "Deep Reasoning / DAG",
  "Transactional / Actions",
  "Collaborative / HITL",
  "Analytical / Extraction",
  "Multi-Agent Synthesis",
  "Guardrail / Audit",
  "Real-time / Interactive",
  "Reactive / Hardware"
];

export default function SandboxPage() {
  // Filter States
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedFunction, setSelectedFunction] = useState("All Functions");
  const [selectedAgentType, setSelectedAgentType] = useState("All Agent Types");
  const [searchQuery, setSearchQuery] = useState("");

  // Catalog Active Agent Selection
  const [activeAgentId, setActiveAgentId] = useState(AGENTS[0].id);

  const [isHydrated, setIsHydrated] = useState(false);

  // Load from GFF Workspace on mount
  useEffect(() => {
    const saved = getToolState("sandbox");
    if (saved) {
      if (saved.selectedIndustry) setSelectedIndustry(saved.selectedIndustry);
      if (saved.selectedFunction) setSelectedFunction(saved.selectedFunction);
      if (saved.selectedAgentType) setSelectedAgentType(saved.selectedAgentType);
      if (typeof saved.searchQuery === "string") setSearchQuery(saved.searchQuery);
      if (saved.activeAgentId) setActiveAgentId(saved.activeAgentId);
    }
    setIsHydrated(true);
  }, []);

  // Save to GFF Workspace on changes
  useEffect(() => {
    if (isHydrated) {
      saveToolState("sandbox", {
        selectedIndustry,
        selectedFunction,
        selectedAgentType,
        searchQuery,
        activeAgentId
      });
    }
  }, [isHydrated, selectedIndustry, selectedFunction, selectedAgentType, searchQuery, activeAgentId]);

  // Simulation Telemetry States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulatedLogs, setSimulatedLogs] = useState<typeof AGENTS[0]["logs"]>([]);
  const [activeTab, setActiveTab] = useState<"blueprint" | "architecture" | "security">("blueprint");

  // Filter lists based on rules
  const filteredAgents = AGENTS.filter((agent) => {
    const matchIndustry = selectedIndustry === "All Industries" || agent.recommendedIndustry === selectedIndustry;
    const matchFunction = selectedFunction === "All Functions" || agent.category === selectedFunction;
    const matchType = selectedAgentType === "All Agent Types" || agent.agentType === selectedAgentType;
    const matchSearch =
      searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchIndustry && matchFunction && matchType && matchSearch;
  });

  // Dynamically pull active agent object
  const activeAgent = AGENTS.find((a) => a.id === activeAgentId) || AGENTS[0];

  // If filtered agents changed and current active isn't in filtered, select the first filtered one
  useEffect(() => {
    if (filteredAgents.length > 0 && !filteredAgents.find((a) => a.id === activeAgentId)) {
      setActiveAgentId(filteredAgents[0].id);
    }
  }, [selectedIndustry, selectedFunction, selectedAgentType, searchQuery, filteredAgents, activeAgentId]);

  // Reset simulation whenever active agent changes
  useEffect(() => {
    setIsSimulating(false);
    setSimulationProgress(0);
    setSimulatedLogs([]);
  }, [activeAgentId]);

  // Handle dry-run simulation progress
  useEffect(() => {
    if (!isSimulating) return;

    setSimulationProgress(0);
    setSimulatedLogs([]);

    const totalDuration = 4800; // 4.8s simulation
    const intervalTime = 50; // update every 50ms
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      setSimulationProgress(Math.round(progress));

      // Stream logs matching current timeline progress
      const secondsElapsed = elapsed / 1000;
      const activeLogs = activeAgent.logs.filter((log) => log.timeOffset <= secondsElapsed);
      setSimulatedLogs(activeLogs);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, activeAgent]);

  const [copiedStatus, setCopiedStatus] = useState(false);

  const handleCopySchema = () => {
    if (!activeAgent.outputPreview) return;
    navigator.clipboard.writeText(activeAgent.outputPreview);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  // Dynamic count generators for UI indicators
  const getIndustryCount = (ind: string) => {
    if (ind === "All Industries") return AGENTS.length;
    return AGENTS.filter((a) => a.recommendedIndustry === ind).length;
  };

  const getFunctionCount = (func: string) => {
    if (func === "All Functions") return AGENTS.length;
    return AGENTS.filter((a) => a.category === func).length;
  };

  const getAgentTypeCount = (type: string) => {
    if (type === "All Agent Types") return AGENTS.length;
    return AGENTS.filter((a) => a.agentType === type).length;
  };

  // Render modern animated connection DAG inside Sovereign Architecture Tab
  const renderSVGArchitecture = (agent: AgentDemo) => {
    return (
      <svg className="w-full h-full min-h-[220px]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGlow" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E4000F" />
            <stop offset="0.5" stopColor="#009DFF" />
            <stop offset="1" stopColor="#00FF9D" />
          </linearGradient>
          <filter id="glowEffect" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Boundary Box: Cryptographic Enclave */}
        <rect x="130" y="20" width="240" height="180" rx="16" fill="rgba(4,6,11,0.7)" stroke="rgba(0,157,255,0.25)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="250" y="212" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">
          SOVEREIGN ENCLAVE HARDWARE BOUNDARY
        </text>

        {/* Dynamic connection lines */}
        {/* Inbound path */}
        <path d="M 60 110 L 130 110" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="5 3" />
        <circle cx="100" cy="110" r="3" fill="#E4000F">
          <animate attributeName="cx" values="60;130" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Enclave internal routing path */}
        <path d="M 180 110 L 250 65 L 320 110" stroke="#009DFF" strokeWidth="1" />
        <path d="M 180 110 L 250 155 L 320 110" stroke="#009DFF" strokeWidth="1" />
        <circle cx="215" cy="87" r="2.5" fill="#009DFF">
          <animate attributeName="cx" values="180;250;320" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Outbound path */}
        <path d="M 370 110 L 440 110" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="5 3" />
        <circle cx="400" cy="110" r="3" fill="#00FF9D">
          <animate attributeName="cx" values="370;440" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Left Node: Inbound Ingress Source */}
        <circle cx="40" cy="110" r="16" fill="#0c0d12" stroke="#E4000F" strokeWidth="1.5" />
        <text x="40" y="113" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">IN</text>
        <text x="40" y="142" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
          {agent.ingressLabel}
        </text>

        {/* Enclave Nodes */}
        {/* Node A: Gateway Decryptor */}
        <circle cx="180" cy="110" r="14" fill="#04060b" stroke="#009DFF" strokeWidth="1.5" />
        <text x="180" y="113" fill="#009DFF" fontSize="7" fontFamily="monospace" textAnchor="middle">DEC</text>
        <text x="180" y="136" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">INGRESS</text>

        {/* Node B1: Graph/Vector Processor */}
        <circle cx="250" cy="65" r="14" fill="#04060b" stroke="#009DFF" strokeWidth="1.5" />
        <text x="250" y="68" fill="#009DFF" fontSize="7" fontFamily="monospace" textAnchor="middle">DAG</text>
        <text x="250" y="91" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">ORCHESTRATOR</text>

        {/* Node B2: Alignment & Policies */}
        <circle cx="250" cy="155" r="14" fill="#04060b" stroke="#9D00FF" strokeWidth="1.5" />
        <text x="250" y="158" fill="#9D00FF" fontSize="7" fontFamily="monospace" textAnchor="middle">ALN</text>
        <text x="250" y="181" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">ALIGNMENT</text>

        {/* Node C: API Router & Egress */}
        <circle cx="320" cy="110" r="14" fill="#04060b" stroke="#00FF9D" strokeWidth="1.5" />
        <text x="320" y="113" fill="#00FF9D" fontSize="7" fontFamily="monospace" textAnchor="middle">EGR</text>
        <text x="320" y="136" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace" textAnchor="middle">EGRESS</text>

        {/* Right Node: Sovereign Egress Target */}
        <circle cx="460" cy="110" r="16" fill="#0c0d12" stroke="#00FF9D" strokeWidth="1.5" />
        <text x="460" y="113" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OUT</text>
        <text x="460" y="142" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
          {agent.egressLabel}
        </text>
      </svg>
    );
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Sovereign Sandbox"
        title="Agent Deployment Sandbox"
        highlightedWord="Sandbox"
        description="Launch real-time isolated dry-runs of enterprise agent blueprints within cryptographic hardware boundaries. Test routing protocols, safety guardrails, and platform connections using local static mocks before staging."
        breadcrumbs={[
          { label: "Build Suite", href: "/platforms" },
          { label: "Sandbox Catalog" }
        ]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-12 relative z-10">
        
        {/* FILTERS & SEARCH MODULE */}
        <MotionReveal delay={0.1}>
          <div className="rounded-3xl border border-white/5 bg-[#030304]/80 backdrop-blur-[12px] p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#009DFF] animate-pulse" />
                  Sovereign Enclave Catalog
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Explore pre-designed autonomous agent profiles isolated by regulatory and hardware standards.
                </p>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search agents by keyword or purpose..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs bg-[#010101] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#009DFF]/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/30 hover:text-white transition-colors text-xs font-mono"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* EXPENSIVE GRID OF DROPDOWNS & FILTER PILLS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/5">
              
              {/* INDUSTRY FILTER */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">RECOMMENDED SECTOR</span>
                <div className="relative">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-[#05060c] border border-white/5 rounded-xl text-white/80 focus:outline-none focus:border-[#009DFF]/40 appearance-none cursor-pointer"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#020203]">
                        {ind} {ind !== "All Industries" ? `(${getIndustryCount(ind)})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* FUNCTION/CATEGORY FILTER */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">FUNCTIONAL SCOPE</span>
                <div className="relative">
                  <select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-[#05060c] border border-white/5 rounded-xl text-white/80 focus:outline-none focus:border-[#009DFF]/40 appearance-none cursor-pointer"
                  >
                    {FUNCTIONS.map((func) => (
                      <option key={func} value={func} className="bg-[#020203]">
                        {func} {func !== "All Functions" ? `(${getFunctionCount(func)})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* AGENT CLASSIFICATION FILTER */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">AGENT DEPLOYMENT TYPE</span>
                <div className="relative">
                  <select
                    value={selectedAgentType}
                    onChange={(e) => setSelectedAgentType(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-[#05060c] border border-white/5 rounded-xl text-white/80 focus:outline-none focus:border-[#009DFF]/40 appearance-none cursor-pointer"
                  >
                    {AGENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#020203]">
                        {type} {type !== "All Agent Types" ? `(${getAgentTypeCount(type)})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTIVE FILTER SUMMARIZATION BAR */}
            {(selectedIndustry !== "All Industries" || selectedFunction !== "All Functions" || selectedAgentType !== "All Agent Types" || searchQuery !== "") && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 text-xs text-white/60">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">Active Constraints:</span>
                {selectedIndustry !== "All Industries" && (
                  <span className="px-2.5 py-1 rounded-md bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20">
                    Industry: {selectedIndustry}
                  </span>
                )}
                {selectedFunction !== "All Functions" && (
                  <span className="px-2.5 py-1 rounded-md bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20">
                    Category: {selectedFunction}
                  </span>
                )}
                {selectedAgentType !== "All Agent Types" && (
                  <span className="px-2.5 py-1 rounded-md bg-[#9D00FF]/10 text-[#a855f7] border border-[#9D00FF]/20">
                    Type: {selectedAgentType}
                  </span>
                )}
                {searchQuery !== "" && (
                  <span className="px-2.5 py-1 rounded-md bg-white/5 text-white border border-white/10">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedIndustry("All Industries");
                    setSelectedFunction("All Functions");
                    setSelectedAgentType("All Agent Types");
                    setSearchQuery("");
                  }}
                  className="ml-auto text-xs font-mono text-[#E4000F] hover:underline"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </MotionReveal>

        {/* CORE WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FILTERED BENTO GRID CATALOG OF AGENT CARDS */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-white/50 px-2 font-mono">
              <span>EXPLORE ENCLAVE TEMPLATES ({filteredAgents.length} MATCHING)</span>
              <span>PAGE 1 OF 1</span>
            </div>

            {filteredAgents.length === 0 ? (
              <div className="rounded-3xl border border-white/5 bg-[#030304]/60 p-12 text-center space-y-4">
                <svg className="w-12 h-12 text-white/10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">No Sandbox Blueprints Match Filters</h4>
                  <p className="text-xs text-white/40 max-w-sm mx-auto">
                    Try loosening your industry, functional scope, or search queries to explore the standard GFF AI catalogue.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedIndustry("All Industries");
                    setSelectedFunction("All Functions");
                    setSelectedAgentType("All Agent Types");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:border-white/15 transition-all"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAgents.map((agent) => {
                  const isActive = agent.id === activeAgentId;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setActiveAgentId(agent.id)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-[#009DFF]/10 to-[#009DFF]/5 border-[#009DFF]/40 text-white shadow-lg shadow-[#009DFF]/5"
                          : "bg-[#030304]/80 border-white/5 text-white/80 hover:border-white/15 hover:bg-[#070709]"
                      }`}
                    >
                      {/* Left glowing border accent for active item */}
                      {isActive && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#E4000F] to-[#009DFF]" />
                      )}

                      {/* Header with status */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-mono tracking-wider font-bold text-white/40 uppercase">
                          {agent.category}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          agent.status === "Enclave Verified"
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                            : "bg-[#009DFF]/5 text-[#009DFF] border-[#009DFF]/20"
                        }`}>
                          ● {agent.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-md font-bold text-white mt-2 group-hover:text-white transition-colors flex items-center gap-2">
                        {agent.name}
                        <svg className={`w-3.5 h-3.5 text-white/30 group-hover:text-[#009DFF] group-hover:translate-x-0.5 transition-all ${isActive ? "text-[#009DFF]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </h3>

                      {/* Purpose */}
                      <p className="text-xs text-white/60 mt-2 font-light leading-relaxed">
                        {agent.purpose}
                      </p>

                      {/* Badges and metadata */}
                      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-y-2 text-[10px] font-mono">
                        <div className="flex flex-col">
                          <span className="text-white/30 uppercase tracking-widest text-[8px]">RECOMMENDED SECTOR</span>
                          <span className="text-white/80 mt-0.5 truncate">{agent.recommendedIndustry}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white/30 uppercase tracking-widest text-[8px]">PLATFORM SPEC</span>
                          <span className="text-[#009DFF] mt-0.5 truncate">{agent.relatedPlatform}</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          <span className="text-white/30 uppercase tracking-widest text-[8px]">DEPLOYMENT TYPE</span>
                          <span className="text-white/80 mt-0.5 truncate">{agent.agentType}</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          <span className="text-white/30 uppercase tracking-widest text-[8px]">SECURITY BOUNDARY</span>
                          <span className="text-purple-400 mt-0.5 truncate">{agent.securityRating}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ACTIVE AGENT SIMULATION WORKSPACE (STICKY) */}
          <div className="lg:col-span-6 lg:sticky lg:top-[116px] space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
              
              {/* TERMINAL MONITOR CONTROLLER HEADER */}
              <div className="px-6 py-4 border-b border-white/10 bg-[#04060b] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E4000F]/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009DFF]/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white/90 uppercase tracking-wider ml-2">
                    WORKSPACE DETECTOR // {activeAgent.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${isSimulating ? "bg-emerald-500 animate-pulse" : "bg-white/30"}`} />
                  <span className="text-white/40">{isSimulating ? "SIMULATION ACTIVE" : "STANDBY"}</span>
                </div>
              </div>

              {/* QUICK INSTANCE HARDWARE METRICS PANEL */}
              <div className="p-5 border-b border-white/5 bg-[#030304]/80 grid grid-cols-4 gap-4 text-[10px] font-mono">
                <div className="flex flex-col p-2.5 rounded bg-white/[0.01] border border-white/5">
                  <span className="text-white/30 text-[8px]">ALLOCATED HOST</span>
                  <span className="text-[#00FF9D] mt-1 font-semibold">{activeAgent.metrics.cpu}</span>
                </div>
                <div className="flex flex-col p-2.5 rounded bg-white/[0.01] border border-white/5">
                  <span className="text-white/30 text-[8px]">MEMORY LOCK</span>
                  <span className="text-[#009DFF] mt-1 font-semibold">{activeAgent.metrics.memory}</span>
                </div>
                <div className="flex flex-col p-2.5 rounded bg-white/[0.01] border border-white/5">
                  <span className="text-white/30 text-[8px]">ISOLATION SHIELD</span>
                  <span className="text-purple-400 mt-1 font-semibold">{activeAgent.metrics.isolation}</span>
                </div>
                <div className="flex flex-col p-2.5 rounded bg-white/[0.01] border border-white/5">
                  <span className="text-white/30 text-[8px]">COMPLIANCE TARGET</span>
                  <span className="text-amber-400 mt-1 font-semibold truncate">{activeAgent.metrics.compliance}</span>
                </div>
              </div>

              {/* HIGH-FIDELITY DETAILED VIEW TABS */}
              <div className="border-b border-white/5 bg-black flex text-[10px] font-mono uppercase tracking-widest text-center">
                <button
                  onClick={() => setActiveTab("blueprint")}
                  className={`flex-1 py-3.5 border-r border-white/5 hover:text-white transition-colors relative ${
                    activeTab === "blueprint" ? "text-[#009DFF] font-semibold bg-white/[0.02]" : "text-white/40"
                  }`}
                >
                  1. Simulation Workflow
                  {activeTab === "blueprint" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("architecture")}
                  className={`flex-1 py-3.5 border-r border-white/5 hover:text-white transition-colors relative ${
                    activeTab === "architecture" ? "text-[#009DFF] font-semibold bg-white/[0.02]" : "text-white/40"
                  }`}
                >
                  2. Sovereign DAG Map
                  {activeTab === "architecture" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex-1 py-3.5 hover:text-white transition-colors relative ${
                    activeTab === "security" ? "text-[#009DFF] font-semibold bg-white/[0.02]" : "text-white/40"
                  }`}
                >
                  3. Security & Governance
                  {activeTab === "security" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />
                  )}
                </button>
              </div>

              {/* ACTIVE TAB CONTENT DISPLAY PANEL */}
              <div className="flex-grow p-6 bg-[#010101] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === "blueprint" && (
                    <div className="space-y-5 text-left">
                      {/* DISCLAIMER */}
                      <div className="p-3 rounded-lg border border-amber-500/15 bg-amber-500/[0.02] flex items-start gap-2.5">
                        <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
                        <p className="text-[10px] font-mono text-amber-400 font-light leading-normal">
                          <strong className="font-bold">DETERMINISTIC PRESET WORKFLOW SIMULATION:</strong> Safe frontend dry-run (zero-trust, no live API computations, zero active data transmission).
                        </p>
                      </div>

                      {/* NARRATIVE SECTION */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-xl border border-white/5 bg-[#030304]/80 space-y-1.5">
                          <span className="text-[9px] font-mono text-[#E4000F] font-bold uppercase tracking-wider block">1. User Challenge</span>
                          <p className="text-xs text-white/80 font-light leading-relaxed">{activeAgent.challenge}</p>
                        </div>
                        <div className="p-3.5 rounded-xl border border-white/5 bg-[#030304]/80 space-y-1.5">
                          <span className="text-[9px] font-mono text-[#009DFF] font-bold uppercase tracking-wider block">2. Agent Interpretation</span>
                          <p className="text-xs text-white/80 font-light leading-relaxed">{activeAgent.interpretation}</p>
                        </div>
                      </div>

                      {/* KNOWLEDGE & GOVERNANCE */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[10px] font-mono">
                        <div className="p-3 rounded-xl border border-white/5 bg-[#030304]/80 space-y-1">
                          <span className="text-purple-400 font-bold uppercase tracking-wider block">3. Ingested Assets</span>
                          <div className="space-y-1 text-white/60">
                            {activeAgent.knowledgeNeeded?.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="truncate">• {item}</div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl border border-white/5 bg-[#030304]/80 space-y-1">
                          <span className="text-blue-400 font-bold uppercase tracking-wider block">5. HITL Gate</span>
                          <p className="text-[11px] text-white/70 font-light leading-normal truncate" title={activeAgent.humanApproval}>{activeAgent.humanApproval}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-white/5 bg-[#030304]/80 space-y-1">
                          <span className="text-amber-400 font-bold uppercase tracking-wider block">6. Sovereign Control</span>
                          <p className="text-[11px] text-white/70 font-light leading-normal truncate" title={activeAgent.governanceCheck}>{activeAgent.governanceCheck}</p>
                        </div>
                      </div>

                      {/* TIMELINE */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">4. Step-by-Step Chronology</span>
                        <div className="relative pl-5 space-y-4 before:absolute before:top-1.5 before:bottom-1.5 before:left-[9px] before:w-[1px] before:bg-white/10">
                          {activeAgent.steps.map((step, idx) => (
                            <div key={idx} className="relative pl-3 space-y-0.5">
                              <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-[#009DFF]" />
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-white">Step {idx + 1}: {step.title}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-white/5 text-white/40 uppercase">{step.role}</span>
                              </div>
                              <p className="text-[11px] text-white/50 font-light leading-relaxed">{step.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* OUTPUT PREVIEW */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-white/40 uppercase">
                          <span className="text-[#00FF9D] font-bold">7. Expected Output Preview (JSON Schema)</span>
                          <button onClick={handleCopySchema} className="text-[#009DFF] hover:underline">
                            {copiedStatus ? "COPIED" : "COPY SCHEMA"}
                          </button>
                        </div>
                        <pre className="p-3 rounded-xl border border-white/10 bg-[#020203] font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed max-h-36">
                          {activeAgent.outputPreview}
                        </pre>
                      </div>

                      {/* RELATED CTAs */}
                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">RELATED COOPERATING SUITES</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-left">
                          <a href="/build/talk" className="p-2.5 rounded-xl border border-white/5 bg-[#030304] hover:border-[#009DFF]/30 transition-all flex flex-col justify-between h-20 group">
                            <span className="text-[10px] font-bold text-white group-hover:text-[#009DFF] transition-colors">Talk to Agent Architect</span>
                            <span className="text-[8px] text-white/40 font-mono block leading-relaxed">Book a zero-trust enclave layout design session.</span>
                          </a>
                          <a href="/build/blueprint" className="p-2.5 rounded-xl border border-white/5 bg-[#030304] hover:border-[#9D00FF]/30 transition-all flex flex-col justify-between h-20 group">
                            <span className="text-[10px] font-bold text-white group-hover:text-[#9D00FF] transition-colors">Configure Blueprint</span>
                            <span className="text-[8px] text-white/40 font-mono block leading-relaxed">Configure customized node data schemas and inputs.</span>
                          </a>
                          <a href="/build/foundry-studio" className="p-2.5 rounded-xl border border-white/5 bg-[#030304] hover:border-[#E4000F]/30 transition-all flex flex-col justify-between h-20 group">
                            <span className="text-[10px] font-bold text-white group-hover:text-[#E4000F] transition-colors">Open Foundry Studio</span>
                            <span className="text-[8px] text-white/40 font-mono block leading-relaxed">Orchestrate raw secure data flow pipelines.</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "architecture" && (
                    <div className="space-y-6 flex flex-col h-full">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-wider block font-bold">FLOW TOPOLOGY ARCHITECTURE</span>
                        <h4 className="text-sm font-bold text-white">Isolated Data Routing & Cryptographic DAG</h4>
                        <p className="text-xs text-white/50 font-light">
                          Cryptographic verification and decryption happen natively at physical memory boundary nodes. No data touches raw external servers.
                        </p>
                      </div>

                      {/* DYNAMIC SVG CANVAS */}
                      <div className="p-4 rounded-2xl border border-white/5 bg-[#030304] flex items-center justify-center overflow-hidden">
                        {renderSVGArchitecture(activeAgent)}
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">GOVERNANCE METRICS</span>
                        <h4 className="text-sm font-bold text-white">Platform Alignment & Compliance Guardrails</h4>
                        <p className="text-xs text-white/50 font-light">
                          This deployment configuration is validated using static binary checks and certified against global privacy rules.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-white/5 bg-[#030304] space-y-2">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">SOVEREIGN TRUST RATING</span>
                          <p className="text-xs text-white/80 font-light">
                            Fully compliant under sovereign regional regulation patterns. Hardware enclaves lock memory access keys dynamically.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#030304] space-y-2">
                          <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider block font-bold">ZERO-TRUST AUDIT LOGS</span>
                          <p className="text-xs text-white/80 font-light">
                            Immutable logging layer writes SHA-256 block receipts for each transaction without persisting PII attributes locally.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#030304] space-y-2">
                          <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block font-bold">MODEL DRIFT GUARD</span>
                          <p className="text-xs text-white/80 font-light">
                            Continuous compliance score filters and mitigates potential hallucination patterns down to less than 0.01% standard.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#030304] space-y-2">
                          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block font-bold">VIRTUAL PRIVATE CANOPY</span>
                          <p className="text-xs text-white/80 font-light">
                            Isolated VPC boundary blockages deny any unencrypted internet egress during agent transaction routing tasks.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* SIMULATION ACTIVE OUTPUT STREAM MONITOR (TELEMETRY LOGS) */}
              <div className="border-t border-white/10 bg-black flex flex-col h-[280px]">
                
                {/* Console controller row */}
                <div className="px-5 py-3 border-b border-white/5 bg-[#030304]/90 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/40 tracking-wider">SECURE TELEMETRY SIMULATOR PANEL</span>
                  {simulationProgress > 0 && (
                    <span className="text-[9px] font-mono font-bold text-[#00FF9D]">
                      PROGRESS: {simulationProgress}%
                    </span>
                  )}
                </div>

                {/* Progress bar stream */}
                <div className="w-full h-1 bg-[#0c0c0e]">
                  <div
                    className="h-full bg-gradient-to-r from-[#E4000F] via-[#009DFF] to-[#00FF9D] transition-all duration-100"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>

                {/* Live Output Log Stream */}
                <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] space-y-2 bg-[#020202]">
                  {simulatedLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-3">
                      <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-center max-w-xs font-light text-[10px] uppercase tracking-wider">
                        Secure Enclave Ready. Click Launch to simulate dry-run telemetry outputs locally.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {simulatedLogs.map((log, idx) => {
                        const getLogColor = () => {
                          switch (log.type) {
                            case "success": return "text-[#00FF9D]";
                            case "warning": return "text-amber-400";
                            case "agent": return "text-[#009DFF]";
                            case "system": return "text-purple-400 font-bold";
                            default: return "text-white/70";
                          }
                        };
                        return (
                          <div key={idx} className="flex gap-2 border-l border-white/10 pl-2 text-[10px]">
                            <span className="text-white/20">+{log.timeOffset.toFixed(1)}s</span>
                            <span className="text-white/40">[{log.type.toUpperCase()}]</span>
                            <span className={getLogColor()}>{log.text}</span>
                          </div>
                        );
                      })}

                      {isSimulating && (
                        <div className="flex gap-2 items-center text-white/20 text-[9px]">
                          <span>•</span>
                          <span>•</span>
                          <span>•</span>
                          <span>Enclave processing stream active...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* LAUNCH CONTROL ROW */}
                <div className="p-4 border-t border-white/5 bg-[#030304] flex items-center justify-end gap-3">
                  {simulatedLogs.length > 0 && !isSimulating && (
                    <button
                      onClick={() => {
                        setSimulationProgress(0);
                        setSimulatedLogs([]);
                      }}
                      className="px-4 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10 hover:bg-white/5 text-white/80 transition-all"
                    >
                      Clear Logs
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsSimulating(true)}
                    disabled={isSimulating}
                    className="h-10 px-6 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#E4000F] to-[#009DFF] hover:opacity-95 text-white disabled:opacity-50 transition-opacity"
                  >
                    {isSimulating
                      ? `Enclave Active (${simulationProgress}%)`
                      : simulatedLogs.length > 0
                        ? "Re-Run Dry-Run Simulation"
                        : "Launch Simulated Sandbox"}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        <NextBestAction currentTool="sandbox" />

        {/* PREMIUM SECURE ENCLAVE CTA */}
        <PremiumCTA
          title="Ready to Build in the Sovereign Sandbox?"
          description="Engage our dedicated security architecture team to create isolated, zero-trust deployment sandboxes. Run real-time high-throughput agents optimized for your compliance blueprints."
          primaryLabel="Connect with Engineers"
          primaryHref="/#contact"
          secondaryLabel="Explore Architecture Specs"
          secondaryHref="/resources/architecture-library"
        />

      </div>
    </InnerPageShell>
  );
}
