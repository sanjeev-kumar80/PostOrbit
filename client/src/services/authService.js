
const API_BASE_URL = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL || "/api");
const API_URL = `${API_BASE_URL}/auth`;
const DASHBOARD_API_URL = `${API_BASE_URL}/dashboard`;

const readResponse = async (response, fallback) => {
  const body = await response.text();
  let result;
  try {
    result = body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`API returned a non-JSON response (HTTP ${response.status}). Check the server terminal.`);
  }
  if (!response.ok) {
    const message = result.message || result.error || result.detail || result.msg;
    if (message) throw new Error(message);
    if (response.status === 403) throw new Error("This account is inactive or access was denied (HTTP 403).");
    throw new Error(`${fallback} (HTTP ${response.status})`);
  }
  if (!body) throw new Error(`API returned an empty response (HTTP ${response.status}).`);
  return result;
};

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return readResponse(response, "Registration failed");
};

export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return readResponse(response, "Login failed");
};

export const getDashboardOverview = async () => {
  const token = localStorage.getItem("postorbitToken");

  if (!token) {
    throw new Error("Please login to continue");
  }

  const response = await fetch(`${DASHBOARD_API_URL}/overview`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await readResponse(response, "Unable to load dashboard");

  return result.data;
};
