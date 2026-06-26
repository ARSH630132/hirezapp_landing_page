"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function KnowledgeGraphPage() {
  const pageData = {
  "slug": "knowledge-graph",
  "category": "Semantic",
  "title": "Semantic Knowledge Graphs",
  "highlightedWord": "Knowledge",
  "description": "Engineer rich context layers coupling structured entity graphs with high-dimensional vector search index databases.",
  "activeLayerId": "knowledge",
  "useCases": [
    {
      "title": "Entity Linking & Extract",
      "description": "Extract and map unified entity structures across fragmented databases and PDF files.",
      "badge": "RESOLUTION",
      "metric": {
        "value": "10M+ Nodes",
        "label": "Supported Scale"
      }
    },
    {
      "title": "Multi-Hop Context Synthesis",
      "description": "Traverse graph relations to feed models comprehensive connected context in single requests.",
      "badge": "CONTEXT ENGINE",
      "metric": {
        "value": "<120ms",
        "label": "Hop Speed"
      }
    },
    {
      "title": "Enforced Schema Logic",
      "description": "Validate model queries and outputs against strict semantic database schemas to eliminate lies.",
      "badge": "FACTS",
      "metric": {
        "value": "Deterministic",
        "label": "Lineage Path"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Knowledge Graph Synthesis",
      "desc": "Relational data engineers building custom Neo4j schemas and entity extraction loops.",
      "features": [
        "Schema configuration",
        "Extraction script testing",
        "Multi-hop query benchmarking"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Zero-Lie",
      "label": "DETERMINISM",
      "desc": "Model contexts constrained to verified graph entities with full lineage histories."
    },
    {
      "value": "Highly-Connected",
      "label": "CONTEXT",
      "desc": "Multi-document insights structured as active semantic nodes."
    },
    {
      "value": "Fast",
      "label": "RETRIEVAL",
      "desc": "Optimized retrieval loops linking vector queries and graph traversals seamlessly."
    }
  ],
  "nextSteps": [
    {
      "title": "Enterprise Data",
      "tag": "RECON",
      "desc": "Real-time CDC syncing and vector databases.",
      "href": "/capabilities/data"
    },
    {
      "title": "Autonomous Agents",
      "tag": "COGNITIVE",
      "desc": "Deploy multi-agent orchestrations and goal-directed loops.",
      "href": "/capabilities/agents"
    }
  ],
  "relatedPlatform": "Foundry Studio",
  "relatedPlatformHref": "/build/foundry-studio"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
