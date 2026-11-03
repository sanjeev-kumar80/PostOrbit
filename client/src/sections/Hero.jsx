
import { Link } from "react-router-dom";
import { useLoginModal } from "../context/LoginModalContext";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className="h-5 w-5">
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.45H4.97V9h2.96v9.45ZM6.45 7.71a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12 10.74H15.5v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.2-1.77 2.43v4.68H9.24V9h2.84v1.29h.04c.4-.74 1.36-1.53 2.8-1.53 3 0 3.55 1.97 3.55 4.53v5.16Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Hero() {
  const { openLoginModal } = useLoginModal();

  return (
    <section
      id="home"
      className="relative overflow-hidden theme-bg"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Decorative curved lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 650"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <path
            d="M-100 440 C180 100 350 120 540 420 S900 650 1150 330 S1450 150 1550 280"
            stroke="#BBD8F3"
            strokeWidth="1.2"
            opacity=".45"
          />
          <path
            d="M-100 490 C180 150 350 170 540 470 S900 700 1150 380 S1450 200 1550 330"
            stroke="#D1E4F6"
            strokeWidth="1.2"
            opacity=".55"
          />
          <path
            d="M-100 540 C180 200 350 220 540 520 S900 750 1150 430 S1450 250 1550 380"
            stroke="#D1E4F6"
            strokeWidth="1"
            opacity=".4"
          />
          <path
            d="M100 0 C300 200 450 180 620 20"
            stroke="#D1E4F6"
            strokeWidth="1"
            opacity=".35"
          />
        </svg>
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pt-24">

        {/* Hero heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
          >
            <SparkleIcon />
            AI-Powered Social Media Platform
          </div>

          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: "var(--text-primary)" }}
          >
            Manage Your Social Media
            <br />
            <span style={{ color: "var(--accent)" }}>
              Smarter with AI.
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Create engaging content, generate AI-powered captions, schedule
            posts and manage all your social media platforms from one
            simple dashboard.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={openLoginModal}
              className="primary-button"
            >
              Get Started
              <ArrowIcon />
            </button>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border px-6 py-3 font-semibold transition hover:-translate-y-0.5"
              style={{
                color: "var(--text-primary)",
                borderColor: "var(--border)",
                background: "var(--bg-card)",
              }}
            >
              Explore Features
            </a>
          </div>

          <div
            className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: "#0FBA81" }}><CheckIcon /></span>
              AI Content Creation
            </span>
            <span className="flex items-center gap-2">
              <span style={{ color: "#0FBA81" }}><CheckIcon /></span>
              Smart Scheduling
            </span>
            <span className="flex items-center gap-2">
              <span style={{ color: "#0FBA81" }}><CheckIcon /></span>
              Multiple Platforms
            </span>
          </div>
        </div>

        {/* Dashboard browser preview */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div
            className="overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            {/* Browser bar */}
            <div
              className="flex items-center justify-between border-b px-5 py-4 sm:px-7"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <div
                className="hidden rounded-md border px-12 py-1.5 text-xs sm:block"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                app.postorbit.com/dashboard
              </div>

              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Preview
              </span>
            </div>

            {/* Dashboard body */}
            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[190px_1fr]">

              {/* Sidebar */}
              <aside
                className="hidden rounded-xl border p-4 lg:block"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="mb-7 flex items-center gap-2 font-bold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3977B9] text-white">
                    P
                  </div>
                  <span style={{ color: "var(--text-primary)" }}>
                    PostOrbit
                  </span>
                </div>

                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Workspace
                </p>

                {["Dashboard", "My Posts", "Calendar", "AI Generator", "Analytics", "Accounts"].map((item, index) => (
                  <div
                    key={item}
                    className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                    style={{
                      background: index === 0 ? "var(--surface-hover)" : "transparent",
                      color: index === 0 ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: index === 0 ? 600 : 400,
                    }}
                  >
                    <span className="text-base">
                      {["▦", "▤", "▦", "✧", "▥", "◎"][index]}
                    </span>
                    {item}
                  </div>
                ))}
              </aside>

              {/* Main dashboard */}
              <div className="min-w-0">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Welcome back!
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                      Here's what's happening with your content.
                    </p>
                  </div>

                  <div
                    className="rounded-lg border px-4 py-2 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    This Month⌄
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {[
                    { label: "Total Posts", value: "120", note: "+12% this month" },
                    { label: "Connected Accounts", value: "04", note: "All accounts active" },
                    { label: "AI Credits", value: "230", note: "Available credits" },
                    { label: "Engagement Rate", value: "8.4%", note: "+2.4% this month" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border p-4"
                      style={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                        {stat.label}
                      </p>
                      <h3
                        className="mt-3 text-2xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {stat.value}
                      </h3>
                      <p className="mt-2 text-xs" style={{ color: "#0FBA81" }}>
                        {stat.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Lower dashboard panels */}
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                  <div
                    className="rounded-xl border p-5"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        Recent Posts
                      </h3>
                      <span className="text-xs" style={{ color: "var(--accent)" }}>
                        View all
                      </span>
                    </div>

                    {[
                      { title: "Summer Product Campaign", platform: "Instagram", date: "Today, 05:30 PM", icon: <InstagramIcon /> },
                      { title: "New Product Announcement", platform: "Facebook", date: "Tomorrow, 10:00 AM", icon: <FacebookIcon /> },
                      { title: "Weekly Business Update", platform: "LinkedIn", date: "Friday, 11:00 AM", icon: <LinkedinIcon /> },
                    ].map((post, index) => (
                      <div
                        key={post.title}
                        className="mt-5 flex items-center gap-3"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: "var(--surface-hover)",
                            color: "var(--accent)",
                          }}
                        >
                          {post.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {post.title}
                          </p>
                          <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                            {post.platform} · {post.date}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs"
                          style={{
                            background: index === 1 ? "#FFF5E6" : "#EAF8F1",
                            color: index === 1 ? "#B7791F" : "#16845B",
                          }}
                        >
                          {index === 1 ? "Draft" : "Scheduled"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="rounded-xl border p-5"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Publishing Activity
                    </h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      Posts published this week
                    </p>

                    <div className="mt-7 flex h-28 items-end justify-around gap-3">
                      {[35, 60, 45, 80, 55, 95, 70].map((height, index) => (
                        <div
                          key={index}
                          className="w-full rounded-t-md"
                          style={{
                            height: `${height}%`,
                            background: index === 5 ? "var(--accent)" : "#BBD1E8",
                          }}
                        />
                      ))}
                    </div>

                    <div className="mt-3 flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                        <span key={index}>{day}</span>
                      ))}
                    </div>

                    <div
                      className="mt-6 rounded-lg p-3"
                      style={{ background: "var(--bg-secondary)" }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        <SparkleIcon />
                        AI Content Assistant
                      </div>
                      <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        Your next great caption is just one click away.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p
            className="mt-4 text-center text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            A preview of your future PostOrbit workspace
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
