
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyPosts, deletePost, updatePost } from "../services/postService";

// ─── Toast Notification System ───────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium min-w-[260px] max-w-xs animate-toast"
          style={{
            background: t.type === "success" ? "#16a34a" : t.type === "error" ? "#dc2626" : "var(--bg-card)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span style={{ fontSize: 18 }}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-70 hover:opacity-100 ml-2 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ─── Platform Badge ───────────────────────────────────────────────────────────
const PLATFORM_COLORS = {
  instagram: { bg: "#f43f5e22", text: "#f43f5e", icon: "📸" },
  facebook:  { bg: "#3b82f622", text: "#3b82f6", icon: "📘" },
  linkedin:  { bg: "#0ea5e922", text: "#0ea5e9", icon: "💼" },
  twitter:   { bg: "#1da1f222", text: "#1da1f2", icon: "🐦" },
};

function PlatformBadge({ platform }) {
  const style = PLATFORM_COLORS[platform] || { bg: "var(--surface-hover)", text: "var(--accent)", icon: "🔗" };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: style.bg, color: style.text }}
    >
      {style.icon} {platform}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    draft:     { bg: "#f59e0b22", text: "#d97706", label: "Draft" },
    scheduled: { bg: "#8b5cf622", text: "#7c3aed", label: "Scheduled" },
    published: { bg: "#10b98122", text: "#059669", label: "Published" },
    failed:    { bg: "#ef444422", text: "#dc2626", label: "Failed" },
  };
  const s = map[status] || { bg: "var(--surface-hover)", text: "var(--accent)", label: status };
  return (
    <span
      className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const PLATFORM_OPTIONS = ["instagram", "facebook", "linkedin"];

function toLocalDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function EditModal({ post, onClose, onSave }) {
  const [content, setContent] = useState(post.content || "");
  const [platforms, setPlatforms] = useState(post.platforms || []);
  const [status, setStatus] = useState(
    ["draft", "scheduled"].includes(post.status) ? post.status : "draft"
  );
  const [scheduledAt, setScheduledAt] = useState(toLocalDateTimeInput(post.scheduledAt));
  const [minimumScheduleTime] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const togglePlatform = (p) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const handleSave = async () => {
    setErr("");
    if (!content.trim()) { setErr("Content cannot be empty."); return; }
    if (platforms.length === 0) { setErr("Select at least one platform."); return; }
    if (status === "scheduled" && (!scheduledAt || new Date(scheduledAt) <= new Date())) {
      setErr("Pick a future date/time for scheduling."); return;
    }
    try {
      setSaving(true);
      const updated = await updatePost(post._id, {
        content: content.trim(),
        platforms,
        status,
        scheduledAt: status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      });
      onSave(updated.data || { ...post, content, platforms, status, scheduledAt });
    } catch (e) {
      setErr(e.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,25,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold theme-heading">Edit Post</h2>
          <button onClick={onClose} className="theme-muted text-2xl leading-none hover:opacity-70">×</button>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={5000}
            className="w-full border rounded-xl p-3 outline-none bg-transparent resize-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
          <p className="text-xs theme-muted text-right mt-1">{content.length}/5000</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all"
                style={{
                  borderColor: platforms.includes(p) ? "var(--accent)" : "var(--border)",
                  background: platforms.includes(p) ? "var(--surface-hover)" : "transparent",
                  color: platforms.includes(p) ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl p-2.5 bg-transparent"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          {status === "scheduled" && (
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Schedule At</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={minimumScheduleTime}
                className="w-full border rounded-xl p-2.5 bg-transparent"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
            </div>
          )}
        </div>

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--accent-gradient)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirm({ post, onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,25,0.6)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <h3 className="text-lg font-bold theme-heading">Delete Post?</h3>
        <p className="text-sm theme-muted line-clamp-3">{post.content}</p>
        <p className="text-sm theme-muted">This action cannot be undone.</p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: "#dc2626" }}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTER_TABS = ["all", "draft", "scheduled", "published"];

// ─── Main Component ───────────────────────────────────────────────────────────
function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMyPosts();
      setPosts(result.data || []);
    } catch (err) {
      setError(err.message || "Unable to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    try {
      setDeletingId(deletingPost._id);
      await deletePost(deletingPost._id);
      setPosts((prev) => prev.filter((p) => p._id !== deletingPost._id));
      addToast("Post deleted successfully.", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete post.", "error");
    } finally {
      setDeletingId(null);
      setDeletingPost(null);
    }
  };

  const handleEditSave = (updatedPost) => {
    setPosts((prev) => prev.map((p) => p._id === updatedPost._id ? updatedPost : p));
    setEditingPost(null);
    addToast("Post updated successfully.", "success");
  };

  // ── Filter + search ──
  const filtered = posts.filter((p) => {
    const matchTab = activeTab === "all" || p.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.content?.toLowerCase().includes(q) ||
      p.platforms?.some((pl) => pl.includes(q));
    return matchTab && matchSearch;
  });

  const counts = FILTER_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "all" ? posts.length : posts.filter((p) => p.status === tab).length;
    return acc;
  }, {});

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div
      className="min-h-screen p-5 md:p-10"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Toast toasts={toasts} removeToast={removeToast} />

      {editingPost && (
        <EditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleEditSave}
        />
      )}

      {deletingPost && (
        <DeleteConfirm
          post={deletingPost}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPost(null)}
          deleting={!!deletingId}
        />
      )}

      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="theme-accent text-sm inline-flex items-center gap-1">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mt-6 mb-7">
          <div>
            <h1 className="text-3xl font-bold theme-heading">My Posts</h1>
            <p className="theme-muted mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            to="/create-post"
            className="px-5 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "var(--accent-gradient)" }}
          >
            + Create New Post
          </Link>
        </div>

        {/* Search + Filter Bar */}
        <div
          className="rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row gap-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 border rounded-xl px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="theme-muted text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by content or platform…"
              className="bg-transparent outline-none flex-1 text-sm"
              style={{ color: "var(--text-primary)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="theme-muted text-lg leading-none">×</button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                style={{
                  background: activeTab === tab ? "var(--accent-gradient)" : "var(--surface-hover)",
                  color: activeTab === tab ? "#fff" : "var(--text-secondary)",
                }}
              >
                {tab} {counts[tab] > 0 && <span className="ml-1 opacity-80">({counts[tab]})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
            <p className="theme-muted text-sm">Loading your posts…</p>
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border p-10 text-center"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "var(--accent-gradient)" }}
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl border p-14 text-center"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <p className="text-5xl mb-4">📭</p>
            <h2 className="text-xl font-semibold theme-heading">
              {search ? "No posts match your search" : posts.length === 0 ? "No posts yet" : `No ${activeTab} posts`}
            </h2>
            <p className="theme-muted mt-2 text-sm">
              {posts.length === 0
                ? "Create your first social media post to get started."
                : "Try adjusting your filters or search term."}
            </p>
            {posts.length === 0 && (
              <Link
                to="/create-post"
                className="inline-flex mt-5 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: "var(--accent-gradient)" }}
              >
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => (
              <div
                key={post._id}
                className="rounded-2xl border p-5 transition-all"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="theme-heading text-sm leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.content}
                    </p>

                    {/* Platform Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(post.platforms || []).map((p) => (
                        <PlatformBadge key={p} platform={p} />
                      ))}
                      {(!post.platforms || post.platforms.length === 0) && (
                        <span className="text-xs theme-muted italic">No platform selected</span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs theme-muted">
                      <span>Created: {formatDate(post.createdAt)}</span>
                      {post.scheduledAt && (
                        <span>Scheduled: {formatDate(post.scheduledAt)}</span>
                      )}
                      {post.publishedAt && (
                        <span>Published: {formatDate(post.publishedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Status + Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                    <StatusBadge status={post.status} />

                    <div className="flex gap-2">
                      {post.status !== "published" && (
                        <button
                          onClick={() => setEditingPost(post)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80"
                          style={{ borderColor: "var(--border)", color: "var(--accent)" }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingPost(post)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/40 text-red-500 transition-all hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;
