"use client";

import React from "react";
import Link from "next/link";
import { DocumentCard } from "@/components/private-app";
import { ArrowRight, FileText } from "lucide-react";

export default function ClientDocumentsPage() {
  const documents = [
    { id: "DOC-01", title: "Sovereign Core Architectural Blueprint", fileSize: "12.4 MB", type: "PDF", sha256: "0xAB9811C82FFD201A99E8F3C721A0C5E89812A" },
    { id: "DOC-02", title: "SOC2 Compliance Enclave Certificate", fileSize: "4.8 MB", type: "PDF", sha256: "0xFF410D390E8F91B02AA6E8F3C2C77215446C1" },
    { id: "DOC-03", title: "GFF AI Runtime Governance Rules", fileSize: "1.2 MB", type: "PDF", sha256: "0x01DE8A88FF4E201B7FF911A3E2298F390D88B" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Compliance Documents</h2>
          <p className="text-xs text-white/50 mt-1">Cryptographically signed architectural blueprints, SOC2 compliance certs, and secure credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div key={doc.id} className="relative group">
            <DocumentCard
              title={doc.title}
              fileSize={doc.fileSize}
              type={doc.type}
              sha256={doc.sha256}
              onDownload={() => alert(`Initiating secure decapsulated download for ${doc.title}...`)}
            />
            <div className="absolute top-3 right-16 z-20">
              <Link
                href={`/portal/documents/${doc.id}`}
                className="inline-flex h-6 items-center gap-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 px-2 text-[9.5px] font-bold font-mono text-white/80 transition-all cursor-pointer"
              >
                <span>detail</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
