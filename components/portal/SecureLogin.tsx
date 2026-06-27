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
  const [simpleEmail, setSimpleEmail] = useState("");
  const [simplePassword, setSimplePassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [mfaTimeRemaining, setMfaTimeRemaining] = useState(30);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (authMethod === "otp") {
      setMfaTimeRemaining(30);
      interval = setInterval(() => {
        setMfaTimeRemaining((prev) => {
          if (prev <= 1) {
            const generated = Math.floor(100000 + Math.random() * 900000).toString();
            logTelemetry(`[MFA] Rotation cycle complete. Generated temporary token: ${generated}`);
            setOtpCode(generated);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMethod]);

  const handleOtpChange = (index: number, val: string) => {
    const sanitizedVal = val.replace(/\D/g, "");
    if (!sanitizedVal) {
      const newOtp = otpCode.split("");
      newOtp[index] = "";
      const updatedCode = newOtp.join("");
      setOtpCode(updatedCode);
      return;
    }

    const char = sanitizedVal[sanitizedVal.length - 1];
    const newOtp = Array.from({ length: 6 }, (_, i) => otpCode[i] || "");
    newOtp[index] = char;
    const updatedCode = newOtp.join("");
    setOtpCode(updatedCode);

    if (updatedCode.length === 6) {
      logTelemetry(`[OTP] Multi-factor authentication block complete. Ready for clearance verification.`);
    }

    if (index < 5 && char) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const currentVal = otpCode[index] || "";
      if (!currentVal && index > 0) {
        otpRefs[index - 1].current?.focus();
        const newOtp = otpCode.split("");
        newOtp[index - 1] = "";
        setOtpCode(newOtp.join(""));
      } else {
        const newOtp = otpCode.split("");
        newOtp[index] = "";
        setOtpCode(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs[index - 1].current?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      setOtpCode(pastedData);
      logTelemetry(`[OTP] Pasted authentication block: ${pastedData}`);
      const targetIndex = Math.min(pastedData.length, 5);
      setTimeout(() => {
        otpRefs[targetIndex].current?.focus();
      }, 50);
    }
  };

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

  const handleSimpleSubmit = (e: React.FormEvent) => {
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

  const simpleLoginUi = (
    <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_25%_10%,rgba(228,0,15,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(0,157,255,0.16),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
      </div>

      <header className="relative z-10 h-20 w-full flex justify-between items-center px-6 lg:px-16 border-b border-white/10 bg-black/35 backdrop-blur-md">
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
          className="text-xs font-mono font-bold tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          RETURN TO WEBSITE
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-stretch"
        >
          <section className="hidden lg:flex rounded-2xl border border-white/10 bg-white/[0.03] p-10 flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,157,255,0.12),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(228,0,15,0.12),transparent_30%)]" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#009DFF]/70 to-transparent" />
           <motion.div
  animate={{
    y: [0, -20, 0],
    x: [0, 10, 0],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -left-24 top-24 h-48 w-48 rounded-full border border-[#009DFF]/20"
/>

<motion.div
  animate={{
    y: [0, 20, 0],
    x: [0, -10, 0],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -right-20 bottom-20 h-56 w-56 rounded-full border border-[#E4000F]/20"
/>
            <div className="relative space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#009DFF]">
                <Shield className="w-3.5 h-3.5" />
                Secure Client Portal
              </div>
              <div className="space-y-3 max-w-xl">
                <h1 className="text-[44px] leading-[1.05] font-semibold tracking-wide">
                  Welcome back to your GFF AI workspace.
                </h1>
                <p className="text-sm leading-7 text-zinc-400">
                  Access dashboards, managed operations, governance controls, and enterprise AI activity from one protected client environment.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-3 gap-3 pt-10">
              {[
                ["Garage", "Discovery"],
                ["Foundry", "Pilot"],
                ["Factory", "Scale"],
              ].map(([title, label]) => (
<div
  key={title}
  className="rounded-xl border border-white/10 bg-black/35 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#009DFF]/30 hover:bg-white/[0.03]"
>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#060606]/95 shadow-2xl backdrop-blur-xl p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,157,255,0.08)]">
            {!scanning ? (
              <div className="space-y-7">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E98828]">
                      Client Login
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                      <span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
</span>
                      Online
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-wide">Sign in</h2>
                  <p className="text-xs leading-6 text-zinc-500">
                    Use your portal credentials to continue to the dashboard.
                  </p>
                </div>

                <form onSubmit={handleSimpleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="auth-email-simple" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                      Email Address
                    </label>
                    <input
                      id="auth-email-simple"
                      type="email"
                      value={simpleEmail}
                      onChange={(e) => setSimpleEmail(e.target.value)}
                      placeholder="Enter your business email"
                      className="w-full h-12 rounded-lg border border-white/10 bg-black px-4 text-sm text-white placeholder:text-zinc-700 outline-none transition focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="auth-pass-simple" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(simpleEmail);
                          setForgotSubmitted(false);
                          setForgotError("");
                          setShowForgot(true);
                        }}
                        className="text-[10px] text-zinc-500 hover:text-[#009DFF] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="auth-pass-simple"
                        type={showPassword ? "text" : "password"}
                        value={simplePassword}
                        onChange={(e) => setSimplePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-12 rounded-lg border border-white/10 bg-black px-4 pr-11 text-sm text-white placeholder:text-zinc-700 outline-none transition focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role-simple" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                      Preview Role
                    </label>
                    <select
                      id="role-simple"
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value as PreviewRole);
                        setError("");
                      }}
                      className="w-full h-12 rounded-lg border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF]"
                    >
                      {rolesList.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-12 rounded-lg bg-[#009DFF] text-black text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#18a8ff] hover:shadow-[0_0_30px_rgba(0,157,255,0.35)] active:scale-[0.99]"
                  >
                    <Lock className="w-4 h-4" />
                    Login to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-500">
                  <span>Protected GFF AI client access</span>
                  <button
                    type="button"
                    onClick={() => setShowSupport(true)}
                    className="text-left sm:text-right text-[#009DFF] hover:text-white transition-colors"
                  >
                    Need help?
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-7">
                <div className="mx-auto h-20 w-20 rounded-full border border-[#009DFF]/25 bg-[#009DFF]/10 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-[#009DFF] animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Signing you in</h2>
                  <p className="text-xs text-zinc-500">{scanMessages[Math.min(scanStep, scanMessages.length - 1)]}</p>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#009DFF] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (scanStep + 1) * 20)}%` }}
                  />
                </div>
              </div>
            )}
          </section>
        </motion.div>
      </main>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#080808] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">Reset password</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">Enter your email and we will prepare a recovery request.</p>
              </div>
              <button type="button" onClick={() => setShowForgot(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            {!forgotSubmitted ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!forgotEmail || !forgotEmail.includes("@")) {
                    setForgotError("Valid enterprise email is required.");
                    return;
                  }
                  setForgotError("");
                  setForgotLoading(true);
                  await new Promise(r => setTimeout(r, 700));
                  setForgotLoading(false);
                  setForgotSubmitted(true);
                }}
                className="mt-5 space-y-4"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 rounded-lg border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-[#009DFF]"
                />
                {forgotError && <p className="text-xs text-rose-400">{forgotError}</p>}
                <button type="submit" disabled={forgotLoading} className="w-full h-11 rounded-lg bg-[#009DFF] text-black text-xs font-bold uppercase tracking-widest disabled:opacity-60">
                  {forgotLoading ? "Sending..." : "Send Recovery Request"}
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300 flex gap-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Recovery request prepared for {forgotEmail}.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#080808] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">Support</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">Contact GFF AI support for portal access help.</p>
              </div>
              <button type="button" onClick={() => setShowSupport(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-black p-4 text-xs text-zinc-400">
              <div className="flex justify-between gap-4">
                <span>Support Channel</span>
                <span className="text-[#009DFF]">support@gff.ai</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Legacy complex login UI preserved for reference and rollback; no longer returned.
  const legacySecureLoginUi = (
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
                            onClick={() => {
                              setForgotEmail(email);
                              setForgotSubmitted(false);
                              setForgotError("");
                              setShowForgot(true);
                              logTelemetry("[SYS] Initializing local enclave passphrase key recovery handshake.");
                            }}
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
                          <label htmlFor="otp-0" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold flex items-center gap-2">
                            <Key className="w-3.5 h-3.5 text-[#009DFF]" /> Multi-Factor OTP Code
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                              <span className="text-[#009DFF] font-semibold">{mfaTimeRemaining}s</span>
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="7" fill="none" stroke="#27272a" strokeWidth="1.5" />
                                <circle 
                                  cx="10" 
                                  cy="10" 
                                  r="7" 
                                  fill="none" 
                                  stroke="#009DFF" 
                                  strokeWidth="1.5" 
                                  strokeDasharray={`${2 * Math.PI * 7}`}
                                  strokeDashoffset={`${2 * Math.PI * 7 * (1 - mfaTimeRemaining / 30)}`}
                                  strokeLinecap="round"
                                  className="transition-all duration-1000 ease-linear"
                                />
                              </svg>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                logTelemetry("[SYS] Requested simulation OTP broadcast. Code generated: 102486");
                                setOtpCode("102486");
                                setError("");
                                setTimeout(() => otpRefs[5].current?.focus(), 50);
                              }}
                              className="px-2 py-0.5 rounded bg-[#009DFF]/10 border border-[#009DFF]/20 text-[#009DFF] font-mono text-[8.5px] font-bold tracking-wider hover:bg-[#009DFF]/25 transition-colors cursor-pointer focus:outline-none"
                            >
                              GENERATE CODE
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between gap-2.5 max-w-[320px] mx-auto py-2">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              ref={otpRefs[idx]}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={otpCode[idx] || ""}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              placeholder="•"
                              maxLength={1}
                              className="w-10 h-12 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-sm font-bold text-white placeholder-zinc-850 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] transition-all outline-none font-mono"
                              aria-label={`Digit ${idx + 1}`}
                            />
                          ))}
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden transition-all duration-300">
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
            {!forgotSubmitted ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!forgotEmail) { setForgotError("Enterprise email is required."); return; }
                if (!forgotEmail.includes("@")) { setForgotError("Valid enterprise email is required."); return; }
                setForgotError(""); setForgotLoading(true);
                await new Promise(r => setTimeout(r, 1000));
                setForgotLoading(false); setForgotSubmitted(true);
                logTelemetry(`[RECOVERY] Dispatched isolated recovery simulation to ${forgotEmail}.`);
              }} className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed text-left">
                  GFF AI Zero-Trust Enclaves enforce rigorous defense protocols. Reset requests require out-of-band authorization.
                </p>
                <input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="employee@gff.ai" className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs outline-none focus:border-[#009DFF] text-white" required />
                {forgotError && <p className="text-xs text-rose-450">{forgotError}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForgot(false)} className="flex-1 h-9 bg-zinc-800 rounded-lg text-xs text-zinc-400">Cancel</button>
                  <button type="submit" disabled={forgotLoading} className="flex-1 h-9 bg-[#009DFF] text-black rounded-lg text-xs font-bold">{forgotLoading ? "Verifying..." : "Request Reset"}</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-left font-sans animate-fade-in">
                {/* SVG Style Keyframes */}
                <style>{`
                  @keyframes recoveryDash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .animate-recovery-dash {
                    stroke-dasharray: 6 4;
                    animation: recoveryDash 1.2s linear infinite;
                  }
                `}</style>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-[10px] mb-1">Enclave Recovery Dispatched</span>
                    <p className="leading-relaxed text-zinc-300">
                      An out-of-band reset vector has been securely provisioned for: <span className="font-bold text-white select-all">{forgotEmail}</span>
                    </p>
                  </div>
                </div>

                {/* Animated SVG Handshake Diagram */}
                <div className="space-y-2">
                  <span className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Handshake Isolation Transmission</span>
                  <div className="w-full bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,157,255,0.03),transparent)] pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                        <Server className="w-4 h-4 text-zinc-300" />
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">Terminal</span>
                    </div>

                    {/* SVG Connector with animated pulse */}
                    <div className="flex-1 relative h-6 mx-1">
                      <svg className="w-full h-full" fill="none" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,12 L100,12" stroke="#27272a" strokeWidth="1.5" strokeDasharray="3 3" />
                        <path d="M0,12 L100,12" stroke="#009DFF" strokeWidth="1.5" className="animate-recovery-dash" />
                      </svg>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-[#009DFF]/30 text-[#009DFF] flex items-center justify-center animate-pulse">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#009DFF]">Crypt Node</span>
                    </div>

                    {/* SVG Connector with animated pulse */}
                    <div className="flex-1 relative h-6 mx-1">
                      <svg className="w-full h-full" fill="none" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <path d="M0,12 L100,12" stroke="#27272a" strokeWidth="1.5" strokeDasharray="3 3" />
                        <path d="M0,12 L100,12" stroke="rgb(16,185,129)" strokeWidth="1.5" className="animate-recovery-dash" style={{ animationDirection: 'reverse' }} />
                      </svg>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-500">Secure Mail</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Operations Timeline */}
                <div className="space-y-2">
                  <span className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Sovereign Recovery Protocol Timeline</span>
                  <div className="space-y-2.5 pl-2 border-l border-zinc-800/80">
                    <div className="relative pl-4">
                      <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-[#009DFF]" />
                      <span className="text-[9px] font-mono font-bold uppercase text-[#009DFF] tracking-wider block">Step 01 / Identity Resolution</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5 font-sans">
                        GFF AI Zero-Trust Enclave verified target signature against DNSSEC records and verified clearance authorization.
                      </p>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-mono font-bold uppercase text-blue-400 tracking-wider block">Step 02 / Enclave Handshake Generated</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5 font-sans">
                        Isolated a dynamic recovery token within the local cryptographic memory space, salting with SHA-512 vector.
                      </p>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 tracking-wider block">Step 03 / Simulated Vector Provisioned</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5 font-sans">
                        Dispatched outbound simulation handshake message to the target enterprise mailbox (Simulation complete).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ref & Notice Details */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-[10px] text-zinc-500 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="uppercase">Notice context:</span> 
                    <span className="text-[#009DFF] font-semibold tracking-wider">SANDBOX HANDSHAKE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="uppercase">Isolated Hash:</span> 
                    <span className="text-zinc-400 font-mono">0x{getDeterministicHash(forgotEmail, 8)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="uppercase">Active Queue:</span> 
                    <span className="text-emerald-400 font-bold uppercase">Sovereign-P1</span>
                  </div>
                </div>

                <p className="text-[9.5px] text-zinc-500 leading-relaxed font-sans text-left">
                  <span className="font-bold text-zinc-400">Honest Disclaimer:</span> This interface represents a frontend-only design preview of GFF AI's secure identity recovery pipeline. No real email notifications or permanent modifications are made.
                </p>

                <div className="flex justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowForgot(false); 
                      setForgotSubmitted(false); 
                      setForgotEmail(""); 
                    }} 
                    className="px-5 h-9 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            )}
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

  void legacySecureLoginUi;
  return simpleLoginUi;
}
