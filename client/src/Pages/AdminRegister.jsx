import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { registerFirstAdmin } from "../services/adminService";

// In dev, the setup key is shown as a hint so you don't have to copy-paste it manually.
const DEV_HINT = import.meta.env.DEV;

export default function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", setupKey: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerFirstAdmin({ ...form, setupKey: form.setupKey.trim() });
      navigate("/admin-login", {
        replace: true,
        state: { message: "Admin account created. Sign in with your new credentials." },
      });
    } catch (err) {
      setError(err.message || "Unable to create admin account");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "theme-input w-full rounded-xl border px-4 py-3 outline-none transition";

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm theme-muted transition hover:opacity-75">
          <span className="text-lg">←</span> Back to Home
        </Link>
        <div className="rounded-3xl border p-7 sm:p-9" style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <ShieldCheck size={25} />
            </div>
            <p className="text-xs font-bold tracking-[3px] text-indigo-600">POSTORBIT ADMIN</p>
            <h1 className="mt-3 text-3xl font-bold theme-heading">Create admin account</h1>
            <p className="mt-2 text-sm theme-muted">Set up the first administrator for this workspace.</p>
          </div>

          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>One-time setup</strong>
            <p className="mt-1 text-xs">
              Enter the <code className="bg-amber-100 px-1 rounded">ADMIN_SETUP_KEY</code> value from your server <code className="bg-amber-100 px-1 rounded">.env</code> file. Registration closes once an admin exists.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <label className="block text-sm font-semibold theme-heading">
              Full name
              <input required minLength={2} maxLength={50} autoComplete="name" value={form.name} onChange={update("name")} className={`${inputClass} mt-2`} placeholder="Your name" />
            </label>

            <label className="block text-sm font-semibold theme-heading">
              Admin email
              <input required type="email" autoComplete="email" value={form.email} onChange={update("email")} className={`${inputClass} mt-2`} placeholder="admin@example.com" />
            </label>

            <label className="block text-sm font-semibold theme-heading">
              Password
              <input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={update("password")} className={`${inputClass} mt-2`} placeholder="At least 8 characters" />
            </label>

            <label className="block text-sm font-semibold theme-heading">
              Confirm password
              <input required minLength={8} type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} className={`${inputClass} mt-2`} placeholder="Re-enter password" />
            </label>

            <div>
              <label className="block text-sm font-semibold theme-heading mb-2">
                Server setup key
              </label>
              <div className="relative">
                <input
                  required
                  type={showKey ? "text" : "password"}
                  autoComplete="off"
                  value={form.setupKey}
                  onChange={update("setupKey")}
                  className={`${inputClass} pr-14 font-mono text-xs`}
                  placeholder="Paste your ADMIN_SETUP_KEY here"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold theme-accent"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {DEV_HINT && (
                <p className="mt-1.5 text-xs theme-muted">
                  💡 Dev tip: copy the value of <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ADMIN_SETUP_KEY</code> from <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">server/.env</code> and paste it here.
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create admin account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm theme-muted">
            Already set up?{" "}
            <Link to="/admin-login" className="font-semibold text-indigo-600 hover:underline">
              Admin sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
