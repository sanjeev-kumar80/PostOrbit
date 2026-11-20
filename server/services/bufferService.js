
const axios = require("axios");

const BUFFER_API_URL = "https://api.buffer.com";

const bufferRequest = async (query) => {
  if (!process.env.BUFFER_API_KEY) {
    throw new Error("BUFFER_API_KEY is missing in server/.env");
  }

  const response = await axios.post(
    BUFFER_API_URL,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BUFFER_API_KEY}`,
      },
    }
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data;
};

const getBufferAccount = async () => {
  const query = `
    query {
      account {
        id
        organizations {
          id
          name
        }
      }
    }
  `;

  return bufferRequest(query);
};

const getBufferChannels = async (organizationId) => {
  const safeOrganizationId = JSON.stringify(organizationId);

  const query = `
    query {
      channels(input: { organizationId: ${safeOrganizationId} }) {
        id
        name
        service
      }
    }
  `;

  return bufferRequest(query);
};

module.exports = {
  getBufferAccount,
  getBufferChannels,
};
