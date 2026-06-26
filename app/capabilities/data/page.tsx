"use client";

import React from "react";
import CapabilitySubpageFamily from "@/components/inner-pages/CapabilitySubpageFamily";

export default function DataPage() {
  const pageData = {
  "slug": "data",
  "category": "Data",
  "title": "Enterprise Data & Vector DB",
  "highlightedWord": "Data",
  "description": "Design real-time CDC sync, hybrid vector database partitioning, and high-volume unstructured semantic indexing.",
  "activeLayerId": "data",
  "useCases": [
    {
      "title": "CDC Stream Syncing",
      "description": "Set up Change Data Capture triggers to sync operational databases with semantic caches instantly.",
      "badge": "SYNCING",
      "metric": {
        "value": "<1s",
        "label": "Replication Lag"
      }
    },
    {
      "title": "Hybrid Vector DB Partitioning",
      "description": "Optimize database layout to partition dimensional data, securing low multitenant overheads.",
      "badge": "RETRIEVAL",
      "metric": {
        "value": "Sub-15ms",
        "label": "Search Speed"
      }
    },
    {
      "title": "Unstructured Parsing",
      "description": "High-throughput engines converting rich documents and slide decks into coherent semantic chunks.",
      "badge": "DATA PREP",
      "metric": {
        "value": "10k/sec",
        "label": "Chunk Ingestion"
      }
    }
  ],
  "deliveryModels": [
    {
      "name": "Data Integration Pod",
      "desc": "ML-data specialists setting up Kafka loops, chunk parsing pipelines, and vector schemas.",
      "features": [
        "Kafka stream binding",
        "pgvector schema layout",
        "Semantic cache optimization"
      ]
    }
  ],
  "outcomes": [
    {
      "value": "Real-Time",
      "label": "SYNCHRONY",
      "desc": "Active business transactions reflected inside retrieval caches within seconds."
    },
    {
      "value": "Deterministic",
      "label": "LINEAGE",
      "desc": "Trace database vectors back to original document text nodes with absolute precision."
    },
    {
      "value": "Scalable",
      "label": "STORAGE",
      "desc": "Partitioning models suited to scale into hundreds of millions of semantic vectors."
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
      "title": "Core Engineering",
      "tag": "SYSTEMS",
      "desc": "High-performance AI system build deep-dive.",
      "href": "/capabilities/engineering"
    }
  ],
  "relatedPlatform": "Foundry Studio",
  "relatedPlatformHref": "/build/foundry-studio"
};

  return <CapabilitySubpageFamily {...(pageData as any)} />;
}
