"use client";

import React, { useState } from "react";
import { Key, ShieldAlert, Lock, RefreshCw } from "lucide-react";

export default function ClientSettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("gff_live_0x9923880ff811a9110cf91a");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Account & Access Settings</h2>
        <p className="text-xs text-white/50 mt-1">Manage your developer credentials, access keys, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Key className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">API Keys</h3>
          </div>

          <div className="space-y-4 font-mono text-[11.5px] text-white/70">
            <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] text-white/35 block font-bold uppercase">Default Access Key</span>
              <div className="flex justify-between items-center bg-[#050505] p-2.5 rounded border border-white/5">
                <span className="text-[#00FFC2] font-bold truncate pr-3">{apiKey}</span>
                <button
                  onClick={() => alert("Copied API access key to clipboard!")}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white cursor-pointer shrink-0 transition-colors"
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Lock className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Multi-Factor Authentication</h3>
          </div>
          
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-[#009DFF]/5 border border-[#009DFF]/20 text-white font-bold">
              <span>MFA / PASSKEY:</span>
              <span className="text-emerald-400 font-bold">ENABLED</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Every sign-in session requires verifying your multi-factor credentials to safeguard account security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
