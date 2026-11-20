
const API_URL = "http://localhost:5000/api/social-accounts";

const getToken = () => {
  const token = localStorage.getItem("postorbitToken");

  if (!token) {
    throw new Error("Please login first");
  }

  return token;
};

export const getBufferAccount = async () => {
  const response = await fetch(`${API_URL}/buffer/account`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to connect Buffer");
  }

  return result;
};

export const getSocialAccounts = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch accounts");
  }

  return result;
};

export const disconnectSocialAccount = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to disconnect account");
  }

  return result;
};
