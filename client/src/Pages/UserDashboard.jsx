
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearUserSession, getDashboardOverview } from "../services/authService";

import SocialAccounts from "../components/SocialAccounts";

const navigation = [
  { label: "Overview", path: "/dashboard" },
  { label: "My Posts", path: "/my-posts" },
  { label: "Calendar", path: "/calendar" },
  { label: "Analytics", path: null },
  { label: "Settings", path: null },
];

function UserDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardOverview();
      setDashboard(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard");

      if (
        err.message?.toLowerCase().includes("token") ||
        err.message?.toLowerCase().includes("login")
      ) {
        clearUserSession();
        navigate("/user-login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    clearUserSession();
    navigate("/user-login");
  };

  const user = dashboard?.user;
  const stats = dashboard?.stats;

  const statCards = [
    { label: "Total Posts", value: stats?.totalPosts ?? 0 },
    { label: "Published Posts", value: stats?.publishedPosts ?? 0 },
    { label: "Scheduled Posts", value: stats?.scheduledPosts ?? 0 },
    { label: "Connected Accounts", value: stats?.connectedAccounts ?? 0 },
  ];

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPostDate = (post) =>
    post.publishedAt || post.scheduledAt || post.createdAt;

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r p-5 flex flex-col transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-2xl font-bold theme-accent">
            PostOrbit.
          </Link>

          <button
            className="lg:hidden theme-muted"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider theme-muted mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active = activePage === item.label;

            if (item.path) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    setActivePage(item.label);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: active
                      ? "var(--surface-hover)"
                      : "transparent",
                    color: active
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                disabled
                className="w-full text-left px-4 py-3 rounded-xl text-sm opacity-50 cursor-not-allowed"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label} (Coming Soon)
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "var(--surface-hover)" }}
          >
            <h3 className="font-semibold text-sm theme-heading">
              AI Content Assistant
            </h3>
            <p className="text-xs theme-muted mt-2">
              AI content generation is coming soon.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm theme-muted"
          >
            Logout
          </button>

          <Link
            to="/"
            className="block px-4 py-3 text-sm theme-muted"
          >
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header
          className="h-20 border-b px-5 md:px-8 flex items-center justify-between gap-4"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden theme-muted"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>

            <div>
              <h1 className="font-bold text-lg theme-heading">
                {activePage}
              </h1>
              <p className="text-xs theme-muted hidden sm:block">
                Manage your social media presence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="hidden md:flex items-center rounded-xl px-3 py-2 border"
              style={{ borderColor: "var(--border)" }}
            >
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-28 theme-heading"
              />
            </div>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: "var(--surface-hover)",
                color: "var(--accent)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="theme-muted">Loading your dashboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-red-500 mb-4">{error}</p>

              <button
                onClick={fetchDashboard}
                className="px-5 py-3 rounded-xl text-white"
                style={{ background: "var(--accent-gradient)" }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Welcome */}
              <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold theme-heading">
                    Welcome back, {user?.name || "User"}!
                  </h2>

                  <p className="theme-muted mt-2">
                    Here's what's happening with your social accounts today.
                  </p>

                  <p className="text-xs theme-muted mt-1">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/create-post"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  Create New Post
                </Link>
              </section>

              {/* Statistics */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border p-5"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="text-sm theme-muted mb-5">
                      {stat.label}
                    </p>

                    <h3 className="text-3xl font-bold theme-heading">
                      {stat.value}
                    </h3>
                  </div>
                ))}
              </section>

              {/* Recent Posts */}
              <section
                className="rounded-2xl border p-5 md:p-6"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg theme-heading">
                      Recent Posts
                    </h3>

                    <p className="text-sm theme-muted mt-1">
                      Your latest content
                    </p>
                  </div>

                  <Link
                    to="/my-posts"
                    className="text-sm font-semibold theme-accent"
                  >
                    View All
                  </Link>
                </div>

                {dashboard?.recentPosts?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboard.recentPosts.map((post) => (
                      <div
                        key={post._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 last:border-0"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm theme-heading">
                            {post.content}
                          </h4>

                          <p className="text-xs theme-muted mt-2">
                            {post.platforms?.length
                              ? post.platforms.join(", ")
                              : "No platform selected"}
                            {" · "}
                            {formatDate(getPostDate(post))}
                          </p>
                        </div>

                        <span
                          className="text-xs font-semibold px-3 py-1.5 rounded-full capitalize self-start"
                          style={{
                            background: "var(--surface-hover)",
                            color: "var(--accent)",
                          }}
                        >
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h4 className="font-semibold theme-heading">
                      No posts yet
                    </h4>

                    <p className="text-sm theme-muted mt-2">
                      Your posts will appear here when you create them.
                    </p>

                    <Link
                      to="/create-post"
                      className="inline-block mt-4 theme-accent font-semibold"
                    >
                      Create your first post
                    </Link>
                  </div>
                )}
              </section>

              {/* Account Summary */}

              <SocialAccounts />
              
              {/* <section
                className="mt-6 rounded-2xl p-6 md:p-8"
                style={{
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 className="text-sm font-semibold theme-accent mb-2">
                  Social Account Summary
                </h3>

                <h3 className="text-xl font-bold theme-heading">
                  {stats?.connectedAccounts ?? 0} connected accounts
                </h3>

                <p className="text-sm theme-muted mt-2">
                  Your connected social accounts will be managed here.
                </p>
              </section> */}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
