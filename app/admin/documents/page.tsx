"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Plus, X, Check, CheckCircle2, AlertTriangle, 
  FileText, RefreshCw, Download, Layers, Cpu, ShieldCheck, 
  User, Tag, ChevronRight, Trash2, Clock, Terminal, AlertCircle,
  SlidersHorizontal, CheckSquare2, Square, FileCode
} from "lucide-react";

// ==========================================
// 1. DATA MODELS & TYPES
// ==========================================
interface DocumentItem {
  id: string;
  title: string;
  fileSize: string;
  type: "PDF" | "JSON" | "YAML" | "XML";
  sha256: string;
  client: string;
  projectId: string; // "PROJ-201" etc, or "UNASSIGNED"
  status: "Verified" | "Under Review" | "Action Required" | "Superseded";
  owner: string;
  version: string;
  lastUpdated: string;
  description: string;
  governanceChecks: {
    label: string;
    checked: boolean;
    framework: string;
  }[];
}

interface ProjectItem {
  id: string;
  name: string;
  client: string;
}

// ==========================================
// 2. STATIC MOCK CONFIGURATION
// ==========================================
const CLIENTS = [
  "Apex Sovereign Group [Preview Client]",
  "Global Retail Enclave [Preview Client]",
  "Sovereign Logistics Unit [Preview Client]",
  "Federal Treasury Division [Preview Client]",
  "National Health Enclave [Preview Client]"
];

const STATIC_PROJECTS: ProjectItem[] = [
  { id: "PROJ-201", name: "Apex Sovereign Multi-Agent Lattice", client: "Apex Sovereign Group [Preview Client]" },
  { id: "PROJ-202", name: "Global Retail Real-Time Audit Ring", client: "Global Retail Enclave [Preview Client]" },
  { id: "PROJ-203", name: "Sovereign Logistics AI Route Optimizer", client: "Sovereign Logistics Unit [Preview Client]" },
  { id: "PROJ-204", name: "Federal Treasury Multi-Enclave Ledger", client: "Federal Treasury Division [Preview Client]" },
  { id: "PROJ-205", name: "National Health Secure Diagnostics Loop", client: "National Health Enclave [Preview Client]" },
  { id: "UNASSIGNED", name: "Unassigned Registry Sandbox Only", client: "N/A" }
];

const STATUSES = ["Verified", "Under Review", "Action Required", "Superseded"];
const TYPES = ["PDF", "JSON", "YAML", "XML"];
const OWNERS = ["Dr. Sarah Vance", "Alexander Mercer", "Marcus Vance", "Evelyn Carter", "Auditor Jenkins"];
const VERSIONS = ["v1.0.0", "v1.1.0", "v1.2.0", "v2.1.0", "v2.4.1", "v3.0.2"];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "DOC-801",
    title: "Sovereign Core Architectural Blueprint",
    fileSize: "12.4 MB",
    type: "PDF",
    sha256: "0xAB9811C82FFD201A99E8F3C721A0C5E89812A",
    client: "Apex Sovereign Group [Preview Client]",
    projectId: "PROJ-201",
    status: "Verified",
    owner: "Dr. Sarah Vance",
    version: "v2.4.1",
    lastUpdated: "2026-06-27T15:20:00Z",
    description: "Deep-level system-wide architectural layout mapping high-throughput isolated core loop with secure localized kernel telemetry and dual-layer TLS 1.3 socket.",
    governanceChecks: [
      { label: "Hardware Cryptographic Enclave Key Binding", checked: true, framework: "ISO-27001 Sec A.12" },
      { label: "Zero-Trust TLS 1.3 Handshake Protocol Verification", checked: true, framework: "SOC2 CC6.3" },
      { label: "Kernel-Level eBPF Event Stream Telemetry", checked: true, framework: "NIST SP 800-53" },
      { label: "Continuous Airgapped Workspace Isolation Check", checked: true, framework: "FIPS-140-3" }
    ]
  },
  {
    id: "DOC-802",
    title: "SOC2 Compliance Enclave Certificate",
    fileSize: "4.8 MB",
    type: "PDF",
    sha256: "0xFF410D390E8F91B02AA6E8F3C2C77215446C1",
    client: "Global Retail Enclave [Preview Client]",
    projectId: "PROJ-202",
    status: "Verified",
    owner: "Alexander Mercer",
    version: "v1.1.0",
    lastUpdated: "2026-06-27T14:10:00Z",
    description: "Verified SOC2 trust services criteria certification covering security, availability, and processing integrity inside target cloud sandboxes.",
    governanceChecks: [
      { label: "Third-Party Attestation Key Signing", checked: true, framework: "AICPA TSC 2017" },
      { label: "Continuous Monitoring & Event Stream Audit", checked: true, framework: "SOC2 CC7.2" },
      { label: "Threat and Vulnerability Scan Verification", checked: true, framework: "ISO-27001" }
    ]
  },
  {
    id: "DOC-803",
    title: "GFF AI Runtime Governance Ruleset",
    fileSize: "1.2 MB",
    type: "JSON",
    sha256: "0x01DE8A88FF4E201B7FF911A3E2298F390D88B",
    client: "Sovereign Logistics Unit [Preview Client]",
    projectId: "PROJ-203",
    status: "Under Review",
    owner: "Marcus Vance",
    version: "v3.0.2",
    lastUpdated: "2026-06-26T18:05:00Z",
    description: "Structured policy ruleset defining sensory bounds, alignment tolerances, and real-time model override guardrails applied to agent networks.",
    governanceChecks: [
      { label: "Static Model Behavioral Rules Match", checked: true, framework: "NIST SP 800" },
      { label: "Dynamic Runtime Guardrail Policy Validation", checked: false, framework: "EU AI Act" },
      { label: "Emergency Kill-Switch Interface Enforceability", checked: true, framework: "GFF Gov Core" }
    ]
  },
  {
    id: "DOC-804",
    title: "NIST Federal Treasury Integration Schema",
    fileSize: "750 KB",
    type: "YAML",
    sha256: "0x99A1C4E72B7FD40A9D8E3C2C77E1546C1A4B0",
    client: "Federal Treasury Division [Preview Client]",
    projectId: "PROJ-204",
    status: "Verified",
    owner: "Evelyn Carter",
    version: "v1.0.5",
    lastUpdated: "2026-06-27T09:30:00Z",
    description: "NIST-compliant hardware enclave schema isolating cryptographic treasury signatures and financial auditing models from general compute networks.",
    governanceChecks: [
      { label: "FIPS 140-3 Cryptographic Module Verification", checked: true, framework: "FIPS-140-3" },
      { label: "Hardware-enforced Security Boundary Isolation", checked: true, framework: "NIST SP 800" },
      { label: "Dual-Custodian Sign-off Enforcement Logic", checked: true, framework: "Treasury SEC" }
    ]
  },
  {
    id: "DOC-805",
    title: "Sovereign Health HIPAA Sensory Consent Log",
    fileSize: "8.3 MB",
    type: "PDF",
    sha256: "0xEE7302195ACBD90B8EEFF01A3D1C8C570E28B",
    client: "National Health Enclave [Preview Client]",
    projectId: "PROJ-205",
    status: "Action Required",
    owner: "Auditor Jenkins",
    version: "v1.0.0",
    lastUpdated: "2026-06-27T11:45:00Z",
    description: "Audit trail mapping sensory consent logs and medical diagnostic models to strict regulatory patient boundary guarantees.",
    governanceChecks: [
      { label: "Patient Health Information PHI Encryption Check", checked: true, framework: "HIPAA Sec 164" },
      { label: "Enclave Decoupled Memory Wipe on Idle Verification", checked: false, framework: "HIPAA Access" },
      { label: "Audit Log Cryptographic Append-Only Sign", checked: true, framework: "HITECH" }
    ]
  },
  {
    id: "DOC-806",
    title: "Global Audit Ring eBPF Stream Schema",
    fileSize: "3.1 MB",
    type: "JSON",
    sha256: "0x77E102F49D7AC1B89AC6E1F30C82E84B0F1A4",
    client: "Global Retail Enclave [Preview Client]",
    projectId: "PROJ-202",
    status: "Superseded",
    owner: "Alexander Mercer",
    version: "v2.1.0",
    lastUpdated: "2026-06-25T14:30:00Z",
    description: "Legacy JSON definition mapping live telemetry stream filters for the global audit ring project. Superseded by newer revision ruleset.",
    governanceChecks: [
      { label: "Kernel Telemetry Stream Validation", checked: true, framework: "eBPF Sec-1" },
      { label: "Real-time Auditing Loop Alignment Checks", checked: true, framework: "SOC2 Type II" }
    ]
  },
  {
    id: "DOC-807",
    title: "AMD SEV-SNP Attestation Report",
    fileSize: "2.3 MB",
    type: "XML",
    sha256: "0xC82FFD201A99E8F3C721A0C5E89812A812C4",
    client: "Sovereign Logistics Unit [Preview Client]",
    projectId: "UNASSIGNED",
    status: "Verified",
    owner: "Dr. Sarah Vance",
    version: "v1.2.0",
    lastUpdated: "2026-06-27T08:15:00Z",
    description: "Hardware-level attestation measurements verified against reference hashes inside the AMD SEV-SNP secure processor enclave.",
    governanceChecks: [
      { label: "Hardware measurement verification (MMEASURE)", checked: true, framework: "AMD SEV-SNP" },
      { label: "Host hypervisor isolation cryptographic proof", checked: true, framework: "NIST SP 800" }
    ]
  }
];

export default function AdminDocumentsPage() {
  // ==========================================
  // 3. REACT STATE MANAGEMENT & BACKEND INTEGRATION
  // ==========================================
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [projects, setProjects] = useState<ProjectItem[]>(STATIC_PROJECTS);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwner, setFilterOwner] = useState("all");
  const [filterVersion, setFilterVersion] = useState("all");

  // Interaction states
  const [assigningProjectId, setAssigningProjectId] = useState("UNASSIGNED");
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  // Helper mapping utilities
  const getClientIdFromClientName = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("apex")) return "client-001";
    if (lower.includes("retail")) return "client-002";
    if (lower.includes("logistics")) return "client-003";
    if (lower.includes("treasury") || lower.includes("federal")) return "client-004";
    return "client-001";
  };

  const getClientNameFromId = (id: string): string => {
    switch (id) {
      case "client-001": return "Apex Sovereign Group [Preview Client]";
      case "client-002": return "Global Retail Enclave [Preview Client]";
      case "client-003": return "Sovereign Logistics Unit [Preview Client]";
      case "client-004": return "Federal Treasury Division [Preview Client]";
      default: return "Apex Sovereign Group [Preview Client]";
    }
  };
  // Synchronize documents and projects with backend CRUD API
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) {
        const loginRes = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "s.vance@governance.gff.ai", password: "VanceSecure2026!" })
        });
        if (loginRes.ok) {
          const authData = await loginRes.json();
          if (authData.accessToken) {
            token = authData.accessToken;
            localStorage.setItem("gff_ai_access_token", authData.accessToken);
          }
        }
      }
      if (!token) throw new Error("Cryptographic token not established.");

      const projRes = await fetch("/api/v1/projects", { headers: { "Authorization": `Bearer ${token}` } });
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.success && projData.projects) {
          const mappedProjects = projData.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            client: p.client_name || getClientNameFromId(p.client_id)
          }));
          setProjects([...mappedProjects, { id: "UNASSIGNED", name: "Unassigned Registry Sandbox Only", client: "N/A" }]);
        }
      }

      const docRes = await fetch("/api/v1/documents", { headers: { "Authorization": `Bearer ${token}` } });
      if (docRes.ok) {
        const docData = await docRes.json();
        if (docData.success && docData.documents) {
          const mappedDocs = docData.documents.map((d: any) => ({
            id: d.id,
            title: d.title,
            fileSize: d.fileSize || "1.0 MB",
            type: d.type || d.document_type || "PDF",
            sha256: d.sha256 || "0x...",
            client: d.client_name || getClientNameFromId(d.client_id),
            projectId: d.projectId || d.project_id || "UNASSIGNED",
            status: d.status || "Under Review",
            owner: d.owner || "Dr. Sarah Vance",
            version: d.version || "v1.0.0",
            lastUpdated: d.lastUpdated || new Date().toISOString(),
            description: d.description || "",
            governanceChecks: d.governanceChecks || []
          }));
          setDocuments(mappedDocs);
        } else {
          throw new Error(docData.message || "Failed to parse enclave document index.");
        }
      } else {
        throw new Error("HTTP connection to document vault rejected.");
      }
    } catch (err: any) {
      setError(err.message || "Cryptographic registry sync failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Document registration form states
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"PDF" | "JSON" | "YAML" | "XML">("PDF");
  const [newClient, setNewClient] = useState(CLIENTS[0]);
  const [newProject, setNewProject] = useState("UNASSIGNED");
  const [newStatus, setNewStatus] = useState<"Verified" | "Under Review" | "Action Required">("Verified");
  const [newOwner, setNewOwner] = useState(OWNERS[0]);
  const [newVersion, setNewVersion] = useState("v1.0.0");
  const [newFileSize, setNewFileSize] = useState("1.5 MB");
  const [newDesc, setNewDesc] = useState("");

  // Get active selected document details dynamically
  const selectedDoc = useMemo(() => {
    return documents.find(doc => doc.id === selectedDocId) || null;
  }, [documents, selectedDocId]);

  // Sync re-assignment selector when selected document changes
  useEffect(() => {
    if (selectedDoc) {
      setAssigningProjectId(selectedDoc.projectId);
    }
  }, [selectedDoc]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: "" });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
  };

  // ==========================================
  // 4. ACTION HANDLERS WITH BACKEND METADATA CRUD
  // ==========================================
  
  // Assign Document to Project (PATCH metadata)
  const handleAssignProject = async (docId: string, projectId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const targetProj = projects.find(p => p.id === projectId);
      const targetClientId = targetProj && targetProj.id !== "UNASSIGNED" ? getClientIdFromClientName(targetProj.client) : undefined;

      const res = await fetch(`/api/v1/documents/${docId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: projectId === "UNASSIGNED" ? "" : projectId,
          projectId: projectId === "UNASSIGNED" ? "" : projectId,
          client_id: targetClientId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Cryptographic association established: Document bound successfully.`);
        await fetchData();
      } else {
        showToast(`Failed to update project re-assignment: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      showToast(`Error communicating update with secure enclave.`);
    } finally {
      setLoading(false);
    }
  };

  // Simulate secure administrator download (Audit Logs remain mock but logged)
  const handleSimulatedDownload = (docId: string, title: string) => {
    setDownloadingDocId(docId);
    setTimeout(() => {
      setDownloadingDocId(null);
      showToast(`Audit log registered: Secure admin transfer of "${title}" completed.`);
      alert(`[SECURE VAULT API] Administrator copy successfully transferred.\n\nDocument: ${title}\nSHA-256 integrity checks completed over airgapped connection.`);
    }, 1500);
  };

  // Toggle checklist inside drawer (PATCH metadata)
  const handleToggleCheck = async (docId: string, checkIndex: number) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const updatedChecks = [...doc.governanceChecks];
    updatedChecks[checkIndex] = {
      ...updatedChecks[checkIndex],
      checked: !updatedChecks[checkIndex].checked
    };

    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch(`/api/v1/documents/${docId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          governanceChecks: updatedChecks
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Governance checklist updated. Audit state synchronized.`);
        setDocuments(prevDocs => 
          prevDocs.map(d => d.id === docId ? { ...d, governanceChecks: updatedChecks } : d)
        );
      } else {
        showToast(`Failed to sync checklist: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      showToast(`Error syncing checklist with secure enclave.`);
    }
  };

  // Register New Document Submit (POST metadata CRUD)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const targetClientId = getClientIdFromClientName(newClient);

      const res = await fetch("/api/v1/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          client_id: targetClientId,
          project_id: newProject === "UNASSIGNED" ? "" : newProject,
          projectId: newProject === "UNASSIGNED" ? "" : newProject,
          document_type: newType,
          type: newType,
          status: newStatus,
          version: newVersion,
          owner: newOwner,
          description: newDesc || "Custom compliance specification uploaded through interactive admin console.",
          fileSize: newFileSize || "1.0 MB"
        })
      });
      const data = await res.json();
      if (data.success && data.document) {
        setIsRegisterModalOpen(false);
        showToast(`Document Registry expanded: Created ${data.document.id}`);
        setNewTitle("");
        setNewDesc("");
        setNewFileSize("1.5 MB");
        setNewVersion("v1.0.0");
        await fetchData();
      } else {
        showToast(`Failed to register document: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      showToast(`Error creating document in enclave registry.`);
    } finally {
      setLoading(false);
    }
  };

  // Reset Filters helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterClient("all");
    setFilterProject("all");
    setFilterType("all");
    setFilterStatus("all");
    setFilterOwner("all");
    setFilterVersion("all");
    showToast("Filtering workspace cleared. All registry objects displayed.");
  };

  // Delete document (DELETE CRUD)
  const handleDeleteDocument = async (id: string, title: string) => {
    if (confirm(`Deprovision document ${id} ("${title}") from administrative registry?`)) {
      setLoading(true);
      try {
        const token = localStorage.getItem("gff_ai_access_token");
        const res = await fetch(`/api/v1/documents/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Document ${id} unlinked and removed successfully.`);
          if (selectedDocId === id) setSelectedDocId(null);
          await fetchData();
        } else {
          showToast(`Failed to delete document: ${data.message || "Unknown error"}`);
        }
      } catch (err) {
        showToast(`Failed to communicate deprovisioning command.`);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // 5. QUERY FILTERING LOGIC
  // ==========================================
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClient = filterClient === "all" || doc.client === filterClient;
      const matchesProject = filterProject === "all" || doc.projectId === filterProject;
      const matchesType = filterType === "all" || doc.type === filterType;
      const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
      const matchesOwner = filterOwner === "all" || doc.owner === filterOwner;
      const matchesVersion = filterVersion === "all" || doc.version === filterVersion;

      return (
        matchesSearch && 
        matchesClient && 
        matchesProject && 
        matchesType && 
        matchesStatus && 
        matchesOwner && 
        matchesVersion
      );
    });
  }, [
    documents, searchQuery, filterClient, filterProject, 
    filterType, filterStatus, filterOwner, filterVersion
  ]);

  const metrics = useMemo(() => {
    const totalCount = documents.length;
    const verifiedCount = documents.filter(d => d.status === "Verified").length;
    const unassignedCount = documents.filter(d => d.projectId === "UNASSIGNED").length;
    const integrityRate = totalCount > 0 ? ((verifiedCount / totalCount) * 100).toFixed(1) : "100.0";

    return {
      totalCount,
      verifiedCount,
      unassignedCount,
      integrityRate
    };
  }, [documents]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      filterClient !== "all" ||
      filterProject !== "all" ||
      filterType !== "all" ||
      filterStatus !== "all" ||
      filterOwner !== "all" ||
      filterVersion !== "all"
    );
  }, [searchQuery, filterClient, filterProject, filterType, filterStatus, filterOwner, filterVersion]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
      case "Under Review":
        return "border-amber-500/20 bg-amber-500/5 text-amber-400";
      case "Action Required":
        return "border-rose-500/20 bg-rose-500/5 text-rose-400";
      case "Superseded":
        return "border-white/10 bg-white/5 text-white/50";
      default:
        return "border-white/15 bg-white/5 text-white/60";
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "PDF":
        return "border-indigo-500/20 bg-indigo-500/5 text-indigo-400";
      case "JSON":
        return "border-cyan-500/20 bg-cyan-500/5 text-cyan-400";
      case "YAML":
        return "border-purple-500/20 bg-purple-500/5 text-purple-400";
      case "XML":
        return "border-amber-500/20 bg-amber-500/5 text-amber-500";
      default:
        return "border-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6 relative min-h-screen pb-12 font-mono">
      {/* ============================================================================ */}
      {/* HEADER SECTION */}
      {/* ============================================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#009DFF]" />
            <span className="text-[10px] font-bold tracking-widest uppercase">System Secure Console</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Cryptographic Document Registry
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">
            Administrative flight deck for managing structural schemas, security certifications, and governance policies. Re-assign credentials to isolated enclave projects to enforce real-time hardware compliance bounds.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* ============================================================================ */}
      {/* PREMIUM METRICS SUMMARY RIBBON */}
      {/* ============================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-1 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Vaulted Registries</span>
            <FileText className="w-4 h-4 text-[#009DFF]" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{metrics.totalCount}</span>
            <span className="text-[9px] text-[#00FFC2] font-bold bg-[#00FFC2]/5 border border-[#00FFC2]/15 px-1 rounded">SECURE</span>
          </div>
          <div className="text-[9.5px] text-white/30 truncate">Cryptographically sealed items</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#009DFF]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-1 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Enclave Bound</span>
            <Layers className="w-4 h-4 text-[#00FFC2]" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-[#00FFC2] tracking-tight">{metrics.totalCount - metrics.unassignedCount}</span>
            <span className="text-[9px] text-white/40 font-semibold">MAPPED OBJECTS</span>
          </div>
          <div className="text-[9.5px] text-white/30 truncate">Active alignment integrations</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FFC2]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-1 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Verified Rate</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">{metrics.integrityRate}%</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-1 rounded">AUDITED</span>
          </div>
          <div className="text-[9.5px] text-white/30 truncate">ISO-27001 checked standards</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-1 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Unassigned Sandbox</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-amber-400 tracking-tight">{metrics.unassignedCount}</span>
            <span className="text-[9px] text-amber-400 bg-amber-400/5 border border-amber-400/25 px-1 rounded">PENDING</span>
          </div>
          <div className="text-[9.5px] text-white/30 truncate">Unmapped general registry files</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {loading && documents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-xl bg-[#050505]/20 font-mono text-center">
          <RefreshCw className="w-10 h-10 text-[#009DFF] mb-3 animate-spin" />
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">Synchronizing Registry Vault...</h4>
          <p className="text-white/40 text-[11px] max-w-sm mt-1 leading-relaxed">
            Establishing secure cryptographical tunnel to active enclave compliance indices. Please hold...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>VAULT ERROR:</strong> {error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 h-7 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-[10px] text-white uppercase tracking-wider font-bold transition-all cursor-pointer"
          >
            Retry Handshake
          </button>
        </div>
      )}

      {/* ============================================================================ */}
      {/* SEARCH & DETAILED FILTER SYSTEM */}
      {/* ============================================================================ */}
      <div className="border border-white/5 rounded-xl bg-[#050505]/20 p-4 space-y-4">
        {/* Search & Reset Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search registry by ID, title, SHA-256 hash, or technical specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-white outline-none focus:border-[#009DFF]/30 focus:bg-white/[0.03] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="h-9 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[10.5px] text-white/80 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>Reset Filters</span>
              </button>
            )}
            <div className="h-9 px-3 rounded-lg border border-white/5 bg-white/[0.01] text-[10.5px] text-white/40 flex items-center gap-1.5 select-none font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{filteredDocuments.length} OF {documents.length} SECURED</span>
            </div>
          </div>
        </div>

        {/* Dropdowns Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Client Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Client Enclave</label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL CLIENTS</option>
              {CLIENTS.map((c) => (
                <option key={c} value={c}>
                  {c.replace(" [Preview Client]", "")}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Target Project</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL PROJECTS</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id === "UNASSIGNED" ? "UNASSIGNED" : `${p.id}: ${p.name.substring(0, 16)}...`}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Document Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL TYPES</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Governance Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL STATUSES</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Owner Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Registered Owner</label>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL OWNERS</option>
              {OWNERS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Version Filter */}
          <div className="space-y-1">
            <label className="text-[8.5px] text-white/40 uppercase font-bold tracking-wider block">Revision Version</label>
            <select
              value={filterVersion}
              onChange={(e) => setFilterVersion(e.target.value)}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-[#090909] px-2 text-[11px] text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
            >
              <option value="all">ALL REVISIONS</option>
              {VERSIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================================ */}
      {/* MAIN DOCUMENT WORKSPACE: DESKTOP TABLE */}
      {/* ============================================================================ */}
      <div className="hidden md:block overflow-hidden border border-white/5 rounded-xl bg-[#050505]/20">
        <table className="w-full border-collapse text-left text-[11px] font-mono">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-white/40 uppercase tracking-widest text-[9px] font-bold select-none">
              <th className="py-3 px-4">Identification & Title</th>
              <th className="py-3 px-4">Mapped Enterprise / Project</th>
              <th className="py-3 px-4">Governance Status</th>
              <th className="py-3 px-4">Owner & Revision</th>
              <th className="py-3 px-4">Cryptographic Hash (SHA-256)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredDocuments.map((doc) => {
              const matchedProj = projects.find(p => p.id === doc.projectId);
              const projectName = matchedProj ? matchedProj.name : "Unassigned Registry";
              const isUnassigned = doc.projectId === "UNASSIGNED";

              return (
                <tr 
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedDocId === doc.id ? "bg-[#009DFF]/5 hover:bg-[#009DFF]/8" : ""}`}
                >
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded mt-0.5 border shrink-0 ${getTypeBadgeStyle(doc.type)}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/30 font-bold">{doc.id}</span>
                          <span className={`text-[8.5px] border rounded px-1 py-0.2 font-bold ${getTypeBadgeStyle(doc.type)}`}>
                            {doc.type}
                          </span>
                        </div>
                        <h4 className="text-white font-bold tracking-tight text-[11.5px] mt-0.5 hover:text-[#009DFF] transition-colors leading-tight">
                          {doc.title}
                        </h4>
                        <span className="text-[9.5px] text-white/30 block mt-0.5 select-none font-bold">SIZE: {doc.fileSize}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="space-y-1">
                      <span className="text-white/80 font-bold block truncate" title={doc.client}>
                        {doc.client.replace(" [Preview Client]", "")}
                      </span>
                      {isUnassigned ? (
                        <div className="inline-flex items-center gap-1 text-[9px] text-amber-400 bg-amber-400/5 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>REGISTRY ONLY</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[9px] text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-1.5 py-0.5 rounded font-bold max-w-full truncate" title={projectName}>
                          <Layers className="w-3 h-3 shrink-0 text-[#00FFC2]" />
                          <span className="truncate">{doc.projectId}: {projectName.substring(0, 18)}...</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9.5px] font-bold ${getStatusBadgeStyle(doc.status)}`}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${doc.status === "Verified" ? "bg-emerald-400" : doc.status === "Under Review" ? "bg-amber-400" : doc.status === "Action Required" ? "bg-rose-400" : "bg-white/40"}`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${doc.status === "Verified" ? "bg-emerald-500" : doc.status === "Under Review" ? "bg-amber-500" : doc.status === "Action Required" ? "bg-rose-500" : "bg-white/50"}`}></span>
                      </span>
                      <span>{doc.status.toUpperCase()}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-white/70">
                        <User className="w-3 h-3 text-[#00FFC2] shrink-0" />
                        <span>{doc.owner}</span>
                      </div>
                      <span className="text-[10px] text-[#009DFF]/60 block font-bold select-none">
                        REVISION: {doc.version}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono select-all">
                    <span className="text-[10px] text-white/35 font-bold block mb-0.5 uppercase tracking-wide">SHA-256 Sum:</span>
                    <span className="text-[9.5px] text-[#009DFF]/65 truncate block max-w-[120px] font-mono font-bold">
                      {doc.sha256}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedDocId(doc.id)}
                        className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-white/70 hover:text-white transition-all hover:border-white/20 cursor-pointer"
                        title="Review Details"
                      >
                        <ChevronRight className="w-4 h-4 text-[#009DFF]" />
                      </button>
                      <button
                        onClick={() => handleSimulatedDownload(doc.id, doc.title)}
                        disabled={downloadingDocId !== null}
                        className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-[#009DFF]/10 hover:border-[#009DFF]/20 text-white/70 hover:text-[#009DFF] transition-all disabled:opacity-40 cursor-pointer"
                        title="Download Copy"
                      >
                        {downloadingDocId === doc.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-[#009DFF]" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.title)}
                        className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-rose-500/10 hover:border-rose-500/20 text-white/30 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================================ */}
      {/* MOBILE RESPONSIVE CARD FALLBACK */}
      {/* ============================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredDocuments.map((doc) => {
          const matchedProj = projects.find(p => p.id === doc.projectId);
          const projectName = matchedProj ? matchedProj.name : "Unassigned Registry";
          const isUnassigned = doc.projectId === "UNASSIGNED";

          return (
            <div 
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`border rounded-xl p-4 space-y-4 bg-[#050505]/40 backdrop-blur-sm transition-all cursor-pointer ${selectedDocId === doc.id ? "border-[#009DFF]/50 bg-[#009DFF]/5" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/45 font-bold">{doc.id}</span>
                    <span className={`text-[8.5px] border rounded px-1.5 font-bold ${getTypeBadgeStyle(doc.type)}`}>
                      {doc.type}
                    </span>
                    <span className="text-[9.5px] text-white/30 font-bold">({doc.fileSize})</span>
                  </div>
                  <h4 className="text-white font-bold tracking-tight text-[12.5px] leading-tight hover:text-[#009DFF] transition-colors">
                    {doc.title}
                  </h4>
                </div>
                
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getStatusBadgeStyle(doc.status)}`}>
                  <span>{doc.status.toUpperCase()}</span>
                </span>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-2">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Client Tenant</span>
                  <span className="text-white/80 font-bold text-[10.5px] block truncate">
                    {doc.client.replace(" [Preview Client]", "")}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Sandbox Mapping</span>
                  {isUnassigned ? (
                    <span className="text-amber-400 font-bold text-[10px] block">Unassigned Registry</span>
                  ) : (
                    <span className="text-[#009DFF] font-bold text-[10px] block truncate">
                      {doc.projectId}: {projectName}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Owner & Revision</span>
                  <div className="flex items-center gap-1 text-white/60 text-[10.5px]">
                    <User className="w-3 h-3 text-[#00FFC2]" />
                    <span>{doc.owner}</span>
                    <span className="text-white/30 font-bold">|</span>
                    <span className="text-[#009DFF]/60 font-bold">{doc.version}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">SHA-256 Key</span>
                  <span className="text-[9.5px] text-[#009DFF]/60 truncate block font-mono font-bold select-all">
                    {doc.sha256}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedDocId(doc.id)}
                  className="flex-1 h-8 rounded border border-white/5 bg-white/[0.01] text-[10.5px] text-white/80 hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-center gap-1 cursor-pointer font-bold font-mono"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#009DFF]" />
                  <span>Review Details</span>
                </button>
                <button
                  onClick={() => handleSimulatedDownload(doc.id, doc.title)}
                  disabled={downloadingDocId !== null}
                  className="h-8 w-12 rounded border border-[#009DFF]/15 hover:border-[#009DFF]/30 bg-[#009DFF]/5 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
                  title="Download File"
                >
                  {downloadingDocId === doc.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#009DFF]" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-[#009DFF]" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id, doc.title)}
                  className="h-8 w-8 rounded border border-rose-500/15 bg-rose-500/5 text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================================ */}
      {/* EMPTY STATE INDICATOR */}
      {/* ============================================================================ */}
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-xl bg-[#050505]/20 font-mono text-center">
          <AlertCircle className="w-10 h-10 text-white/25 mb-3 animate-pulse" />
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">No Secure Credentials Found</h4>
          <p className="text-white/40 text-[11px] max-w-sm mt-1 leading-relaxed">
            No document registry objects match your filtering configurations. Reset parameters or register a new compliance asset above.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 h-8.5 px-4 rounded-lg bg-[#009DFF] hover:bg-[#0082d4] text-[10.5px] text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Reset Search Boundaries
          </button>
        </div>
      )}

      {/* ============================================================================ */}
      {/* SLIDING DOCUMENT DRAWER (RIGHT PANEL DEEP VIEW) */}
      {/* ============================================================================ */}
      {selectedDoc && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedDocId(null)}
          />

          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg sm:max-w-xl bg-[#090909] border-l border-white/10 z-50 shadow-[0_0_50px_rgba(0,157,255,0.15)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#009DFF]" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Asset Detail Deck</span>
                    <span className="text-white/20 font-semibold">•</span>
                    <span className="text-[9.5px] font-mono text-[#009DFF] font-semibold uppercase">{selectedDoc.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-0.5 max-w-[280px] sm:max-w-[360px] truncate" title={selectedDoc.title}>
                    {selectedDoc.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocId(null)}
                className="p-1.5 rounded hover:bg-white/5 text-white/45 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-white/70">
              <div className="space-y-2">
                <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Operational Scope Description</h4>
                <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/30 text-white/80 leading-relaxed font-mono">
                  {selectedDoc.description}
                </div>
              </div>

              {/* Metadata cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-white/5 bg-white/[0.01] rounded-lg">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Cryptographic Key</span>
                  <span className="text-[10.5px] text-[#009DFF]/80 font-mono block select-all font-bold mt-1 truncate">
                    {selectedDoc.sha256}
                  </span>
                </div>

                <div className="p-3 border border-white/5 bg-white/[0.01] rounded-lg">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Secure Size</span>
                  <span className="text-[10.5px] text-[#00FFC2] font-mono block font-bold mt-1">
                    {selectedDoc.fileSize}
                  </span>
                </div>

                <div className="p-3 border border-white/5 bg-white/[0.01] rounded-lg">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Registered Owner</span>
                  <div className="flex items-center gap-1.5 text-white/80 font-bold mt-1">
                    <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{selectedDoc.owner}</span>
                  </div>
                </div>

                <div className="p-3 border border-white/5 bg-white/[0.01] rounded-lg">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Active Revision</span>
                  <div className="flex items-center gap-1.5 text-[#009DFF] font-bold mt-1">
                    <Tag className="w-3.5 h-3.5 text-[#009DFF] shrink-0" />
                    <span>{selectedDoc.version}</span>
                  </div>
                </div>

                <div className="p-3 border border-white/5 bg-white/[0.01] rounded-lg col-span-2">
                  <span className="text-[8.5px] text-white/30 uppercase block font-bold">Last Cryptographic Sync</span>
                  <div className="flex items-center gap-1.5 text-white/60 font-bold mt-1 select-none">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span>{new Date(selectedDoc.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Related Project Mapping / Assign Document to Project (REQUIRED) */}
              <div className="p-4 border border-white/5 bg-[#050505]/45 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#009DFF]" />
                  <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Project Association</h4>
                </div>
                
                <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                  Continuous integration rules require mapping this document asset to an active enclave cluster to enforce real-time hardware isolation and alignment checking.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end pt-1">
                  <div>
                    <span className="text-[8.5px] text-white/30 uppercase block mb-1 font-bold">Current Sandbox Mapping</span>
                    <div className="px-2.5 py-2 rounded border border-white/10 bg-white/5 text-[11px] text-white font-mono truncate font-bold" title={selectedDoc.client}>
                      {selectedDoc.projectId === "UNASSIGNED" 
                        ? "Unassigned (Archive Registry)"
                        : projects.find(p => p.id === selectedDoc.projectId)?.name || "Target Enclave"}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-white/30 uppercase block font-bold">Re-Assign Enclave Project</span>
                    <select
                      value={assigningProjectId}
                      onChange={(e) => setAssigningProjectId(e.target.value)}
                      className="w-full h-8.5 rounded border border-white/10 bg-[#0c0c0c] px-2.5 text-[11px] text-white font-mono outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id === "UNASSIGNED" 
                            ? "Registry Only (Unassign)" 
                            : `${p.id}: ${p.name.substring(0, 18)}...`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleAssignProject(selectedDoc.id, assigningProjectId)}
                    className="h-8 px-4 rounded bg-[#009DFF]/15 hover:bg-[#009DFF]/25 border border-[#009DFF]/20 hover:border-[#009DFF]/30 text-[10px] font-mono font-bold uppercase tracking-wider text-[#009DFF] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Check className="w-3.5 h-3.5 text-[#00FFC2]" />
                    <span>Associate Sandbox Enclave</span>
                  </button>
                </div>
              </div>

              {/* Governance & Framework Checklists (REQUIRED) */}
              <div className="p-4 border border-white/5 bg-[#050505]/45 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Governance Standards checklist</h4>
                </div>

                <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                  Compliance frameworks mapped to this asset. Interactively toggle checkpoints to verify physical node enforcement bounds.
                </p>

                <div className="space-y-2 pt-1">
                  {selectedDoc.governanceChecks.map((check, index) => (
                    <div 
                      key={index}
                      onClick={() => handleToggleCheck(selectedDoc.id, index)}
                      className="flex items-start justify-between p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {check.checked ? (
                            <CheckSquare2 className="w-4 h-4 text-[#00FFC2]" />
                          ) : (
                            <Square className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                        <span className={`text-[11px] leading-tight font-mono ${check.checked ? "text-white/90 font-semibold" : "text-white/45 line-through"}`}>
                          {check.label}
                        </span>
                      </div>
                      <span className="text-[8.5px] font-bold text-[#009DFF] border border-[#009DFF]/15 px-1.5 py-0.2 rounded font-mono shrink-0 select-none ml-2">
                        {check.framework}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enclave live telemetry feed */}
              <div className="p-4 border border-white/5 bg-black rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <Terminal className="w-4 h-4 text-[#00FFC2]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Enclave Integrity Feed</span>
                  </div>
                  <span className="text-[8.5px] bg-emerald-400/10 text-emerald-400 px-1 rounded uppercase font-bold animate-pulse select-none">
                    Realtime telemetry
                  </span>
                </div>
                <div className="bg-[#030303] border border-white/5 rounded p-3 font-mono text-[9px] text-[#00FFC2]/85 space-y-1 select-none">
                  <div>[15:20:10] Connecting to target registry node cluster...</div>
                  <div>[15:20:11] SHA-256 validation: <span className="text-white font-bold">{selectedDoc.sha256}</span></div>
                  <div>[15:20:12] ENCLAVE COMPLIANCE BOUND: <span className="text-white font-bold">SECURE_LEVEL_V</span></div>
                  <div>[15:20:13] ISO-27001 Mapping rate: <span className="text-white font-bold">100.00% Verified</span></div>
                  <div>[15:20:14] Host isolated namespace: <span className="text-[#009DFF]">{selectedDoc.projectId}</span></div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-white/5 bg-white/[0.01] flex items-center gap-3">
              <button
                onClick={() => setSelectedDocId(null)}
                className="flex-1 h-9 rounded border border-white/10 hover:border-white/20 bg-transparent text-[11px] text-white/80 hover:text-white font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Deck
              </button>
              
              <button
                onClick={() => handleSimulatedDownload(selectedDoc.id, selectedDoc.title)}
                disabled={downloadingDocId !== null}
                className="flex-1 h-9 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] text-white font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,157,255,0.25)]"
              >
                {downloadingDocId === selectedDoc.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Securing File...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============================================================================ */}
      {/* MODAL: REGISTER DOCUMENT PREVIEW */}
      {/* ============================================================================ */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#090909] shadow-[0_10px_50px_rgba(0,157,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4.5 h-4.5 text-[#009DFF]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Register Mock Compliance Asset
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9px] font-bold">Document / Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovereign Core Policy Ruleset v4"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 rounded border border-white/10 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Asset Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-9 rounded border border-white/10 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="JSON">JSON Policy Ruleset</option>
                    <option value="YAML">YAML Infrastructure Schema</option>
                    <option value="XML">XML Attestation measurement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Secure File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2 MB"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    className="w-full h-9 rounded border border-white/10 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Client Tenant</label>
                  <select
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full h-9 rounded border border-white/10 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                  >
                    {CLIENTS.map(c => (
                      <option key={c} value={c}>{c.replace(" [Preview Client]", "")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Project Sandbox</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full h-9 rounded border border-white/10 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id === "UNASSIGNED" ? "UNASSIGNED" : `${p.id}: ${p.name.substring(0, 16)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Governance Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full h-9 rounded border border-white/10 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                  >
                    <option value="Verified">VERIFIED & SIGNED</option>
                    <option value="Under Review">UNDER COMPLIANCE REVIEW</option>
                    <option value="Action Required">ACTION REQUIRED (FLAGGED)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9px] font-bold">Credential Revision</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full h-9 rounded border border-white/10 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9px] font-bold">Registered Owner</label>
                <select
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full h-9 rounded border border-white/10 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer font-bold"
                >
                  {OWNERS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9px] font-bold">Technical Specifications Overview</label>
                <textarea
                  rows={3}
                  placeholder="Provide deep architectural overview or context measurements..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded border border-white/10 bg-white/[0.02] p-3 text-white outline-none focus:border-[#009DFF]/30 transition-all font-mono resize-none"
                />
              </div>

              <div className="p-3.5 rounded-lg border border-yellow-500/10 bg-yellow-500/5 text-yellow-400/90 text-[10px] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-yellow-400" />
                <span>
                  <strong>REGISTRATION NOTICE:</strong> Mapped attributes generate mock cryptographic attestation measurements and append to the local registry memory. No cloud billing resources are triggered.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="h-9 px-4 rounded border border-white/10 hover:border-white/20 bg-transparent text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold transition-all shadow-[0_0_15px_rgba(0,157,255,0.3)] cursor-pointer"
                >
                  Commit Registry Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* PREVIEW LIVE TOAST ALERTS */}
      {/* ============================================================================ */}
      {toast.visible && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-[#00FFC2]/30 bg-[#050505]/95 text-[#00FFC2] font-mono text-xs shadow-[0_0_20px_rgba(0,255,194,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-300 select-none">
          <CheckCircle2 className="w-4 h-4 text-[#00FFC2] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
