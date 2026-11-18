
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPost } from "../services/postService";

function CreatePost() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [status, setStatus] = useState("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platformOptions = [
    "instagram",
    "facebook",
    "linkedin",
  ];

  const togglePlatform = (platform) => {
    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((item) => item !== platform)
        : [...previous, platform]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please enter post content");
      return;
    }

    if (platforms.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    if (status === "scheduled") {
      if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
        setError("Please select a future schedule date and time");
        return;
      }
    }

    try {
      setLoading(true);

      await createPost({
        content: content.trim(),
        platforms,
        status,
        scheduledAt: status === "scheduled"
          ? new Date(scheduledAt).toISOString()
          : null,
      });

      alert("Post saved successfully!");
      navigate("/my-posts");
    } catch (err) {
      setError(err.message || "Unable to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 md:p-10"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-3xl mx-auto">

        <Link to="/dashboard" className="theme-accent text-sm">
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold theme-heading mt-6">
          Create New Post
        </h1>

        <p className="theme-muted mt-2 mb-8">
          Create one post for multiple social platforms.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 space-y-6"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <label className="block text-sm font-semibold mb-2">
              Post Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post here..."
              maxLength={5000}
              rows={7}
              className="w-full border rounded-xl p-4 outline-none bg-transparent"
              style={{ borderColor: "var(--border)" }}
            />

            <p className="text-xs theme-muted text-right mt-1">
              {content.length}/5000
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              Select Platforms
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {platformOptions.map((platform) => (
                <button
                  type="button"
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className="border rounded-xl p-4 capitalize font-medium"
                  style={{
                    borderColor: platforms.includes(platform)
                      ? "var(--accent)"
                      : "var(--border)",
                    background: platforms.includes(platform)
                      ? "var(--surface-hover)"
                      : "transparent",
                    color: "var(--text-primary)",
                  }}
                >
                  {platform}
                  <span className="block text-xs mt-2">
                    {platforms.includes(platform) ? "Selected" : "Select"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              Publishing Type
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl p-3 bg-transparent"
              style={{ borderColor: "var(--border)" }}
            >
              <option value="draft">Save as Draft</option>
              <option value="scheduled">Schedule Post</option>
            </select>
          </div>

          {status === "scheduled" && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Schedule Date and Time
              </label>

              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString().slice(0, 16)}
                className="w-full border rounded-xl p-3 bg-transparent"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-white font-semibold disabled:opacity-50"
            style={{ background: "var(--accent-gradient)" }}
          >
            {loading ? "Saving..." : "Save Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
