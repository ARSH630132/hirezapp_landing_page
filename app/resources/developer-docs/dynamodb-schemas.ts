export interface DbAttribute {
  name: string;
  type: string;
  desc: string;
}

export interface DbTableSchema {
  tableName: string;
  primaryKey: string;
  purpose: string;
  description: string;
  attributes?: DbAttribute[];
  sampleJson: string;
  entities?: {
    [key: string]: {
      name: string;
      pk: string;
      sk: string;
      gsi1pk: string;
      gsi1sk: string;
      description: string;
      attributes: DbAttribute[];
      sampleJson: string;
    }
  };
}

export const DYNAMODB_SCHEMAS: Record<string, DbTableSchema> = {
  gff_users: {
    tableName: "GFF_USERS",
    primaryKey: "email (String)",
    purpose: "Global identity provider and RBAC registry",
    description: "Maintains records of all authenticated identities across GFF enclaves, binding them to specific enterprise clients and administrative roles.",
    attributes: [
      { name: "email", type: "String (PK)", desc: "Unique login identifier / username" },
      { name: "role", type: "String", desc: "RBAC authority: 'gff_admin', 'client_admin', or 'client_member'" },
      { name: "client_id", type: "String", desc: "Association key to the owner record in GFF_CLIENTS" },
      { name: "created_at", type: "String (ISO 8601)", desc: "Timestamp when the identity was provisioned" }
    ],
    sampleJson: `{
  "email": "admin@apex.com",
  "role": "client_admin",
  "client_id": "client_gff_01",
  "created_at": "2026-03-15T08:30:00.000Z"
}`
  },
  gff_clients: {
    tableName: "GFF_CLIENTS",
    primaryKey: "client_id (String)",
    purpose: "Enterprise customer tenant registry",
    description: "Configures and partitions resources on a per-organization level, specifying licensing tiers, dedicated boundaries, and regional enclaves.",
    attributes: [
      { name: "client_id", type: "String (PK)", desc: "Unique global tenant identifier" },
      { name: "company_name", type: "String", desc: "Legal entity name of the customer company" },
      { name: "tier", type: "String", desc: "Service level tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'" },
      { name: "created_at", type: "String (ISO 8601)", desc: "Timestamp when the tenant profile was established" }
    ],
    sampleJson: `{
  "client_id": "client_gff_01",
  "company_name": "Apex Global Solutions",
  "tier": "ENTERPRISE",
  "created_at": "2026-01-10T12:00:00.000Z"
}`
  },
  gff_portal_items: {
    tableName: "GFF_PORTAL_ITEMS",
    primaryKey: "PK (String) & SK (String)",
    purpose: "Multi-tenant single-table transactional record store",
    description: "Uses partition/sort key prefix overloading and a Global Secondary Index (GSI1) to store and query six distinct workspace operational models with high-efficiency single-trip lookups.",
    sampleJson: "",
    entities: {
      projects: {
        name: "Projects",
        pk: "CLIENT#<client_id>",
        sk: "PROJ#<project_id>",
        gsi1pk: "PROJ#<project_id>",
        gsi1sk: "METADATA",
        description: "Represents isolated multi-agent engineering workflows.",
        attributes: [
          { name: "name", type: "String", desc: "The project instance moniker" },
          { name: "status", type: "String", desc: "Operational status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'" },
          { name: "progress", type: "Number", desc: "Completion percentage from 0 to 100" },
          { name: "budget", type: "Number", desc: "Allocated budget in USD" },
          { name: "created_at", type: "String", desc: "Timestamp when project sandbox was booted" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "PROJ#proj_99ab7",
  "GSI1PK": "PROJ#proj_99ab7",
  "GSI1SK": "METADATA",
  "name": "Sovereign Logistics Agent-Chain",
  "status": "ACTIVE",
  "progress": 82,
  "budget": 250000,
  "created_at": "2026-04-01T14:20:00Z"
}`
      },
      ai_ops: {
        name: "AI Operations",
        pk: "CLIENT#<client_id>",
        sk: "AIOPS#<ops_id>",
        gsi1pk: "PROJ#<project_id>",
        gsi1sk: "AIOPS#<ops_id>",
        description: "Real-time containerized agent runtime enclaves.",
        attributes: [
          { name: "name", type: "String", desc: "Monitored pipeline signature name" },
          { name: "status", type: "String", desc: "Runtime condition: 'RUNNING' | 'COMPLETED' | 'FAILED'" },
          { name: "agent_count", type: "Number", desc: "Active software cognitive entities in loop" },
          { name: "runtime_seconds", type: "Number", desc: "Total continuous execution duration" },
          { name: "cpu_usage", type: "Number", desc: "Current sandbox CPU usage percentage" },
          { name: "memory_usage", type: "Number", desc: "Current memory footprint in MB" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "AIOPS#ops_77fe1",
  "GSI1PK": "PROJ#proj_99ab7",
  "GSI1SK": "AIOPS#ops_77fe1",
  "name": "Inventory Reconciliation Loop",
  "status": "RUNNING",
  "agent_count": 8,
  "runtime_seconds": 45320,
  "cpu_usage": 14.5,
  "memory_usage": 1024
}`
      },
      documents: {
        name: "Documents Metadata",
        pk: "CLIENT#<client_id>",
        sk: "DOC#<doc_id>",
        gsi1pk: "PROJ#<project_id>",
        gsi1sk: "DOC#<doc_id>",
        description: "Sovereign file records backed by secure AWS S3 enclaves.",
        attributes: [
          { name: "title", type: "String", desc: "The document logical filename" },
          { name: "s3_key", type: "String", desc: "Unique path key within the secure production S3 bucket" },
          { name: "file_size", type: "Number", desc: "The storage footprint in bytes" },
          { name: "category", type: "String", desc: "Classification: 'COMPLIANCE' | 'REPORT' | 'NDA' | 'ARCH'" },
          { name: "uploaded_by", type: "String", desc: "Email of the identity who initiated upload" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "DOC#doc_11de8",
  "GSI1PK": "PROJ#proj_99ab7",
  "GSI1SK": "DOC#doc_11de8",
  "title": "audited_compliance_report_q1.pdf",
  "s3_key": "clients/client_gff_01/docs/audited_compliance_report_q1.pdf",
  "file_size": 1548291,
  "category": "COMPLIANCE",
  "uploaded_by": "admin@apex.com"
}`
      },
      invoices: {
        name: "Invoices Metadata",
        pk: "CLIENT#<client_id>",
        sk: "INV#<invoice_id>",
        gsi1pk: "BILLING_PERIOD#<year_month>",
        gsi1sk: "INV#<invoice_id>",
        description: "Dynamic billing details mapping agent computing usages.",
        attributes: [
          { name: "amount_usd", type: "Number", desc: "Total dynamic bill amount" },
          { name: "status", type: "String", desc: "Payment status: 'PAID' | 'UNPAID' | 'PROCESSING'" },
          { name: "due_date", type: "String", desc: "Payment deadline timestamp" },
          { name: "epochs_consumed", type: "Number", desc: "LLM computational units / token enclaves processed" },
          { name: "created_at", type: "String", desc: "Invoice generation date" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "INV#inv_44bb2",
  "GSI1PK": "BILLING_PERIOD#2026_06",
  "GSI1SK": "INV#inv_44bb2",
  "amount_usd": 12450.00,
  "status": "PAID",
  "due_date": "2026-07-15T00:00:00Z",
  "epochs_consumed": 24501,
  "created_at": "2026-06-30T23:59:59Z"
}`
      },
      support_tickets: {
        name: "Support Tickets",
        pk: "CLIENT#<client_id>",
        sk: "TICKET#<ticket_id>",
        gsi1pk: "STATUS#<status_code>",
        gsi1sk: "TICKET#<ticket_id>",
        description: "Sovereign support requests routed directly to GFF enclaves.",
        attributes: [
          { name: "subject", type: "String", desc: "Brief summary of technical issue" },
          { name: "priority", type: "String", desc: "Criticality ranking: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'" },
          { name: "status_text", type: "String", desc: "Ticket progress: 'OPEN' | 'ASSIGNED' | 'RESOLVED'" },
          { name: "assigned_to", type: "String", desc: "GFF staff handling support request" },
          { name: "created_at", type: "String", desc: "Timestamp when request was filed" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "TICKET#tkt_88cc1",
  "GSI1PK": "STATUS#OPEN",
  "GSI1SK": "TICKET#tkt_88cc1",
  "subject": "Isolation boundary failure in local sandbox node 3",
  "priority": "HIGH",
  "status_text": "OPEN",
  "assigned_to": "engineer_global@gff.ai",
  "created_at": "2026-06-25T09:12:00Z"
}`
      },
      governance: {
        name: "Governance Items",
        pk: "CLIENT#<client_id>",
        sk: "GOV#<gov_id>",
        gsi1pk: "STANDARD#<compliance_standard>",
        gsi1sk: "GOV#<gov_id>",
        description: "Compliance audits, control matrices, and certification gates.",
        attributes: [
          { name: "control_name", type: "String", desc: "The official protocol identifier (e.g., SOC2-CC-1.1)" },
          { name: "status", type: "String", desc: "Audit state: 'PASSED' | 'WARNING' | 'FAILED' | 'REMEDIATION'" },
          { name: "remediation_notes", type: "String", desc: "Detailed engineering guidelines to solve gaps" },
          { name: "assessed_at", type: "String", desc: "Timestamp when control check was evaluated" }
        ],
        sampleJson: `{
  "PK": "CLIENT#client_gff_01",
  "SK": "GOV#gov_02de1",
  "GSI1PK": "STANDARD#SOC2_CC_1",
  "GSI1SK": "GOV#gov_02de1",
  "control_name": "SOC2 CC 1.1 - Access Revocation Integrity",
  "status": "PASSED",
  "remediation_notes": "All identity accounts successfully validated against real-time AD enclaves.",
  "assessed_at": "2026-06-27T18:00:00Z"
}`
      }
    }
  }
};
