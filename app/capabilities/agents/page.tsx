"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function AgentsPage() {
  const pageData = {
  "slug": "agents",
  "category": "Cognitive",
  "title": "Autonomous Agents",
  "highlightedWord": "Agents",
  "description": "Deploy multi-agent orchestrations and goal-directed cognitive loops that run business workflows with high autonomy.",
  "activeLayerId": "agentic",
  "useCases": [
    {
      "title": "Goal-Directed Workflows",
      "description": "Run multi-step task planning where agents autonomously divide work and execute APIs.",
      "badge": "AUTONOMY",
      "metric": {
        "value": "100%",
        "label": "Task Traceability"
      }
    },
    {
      "title": "Multi-Agent Networks",
      "description": "Stitch highly specialized agent nodes that pass messages and peer-review outputs.",
      "badge": "COORDINATION",
      "metric": {
        "value": "State Shared",
        "label": "Communication Mesh"
      }
    },
    {
      "title": "API Tool Bindings",
      "description": "Securely map backend transaction APIs to agentic loop planners.",
      "badge": "INTEGRATION",
      "metric": {
        "value": "Zero-Latency",
        "label": "API Execution"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Agent Factory Pod",
      "desc": "Custom configuration sprints compiling YAML layouts into active production agents.",
      "features": [
        "State engine debugging",
        "Tool-use testing",
        "Mock execution runs"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Unsupervised",
      "label": "AUTOMATION",
      "desc": "Workflows executing without manual human intervention while preserving full trace logs."
    },
    {
      "value": "Validated",
      "label": "EXECUTION",
      "desc": "All tools run inside secure sandboxes to avoid memory leakage or unintended mutations."
    },
    {
      "value": "Audit-Ready",
      "label": "TRACEABILITY",
      "desc": "Every step, thought, and API request is logged with structural trace IDs."
    }
  ],
  "nextSteps": [
    {
      "title": "Governance & Safety",
      "tag": "SECURITY",
      "desc": "Safety guardrails and compliance logs.",
      "href": "/capabilities/governance"
    },
    {
      "title": "Knowledge Graphs",
      "tag": "SEMANTIC",
      "desc": "Couple entity graphs with vector retrieval.",
      "href": "/capabilities/knowledge-graph"
    }
  ],
  "relatedPlatform": "Sandbox",
  "relatedPlatformHref": "/build/sandbox"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
