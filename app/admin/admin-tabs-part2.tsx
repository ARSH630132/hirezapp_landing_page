"use client";

import React from "react";
import { PrivatePageHeader, InvoiceCard, SupportTicketCard } from "@/components/private-app";

// ==========================================
// 4. FINANCIAL LEDGER TAB
// ==========================================
export function FinancialLedgerTab() {
  return (
    <div className="space-y-6">
      <PrivatePageHeader 
        title="Cryptographically Signed Ledger Invoices" 
        desc="Verify payment blocks and download certified PDF compliance receipts."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <InvoiceCard 
          invoiceNo="GFF-2026-0899" 
          issueDate="BLOCK #14421" 
          amount="Ξ 4.120" 
          status="verified" 
          signature="SHA_992ADF93EE" 
        />
        <InvoiceCard 
          invoiceNo="GFF-2026-0898" 
          issueDate="BLOCK #14299" 
          amount="Ξ 2.450" 
          status="settled" 
          signature="SHA_881BCF12DD" 
        />
        <InvoiceCard 
          invoiceNo="GFF-2026-0897" 
          issueDate="BLOCK #14120" 
          amount="Ξ 1.180" 
          status="pending" 
          signature="SHA_002ECA9291" 
        />
      </div>
    </div>
  );
}

// ==========================================
// 5. SLA TICKETS TAB
// ==========================================
export function SlaTicketsTab() {
  return (
    <div className="space-y-6">
      <PrivatePageHeader 
        title="Enterprise Priority Support Wires" 
        desc="Maintain zero-trust, completely auditable contact with GFF core engineers."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SupportTicketCard 
          ticketId="T-882" 
          subject="London core node replication delay above SLA threshold" 
          slaTimer="00h:14m:22s" 
          priority="P1" 
          status="INVESTIGATING" 
        />
        <SupportTicketCard 
          ticketId="T-881" 
          subject="Request for specialized auto-scaling GPU limits" 
          slaTimer="03h:11m:00s" 
          priority="P2" 
          status="OPEN" 
        />
      </div>
    </div>
  );
}
