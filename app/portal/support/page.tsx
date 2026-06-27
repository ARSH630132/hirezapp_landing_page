"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Cpu, DollarSign, FileText, Key, Shield, HelpCircle, 
  Layers, Plus, Search, ArrowLeft, Clock, Lock, Terminal, Send, X, Sparkles, RefreshCw, ChevronDown, CheckCircle2, ShieldAlert, Activity, ChevronRight, Play, Server, Radio
} from "lucide-react";
import { previewProjects, previewSupportTickets, SupportTicket } from "@/lib/mock-data-model";
import { StatusBadge, WorkspaceCard } from "@/components/private-app";

interface ClientSupportTicket extends SupportTicket {
  category: "Project Delivery" | "AI Operations" | "Billing" | "Documents" | "Access" | "Governance" | "General";
  projectId?: string;
}

const CATEGORIES = ["Project Delivery", "AI Operations", "Billing", "Documents", "Access", "Governance", "General"] as const;

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<ClientSupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [catFilter, setCatFilter] = useState("ALL");
  const [priFilter, setPriFilter] = useState("ALL");
  const [projFilter, setProjFilter] = useState("ALL");

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<ClientSupportTicket["category"]>("AI Operations");
  const [priority, setPriority] = useState<ClientSupportTicket["priority"]>("high");
  const [project, setProject] = useState("none");
  const [desc, setDesc] = useState("");

  // Enhanced UI States
  const [rightTab, setRightTab] = useState<"intake" | "topology">("intake");
  const [selectedSvgNode, setSelectedSvgNode] = useState<"client" | "shield" | "sentinel">("shield");
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [protocolRunning, setProtocolRunning] = useState<number | null>(null);
  const [protocolLogs, setProtocolLogs] = useState<string[]>([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submittingLogs, setSubmittingLogs] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const saveTickets = (updated: ClientSupportTicket[]) => {
    setTickets(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gff_support_tickets", JSON.stringify(updated));
    }
  };

  const resetToDefault = () => {
    const cats: ClientSupportTicket["category"][] = ["AI Operations", "AI Operations", "Governance"];
    const projs = ["proj-001", "proj-002", "proj-001"];
    const augmented = previewSupportTickets.map((t, i) => ({
      ...t,
      category: cats[i] || "General",
      projectId: projs[i]
    })) as ClientSupportTicket[];
    saveTickets(augmented);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gff_support_tickets");
      if (saved) {
        try { setTickets(JSON.parse(saved)); } catch (e) { resetToDefault(); }
      } else { resetToDefault(); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !desc.trim()) return;

    setIsSubmittingForm(true);
    setSubmittingLogs([
      "Negotiating session keys inside Intel SGX memory page...",
      "Binding secure hardware-signed enclave session (Clearance Level III)..."
    ]);

    setTimeout(() => {
      setSubmittingLogs(prev => [...prev, "Encrypting local diagnostics dump payload...", "Dispatching secure signal packet to GFF triage array..."]);
    }, 600);

    setTimeout(() => {
      const newId = `SLA-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTkt: ClientSupportTicket = {
        id: newId,
        title: subject,
        status: "open",
        priority,
        category,
        projectId: project !== "none" ? project : undefined,
        createdAt: new Date().toISOString(),
        desc,
        replies: []
      };

      saveTickets([newTkt, ...tickets]);
      setToastMsg(`Sovereign Tunnel ${newId} initialized successfully.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

      setSelectedTicketId(newId);
      setSubject("");
      setDesc("");
      setProject("none");
      setIsSubmittingForm(false);
      setSubmittingLogs([]);
    }, 1500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    const currentReply = replyText;
    setReplyText("");
    setIsReplying(true);

    const userReply = {
      sender: "Alexander Mercer (Client)",
      text: currentReply,
      timestamp: new Date().toISOString()
    };

    const target = tickets.find(t => t.id === selectedTicketId);
    if (!target) return;

    const updatedReplies = [...(target.replies || []), userReply];
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicketId) {
        return { ...t, replies: updatedReplies, status: t.status === "resolved" ? "in_progress" : t.status };
      }
      return t;
    }) as ClientSupportTicket[];

    saveTickets(updatedTickets);

    setTimeout(() => {
      let botText = "Handshake acknowledged. Our on-call systems engineers are reviewing your trace reports inside the secure sandbox.";
      let botSender = "GFF Support Sentinel";

      if (target.category === "AI Operations") {
        botSender = "Dr. Sarah Vance (Lead Systems Architect)";
        botText = "Analyzing enclave CPU and HSM logs. The cryptographic state is re-asserted and key rotational interlocks are operating nominally. All propagation latency is mitigated (<0.4ms).";
      } else if (target.category === "Billing") {
        botSender = "Nicolette Durand (Billing & Treasury)";
        botText = "Invoices check completed. Invoice settlement is verified at blockchain epoch block 18290192 under seal 0xDE897FFA.";
      } else if (target.category === "Governance" || target.category === "Documents") {
        botSender = "Sovereign Audit Agent";
        botText = "Operator credentials verified at Clearance Level IV. The NIST AI RMF logs are compiled successfully within SGX memory. Access credentials issued.";
      }

      const botReply = { sender: botSender, text: botText, timestamp: new Date().toISOString() };
      
      saveTickets(updatedTickets.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, replies: [...updatedReplies, botReply], status: "in_progress" };
        }
        return t;
      }) as ClientSupportTicket[]);
      
      setIsReplying(false);
    }, 1500);
  };

  const runDiagnostic = (idx: number) => {
    setProtocolRunning(idx);
    if (idx === 0) {
      setProtocolLogs([
        "[INITIALIZING] Establishing isolated loop communication to SGX Host Node 3...",
        "[COMPILER] Performing memory integrity validation checksum..."
      ]);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[OK] Found hardware enclave signature (Intel-Xeon-v4)", "[OK] Active session keys verified under block 19280."]);
      }, 700);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[OK] Attestation signature: 0x98FF...3FAA verified.", "[SUCCESS] Secure attestation handshake completed successfully!"]);
        setProtocolRunning(null);
      }, 1600);
    } else if (idx === 1) {
      setProtocolLogs([
        "[INITIALIZING] Fetching Enclave Page Cache (EPC) allocation metrics...",
        "[ALLOCATOR] Discovering active thread partitions..."
      ]);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[WARNING] Found 14% thread fragmentation on Node 2", "[REALLOCATING] Compacting secure RAM sectors..."]);
      }, 700);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[OK] Recovered 256MB SGX protected memory cache.", "[SUCCESS] EPC memory allocation realigned and optimized!"]);
        setProtocolRunning(null);
      }, 1600);
    } else {
      setProtocolLogs([
        "[INITIALIZING] Auditing operational access clearance credentials...",
        "[AUDITOR] Compiling NIST AI RMF continuous compliance trails..."
      ]);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[OK] Integrity trail matched against SGX hardware seal", "[ROTATING] Rolling over administration HSM credentials..."]);
      }, 700);
      setTimeout(() => {
        setProtocolLogs(prev => [...prev, "[OK] Signed key rollover commit block hash: 0xABCD9912", "[SUCCESS] Compliant logging structures and HSM keys rotated!"]);
        setProtocolRunning(null);
      }, 1600);
    }
  };

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = q === "" || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchCat = catFilter === "ALL" || t.category === catFilter;
    const matchPri = priFilter === "ALL" || t.priority === priFilter;
    const matchProj = projFilter === "ALL" || t.projectId === projFilter;
    return matchSearch && matchStatus && matchCat && matchPri && matchProj;
  });

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const getPriorityStyle = (p: string) => {
    switch(p) {
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse";
      case "high": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-white/5 text-white/50 border-white/10";
    }
  };

  const getCatIcon = (cat: string) => {
    switch(cat) {
      case "Project Delivery": return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case "AI Operations": return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case "Billing": return <DollarSign className="w-3.5 h-3.5 text-amber-400" />;
      case "Documents": return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      case "Access": return <Key className="w-3.5 h-3.5 text-red-400" />;
      case "Governance": return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-white/40" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 select-none text-white font-sans relative">
      <style>{`
        @keyframes dash-anim {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-dash {
          stroke-dasharray: 8, 6;
          animation: dash-anim 2s linear infinite;
        }
      `}</style>

      {/* Subtle Background Grid Overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70 mask-image-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-left pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-2.5 py-0.5 rounded uppercase flex items-center gap-1.5 w-fit">
            <Radio className="w-3 h-3 text-[#009DFF] animate-pulse" />
            <span>SOVEREIGN SECURITY TUNNEL ACTIVE</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-mono uppercase mt-1.5 tracking-tight text-white flex items-center gap-2">
            <span>Client Support Center</span>
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">
            Hardware-isolated communications corridor with on-call architects. Securely exchange credentials, configuration trace logs, and enclave diagnostics under active SLA protection.
          </p>
        </div>
        {selectedTicketId && (
          <button onClick={() => setSelectedTicketId(null)} className="h-10 px-5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-[11px] font-mono font-bold uppercase text-white transition-all flex items-center gap-2 cursor-pointer font-sans shadow-md">
            <Plus className="w-4 h-4 text-[#009DFF]" />
            <span>Open New Support Wire</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-left">
        {[
          { l: "Active Tunnels", v: tickets.filter(t => t.status !== "resolved").length, d: "Pending resolution" },
          { l: "SLA Response", v: "100%", d: "< 15m compliance" },
          { l: "Trust Clearance", v: "LEVEL IV", d: "Hardware isolated" },
          { l: "Archived Wires", v: tickets.filter(t => t.status === "resolved").length, d: "Cryptographically sealed" }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm">
            <span className="text-[9.5px] text-white/35 uppercase">{s.l}</span>
            <div className="text-xl font-bold mt-1">{s.v}</div>
            <span className="text-[9px] text-white/20 block mt-1">{s.d}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div id="support-left-list-block" className={`space-y-4 ${selectedTicketId ? "xl:col-span-5" : "xl:col-span-7"}`}>
          {/* Filters */}
          <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/30 backdrop-blur-sm space-y-3 font-mono">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
              <input type="text" placeholder="Search secure tickets by subject..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 rounded-lg border border-white/10 bg-black/40 text-white text-[12px] outline-none focus:border-[#009DFF]/30" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px]">
              {[
                { l: "Status", v: statusFilter, s: setStatusFilter, o: [{ v: "ALL", l: "ALL STATUSES" }, { v: "open", l: "OPEN" }, { v: "in_progress", l: "IN PROGRESS" }, { v: "resolved", l: "RESOLVED" }] },
                { l: "Category", v: catFilter, s: setCatFilter, o: [{ v: "ALL", l: "ALL CATEGORIES" }, ...CATEGORIES.map(c => ({ v: c, l: c.toUpperCase() }))] },
                { l: "Priority", v: priFilter, s: setPriFilter, o: [{ v: "ALL", l: "ALL PRIORITIES" }, { v: "critical", l: "CRITICAL" }, { v: "high", l: "HIGH" }, { v: "medium", l: "MEDIUM" }, { v: "low", l: "LOW" }] },
                { l: "Project", v: projFilter, s: setProjFilter, o: [{ v: "ALL", l: "ALL PROJECTS" }, ...previewProjects.map(p => ({ v: p.id, l: p.tag }))] }
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-white/35 block mb-1 uppercase font-bold">{f.l}</label>
                  <div className="relative">
                    <select value={f.v} onChange={e => f.s(e.target.value)} className="w-full h-8 px-2 pr-6 rounded border border-white/10 bg-black/60 text-white outline-none appearance-none cursor-pointer text-[10px] font-mono">
                      {f.o.map(o => <option key={o.v} value={o.v} className="bg-black text-white font-mono">{o.l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-3 w-3 text-white/30 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="p-10 rounded-xl border border-white/5 bg-[#050505]/20 text-center space-y-3.5 font-mono">
                <ShieldAlert className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-xs text-white/30 font-bold">No active wires match the current security filters.</p>
                <button 
                  onClick={() => { setSearch(""); setStatusFilter("ALL"); setCatFilter("ALL"); setPriFilter("ALL"); setProjFilter("ALL"); }} 
                  className="px-4 h-8 rounded border border-white/10 hover:bg-white/5 text-[9.5px] text-[#009DFF] uppercase font-bold transition-all cursor-pointer"
                >
                  Reset Parameters
                </button>
              </div>
            ) : (
              filtered.map(t => {
                const isSelected = t.id === selectedTicketId;
                const proj = previewProjects.find(p => p.id === t.projectId);
                return (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)} 
                    className={`relative cursor-pointer rounded-xl border transition-all duration-300 p-4 select-none ${
                      isSelected 
                        ? "border-[#009DFF]/40 bg-[#009DFF]/5 shadow-[0_0_15px_rgba(0,157,255,0.06)]" 
                        : "border-white/5 bg-[#050505]/40 hover:border-white/15 hover:bg-black/50"
                    }`}
                  >
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#009DFF] rounded-l-xl" />}
                    
                    <div className="space-y-2 font-mono text-left">
                      <div className="flex justify-between items-center text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded border font-bold text-[8px] uppercase tracking-wider ${getPriorityStyle(t.priority)}`}>
                            {t.priority}
                          </span>
                          <span className="text-white/40 font-bold">{t.id}</span>
                        </div>
                        <StatusBadge state={t.status === "open" ? "active" : t.status === "in_progress" ? "warning" : "stable"} label={t.status} />
                      </div>
                      
                      <h4 className="text-[12px] font-bold text-white leading-normal tracking-tight group-hover:text-[#009DFF] transition-all">
                        {t.title}
                      </h4>
                      
                      <div className="flex items-center gap-3 text-[9.5px] text-white/40 pt-2 border-t border-white/[0.04]">
                        <span className="flex items-center gap-1.5">
                          {getCatIcon(t.category)}
                          <span className="uppercase text-[8.5px] tracking-wider font-semibold">{t.category}</span>
                        </span>
                        {proj && (
                          <span className="text-[#00FFC2] bg-[#00FFC2]/5 border border-[#00FFC2]/10 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider">
                            Proj: {proj.tag}
                          </span>
                        )}
                        <span className="text-white/20 ml-auto text-[8.5px]">{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Diagnostic Accordion Protocols */}
          <WorkspaceCard className="p-4 rounded-xl border border-white/5 bg-[#050505]/30 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Terminal className="w-4.5 h-4.5 text-[#009DFF]" />
              <div className="text-left font-mono">
                <h3 className="text-[11.5px] font-extrabold text-white uppercase tracking-wider">Diagnostic Protocols</h3>
                <p className="text-[9px] text-white/40 mt-0.5 uppercase tracking-tight">Automated diagnostics inside localized sandbox contexts.</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: "PROTOCOL-ALPHA",
                  title: "HSM KEY RE-ATTESTATION",
                  desc: "Forces key validation request to prove isolated memory attestation inside the SGX page cache without exposing core state.",
                  btn: "Verify Handshake"
                },
                {
                  id: "PROTOCOL-BETA",
                  title: "SGX EPC CACHE COMPACTION",
                  desc: "Compacts thread load fragmentation inside the EPC memory buffer to resolve delayed HSM key rotational delays.",
                  btn: "Compact Cache"
                },
                {
                  id: "PROTOCOL-GAMMA",
                  title: "NIST RMF COMPLIANCE ROLLOVER",
                  desc: "Rotates administrative credentials inside secure hardware memory and re-evaluates logging structures.",
                  btn: "Rotate HSM Credentials"
                }
              ].map((p, idx) => {
                const isOpen = activeAccordion === idx;
                const isThisRunning = protocolRunning === idx;
                return (
                  <div key={idx} className="border border-white/5 bg-black/20 rounded-lg overflow-hidden transition-all duration-200">
                    <button 
                      type="button"
                      onClick={() => setActiveAccordion(isOpen ? null : idx)} 
                      className="w-full flex items-center justify-between p-3 text-[10px] font-mono font-bold text-left hover:bg-white/[0.02] cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#009DFF] animate-pulse" />
                        <span>{p.id}: {p.title}</span>
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="p-3 border-t border-white/5 bg-black/30 space-y-3 font-mono text-[9.5px]">
                        <p className="text-white/50 leading-relaxed text-left select-text">{p.desc}</p>
                        
                        <div className="flex flex-col space-y-2">
                          <button 
                            disabled={protocolRunning !== null} 
                            type="button"
                            onClick={() => runDiagnostic(idx)} 
                            className="w-full h-8 px-3 rounded bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] disabled:opacity-30 text-white font-mono font-bold uppercase tracking-wider text-[8.5px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {isThisRunning ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-[#009DFF]" />
                                <span>Executing Cryptographic Chain...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-[#00FFC2]" />
                                <span>{p.btn}</span>
                              </>
                            )}
                          </button>

                          {/* Terminal Output */}
                          {(isThisRunning || protocolLogs.length > 0 && activeAccordion === idx) && (
                            <div className="p-2.5 rounded bg-black/80 border border-white/5 font-mono text-[8.5px] text-left leading-normal space-y-1 select-text">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1 text-white/30">
                                <span className="flex items-center gap-1 uppercase tracking-widest"><Terminal className="w-2.5 h-2.5" /> Terminal Logs</span>
                                {isThisRunning && <span className="text-[#00FFC2] animate-pulse uppercase text-[8px] font-bold">ONLINE</span>}
                              </div>
                              <div className="max-h-[100px] overflow-y-auto space-y-1">
                                {protocolLogs.map((log, lIdx) => {
                                  const isOk = log.includes("[OK]") || log.includes("[SUCCESS]");
                                  return (
                                    <div key={lIdx} className={isOk ? "text-emerald-400" : log.includes("[WARNING]") ? "text-amber-400" : "text-white/60"}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </WorkspaceCard>

        </div>
        <div id="support-right-detail-block" className={`xl:sticky xl:top-6 transition-all duration-300 ${selectedTicketId ? "block xl:col-span-7" : "block xl:col-span-5"}`}>
          {activeTicket ? (
            /* Secure Active Chat corridor */
            <div className="rounded-xl border border-white/10 bg-[#050505]/50 backdrop-blur-md overflow-hidden flex flex-col h-[670px] font-mono text-left shadow-2xl relative">
              
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(0,157,255,0.03),transparent)] pointer-events-none" />

              <div className="p-4 border-b border-white/5 bg-black/30 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button 
                      onClick={() => setSelectedTicketId(null)} 
                      className="p-1.5 rounded hover:bg-white/5 border border-white/5 mr-1 text-white/40 hover:text-white transition-all flex xl:hidden cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] text-[#009DFF] bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                      <Lock className="w-2.5 h-2.5" />
                      SECURE WIRE
                    </span>
                    <span className="text-[9px] text-white/40 font-bold select-text">{activeTicket.id}</span>
                  </div>
                  <h3 className="text-[12.5px] font-bold text-white uppercase mt-1.5 leading-snug tracking-tight select-text">{activeTicket.title}</h3>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer"><X className="w-4.5 h-4.5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2.5 text-[9px]">
                  <div className="p-2.5 rounded-lg border border-white/5 bg-black/40">
                    <span className="text-white/30 font-bold block uppercase text-[8px] tracking-wider select-none">Enclave Attestation</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mt-1.5 select-none">
                      <Lock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Intel SGX Signed Enclave</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/5 bg-black/40">
                    <span className="text-white/30 font-bold block uppercase text-[8px] tracking-wider select-none">SLA Response Guarantee</span>
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mt-1.5 select-none">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{activeTicket.priority === "critical" ? "P1 Response (<15m)" : "P2 Response (<1h)"}</span>
                    </div>
                  </div>
                </div>

                {/* Exception trace log block */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[8px] font-bold tracking-wider text-white/30 block uppercase select-none">Diagnostics Trace Dump</span>
                  <div className="p-3.5 rounded-lg border border-white/5 bg-black/60 text-[10.5px] text-white/80 leading-relaxed max-h-[120px] overflow-y-auto select-text">
                    <div className="flex items-center gap-1.5 text-[#009DFF] border-b border-white/5 pb-1.5 mb-2 select-none">
                      <Terminal className="w-3.5 h-3.5" />
                      <span className="font-bold tracking-wider uppercase text-[8.5px]">LOCAL EXCEPTION TRACE DUMP</span>
                    </div>
                    <pre className="font-mono text-left leading-relaxed break-all whitespace-pre-wrap">{activeTicket.desc}</pre>
                  </div>
                </div>

                {/* Handshake conversation logs */}
                <div className="space-y-3 pt-1 text-left">
                  <span className="text-[8px] font-bold tracking-wider text-white/30 block uppercase select-none">Secure Handshake Logs</span>
                  <div className="space-y-3">
                    
                    <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] text-[10.5px] space-y-1.5 max-w-[90%]">
                      <div className="flex items-center gap-1.5 text-[#00FFC2] font-mono text-[9px] font-bold select-none">
                        <Server className="w-3.5 h-3.5" />
                        <span>SYSTEM PORTAL GATEWAY</span>
                      </div>
                      <p className="text-white/70 leading-relaxed select-text font-mono">
                        Secure handshake verified at epoch {new Date(activeTicket.createdAt).getTime()}. Handshake payload isolated within active memory guardrails.
                      </p>
                    </div>

                    {activeTicket.replies?.map((r, i) => {
                      const isClient = r.sender.includes("Client") || r.sender.includes("Mercer");
                      return (
                        <div 
                          key={i} 
                          className={`p-3 rounded-xl border text-[10.5px] space-y-1.5 max-w-[90%] transition-all ${
                            isClient 
                              ? "border-[#009DFF]/20 bg-[#009DFF]/5 ml-auto text-right shadow-[0_0_12px_rgba(0,157,255,0.03)]" 
                              : "border-emerald-500/15 bg-emerald-500/[0.02]"
                          }`}
                        >
                          <div className={`flex items-center gap-1.5 font-mono text-[9px] font-bold select-none ${isClient ? "justify-end text-[#009DFF]" : "text-emerald-400"}`}>
                            {!isClient && <Cpu className="w-3.5 h-3.5 text-emerald-400" />}
                            <span>{r.sender.toUpperCase()}</span>
                          </div>
                          <p className="text-white/85 leading-relaxed select-text font-mono">{r.text}</p>
                          <span className="text-[8px] text-white/30 block text-right select-none">{new Date(r.timestamp).toLocaleTimeString()}</span>
                        </div>
                      );
                    })}

                    {isReplying && (
                      <div className="p-3 rounded-lg border border-white/5 text-[10px] text-white/30 flex items-center gap-2 animate-pulse max-w-[80%] select-none font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>On-call systems engineer decoding secure telemetry stream...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              </div>

              {/* Chat Input block */}
              <div className="p-3 border-t border-white/5 bg-black/40">
                <form onSubmit={handleSendReply} className="relative">
                  <textarea
                    required
                    disabled={isReplying}
                    placeholder="Type secured diagnostics reply and press Enter..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendReply(e); } }}
                    className="w-full h-15 rounded-lg border border-white/10 bg-black/60 pl-3.5 pr-12 py-3 text-white text-[11px] outline-none resize-none leading-relaxed focus:border-[#009DFF]/30 transition-all font-mono"
                  />
                  <button 
                    type="submit" 
                    disabled={!replyText.trim() || isReplying} 
                    className="absolute right-2.5 bottom-3.5 p-2 rounded-md bg-white text-black hover:bg-white/95 disabled:opacity-25 disabled:bg-white cursor-pointer transition-all flex items-center justify-center shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Tabbed Selector when no ticket is active */
            <div className="rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm overflow-hidden font-mono text-left shadow-2xl flex flex-col min-h-[580px]">
              
              {/* Tab Selector Headings */}
              <div className="flex border-b border-white/5 bg-black/20 select-none">
                <button 
                  onClick={() => { setRightTab("intake"); setSelectedSvgNode("shield"); }} 
                  className={`flex-1 py-3 text-center font-mono text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-all border-b-2 ${
                    rightTab === "intake" ? "border-[#009DFF] text-white bg-white/[0.01]" : "border-transparent text-white/40"
                  }`}
                >
                  Secured Intake Wire
                </button>
                <button 
                  onClick={() => setRightTab("topology")} 
                  className={`flex-1 py-3 text-center font-mono text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-all border-b-2 ${
                    rightTab === "topology" ? "border-[#00FFC2] text-white bg-white/[0.01]" : "border-transparent text-white/40"
                  }`}
                >
                  Tunnel Security Gateway
                </button>
              </div>

              {/* TAB 1: INTAKE FORM */}
              {rightTab === "intake" && (
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {isSubmittingForm ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <RefreshCw className="w-10 h-10 text-[#009DFF] animate-spin" />
                      <div className="space-y-1.5 font-mono">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">CREATING SECURE HANDSHAKE...</h4>
                        <p className="text-[9.5px] text-white/40">Deploying Intel SGX Isolated Tunnel</p>
                      </div>

                      <div className="w-full max-w-sm p-3 bg-black/80 rounded border border-white/5 text-[9px] text-left leading-normal font-mono space-y-1 text-emerald-400 select-text">
                        {submittingLogs.map((log, idx) => (
                          <div key={idx}>&gt; {log}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3 select-none">
                          <MessageSquare className="w-4 h-4 text-[#009DFF]" />
                          <div>
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Initialize Support Wire</h3>
                            <p className="text-[9px] text-white/40 mt-0.5 uppercase tracking-tight">Route real-time diagnostics securely to GFF systems triage.</p>
                          </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-3.5 text-[10px]">
                          <div className="space-y-1.5">
                            <label className="text-white/45 uppercase tracking-wider font-extrabold block">Summary Subject</label>
                            <input
                              required
                              placeholder="Briefly describe system issue..."
                              value={subject}
                              onChange={e => setSubject(e.target.value)}
                              className="w-full h-10 rounded-lg border border-white/10 bg-black/50 px-3.5 text-white text-[11px] outline-none focus:border-[#009DFF]/35 transition-all font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-white/45 uppercase tracking-wider font-extrabold block">Category</label>
                              <div className="relative">
                                <select
                                  value={category}
                                  onChange={e => setCategory(e.target.value as any)}
                                  className="w-full h-9 rounded-lg border border-white/10 bg-black/50 px-2.5 text-white outline-none cursor-pointer text-[10px] transition-all font-mono appearance-none hover:bg-black/70 focus:border-[#009DFF]/35"
                                >
                                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#050505] text-white font-mono">{c.toUpperCase()}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-3 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-white/45 uppercase tracking-wider font-extrabold block">Priority SLA</label>
                              <div className="relative">
                                <select
                                  value={priority}
                                  onChange={e => setPriority(e.target.value as any)}
                                  className="w-full h-9 rounded-lg border border-white/10 bg-black/50 px-2.5 text-white outline-none cursor-pointer font-bold text-[10px] transition-all font-mono appearance-none hover:bg-black/70 focus:border-[#009DFF]/35"
                                >
                                  <option value="critical" className="bg-[#050505] text-red-400 font-mono">CRITICAL (15m response)</option>
                                  <option value="high" className="bg-[#050505] text-amber-400 font-mono">HIGH (1h response)</option>
                                  <option value="medium" className="bg-[#050505] text-blue-400 font-mono">MEDIUM (4h response)</option>
                                  <option value="low" className="bg-[#050505] text-white/50 font-mono">LOW (12h response)</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-3 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-white/45 uppercase tracking-wider font-extrabold block">Linked Sandbox Project</label>
                            <div className="relative">
                              <select
                                value={project}
                                onChange={e => setProject(e.target.value)}
                                className="w-full h-9 rounded-lg border border-white/10 bg-black/50 px-2.5 text-white outline-none cursor-pointer text-[10px] transition-all font-mono appearance-none hover:bg-black/70 focus:border-[#009DFF]/35"
                              >
                                <option value="none" className="bg-[#050505] text-white/45">NO ATTACHED ARCHITECTURE (GENERAL SUPPORT)</option>
                                {previewProjects.map(p => <option key={p.id} value={p.id} className="bg-[#050505] text-white font-mono">{p.name.toUpperCase()} ({p.tag})</option>)}
                              </select>
                              <ChevronDown className="absolute right-2 top-3 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-white/45 uppercase tracking-wider font-extrabold block font-mono">Telemetry logs / Diagnostics report</label>
                            <textarea
                              required
                              placeholder="Provide crash logs, node configurations, replication delays, CPU telemetry or specific sandbox anomalies..."
                              value={desc}
                              onChange={e => setDesc(e.target.value)}
                              className="w-full h-24 rounded-lg border border-white/10 bg-black/50 p-3 text-white text-[11px] outline-none resize-none leading-relaxed transition-all focus:border-[#009DFF]/35 font-mono"
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="w-full h-10 rounded-lg bg-white hover:bg-white/90 text-black font-extrabold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 select-none text-[10.5px] font-sans tracking-wider"
                          >
                            <Lock className="w-4 h-4 text-black" />
                            <span>Establish Sovereign Support Wire</span>
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: SOVEREIGN TOPOLOGY GRAPH */}
              {rightTab === "topology" && (
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-[9.5px]">
                  <div className="space-y-0.5 select-none border-b border-white/5 pb-1.5 text-left font-mono">
                    <h3 className="text-[11.5px] font-bold text-white uppercase flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#00FFC2]" />Zero-Trust Topology</h3>
                    <p className="text-white/40 uppercase tracking-tight text-[8px]">Click any node to audit cryptographic enclave telemetry.</p>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl p-2.5 min-h-[160px]">
                    <svg viewBox="0 0 400 180" className="w-full max-h-[160px] text-white">
                      <path d="M 80 90 L 200 90 L 320 90" stroke="rgba(0,255,194,0.15)" strokeWidth="1.5" strokeDasharray="4 6" className="animate-dash" fill="none" />
                      <g className="cursor-pointer" onClick={() => setSelectedSvgNode("client")}>
                        <circle cx="80" cy="90" r="22" fill="#050505" stroke={selectedSvgNode === "client" ? "#009DFF" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" />
                        <circle cx="80" cy="90" r="26" fill="none" stroke="#009DFF" strokeWidth="0.5" strokeDasharray="2 3" className="animate-spin" style={{ transformOrigin: "80px 90px", animationDuration: "10s" }} />
                        <foreignObject x="72" y="82" width="16" height="16"><Terminal className="w-4 h-4 text-[#009DFF]" /></foreignObject>
                        <text x="80" y="132" textAnchor="middle" className="text-[8px] font-bold font-mono fill-white/50 tracking-wider">CLIENT</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setSelectedSvgNode("shield")}>
                        <circle cx="200" cy="90" r="24" fill="#050505" stroke={selectedSvgNode === "shield" ? "#00FFC2" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" />
                        <circle cx="200" cy="90" r="29" fill="none" stroke="#00FFC2" strokeWidth="0.5" strokeDasharray="3 2" className="animate-spin" style={{ transformOrigin: "200px 90px", animationDuration: "14s" }} />
                        <foreignObject x="192" y="82" width="16" height="16"><Shield className="w-4 h-4 text-[#00FFC2]" /></foreignObject>
                        <text x="200" y="132" textAnchor="middle" className="text-[8px] font-bold font-mono fill-white/50 tracking-wider">SHIELD</text>
                      </g>
                      <g className="cursor-pointer" onClick={() => setSelectedSvgNode("sentinel")}>
                        <circle cx="320" cy="90" r="22" fill="#050505" stroke={selectedSvgNode === "sentinel" ? "#10b981" : "rgba(255,255,255,0.08)"} strokeWidth="1.5" />
                        <circle cx="320" cy="90" r="26" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: "320px 90px", animationDuration: "12s" }} />
                        <foreignObject x="312" y="82" width="16" height="16"><Cpu className="w-4 h-4 text-[#10b981]" /></foreignObject>
                        <text x="320" y="132" textAnchor="middle" className="text-[8px] font-bold font-mono fill-white/50 tracking-wider">SENTINEL</text>
                      </g>
                    </svg>
                  </div>

                  <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-left font-mono">
                    {selectedSvgNode === "client" ? (
                      <div className="space-y-1">
                        <span className="text-white/30 block uppercase font-bold text-[7.5px]">CLIENT TERMINAL ALPHA</span>
                        <p className="text-white/85"><span className="text-white/40">Operator:</span> Alexander Mercer • <span className="text-white/40">VPN:</span> 10.144.12.89 • <span className="text-emerald-400 font-bold">SGX Certified</span></p>
                      </div>
                    ) : selectedSvgNode === "shield" ? (
                      <div className="space-y-1">
                        <span className="text-white/30 block uppercase font-bold text-[7.5px]">GFF DEEP SHIELD PROXY</span>
                        <p className="text-white/85"><span className="text-white/40">Standard:</span> NIST Compliant • <span className="text-white/40">Seals:</span> AES-256-GCM • <span className="text-[#00FFC2] font-bold">Isolated Memory</span></p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-white/30 block uppercase font-bold text-[7.5px]">SENTINEL TRIAGE CORE</span>
                        <p className="text-white/85"><span className="text-white/40">Architect:</span> Dr. Sarah Vance • <span className="text-white/40">SLA:</span> Response &lt;15m • <span className="text-emerald-400 font-bold">Sentinel Active</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 p-4 rounded-xl border border-emerald-500/25 bg-[#050505]/95 backdrop-blur-md text-white font-mono text-[10.5px] shadow-[0_0_25px_rgba(16,185,129,0.2)] flex items-center gap-2.5 z-50 animate-bounce select-none">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
