import { 
  LayoutDashboard, 
  FolderGit, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  Cpu, 
  BarChart3, 
  Shield 
} from "lucide-react";

export const MODULES = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    tag: "SOVEREIGN OPERATING SYSTEM",
    title: "Unified Executive Control & Enclave Telemetry",
    description: "The operational command center for client boards and leadership, consolidating real-time multi-agent execution telemetry and eBPF kernel security monitoring into a clean executive overview.",
    bullets: [
      "Real-time state verification of running agent sandboxes.",
      "Integrated cryptographic ledger audits at a glance.",
      "Instant hardware-level execution tracking across all clusters."
    ],
    specs: [
      { label: "SYSTEM CLEARANCE", value: "Level III" },
      { label: "TOTAL CLUSTERS", value: "3 Active" },
      { label: "SYSTEM UPTIME", value: "99.999%" },
      { label: "EVENT FEED", value: "eBPF Live Streamed" }
    ],
    terminalOutput: [
      "[08:12:05] INITIALIZING ENCLAVE HANDSHAKE...",
      "[08:12:06] VERIFYING HARDWARE COMPLIANCE BOUNDARY...",
      "[08:12:07] SECURE CONNECTION ESTABLISHED WITH GFF-CENTRAL-02",
      "[08:12:08] ALL AGENT CORES OPERATING WITHIN GUARANTEED RISK PARAMETERS"
    ]
  },
  {
    id: "projects",
    name: "Projects",
    icon: FolderGit,
    tag: "EXECUTION & PIPELINES",
    title: "Multi-Agent Sandboxes & Industrial Milestones",
    description: "Track active multi-agent sandbox deployments, manage core project deliverables, and monitor milestones as agentic systems scale through design and execution phases.",
    bullets: [
      "Comprehensive tracking of execution milestones and epic deliverables.",
      "Audit trails mapping agent work directly to corporate hierarchy.",
      "Direct sandboxed workspace environments for rapid deployment."
    ],
    specs: [
      { label: "CURRENT PIPELINE", value: "Epic Phase 4" },
      { label: "SANDBOX ID", value: "SB-9102-ALPHA" },
      { label: "TOTAL TASKS RUNNING", value: "14 Parallel Loops" },
      { label: "WORKSPACE BOUNDARY", value: "Cryptographically decapsulated" }
    ],
    terminalOutput: [
      "[08:14:12] COMPILING AGENT BLUEPRINT SB-9102-ALPHA...",
      "[08:14:14] MEMORY LANE INJECTED: pgvector long-term persistence active.",
      "[08:14:15] EXECUTION MILESTONE: \"Foundry Evaluation Sandbox\" at 84%",
      "[08:14:16] TASK QUEUE: Dispatching 12 parallel task routers."
    ]
  },
  {
    id: "billing",
    name: "Invoices & Billing",
    icon: CreditCard,
    tag: "COMPUTATIONAL AUDITING",
    title: "The Cryptographic Epoch Cost Ledger",
    description: "Provides total transparency into token utilization, sandbox compute hours, and network traffic. View granular cost structures and SLA-auditable financial reports with absolute clarity.",
    bullets: [
      "Detailed billing per computational 'Epoch' or agent task loop.",
      "Clear, auditable trace of LLM token consumption and system runtimes.",
      "SLA compliance reports matching resource allocation to business outcomes."
    ],
    specs: [
      { label: "COST PER COGNITIVE HOUR", value: "Variable / Task-based" },
      { label: "BILLING TYPE", value: "Epoch Audited" },
      { label: "TOKEN DISPATCH LIMIT", value: "Enforced" },
      { label: "COST-REDUCTION INDEX", value: "Verified 41.2% Gain" }
    ],
    terminalOutput: [
      "[08:16:01] INITIATING EPOCH BILLING AUDIT...",
      "[08:16:03] FETCHING LEDGER TRANSACTIONS FROM SOVEREIGN HARDWARE SEED...",
      "[08:16:04] COMPUTED TOKEN COST: 1.2M tokens (Llama-3-70B pipeline)",
      "[08:16:05] TOTAL AUDITED COST FOR WEEK 26: Fully matched with SLA parameters."
    ]
  },
  {
    id: "support",
    name: "Support",
    icon: HelpCircle,
    tag: "MISSION-CRITICAL COMMUNICATION",
    title: "Encrypted SLA Wire & Operator Support",
    description: "Direct, secure connection with senior GFF AI system engineers and model architecture leads. Ensure high-priority issues are resolved under guaranteed SLA timelines.",
    bullets: [
      "Direct-to-operator secure chat console for high-severity sandboxing issues.",
      "Guaranteed 15-minute emergency response SLA for Level IV administrators.",
      "Fully encrypted diagnostic file attachment using secure handshake protocols."
    ],
    specs: [
      { label: "AVERAGE RESPONSE TIME", value: "8.4 Minutes" },
      { label: "ACTIVE TICKETS", value: "0 (All systems nominal)" },
      { label: "SLA METRIC", value: "100% Compliance" },
      { label: "COGNITIVE ASSISTANCE", value: "Enabled (Co-pilot triage)" }
    ],
    terminalOutput: [
      "[08:18:20] ESTABLISHING SECURE SUPPORT SOCKET...",
      "[08:18:22] OPERATOR CLEARANCE: Level V Operator online (Central HQ)",
      "[08:18:23] DICTIONARY STATE: Cryptographic zero-trust buffer active.",
      "[08:18:24] SYSTEM DESCRIPTOR: SLA priority tracking level 1 engaged."
    ]
  },
  {
    id: "documents",
    name: "Documents",
    icon: FileText,
    tag: "CRYPTOGRAPHIC DOCUMENT DEPOT",
    title: "The Secure Sovereign Legal Vault",
    description: "Review and manage cryptographic contracts, compliance documents, NDAs, project specifications, and architectural blueprints with guaranteed enterprise privacy.",
    bullets: [
      "Direct download of validated architecture specifications.",
      "Cryptographic validation of documents with SHA-256 and MD5 hashes.",
      "Sovereign data storage compliant with Singapore risk management guidelines."
    ],
    specs: [
      { label: "STORAGE SECURITY", value: "AES-256-GCM Enveloped" },
      { label: "CHECKSUM SYSTEM", value: "Sovereign SHA-256" },
      { label: "ACCESS PROTOCOL", value: "Enclave isolated" },
      { label: "REGULATORY COMPLIANCE", value: "Singapore PDPA standard" }
    ],
    terminalOutput: [
      "[08:20:44] RECONCILING VAULT DIRECTORY INDEX...",
      "[08:20:45] SHA-256 CHECK: Validated \"GFF_Blueprint_V4.2.pdf\" (0x3F882C...)",
      "[08:20:46] FILE STATUS: Encrypted at rest inside secure memory lane.",
      "[08:20:47] SECURITY LOG: Access request verified for client credentials."
    ]
  },
  {
    id: "ai-operations",
    name: "AI Operations",
    icon: Cpu,
    tag: "COGNITIVE PIPELINE CONTROL",
    title: "Stateful Multi-Agent Sandbox Orchestration",
    description: "Directly configure running agent profiles, map cognitive loops, edit pgvector memory lanes, and verify live tools execution under isolated eBPF sandboxing boundaries.",
    bullets: [
      "Dynamic model switching and prompt safety injection configurations.",
      "Sovereign tool sandboxing preventing shell injection or memory leakage.",
      "Memory lane tuning with custom pgvector similarity filters."
    ],
    specs: [
      { label: "MODEL CORES", value: "Llama-3, Qwen-2.5, GFF-Custom" },
      { label: "MEMORY DEPTH", value: "20,000 context window" },
      { label: "TOOL ISOLATION", value: "eBPF kernel restricted" },
      { label: "RETRY LOOPS", value: "Auto-healing with self-repair" }
    ],
    terminalOutput: [
      "[08:22:15] RETRIEVING RUNTIME PROFILE \"GFF-Agent-Factory-09\"...",
      "[08:22:17] BOOTING SANDBOX ENVIRONMENT #SB-109-OMEGA...",
      "[08:22:18] INJECTING SYSTEM PROMPT: Enforcing gff-ai-guardrails...",
      "[08:22:19] KERNEL CHECK: Memory isolation level = Hypervisor reinforced."
    ]
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    tag: "QUANTITATIVE ENTERPRISE VALUE",
    title: "Sovereign Performance & Labor Penetration Scoring",
    description: "Evaluate deployment success with data-backed indices. Monitor the Agentic GDP Index, labor substitution cost reductions, and overall organizational efficiency in real-time.",
    bullets: [
      "Real-time measurements of Digital Labour Penetration Scores.",
      "Interactive executive dashboards showing cost efficiency ratios.",
      "Traceable system execution metrics mapped to strategic KPIs."
    ],
    specs: [
      { label: "AGENTIC GDP INDEX", value: "84.2 Score" },
      { label: "LABOR SUBSTITUTION", value: "41.2% Gain" },
      { label: "AGENT RUNTIME EFFICIENCY", value: "98.7%" },
      { label: "TELEMETRY REFRESH RATE", value: "500ms" }
    ],
    terminalOutput: [
      "[08:24:33] STREAMING ANALYTICS CORES...",
      "[08:24:35] CALCULATING PRODUCTIVITY RATIO: Output vs Token Overhead.",
      "[08:24:36] INDEX STATE: Agentic GDP Index normalized at 1.42x productivity rate.",
      "[08:24:37] CHART ENGINE: Rendered 3D performance vector matrix (GFF-Engine)."
    ]
  },
  {
    id: "governance",
    name: "Governance",
    icon: Shield,
    tag: "SOVEREIGN RISK FRAMEWORK",
    title: "Algorithmic Risk Management & Safety Guardrails",
    description: "Monitor safety compliance at the kernel level. Track toxic-input blocks, evaluate real-time guardrail actions, and compile board-ready risk evaluation charts for security audits.",
    bullets: [
      "Real-time compliance checks across stateful multi-agent communication.",
      "Automated guardrail enforcement matching corporate governance rules.",
      "Detailed security audits prepared for direct presentation to corporate boards."
    ],
    specs: [
      { label: "RISK LEVEL", value: "Minimal / Decoupled Sandbox" },
      { label: "GUARDRAILS COMPLIANCE", value: "100.0% Enforced" },
      { label: "HARMFUL CONTENT BLOCK RATE", value: "99.999%" },
      { label: "COMPLIANCE AUDIT ENGINE", value: "eBPF event tracing" }
    ],
    terminalOutput: [
      "[08:26:10] PARSING ACTIVE GUARDRAILS LOG...",
      "[08:26:12] AUDIT: Validated zero toxic-input triggers in past 10,000 epochs.",
      "[08:26:13] SYSTEM BOUNDARY: No out-of-bounds filesystem requests detected.",
      "[08:26:14] SAFETY PROFILE: Verified compliance with GFF Sovereign Risk Standard."
    ]
  }
];
