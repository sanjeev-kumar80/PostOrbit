
import { useEffect, useState } from "react";

import {
  getBufferAccount,
  getBufferChannels,
  getBufferConnection,
  startBufferOAuth,
  disconnectBuffer,
  getSocialAccounts,
  disconnectSocialAccount,
} from "../services/socialAccountService";

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [channels, setChannels] = useState([]);
  const [bufferConnected, setBufferConnected] = useState(false);
  const [bufferEmail, setBufferEmail] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const [result, connection] = await Promise.all([getSocialAccounts(), getBufferConnection()]);
      setAccounts(result.data || []);
      setBufferConnected(connection.connected);
      setBufferEmail(connection.data?.email || "");
      if (connection.connected) {
        const buffer = await getBufferAccount();
        const orgs = buffer.data?.organizations || [];
        setOrganizations(orgs);
        if (orgs.length) {
          const orgId = orgs[0].id;
          setSelectedOrganization(orgId);
          setChannels(await getBufferChannels(orgId));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("bufferConnected")) setSuccess("Buffer account connected successfully.");
    if (params.get("bufferError")) setError("Buffer authorization did not complete. Please try connecting again.");
    loadAccounts();
  }, []);

  const handleConnectBuffer = async () => {
    try {
      setConnecting(true);
      setError("");
      setSuccess("");

      const authorizationUrl = await startBufferOAuth();
      window.location.assign(authorizationUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleOrganizationChange = async (event) => {
    const id = event.target.value;
    setSelectedOrganization(id);
    try { setChannels(await getBufferChannels(id)); } catch (err) { setError(err.message); }
  };

  const handleBufferDisconnect = async () => {
    try {
      await disconnectBuffer();
      setBufferConnected(false); setBufferEmail(""); setOrganizations([]); setChannels([]);
      setSuccess("Buffer account disconnected.");
    } catch (err) { setError(err.message); }
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
          onClick={bufferConnected ? handleBufferDisconnect : handleConnectBuffer}
          disabled={connecting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {connecting ? "Connecting..." : bufferConnected ? "Disconnect Buffer" : "Connect Buffer"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600 mb-4">{success}</p>
      )}

      {organizations.length > 0 && (
        <div className="rounded-xl border p-4 mb-5"
          style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold mb-3">Buffer Organizations and Channels</h3>
          <p className="text-sm opacity-60 mb-2">{organizations[0]?.name}{bufferEmail ? ` · ${bufferEmail}` : ""}</p>
          {organizations.length > 1 && <select value={selectedOrganization} onChange={handleOrganizationChange} className="mb-3 rounded-lg border p-2" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>{organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select>}
          {channels.length ? channels.map((channel) => <div key={channel.id} className="flex items-center justify-between gap-4 border-t py-3" style={{ borderColor: "var(--border)" }}><div><p className="font-medium">{channel.displayName || channel.name}</p><p className="text-sm opacity-60">{channel.descriptor || channel.service}{channel.externalLink ? ` · ${channel.externalLink}` : ""}</p><p className="text-xs opacity-60">{channel.isLocked ? "Unavailable: plan limit" : channel.isQueuePaused ? "Connected · queue paused" : channel.isDisconnected ? "Disconnected from platform" : "Connected"}</p></div><span className={`text-xs ${channel.isDisconnected || channel.isLocked ? "text-amber-600" : "text-green-600"}`}>{channel.isDisconnected || channel.isLocked ? "Needs attention" : "Active"}</span></div>) : <p className="text-sm opacity-60">No channels found in this organization.</p>}
        </div>
      )}

      <h3 className="font-semibold mb-3">Previously Connected Social Accounts</h3>

      {loading ? (
        <p className="text-sm opacity-60">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div
          className="rounded-xl border border-dashed p-6 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-medium">No social accounts connected</p>
          <p className="text-sm opacity-60 mt-1">
            Your existing Meta-connected accounts will appear here.
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
                <p className="font-medium capitalize">{account.platform}</p>
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
