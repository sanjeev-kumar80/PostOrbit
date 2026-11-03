
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
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Posts", icon: FileText },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const stats = [
  {
    label: "Total Posts",
    value: "120",
    change: "+12% this month",
    icon: FileText,
  },
  {
    label: "Scheduled Posts",
    value: "18",
    change: "5 scheduled today",
    icon: Clock3,
  },
  {
    label: "Connected Accounts",
    value: "4",
    change: "All accounts connected",
    icon: Share2,
  },
  {
    label: "AI Credits",
    value: "230",
    change: "Available credits",
    icon: Sparkles,
  },
];

const recentPosts = [
  {
    title: "5 Tips to Grow Your Business Online",
    platform: "Instagram",
    status: "Published",
    date: "Nov 04, 2026",
  },
  {
    title: "Our New Product Launch 🚀",
    platform: "LinkedIn",
    status: "Scheduled",
    date: "Nov 05, 2026",
  },
  {
    title: "Weekend Special Offer",
    platform: "Facebook",
    status: "Draft",
    date: "Nov 06, 2026",
  },
];

function UserDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (label) => {
    setActivePage(label);
    setSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Mobile overlay */}
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
            aria-label="Close sidebar"
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
                onClick={() => handleNavigation(item.label)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition"
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
              Need more AI credits?
            </h3>
            <p className="text-xs theme-muted mt-1 mb-3">
              Upgrade your plan to create more content.
            </p>
            <button
              className="text-sm font-semibold theme-accent"
              onClick={() => alert("Plans will be available soon.")}
            >
              Explore Plans →
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm theme-muted hover:theme-accent"
          >
            <LogOut size={19} />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
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
              aria-label="Open sidebar"
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

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 border"
              style={{ borderColor: "var(--border)" }}
            >
              <Search size={17} className="theme-muted" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-28 theme-heading"
              />
            </div>

            <button
              className="relative theme-muted"
              aria-label="Notifications"
              onClick={() => alert("No new notifications.")}
            >
              <Bell size={21} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: "var(--surface-hover)",
                color: "var(--accent)",
              }}
            >
              S
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">
          {/* Welcome section */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold theme-heading">
                Welcome back, Sanjeev! 👋
              </h2>
              <p className="theme-muted mt-2">
                Here's what's happening with your social accounts today.
              </p>
            </div>

            <button
              onClick={() => alert("Create Post page is our next feature.")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90"
              style={{ background: "var(--accent-gradient)" }}
            >
              <Plus size={19} />
              Create New Post
            </button>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {stats.map((stat) => {
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
                  <p className="text-xs theme-muted mt-2">{stat.change}</p>
                </div>
              );
            })}
          </section>

          {/* Main dashboard grid */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent posts */}
            <div
              className="xl:col-span-2 rounded-2xl border p-5 md:p-6"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-bold text-lg theme-heading">
                    Recent Posts
                  </h3>
                  <p className="text-sm theme-muted mt-1">
                    Track your latest content
                  </p>
                </div>

                <button
                  onClick={() => handleNavigation("My Posts")}
                  className="text-sm font-semibold theme-accent"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm theme-heading">
                        {post.title}
                      </h4>
                      <p className="text-xs theme-muted mt-2">
                        {post.platform} · {post.date}
                      </p>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-center"
                      style={{
                        background: "var(--surface-hover)",
                        color:
                          post.status === "Published"
                            ? "#16a34a"
                            : post.status === "Scheduled"
                              ? "var(--accent)"
                              : "var(--text-secondary)",
                      }}
                    >
                      {post.status === "Published" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected accounts */}
            <div
              className="rounded-2xl border p-5 md:p-6"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-bold text-lg theme-heading">
                Connected Accounts
              </h3>
              <p className="text-sm theme-muted mt-1 mb-6">
                Your social platforms
              </p>

              {[
                { name: "Instagram", letter: "IG", color: "#d9468f" },
                { name: "Facebook", letter: "f", color: "#3975d7" },
                { name: "LinkedIn", letter: "in", color: "#0a80b9" },
                { name: "X (Twitter)", letter: "X", color: "var(--text-primary)" },
              ].map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        background: "var(--surface-hover)",
                        color: account.color,
                      }}
                    >
                      {account.letter}
                    </div>
                    <span className="text-sm font-medium theme-heading">
                      {account.name}
                    </span>
                  </div>

                  <span className="text-xs text-green-500 font-semibold">
                    Connected
                  </span>
                </div>
              ))}

              <button
                onClick={() => alert("Social account integration will be added later.")}
                className="w-full mt-5 py-3 rounded-xl border text-sm font-semibold theme-accent hover:opacity-80"
                style={{ borderColor: "var(--border)" }}
              >
                + Connect Account
              </button>
            </div>
          </section>

          {/* Quick start */}
          <section
            className="mt-6 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
            style={{
              background: "var(--surface-hover)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <div className="flex items-center gap-2 theme-accent mb-2">
                <Sparkles size={19} />
                <span className="text-sm font-semibold">AI Content Assistant</span>
              </div>
              <h3 className="text-xl font-bold theme-heading">
                Create engaging content in seconds.
              </h3>
              <p className="text-sm theme-muted mt-2">
                Generate captions and ideas with your AI-powered assistant.
              </p>
            </div>

            <button
              onClick={() => alert("AI Caption Generator will be our next feature.")}
              className="shrink-0 px-5 py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: "var(--accent-gradient)" }}
            >
              Try AI Assistant
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
