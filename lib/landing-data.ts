import {
  Bot,
  Building2,
  Factory,
  GraduationCap,
  Gauge,
  HeartPulse,
  Landmark,
  Layers3,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";

export const heroActions = [
  { label: "Explore Foundry", href: "#foundry", icon: "/intellegent_enterprise/industry.svg" },
  { label: "Start AI Journey", href: "#productized-assets", icon: "/intellegent_enterprise/internet.svg" },
  { label: "Talk to Agent", href: "#capabilities", icon: "/intellegent_enterprise/robot.svg" },
  { label: "Generate Blueprint", href: "#blueprint", icon: "/intellegent_enterprise/blueprint.svg" },
];

export const industryCards = [
  {
    title: "Financial Services & Trust",
    icon: Landmark,
    accent: "linear-gradient(135deg, #4F8CFF 0%, #34D3FF 100%)",
    glow: "#4F8CFF",
    eyebrow: "High-trust systems",
    summary: "From claims to client service, build dependable AI experiences for regulated teams.",
    items: ["Fraud review", "Client onboarding", "Policy servicing"],
    outcome: "Faster approvals with auditability built in",
  },
  {
    title: "Industry & Natural Resources",
    icon: Factory,
    accent: "linear-gradient(135deg, #FF7A59 0%, #FFB84A 100%)",
    glow: "#FF7A59",
    eyebrow: "Operational intelligence",
    summary: "Support plant operations, procurement, and asset reliability with AI-driven workflows.",
    items: ["Asset maintenance", "Supply planning", "Field support"],
    outcome: "Better uptime across the value chain",
  },
  {
    title: "Health & Life Sciences",
    icon: HeartPulse,
    accent: "linear-gradient(135deg, #24D39B 0%, #7DDEFF 100%)",
    glow: "#24D39B",
    eyebrow: "Patient-first AI",
    summary: "Design helpful AI touchpoints for intake, care coordination, and life sciences teams.",
    items: ["Patient intake", "Care ops", "Research support"],
    outcome: "Less admin, more time for care",
  },
  {
    title: "Public Service & Education",
    icon: GraduationCap,
    accent: "linear-gradient(135deg, #7C5CFF 0%, #29B7FF 100%)",
    glow: "#7C5CFF",
    eyebrow: "Civic and learning systems",
    summary: "Modernize student, citizen, and back-office experiences with transparent AI.",
    items: ["Citizen services", "Learning ops", "Grants"],
    outcome: "More responsive public and campus services",
  },
  {
    title: "Consumer & Digital Industry",
    icon: ShoppingBag,
    accent: "linear-gradient(135deg, #FF3B7A 0%, #8E63FF 100%)",
    glow: "#FF3B7A",
    eyebrow: "Growth engines",
    summary: "Bring speed to commerce, support, and digital operations where experience matters.",
    items: ["Retail", "Telecom", "Customer experience"],
    outcome: "Smoother journeys and stronger conversion",
  },
];

export const productizedFeatures = [
  { title: "Agent Marketplace", desc: "Curated agents ready for ops, support, and internal teams.", icon: Bot },
  { title: "AI Academy", desc: "Learning paths for builders, leaders, and enterprise users.", icon: Sparkles },
  { title: "AI Control Center", desc: "Monitor usage, approvals, and task health in one place.", icon: Gauge },
  { title: "Runtime Governance", desc: "Policy checks, audit trails, and guardrails by design.", icon: ShieldCheck },
];

export const insightsCards = [
  {
    title: "AI Factory",
    image: "/ai_foundary/factory.svg",
    description:
      "Build, deploy, and govern enterprise AI agents at scale. Highlights: 500+ agents, multi-cloud, enterprise governance.",
  },
  {
    title: "Manufacturing Intelligence Lab",
    image: "/manufacturing.png",
    description:
      "AI systems for modern industrial operations. Highlights: Digital twins, quality AI, supply chain optimisation, predictive maintenance, demand forecasting, plant copilots.",
  },
  {
    title: "Financial Services Lab",
    image: "/finance.webp",
    description:
      "AI for banking, insurance, and regulated financial operations. Highlights: Banking AI, insurance intelligence, wealth management AI, compliance / AML agents, loan origination agents.",
  },
  {
    title: "University AI Lab",
    image: "/what_we_build/labs.svg",
    description:
      "Future-ready AI education ecosystems for universities and higher education institutions. Highlights: Faculty enablement, AI curriculum, student innovation labs.",
  },
];

export const productizedColumns = [
  {
    title: "Garage",
    icon: Building2,
    items: ["Discover AI use cases", "Workshops and ideation", "AI labs", "Experiment zone"],
  },
  {
    title: "Runtime",
    icon: Workflow,
    items: ["Build agents", "Runtime orchestration", "Data fabric", "AI engineering"],
  },
  {
    title: "AI Architecture",
    icon: Layers3,
    items: ["Data & Intelligence Layer", "AI & Agent Layer", "Orchestration Layer", "Integration Layer"],
  },
];

export const agents = [
  {
    name: "STRATEGY AGENT",
    desc: "AI transformation strategy and roadmap advisor",
    icon: "/talk-to-an-ai-agent/strategy-agent.svg",
    color: "#E53434",
    gradient: "linear-gradient(149.2deg, rgba(229,52,52,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
  },
  {
    name: "AI ARCHITECT AGENT",
    desc: "Enterprise AI architecture and solution designer",
    icon: "/talk-to-an-ai-agent/architect-agent.svg",
    color: "#04B0FE",
    gradient: "linear-gradient(149.2deg, rgba(0,177,255,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
  },
  {
    name: "GOVERNANCE AGENT",
    desc: "AI governance, risk and compliance expert",
    icon: "/talk-to-an-ai-agent/governance-agent.svg",
    color: "#1DEE7B",
    gradient: "linear-gradient(149.2deg, rgba(29,238,123,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
  },
  {
    name: "INDUSTRY AGENT",
    desc: "Industry-specific AI use cases and transformation guide",
    icon: "/talk-to-an-ai-agent/industry-agent.svg",
    color: "#EB5620",
    gradient: "linear-gradient(149.2deg, rgba(235,86,32,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
  },
  {
    name: "TRAINING ADVISOR",
    desc: "AI talent, training and capability advisor",
    icon: "/talk-to-an-ai-agent/training-agent.svg",
    color: "#9C4DF0",
    gradient: "linear-gradient(149.2deg, rgba(156,77,240,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
  },
];

export const foundrySteps = [
  {
    title: "GARAGE",
    step: "01",
    name: "IDEATE",
    desc: "We explore ideas, problems and possibilities.",
    icon: "/ai_foundary/garage.svg",
    color: "#F74539",
    borderGradient: "linear-gradient(149.2deg, #F74539 1.08%, #8E99B7 98.68%)",
  },
  {
    title: "FOUNDRY",
    step: "02",
    name: "FORGE",
    desc: "We engineer, train and forge AI models and agents.",
    icon: "/ai_foundary/foundry.svg",
    color: "#E98828",
    borderGradient: "linear-gradient(155.78deg, #E98828 3.75%, #8E99B7 98.35%)",
  },
  {
    title: "FACTORY",
    step: "03",
    name: "ORCHESTRATE",
    desc: "We orchestrate intelligent workflows and integrate systems.",
    icon: "/ai_foundary/factory.svg",
    color: "#24ABFF",
    borderGradient: "linear-gradient(149.2deg, #24ABFF 1.91%, #8E99B7 97.57%)",
  },
  {
    title: "DEPLOY",
    step: "04",
    name: "DEPLOY",
    desc: "We launch AI solutions into your enterprise environment.",
    icon: "/ai_foundary/deploy.svg",
    color: "#FF3424",
    borderGradient: "linear-gradient(149.1deg, #FF3424 1.89%, #8E99B7 97.91%)",
  },
  {
    title: "EVOLVE",
    step: "05",
    name: "EVOLVE",
    desc: "We monitor, learn and continuously evolve for greater impact.",
    icon: "/ai_foundary/evolve.svg",
    color: "#976BFF",
    borderGradient: "linear-gradient(150.6deg, #976BFF 1.33%, #8E99B7 98.72%)",
  },
];

export const garageCards = [
  {
    title: "Mission",
    desc: "Autonomous agents that plan, reason and execute complex enterprise tasks.",
    icon: "/garage/mission.svg",
    borderGradient: "linear-gradient(149.2deg,#422B2A 1.08%,#09112B 98.68%)",
    glowColor: "#D400FF",
  },
  {
    title: "Leadership",
    desc: "Roadmaps and operating models for AI-driven transformation.",
    icon: "/garage/Leadership.svg",
    borderGradient: "linear-gradient(149.2deg,#321716 1.08%,#09112B 98.68%)",
    glowColor: "#7B61FF",
  },
  {
    title: "Locations",
    desc: "Custom AI solutions and platforms built for scale.",
    icon: "/garage/Location .svg",
    borderGradient: "linear-gradient(149.2deg,#582F19 1.08%,#09112B 98.68%)",
    glowColor: "#6F7CFF",
  },
  {
    title: "Partners",
    desc: "End-to-end automation of enterprise workflows with AI at the core.",
    icon: "/garage/end-end.svg",
    borderGradient: "linear-gradient(149.2deg,#003881 1.08%,#09112B 98.68%)",
    glowColor: "#FF7A1A",
  },
  {
    title: "Advisors",
    desc: "Responsible AI with trust, transparency and compliance.",
    icon: "/garage/advisors.svg",
    borderGradient: "linear-gradient(149.2deg,#192636 1.08%,#182F76 98.68%)",
    glowColor: "#24ABFF",
  },
  {
    title: "Investors",
    desc: "Co-innovate in our labs and build what's next, together.",
    icon: "/garage/investors.svg",
    borderGradient: "linear-gradient(149.2deg,#250537 1.08%,#182F76 98.68%)",
    glowColor: "#04B0FE",
  },
];
