import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPost, generatePostText, uploadPostMedia } from "../services/postService";
import { getAvailableBufferChannels } from "../services/socialAccountService";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [media, setMedia] = useState([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [action, setAction] = useState("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [apiErrors, setApiErrors] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tone, setTone] = useState("Friendly");
  const [minimumDate, setMinimumDate] = useState("");

  useEffect(() => {
    getAvailableBufferChannels()
      .then(setChannels)
      .catch((err) => setError(err.message))
      .finally(() => setChannelsLoading(false));
  }, []);

  useEffect(() => {
    const now = new Date();
    setMinimumDate(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  }, []);

  const selected = useMemo(
    () => channels.filter((channel) => selectedChannels.includes(channel.id)),
    [channels, selectedChannels]
  );

  const toggleChannel = (channel) => {
    if (channel.isDisconnected || channel.isLocked) return;
    setSelectedChannels((previous) => previous.includes(channel.id)
      ? previous.filter((id) => id !== channel.id)
      : [...previous, channel.id]);
  };

  const addMediaUrl = () => {
    const trimmed = mediaUrl.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("Media needs a publicly reachable HTTP or HTTPS URL. Buffer fetches it when the post publishes.");
      return;
    }
    setError("");
    setMedia((previous) => [...previous, { url: trimmed, type: mediaType }]);
    setMediaUrl("");
  };

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setUploading(true); setError("");
      const result = await uploadPostMedia(file);
      setMedia((previous) => [...previous, { url: result.data.url, type: result.data.type }]);
    } catch (err) { setError(err.message || "Media upload failed"); }
    finally { setUploading(false); }
  };

  const generateText = async (kind) => {
    if (!(aiPrompt || content).trim()) return setError("Enter a topic or caption for the AI first.");
    try {
      setAiLoading(true); setError("");
      const result = await generatePostText({ prompt: aiPrompt || content, caption: content, tone, platform: selected[0]?.service || "Instagram", kind });
      if (kind === "hashtags") setContent((previous) => `${previous.trim()}${previous.trim() ? "\n\n" : ""}${result.data.content}`);
      else setContent(result.data.content);
    } catch (err) { setError(err.message || "AI generation failed"); }
    finally { setAiLoading(false); }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setApiErrors([]);
    if (!content.trim()) return setError("Write a caption before saving.");
    if (action !== "draft" && selectedChannels.length === 0) return setError("Select at least one connected Buffer channel.");
    if (action === "schedule" && (!scheduledAt || new Date(scheduledAt) <= new Date())) return setError("Choose a future date and time.");
    try {
      setSaving(true);
      const result = await createPost({
        content: content.trim(),
        channelIds: selectedChannels,
        platforms: [...new Set(selected.map((channel) => channel.platform))],
        media,
        action,
        scheduledAt: action === "schedule" ? new Date(scheduledAt).toISOString() : null,
      });
      if (!result.success) {
        setApiErrors(result.errors || []);
        if (!result.data) throw new Error(result.message || "Buffer could not accept this post");
      }
      navigate("/my-posts", { state: { notice: result.message || "Post saved" } });
    } catch (err) {
      setError(err.message || "Unable to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-5 md:p-10" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="theme-accent text-sm">← Back to Dashboard</Link>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold theme-heading">Create Post</h1>
            <p className="theme-muted mt-2">Create a draft, publish now, or schedule through Buffer.</p>
          </div>
          <Link to="/my-posts" className="text-sm font-semibold theme-accent">My Posts</Link>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="rounded-2xl border p-5 md:p-6 space-y-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div>
              <label htmlFor="post-caption" className="block text-sm font-semibold mb-2">Caption</label>
              <textarea id="post-caption" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write your post caption..." maxLength={5000} rows={8} className="w-full rounded-xl border p-4 outline-none bg-transparent resize-y" style={{ borderColor: "var(--border)" }} />
              <p className="text-xs theme-muted text-right mt-1">{content.length}/5000</p>
            </div>

            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2"><label htmlFor="ai-topic" className="text-sm font-semibold">AI writing assistant</label><select aria-label="Caption tone" value={tone} onChange={(event) => setTone(event.target.value)} className="rounded-lg border px-2 py-1 text-xs bg-transparent" style={{ borderColor: "var(--border)" }}>{["Professional", "Friendly", "Funny", "Promotional"].map((item) => <option key={item}>{item}</option>)}</select></div>
              <input id="ai-topic" value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Topic or goal (or leave blank to rewrite the caption)" className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent" style={{ borderColor: "var(--border)" }} />
              <div className="flex flex-wrap gap-2"><button type="button" disabled={aiLoading} onClick={() => generateText(content ? "rewrite" : "caption")} className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)" }}>{aiLoading ? "Generating…" : content ? "Rewrite caption" : "Generate caption"}</button><button type="button" disabled={aiLoading} onClick={() => generateText("hashtags")} className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)" }}>Generate hashtags</button></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">Select Buffer channels</label>
                <span className="text-xs theme-muted">{selectedChannels.length} selected</span>
              </div>
              {channelsLoading ? <p className="text-sm theme-muted">Loading connected channels…</p> : channels.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm theme-muted">No Buffer channels found. Connect Buffer and add Instagram or Facebook channels first.</p>
                  <Link to="/dashboard" className="inline-block mt-2 text-sm font-semibold theme-accent">Open account connections</Link>
                </div>
              ) : <div className="grid sm:grid-cols-2 gap-2">
                {channels.map((channel) => {
                  const active = selectedChannels.includes(channel.id);
                  const unavailable = channel.isDisconnected || channel.isLocked;
                  return <button key={channel.id} type="button" disabled={unavailable} onClick={() => toggleChannel(channel)} className="rounded-xl border p-3 text-left disabled:opacity-50" style={{ borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--surface-hover)" : "transparent" }}>
                    <span className="block text-sm font-semibold">{channel.displayName || channel.name}</span>
                    <span className="block text-xs theme-muted mt-1">{channel.descriptor || channel.service} · {channel.organizationName}</span>
                    {unavailable && <span className="block text-xs text-amber-600 mt-1">Unavailable in Buffer</span>}
                  </button>;
                })}
              </div>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Media</label>
              <p className="text-xs theme-muted mb-2">Upload an image/video or add a publicly reachable URL. Buffer fetches it when publishing.</p>
              <label className="inline-flex cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold mb-2" style={{ borderColor: "var(--border)" }}>{uploading ? "Uploading…" : "Upload image or video"}<input type="file" accept="image/*,video/*" onChange={uploadFile} disabled={uploading} className="sr-only" /></label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} type="url" placeholder="https://example.com/photo.jpg" className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 bg-transparent" style={{ borderColor: "var(--border)" }} />
                <select value={mediaType} onChange={(event) => setMediaType(event.target.value)} className="rounded-xl border px-3 py-2.5 bg-transparent" style={{ borderColor: "var(--border)" }}><option value="image">Image</option><option value="video">Video</option></select>
                <button type="button" onClick={addMediaUrl} className="rounded-xl border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "var(--border)" }}>Add</button>
              </div>
              {!!media.length && <ul className="mt-3 space-y-2">{media.map((item, index) => <li key={`${item.url}-${index}`} className="flex items-center justify-between gap-3 text-xs theme-muted"><span className="truncate">{item.type}: {item.url}</span><button type="button" onClick={() => setMedia((previous) => previous.filter((_, i) => i !== index))} className="text-red-500">Remove</button></li>)}</ul>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">When to publish</label>
              <div className="grid sm:grid-cols-3 gap-2">
                {[{ id: "draft", label: "Save draft" }, { id: "publish", label: "Publish now" }, { id: "schedule", label: "Schedule" }].map((option) => <button key={option.id} type="button" onClick={() => setAction(option.id)} className="rounded-xl border py-3 text-sm font-semibold" style={{ borderColor: action === option.id ? "var(--accent)" : "var(--border)", color: action === option.id ? "var(--accent)" : "var(--text-secondary)", background: action === option.id ? "var(--surface-hover)" : "transparent" }}>{option.label}</button>)}
              </div>
              {action === "schedule" && <div className="mt-4"><label htmlFor="scheduled-at" className="block text-sm font-semibold mb-2">Date and time</label><input id="scheduled-at" type="datetime-local" value={scheduledAt} min={minimumDate} onChange={(event) => setScheduledAt(event.target.value)} className="w-full rounded-xl border px-3 py-2.5 bg-transparent" style={{ borderColor: "var(--border)" }} /><p className="text-xs theme-muted mt-1">Displayed using your device time zone; dashboard dates use India Standard Time.</p></div>}
            </div>

            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            {apiErrors.map((item, index) => <p key={`${item.channelName}-${index}`} role="alert" className="text-sm text-red-500">{item.channelName}: {item.message}</p>)}
            <button type="submit" disabled={saving || channelsLoading} className="w-full rounded-xl py-3 text-white font-semibold disabled:opacity-50" style={{ background: "var(--accent-gradient)" }}>{saving ? "Sending to Buffer…" : action === "draft" ? "Save Draft" : action === "publish" ? "Publish Now" : "Schedule Post"}</button>
          </div>

          <aside className="rounded-2xl border p-5 h-fit sticky top-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <h2 className="font-bold theme-heading">Preview</h2>
            <p className="text-xs theme-muted mt-1 mb-4">Preview of the caption and media attached to the selected channels.</p>
            {selected.map((channel) => <p key={channel.id} className="text-xs theme-accent mb-1">{channel.displayName || channel.name} · {channel.service}</p>)}
            <div className="rounded-xl border p-4 mt-3 min-h-36 whitespace-pre-wrap break-words text-sm" style={{ borderColor: "var(--border)" }}>{content || <span className="theme-muted">Your caption preview will appear here.</span>}{media.map((item, index) => item.type === "image" ? <img key={`${item.url}-${index}`} src={item.url} alt="Post preview" className="mt-3 max-h-64 rounded-lg object-cover" /> : <video key={`${item.url}-${index}`} src={item.url} controls className="mt-3 max-h-64 rounded-lg" />)}</div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
