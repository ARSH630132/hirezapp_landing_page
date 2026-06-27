"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldAlert, Lock, RefreshCw, Key, Sparkles, 
  Shield, ArrowRight, ChevronRight, Check, Terminal, 
  X, AlertTriangle, Fingerprint, HelpCircle, Network
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getPreviewSession, setPreviewSession, canAccessPortalSection, 
  canAccessAdminSection, PreviewSession, PreviewRole
} from "@/lib/preview-auth";

// Comprehensive metadata for premium role presentation
interface RoleMeta {
  role: PreviewRole;
  title: string;
  clearance: string;
  desc: string;
  badgeClass: string;
  glowColor: string;
}

const ROLE_METADATA: Record<PreviewRole, RoleMeta> = {
  client_admin: {
    role: "client_admin",
    title: "Client Administrator",
    clearance: "L3 CLEARANCE",
    desc: "Autonomous management of client nodes, project workspaces, and billing configurations.",
    badgeClass: "text-sky-400 bg-sky-500/5 border-sky-500/10",
    glowColor: "rgba(14, 165, 233, 0.15)",
  },
  client_member: {
    role: "client_member",
    title: "Client Workspace Operator",
    clearance: "L2 CLEARANCE",
    desc: "Operation of telemetry streams, sandbox modules, and active project dashboard views.",
    badgeClass: "text-teal-400 bg-teal-500/5 border-teal-500/10",
    glowColor: "rgba(20, 184, 166, 0.15)",
  },
  gff_admin: {
    role: "gff_admin",
    title: "GFF Sovereign Superuser",
    clearance: "L5 SYSTEM CLEARANCE",
    desc: "Total decentralized system override. Unfettered traversal of both client and admin enclaves.",
    badgeClass: "text-purple-400 bg-purple-500/5 border-purple-500/10",
    glowColor: "rgba(168, 85, 247, 0.15)",
  },
  gff_operator: {
    role: "gff_operator",
    title: "GFF Systems Engineer",
    clearance: "L4 OPERATIONAL CLEARANCE",
    desc: "Monitors running infrastructure nodes, core agent model trainers, and system mesh graphs.",
    badgeClass: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
    glowColor: "rgba(99, 102, 241, 0.15)",
  },
  finance_admin: {
    role: "finance_admin",
    title: "GFF Financial Director",
    clearance: "L3 FINANCIAL CLEARANCE",
    desc: "Access to financial ledgers, subscription tiers, pricing matrices, and corporate client accounts.",
    badgeClass: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  support_agent: {
    role: "support_agent",
    title: "GFF Support Liaison",
    clearance: "L3 SUPPORT CLEARANCE",
    desc: "Maintains active support pipelines, client user accounts, and telemetry diagnostics logs.",
    badgeClass: "text-amber-400 bg-amber-500/5 border-amber-500/10",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
  viewer: {
    role: "viewer",
    title: "Global Compliance Auditor",
    clearance: "L1 COMPLIANCE CLEARANCE",
    desc: "Read-only access to verify security postures, sovereign telemetry streams, and transaction logs.",
    badgeClass: "text-zinc-400 bg-zinc-500/5 border-zinc-500/10",
    glowColor: "rgba(113, 113, 122, 0.15)",
  },
};

const ALL_ROLES: PreviewRole[] = [
  "client_admin",
  "client_member",
  "gff_admin",
  "gff_operator",
  "finance_admin",
  "support_agent",
  "viewer"
];

const CLEARANCE_TIERS = [
  { level: "LEVEL V", name: "FEDERATED OVERLORD", roles: ["gff_admin"], badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { level: "LEVEL IV", name: "SYSTEMS ENGINEER", roles: ["gff_operator"], badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { level: "LEVEL III", name: "WORKSPACE ADMIN", roles: ["client_admin", "finance_admin", "support_agent"], badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { level: "LEVEL II", name: "WORKSPACE OPERATOR", roles: ["client_member"], badge: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  { level: "LEVEL I", name: "AUDIT ACCESS", roles: ["viewer"], badge: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
];

export function PreviewRouteGuard({ children, type }: { children: React.ReactNode; type: "portal" | "admin" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<PreviewSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeSec, setActiveSec] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [negotiating, setNegotiating] = useState<PreviewRole | null>(null);
  const [dismissBanner, setDismissBanner] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // Sync session and access rules
  useEffect(() => {
    if (!mounted) return;
    const verify = () => {
      const s = getPreviewSession();
      setSession(s);
      const sec = pathname.split("/")[2] || "dashboard";
      setActiveSec(sec);
      setHasAccess(type === "portal" ? canAccessPortalSection(s?.role || "viewer", sec) : canAccessAdminSection(s?.role || "viewer", sec));
      setLoading(false);
    };
    verify();
    window.addEventListener("gff_preview_session_changed", verify);
    return () => window.removeEventListener("gff_preview_session_changed", verify);
  }, [pathname, type, mounted]);

  // Terminal logging logic for live security console simulation
  useEffect(() => {
    if (!mounted) return;
    const defaultLogs = [
      `[SYS_SEC] INITIALIZING SECURE TUNNEL PROTOCOL...`,
      `[SYS_SEC] ZONE: /${type.toUpperCase()}/${activeSec.toUpperCase()}`,
      session 
        ? `[SYS_SEC] IDENT_FOUND: Simulated role holds ${session.clearance}`
        : `[SYS_SEC] WARNING: CLIENT_TOKEN_NOT_FOUND (DECOUPLED)`,
      session && !hasAccess
        ? `[SYS_SEC] ENFORCE BLOCK: INSUFFICIENT_CLEARANCE_EXCEPTION`
        : `[SYS_SEC] STANDBY: Awaiting credential matrix verification...`
    ];
    setTerminalLogs(defaultLogs);

    // Dynamic low-noise polling telemetry logs
    const interval = setInterval(() => {
      if (negotiating) return; // let negotiating logs stay in focus
      const phrases = [
        `[KEY_ROT] Rotating CRYSTALS-Dilithium cryptographic headers...`,
        `[ZKP_VAL] Verification session polling active... [STABLE]`,
        `[SYS_SEC] Handshake buffer check: 0x7FFA${Math.floor(Math.random() * 9000 + 1000)}B90C`,
        `[FIREWALL] Ingress inspection running on decentralized network boundary...`,
        `[AUDIT] Sovereign consensus ledger block committed to cluster.`
      ];
      setTerminalLogs(prev => [...prev.slice(-5), phrases[Math.floor(Math.random() * phrases.length)]]);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSec, type, session, hasAccess, mounted, negotiating]);

  // Handle live negotiating state logging
  useEffect(() => {
    if (!negotiating) return;
    const meta = ROLE_METADATA[negotiating];
    
    const timer1 = setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[KEY_NEG] Requesting cryptographic validation for role: ${negotiating.toUpperCase()}`,
        `[ZKP_VAL] Issuing Zero-Knowledge Challenge to authenticator node... [OK]`
      ]);
    }, 150);

    const timer2 = setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[SYS_SEC] BOUNDARY TRAVERSAL AUTHORIZED. Token reissued.`,
        `[ROUTING] Stack relocation committed. Rebuilding page frame...`
      ]);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [negotiating]);

  // Automatic redirect to standard login if no session is set up
  useEffect(() => {
    if (!mounted || loading || session || negotiating) return;
    const interval = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) { 
          clearInterval(interval); 
          router.push(type === "admin" ? "/admin/login" : "/portal/login"); 
          return 0; 
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session, loading, mounted, router, negotiating, type]);

  // Intelligent bypass helper: holds the user on the same path if the new role is authorized!
  const handleBypass = (role: PreviewRole) => {
    setNegotiating(role);
    setTimeout(() => {
      setPreviewSession(role);
      setNegotiating(null);
      
      const segments = pathname.split("/");
      const sec = segments[2] || "dashboard";
      const allowed = type === "portal" ? canAccessPortalSection(role, sec) : canAccessAdminSection(role, sec);
      
      if (allowed) {
        // Refresh or traverse cleanly to the exact page they requested
        router.push(pathname);
      } else {
        // Fall back to dashboard of the respective section
        router.push(role.startsWith("client_") ? "/portal/dashboard" : "/admin/dashboard");
      }
    }, 1000);
  };

  // Helper to dynamically calculate which roles are authorized for the blocked section
  const getAuthorizedRoles = (): PreviewRole[] => {
    return ALL_ROLES.filter(role => 
      type === "portal" 
        ? canAccessPortalSection(role, activeSec) 
        : canAccessAdminSection(role, activeSec)
    );
  };

  if (!mounted) return <div className="min-h-screen bg-[#030303]" />;

  // Verify loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
        <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin mx-auto mb-3" />
        <p className="text-[10px] uppercase tracking-widest text-white/40">Securing Local Decoupled Enclave...</p>
      </div>
    );
  }

  // SCREEN 1: Enclave Session Expired / Authentication Required (Split-Panel Layout)
  if (!session) {
    const pct = (countdown / 5) * 100;
    const simProfiles: PreviewRole[] = ["client_admin", "gff_admin", "gff_operator", "client_member"];

    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#030303] text-white font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        
        {/* Left Side: Dynamic Architecture Visualization & Live Log terminal (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 border-r border-white/5 bg-[#050505]/60 flex-col justify-between p-10 font-mono">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-widest font-bold">
              <Network className="w-3.5 h-3.5 text-cyan-500" />
              <span>GFF Security Architecture Node</span>
            </div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Zero-Knowledge Trust Enclave</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              To support decoupled localized testing, GFF AI utilizes client-side zero-knowledge session assertions. All data remains federated and isolated.
            </p>
          </div>

          {/* SVG Connection Network map */}
          <div className="my-8 flex items-center justify-center">
            <svg className="w-full max-w-[280px] h-48" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="diag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                <style>
                  {`
                    @keyframes pathFlow {
                      from { stroke-dashoffset: 28; }
                      to { stroke-dashoffset: 0; }
                    }
                    .anim-flow {
                      stroke-dasharray: 8, 20;
                      animation: pathFlow 3s linear infinite;
                    }
                  `}
                </style>
              </defs>
              <rect width="100%" height="100%" fill="url(#diag-grid)" />
              
              <path d="M 70 150 L 200 150" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="5,5" />
              <path d="M 200 150 L 330 80" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
              <path d="M 200 150 L 330 220" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
              
              {/* Pulsating flows */}
              <line x1="70" y1="150" x2="200" y2="150" stroke="#06b6d4" strokeWidth="2" className="anim-flow" />
              
              {/* Node 1: Client Gateway */}
              <g>
                <circle cx="70" cy="150" r="16" fill="#030303" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <circle cx="70" cy="150" r="24" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" className="animate-ping" style={{ animationDuration: '4s' }} />
                <circle cx="70" cy="150" r="4" fill="#06b6d4" />
                <text x="70" y="184" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace" fontWeight="bold">GATEWAY</text>
              </g>

              {/* Node 2: Crypto Decryption Enclave (Locked state) */}
              <g>
                <rect x="176" y="126" width="48" height="48" rx="8" fill="#050505" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" />
                <rect x="176" y="126" width="48" height="48" rx="8" fill="none" stroke="rgba(239, 68, 68, 0.05)" strokeWidth="4" className="animate-pulse" />
                <path d="M 194 153 L 206 153 M 197 153 L 197 146 C 197 142.7 199.7 141 200 141 C 200.3 141 203 142.7 203 146 L 203 153" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="194" y="149" width="12" height="9" rx="1.5" fill="#ef4444" />
                <text x="200" y="191" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">DECOUPLED</text>
              </g>

              {/* Node 3: Target Portal */}
              <g className="opacity-35">
                <circle cx="330" cy="80" r="12" fill="#030303" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
                <circle cx="330" cy="80" r="3" fill="rgba(255,255,255,0.3)" />
                <text x="330" y="104" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">PORTAL</text>
              </g>

              {/* Node 4: Target Admin */}
              <g className="opacity-35">
                <circle cx="330" cy="220" r="12" fill="#030303" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
                <circle cx="330" cy="220" r="3" fill="rgba(255,255,255,0.3)" />
                <text x="330" y="244" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">ADMIN</text>
              </g>
            </svg>
          </div>

          {/* Telemetry log terminal */}
          <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-zinc-500 space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between text-[8px] text-zinc-400 border-b border-white/5 pb-1.5 mb-2 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                SECURE TELEMETRY BUFFER
              </span>
              <span>UTC LOGS</span>
            </div>
            <div className="space-y-1 select-text h-[70px] overflow-hidden flex flex-col justify-end" aria-live="polite">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={log.includes("WARNING") ? "text-red-400 font-bold" : log.includes("AUTHORIZED") ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Identity Controls and Simulator Bypass (Interactive form) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center p-6 md:p-12 lg:p-16 max-w-2xl mx-auto w-full">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[8px] tracking-widest font-bold uppercase px-2.5 py-1 rounded bg-zinc-900 border border-white/5 text-zinc-400 select-none">
                ENCLAVE DISCOVERY GATEWAY
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
                Identity Decoupled
              </h1>
              <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed font-sans max-w-md">
                No simulated preview session is currently associated with your browser client. To access the interactive sandbox of GFF AI, authorize your token.
              </p>
            </div>

            {/* Countdown redirect bar */}
            <div className="space-y-1.5 bg-zinc-950/40 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-wider">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-red-500 animate-spin" />
                  STANDBY: REDIRECTING TO IDENTITY GATEWAY
                </span>
                <span className="font-bold">{countdown}S</span>
              </div>
              <div className="h-1 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500/80 transition-all duration-1000 ease-linear" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => router.push(type === "admin" ? "/admin/login" : "/portal/login")}
                  className="w-full h-10 rounded-lg bg-white hover:bg-zinc-200 text-black text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Authenticate Manually</span>
                </button>
              </div>
            </div>

            {/* Simulated Workspace Quick Launch Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                  Quick-Authenticate Sandbox Simulation
                </span>
                <span className="text-[8px] font-mono text-cyan-400/60 font-semibold select-none">
                  DEVELOPER BYPASS
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Skip full credential checks and force-bind a mock clearance identity to instantly traverse this portal sector:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {simProfiles.map((roleId) => {
                  const meta = ROLE_METADATA[roleId];
                  const isNegotiating = negotiating === roleId;

                  return (
                    <button
                      key={roleId}
                      onClick={() => handleBypass(roleId)}
                      disabled={negotiating !== null}
                      className="text-left p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer hover:border-white/15 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-500 disabled:opacity-40"
                      style={{
                        boxShadow: isNegotiating ? `0 0 24px ${meta.glowColor}` : "none",
                      }}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className={`text-[7.5px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded border uppercase ${meta.badgeClass}`}>
                            {meta.clearance}
                          </span>
                          {isNegotiating ? (
                            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                          ) : (
                            <Key className="w-3 h-3 text-white/20 group-hover:text-white/55 transition-colors" />
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-white tracking-wide">{meta.title}</h3>
                        <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2">{meta.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/40 group-hover:text-white/85 transition-all pt-2.5 border-t border-white/[0.03]">
                        {isNegotiating ? (
                          <span className="text-cyan-400 animate-pulse">NEGOTIATING HANDSHAKE...</span>
                        ) : (
                          <>
                            <span>FORCE DEPLOY SIMULATION</span>
                            <ArrowRight className="w-2.5 h-2.5 transform group-hover:translate-x-1 transition-transform text-white/40 group-hover:text-cyan-400" />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: Clearance Insufficient / Restricted Boundary (Split-Panel Layout)
  if (!hasAccess) {
    const authorizedRoles = getAuthorizedRoles();

    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#030303] text-white font-sans antialiased selection:bg-red-500/20 selection:text-red-300">
        
        {/* Left Side: Real-time interactive access matrix visual timeline & logs (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 border-r border-white/5 bg-[#050505]/60 flex-col justify-between p-10 font-mono">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-widest font-bold">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>GFF Cryptographic Firewall</span>
            </div>
            
            {/* Visual Timeline of Clearance levels */}
            <div className="space-y-4">
              <div className="text-zinc-400 text-xs font-mono font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-400" />
                Active Access Matrix
              </div>
              
              <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {CLEARANCE_TIERS.map((tier) => {
                  const isCurrent = tier.roles.includes(session.role);
                  const isRouteAllowed = tier.roles.some(r => 
                    type === "portal" 
                      ? canAccessPortalSection(r as PreviewRole, activeSec) 
                      : canAccessAdminSection(r as PreviewRole, activeSec)
                  );

                  return (
                    <div key={tier.level} className={`flex gap-4 relative transition-all duration-300 ${isCurrent ? "scale-[1.01] translate-x-0.5" : ""}`}>
                      <div className="relative z-10 flex items-center justify-center">
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                          </div>
                        ) : isRouteAllowed ? (
                          <div className="w-6 h-6 rounded-full bg-zinc-900 border border-emerald-500/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                          </div>
                        )}
                      </div>

                      <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? "bg-red-500/[0.02] border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.05)]" 
                          : isRouteAllowed 
                            ? "bg-white/[0.01] border-white/10" 
                            : "bg-black/40 border-white/5 opacity-40"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-white/50">{tier.level}</span>
                            <span className="text-[10px] font-bold text-white tracking-wide uppercase">{tier.name}</span>
                          </div>
                          <div>
                            {isCurrent ? (
                              <span className="text-[8px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Active Identity</span>
                            ) : isRouteAllowed ? (
                              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest font-semibold">Allowed</span>
                            ) : (
                              <span className="text-[8px] font-mono text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest font-semibold">Restricted</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-1.5 text-[9.5px] text-zinc-500 leading-normal">
                          Authorized: <span className="text-zinc-400 font-mono">{tier.roles.map(r => ROLE_METADATA[r as PreviewRole]?.title).join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry log terminal */}
          <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-zinc-500 space-y-1.5 shadow-inner mt-6">
            <div className="flex items-center justify-between text-[8px] text-zinc-400 border-b border-white/5 pb-1.5 mb-2 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                SECURE TELEMETRY BUFFER
              </span>
              <span>UTC LOGS</span>
            </div>
            <div className="space-y-1 select-text h-[70px] overflow-hidden flex flex-col justify-end" aria-live="polite">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className={log.includes("WARNING") || log.includes("BLOCK") ? "text-red-400 font-bold" : log.includes("AUTHORIZED") ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Identity swap & fallback triggers (Interactive form) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center p-6 md:p-12 lg:p-16 max-w-2xl mx-auto w-full">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[8px] tracking-widest font-bold uppercase px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 select-none">
                RESTRICTED SEGMENT BOUNDARY
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
                Clearance Insufficient
              </h1>
              <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed font-sans max-w-md">
                Your simulated workspace identity holds <strong className="text-red-400 font-mono text-[10.5px] font-bold uppercase">{session.role.toUpperCase()}</strong> authority. Your token is invalid for network segment <strong className="text-white">/{type}/{activeSec}</strong>.
              </p>
            </div>

            {/* Current token context overview */}
            <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/40 space-y-2.5 font-mono text-[9.5px]">
              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-red-500" />
                Active Sandbox Session Payload
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-black/40 border border-white/5 rounded-lg text-zinc-400">
                <div>
                  <div className="text-[7.5px] text-zinc-600 font-bold">SESSION SIGNATURE</div>
                  <div className="text-white font-bold truncate mt-0.5">{session.name}</div>
                </div>
                <div>
                  <div className="text-[7.5px] text-zinc-600 font-bold">CRYPTO AUTH CLEARANCE</div>
                  <div className="text-red-400 font-bold truncate mt-0.5">{session.clearance}</div>
                </div>
              </div>
            </div>

            {/* Swap & Elevation options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                  Resolve Access Exception
                </span>
                <span className="text-[8px] font-mono text-emerald-400 font-semibold font-bold">
                  AVAILABLE CLEARANCES
                </span>
              </div>
              
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Step back to segment safety, or temporarily elevate your simulated token using one of the authorized profiles for this route segment:
              </p>

              <div className="space-y-2">
                {authorizedRoles.length > 0 ? (
                  authorizedRoles.map((roleId) => {
                    const meta = ROLE_METADATA[roleId];
                    const isNegotiating = negotiating === roleId;

                    return (
                      <button
                        key={roleId}
                        onClick={() => handleBypass(roleId)}
                        disabled={negotiating !== null}
                        className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group flex items-center justify-between cursor-pointer hover:border-white/12 disabled:opacity-45 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-500"
                        style={{
                          boxShadow: isNegotiating ? `0 0 20px ${meta.glowColor}` : "none",
                        }}
                      >
                        <div className="space-y-1 max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <span className={`text-[7px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded border uppercase ${meta.badgeClass}`}>
                              {meta.clearance}
                            </span>
                            <span className="text-xs font-bold text-white tracking-wide">{meta.title}</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-500 leading-normal line-clamp-1">{meta.desc}</p>
                        </div>
                        
                        <div className="h-8 px-3 rounded-lg border border-white/10 group-hover:border-white/20 bg-white/5 text-[9px] font-mono font-bold text-white/60 group-hover:text-white transition-all flex items-center gap-1.5 whitespace-nowrap">
                          {isNegotiating ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                              <span>BONDING...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-cyan-400 group-hover:animate-pulse" />
                              <span>ELEVATE TOKEN</span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl border border-red-500/10 bg-red-950/5 text-center text-[10px] text-red-400 font-mono">
                    No simulation paths permitted for this segment of network infrastructure.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => router.push(type === "portal" ? "/portal/dashboard" : "/admin/dashboard")}
                className="flex-1 h-10 rounded-lg border border-white/10 hover:border-white/20 bg-transparent text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
              >
                <ArrowRight className="w-3.5 h-3.5 transform rotate-180" />
                <span>Return to Workspace Safety</span>
              </button>
              
              <button 
                onClick={() => handleBypass("gff_admin")}
                disabled={negotiating !== null}
                className="flex-1 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/30 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-40"
              >
                {negotiating === "gff_admin" ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Key className="w-3.5 h-3.5" />
                )}
                <span>Override with GFF Sovereign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdminInPortal = type === "portal" && session && session.role.startsWith("gff_");

  return (
    <>
      {/* Sovereign Admin Simulation banner block */}
      {isAdminInPortal && !dismissBanner && (
        <div className="sticky top-0 z-50 bg-[#06151d]/85 border-b border-cyan-500/15 px-4 md:px-6 py-2.5 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-[10px] font-mono text-cyan-200 backdrop-blur-md select-none">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>
              <strong className="text-cyan-100 uppercase tracking-wider">Sovereign Simulation Console:</strong> Active in Client Workspace (L5 clearance).
            </span>
          </div>
          <div className="flex items-center gap-4 justify-between sm:justify-end">
            <button 
              onClick={() => handleBypass("client_admin")}
              disabled={negotiating !== null}
              className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 hover:text-cyan-200 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              {negotiating ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />}
              <span>De-escalate to Client Admin</span>
            </button>
            <button 
              onClick={() => setDismissBanner(true)} 
              className="text-cyan-400/50 hover:text-cyan-200 transition-colors text-[9px] uppercase tracking-wider font-bold cursor-pointer"
            >
              Dismiss [X]
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
