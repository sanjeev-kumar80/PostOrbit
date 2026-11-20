
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { registerUser } from "../services/authService";

function UserSignup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/user-login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border px-4 py-3 outline-none transition theme-input";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-7 sm:p-9 shadow-xl"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm theme-muted hover:theme-accent mb-7"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "var(--surface-hover)",
              color: "var(--accent)",
            }}
          >
            <UserPlus size={27} />
          </div>

          <h1 className="text-3xl font-bold theme-heading">
            Create Account
          </h1>

          <p className="theme-muted mt-2 text-sm">
            Join PostOrbit and simplify your social publishing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium theme-heading mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium theme-heading mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium theme-heading mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className={`${inputClass} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 theme-muted"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium theme-heading mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`${inputClass} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 theme-muted"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm theme-muted">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 accent-blue-500"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--accent-gradient)" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm theme-muted mt-7">
          Already have an account?{" "}
          <Link to="/user-login" className="font-semibold theme-accent">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
