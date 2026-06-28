import React, { useState } from "react";
import { DYNAMODB_SCHEMAS } from "./dynamodb-schemas";

export default function DynamoDbModelingSection() {
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<"gff_portal_items" | "gff_users" | "gff_clients">("gff_portal_items");
  const [selectedEntity, setSelectedEntity] = useState<"projects" | "ai_ops" | "documents" | "invoices" | "support_tickets" | "governance">("projects");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTable = DYNAMODB_SCHEMAS[selectedSchemaTable];
  const activeEntity = activeTable.entities?.[selectedEntity];
  const activeSampleJson = selectedSchemaTable === "gff_portal_items" ? activeEntity?.sampleJson : activeTable.sampleJson;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold text-white tracking-tight uppercase tracking-wider font-mono">
          4. Production AWS Cloud Data Modeling
        </h2>
        <p className="text-[12px] text-white/50 font-light mt-1">
          Inspect the enterprise AWS DynamoDB table schemas and single-table partition modeling engineered for global production environments.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
        <div className="flex flex-wrap gap-2 bg-[#050505]/60 border border-white/5 rounded-xl p-1 mb-6">
          {(["gff_portal_items", "gff_users", "gff_clients"] as const).map((tbl) => (
            <button
              key={tbl}
              onClick={() => setSelectedSchemaTable(tbl)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all uppercase tracking-wider ${
                selectedSchemaTable === tbl
                  ? "bg-white text-black font-semibold shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {DYNAMODB_SCHEMAS[tbl].tableName}
            </button>
          ))}
        </div>

        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="text-[13px] font-mono font-bold text-white">
              Primary Key: <span className="text-[#009DFF]">{activeTable.primaryKey}</span>
            </span>
            <span className="px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#009DFF] bg-[#009DFF]/10 border border-[#009DFF]/20 rounded">
              {selectedSchemaTable === "gff_portal_items" ? "SINGLE-TABLE ARCHITECTURE" : "STANDALONE TABLE"}
            </span>
          </div>
          <p className="text-[12.5px] text-white/70 font-light leading-relaxed">
            <span className="text-white/40 font-mono text-[11px] block uppercase tracking-wider mb-0.5">PURPOSE & SCOPE:</span>
            {activeTable.description}
          </p>
        </div>

        {selectedSchemaTable === "gff_portal_items" && (
          <div className="mb-6">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-2">
              Select Partitioned Entity:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(activeTable.entities || {}) as Array<keyof typeof activeTable.entities>).map((ent) => (
                <button
                  key={ent}
                  onClick={() => setSelectedEntity(ent as any)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono transition-all uppercase tracking-wider border ${
                    selectedEntity === ent
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold"
                      : "border-white/5 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {activeTable.entities?.[ent]?.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 flex flex-col gap-4 w-full">
            <div>
              <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-2">
                Schema Properties
              </h4>
              <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-4 py-2 text-[10px] font-mono text-white/40 uppercase">Attribute</th>
                      <th className="px-4 py-2 text-[10px] font-mono text-white/40 uppercase">Type</th>
                      <th className="px-4 py-2 text-[10px] font-mono text-white/40 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSchemaTable === "gff_portal_items" && activeEntity && (
                      <>
                        <tr className="border-b border-white/5 bg-red-500/5">
                          <td className="px-4 py-2.5 font-mono text-[11px] font-bold text-white">PK</td>
                          <td className="px-4 py-2.5 font-mono text-[10px] text-red-400 font-semibold">String</td>
                          <td className="px-4 py-2.5 text-[11.5px] text-white/70 font-light leading-snug">
                            Partition Key: <code className="bg-white/5 px-1 py-0.5 rounded text-white/90">{activeEntity.pk}</code>
                          </td>
                        </tr>
                        <tr className="border-b border-white/5 bg-blue-500/5">
                          <td className="px-4 py-2.5 font-mono text-[11px] font-bold text-white">SK</td>
                          <td className="px-4 py-2.5 font-mono text-[10px] text-blue-400 font-semibold">String</td>
                          <td className="px-4 py-2.5 text-[11.5px] text-white/70 font-light leading-snug">
                            Sort Key: <code className="bg-white/5 px-1 py-0.5 rounded text-white/90">{activeEntity.sk}</code>
                          </td>
                        </tr>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                          <td className="px-4 py-2.5 font-mono text-[11px] text-white/80">GSI1PK</td>
                          <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">String</td>
                          <td className="px-4 py-2.5 text-[11.5px] text-white/60 font-light leading-snug">
                            GSI Partition: <code className="bg-white/5 px-1 py-0.5 rounded text-white/80">{activeEntity.gsi1pk}</code>
                          </td>
                        </tr>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                          <td className="px-4 py-2.5 font-mono text-[11px] text-white/80">GSI1SK</td>
                          <td className="px-4 py-2.5 font-mono text-[10px] text-white/40">String</td>
                          <td className="px-4 py-2.5 text-[11.5px] text-white/60 font-light leading-snug">
                            GSI Sort: <code className="bg-white/5 px-1 py-0.5 rounded text-white/80">{activeEntity.gsi1sk}</code>
                          </td>
                        </tr>
                      </>
                    )}

                    {(selectedSchemaTable === "gff_portal_items" ? activeEntity?.attributes : activeTable.attributes)?.map((attr) => (
                      <tr key={attr.name} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-white/90 font-medium">{attr.name}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-white/50">{attr.type}</td>
                        <td className="px-4 py-2.5 text-[11.5px] text-white/60 font-light leading-snug">{attr.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-mono text-white/30 uppercase tracking-widest">
                Production Item Payload (JSON)
              </h4>
              <button
                onClick={() => activeSampleJson && copyToClipboard(activeSampleJson)}
                className="text-[9px] font-mono text-[#009DFF] hover:text-white uppercase tracking-wider transition-colors"
              >
                {copied ? "Copied" : "Copy Payload"}
              </button>
            </div>

            <div className="font-mono text-[11px] text-white/85 leading-relaxed bg-black/50 rounded-xl p-5 border border-white/5 overflow-x-auto max-h-[340px] overflow-y-auto w-full">
              <pre className="whitespace-pre">{activeSampleJson}</pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
