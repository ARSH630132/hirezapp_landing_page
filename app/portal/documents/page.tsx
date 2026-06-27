"use client";

import React from "react";
import { DataTable, previewDocuments, TableColumn, DocumentItem } from "@/components/private-app";

export default function ClientDocumentsPage() {
  const columns: TableColumn<DocumentItem>[] = [
    { key: "id", header: "Document ID", sortable: true },
    { key: "name", header: "Document Name", sortable: true },
    { key: "size", header: "File Size" },
    { key: "format", header: "Format", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "clearanceLevel", header: "Clearance Level", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Compliance Documents</h2>
        <p className="text-xs text-white/50 mt-1">Cryptographically signed architectural blueprints, SOC2 compliance certs, and secure credentials.</p>
      </div>

      <DataTable 
        columns={columns}
        data={previewDocuments}
        pageSize={5}
        searchPlaceholder="Search documents by ID, name, or category..."
        searchKeys={["id", "name", "category", "format", "clearanceLevel"]}
        statusField="clearanceLevel"
        typeField="category"
        categoryLabel="DOCUMENT CRYPTO SEAL"
        detailTitle={(row) => row.name}
      />
    </div>
  );
}
