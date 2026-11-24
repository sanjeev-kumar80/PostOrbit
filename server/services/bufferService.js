const axios = require("axios");
const BufferConnection = require("../models/BufferConnection");
const { encryptToken, decryptToken } = require("../utils/tokenEncryption");
const { createNotification } = require("./notificationService");

const BUFFER_API_URL = "https://api.buffer.com";
const BUFFER_AUTH_URL = "https://auth.buffer.com";

const bufferGraphQL = async (accessToken, query, variables = {}) => {
  const { data } = await axios.post(BUFFER_API_URL, { query, variables }, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    timeout: 20000,
  });
  if (data.errors?.length) throw new Error(data.errors.map((item) => item.message).join("; "));
  if (!data.data) throw new Error("Buffer returned an empty response");
  return data.data;
};

const refreshBufferToken = async (connection) => {
  if (!connection.refreshTokenEncrypted) throw new Error("Buffer connection expired. Reconnect your Buffer account.");
  const form = new URLSearchParams({
    client_id: process.env.BUFFER_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: decryptToken(connection.refreshTokenEncrypted),
  });
  if (process.env.BUFFER_CLIENT_SECRET) form.set("client_secret", process.env.BUFFER_CLIENT_SECRET);
  try {
    const { data } = await axios.post(`${BUFFER_AUTH_URL}/token`, form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 20000,
    });
    connection.accessTokenEncrypted = encryptToken(data.access_token);
    if (data.refresh_token) connection.refreshTokenEncrypted = encryptToken(data.refresh_token);
    connection.tokenExpiresAt = data.expires_in ? new Date(Date.now() + Number(data.expires_in) * 1000) : null;
    await connection.save();
    return data.access_token;
  } catch (error) {
    connection.isActive = false;
    await connection.save();
    await createNotification(connection.user, "buffer_expired", "Buffer connection expired", "Reconnect Buffer to resume publishing and status sync.");
    throw new Error("Buffer connection expired. Reconnect your Buffer account.");
  }
};

const getBufferAccessToken = async (userId) => {
  const connection = await BufferConnection.findOne({ user: userId, isActive: true })
    .select("+accessTokenEncrypted +refreshTokenEncrypted");
  if (!connection) throw new Error("Connect your Buffer account first");
  if (connection.tokenExpiresAt && connection.tokenExpiresAt.getTime() <= Date.now() + 60000) {
    return refreshBufferToken(connection);
  }
  return decryptToken(connection.accessTokenEncrypted);
};

const getOwnedBufferChannels = async (userId, accessToken) => {
  const connection = await BufferConnection.findOne({ user: userId, isActive: true }).select("organizations");
  if (!connection) throw new Error("Connect your Buffer account first");
  const organizations = connection.organizations?.length
    ? connection.organizations
    : (await bufferGraphQL(accessToken, "query { account { organizations { id name } } }")).account.organizations;
  const channels = [];
  for (const organization of organizations || []) {
    const query = `query GetChannels($input: ChannelsInput!) {
      channels(input: $input) { id name displayName service descriptor type externalLink isDisconnected isLocked organizationId }
    }`;
    const data = await bufferGraphQL(accessToken, query, { input: { organizationId: organization.id } });
    channels.push(...(data.channels || []).map((channel) => ({ ...channel, organizationName: organization.name })));
  }
  return channels;
};

const mapBufferStatus = (status) => ({
  sent: "published",
  sending: "publishing",
  error: "failed",
  scheduled: "scheduled",
  draft: "draft",
  needs_approval: "scheduled",
}[status] || "scheduled");

const createBufferPost = async (accessToken, input) => {
  const query = `mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id text dueAt status assets { id mimeType source } } }
      ... on MutationError { message }
    }
  }`;
  const result = (await bufferGraphQL(accessToken, query, { input })).createPost;
  if (!result?.post) throw new Error(result?.message || "Buffer could not create this post");
  return result.post;
};

const editBufferPost = async (accessToken, input) => {
  const query = `mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      ... on PostActionSuccess { post { id text dueAt status assets { id mimeType source } } }
      ... on MutationError { message }
    }
  }`;
  const result = (await bufferGraphQL(accessToken, query, { input })).editPost;
  if (!result?.post) throw new Error(result?.message || "Buffer could not update this post");
  return result.post;
};

const deleteBufferPost = async (accessToken, id) => {
  const query = `mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      ... on DeletePostSuccess { id }
      ... on MutationError { message }
    }
  }`;
  const result = (await bufferGraphQL(accessToken, query, { input: { id } })).deletePost;
  if (result?.message) throw new Error(result.message);
  return result;
};

const getBufferPost = async (accessToken, id) => {
  const query = `query GetPost($input: PostInput!) {
    post(input: $input) { id text dueAt sentAt status error { message } channel { id service name } assets { id mimeType source } }
  }`;
  return (await bufferGraphQL(accessToken, query, { input: { id } })).post;
};

module.exports = {
  bufferGraphQL,
  getBufferAccessToken,
  getOwnedBufferChannels,
  createBufferPost,
  editBufferPost,
  deleteBufferPost,
  getBufferPost,
  mapBufferStatus,
};
