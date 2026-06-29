"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function ManagedServicesPage() {
  const pageData = {
  "slug": "managed-services",
  "category": "Operations",
  "title": "Managed AI Services",
  "highlightedWord": "Managed",
  "visualType":"managedAIServices",
  "description": "End-to-end management of custom models and operational stacks with 24/7 SLA monitoring, optimization, and upgrades.",
  "activeLayerId": "operations",
  "useCases": [
    {
      "title": "24/7 SLA Operations",
      "description": "Persistent system administration, latency auditing, and quick response protocols.",
      "badge": "MONITORING",
      "metric": {
        "value": "99.9%",
        "label": "Uptime Commitment"
      }
    },
    {
      "title": "Model Optimization Loops",
      "description": "Scheduled pruning, model calibration, and token usage optimization to control bills.",
      "badge": "TUNING",
      "metric": {
        "value": "-30%",
        "label": "Avg Cost Curves"
      }
    },
    {
      "title": "Layer Upgrades",
      "description": "Automated, non-disruptive migration path to advanced model weights and API schemas.",
      "badge": "UPGRADES",
      "metric": {
        "value": "Seamless",
        "label": "Migration Protocol"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Continuous Operations SLA",
      "desc": "GFF operations team overseeing clusters, tracking telemetry, and managing upgrades.",
      "features": [
        "Quarterly system tuning",
        "Uptime monitor SLA",
        "24/7 incident recovery"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "99.9% Uptime",
      "label": "SYSTEM SLA",
      "desc": "Reliable operational SLA keeping critical agentic lines running day and night."
    },
    {
      "value": "Reduced",
      "label": "RUN COSTS",
      "desc": "Active optimization of caching models and GPU setups reducing raw bill outputs."
    },
    {
      "value": "Future-Safe",
      "label": "ARCHITECTURE",
      "desc": "Continuous, smooth migrations to frontier tech with full regression testing."
    }
  ],
  "nextSteps": [
    {
      "title": "AI Operations",
      "tag": "TELEMETRY",
      "desc": "Deploy automated operational monitors and telemetry.",
      "href": "/capabilities/operations"
    },
    {
      "title": "Core Engineering",
      "tag": "SYSTEMS",
      "desc": "High-performance AI system build deep-dive.",
      "href": "/capabilities/engineering"
    }
  ],
  "relatedPlatform": "Foundry",
  "relatedPlatformHref": "/platforms/foundry"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
