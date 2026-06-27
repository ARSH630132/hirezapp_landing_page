"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowLeft, RefreshCw, Key } from "lucide-react";
import { 
  getPreviewSession, 
  canAccessPortalSection, 
  canAccessAdminSection, 
  PreviewSession 
} from "@/lib/preview-auth";

export function PreviewRouteGuard({ children, type }: { children: React.ReactNode; type: "portal" | "admin" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<PreviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeSec, setActiveSec] = useState("");

  useEffect(() => {
    const verifyAccess = () => {
      const s = getPreviewSession();
      setSession(s);
      if (!s) {
        setHasAccess(false);
        setLoading(false);
        setTimeout(() => router.push("/login"), 800);
        return;
      }
      const segments = pathname.split("/");
      const sec = segments[2] || "dashboard";
      setActiveSec(sec);
      const ok = type === "portal" ? canAccessPortalSection(s.role, sec) : canAccessAdminSection(s.role, sec);
      setHasAccess(ok);
      setLoading(false);
    };

    verifyAccess();
    const cb = () => verifyAccess();
    window.addEventListener("gff_preview_session_changed", cb);
    return () => window.removeEventListener("gff_preview_session_changed", cb);
  }, [pathname, router, type]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#009DFF] animate-spin mx-auto" />
          <p className="text-[10px] uppercase text-white/40">Verifying Sandbox Clearance...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col items-center justify-center font-mono p-4">
        <div className="max-w-md w-full p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-md text-center space-y-4">
          <Lock className="w-8 h-8 text-red-400 mx-auto" />
          <span className="text-[8px] text-red-500 bg-red-500/5 border border-red-500/15 px-2.5 py-0.5 rounded-full font-bold">AUTHENTICATION REQUIRED</span>
          <h2 className="text-xs font-bold uppercase">Enclave Session Expired</h2>
          <p className="text-[10px] text-white/50">No simulated preview session detected. Please authenticate.</p>
          <button onClick={() => router.push("/login")} className="w-full h-10 rounded-lg bg-white text-black font-bold text-[10px] uppercase">
            Go to Identity Gateway
          </button>
          <div className="text-[8px] text-white/30 bg-white/[0.01] p-2 border border-white/5 rounded-lg">
            <strong>FRONTEND PREVIEW ONLY:</strong> No server-side auth exists. OAuth connects in backend phase.
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center font-mono p-4">
        <div className="max-w-xl w-full p-6 rounded-[20px] border border-red-500/15 bg-[#050505]/60 backdrop-blur-md space-y-5 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <div>
              <span className="text-[8px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-bold uppercase">RESTRICTED BOUNDARY</span>
              <h2 className="text-xs font-bold uppercase text-white">Clearance Insufficient</h2>
            </div>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Simulated role <strong className="text-red-400">{session.role.toUpperCase()}</strong> cannot access <strong className="text-white">/{type}/{activeSec}</strong>.
            This demonstrates GFF AI's multi-tenant RBAC separation. Use the top-right switcher to bypass.
          </p>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] space-y-1">
            <div className="text-white font-bold">Session ID: {session.name}</div>
            <div className="text-white/45">Role Level: {session.clearance}</div>
          </div>
          <button onClick={() => router.push(type === "portal" ? "/portal/dashboard" : "/admin/dashboard")} className="w-full h-10 rounded-lg border border-white/10 text-white text-[10px] font-bold uppercase">
            Return to Dashboard
          </button>
          <p className="text-center text-[8px] text-white/30"><strong>FRONTEND PREVIEW ONLY:</strong> Production auth connects in the backend phase.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
