"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function UniversitiesPage() {
  const pageData = {
  "slug": "universities",
  "category": "Academy",
  "title": "AI Enablement & Academics",
  "highlightedWord": "Enablement",
  "description": "Upskill internal developers and empower strategic leaders with corporate-grade technical AI enablement academies.",
  "activeLayerId": "experience",
  "useCases": [
    {
      "title": "Strategic Leadership Align",
      "description": "Train leadership on cognitive modeling, budget scoping, and governance standards.",
      "badge": "EXECUTIVE",
      "metric": {
        "value": "C-Level Mapped",
        "label": "Content Mappings"
      }
    },
    {
      "title": "Developer Bootcamps",
      "description": "Intensive training focusing on custom agent configurations and semantic search setups.",
      "badge": "ENGINEERING",
      "metric": {
        "value": "Syllabus",
        "label": "Systems-First Content"
      }
    },
    {
      "title": "Continuous Upgrades",
      "description": "Periodic curriculum modules covering monthly trends in model weights and security layers.",
      "badge": "CURRICULUM",
      "metric": {
        "value": "Ongoing",
        "label": "Cadence Intervals"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Enablement Sprint",
      "desc": "Immersive workshops designed to align strategic and development assets.",
      "features": [
        "Executive roadmap alignment",
        "Developer sandbox setups",
        "Curriculum handbook releases"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Aligned",
      "label": "EXECUTIVE TEAM",
      "desc": "Scoping models and operational ROI parameters validated with strategic assets."
    },
    {
      "value": "Upskilled",
      "label": "ENGINEERS",
      "desc": "Internal team members fully certified on deploying custom agent configurations."
    },
    {
      "value": "Persistent",
      "label": "LITERACY",
      "desc": "Long-term internal capability to run, scope, and audit cognitive software layers."
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
      "title": "Labs & Prototypes",
      "tag": "SANDBOX",
      "desc": "Rapid prototyping sandbox to stress-test frontier agents.",
      "href": "/capabilities/labs"
    }
  ],
  "relatedPlatform": "Sandbox Studio",
  "relatedPlatformHref": "/build/sandbox"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
