
const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

const getEncryptionKey = () => {
  const key = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY;

  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error(
      "SOCIAL_TOKEN_ENCRYPTION_KEY must be a 32-byte hex key"
    );
  }

  return Buffer.from(key, "hex");
};

const encryptToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("A valid token is required");
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv
  );

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

const decryptToken = (encryptedToken) => {
  if (!encryptedToken || typeof encryptedToken !== "string") {
    throw new Error("A valid encrypted token is required");
  }

  const parts = encryptedToken.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, authTagHex, encrypted] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  if (iv.length !== 12 || authTag.length !== 16 || !encrypted) {
    throw new Error("Invalid encrypted token data");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  encryptToken,
  decryptToken,
};
