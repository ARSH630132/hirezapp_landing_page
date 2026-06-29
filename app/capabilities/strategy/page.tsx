"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function StrategyPage() {
  const pageData = {
  "slug": "strategy",
  "category": "Transformation",
  "title": "AI Strategy & Roadmap",
  "highlightedWord": "Strategy",
  "description": "Architect custom readiness blueprints, feasibility studies, and ROI simulations aligned with executive strategy.",
  "activeLayerId": "experience",
  "visualType": "strategy",
  "useCases": [
    {
      "title": "Transformation Blueprinting",
      "description": "Design a long-term technical roadmap integrating agent systems and security architectures.",
      "badge": "ROADMAP",
      "metric": {
        "value": "3-5 Yrs",
        "label": "Strategic Horizon"
      }
    },
    {
      "title": "Feasibility Modeling",
      "description": "Stress-test legacy databases, latency envelopes, and data pipelines for agent deployment.",
      "badge": "TECHNICAL",
      "metric": {
        "value": "98%",
        "label": "Feasibility Recall"
      }
    },
    {
      "title": "ROI Projections",
      "description": "Quantify potential resource optimizations, computational efficiency gains, and licensing savings.",
      "badge": "FINANCIAL",
      "metric": {
        "value": "Simulation",
        "label": "Automated Output"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Strategic Sprint Pod",
      "desc": "A rapid 6-week architecture pod evaluating stack readiness.",
      "features": [
        "Feasibility matrix",
        "Database latency auditing",
        "ROI projection model"
      ]
    },
    {
      "name": "Dedicated Discovery Lab",
      "desc": "Long-term sandboxed modeling of cross-department agency dependencies.",
      "features": [
        "System interface scoping",
        "Custom prompt mapping",
        "Security boundary design"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Full Stack",
      "label": "BLUEPRINT",
      "desc": "Completed and audited technical diagram mapped to SOC2 standards."
    },
    {
      "value": "0-Risk",
      "label": "FEASIBILITY",
      "desc": "Complete risk logs and remediation strategies designed prior to active code."
    },
    {
      "value": "Unified",
      "label": "ALIGNMENT",
      "desc": "Executive alignment sessions and architectural consensus."
    }
  ],
  "nextSteps": [
    {
      "title": "Core Engineering",
      "tag": "SYSTEMS",
      "desc": "High-performance AI system build deep-dive.",
      "href": "/capabilities/engineering"
    },
    {
      "title": "Autonomous Agents",
      "tag": "COGNITIVE",
      "desc": "Autonomous agent loops and workflows.",
      "href": "/capabilities/agents"
    }
  ],
  "relatedPlatform": "Foundry Studio",
  "relatedPlatformHref": "/build/foundry-studio"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
