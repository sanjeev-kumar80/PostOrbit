
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Bell,
  Search,
  Clock3,
  CheckCircle2,
  Share2,
  Sparkles,
  Menu,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardOverview } from "../services/authService";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Posts", icon: FileText },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

function UserDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardOverview();
      setDashboard(data);
    } catch (err) {
      setError(err.message);

      if (
        err.message.toLowerCase().includes("token") ||
        err.message.toLowerCase().includes("login")
      ) {
        localStorage.removeItem("postorbitToken");
        localStorage.removeItem("postorbitUser");
        navigate("/user-login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("postorbitToken");
    localStorage.removeItem("postorbitUser");
    navigate("/login");
  };

  const user = dashboard?.user;
  const stats = dashboard?.stats;

  const statCards = [
    {
      label: "Total Posts",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
    },
    {
      label: "Published Posts",
      value: stats?.publishedPosts ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Scheduled Posts",
      value: stats?.scheduledPosts ?? 0,
      icon: Clock3,
    },
    {
      label: "Connected Accounts",
      value: stats?.connectedAccounts ?? 0,
      icon: Share2,
    },
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-2xl font-bold theme-accent">
            PostOrbit<span className="text-sm">.</span>
          </Link>

          <button
            className="lg:hidden theme-muted"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider theme-muted mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.label);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: active ? "var(--surface-hover)" : "transparent",
                  color: active
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                }}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "var(--surface-hover)" }}
          >
            <Sparkles size={21} className="theme-accent mb-3" />
            <h3 className="font-semibold text-sm theme-heading">
              AI Content Assistant
            </h3>
            <p className="text-xs theme-muted mt-1">
              AI content generation is coming soon.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm theme-muted hover:theme-accent"
          >
            <LogOut size={19} />
            Logout
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm theme-muted"
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
              <Menu size={24} />
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
              className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 border"
              style={{ borderColor: "var(--border)" }}
            >
              <Search size={17} className="theme-muted" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-28 theme-heading"
              />
            </div>

            <button className="theme-muted" aria-label="Notifications">
              <Bell size={21} />
            </button>

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
              <Loader2 className="animate-spin theme-accent" size={36} />
              <p className="theme-muted mt-4">Loading your dashboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchDashboard}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white"
                style={{ background: "var(--accent-gradient)" }}
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Welcome */}
              <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold theme-heading">
                    Welcome back, {user?.name}! 👋
                  </h2>
                  <p className="theme-muted mt-2">
                    Here's what's happening with your social accounts today.
                  </p>
                  <p className="text-xs theme-muted mt-1">{user?.email}</p>
                </div>

                <button
                  onClick={() =>
                    alert("Create Post feature will be added next.")
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  <Plus size={19} />
                  Create New Post
                </button>
              </section>

              {/* Real Stats */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {statCards.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border p-5"
                      style={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-sm theme-muted">{stat.label}</p>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: "var(--surface-hover)",
                            color: "var(--accent)",
                          }}
                        >
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="text-3xl font-bold theme-heading">
                        {stat.value}
                      </h3>
                    </div>
                  );
                })}
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

                  <button
                    onClick={() => setActivePage("My Posts")}
                    className="text-sm font-semibold theme-accent"
                  >
                    View All
                  </button>
                </div>

                {dashboard.recentPosts?.length > 0 ? (
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

                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full capitalize self-start"
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
                    <FileText
                      size={35}
                      className="theme-muted mx-auto mb-3"
                    />
                    <h4 className="font-semibold theme-heading">
                      No posts yet
                    </h4>
                    <p className="text-sm theme-muted mt-2">
                      Your posts will appear here when you create them.
                    </p>
                  </div>
                )}
              </section>

              {/* Account Summary */}
              <section
                className="mt-6 rounded-2xl p-6 md:p-8"
                style={{
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2 theme-accent mb-2">
                  <Share2 size={19} />
                  <span className="text-sm font-semibold">
                    Social Account Summary
                  </span>
                </div>

                <h3 className="text-xl font-bold theme-heading">
                  {stats?.connectedAccounts ?? 0} connected accounts
                </h3>

                <p className="text-sm theme-muted mt-2">
                  Your connected social accounts will be managed here.
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
