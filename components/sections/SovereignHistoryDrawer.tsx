"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";

export interface SavedBlueprint {
  id: string;
  timestamp: string;
  data: any;
  score: number;
  category: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedBlueprint[];
  onPurge: () => void;
  onDeleteSingle: (id: string) => void;
  onLoadItem: (item: SavedBlueprint) => void;
  historyLoadedId: string | null;
}

export function SovereignHistoryDrawer({
  isOpen, onClose, savedList, onPurge, onDeleteSingle, onLoadItem, historyLoadedId
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 z-40 print:hidden cursor-pointer"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#03060c] border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl print:hidden"
          >
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-[#087DF3] uppercase tracking-widest block">Client Edge Cache</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Vault History</h3>
                </div>
                <button type="button" onClick={onClose} className="text-white/50 hover:text-white cursor-pointer">✕</button>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/10 text-[11px] text-white/60 leading-relaxed">
                <span className="font-bold text-emerald-400 font-mono text-[10px] uppercase block">🔒 100% Zero-Snoop Sandbox</span>
                <p>Blueprint data is strictly stored inside your local browser. No data is ever uploaded or shared.</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">RECENTLY SAVED ASSESSMENTS</span>
                {savedList.length === 0 ? (
                  <p className="text-xs text-white/40 text-center py-8">No saved blueprints yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {savedList.map((item) => {
                      const isCurrentlyLoaded = historyLoadedId === item.id;
                      return (
                        <div key={item.id} className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${isCurrentlyLoaded ? "bg-[#087DF3]/5 border-[#087DF3]/35 shadow-lg" : "bg-white/[0.02] border-white/5 hover:border-white/15"}`}>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <span className="text-[9px] font-mono text-[#087DF3] font-bold block">{item.data.email}</span>
                              <span className="text-xs font-extrabold text-white leading-tight block mt-0.5">{item.data.industry} Vertical</span>
                              <span className="text-[10px] font-mono text-white/40 block mt-0.5">{item.timestamp}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold bg-white/[0.04] text-white border border-white/10 px-2 py-1 rounded block">{item.score} / 100</span>
                              <span className="text-[8px] font-mono text-white/40 uppercase block mt-1">{item.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 border-t border-white/5 pt-3">
                            <button type="button" onClick={() => onLoadItem(item)} className="flex-1 h-8 rounded bg-white/5 hover:bg-[#087DF3]/15 hover:text-white text-white/70 border border-white/10 text-[10px] font-mono font-bold uppercase cursor-pointer">Reload Blueprint</button>
                            <button type="button" onClick={() => onDeleteSingle(item.id)} className="w-8 h-8 rounded bg-white/5 hover:bg-red-500/15 text-white/60 hover:text-red-400 flex items-center justify-center cursor-pointer">✕</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {savedList.length > 0 && (
              <div className="border-t border-white/5 pt-4 mt-6">
                <button type="button" onClick={onPurge} className="w-full h-10 rounded border border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10 text-[10px] font-mono font-bold uppercase transition cursor-pointer">Purge All Saved Blueprints</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}