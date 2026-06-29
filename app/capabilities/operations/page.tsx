"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function OperationsPage() {
  const pageData = {
  "slug": "operations",
  "category": "Telemetry",
  "title": "AI Operations & Monitoring",
  "highlightedWord": "Operations",
  "description": "Deploy automated operational monitors tracking semantic latency, cost anomalies, token consumption, and fallback systems.",
  "activeLayerId": "operations",
  "visualType":"operate",
  "useCases": [
    {
      "title": "Latency Telemetry",
      "description": "Track processing duration across token retrieval, microservice hops, and vector lookups.",
      "badge": "TELEMETRY",
      "metric": {
        "value": "<5ms",
        "label": "Telemetry Overhead"
      }
    },
    {
      "title": "Cost & Budget Guardrails",
      "description": "Continuous spending metrics on APIs with automated threshold overrides and alerts.",
      "badge": "COST CONSTRAINTS",
      "metric": {
        "value": "Automatic",
        "label": "Spend Throttling"
      }
    },
    {
      "title": "Model Failovers",
      "description": "Dynamic clientside failover routing to alternative models in case of latency breaches.",
      "badge": "RESILIENCY",
      "metric": {
        "value": "Active-Active",
        "label": "Clustered Paths"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "AIOps Deployment",
      "desc": "DevOps specialists configuring prometheus metrics, dashboard views, and fallback routes.",
      "features": [
        "Prometheus scraper setup",
        "Cost budget triggers",
        "Failover route testing"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Continuous",
      "label": "UPTIME",
      "desc": "Ensure persistent SLA performance across all system and model layers."
    },
    {
      "value": "Cost-Safe",
      "label": "RECOVERY",
      "desc": "Auto-detect and throttle looping models or anomalies prior to cost spikes."
    },
    {
      "value": "SLA-Guaranteed",
      "label": "PERFORMANCE",
      "desc": "Detailed performance telemetry showing absolute compliance to business SLA."
    }
  ],
  "nextSteps": [
    {
      "title": "Managed Services",
      "tag": "OPERATIONS",
      "desc": "Continuous model tuning, latency SLAs and upgrades.",
      "href": "/capabilities/managed-services"
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
