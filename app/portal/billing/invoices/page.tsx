"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DataTable, previewInvoices, TableColumn, Invoice } from "@/components/private-app";

export default function ClientInvoicesPage() {
  const columns: TableColumn<Invoice>[] = [
    { key: "id", header: "Invoice ID", sortable: true },
    { key: "category", header: "Epoch Type", sortable: true },
    { key: "amount", header: "Amount", sortable: true },
    { key: "date", header: "Settled Date", sortable: true },
    { key: "dueDate", header: "Due Date" },
    { key: "status", header: "Status", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/portal/billing"
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Invoice Ledger</h2>
          <p className="text-xs text-white/50 mt-1">Verified billing statements and commercial transaction receipts.</p>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={previewInvoices}
        pageSize={5}
        searchPlaceholder="Filter billing statement IDs or epochs..."
        searchKeys={["id", "category", "amount", "status"]}
        statusField="status"
        typeField="category"
        categoryLabel="TREASURY CERTIFICATE"
        detailTitle={(row) => `Invoice: ${row.id}`}
      />
    </div>
  );
}
