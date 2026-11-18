
import { useEffect, useState } from "react";
import {
  connectMetaAccount,
  getSocialAccounts,
  disconnectSocialAccount,
} from "../services/socialAccountService";

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const result = await getSocialAccounts();
      setAccounts(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError("");
      await connectMetaAccount();
    } catch (err) {
      setError(err.message);
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm("Are you sure you want to disconnect this account?")) {
      return;
    }

    try {
      await disconnectSocialAccount(id);
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold">Social Accounts</h2>
          <p className="text-sm opacity-60 mt-1">
            Manage your connected social media accounts
          </p>
        </div>

        <button
          onClick={handleConnect}
          disabled={connecting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {connecting ? "Connecting..." : "Connect Meta Account"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-sm opacity-60">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center"
          style={{ borderColor: "var(--border)" }}>
          <p className="font-medium">No accounts connected</p>
          <p className="text-sm opacity-60 mt-1">
            Connect your Facebook Page or Instagram Professional account.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="font-medium capitalize">
                  {account.platform}
                </p>
                <p className="text-sm opacity-60">
                  {account.accountName || account.platformUserId}
                </p>
                <p className="text-xs mt-1 text-green-600">
                  {account.isActive ? "Connected" : "Inactive"}
                </p>
              </div>

              <button
                onClick={() => handleDisconnect(account._id)}
                className="text-sm text-red-500 hover:underline"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SocialAccounts;
