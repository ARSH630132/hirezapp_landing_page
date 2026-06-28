"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, RefreshCw, Shield, UserPlus } from "lucide-react";

type RegisterClient = {
  id: string;
  name: string;
};

export default function SecureLogin({ defaultRole }: { defaultRole?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminLogin = defaultRole === "Administrator";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerRole, setRegisterRole] = useState<"client_admin" | "client_member">("client_member");
  const [registerClientId, setRegisterClientId] = useState("");
  const [registerClients, setRegisterClients] = useState<RegisterClient[]>([]);
  const [registerClientsLoading, setRegisterClientsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isAdminLogin) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") === "register" ? "register" : "login");
  }, [isAdminLogin]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "", password: "" }),
        });
        setApiConnected(res.status === 400 || res.status === 401 || res.ok);
      } catch (err) {
        setApiConnected(false);
      }
    };
    checkApiStatus();
  }, []);

  useEffect(() => {
    if (mode !== "register" || isAdminLogin) {
      return;
    }

    let ignore = false;
    const loadClients = async () => {
      setRegisterClientsLoading(true);
      try {
        const response = await fetch("/api/v1/auth/register");
        const payload = await response.json().catch(() => null);
        if (!ignore && response.ok && payload?.success) {
          const clients = payload.clients || [];
          setRegisterClients(clients);
          setRegisterClientId((current) => current || clients[0]?.id || "");
        }
      } catch (err) {
        if (!ignore) {
          setRegisterClients([]);
        }
      } finally {
        if (!ignore) {
          setRegisterClientsLoading(false);
        }
      }
    };

    loadClients();
    return () => {
      ignore = true;
    };
  }, [mode, isAdminLogin]);

  const updateMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setError("");
    setInfo("");
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (nextMode === "register") {
      params.set("mode", "register");
    } else {
      params.delete("mode");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const completeLogin = async (accessToken: string) => {
    localStorage.setItem("gff_ai_access_token", accessToken);
    localStorage.setItem("gff_api_token", accessToken);

    const meRes = await fetch("/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const meData = await meRes.json().catch(() => null);
    if (!meRes.ok || !meData?.success || !meData?.user) {
      throw new Error(meData?.message || "Signed in, but we could not load your account.");
    }

    const user = meData.user;
    router.push(user.role === "gff_admin" ? "/admin/dashboard" : "/portal/dashboard");
  };

  const handlePasswordLogin = async () => {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !payload?.accessToken) {
      throw new Error(payload?.message || "We could not sign you in.");
    }
    await completeLogin(payload.accessToken);
  };

  const handleOtpLogin = async () => {
    const response = await fetch("/api/v1/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", email: email.trim(), code: otpCode.trim() }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !payload?.accessToken) {
      throw new Error(payload?.message || "The sign-in code was not accepted.");
    }
    await completeLogin(payload.accessToken);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      if (authMethod === "password") {
        await handlePasswordLogin();
      } else {
        await handleOtpLogin();
      }
    } catch (err: any) {
      setError(err.message || "We could not sign you in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/v1/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: email.trim() }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not send a sign-in code.");
      }
      setInfo(payload.message || "A sign-in code has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "We could not send a sign-in code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName.trim(),
          email: email.trim(),
          password,
          role: registerRole,
          client_id: registerClientId,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not create your account.");
      }
      setInfo(payload.message || "Account created successfully. You can sign in now.");
      updateMode("login");
      setAuthMethod("password");
      setOtpCode("");
    } catch (err: any) {
      setError(err.message || "We could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#010101] text-zinc-100 flex flex-col items-center justify-center relative px-4 py-8 md:py-16 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(228, 0, 15, 0.04) 0%, transparent 45%),
              radial-gradient(circle at 90% 80%, rgba(0, 157, 255, 0.04) 0%, transparent 45%),
              linear-gradient(rgba(255, 255, 255, 0.005) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.005) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 45px 45px, 45px 45px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#009DFF]/3 to-[#E4000F]/3 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <header className="absolute top-0 left-0 right-0 h-20 w-full z-20 flex justify-between items-center px-6 lg:px-16 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src="/footer/logo.svg" alt="GFF AI Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col text-left">
            <span className="text-white text-base font-semibold tracking-wider leading-none">GFF AI</span>
            <span className="text-[7.5px] font-bold tracking-[0.1em] mt-1 text-zinc-400">
              <span className="text-[#E4000F]">GARAGE</span> | FOUNDRY | <span className="text-[#009DFF]">FACTORY</span>
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono font-bold tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#009DFF] rounded px-2 py-1"
        >
          ← RETURN TO WEBSITE
        </Link>
      </header>

      <main className="w-full max-w-[980px] z-10 mt-14">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wider text-white uppercase">
            {mode === "register" ? "Create Your Account" : isAdminLogin ? "Admin Sign In" : "Client Sign In"}
          </h1>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            {mode === "register"
              ? "Create a client account to access your projects, documents, billing, and support."
              : "Sign in to continue to your dashboard."}
          </p>
        </div>

        <div className="border border-zinc-800/80 bg-zinc-950/45 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/60">
            <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                <div>
                  <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    {mode === "register" ? <UserPlus className="w-3.5 h-3.5 text-[#009DFF]" /> : <Shield className="w-3.5 h-3.5 text-[#009DFF]" />}
                    {mode === "register" ? "Create account" : "Account access"}
                  </h2>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {mode === "register" ? "Enter your details to set up a client account." : "Use your email and password or request a sign-in code."}
                  </p>
                </div>
                {apiConnected === true ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold tracking-widest">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    SERVICE ONLINE
                  </div>
                ) : apiConnected === false ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/5 border border-rose-500/20 text-rose-300 text-[8px] font-mono font-bold tracking-widest">
                    <span className="h-1 w-1 rounded-full bg-rose-300" />
                    SERVICE CHECK FAILED
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-500/5 border border-zinc-800 text-zinc-400 text-[8px] font-mono font-bold tracking-widest">
                    <RefreshCw className="w-2 h-2 animate-spin text-zinc-500" />
                    CHECKING
                  </div>
                )}
              </div>

              {mode === "login" ? (
                <>
                  <div className="flex bg-zinc-950/90 p-1 rounded-lg border border-zinc-900" role="tablist" aria-label="Sign-in method">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMethod === "password"}
                      onClick={() => {
                        setAuthMethod("password");
                        setError("");
                        setInfo("");
                      }}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                        authMethod === "password"
                          ? "bg-zinc-900 text-white shadow-sm border border-zinc-850"
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMethod === "otp"}
                      onClick={() => {
                        setAuthMethod("otp");
                        setError("");
                        setInfo("");
                      }}
                      className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                        authMethod === "otp"
                          ? "bg-zinc-900 text-white shadow-sm border border-zinc-850"
                          : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                      }`}
                    >
                      Email Code
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="auth-email" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                        Email
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                        required
                      />
                    </div>

                    {authMethod === "password" ? (
                      <div className="space-y-1.5">
                        <label htmlFor="auth-pass" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="auth-pass"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full h-10 pl-3 pr-10 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <label htmlFor="auth-otp" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                            Sign-in code
                          </label>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="px-2 py-0.5 rounded bg-[#009DFF]/10 border border-[#009DFF]/20 text-[#009DFF] font-mono text-[8.5px] font-bold tracking-wider hover:bg-[#009DFF]/25 transition-colors"
                            disabled={loading}
                          >
                            Send code
                          </button>
                        </div>
                        <input
                          id="auth-otp"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Enter the 6-digit code"
                          className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                          required
                        />
                      </div>
                    )}

                    {error ? (
                      <div className="p-3 bg-rose-950/20 border border-rose-900/35 text-rose-300 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    ) : null}

                    {info ? (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-900/35 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{info}</span>
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      className="w-full h-10 rounded-lg bg-[#009DFF] hover:bg-[#0086db] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                      disabled={loading}
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      {loading ? "Signing in" : "Sign in"}
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="register-name" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                      Full name
                    </label>
                    <input
                      id="register-name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="register-email" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                      Email
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="register-role" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                        Role
                      </label>
                      <select
                        id="register-role"
                        value={registerRole}
                        onChange={(e) => setRegisterRole(e.target.value as "client_admin" | "client_member")}
                        className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs transition-all outline-none"
                      >
                        <option value="client_member">Client member</option>
                        <option value="client_admin">Client admin</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="register-client" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                        Client
                      </label>
                      <select
                        id="register-client"
                        value={registerClientId}
                        onChange={(e) => setRegisterClientId(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs transition-all outline-none"
                        disabled={registerClientsLoading}
                      >
                        {registerClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="register-password" className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Use at least 8 characters"
                        className="w-full h-10 pl-3 pr-10 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF] text-zinc-200 text-xs placeholder-zinc-700 transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {error ? (
                    <div className="p-3 bg-rose-950/20 border border-rose-900/35 text-rose-300 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  {info ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/35 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{info}</span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-[#009DFF] hover:bg-[#0086db] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {loading ? "Creating account" : "Create account"}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 p-6 md:p-8 bg-zinc-950/20 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {mode === "register" ? <UserPlus className="w-4 h-4 text-[#009DFF]" /> : <Mail className="w-4 h-4 text-[#009DFF]" />}
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {mode === "register" ? "Need a new account?" : "Quick help"}
                    </h3>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                    {mode === "register"
                      ? "Choose your client, create your account, and then sign in from this page."
                      : authMethod === "otp"
                        ? "Choose email code if you want a one-time sign-in code sent to your inbox."
                        : "Use your work email and password to sign in."}
                  </p>
                </div>

                {!isAdminLogin ? (
                  <div className="p-3 rounded-xl border border-[#009DFF]/15 bg-[#009DFF]/5 text-zinc-300 text-[10.5px] leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#009DFF] uppercase tracking-wider text-[9px]">
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      Account access
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      Client users can view their own projects, AI operations, documents, billing, support, analytics, and governance items.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-[#009DFF]/15 bg-[#009DFF]/5 text-zinc-300 text-[10.5px] leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#009DFF] uppercase tracking-wider text-[9px]">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      Admin access
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      Admin users can manage clients, users, projects, AI operations, documents, billing, support, analytics, and governance.
                    </p>
                  </div>
                )}

                {mode === "login" && !isAdminLogin ? (
                  <button
                    type="button"
                    onClick={() => updateMode("register")}
                    className="w-full p-3 rounded-xl border border-zinc-800/60 bg-zinc-950/20 hover:bg-zinc-900/40 hover:border-zinc-700 text-left transition-all"
                  >
                    <p className="text-[12px] font-semibold text-white">Create a new client account</p>
                    <p className="text-[10px] text-zinc-400">Register here if you do not already have sign-in details.</p>
                  </button>
                ) : null}
              </div>

              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-3 text-[10px] text-zinc-500">
                <span>{mode === "register" ? "Already have an account?" : "Need a new client account?"}</span>
                {isAdminLogin ? (
                  <Link href="/portal/login?mode=register" className="text-[#009DFF] hover:underline">
                    Create client account
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateMode(mode === "login" ? "register" : "login")}
                    className="text-[#009DFF] hover:underline"
                  >
                    {mode === "login" ? "Create account" : "Back to sign in"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
