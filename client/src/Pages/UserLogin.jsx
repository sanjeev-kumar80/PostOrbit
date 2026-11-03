
import { useState } from "react";
import { Link } from "react-router-dom";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    alert("User login UI is ready. Backend authentication will be connected next.");
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
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
              style={{ background: "var(--accent-gradient)" }}
            >
              P
            </div>

            <p className="text-xs font-bold tracking-[3px] theme-accent">
              POSTORBIT
            </p>

            <h1 className="mt-3 text-3xl font-bold theme-heading">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm theme-muted">
              Sign in to manage your social media workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold theme-heading">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
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
                  onClick={() => alert("Forgot password will be available after backend integration.")}
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="theme-input w-full rounded-xl border px-4 py-3 pr-20 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold theme-accent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm theme-muted">
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-500"
              />
              Remember me
            </label>

            <button
              type="submit"
              className="w-full rounded-xl py-3.5 font-bold text-white transition hover:opacity-90"
              style={{ background: "var(--accent-gradient)" }}
            >
              Sign In
            </button>
          </form>

          <div
            className="my-6 border-t"
            style={{ borderColor: "var(--border)" }}
          />

          <p className="text-center text-sm theme-muted">
            Don't have an account?{" "}
            <Link to="/login" className="font-semibold theme-accent hover:underline">
              Get Started
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
