
const API_URL = "http://localhost:5000/api/auth";
const DASHBOARD_API_URL = "http://localhost:5000/api/dashboard";

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
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

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to load dashboard");
  }

  return result.data;
};
