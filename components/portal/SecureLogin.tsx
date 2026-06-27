"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, Key, CheckCircle, RefreshCw } from "lucide-react";

export default function SecureLogin({ defaultRole = "Client" }: { defaultRole?: "Client" | "Administrator" }) {
  const router = useRouter();
  const [role, setRole] = useState<"Client" | "Administrator">(defaultRole);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanMessages = [
    "Establishing zero-trust handshake...",
    "Scanning hardware security module...",
    "Verifying passkey (SHA-256)...",
    "Decapsulating session enclave..."
  ];

  const handleAuthenticate = async () => {
    setScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 350);

    await new Promise(r => setTimeout(r, 1500));
    clearInterval(interval);
    setScanning(false);
    router.push(role === "Administrator" ? "/admin/dashboard" : "/portal/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col items-center justify-center relative px-4 select-none">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#009DFF]/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#E4000F]/5 blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="w-full max-w-[420px] z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0a0a0a] text-[#009DFF]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-bold tracking-widest text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-2.5 py-0.5 rounded-full uppercase">
              ZERO-TRUST GATEWAY
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Authenticate <span className="text-[#009DFF]">Session</span>
          </h1>
        </div>

        <div className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
          {!scanning && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole("Client")}
                className={`h-10 rounded-lg border text-[10px] font-bold font-mono uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "Client" ? "border-[#009DFF]/30 bg-[#009DFF]/5 text-white" : "border-white/5 bg-white/[0.01] text-white/50"
                }`}
              >
                <Key className="w-3 h-3" /> Client
              </button>
              <button
                onClick={() => setRole("Administrator")}
                className={`h-10 rounded-lg border text-[10px] font-bold font-mono uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === "Administrator" ? "border-[#E4000F]/30 bg-[#E4000F]/5 text-white" : "border-white/5 bg-white/[0.01] text-white/50"
                }`}
              >
                <Lock className="w-3 h-3" /> Admin
              </button>
            </div>
          )}

          {scanning ? (
            <div className="space-y-3">
              <div className="relative h-16 bg-black/50 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:8px_8px]" />
                <div className="absolute left-0 right-0 h-[1.5px] bg-[#009DFF]/60 animate-pulse" style={{ top: "45%" }} />
                <div className="w-8 h-8 rounded-full border border-dashed border-[#009DFF]/30 animate-spin" />
              </div>

              <div className="space-y-1 p-3 bg-black/30 border border-white/5 rounded-xl font-mono text-[9px] min-h-[72px]">
                {scanMessages.slice(0, scanStep + 1).map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-white/80">
                    {idx < scanStep ? (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <RefreshCw className="w-3 h-3 text-[#009DFF] animate-spin" />
                    )}
                    <span className={idx < scanStep ? "text-white/35 line-through" : "text-white"}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleAuthenticate}
                className="w-full h-11 rounded-lg bg-white hover:bg-white/90 text-black font-semibold text-[11px] uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Authenticate Passkey</span>
              </button>
              <div className="text-[8.5px] font-mono text-white/30 text-center leading-relaxed">
                Cryptographically sealed under ISO-27001 requirements.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
