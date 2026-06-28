/**
 * GFF AI - Secure Private Portal & Admin API Client
 * Built for 2026 Enterprise-Grade Sovereign Platforms
 * 
 * Fully client-safe, SSR-safe, and dependency-free (native fetch).
 * Implements bearer token storage, JSON request helper with automatic 401 logout,
 * and typed modular domain interfaces for frontend integration.
 */

// ============================================================================
// DATA INTERFACES
// ============================================================================

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  clientAssociation: string;
  status: "active" | "inactive";
  clearance: string;
  permissions: string[];
}

export interface ApiProject {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  phase: string;
  status: string;
  health: string;
  owner: string;
  nodesCount: number;
  enclaveType: string;
  desc: string;
  lastUpdated: string;
}

export interface ApiAiOperation {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  project_id: string;
  status: string;
  health: string;
  agent_type: string;
  governance_status: string;
  owner: string;
  desc: string;
  lastUpdated: string;
}

export interface ApiInvoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  project_id?: string;
  project_name?: string;
  amount: number;
  currency: string;
  status: "paid" | "unpaid" | "processing" | "void";
  issue_date: string;
  due_date: string;
  category: string;
  hash: string;
  signature: string;
  description: string;
  lastUpdated: string;
}

export interface ApiGovernanceItem {
  id: string;
  client_id: string;
  client_name?: string;
  project_id?: string;
  project_name?: string;
  title: string;
  severity: string;
  status: string;
  owner: string;
  due_date: string;
  description: string;
  nodeId?: string;
  standard?: string;
  hash?: string;
  logs?: string[];
  lastUpdated?: string;
}

export interface ApiDocumentItem {
  id: string;
  title: string;
  fileSize: string;
  type: string;
  sha256: string;
  client_id: string;
  client_name: string;
  projectId?: string;
  status: "Verified" | "Under Review" | "Action Required" | "Superseded" | string;
  owner: string;
  version: string;
  lastUpdated: string;
  description: string;
}

export interface ApiSupportTicket {
  id: string;
  subject: string;
  client_id: string;
  client_name: string;
  priority: string;
  category: string;
  status: "INVESTIGATING" | "OPEN" | "RESOLVED" | "IN_PROGRESS" | string;
  assignedAgent: string;
  linkedProjectId?: string;
  linkedDocId?: string;
  slaSeconds: number;
  description: string;
  createdDate: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  status: string;
  tier: string;
  region: string;
  createdAt: string;
}

// ============================================================================
// CORE AUTHORIZATION & FETCH UTILITIES
// ============================================================================

const TOKEN_KEY = "gff_api_token";

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") return `${window.location.origin}/api/v1`;
  return "http://localhost:3000/api/v1";
};

export const getStoredToken = (): string | null => typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
export const setStoredToken = (token: string): void => { if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token); };
export const clearStoredToken = (): void => { if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY); };

export async function ensureValidToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return getStoredToken();
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  await ensureValidToken();
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/${path.replace(/^\//, "")}`, { ...options, headers });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      clearStoredToken();
      localStorage.removeItem("gff_ai_access_token");
      window.location.href = window.location.pathname.includes("/admin") ? "/admin/login" : "/portal/login";
    }
    throw new Error("Unauthorized access. Access token cleared.");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || errorBody?.error || `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// SUB-CLIENT MODULES
// ============================================================================

export const auth = {
  login: async (creds: { email: string; password?: string }): Promise<{ success: boolean; accessToken: string; user: ApiUser }> => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (data.success && data.accessToken) setStoredToken(data.accessToken);
    return data;
  },
  logout: async (): Promise<{ success: boolean }> => {
    try { await fetch("/api/v1/auth/logout", { method: "POST" }); } catch { /* Ignore */ } finally { clearStoredToken(); }
    return { success: true };
  },
  me: async (): Promise<{ success: boolean; user: ApiUser }> => {
    const token = getStoredToken();
    const res = await fetch("/api/v1/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return res.json();
  },
};

export const dashboard = {
  getAdminSummary: async (): Promise<any> => request<any>("/dashboard/admin"),
  getClientSummary: async (clientId?: string): Promise<any> => {
    const path = clientId ? `/dashboard/client?client_id=${encodeURIComponent(clientId)}` : "/dashboard/client";
    return request<any>(path);
  },
};

export const clients = {
  list: async (): Promise<{ success: boolean; clients: ClientAccount[] }> => request<{ success: boolean; clients: ClientAccount[] }>("/clients"),
  get: async (id: string): Promise<{ success: boolean; client: ClientAccount }> => request<{ success: boolean; client: ClientAccount }>(`/clients/${encodeURIComponent(id)}`),
};

export const users = {
  list: async (filters?: any): Promise<{ success: boolean; users: ApiUser[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; users: ApiUser[] }>(`/users${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; user: ApiUser }> => request<{ success: boolean; user: ApiUser }>(`/users/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiUser> & { password?: string }): Promise<{ success: boolean; user: ApiUser }> => request<{ success: boolean; user: ApiUser }>("/users", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiUser> & { password?: string }): Promise<{ success: boolean; user: ApiUser }> => request<{ success: boolean; user: ApiUser }>(`/users/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: string): Promise<{ success: boolean; message: string }> => request<{ success: boolean; message: string }>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" }),
  updateRole: async (id: string, role: string): Promise<{ success: boolean; user: ApiUser }> => request<{ success: boolean; user: ApiUser }>(`/users/${encodeURIComponent(id)}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  updateStatus: async (id: string, status: "active" | "inactive"): Promise<{ success: boolean; user: ApiUser }> => request<{ success: boolean; user: ApiUser }>(`/users/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export const projects = {
  list: async (filters?: any): Promise<{ success: boolean; projects: ApiProject[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; projects: ApiProject[] }>(`/projects${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; project: ApiProject }> => request<{ success: boolean; project: ApiProject }>(`/projects/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiProject>): Promise<{ success: boolean; project: ApiProject }> => request<{ success: boolean; project: ApiProject }>("/projects", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiProject>): Promise<{ success: boolean; project: ApiProject }> => request<{ success: boolean; project: ApiProject }>(`/projects/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: string): Promise<{ success: boolean; message: string }> => request<{ success: boolean; message: string }>(`/projects/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const aiOperations = {
  list: async (filters?: any): Promise<{ success: boolean; operations: ApiAiOperation[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; operations: ApiAiOperation[] }>(`/ai-operations${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; operation: ApiAiOperation }> => request<{ success: boolean; operation: ApiAiOperation }>(`/ai-operations/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiAiOperation>): Promise<{ success: boolean; operation: ApiAiOperation }> => request<{ success: boolean; operation: ApiAiOperation }>("/ai-operations", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiAiOperation>): Promise<{ success: boolean; operation: ApiAiOperation }> => request<{ success: boolean; operation: ApiAiOperation }>(`/ai-operations/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: string): Promise<{ success: boolean; message: string }> => request<{ success: boolean; message: string }>(`/ai-operations/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const documents = {
  list: async (filters?: any): Promise<{ success: boolean; documents: ApiDocumentItem[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; documents: ApiDocumentItem[] }>(`/documents${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; document: ApiDocumentItem }> => request<{ success: boolean; document: ApiDocumentItem }>(`/documents/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiDocumentItem>): Promise<{ success: boolean; document: ApiDocumentItem }> => request<{ success: boolean; document: ApiDocumentItem }>("/documents", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiDocumentItem>): Promise<{ success: boolean; document: ApiDocumentItem }> => request<{ success: boolean; document: ApiDocumentItem }>(`/documents/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: string): Promise<{ success: boolean; message: string }> => request<{ success: boolean; message: string }>(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" })
};

export const invoices = {
  list: async (filters?: any): Promise<{ success: boolean; invoices: ApiInvoice[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; invoices: ApiInvoice[] }>(`/invoices${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; invoice: ApiInvoice }> => request<{ success: boolean; invoice: ApiInvoice }>(`/invoices/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiInvoice>): Promise<{ success: boolean; invoice: ApiInvoice }> => request<{ success: boolean; invoice: ApiInvoice }>("/invoices", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiInvoice>): Promise<{ success: boolean; invoice: ApiInvoice }> => request<{ success: boolean; invoice: ApiInvoice }>(`/invoices/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: async (id: string): Promise<{ success: boolean; message: string }> => request<{ success: boolean; message: string }>(`/invoices/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const support = {
  list: async (filters?: any): Promise<{ success: boolean; tickets: ApiSupportTicket[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; tickets: ApiSupportTicket[] }>(`/support${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; ticket: ApiSupportTicket }> => request<{ success: boolean; ticket: ApiSupportTicket }>(`/support/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiSupportTicket>): Promise<{ success: boolean; ticket: ApiSupportTicket }> => request<{ success: boolean; ticket: ApiSupportTicket }>("/support", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiSupportTicket>): Promise<{ success: boolean; ticket: ApiSupportTicket }> => request<{ success: boolean; ticket: ApiSupportTicket }>(`/support/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) })
};

export const governance = {
  list: async (filters?: any): Promise<{ success: boolean; governance: ApiGovernanceItem[] }> => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return request<{ success: boolean; governance: ApiGovernanceItem[] }>(`/governance${query}`);
  },
  get: async (id: string): Promise<{ success: boolean; governance: ApiGovernanceItem }> => request<{ success: boolean; governance: ApiGovernanceItem }>(`/governance/${encodeURIComponent(id)}`),
  create: async (data: Partial<ApiGovernanceItem>): Promise<{ success: boolean; governance: ApiGovernanceItem }> => request<{ success: boolean; governance: ApiGovernanceItem }>("/governance", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<ApiGovernanceItem>): Promise<{ success: boolean; governance: ApiGovernanceItem }> => request<{ success: boolean; governance: ApiGovernanceItem }>(`/governance/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; governance: ApiGovernanceItem }> => request<{ success: boolean; governance: ApiGovernanceItem }>(`/governance/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export const analytics = {
  getAdminAnalytics: async (): Promise<any> => request<any>("/analytics/admin"),
  getClientAnalytics: async (clientId?: string): Promise<any> => {
    const path = clientId ? `/analytics/client?client_id=${encodeURIComponent(clientId)}` : "/analytics/client";
    return request<any>(path);
  },
};

// ============================================================================
// COMBINED SYSTEM CLIENT
// ============================================================================

export const apiClient = {
  getApiBaseUrl,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  request,
  auth,
  dashboard,
  clients,
  users,
  projects,
  aiOperations,
  documents,
  invoices,
  support,
  governance,
  analytics,
};

export default apiClient;
