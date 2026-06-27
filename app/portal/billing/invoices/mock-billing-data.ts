export const DETAILED_INVOICES: Record<string, {
  projectName: string;
  category: string;
  date: string;
  dueDate: string;
  amount: string;
  hash: string;
  signature: string;
  items: { desc: string; cost: string }[];
  method: string;
  enclaveZone: string;
}> = {
  "GFF-2026-0899": {
    projectName: "Retail Mesh Core A1",
    category: "Compute Epoch",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    amount: "$14,820.00 USD",
    hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B",
    signature: "SHA_992ADF93EE",
    items: [
      { desc: "Continuous Real-Time POS Edge Synchronization", cost: "$6,500.00" },
      { desc: "Sovereign Node Epoch Compute Hours (Zone SG-A)", cost: "$5,200.00" },
      { desc: "Telemetry Interface & eBPF Log Hook Porting", cost: "$3,120.00" }
    ],
    method: "Corporate Wire Transfer (SWIFT)",
    enclaveZone: "SG-ZONE-A (SINGAPORE ENCLAVE)"
  },
  "GFF-2026-0914": {
    projectName: "Sovereign Mining Loop",
    category: "SLA Support",
    date: "2026-06-15",
    dueDate: "2026-06-30",
    amount: "$3,500.00 USD",
    hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA",
    signature: "SHA_881BCF12DD",
    items: [
      { desc: "SLA Support Priority Response Tier 3 License", cost: "$2,500.00" },
      { desc: "Cryptographic Vault Ledger Custody & Sync", cost: "$1,000.00" }
    ],
    method: "Corporate Wire Transfer (SWIFT)",
    enclaveZone: "EU-ZONE-W (FRANKFURT ENCLAVE)"
  },
  "GFF-2026-0945": {
    projectName: "Singapore Sandbox Enclave",
    category: "Telemetry Stream",
    date: "2026-06-25",
    dueDate: "2026-07-10",
    amount: "$24,900.00 USD",
    hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA",
    signature: "SHA_002ECA9291",
    items: [
      { desc: "High-Inference LLM Sandbox Core Allocation (8 Cores)", cost: "$16,500.00" },
      { desc: "Sovereign Isolation Sandbox Zone B Infrastructure", cost: "$5,400.00" },
      { desc: "Continuous Threat-Guard Policy Guardrail Audits", cost: "$3,000.00" }
    ],
    method: "Corporate Wire Transfer (SWIFT)",
    enclaveZone: "SG-ZONE-B (SINGAPORE ENCLAVE)"
  },
  "GFF-2026-0988": {
    projectName: "Multi-Agent Inference Cluster",
    category: "Compute Epoch",
    date: "2026-06-27",
    dueDate: "2026-07-15",
    amount: "$8,250.00 USD",
    hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492",
    signature: "SHA_773BCDE88E",
    items: [
      { desc: "Multi-Agent Routing Quota (4 Cores Dedicated)", cost: "$5,800.00" },
      { desc: "Distributed eBPF Profiling Logs Stream", cost: "$2,450.00" }
    ],
    method: "Corporate Wire Transfer (SWIFT)",
    enclaveZone: "US-ZONE-E (VIRGINIA ENCLAVE)"
  }
};
