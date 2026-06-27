"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Download, 
  UploadCloud, 
  FileText, 
  Check, 
  Copy, 
  ChevronRight, 
  Terminal, 
  Shield, 
  Lock, 
  User, 
  Clock, 
  Eye, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  Info
} from "lucide-react";
import { PrivatePageHeader, WorkspaceCard } from "@/components/private-app";

// ============================================================================
// 1. DATA MODELS & MOCKS
// ============================================================================

interface PortalDocument {
  id: string;
  name: string;
  category: "Proposals" | "SOW" | "Architecture" | "Reports" | "Invoices" | "Governance" | "Meeting Notes" | "Delivery Assets";
  format: "PDF" | "JSON" | "YAML" | "CSV" | "DOCX" | "ZIP" | "PPTX";
  size: string;
  hash: string;
  uploadedAt: string;
  project: string;
  status: "Approved" | "Signed" | "In Review" | "Pending Review" | "Active" | "Archived";
  version: string;
  owner: string;
  visibility: string;
  desc: string;
}

const PREVIEW_DOCUMENTS: PortalDocument[] = [
  {
    id: "DOC-PRP-001",
    name: "GFF_AI_Enterprise_Core_Proposal_2026.pdf",
    category: "Proposals",
    format: "PDF",
    size: "6.4 MB",
    hash: "0x5EAC7102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F2FFF",
    uploadedAt: "2026-04-12T09:15:00Z",
    project: "Sovereign Core Sandbox 02",
    status: "Approved",
    version: "v3.2",
    owner: "Alexander Mercer",
    visibility: "LEVEL_I (Client View)",
    desc: "Technical and operational proposal for sovereign thread clustering and regional node deployment."
  },
  {
    id: "DOC-SOW-002",
    name: "Sovereign_Sandbox_Deployment_SOW_Executed.pdf",
    category: "SOW",
    format: "PDF",
    size: "2.1 MB",
    hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA",
    uploadedAt: "2026-05-18T14:30:00Z",
    project: "Sovereign Core Sandbox 02",
    status: "Signed",
    version: "v1.0-final",
    owner: "Dr. Sarah Vance",
    visibility: "LEVEL_II (Sovereign Only)",
    desc: "Executed Statement of Work outlining the deployment roadmap, milestone metrics, and SLA parameters for hardware enclaves."
  },
  {
    id: "DOC-ARC-003",
    name: "AMD_SEV_SNP_Enclave_Topology_v1.4.yaml",
    category: "Architecture",
    format: "YAML",
    size: "18 KB",
    hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492",
    uploadedAt: "2026-06-02T16:45:00Z",
    project: "Model Guardrail Sandbox 04",
    status: "Active",
    version: "v1.4",
    owner: "Evelyn Carter",
    visibility: "LEVEL_IV (Restricted)",
    desc: "Topology specification for the sandboxed guardrail nodes, detailing key rotation endpoints and AMD SEV-SNP attestation rules."
  },
  {
    id: "DOC-REP-004",
    name: "Q2_Sovereign_Attestation_Audit_Report.pdf",
    category: "Reports",
    format: "PDF",
    size: "14.2 MB",
    hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B",
    uploadedAt: "2026-06-15T11:20:00Z",
    project: "Federal Ledger Enclave Alpha",
    status: "Approved",
    version: "v2.0",
    owner: "Auditor Jenkins",
    visibility: "LEVEL_V (Strictly Confidential)",
    desc: "Comprehensive security evaluation of zero-knowledge node communications and encrypted telemetry streams."
  },
  {
    id: "DOC-INV-005",
    name: "Invoice_GFF_2026_Q2_Epoch_Compute.pdf",
    category: "Invoices",
    format: "PDF",
    size: "1.1 MB",
    hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA",
    uploadedAt: "2026-06-01T08:00:00Z",
    project: "Sovereign Core Sandbox 02",
    status: "Signed",
    version: "v1.1",
    owner: "Finance Operations",
    visibility: "LEVEL_III (Internal Use)",
    desc: "Q2 computation allocation billing, auditing active node-hours, thread capacity, and secure bandwidth streams."
  },
  {
    id: "DOC-GOV-006",
    name: "Model_Guardrail_Alignment_Directives.json",
    category: "Governance",
    format: "JSON",
    size: "45 KB",
    hash: "0x56EFA90CC7FFADE138EE87A02FF90A11BDE897FF021BC8102C019FFAD998E125",
    uploadedAt: "2026-06-20T17:10:00Z",
    project: "Model Guardrail Sandbox 04",
    status: "Active",
    version: "v1.2-RC1",
    owner: "Dr. Sarah Vance",
    visibility: "LEVEL_IV (Restricted)",
    desc: "Cryptographically locked prompt and completion alignment filters applied directly to sovereign agent pipelines."
  },
  {
    id: "DOC-MTG-007",
    name: "Architecture_Interlock_Review_Notes_2026_06_18.docx",
    category: "Meeting Notes",
    format: "DOCX",
    size: "312 KB",
    hash: "0x09F23D4FFA289F02ECBC12A349CDE150FA11B8A02FEE907C10BDE8267FEE10BC",
    uploadedAt: "2026-06-18T15:30:00Z",
    project: "Global Platform (No Project)",
    status: "In Review",
    version: "v1.0",
    owner: "Elena Rostova",
    visibility: "LEVEL_III (Internal Use)",
    desc: "Engineering alignment session minutes detailing HSM hardware key rotation synchronization hurdles with Sovereign Sandbox Core 02."
  },
  {
    id: "DOC-AST-008",
    name: "Isolated_HSM_Core_Config_Secure_Build.zip",
    category: "Delivery Assets",
    format: "ZIP",
    size: "48.2 MB",
    hash: "0xFA02CE8274A08B0192A45C89FBC104923FBC128EE809FF9CC9810A88AA11B8FF",
    uploadedAt: "2026-06-25T12:00:00Z",
    project: "Sovereign Core Sandbox 02",
    status: "Approved",
    version: "v4.0-release",
    owner: "Evelyn Carter",
    visibility: "LEVEL_V (Strictly Confidential)",
    desc: "Cryptographically signed system bundle, including isolated host memory parameters, kernel configurations, and attestation scripts."
  },
  {
    id: "DOC-SOW-009",
    name: "Federal_Ledger_Scope_SOW_Draft.docx",
    category: "SOW",
    format: "DOCX",
    size: "780 KB",
    hash: "0x7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF123456",
    uploadedAt: "2026-06-26T10:45:00Z",
    project: "Federal Ledger Enclave Alpha",
    status: "Pending Review",
    version: "v0.8-draft",
    owner: "Alexander Mercer",
    visibility: "LEVEL_IV (Restricted)",
    desc: "Initial scope definitions and governance protocols for regional ledger integrations with AMD SEV validation nodes."
  },
  {
    id: "DOC-PRP-010",
    name: "GFF_Enterprise_Legacy_Proposal_2025.pdf",
    category: "Proposals",
    format: "PDF",
    size: "5.2 MB",
    hash: "0xAB88AA11B8FFFA02CE8274A08B0192A45C89FBC104923FBC128EE809FF9CC981",
    uploadedAt: "2025-11-15T14:20:00Z",
    project: "Global Platform (No Project)",
    status: "Archived",
    version: "v1.0",
    owner: "Elena Rostova",
    visibility: "LEVEL_I (Client View)",
    desc: "Archived initial technical brief for older AMD SEV architecture compatibility study."
  }
];

// Available filter choices
const CATEGORIES = ["Proposals", "SOW", "Architecture", "Reports", "Invoices", "Governance", "Meeting Notes", "Delivery Assets"];
const PROJECTS = ["Sovereign Core Sandbox 02", "Model Guardrail Sandbox 04", "Federal Ledger Enclave Alpha", "Global Platform (No Project)"];
const FORMATS = ["PDF", "JSON", "YAML", "CSV", "DOCX", "ZIP", "PPTX"];
const STATUSES = ["Approved", "Signed", "In Review", "Pending Review", "Active", "Archived"];

export default function ClientDocumentsPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Layout States
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  // Drawer & Attestation Log States
  const [selectedDoc, setSelectedDoc] = useState<PortalDocument | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isLogsSyncing, setIsLogsSyncing] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Custom Toast Notification States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"info" | "warning" | "success" | null>(null);

  // Trigger Toast Helper
  const showToast = (message: string, type: "info" | "warning" | "success" = "info") => {
    setToastMessage(message);
    setToastType(type);
  };

  // Close Toast automatically after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        setToastType(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Terminal Handshake Log Simulator inside Drawer
  useEffect(() => {
    if (!selectedDoc) {
      setTerminalLogs([]);
      return;
    }

    setIsLogsSyncing(true);
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] LOCK_INIT: Connection opened to air-gapped sovereign HSM node.`,
      `[${new Date().toLocaleTimeString()}] AUTH_CHECK: Level III Clearance validation in progress...`
    ]);

    const logsArray = [
      `[${new Date().toLocaleTimeString()}] SIGN_CHECK: Verified signature: AMD SEV-SNP cryptographic seal validated (100% compliant).`,
      `[${new Date().toLocaleTimeString()}] INTEGRITY: SHA-256 integrity hash verification matches master repository: ${selectedDoc.hash.substring(0, 16)}...`,
      `[${new Date().toLocaleTimeString()}] CLEARANCE: Mapped access level is authorized for user account clearance level.`,
      `[${new Date().toLocaleTimeString()}] SECURE_PREVIEW: Safe, decapsulated read stream established for [${selectedDoc.id}].`
    ];

    let timerIndex = 0;
    const interval = setInterval(() => {
      if (timerIndex < logsArray.length) {
        setTerminalLogs((prev) => [...prev, logsArray[timerIndex]]);
        timerIndex++;
      } else {
        setIsLogsSyncing(false);
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [selectedDoc]);

  // Copy Clipboard Helper
  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    showToast("Cryptographic SHA-256 copied to clipboard.", "success");
    setTimeout(() => setCopiedHash(false), 1500);
  };

  // Reset Filters Helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedProject("");
    setSelectedFormat("");
    setSelectedStatus("");
    showToast("All filters reset successfully.", "info");
  };

  // Simulated Actions
  const handleSimulatedDownload = (doc: PortalDocument) => {
    showToast(`DEMO SHIELD: File transfer blocked. '${doc.name}' cannot be downloaded in telemetry preview.`, "warning");
  };

  const handleSimulatedUploadClick = () => {
    showToast("SECURE GATEWAY: Upload restricted. Local sandbox is currently in read-only audit mode.", "warning");
  };

  // Filtering Logic
  const filteredDocuments = PREVIEW_DOCUMENTS.filter((doc) => {
    // 1. Text Search query (checks title, hash, id, owner)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchText = 
        doc.name.toLowerCase().includes(query) ||
        doc.id.toLowerCase().includes(query) ||
        doc.hash.toLowerCase().includes(query) ||
        doc.owner.toLowerCase().includes(query) ||
        doc.desc.toLowerCase().includes(query);
      if (!matchText) return false;
    }
    // 2. Category
    if (selectedCategory !== "" && doc.category !== selectedCategory) return false;
    // 3. Related Project
    if (selectedProject !== "" && doc.project !== selectedProject) return false;
    // 4. File Format (Type)
    if (selectedFormat !== "" && doc.format !== selectedFormat) return false;
    // 5. Status
    if (selectedStatus !== "" && doc.status !== selectedStatus) return false;

    return true;
  });

  // Calculate quick document statistics
  const totalSeals = PREVIEW_DOCUMENTS.length;
  const activeSows = PREVIEW_DOCUMENTS.filter(d => d.category === "SOW").length;
  const auditReports = PREVIEW_DOCUMENTS.filter(d => d.category === "Reports" || d.category === "Architecture").length;
  const pendingReviews = PREVIEW_DOCUMENTS.filter(d => d.status === "Pending Review" || d.status === "In Review").length;

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved" || s === "signed" || s === "active") return "text-[#00FFC2] border-[#00FFC2]/20 bg-[#00FFC2]/5";
    if (s === "in review" || s === "pending review") return "text-amber-400 border-amber-400/20 bg-amber-400/5";
    return "text-white/40 border-white/10 bg-white/5";
  };

  const getFormatBadgeColor = (fmt: string) => {
    const f = fmt.toLowerCase();
    if (f === "pdf") return "text-red-400 border-red-500/20 bg-red-500/5";
    if (f === "yaml" || f === "json") return "text-[#009DFF] border-[#009DFF]/20 bg-[#009DFF]/5";
    if (f === "zip") return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
    return "text-white/60 border-white/10 bg-white/5";
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "" || selectedProject !== "" || selectedFormat !== "" || selectedStatus !== "";

  return (
    <div className="space-y-6 max-w-[1750px] mx-auto pb-12 select-none relative">
      
      {/* 1. TOAST NOTIFICATION WINDOW */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-mono text-[12px] max-w-sm ${
            toastType === "warning" ? "border-amber-500/30 bg-amber-950/70 text-amber-300" :
            toastType === "success" ? "border-[#00FFC2]/30 bg-black/80 text-[#00FFC2]" :
            "border-white/10 bg-black/80 text-white/80"
          }`}>
            <Shield className={`w-4 h-4 shrink-0 ${
              toastType === "warning" ? "text-amber-400" :
              toastType === "success" ? "text-[#00FFC2]" :
              "text-[#009DFF]"
            }`} />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                {toastType === "warning" ? "SECURITY ALIGNMENT LOCK" : toastType === "success" ? "INTEGRITY ATTESTED" : "SYSTEM MESSAGE"}
              </span>
              <p className="mt-0.5 font-sans leading-snug">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-0.5 text-white/40 hover:text-white rounded shrink-0 transition-colors ml-auto">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. DEMO RESTRICTED BANNER */}
      <div className="border border-white/5 bg-[#050505]/30 rounded-xl px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[11px] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 text-white/50">
          <Info className="w-4 h-4 text-[#009DFF] shrink-0" />
          <span>
            <strong className="text-white/80">AIRGAPPED DOCUMENT REPOSITORY:</strong> In alignment with SOC2 and ISO27001 policies, download and upload actions are cryptographically suspended inside client preview portals.
          </span>
        </div>
        <span className="text-[9.5px] text-[#009DFF] font-bold bg-[#009DFF]/10 border border-[#009DFF]/20 px-2.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          SECURE SIMULATION ACTIVE
        </span>
      </div>

      {/* 3. BREADCRUMBED HEADER */}
      <PrivatePageHeader
        title="Document Repository & Seals"
        desc="Access cryptographically sealed Master Service Agreements, Statements of Work, and Sovereign System Architecture Reports."
        badgeLabel="SECURE_VAULT_v2.6"
        actions={
          <button 
            onClick={handleSimulatedUploadClick}
            className="h-9 px-4 rounded border border-white/10 hover:border-[#009DFF]/30 hover:bg-[#009DFF]/5 text-[11px] font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/[0.01]"
          >
            <UploadCloud className="w-4 h-4 text-[#009DFF]" />
            <span>Upload Document</span>
          </button>
        }
      />

      {/* 4. EXECUTIVE SUMMARY METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm space-y-1">
          <span className="text-[9.5px] font-mono tracking-widest text-white/30 uppercase block">CRYPTOGRAPHIC SEALS</span>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">{totalSeals} <span className="text-white/20 text-sm font-sans font-normal">Active</span></div>
          <span className="text-[10px] text-[#00FFC2] font-mono flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 100% Attested</span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm space-y-1">
          <span className="text-[9.5px] font-mono tracking-widest text-white/30 uppercase block">SOVEREIGN SOW CONTRACTS</span>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">{activeSows} <span className="text-white/20 text-sm font-sans font-normal">Stored</span></div>
          <span className="text-[10px] text-white/45 font-mono">Executed and archived</span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm space-y-1">
          <span className="text-[9.5px] font-mono tracking-widest text-white/30 uppercase block">ATTESTED SYSTEM REPORTS</span>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">{auditReports} <span className="text-white/20 text-sm font-sans font-normal">Audits</span></div>
          <span className="text-[10px] text-[#009DFF] font-mono">AMD SEV Topology Logs</span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm space-y-1">
          <span className="text-[9.5px] font-mono tracking-widest text-white/30 uppercase block">REVIEWS IN PROGRESS</span>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">{pendingReviews} <span className="text-white/20 text-sm font-sans font-normal">Pending</span></div>
          <span className="text-[10px] text-amber-400 font-mono">Awaiting client signature</span>
        </div>
      </div>

      {/* 5. MULTI-DIMENSIONAL SEARCH & FILTER BOARD */}
      <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
          
          {/* Main Search Input */}
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search by title, security hash, owner, or details..."
              className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-10 pr-10 text-[12px] font-mono text-white placeholder-white/25 outline-none focus:border-white/15 focus:bg-white/[0.03] transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-2.5 text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right Alignment: Layout Switch & Clear */}
          <div className="flex flex-wrap items-center gap-3 self-end xl:self-auto">
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="h-9 px-3 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-[11px] font-mono font-bold text-red-400 uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Layout Toggler (Segmented Control style) */}
            <div className="flex items-center rounded-lg border border-white/5 p-1 bg-black/40">
              <button 
                onClick={() => setLayoutMode("grid")}
                className={`h-7 px-3.5 rounded-md text-[10.5px] font-mono font-bold flex items-center gap-1.5 transition-all uppercase ${
                  layoutMode === "grid" ? "bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/25" : "text-white/40 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bento Grid</span>
              </button>
              <button 
                onClick={() => setLayoutMode("list")}
                className={`h-7 px-3.5 rounded-md text-[10.5px] font-mono font-bold flex items-center gap-1.5 transition-all uppercase ${
                  layoutMode === "list" ? "bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/25" : "text-white/40 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sovereign Ledger</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-4">
          
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase font-semibold block tracking-wider">Document Category</span>
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="w-full h-9 rounded-lg border border-white/5 bg-[#0a0a0a] px-3 pr-8 text-[11.5px] font-mono text-white/70 focus:text-white focus:border-white/15 outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">ALL CATEGORIES</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Project Dropdown */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase font-semibold block tracking-wider">Related Project</span>
            <div className="relative">
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)} 
                className="w-full h-9 rounded-lg border border-white/5 bg-[#0a0a0a] px-3 pr-8 text-[11.5px] font-mono text-white/70 focus:text-white focus:border-white/15 outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">ALL PROJECTS</option>
                {PROJECTS.map(proj => <option key={proj} value={proj}>{proj}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Format Dropdown */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase font-semibold block tracking-wider">Document Type / Format</span>
            <div className="relative">
              <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value)} 
                className="w-full h-9 rounded-lg border border-white/5 bg-[#0a0a0a] px-3 pr-8 text-[11.5px] font-mono text-white/70 focus:text-white focus:border-white/15 outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">ALL FORMATS</option>
                {FORMATS.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-white/30 uppercase font-semibold block tracking-wider">Approval Status</span>
            <div className="relative">
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)} 
                className="w-full h-9 rounded-lg border border-white/5 bg-[#0a0a0a] px-3 pr-8 text-[11.5px] font-mono text-white/70 focus:text-white focus:border-white/15 outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">ALL STATUSES</option>
                {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* 6. CONTENT VIEWS (CARD OR TABLE) */}
      {filteredDocuments.length === 0 ? (
        
        /* Empty Search Results state */
        <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm max-w-xl mx-auto space-y-4">
          <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 inline-flex text-white/30">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">No Cryptographic Seals Found</h3>
            <p className="text-[12.5px] text-white/40 max-w-sm mx-auto font-sans leading-relaxed">
              Your multidimensional filter query did not match any active ledger documents or system architecture plans.
            </p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="h-9 px-4 rounded-lg bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,157,255,0.15)] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
            <span>Restore Master View</span>
          </button>
        </div>

      ) : layoutMode === "grid" ? (
        
        /* A: BENTO GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <WorkspaceCard key={doc.id} className="flex flex-col h-[280px] justify-between border-white/[0.03] relative group hover:border-[#009DFF]/20 transition-all duration-300">
              
              {/* Document Header details inside card */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-[#009DFF]/5 border border-[#009DFF]/20 text-[#009DFF] rounded px-1.5 py-0.5 uppercase">
                      {doc.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold border rounded px-1.5 py-0.5 uppercase ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold border rounded px-1.5 py-0.5 ${getFormatBadgeColor(doc.format)}`}>
                    {doc.format}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-bold text-white tracking-tight group-hover:text-[#009DFF] transition-colors leading-snug line-clamp-2">
                    {doc.name}
                  </h4>
                  <p className="text-[11.5px] text-white/40 font-sans line-clamp-2 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>
              </div>

              {/* Document footer & metadata specs inside card */}
              <div className="border-t border-white/5 pt-3 mt-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/35">
                  <div>
                    <span className="text-white/20 font-bold block text-[8px] uppercase">OWNER / COMPLIANT</span>
                    <span className="text-white/60 truncate block mt-0.5">{doc.owner}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/20 font-bold block text-[8px] uppercase">VERSION / SIZE</span>
                    <span className="text-white/60 block mt-0.5">{doc.version} ({doc.size})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className="h-8 rounded border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-[10.5px] font-mono font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-white/50" />
                    <span>METADATA</span>
                  </button>
                  <button 
                    onClick={() => handleSimulatedDownload(doc)}
                    className="h-8 rounded bg-[#009DFF]/5 hover:bg-[#009DFF]/15 border border-[#009DFF]/20 hover:border-[#009DFF]/45 text-[10.5px] font-mono font-bold text-[#009DFF] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD</span>
                  </button>
                </div>
              </div>

            </WorkspaceCard>
          ))}
        </div>

      ) : (

        /* B: SOVEREIGN LEDGER TABLE VIEW */
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#050505]/10 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40 font-mono text-[9px] text-white/30 tracking-widest uppercase">
                <th className="py-3.5 px-4 font-semibold">ID</th>
                <th className="py-3.5 px-4 font-semibold">DOCUMENT NAME</th>
                <th className="py-3.5 px-4 font-semibold">CATEGORY</th>
                <th className="py-3.5 px-4 font-semibold">TYPE</th>
                <th className="py-3.5 px-4 font-semibold">RELATED PROJECT</th>
                <th className="py-3.5 px-4 font-semibold">VERSION</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] font-mono text-[11.5px] text-white/80">
              {filteredDocuments.map((doc) => (
                <tr 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 text-white/40 text-[10.5px] font-bold tracking-wider">{doc.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white group-hover:text-[#009DFF] transition-colors max-w-xs truncate">
                    {doc.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[9px] bg-white/5 border border-white/10 text-white/70 rounded px-1.5 py-0.5">
                      {doc.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] border rounded px-1.5 py-0.5 ${getFormatBadgeColor(doc.format)}`}>
                      {doc.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white/40 text-[10.5px] max-w-[150px] truncate">{doc.project}</td>
                  <td className="py-3.5 px-4 text-white/50">{doc.version}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 uppercase ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-white/60 hover:text-white transition-all cursor-pointer"
                        title="View Metadata Drawer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleSimulatedDownload(doc)}
                        className="p-1 rounded bg-[#009DFF]/5 border border-[#009DFF]/20 hover:bg-[#009DFF]/10 text-[#009DFF] hover:border-[#009DFF]/40 transition-all cursor-pointer"
                        title="Simulate Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Table pagination stats footer */}
          <div className="p-3 border-t border-white/5 bg-black/[0.15] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] text-white/40">
            <span>SHOWING <strong className="text-white/60">{filteredDocuments.length}</strong> OF <strong className="text-white/60">{PREVIEW_DOCUMENTS.length}</strong> DETERMINISTIC SECURITY SEALS</span>
            <span className="text-[#00FFC2] flex items-center gap-1 bg-[#00FFC2]/5 border border-[#00FFC2]/15 px-2 py-0.5 rounded uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> HSM MEMORY BUS COMPLIANT
            </span>
          </div>
        </div>
      )}

      {/* 7. HIGH-FIDELITY SIMULATED DRAG-AND-DROP SECURE UPLOAD */}
      <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-[#050505]/10 hover:bg-[#050505]/20 hover:border-white/20 transition-all duration-300 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 select-none mt-4">
        <div className="p-4 rounded-xl bg-[#009DFF]/5 border border-[#009DFF]/10 text-[#009DFF] shrink-0">
          <UploadCloud className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-grow space-y-1 text-center md:text-left">
          <h4 className="text-[13px] font-bold font-mono text-white uppercase tracking-wider">Simulated Encrypted Client Dropzone</h4>
          <p className="text-[12px] text-white/45 font-sans leading-relaxed">
            Drag files here to simulate sovereign ingestion. Files will be parsed locally, locked inside virtual enclaves, and sealed with deterministic SHA-256 signatures. No data leaves your machine.
          </p>
        </div>
        <button 
          onClick={handleSimulatedUploadClick}
          className="h-9 px-4 rounded bg-white text-black hover:bg-white/90 text-[11px] font-mono font-bold uppercase transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          Select File
        </button>
      </div>

      {/* 8. DOCUMENT DETAILED METADATA DRAWER (SLIDING FROM RIGHT) */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
          {/* Backdrop blur overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSelectedDoc(null)} 
          />
          
          {/* Drawer content box */}
          <div className="relative w-full sm:max-w-md h-full bg-[#070707]/95 border-l border-white/10 backdrop-blur-xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 outline-none">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/5 flex items-start justify-between gap-4 bg-black/20">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded tracking-widest uppercase">
                  LEDGER METADATA SPEC
                </span>
                <h3 className="text-[13.5px] font-bold font-mono text-white tracking-wider uppercase mt-1 leading-snug">
                  {selectedDoc.id}
                </h3>
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-white/45">
                  <span>SHA-256 ATTESTATION</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] text-white/50 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer scrollable list */}
            <div className="flex-grow overflow-y-auto p-5 space-y-6">
              
              {/* Core Information list */}
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest border-b border-white/5 pb-1 font-semibold">
                  Required Document Attributes
                </div>
                
                <div className="space-y-2.5">
                  
                  {/* Title metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Document Title</span>
                    <span className="text-white font-semibold leading-relaxed truncate-2-lines break-all font-sans">
                      {selectedDoc.name}
                    </span>
                  </div>

                  {/* Type / Format metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Document Type / format</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9.5px] border rounded px-2 py-0.5 mt-0.5 ${getFormatBadgeColor(selectedDoc.format)}`}>
                        {selectedDoc.format} STANDARD SPEC
                      </span>
                    </div>
                  </div>

                  {/* Status metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Verification Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9.5px] font-bold border rounded px-2 py-0.5 mt-0.5 uppercase ${getStatusColor(selectedDoc.status)}`}>
                        {selectedDoc.status}
                      </span>
                    </div>
                  </div>

                  {/* Related Project metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Related Project Sandbox</span>
                    <span className="text-white font-semibold mt-0.5">{selectedDoc.project}</span>
                  </div>

                  {/* Version metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Release Version</span>
                    <span className="text-white font-semibold mt-0.5">{selectedDoc.version}</span>
                  </div>

                  {/* Owner metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Document Creator / Owner</span>
                    <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5 font-sans">
                      <User className="w-3.5 h-3.5 text-[#009DFF]" />
                      {selectedDoc.owner}
                    </span>
                  </div>

                  {/* Visibility metadata */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                    <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Clearance / Visibility</span>
                    <span className="text-[#00FFC2] font-semibold flex items-center gap-1.5 mt-0.5 bg-[#00FFC2]/5 border border-[#00FFC2]/15 px-2 py-0.5 rounded text-[10px] w-fit">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      {selectedDoc.visibility}
                    </span>
                  </div>

                  {/* File specs metadata */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                      <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">File Size</span>
                      <span className="text-white font-semibold mt-0.5">{selectedDoc.size}</span>
                    </div>
                    <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11px]">
                      <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Uploaded Date</span>
                      <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-white/40" />
                        {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Attestation Log stream terminal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 uppercase font-semibold">
                    <Terminal className="w-4 h-4 text-[#009DFF]" />
                    <span>AMD SEV-SNP SHIELD STREAM</span>
                  </div>
                  {isLogsSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 text-[#009DFF] animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[#00FFC2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-pulse" />
                      <span>ATTESTATION SIGNED</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 rounded-xl border border-white/5 bg-black text-[10.5px] font-mono text-white/70 space-y-2 h-[150px] overflow-y-auto select-text">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed border-b border-white/[0.01] pb-1 font-mono">
                      <span className="text-[#009DFF]/80 mr-1.5">&gt;</span>
                      {log}
                    </div>
                  ))}
                  {!isLogsSyncing && (
                    <div className="text-[9.5px] text-[#00FFC2]/70 pt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Policy enforcement interlock locked. Cryptographic signature matches.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description summary block */}
              <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5 text-[11.5px] space-y-1">
                <div className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest font-semibold">Repository Document Description</div>
                <p className="text-white/60 font-sans leading-relaxed">
                  {selectedDoc.desc}
                </p>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-white/5 bg-black/[0.15] space-y-3">
              <div className="space-y-1">
                <span className="text-white/20 font-bold block font-mono text-[8.5px] uppercase">CRYPTOGRAPHIC SEAL</span>
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-[#009DFF]/10 bg-[#009DFF]/5 font-mono text-[10px]">
                  <span className="text-white/50 truncate tracking-wide pr-2 select-all">{selectedDoc.hash}</span>
                  <button 
                    onClick={() => handleCopyHash(selectedDoc.hash)} 
                    className="p-1 rounded border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/40 hover:text-white transition-all shrink-0 cursor-pointer"
                    title="Copy Cryptographic Seal"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-[#00FFC2]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1.5">
                <Link 
                  href={`/portal/documents/${selectedDoc.id}`}
                  className="h-9 rounded border border-white/10 hover:border-[#009DFF]/30 hover:bg-[#009DFF]/5 text-[10.5px] font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center bg-white/[0.01]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Audit Trail</span>
                </Link>
                
                <button 
                  onClick={() => handleSimulatedDownload(selectedDoc)} 
                  className="h-9 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10.5px] font-mono font-bold uppercase text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]"
                >
                  <span>Download</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


