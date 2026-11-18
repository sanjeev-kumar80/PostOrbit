
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPosts, deletePost } from "../services/postService";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost(id);
      setPosts((previous) => previous.filter((post) => post._id !== id));
    } catch (err) {
      alert(err.message || "Unable to delete post");
    }
  };

  return (
    <div
      className="min-h-screen p-5 md:p-10"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-6xl mx-auto">

        <Link to="/dashboard" className="theme-accent text-sm">
          Back to Dashboard
        </Link>

        <div className="flex flex-wrap justify-between items-center gap-4 my-7">
          <div>
            <h1 className="text-3xl font-bold theme-heading">
              My Posts
            </h1>
            <p className="theme-muted mt-2">
              Manage all your posts here.
            </p>
          </div>

          <Link
            to="/create-post"
            className="px-5 py-3 rounded-xl text-white font-semibold"
            style={{ background: "var(--accent-gradient)" }}
          >
            Create New Post
          </Link>
        </div>

        {loading ? (
          <p className="theme-muted py-10">Loading posts...</p>
        ) : error ? (
          <div className="py-10">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchPosts} className="underline mt-3">
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-xl font-semibold theme-heading">
              No posts found
            </h2>
            <p className="theme-muted mt-2">
              Create your first social media post.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="theme-heading whitespace-pre-wrap">
                      {post.content}
                    </p>

                    <p className="text-sm theme-muted mt-3">
                      Platforms: {post.platforms?.join(", ") || "None"}
                    </p>

                    <p className="text-sm theme-muted mt-1 capitalize">
                      Status: {post.status}
                    </p>

                    <p className="text-xs theme-muted mt-2">
                      Created: {new Date(post.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 text-sm font-medium"
                  >
                    Delete
                  </button>
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
