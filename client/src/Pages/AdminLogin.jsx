
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  // Keep the password hidden unless the user wants to see it.
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
// Stop the form from refreshing while we're still using placeholder authentication.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your admin email and password.");
      return;
    }

    alert("Admin login UI is ready. Backend authentication will be connected next.");
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm transition hover:opacity-75"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="text-lg">←</span> Back to Home
        </Link>

        <div
          className="rounded-3xl border p-7 sm:p-9"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          <div className="mb-7 text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white"
              style={{ background: "var(--accent-gradient)" }}
            >
              ⚙
            </div>

            <p className="text-xs font-bold tracking-[3px] theme-accent">
              POSTORBIT ADMIN
            </p>

            <h1 className="mt-3 text-3xl font-bold theme-heading">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm theme-muted">
              Sign in to manage the PostOrbit platform.
            </p>
          </div>

          <div
            className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <strong className="theme-heading">Restricted access</strong>
            <p className="mt-1 text-xs">
              This area is intended for authorized administrators only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold theme-heading">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                className="theme-input w-full rounded-xl border px-4 py-3 outline-none transition"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold theme-heading">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold theme-accent hover:underline"
                  onClick={() => alert("Password recovery will be available after backend integration.")}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="theme-input w-full rounded-xl border px-4 py-3 pr-20 outline-none transition"
                />

                <button
                  type="button"
                  // Toggle between password and plain text.
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold theme-accent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3.5 font-bold text-white transition hover:opacity-90"
              style={{ background: "var(--accent-gradient)" }}
            >
              Admin Sign In
            </button>
          </form>

          <div
            className="my-6 border-t"
            style={{ borderColor: "var(--border)" }}
          />

          <p className="text-center text-sm theme-muted">
            Not an admin?{" "}
            <Link to="/user-login" className="font-semibold theme-accent hover:underline">
              User Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs theme-muted">
          © {new Date().getFullYear()} PostOrbit. All rights reserved.
        </p>
      </div>
    </main>
  );
}
