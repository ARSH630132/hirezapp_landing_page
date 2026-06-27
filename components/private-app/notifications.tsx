"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, AlertCircle, Info, CheckCircle, X } from "lucide-react";
import { SystemNotification } from "./types";

export function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "1",
      title: "eBPF System Alert",
      desc: "RETAIL-CORE-A1 memory load exceeded 85% safety threshold.",
      severity: "high",
      timestamp: "2 mins ago",
      unread: true,
    },
    {
      id: "2",
      title: "ISO-27001 Cryptographic Handshake",
      desc: "Zero-trust tunnel session successfully signed.",
      severity: "low",
      timestamp: "15 mins ago",
      unread: true,
    },
    {
      id: "3",
      title: "Ledger Settlement Complete",
      desc: "Receipt GFF-2026-0899 cryptographically verified.",
      severity: "medium",
      timestamp: "2 hours ago",
      unread: false,
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

 const markAllRead = () => {
  setNotifications([]);
};

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative h-9 w-9 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/[0.03] flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF]/30"
        aria-label="System notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E4000F] shadow-[0_0_8px_rgba(228,0,15,0.6)]" />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-white/5 bg-[#0a0a0a]/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-2.5 font-mono">
                <span className="text-[12px] font-bold text-white tracking-wider">SYSTEM EVENTS</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] text-[#009DFF] hover:underline cursor-pointer"
                  >
                    Clear Badges
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-[11px] font-mono text-white/30">
                  No active high-integrity events
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                      }}
                      className={`relative p-2.5 rounded-lg border border-white/5 bg-[#020202]/50 hover:bg-[#020202]/85 hover:border-white/10 transition-all cursor-pointer ${notif.unread ? "border-l-2 border-l-[#009DFF]" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2 font-sans">
                        <div className="flex gap-1.5 items-center">
                          {notif.severity === "high" && <AlertCircle className="w-3.5 h-3.5 text-[#E4000F] shrink-0" />}
                          {notif.severity === "medium" && <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          {notif.severity === "low" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          <span className="text-[11.5px] font-bold text-white leading-tight">{notif.title}</span>
                        </div>
                        <button 
                          onClick={(e) => deleteNotification(notif.id, e)}
                          className="text-white/20 hover:text-white/60 text-[10px] p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/50 mt-1 font-mono leading-relaxed">{notif.desc}</p>
                      <div className="text-[9px] text-white/30 font-mono mt-1.5 text-right">{notif.timestamp}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
