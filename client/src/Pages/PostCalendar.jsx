
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPosts } from "../services/postService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_COLORS = {
  draft:     "#f59e0b",
  scheduled: "#8b5cf6",
  published: "#10b981",
  failed:    "#ef4444",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getPostDate(post) {
  return post.scheduledAt || post.publishedAt || post.createdAt;
}

// ─── Platform Badge (mini) ────────────────────────────────────────────────────
const PLATFORM_ICONS = { instagram: "📸", facebook: "📘", linkedin: "💼", twitter: "🐦" };

function PlatformIcon({ platform }) {
  return <span title={platform}>{PLATFORM_ICONS[platform] || "🔗"}</span>;
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────
function DayCell({ day, year, month, posts, isToday, isSelected, onClick }) {
  const date = new Date(year, month, day);
  const dayPosts = posts.filter((p) => isSameDay(new Date(getPostDate(p)), date));
  const MAX_DOTS = 3;

  return (
    <button
      onClick={() => onClick(day)}
      className="relative flex flex-col items-start p-2 rounded-xl transition-all min-h-[72px] text-left w-full"
      style={{
        background: isSelected
          ? "var(--surface-hover)"
          : "transparent",
        border: isToday
          ? "1.5px solid var(--accent)"
          : "1.5px solid transparent",
        outline: "none",
      }}
    >
      <span
        className="text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1"
        style={{
          background: isToday ? "var(--accent)" : "transparent",
          color: isToday ? "#fff" : "var(--text-primary)",
        }}
      >
        {day}
      </span>

      {/* Post dots */}
      <div className="flex flex-col gap-0.5 w-full">
        {dayPosts.slice(0, MAX_DOTS).map((post, i) => (
          <div
            key={i}
            className="rounded-sm text-[9px] font-semibold truncate px-1 py-0.5 w-full"
            style={{
              background: (STATUS_COLORS[post.status] || "#6b7280") + "22",
              color: STATUS_COLORS[post.status] || "#6b7280",
            }}
          >
            {post.content?.slice(0, 20) || "Post"}
          </div>
        ))}
        {dayPosts.length > MAX_DOTS && (
          <span className="text-[9px] theme-muted">+{dayPosts.length - MAX_DOTS} more</span>
        )}
      </div>
    </button>
  );
}

// ─── Day Detail Panel ─────────────────────────────────────────────────────────
function DayDetail({ day, month, year, posts, onClose }) {
  const date = new Date(year, month, day);
  const dayPosts = posts.filter((p) => isSameDay(new Date(getPostDate(p)), date));

  const label = date.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div
      className="rounded-2xl border p-5 h-full"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-base theme-heading">{label}</h3>
          <p className="text-xs theme-muted mt-0.5">
            {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={onClose} className="theme-muted text-xl leading-none">×</button>
      </div>

      {dayPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm theme-muted">No posts on this day.</p>
          <Link
            to="/create-post"
            className="inline-block mt-3 text-xs font-semibold theme-accent"
          >
            + Schedule a post
          </Link>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
          {dayPosts.map((post) => (
            <div
              key={post._id}
              className="rounded-xl border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background: (STATUS_COLORS[post.status] || "#6b7280") + "22",
                    color: STATUS_COLORS[post.status] || "#6b7280",
                  }}
                >
                  {post.status}
                </span>
                <span className="text-[10px] theme-muted">
                  {new Date(getPostDate(post)).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-sm theme-heading leading-snug line-clamp-3">
                {post.content}
              </p>

              <div className="flex gap-1 mt-2">
                {(post.platforms || []).map((p) => (
                  <PlatformIcon key={p} platform={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Calendar Component ──────────────────────────────────────────────────
function PostCalendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getMyPosts();
        setPosts(result.data || []);
      } catch (err) {
        if (err.message?.toLowerCase().includes("login")) {
          navigate("/user-login");
        } else {
          setError(err.message || "Failed to load posts");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [navigate]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  // Upcoming scheduled posts (sorted)
  const upcoming = posts
    .filter((p) => p.status === "scheduled" && new Date(p.scheduledAt) > today)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 6);

  return (
    <div
      className="min-h-screen p-5 md:p-8"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/dashboard" className="theme-accent text-sm inline-flex items-center gap-1 mb-2 block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold theme-heading">Post Calendar</h1>
            <p className="theme-muted mt-1 text-sm">View and manage your scheduled content.</p>
          </div>
          <Link
            to="/create-post"
            className="px-5 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "var(--accent-gradient)" }}
          >
            + Schedule Post
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <div
              className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
            <p className="theme-muted text-sm">Loading your calendar…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            {/* Calendar */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-xl flex items-center justify-center theme-muted transition-all hover:opacity-70"
                  style={{ background: "var(--surface-hover)" }}
                >
                  ‹
                </button>
                <h2 className="text-lg font-bold theme-heading">
                  {MONTHS[month]} {year}
                </h2>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-xl flex items-center justify-center theme-muted transition-all hover:opacity-70"
                  style={{ background: "var(--surface-hover)" }}
                >
                  ›
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold theme-muted py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                  <DayCell
                    key={day}
                    day={day}
                    year={year}
                    month={month}
                    posts={posts}
                    isToday={isSameDay(new Date(year, month, day), today)}
                    isSelected={selectedDay === day}
                    onClick={(d) => setSelectedDay(selectedDay === d ? null : d)}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5 text-xs theme-muted capitalize">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    {status}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* Day detail OR upcoming */}
              {selectedDay ? (
                <DayDetail
                  day={selectedDay}
                  month={month}
                  year={year}
                  posts={posts}
                  onClose={() => setSelectedDay(null)}
                />
              ) : (
                <div
                  className="rounded-2xl border p-5"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
                >
                  <h3 className="font-bold text-base theme-heading mb-4">Upcoming Scheduled</h3>
                  {upcoming.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">🗓</p>
                      <p className="text-sm theme-muted">No upcoming scheduled posts.</p>
                      <Link to="/create-post" className="text-xs theme-accent font-semibold mt-2 inline-block">
                        Schedule one now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((post) => (
                        <div
                          key={post._id}
                          className="flex gap-3 items-start p-3 rounded-xl"
                          style={{ background: "var(--surface-hover)" }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white shrink-0 text-xs font-bold"
                            style={{ background: "var(--accent-gradient)" }}
                          >
                            <span>{new Date(post.scheduledAt).getDate()}</span>
                            <span style={{ fontSize: 8 }}>{MONTHS[new Date(post.scheduledAt).getMonth()].slice(0, 3)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm theme-heading font-medium leading-snug line-clamp-2">
                              {post.content}
                            </p>
                            <p className="text-xs theme-muted mt-1">
                              {new Date(post.scheduledAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                              {" · "}
                              {(post.platforms || []).join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div
                className="rounded-2xl border p-5"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <h3 className="font-bold text-sm theme-heading mb-3">This Month</h3>
                {(() => {
                  const monthPosts = posts.filter((p) => {
                    const d = new Date(getPostDate(p));
                    return d.getFullYear() === year && d.getMonth() === month;
                  });
                  const byStatus = {
                    scheduled: monthPosts.filter((p) => p.status === "scheduled").length,
                    published: monthPosts.filter((p) => p.status === "published").length,
                    draft: monthPosts.filter((p) => p.status === "draft").length,
                  };
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(byStatus).map(([status, count]) => (
                        <div
                          key={status}
                          className="rounded-xl p-3 text-center"
                          style={{ background: "var(--surface-hover)" }}
                        >
                          <p className="text-xl font-bold" style={{ color: STATUS_COLORS[status] }}>{count}</p>
                          <p className="text-xs theme-muted capitalize mt-0.5">{status}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCalendar;
