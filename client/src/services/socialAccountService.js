
const API_BASE_URL = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL || "/api");
const API_URL = `${API_BASE_URL}/social-accounts`;

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

export const startBufferOAuth = async () => {
  const response = await fetch(`${API_URL}/buffer/connect`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to start Buffer connection");
  return result.authorizationUrl;
};

export const getBufferConnection = async () => {
  const response = await fetch(`${API_URL}/buffer/connection`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load Buffer connection");
  return result;
};

export const getBufferChannels = async (organizationId) => {
  const response = await fetch(`${API_URL}/buffer/channels/${encodeURIComponent(organizationId)}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load Buffer channels");
  return result.data || [];
};

export const disconnectBuffer = async () => {
  const response = await fetch(`${API_URL}/buffer/connection`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to disconnect Buffer");
  return result;
};

export const getAvailableBufferChannels = async () => {
  const connection = await getBufferConnection();
  if (!connection.connected) return [];
  const account = await getBufferAccount();
  const orgs = account.data?.organizations || [];
  const channelGroups = await Promise.all(orgs.map(async (organization) => ({
    organization,
    channels: await getBufferChannels(organization.id),
  })));
  return channelGroups.flatMap(({ organization, channels }) => channels.map((channel) => ({
    ...channel,
    organizationName: organization.name,
    platform: String(channel.service || "").toLowerCase(),
  })));
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
