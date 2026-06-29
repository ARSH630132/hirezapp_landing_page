"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function EngineeringPage() {
  const pageData = {
  "slug": "engineering",
  "category": "Systems",
  "title": "Core AI Engineering",
  "highlightedWord": "Engineering",
  "description": "Build and scale custom foundation networks, low-latency API architectures, and localized LLM deployments.",
  "activeLayerId": "agentic",
  "visualType": "engineering",
  "useCases": [
    {
      "title": "Low-Latency Microservices",
      "description": "Optimize inference paths, host localized custom model networks, and secure low-overhead API routers.",
      "badge": "PERFORMANCE",
      "metric": {
        "value": "<45ms",
        "label": "API Overhead"
      }
    },
    {
      "title": "Dynamic Routing Gateways",
      "description": "Intelligent request dispatching based on payload complexity, optimizing token costs.",
      "badge": "ORCHESTRATION",
      "metric": {
        "value": "Dynamic",
        "label": "Semantic Dispatch"
      }
    },
    {
      "title": "Localized Infrastructure",
      "description": "Host high-performance open weights models in secure, dedicated network clusters.",
      "badge": "INFRASTRUCTURE",
      "metric": {
        "value": "Fully Isolated",
        "label": "Data Boundary"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Systems Engineering Squad",
      "desc": "Senior systems and ML engineers embedding inside your development stack.",
      "features": [
        "Latency-profile optimization",
        "gRPC router configuration",
        "Custom vLLM setup"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Sub-Second",
      "label": "LATENCY",
      "desc": "Total round-trip semantic response loops optimized to meet enterprise SLAs."
    },
    {
      "value": "Isolated",
      "label": "SECURITY",
      "desc": "100% data enclosure within localized networks with zero third-party calls."
    },
    {
      "value": "Optimized",
      "label": "COMPUTE",
      "desc": "Inference pipelines scheduled dynamically to maximize GPU memory allocation."
    }
  ],
  "nextSteps": [
    {
      "title": "Autonomous Agents",
      "tag": "COGNITIVE",
      "desc": "Deploy multi-agent orchestrations and goal-directed loops.",
      "href": "/capabilities/agents"
    },
    {
      "title": "Governance & Safety",
      "tag": "SECURITY",
      "desc": "Safety guardrails and compliance logs.",
      "href": "/capabilities/governance"
    }
  ],
  "relatedPlatform": "Foundry",
  "relatedPlatformHref": "/platforms/foundry"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
