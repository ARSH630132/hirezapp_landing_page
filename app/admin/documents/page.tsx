"use client";

import React from "react";
import { DocumentCard } from "@/components/private-app";
import { FileText } from "lucide-react";

export default function AdminDocumentsPage() {
  const documents = [
    { title: "Sovereign Core Architectural Blueprint", fileSize: "12.4 MB", type: "PDF", sha256: "0xAB9811C82FFD201A99E8F3C721A0C5E89812A" },
    { title: "SOC2 Compliance Enclave Certificate", fileSize: "4.8 MB", type: "PDF", sha256: "0xFF410D390E8F91B02AA6E8F3C2C77215446C1" },
    { title: "GFF AI Runtime Governance Rules", fileSize: "1.2 MB", type: "PDF", sha256: "0x01DE8A88FF4E201B7FF911A3E2298F390D88B" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">System Document Registry</h2>
          <p className="text-xs text-white/50 mt-1">Audit, edit, and upload system-wide architectural specifications and compliance documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.title}
            title={doc.title}
            fileSize={doc.fileSize}
            type={doc.type}
            sha256={doc.sha256}
            onDownload={() => alert(`Pulling administrator secure file copy for ${doc.title}...`)}
          />
        ))}
      </div>
    </div>
  );
}
