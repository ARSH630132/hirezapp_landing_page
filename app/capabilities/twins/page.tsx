"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function TwinsPage() {
  const pageData = {
  "slug": "twins",
  "category": "Simulation",
  "title": "Cognitive Digital Twins",
  "highlightedWord": "Twins",
  "description": "Model complex, multi-variable business assets and processes inside high-fidelity digital replicas for optimization.",
  "activeLayerId": "knowledge",
  "useCases": [
    {
      "title": "Asset Simulation",
      "description": "Model physical assets and parameters to forecast wear, operations, and efficiency.",
      "badge": "SIMULATION",
      "metric": {
        "value": "Dynamic",
        "label": "Asset State Tracking"
      }
    },
    {
      "title": "Workflow Replicas",
      "description": "Construct replicas of organizational workflow paths to inspect resource blocks.",
      "badge": "FLOW CHARTING",
      "metric": {
        "value": "Simulated",
        "label": "Friction Vectors"
      }
    },
    {
      "title": "Predictive Operations",
      "description": "Run complex predictive scenarios based on semantic variables inside graph states.",
      "badge": "FORECASTING",
      "metric": {
        "value": "Monte-Carlo",
        "label": "Forecast Schema"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Digital Twin Blueprint Pod",
      "desc": "Specialists mapping assets into Neo4j graphs and defining state sync equations.",
      "features": [
        "Graph model creation",
        "Data sync loop setup",
        "Predictive script tests"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "High-Fidelity",
      "label": "REPLICATION",
      "desc": "Accurate software models mirroring real-time operational states."
    },
    {
      "value": "Bottleneck-0",
      "label": "OPTIMIZATION",
      "desc": "Locate and eliminate resource contention vectors through continuous simulation."
    },
    {
      "value": "Validated",
      "label": "PREDICTION",
      "desc": "Reliable simulation outputs backing strategic planning with semantic facts."
    }
  ],
  "nextSteps": [
    {
      "title": "Knowledge Graphs",
      "tag": "COGNITIVE",
      "desc": "Couple entity graphs with vector retrieval.",
      "href": "/capabilities/knowledge-graph"
    },
    {
      "title": "AI Strategy",
      "tag": "INCEPTION",
      "desc": "Architect readiness blueprints and feasibility.",
      "href": "/capabilities/strategy"
    }
  ],
  "relatedPlatform": "Foundry Studio",
  "relatedPlatformHref": "/build/foundry-studio"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
