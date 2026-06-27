"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, Shield, Key, CheckCircle, RefreshCw, Layers, Eye, EyeOff, 
  Users, Cpu, FileText, HelpCircle, Fingerprint, ArrowRight, AlertCircle, X, Info, Terminal, Server, Globe, Database, Network
} from "lucide-react";
import { setPreviewSession, PreviewRole, MOCK_PREVIEW_USERS } from "@/lib/preview-auth";
import { motion, AnimatePresence } from "motion/react";

function getDeterministicHash(input: string, length: number = 8): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase();
  return hex.padEnd(length, "F").substring(0, length);
}


export default function SecureLogin({ defaultRole }: { defaultRole?: string }) {
  const router = useRouter();
  
  const [selectedRole, setSelectedRole] = useState<PreviewRole>(
    defaultRole === "Administrator" ? "gff_admin" : "client_admin"
  );
  
  const [authMethod, setAuthMethod] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  const rolesList = [
    { id: "client_admin" as PreviewRole, label: "Client Admin", clearance: "L-3", desc: "Sovereign gateway owner", icon: Users, color: "text-[#009DFF]" },
    { id: "client_member" as PreviewRole, label: "Client Member", clearance: "L-2", desc: "Model operator layer worker", icon: Layers, color: "text-blue-400" },
    { id: "gff_admin" as PreviewRole, label: "GFF Admin", clearance: "L-5", desc: "Root platform superintendent", icon: Shield, color: "text-[#E4000F]" },
    { id: "gff_operator" as PreviewRole, label: "GFF Operator", clearance: "L-4", desc: "Model architecture controller", icon: Cpu, color: "text-purple-400" },
    { id: "finance_admin" as PreviewRole, label: "Finance Admin", clearance: "L-3", desc: "Epoch financial ledger auditor", icon: FileText, color: "text-emerald-400" },
    { id: "support_agent" as PreviewRole, label: "Support Agent", clearance: "L-3", desc: "SLA wire operations specialist", icon: HelpCircle, color: "text-orange-400" },
    { id: "viewer" as PreviewRole, label: "Auditor (Viewer)", clearance: "L-1", desc: "Read-only observer node", icon: Eye, color: "text-zinc-400" },
  ];

  useEffect(() => {
    const mockUser = MOCK_PREVIEW_USERS[selectedRole];
    if (mockUser) {
      setEmail(mockUser.email);
      setPassword("••••••••••••");
      setOtpCode("102486");
      
      const generatedHash = getDeterministicHash(selectedRole, 8);
      const logs = [
        `[INIT] Handshake request received from node terminal.`,
        `[IDENTITY] Resolved profile context: ${mockUser.role.toUpperCase()}`,
        `[SSL/TLS] Session handshake initiated via SHA-256 cipher.`,
        `[SECURITY] Clearance key resolved: ${mockUser.clearance.split(" ")[2] || "L-3"}-${generatedHash}`,
        `[SANDBOX] Memory enclave isolated. Sandbox state: READY.`
      ];
      setTelemetryLogs(logs);
    }
  }, [selectedRole]);

  const handleInputChange = (field: string, val: string) => {
    if (field === "email") {
      setEmail(val);
      if (val.length % 3 === 0) {
        logTelemetry(`[INPUT] Term buffer parsed: ${val.substring(0, 15)}${val.length > 15 ? "..." : ""} (resolving DNS)`);
      }
    } else if (field === "password") {
      setPassword(val);
      if (val.length % 2 === 0) {
        const hashPart = getDeterministicHash(val, 4);
        logTelemetry(`[CRYPT] Salted passphrase vector: SHA-512_SALT_${hashPart}`);
      }
    } else if (field === "otp") {
      setOtpCode(val);
      if (val.length === 6) {
        logTelemetry(`[OTP] Multi-factor authentication block complete. Ready for clearance verification.`);
      }
    }
  };

  const logTelemetry = (msg: string) => {
    setTelemetryLogs(prev => [...prev.slice(-12), msg]);
  };

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [telemetryLogs]);

  const handleAuthenticate = async () => {
    setScanning(true);
    setScanStep(0);
    
    const stepIntervals = [250, 300, 350, 400];
    for (let i = 0; i < stepIntervals.length; i++) {
      await new Promise(r => setTimeout(r, stepIntervals[i]));
      setScanStep(prev => prev + 1);
    }
    
    await new Promise(r => setTimeout(r, 400));
    setScanning(false);
    setPreviewSession(selectedRole);
    
    const isGffStaff = !selectedRole.startsWith("client_");
    router.push(isGffStaff ? "/admin/dashboard" : "/portal/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthenticate();
  };

  const currentMockUser = MOCK_PREVIEW_USERS[selectedRole];
  const activeRoleObj = rolesList.find(r => r.id === selectedRole) || rolesList[0];

  const scanMessages = [
    "Establishing zero-trust gateway handshake protocol...",
    "Isolating browser session within local memory sandbox container...",
    "Exchanging SHA-256 secure tokens with crypt node gateway...",
    "Provisioning administrative clearance keys in sovereign database...",
    "Clearance successfully decrypted. Granting portal dashboard access..."
  ];

  const getPermissionStatus = (role: PreviewRole, module: string) => {
    if (role === "gff_admin") {
      return { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" };
    }
    
    if (role === "viewer") {
      const isReadOnlyModule = ["Core Terminal", "Sovereign Control", "AI Governance"].includes(module);
      if (isReadOnlyModule) {
        return { status: "READ ONLY", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", dot: "bg-amber-400" };
      }
      return { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
    }

    switch (module) {
      case "Core Terminal":
        return ["client_admin", "client_member", "gff_operator", "finance_admin", "support_agent"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "AI Operations":
        return ["client_admin", "client_member", "gff_operator"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "AI Governance":
        return ["client_admin", "client_member", "gff_operator"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "Financial Ledger":
        return ["client_admin", "finance_admin"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "Sovereign Control":
        return ["gff_operator"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "Support Enclave":
        return ["client_admin", "client_member", "support_agent"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      case "Users Directory":
        return ["support_agent"].includes(role)
          ? { status: "AUTHORIZED", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-400" }
          : { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
      default:
        return { status: "RESTRICTED", color: "text-zinc-600 border-zinc-800 bg-zinc-950/20", dot: "bg-zinc-700" };
    }
  };

  const matrixModules = [
    "Core Terminal",
    "AI Operations",
    "AI Governance",
    "Financial Ledger",
    "Sovereign Control",
    "Support Enclave",
    "Users Directory"
  ];

  return (
    <div className="min-h-screen w-full bg-[#010101] text-zinc-100 flex flex-col items-center justify-center relative px-4 py-8 md:py-16 select-none overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(228, 0, 15, 0.04) 0%, transparent 45%),
              radial-gradient(circle at 90% 80%, rgba(0, 157, 255, 0.04) 0%, transparent 45%),
              linear-gradient(rgba(255, 255, 255, 0.005) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.005) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 45px 45px, 45px 45px"
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#009DFF]/3 to-[#E4000F]/3 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <header className="absolute top-0 left-0 right-0 h-20 w-full z-20 flex justify-between items-center px-6 lg:px-16 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src="/footer/logo.svg" alt="GFF AI Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col text-left">
            <span className="text-white text-base font-semibold tracking-wider leading-none">GFF AI</span>
            <span className="text-[7.5px] font-bold tracking-[0.1em] mt-1 text-zinc-400">
              <span className="text-[#E4000F]">GARAGE</span> | FOUNDRY | <span className="text-[#009DFF]">FACTORY</span>
            </span>
          </div>
        </Link>
        <Link 
          href="/" 
          className="text-xs font-mono font-bold tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#009DFF] rounded px-2 py-1"
        >
          ← RETURN TO WEBSITE
        </Link>
      </header>

      <div className="w-full max-w-[1100px] z-10 mt-14">
        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wider font-sans text-white uppercase">Sovereign Portal Authorization</h1>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Verify credentials to decrypt local administrative workspaces. Select a sandbox identity profile to preview role-based features dynamically.
          </p>
        </div>

        <div className="border border-zinc-800/80 bg-zinc-950/45 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
          <AnimatePresence mode="wait">
            {!scanning ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/60">
                <div className="lg:col-span-6 p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                    <div>
                      <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#009DFF]" /> Cryptographic Keycard
                      </h2>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Initialize secure local handshake protocols.</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold tracking-widest">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                      ENCLAVE ONLINE
                    </div>
                  </div>

                  <div className="flex bg-zinc-950/90 p-1 rounded-lg border border-zinc-900" role="tablist" aria-label="Authentication Method">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMethod === "credentials"}
                      onClick={() => { setAuthMethod("credentials"); setError(""); logTelemetry("[TAB] Switched method to Secure Keycard."); }}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                        authMethod === "credentials" 
                          ? "bg-zinc-900 text-white shadow-sm border border-zinc-850" 
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                      }`}
                    >
                      SECURE KEYCARD
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMethod === "otp"}
                      onClick={() => { setAuthMethod("otp"); setError(""); logTelemetry("[TAB] Switched method to Token Code."); }}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                        authMethod === "otp" 
                          ? "bg-zinc-900 text-white shadow-sm border border-zinc-850" 
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                      }`}
                    >
                      TOKEN CODE (OTP)
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="auth-email" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                        Enterprise Email Address
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="employee@gff.ai"
                        className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none font-mono focus:bg-zinc-950"
                        required
                      />
                    </div>

                    {authMethod === "credentials" ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label htmlFor="auth-pass" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                            Passphrase Key
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-[9px] text-zinc-500 hover:text-[#009DFF] transition-colors focus:outline-none cursor-pointer hover:underline"
                          >
                            Forgot Key?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            id="auth-pass"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full h-10 pl-3 pr-10 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none font-mono tracking-widest focus:bg-zinc-950"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label htmlFor="auth-otp" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                            Multi-Factor OTP Code
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              logTelemetry("[SYS] Requested simulation OTP broadcast. Code generated: 102486");
                              setOtpCode("102486");
                            }}
                            className="text-[9px] text-zinc-500 hover:text-[#009DFF] transition-colors focus:outline-none cursor-pointer"
                          >
                            Send OTP Broadcast?
                          </button>
                        </div>
                        <input
                          id="auth-otp"
                          type="text"
                          value={otpCode}
                          onChange={(e) => handleInputChange("otp", e.target.value)}
                          placeholder="102486"
                          maxLength={6}
                          className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none font-mono tracking-[0.4em] text-center focus:bg-zinc-950"
                          required
                        />
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-rose-950/20 border border-rose-900/35 text-rose-400 rounded-lg text-xs flex items-center gap-2 animate-pulse">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full h-10 rounded-lg bg-[#009DFF] hover:bg-[#0086db] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(0,157,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#009DFF] focus:ring-offset-2 focus:ring-offset-black"
                    >
                      <Lock className="w-3.5 h-3.5" /> Initialize Cryptographic Connection
                    </button>
                  </form>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[8px] text-zinc-500 uppercase font-mono tracking-widest font-bold">
                      <span className="flex items-center gap-1"><Terminal className="w-2.5 h-2.5" /> Crypt Handshake Telemetry</span>
                      <span>ACTIVE SOCKET</span>
                    </div>
                    <div className="h-28 rounded-lg bg-zinc-950 border border-zinc-900/90 p-2.5 font-mono text-[9px] text-zinc-400 overflow-y-auto space-y-1 select-text scrollbar-thin scrollbar-thumb-zinc-800">
                      {telemetryLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed border-l border-zinc-800 pl-2">
                          <span className="text-zinc-650">[{new Date().toLocaleTimeString().split(" ")[0]}]</span>{" "}
                          <span className={log.includes("[ERROR]") ? "text-rose-450" : log.includes("[INIT]") || log.includes("[IDENTITY]") ? "text-[#009DFF] font-semibold" : "text-zinc-350"}>
                            {log}
                          </span>
                        </div>
                      ))}
                      <div ref={consoleBottomRef} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-[8px] text-zinc-500 uppercase font-bold tracking-widest">
                      <span className="h-[1px] bg-zinc-900 flex-1 mr-2.5" />
                      <span>Federated Enclaves</span>
                      <span className="h-[1px] bg-zinc-900 flex-1 ml-2.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          logTelemetry("[SSO] Requesting Entra ID challenge payload...");
                          alert("SSO handshaking: Connecting browser to Azure AD/Entra ID sandbox portal...");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800/80 bg-zinc-950/20 hover:bg-zinc-900/40 text-[10.5px] font-mono font-semibold text-zinc-300 transition-all hover:border-zinc-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
                      >
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 23 23" fill="currentColor">
                          <path d="M0 0h11v11H0z" fill="#f25022"/>
                          <path d="M12 0h11v11H12z" fill="#7fba00"/>
                          <path d="M0 12h11v11H0z" fill="#00a4ef"/>
                          <path d="M12 12h11v11H12z" fill="#ffb900"/>
                        </svg>
                        <span>ENTRA ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logTelemetry("[SSO] Requesting Okta security assertion...");
                          alert("SSO handshaking: Initializing secure Okta login portal simulated exchange...");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800/80 bg-zinc-950/20 hover:bg-zinc-900/40 text-[10.5px] font-mono font-semibold text-zinc-300 transition-all hover:border-zinc-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
                      >
                        <svg className="w-3 h-3 shrink-0 text-[#007dc1]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                        </svg>
                        <span>OKTA SSO</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500/80 pt-1">
                      <span className="font-mono text-[9px]">Sovereign Enclave GFF_0x7FFA</span>
                      <button
                        type="button"
                        onClick={() => setShowSupport(true)}
                        className="hover:text-[#009DFF] hover:underline flex items-center gap-1 transition-all focus:outline-none cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Support Relay
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 p-6 md:p-8 bg-zinc-950/20 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#009DFF]" />
                        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Local Role Sandbox Preview</h3>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
                        Select an administrative role profile to pre-configure security keys and immediately explore RBAC boundaries in the client portal or oversight console.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-[#009DFF]/15 bg-[#009DFF]/5 text-zinc-300 text-[10.5px] leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#009DFF] uppercase tracking-wider font-mono text-[9px]">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        DEVELOPMENT ENVIRONMENT NOTICE
                      </div>
                      <p className="text-zinc-400 font-sans leading-relaxed">
                        This preview operates fully in-browser. All credentials, database configurations, and clearances are simulated. No real passwords or keys are transmitted.
                      </p>
                    </div>

                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                      {rolesList.map((r) => {
                        const isSel = selectedRole === r.id;
                        const RoleIcon = r.icon;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => { setSelectedRole(r.id); setError(""); }}
                            className={`w-full p-2.5 rounded-xl border text-left cursor-pointer flex justify-between items-center transition-all text-xs group focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                              isSel 
                                ? "border-[#009DFF]/40 bg-[#009DFF]/10 text-white shadow-[0_0_15px_rgba(0,157,255,0.05)]" 
                                : "border-zinc-800/40 bg-zinc-950/20 hover:bg-zinc-900/40 hover:border-zinc-800 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              <div className="shrink-0">
                                <RoleIcon className={`w-4 h-4 ${r.color}`} />
                              </div>
                              <div className="truncate text-left">
                                <span className={`font-bold block tracking-wider ${isSel ? "text-white" : "text-zinc-300 group-hover:text-zinc-200"}`}>{r.label}</span>
                                <span className="text-[9px] text-zinc-500 font-sans block truncate group-hover:text-zinc-400">{r.desc}</span>
                              </div>
                            </div>
                            <span className={`text-[8px] font-bold border rounded px-1.5 py-0.5 shrink-0 font-mono tracking-widest ${
                              isSel 
                                ? "border-[#009DFF]/30 text-[#009DFF] bg-[#009DFF]/5" 
                                : "border-zinc-800 text-zinc-500"
                            }`}>
                              {r.clearance}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 space-y-2.5">
                    <div className="flex items-center justify-between text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                      <span className="flex items-center gap-1.5"><Network className="w-3 h-3 text-[#009DFF]" /> Sovereign Access Matrix</span>
                      <span className="text-[8px] text-zinc-500 font-bold">DYNAMIC ROLE BOUNDARIES</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                      {matrixModules.slice(0, 4).map((mod) => {
                        const perm = getPermissionStatus(selectedRole, mod);
                        return (
                          <div key={mod} className="p-2 rounded-lg border border-zinc-900/90 bg-zinc-950/60 flex flex-col justify-between h-[45px] transition-all">
                            <span className="text-[8px] text-zinc-400 font-mono tracking-wider truncate block">{mod}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`h-1 w-1 rounded-full ${perm.dot}`} />
                              <span className="text-[7.5px] font-bold tracking-widest font-mono text-white leading-none">{perm.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="relative h-14 w-full bg-zinc-950/90 border border-zinc-900 rounded-xl overflow-hidden flex items-center justify-between px-6 font-mono text-[9px] text-zinc-500">
                      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
                          <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="#E4000F" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
                        </svg>
                      </div>
                      
                      <div className="z-10 flex items-center gap-1.5 font-sans">
                        <div className="p-1 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col text-left font-mono">
                          <span className="text-white font-bold leading-none">TERMINAL</span>
                          <span className="text-[7.5px] text-zinc-500 leading-none mt-1">NODE_ACTIVE</span>
                        </div>
                      </div>

                      <div className="z-10 flex flex-col items-center">
                        <div className="px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[7px] text-zinc-400 tracking-widest animate-pulse font-mono font-bold">
                          TLS_1.3
                        </div>
                      </div>

                      <div className="z-10 flex items-center gap-1.5 font-sans">
                        <div className="flex flex-col text-right font-mono">
                          <span className="text-white font-bold leading-none">ENCLAVE</span>
                          <span className="text-[7.5px] text-emerald-400 leading-none mt-1">SECURED_MEM</span>
                        </div>
                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Database className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 space-y-1.5 font-mono">
                      <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Server className="w-3 h-3 text-zinc-500" />
                        Active Enclave Session Payload
                      </div>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-900/95 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-white truncate">
                          <span className="truncate tracking-wide">{currentMockUser?.name}</span>
                          <span className="text-[8px] text-[#009DFF] font-semibold border border-[#009DFF]/20 px-1.5 py-0.5 rounded bg-[#009DFF]/5 uppercase tracking-widest">{activeRoleObj.clearance}</span>
                        </div>
                        <div className="text-[9.5px] text-zinc-500 truncate leading-none">{currentMockUser?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              <div className="space-y-8 py-16 px-6 max-w-lg mx-auto text-center font-mono">
                <div className="relative h-28 w-28 bg-zinc-950 border border-zinc-900 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,157,255,0.08)] mx-auto">
                  <div className="absolute inset-1.5 border border-[#009DFF]/15 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 border border-dashed border-[#E4000F]/15 rounded-full animate-[spin_14s_linear_infinite_reverse]" />
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#009DFF] to-transparent shadow-[0_0_15px_#009DFF] animate-[pulse_1.5s_ease-in-out_infinite]" style={{ top: "50%" }} />
                  <RefreshCw className="w-9 h-9 text-[#009DFF] animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 tracking-widest uppercase">
                    <span>Crypt Handshake Progress</span>
                    <span className="text-[#009DFF] font-bold">{Math.min(100, (scanStep + 1) * 20)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 p-[1px]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#009DFF] to-cyan-400 rounded-full transition-all duration-300" 
                      style={{ width: `${(scanStep + 1) * 20}%` }} 
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/80 text-[10.5px] text-left space-y-3 min-h-[160px] shadow-inner font-mono select-text">
                  {scanMessages.slice(0, scanStep + 1).map((msg, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-zinc-300 font-mono leading-relaxed">
                      {idx < scanStep ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-[#009DFF] animate-spin shrink-0 mt-0.5" />
                      )}
                      <span className={idx < scanStep ? "text-zinc-600 line-through font-light" : "text-white font-bold"}>
                        {msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5 text-zinc-200">
                <div className="p-1.5 rounded-lg bg-[#009DFF]/10 text-[#009DFF]">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider">Passphrase Key Recovery</h3>
              </div>
              <button 
                onClick={() => setShowForgot(false)} 
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-900 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              GFF AI Zero-Trust Enclaves enforce rigorous defense protocols. Reset requests require out-of-band authorization by your sovereign security administrator.
            </p>
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/80 font-mono text-[10px] text-zinc-500 space-y-1">
              <div className="flex justify-between"><span className="uppercase">Recovery Link:</span> <span className="text-zinc-400">ISOLATED_OFFLINE</span></div>
              <div className="flex justify-between"><span className="uppercase">Reference ID:</span> <span className="text-[#009DFF]">RECOVERY_0x8F9B2C</span></div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="px-4 h-9 bg-zinc-800 hover:bg-zinc-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
              >
                Close Handshake
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5 text-zinc-200">
                <div className="p-1.5 rounded-lg bg-[#009DFF]/10 text-[#009DFF]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider">Secure Support Relay</h3>
              </div>
              <button 
                onClick={() => setShowSupport(false)} 
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-900 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Connect directly with GFF AI’s Operations Command Center for priority ticket routing and secure enclave engineering assistance.
            </p>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2 text-xs font-mono">
              <div className="text-zinc-400 flex justify-between">
                <span>Support Channel:</span>
                <span className="text-[#009DFF] font-semibold select-all">support@gff.ai</span>
              </div>
              <div className="text-zinc-400 flex justify-between">
                <span>Assigned Queue:</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">Sovereign-P1</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSupport(false)}
                className="px-4 h-9 bg-zinc-800 hover:bg-zinc-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
              >
                Disconnect Relay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
