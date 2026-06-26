import React from "react";

export interface Option {
  score: number;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface Dimension {
  id: string;
  name: string;
  shortName: string;
  color: string;
  borderColor: string;
  description: string;
  questions: Question[];
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "strategy",
    name: "Strategy & Alignment",
    shortName: "Strategy",
    color: "#009DFF",
    borderColor: "border-[#009DFF]/20",
    description: "Alignment of AI initiatives with core business differentiation and multi-year planning.",
    questions: [
      {
        id: "strategy_q1",
        text: "How is AI prioritized within your multi-year corporate strategy?",
        options: [
          { score: 1, label: "Ad-hoc / Opportunistic", description: "Explored primarily as isolated pilot projects or experimental IT snippets." },
          { score: 2, label: "Departmental Priority", description: "Integrated into specific division objectives like customer service or back-office script automation." },
          { score: 3, label: "Core Strategic Pillar", description: "Expressly defined in corporate strategies with dedicated executive sponsorship and capital allocation." },
          { score: 4, label: "Business Model Driver", description: "Positioned as a primary competitive differentiator, actively reorganizing processes around agentic flows." }
        ]
      },
      {
        id: "strategy_q2",
        text: "How does your organization identify and prioritize AI opportunities?",
        options: [
          { score: 1, label: "Reactive Response", description: "Driven primarily by vendor pitches or technical curiosity with minimal business case review." },
          { score: 2, label: "Technical Feasibility", description: "Evaluated based on ease of engineering implementation, rather than business impact or scaling risks." },
          { score: 3, label: "Value-Driven Framework", description: "Assessed via standard ROI spreadsheets, risk-impact matrices, and multi-disciplinary reviews." },
          { score: 4, label: "Sovereign Topologies", description: "Continuously mapped using formal frameworks matching organizational friction to custom multi-agent DAGs." }
        ]
      },
      {
        id: "strategy_q3",
        text: "What is your capital allocation model for AI initiatives?",
        options: [
          { score: 1, label: "Discretionary / OPEX", description: "Funded out of general maintenance budgets or ad-hoc department allocations." },
          { score: 2, label: "Annual Project Cycles", description: "Budgeted per specific initiative during standard annual corporate planning phases." },
          { score: 3, label: "Dedicated Multi-Year Capital", description: "Protected long-term transformation funds explicitly earmarked for AI enclaves and pilot scaling." },
          { score: 4, label: "Venture-Style Funding", description: "Agile, performance-gated capital allocations aligned to incremental telemetry metrics and sovereign outcomes." }
        ]
      }
    ]
  },
  {
    id: "data",
    name: "Data Readiness & Pipelines",
    shortName: "Data",
    color: "#00FF9D",
    borderColor: "border-[#00FF9D]/20",
    description: "Accessibility, cleanliness, security, and context structure of unstructured and structured corporate repositories.",
    questions: [
      {
        id: "data_q1",
        text: "How accessible and integrated is corporate data for autonomous workflows?",
        options: [
          { score: 1, label: "Siloed & Fragmented", description: "Trapped in legacy databases, on-prem servers, or unmapped folders with zero shared schema access." },
          { score: 2, label: "Centralized Lakehouses", description: "Aggregated in modern environments (e.g. Snowflake) but lacking semantic organization or indexing." },
          { score: 3, label: "Pipeline Orchestrated", description: "Equipped with active pipeline syncs, structured REST layers, and pre-indexed corporate taxonomies." },
          { score: 4, label: "Sovereign Knowledge Graphs", description: "Fully unified context layer mapping real-time semantic schemas into secure local vector databases." }
        ]
      },
      {
        id: "data_q2",
        text: "What is your methodology for processing unstructured data (PDFs, SOPs)?",
        options: [
          { score: 1, label: "Manual Retrieval", description: "Hardcopy printouts or scattered digital documents opened and searched manually by operators." },
          { score: 2, label: "Keyword Indexing", description: "Simple OCR scanning or search bars built into legacy file storage units with no semantics." },
          { score: 3, label: "Standard Vector RAG", description: "Automated document chunking, embedding generation, and query-response indexing in cloud vector stores." },
          { score: 4, label: "Cognitive Ingestion", description: "Hierarchical chunking, semantic cross-encoding, metadata enrichment, and active graph linking." }
        ]
      },
      {
        id: "data_q3",
        text: "How do you guarantee data freshness and detect telemetry anomalies?",
        options: [
          { score: 1, label: "Reactive Audits", description: "Data drift or broken feeds are only corrected when downstream applications experience failures." },
          { score: 2, label: "Scheduled Batch Syncs", description: "Nightly cron-jobs rebuild vector indexes or data lakes, leaving data stale during active hours." },
          { score: 3, label: "Real-Time Streaming", description: "Event-driven updates instantly refresh context vectors as changes propagate inside SQL databases." },
          { score: 4, label: "Self-Healing Context", description: "Active supervisor models audit, clean, and validate ingestion drift, raising alerts for anomaly spikes." }
        ]
      }
    ]
  },
  {
    id: "process",
    name: "Process & Workflow Maturity",
    shortName: "Process",
    color: "#9D00FF",
    borderColor: "border-[#9D00FF]/20",
    description: "Standardization of business logic, degree of digital automation, and human integration latency.",
    questions: [
      {
        id: "process_q1",
        text: "How documented and structured are your target business processes?",
        options: [
          { score: 1, label: "Tribal Knowledge", description: "Processes are unwritten, fluid, and completely dependent on individual employee memory." },
          { score: 2, label: "Static SOPs", description: "Written manuals exist but are frequently outdated and bypassed by workers." },
          { score: 3, label: "Digitized Workflows", description: "Mapped in modern SaaS, with software-driven state transitions and standardized operational rules." },
          { score: 4, label: "Agentic DAGs", description: "Processes are structured as modular execution graphs explicitly modeled for autonomous agent handoffs." }
        ]
      },
      {
        id: "process_q2",
        text: "What is the typical delay in operational decisions due to human bottlenecks?",
        options: [
          { score: 1, label: "Days or Weeks", description: "Requires manual compilation, formal email chains, and scheduled coordination meetings." },
          { score: 2, label: "Hours to Days", description: "Relies on standard notification dashboards, CRM task queues, and semi-automated ticket routing." },
          { score: 3, label: "Minutes / Real-Time", description: "Handled through instant Slack/Teams alerts, automated escalation alerts, and pre-approved logic templates." },
          { score: 4, label: "Sub-Second Autonomous", description: "Decided instantly by localized cognitive nodes with supervisor exceptions routed to human dashboards." }
        ]
      },
      {
        id: "process_q3",
        text: "How are process inefficiencies and performance bottlenecks identified?",
        options: [
          { score: 1, label: "Anecdotal Reporting", description: "Addressed only when employees complain or customer dissatisfaction levels spike significantly." },
          { score: 2, label: "Monthly Retrospectives", description: "Middle managers review basic KPIs and timeline bottlenecks on regular corporate calendars." },
          { score: 3, label: "Live Dashboard", description: "Operations track real-time queue lengths and SLA timers via structured visual monitoring platforms." },
          { score: 4, label: "Multi-Agent Telemetry", description: "Active logs trace every cognitive step and latency factor, dynamically pinpointing friction nodes." }
        ]
      }
    ]
  },
  {
    id: "talent",
    name: "Talent & Literacy",
    shortName: "Talent",
    color: "#EC4899",
    borderColor: "border-[#EC4899]/20",
    description: "In-house engineering strength, general AI literacy of employees, and structured transformation management.",
    questions: [
      {
        id: "talent_q1",
        text: "What is the level of general AI literacy and operational tool adoption?",
        options: [
          { score: 1, label: "Low Awareness", description: "Employees see AI as experimental or threatening, using it in hidden, unregulated ways." },
          { score: 2, label: "Basic Copilot Use", description: "Broad use of standard commercial chatbots for drafting emails, editing text, or simple web queries." },
          { score: 3, label: "Internal Portals", description: "Teams utilize custom company-approved AI portals built with security guidelines and specific templates." },
          { score: 4, label: "Coordinated Operators", description: "Staff are trained in prompt structures and agent supervision, actively co-working with digital nodes." }
        ]
      },
      {
        id: "talent_q2",
        text: "Describe your in-house software and artificial intelligence engineering strength:",
        options: [
          { score: 1, label: "External SIs Only", description: "Complete dependence on systems integrators or external consultants for basic software changes." },
          { score: 2, label: "Generalist IT Teams", description: "Competent web and database developers but lacking vector, RAG, or deep model hosting expertise." },
          { score: 3, label: "Data Science Center", description: "Staff data scientists and Python developers building custom models or integrating standard APIs." },
          { score: 4, label: "Sovereign Engineers", description: "Highly specialized engineers managing sandboxes, containerized enclaves, and local runtime models." }
        ]
      },
      {
        id: "talent_q3",
        text: "How is employee training and organizational friction managed?",
        options: [
          { score: 1, label: "Friction Ignored", description: "Tools are launched without formal enablement, leading to worker confusion and resistance." },
          { score: 2, label: "Occasional Briefings", description: "Broad webinars or introductory slide decks distributed to introduce general AI concepts." },
          { score: 3, label: "Structured Tracks", description: "Tailored educational courses mapping to specific business roles, with sandboxed safe playgrounds." },
          { score: 4, label: "Adaptive Organization", description: "Continuously updating organizational charts and duties designed specifically for collaborative AI execution." }
        ]
      }
    ]
  },
  {
    id: "governance",
    name: "Governance & Risk Controls",
    shortName: "Governance",
    color: "#E4000F",
    borderColor: "border-[#E4000F]/20",
    description: "Regulatory compliance, data isolation models, output validation rules, and explainable agent execution tracking.",
    questions: [
      {
        id: "governance_q1",
        text: "How are data leakage risks and model outputs verified?",
        options: [
          { score: 1, label: "Vendor Trust", description: "Direct connections to public APIs with zero local monitoring or safety auditing." },
          { score: 2, label: "Static Guidelines", description: "Written corporate policies telling employees not to paste sensitive parameters into online portals." },
          { score: 3, label: "Active Gatekeepers", description: "Automated middleware inspecting prompts for PII and filtering dangerous responses in real-time." },
          { score: 4, label: "Cryptographic Bounds", description: "Mathematical zero-retention rules verified at the VPC boundary with absolute localized isolation." }
        ]
      },
      {
        id: "governance_q2",
        text: "To what extent can decisions made by AI agents be audited and explained?",
        options: [
          { score: 1, label: "Black Box", description: "Decisions are executed without log history, making troubleshooting or regulatory compliance impossible." },
          { score: 2, label: "Inbound Transcripts", description: "Chat history or final text outputs are logged in text files, but intermediate thinking steps are lost." },
          { score: 3, label: "Step Reason Logs", description: "Full context maps, document scores, and model reasoning thoughts are stored inside an IT ledger." },
          { score: 4, label: "Deterministic Trace", description: "Every execution path is recorded on a secure ledger, with cryptographically signed action chains." }
        ]
      },
      {
        id: "governance_q3",
        text: "What is your approach to AI bias, hallucinations, and red-teaming?",
        options: [
          { score: 1, label: "Reactive Fixes", description: "Errors or biased outputs are only investigated and patched after users or clients complain." },
          { score: 2, label: "Manual Spot-Checking", description: "Operations teams manually review a small random percentage of transcripts once a month." },
          { score: 3, label: "Continuous Eval Sets", description: "Automated regression tests run updated validation data against models prior to deployment." },
          { score: 4, label: "Adversarial Stress", description: "Automated simulator models constantly attack system nodes to reveal security anomalies." }
        ]
      }
    ]
  },
  {
    id: "techstack",
    name: "Technology & Infrastructure Stack",
    shortName: "Tech Stack",
    color: "#3B82F6",
    borderColor: "border-[#3B82F6]/20",
    description: "Sovereign compute layers, model serving architectures, and zero-latency legacy software integrations.",
    questions: [
      {
        id: "techstack_q1",
        text: "What represents your core machine learning model hosting setup?",
        options: [
          { score: 1, label: "Public API Subscriptions", description: "Direct HTTP connections to standard commercial vendors; no dedicated clusters or control." },
          { score: 2, label: "Dedicated Cloud Enclaves", description: "Models deployed inside private corporate cloud tenants (VPCs) on standard hyperscaler infrastructure." },
          { score: 3, label: "Sovereign Local Serving", description: "Highly optimized model hosting on dedicated physical enclaves or regional sandboxed clusters." },
          { score: 4, label: "Dynamic Edge/Mesh Routing", description: "Decentralized mesh selecting nodes dynamically based on cost, performance, and localization laws." }
        ]
      },
      {
        id: "techstack_q2",
        text: "How cleanly are your AI systems integrated with legacy systems (e.g. ERP, CRM)?",
        options: [
          { score: 1, label: "Manual Data Entry", description: "AI outputs text to a window; human employees manually re-type insights into target tools." },
          { score: 2, label: "Batch File Overwrites", description: "Nightly cron operations copy spreadsheet files or database records to sync environments." },
          { score: 3, label: "Active REST Connectors", description: "Structured microservices and authenticated API endpoints update systems in real-time." },
          { score: 4, label: "Sovereign Event Streams", description: "Sovereign queues handle instant writebacks via transaction listeners with zero file persistence." }
        ]
      },
      {
        id: "techstack_q3",
        text: "What is your architecture strategy for localized fine-tuning or training?",
        options: [
          { score: 1, label: "Zero Fine-Tuning", description: "Relying 100% on general base models out of the box with zero custom parameters." },
          { score: 2, label: "Periodic Cloud Pipelines", description: "Cloud-based batch training runs executed every few months to adjust weights in cloud repositories." },
          { score: 3, label: "Localized Parameter Tuning", description: "Dedicated on-site compute servers adjusting weight adapters (LoRAs) inside secured local servers." },
          { score: 4, label: "Continuous Local Optimization", description: "Sovereign reinforcement loops continuously fine-tuning models on edge nodes securely." }
        ]
      }
    ]
  },
  {
    id: "leadership",
    name: "Leadership & Commitment",
    shortName: "Leadership",
    color: "#E5A93C",
    borderColor: "border-[#E5A93C]/20",
    description: "C-suite engagement, executive sponsorship of long-term milestones, and willingness to absorb early friction.",
    questions: [
      {
        id: "leadership_q1",
        text: "To what level is the executive leadership team involved in your AI roadmap?",
        options: [
          { score: 1, label: "Passive Awareness", description: "C-suite is interested in news trends but treats AI as a secondary IT maintenance discussion." },
          { score: 2, label: "Supportive Allocation", description: "Appoints budget limits for projects but leaves leadership direction and strategy to mid-level IT teams." },
          { score: 3, label: "Active Sponsorship", description: "C-suite leaders champion efforts, reviewing telemetry and ROI scorecards on a monthly basis." },
          { score: 4, label: "Visionary Direction", description: "AI is positioned as the central driver of business transformation in all executive and board plans." }
        ]
      },
      {
        id: "leadership_q2",
        text: "How resilient is project funding to early organizational friction or delayed ROI?",
        options: [
          { score: 1, label: "Extremely Fragile", description: "Funding is threatened or cut if immediate quarterly ROI targets aren't successfully achieved." },
          { score: 2, label: "Short-Term Rigid", description: "Capital is allocated annually, with rigid expectations that discourage creative risk-taking." },
          { score: 3, label: "Protected Reserves", description: "Dedicated multi-year reserves designed to tolerate exploratory, non-linear development paths." },
          { score: 4, label: "Sovereign Equity Model", description: "Continuous, milestone-linked funding that values data security and strategic capabilities as long-term assets." }
        ]
      },
      {
        id: "leadership_q3",
        text: "What is leadership's risk tolerance regarding pioneering technology paradigms?",
        options: [
          { score: 1, label: "Highly Risk-Averse", description: "Wait until solutions are 100% standard and proven across competitors (years behind edge)." },
          { score: 2, label: "Conservative Follower", description: "Wait for initial enterprise case studies to emerge before initiating similar projects." },
          { score: 3, label: "Calculated Early Adopter", description: "Willing to build custom enclaves or pilot novel agentic patterns to secure early strategic advantages." },
          { score: 4, label: "Sovereign Pioneer", description: "Partnering with research centers, creating proprietary models, and carving custom technical paths." }
        ]
      }
    ]
  },
  {
    id: "operating",
    name: "Operating Model & Delivery",
    shortName: "Operating Model",
    color: "#009DFF",
    borderColor: "border-[#009DFF]/20",
    description: "Co-working framework of human operators and cognitive agents, release velocities, and organizational structure.",
    questions: [
      {
        id: "operating_q1",
        text: "How is your software development and AI engineering delivery organized?",
        options: [
          { score: 1, label: "Siloed Divisions", description: "Isolated teams build disjointed scripts with zero standardization, standards, or coordination." },
          { score: 2, label: "Centralized IT Gatekeepers", description: "All requests funnel through a single queue, leading to significant delays and friction." },
          { score: 3, label: "Federated CoE", description: "Unified guidelines and reusable software templates paired with rapid departmental teams." },
          { score: 4, label: "Platform-as-a-Product", description: "Self-service developer frameworks enabling business units to spin up governed agents securely." }
        ]
      },
      {
        id: "operating_q2",
        text: "What is your typical cycle time from AI model concept to production release?",
        options: [
          { score: 1, label: "Greater than 12 Months", description: "Blocked by database access delays, manual reviews, and slow delivery pipelines." },
          { score: 2, label: "6 to 12 Months", description: "SaaS release tempos with extensive security paperwork and sequential manual verification gates." },
          { score: 3, label: "3 to 6 Months", description: "Agile sprints utilizing containerized pre-approved enclaves and fast sandbox pipelines." },
          { score: 4, label: "Less than 4 Weeks", description: "Fully continuous, compliance-certified sandbox promotion pipelines and automated unit testing." }
        ]
      },
      {
        id: "operating_q3",
        text: "What model governs interaction between human employees and active agents?",
        options: [
          { score: 1, label: "Disconnected Manual Swap", description: "No integration; employees manually look at AI text and execute work in distinct legacy software." },
          { score: 2, label: "SaaS Copilots", description: "AI sits inside existing text boxes or panels, acting as a passive drafting tool for human review." },
          { score: 3, label: "Human-in-the-Loop", description: "Agents run autonomous process loops, automatically pausing for human authorization on high-risk tasks." },
          { score: 4, label: "Full-Duplex Symbiosis", description: "Dynamic shared queues where humans and agents collaboratively delegate and optimize execution workflows." }
        ]
      }
    ]
  }
];
