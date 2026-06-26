"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function LabsPage() {
  const pageData = {
  "slug": "labs",
  "category": "Sandbox",
  "title": "Labs & Prototyping",
  "highlightedWord": "Labs",
  "description": "Rapid incubation sandbox designed to stress-test frontier models, model fine-tuning, and prompt optimization loops.",
  "activeLayerId": "experience",
  "useCases": [
    {
      "title": "Frontier Weight Audits",
      "description": "Evaluate accuracy across identical task blocks using different model weights to find sweet spots.",
      "badge": "AUDITING",
      "metric": {
        "value": "11+ Models",
        "label": "Tested Weight Sets"
      }
    },
    {
      "title": "Prompt Optimization Loops",
      "description": "Run algorithmic prompt fine-tuning cycles with automated grading heuristics.",
      "badge": "PROMPTING",
      "metric": {
        "value": "95% Acc",
        "label": "Target Quality"
      }
    },
    {
      "title": "Interactive Prototyping",
      "description": "Build quick functional wires and client mocks inside sandbox environments prior to code freezes.",
      "badge": "SANDBOX",
      "metric": {
        "value": "24 Hours",
        "label": "Prototype Span"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Dedicated Discovery Sprint",
      "desc": "Collaborative sandbox modeling session mapping prompts, interfaces, and APIs in 2 weeks.",
      "features": [
        "Frontier model benchmark",
        "Prompt optimization matrix",
        "Interface mockup review"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Validated",
      "label": "SANDBOX",
      "desc": "Clean test data validating capability, accuracy bounds, and budget requirements."
    },
    {
      "value": "Costed",
      "label": "ROI MODEL",
      "desc": "Complete assessment of expected token volumes, infrastructure costs, and latency SLAs."
    },
    {
      "value": "Ready",
      "label": "SPECS",
      "desc": "Coherent development files, model parameters, and APIs ready to feed into GFF Foundry."
    }
  ],
  "nextSteps": [
    {
      "title": "AI Strategy",
      "tag": "INCEPTION",
      "desc": "Architect readiness blueprints and feasibility.",
      "href": "/capabilities/strategy"
    },
    {
      "title": "Core Engineering",
      "tag": "SYSTEMS",
      "desc": "High-performance AI system build deep-dive.",
      "href": "/capabilities/engineering"
    }
  ],
  "relatedPlatform": "Sandbox Studio",
  "relatedPlatformHref": "/build/sandbox"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
