const API_URL = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL || "/api");
const TOKEN_KEY = "postorbitAdminToken";

const parseResponse = async (response, fallback) => {
  const body = await response.text();
  let result;
  try { result = body ? JSON.parse(body) : {}; }
  catch { throw new Error(`API returned a non-JSON response (HTTP ${response.status}). Check the server terminal.`); }
  if (!response.ok) throw new Error(result.message || `${fallback} (HTTP ${response.status})`);
  if (!body) throw new Error(`API returned an empty response (HTTP ${response.status}).`);
  return result;
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return parseResponse(response, "Request failed");
};

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials),
  });
  const result = await parseResponse(response, "Unable to sign in");
  if (!result.token) throw new Error("No token received from server. Please try again.");
  localStorage.setItem(TOKEN_KEY, result.token);
  return result.user;
};

export const registerFirstAdmin = async (details) => {
  const { setupKey, ...account } = details;
  const response = await fetch(`${API_URL}/admin/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // trim to avoid whitespace/copy-paste issues
      ...(setupKey?.trim() ? { "X-Admin-Setup-Key": setupKey.trim() } : {}),
    },
    body: JSON.stringify(account),
  });
  return parseResponse(response, "Unable to create admin account");
};

export const getAdminProfile = () => request("/admin/auth/me");
export const getAdminOverview = () => request("/dashboard/admin/overview");
export const changeAdminPassword = (data) => request("/admin/auth/password", { method: "PATCH", body: JSON.stringify(data) });
export const adminLogout = async () => {
  try { await request("/admin/auth/logout", { method: "POST" }); } finally { localStorage.removeItem(TOKEN_KEY); }
};
export const clearAdminSession = () => localStorage.removeItem(TOKEN_KEY);
export const hasAdminSession = () => Boolean(localStorage.getItem(TOKEN_KEY));
