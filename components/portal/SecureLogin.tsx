"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, Key, CheckCircle, RefreshCw, Layers, Eye, Users, Cpu, FileText, HelpCircle } from "lucide-react";
import { setPreviewSession, PreviewRole, MOCK_PREVIEW_USERS } from "@/lib/preview-auth";

export default function SecureLogin({ defaultRole }: { defaultRole?: string }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<PreviewRole>(
    defaultRole === "Administrator" ? "gff_admin" : "client_admin"
  );
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const rolesList = [
    { id: "client_admin" as PreviewRole, label: "Client Admin", clearance: "Level III", desc: "Sandbox gateway owner", icon: Users, color: "text-cyan-400" },
    { id: "client_member" as PreviewRole, label: "Client Member", clearance: "Level II", desc: "Sandbox layer worker", icon: Layers, color: "text-blue-400" },
    { id: "gff_admin" as PreviewRole, label: "GFF Admin", clearance: "Level V", desc: "Root platform controller", icon: Shield, color: "text-red-400" },
    { id: "gff_operator" as PreviewRole, label: "GFF Operator", clearance: "Level IV", desc: "Model architecture manager", icon: Cpu, color: "text-purple-400" },
    { id: "finance_admin" as PreviewRole, label: "Finance Admin", clearance: "Level III", desc: "Epoch financial controller", icon: FileText, color: "text-emerald-400" },
    { id: "support_agent" as PreviewRole, label: "Support Agent", clearance: "Level III", desc: "SLA wire representative", icon: HelpCircle, color: "text-orange-400" },
    { id: "viewer" as PreviewRole, label: "Auditor (Viewer)", clearance: "Level I", desc: "Read-only observers", icon: Eye, color: "text-slate-400" },
  ];

  const handleAuthenticate = async () => {
    setScanning(true);
    setScanStep(0);
    const interval = setInterval(() => setScanStep(p => p < 3 ? p + 1 : p), 200);
    await new Promise(r => setTimeout(r, 900));
    clearInterval(interval);
    setScanning(false);
    setPreviewSession(selectedRole);
    router.push(selectedRole.startsWith("client_") ? "/portal/dashboard" : "/admin/dashboard");
  };

  const currentMockUser = MOCK_PREVIEW_USERS[selectedRole];
  const activeRoleObj = rolesList.find(r => r.id === selectedRole) || rolesList[0];
  const scanMessages = [
    "Establishing zero-trust gateway handshake...",
    "Isolating local browser enclaves...",
    "Exchanging SHA-256 keys (GFF_0x7FFA)...",
    "Provisioning clearance keycards..."
  ];

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col items-center justify-center relative px-4 py-8 select-none font-mono overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#009DFF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#E4000F]/3 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 space-y-6">
        <div className="text-center space-y-2.5 font-sans">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#0a0a0a] text-[#009DFF] shadow-[0_0_15px_rgba(0,157,255,0.1)]">
            <Shield className="w-4 h-4" />
          </div>
          <div><span className="text-[8px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">ZERO-TRUST IDENTITY DECK</span></div>
          <h1 className="text-xs font-mono font-bold uppercase tracking-wider">Sovereign <span className="text-[#009DFF]">Access Gateway</span></h1>
          <p className="text-[10px] text-white/40 max-w-md mx-auto leading-relaxed">Select a simulated identity profile below to verify real-time, role-based boundaries on the GFF AI sandboxed dashboards.</p>
        </div>

        <div className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/65 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          {!scanning ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Simulated Roles */}
              <div className="md:col-span-7 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {rolesList.map((r) => {
                  const isSel = selectedRole === r.id;
                  const RoleIcon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`w-full p-2 rounded-xl border text-left cursor-pointer flex justify-between items-center transition-all text-[11px] group ${
                        isSel ? "border-[#009DFF]/40 bg-[#009DFF]/5 text-white" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-white/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <RoleIcon className={`w-3.5 h-3.5 ${r.color} shrink-0`} />
                        <div className="truncate">
                          <span className="font-bold block">{r.label}</span>
                          <span className="text-[8.5px] text-white/30 font-sans block truncate group-hover:text-white/40">{r.desc}</span>
                        </div>
                      </div>
                      <span className={`text-[7.5px] font-bold border rounded px-1.5 py-0.5 shrink-0 ${isSel ? "border-[#009DFF]/30 text-[#009DFF] bg-[#009DFF]/5" : "border-white/10 text-white/30"}`}>{r.clearance}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Identity Profile & Auth Action */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4 md:border-l md:border-white/5 md:pl-5">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-white/5 bg-black/40 space-y-2.5">
                    <div className="text-[7.5px] font-bold text-white/30 uppercase tracking-widest">Simulated Identity</div>
                    <div className="space-y-1">
                      <div className="text-[10.5px] font-bold uppercase truncate text-white leading-none">{currentMockUser.name}</div>
                      <div className="text-[8px] text-white/40 truncate mt-1">{currentMockUser.email}</div>
                    </div>
                    <div className="h-[1px] bg-white/5 w-full" />
                    <div className="text-[8.5px] text-white/50 leading-relaxed font-sans">
                      Clearance: <strong className="text-[#009DFF] font-mono">{activeRoleObj.clearance}</strong><br />
                      Authorized: <strong className="text-white font-mono">{activeRoleObj.label}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-950/10 border border-blue-500/10 text-blue-400 rounded-lg text-[8px] leading-relaxed font-sans">
                    <strong>PREVIEW GATEWAY:</strong> States are sandbox-isolated. Real OAuth AD connects in backend implementation.
                  </div>
                </div>

                <button onClick={handleAuthenticate} className="w-full h-10 rounded-lg bg-white hover:bg-white/90 text-black font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Key className="w-3.5 h-3.5" /> Authenticate Enclave
                </button>
              </div>
            </div>
          ) : (
            /* Setup Scanning Display */
            <div className="space-y-5 py-6 max-w-md mx-auto text-center">
              <div className="relative h-16 w-16 bg-black/40 border border-[#009DFF]/20 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,157,255,0.05)] mx-auto">
                <div className="absolute left-0 right-0 h-[1px] bg-[#009DFF]/70 animate-pulse" style={{ top: "45%" }} />
                <RefreshCw className="w-5 h-5 text-[#009DFF] animate-spin" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] text-white/30 px-1">
                  <span>DECRYPTING CLEARED CHANNELS</span>
                  <span>{Math.round((scanStep + 1) * 25)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#009DFF] to-blue-500 shadow-[0_0_8px_rgba(0,0,0,0)] transition-all duration-200" style={{ width: `${(scanStep + 1) * 25}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-black/50 min-h-[108px] text-[9.5px] text-left space-y-2 font-mono">
                {scanMessages.slice(0, scanStep + 1).map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80 font-mono">
                    {idx < scanStep ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-[#009DFF] animate-spin shrink-0" />
                    )}
                    <span className={idx < scanStep ? "text-white/30 line-through" : "text-white font-bold"}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
