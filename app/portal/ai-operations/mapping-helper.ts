export interface ApiAiOperation {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  project_id: string;
  status: string;
  health: string;
  agent_type: string;
  governance_status: string;
  owner: string;
  desc: string;
  lastUpdated: string;
}

export interface EnrichedAgent {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: "active" | "evaluating" | "warning" | "decoupled";
  type: "Core Telemetry" | "Alignment Guard" | "Seismic Processing" | "Medical Enclave" | "Transport Node";
  stage: "Sandbox Emulation" | "Staging Enclave" | "Production Guardrail";
  threads: number;
  memory: string;
  logs: string[];
  lastHeartbeat: string;
  cpu: number;
  ram: number;
  latency: number;
  uptime: number;
}

export function mapApiOpToEnrichedAgent(op: ApiAiOperation): EnrichedAgent {
  // Generate stable mock metrics based on ID string hash to prevent flickering
  let idSum = 0;
  for (let i = 0; i < op.id.length; i++) {
    idSum += op.id.charCodeAt(i);
  }
  const hash = idSum * 17;

  // Determine status
  let status: "active" | "evaluating" | "warning" | "decoupled" = "active";
  if (op.status === "decoupled" || op.health === "offline" || op.status === "paused" || op.status === "archived") {
    status = "decoupled";
  } else if (op.health === "critical" || op.governance_status === "flagged") {
    status = "warning";
  } else if (op.health === "warning" || op.governance_status === "under_review" || op.status === "evaluating") {
    status = "evaluating";
  } else {
    status = "active";
  }

  // Determine Agent Type
  let type: "Core Telemetry" | "Alignment Guard" | "Seismic Processing" | "Medical Enclave" | "Transport Node" = "Core Telemetry";
  if (op.agent_type === "autonomous") {
    type = hash % 2 === 0 ? "Core Telemetry" : "Alignment Guard";
  } else if (op.agent_type === "human-in-the-loop") {
    type = "Alignment Guard";
  } else if (op.agent_type === "validator") {
    type = hash % 2 === 0 ? "Seismic Processing" : "Medical Enclave";
  } else {
    type = "Transport Node";
  }

  // Determine Secure Stage
  let stage: "Sandbox Emulation" | "Staging Enclave" | "Production Guardrail" = "Sandbox Emulation";
  if (hash % 3 === 0) {
    stage = "Sandbox Emulation";
  } else if (hash % 3 === 1) {
    stage = "Staging Enclave";
  } else {
    stage = "Production Guardrail";
  }

  const projectNameMap: Record<string, string> = {
    "proj-001": "Sovereign Core Sandbox 02",
    "proj-002": "Model Guardrail Sandbox 04",
    "proj-003": "Sovereign Mining Intel Loop",
    "proj-004": "Federal Treasury Enclave 01",
  };
  const projectName = projectNameMap[op.project_id] || `Project Enclave (${op.project_id})`;

  // Calculate dynamic but deterministic metrics
  let cpu = 25 + (hash % 30);
  let ram = 45 + (hash % 25);
  let latency = 8 + (hash % 12);
  let uptime = 99.998 - (hash % 40) / 10000;
  let threads = 16 + (hash % 16);
  let memory = `${(ram * 8 / 100).toFixed(1)} GB / 8.0 GB`;

  let logs: string[] = [];

  if (status === "active") {
    logs = [
      "Core verification complete (SHA-256: " + (hash % 9000 + 1000).toString(16).toUpperCase() + ")",
      "Local memory state synchronized successfully",
      "eBPF telemetry boundary active: " + op.desc
    ];
  } else if (status === "evaluating") {
    cpu = 15 + (hash % 10);
    ram = 60 + (hash % 15);
    latency = 18 + (hash % 15);
    uptime = 99.982 - (hash % 20) / 10000;
    threads = 8 + (hash % 8);
    memory = `${(ram * 4 / 100).toFixed(1)} GB / 4.0 GB`;
    logs = [
      "Policy verification pass 99.8%",
      "No direct model manipulation requests detected.",
      "Syncing guardrail ledger block: " + op.desc
    ];
  } else if (status === "warning") {
    cpu = 85 + (hash % 10);
    ram = 75 + (hash % 15);
    latency = 65 + (hash % 30);
    uptime = 99.914 - (hash % 50) / 10000;
    threads = 16 + (hash % 8);
    memory = `${(ram * 8 / 100).toFixed(1)} GB / 8.0 GB`;
    logs = [
      "Warning: Thread load above safety line (85%)",
      "Triggered telemetry frame check...",
      "Anomaly: " + op.desc
    ];
  } else {
    cpu = 0;
    ram = 0;
    latency = 999;
    uptime = 98.712 - (hash % 10) / 10000;
    threads = 0;
    memory = "0.0 GB / 8.0 GB";
    logs = [
      "Thread execution terminated gracefully by operator.",
      "State dumped to local cryptographic storage block.",
      "Enclave decoupled: " + op.desc
    ];
  }

  return {
    id: op.id,
    name: op.name,
    projectId: op.project_id,
    projectName,
    status,
    type,
    stage,
    threads,
    memory,
    logs,
    lastHeartbeat: op.lastUpdated,
    cpu,
    ram,
    latency,
    uptime,
  };
}
