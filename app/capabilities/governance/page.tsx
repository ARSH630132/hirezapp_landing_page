"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function GovernancePage() {
  const pageData = {
  "slug": "governance",
  "category": "Security",
  "title": "Governance & Safety",
  "highlightedWord": "Governance",
  "description": "Implement continuous safety guardrails, real-time input/output sanitization, PII shielding, and compliance audit logging.",
  "activeLayerId": "governance",
  "useCases": [
    {
      "title": "Real-Time Input Filtering",
      "description": "Prevent malicious injection, system manipulation, and compliance drift at the boundary.",
      "badge": "GUARDRAILS",
      "metric": {
        "value": "<12ms",
        "label": "Filter Latency"
      }
    },
    {
      "title": "PII Sanitization",
      "description": "Real-time masking and scrubbing of customer sensitive records before they reach any model weights.",
      "badge": "ANONYMITY",
      "metric": {
        "value": "99.9%",
        "label": "PII Scrub Rate"
      }
    },
    {
      "title": "Compliance Logging",
      "description": "Maintain immutable records of model queries, tool outputs, and action audits in secure storages.",
      "badge": "AUDITING",
      "metric": {
        "value": "SOC2 Mapped",
        "label": "Audit Standard"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Governance Policy Pod",
      "desc": "Dedicated team configuring GFF Shield parameters and setting enterprise compliance thresholds.",
      "features": [
        "Scrub rule definition",
        "Injection vector testing",
        "Policy-drift report setups"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Bulletproof",
      "label": "COMPLIANCE",
      "desc": "100% adherence to corporate data privacy policies with no external leakage."
    },
    {
      "value": "Seamless",
      "label": "LATENCY",
      "desc": "All guardrail and sanitization loops execute with sub-12ms processing times."
    },
    {
      "value": "Auditable",
      "label": "SYSTEMS",
      "desc": "Fully structured records tracking compliance breaches, warnings, and overrides."
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
      "title": "Managed Services",
      "tag": "OPERATIONS",
      "desc": "Continuous model tuning, latency SLAs and upgrades.",
      "href": "/capabilities/managed-services"
    }
  ],
  "relatedPlatform": "Foundry",
  "relatedPlatformHref": "/platforms/foundry"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
