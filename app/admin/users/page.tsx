"use client";

import React from "react";
import { DataTable, previewUsers, TableColumn, User } from "@/components/private-app";

export default function AdminUsersPage() {
  const columns: TableColumn<User>[] = [
    { key: "id", header: "Operator ID", sortable: true },
    { key: "name", header: "Full Name", sortable: true },
    { key: "email", header: "Secure Email", sortable: true },
    { key: "role", header: "Role", render: (row) => row.role.name, sortable: true },
    { key: "clearance", header: "Clearance", sortable: true },
    { key: "status", header: "Session", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">System Operator Registry</h2>
        <p className="text-xs text-white/50 mt-1">Audit active administrator and enterprise operator clearance credentials, security tokens, and SSO session state.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewUsers}
        pageSize={5}
        searchPlaceholder="Filter operators by name, email, role, or clearance..."
        searchKeys={["id", "name", "email", "clearance"]}
        statusField="status"
        typeField="clearance"
        categoryLabel="SECURITY USER CLEARANCE"
        detailTitle={(row) => row.name}
        renderDetail={(row) => (
          <div className="space-y-5 font-mono text-[11.5px]">
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Secure Identity Profile</span>
              <p className="text-white font-bold text-[13.5px]">{row.name}</p>
              <p className="text-[#009DFF] text-[11px]">{row.email}</p>
            </div>
            
            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Assigned Security Permissions</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {row.role.permissions.map((perm) => (
                  <span key={perm} className="px-2 py-0.5 text-[9px] font-bold bg-[#00FFC2]/5 text-[#00FFC2] rounded border border-[#00FFC2]/20">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
              <span className="text-white/30 text-[9px] uppercase font-bold">Access Level Credentials</span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="flex justify-between"><span className="text-white/40">Role Name:</span><span className="text-white font-bold">{row.role.name}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Clearance:</span><span className="text-white font-bold text-amber-400">{row.clearance.split(" ")[2]}</span></div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40 font-semibold uppercase">FIDO2 Token State:</span><span className="text-green-400 font-bold">ACTIVE LOCK</span></div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
