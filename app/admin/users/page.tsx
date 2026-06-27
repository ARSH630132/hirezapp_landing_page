"use client";

import React from "react";
import { UserCheck, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const users = [
    { name: "Dr. Sarah Vance", email: "s.vance@governance.gff.ai", role: "Administrator", clearance: "Level V (Secure Superuser)", keyToken: "ACTIVE" },
    { name: "Alexander Mercer", email: "a.mercer@apex-sovereign.gff.ai", role: "Client Operator", clearance: "Level III (Sandbox)", keyToken: "ACTIVE" },
    { name: "Siddharth Mehta", email: "s.mehta@mining.corp.gff.ai", role: "Client Operator", clearance: "Level III (Sandbox)", keyToken: "ACTIVE" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">System Users</h2>
          <p className="text-xs text-white/50 mt-1">Audit active administrator and enterprise operator clearance credentials, SSO sessions, and token states.</p>
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#009DFF]" />
          <span>Active Credentials Registry</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">User Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role Assigned</th>
                <th className="p-4">Clearance Level</th>
                <th className="p-4 text-right">FIDO2 Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-white font-bold">{u.name}</td>
                  <td className="p-4 text-white/50">{u.email}</td>
                  <td className="p-4 text-white/60">{u.role}</td>
                  <td className="p-4 text-white/40">{u.clearance}</td>
                  <td className="p-4 text-right text-green-400 font-bold">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400 rounded border border-green-500/20">
                      {u.keyToken}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
