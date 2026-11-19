import { useEffect, useState } from "react";
import { Activity, CalendarClock, CheckCircle2, CircleAlert, Users, UserCheck, FileText, RefreshCw } from "lucide-react";
import { getAdminOverview } from "../services/adminService";

const cards = [
  ["Total Users", "totalUsers", Users, "#eef2ff", "#4f46e5"],
  ["Active Users", "activeUsers", UserCheck, "#ecfdf5", "#059669"],
  ["Total Posts", "totalPosts", FileText, "#eff6ff", "#2563eb"],
  ["Scheduled Posts", "scheduledPosts", CalendarClock, "#fff7ed", "#ea580c"],
  ["Published Posts", "publishedPosts", CheckCircle2, "#f0fdf4", "#16a34a"],
  ["Failed Posts", "failedPosts", CircleAlert, "#fef2f2", "#dc2626"],
];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try { setData((await getAdminOverview()).data); }
    catch (err) { setError(err.message || "Unable to load dashboard"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const dateLabel = (date) => new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return <div className="space-y-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold text-indigo-600">PLATFORM OVERVIEW</p><h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2><p className="mt-2 text-sm text-slate-500">A live snapshot of your PostOrbit community.</p></div>
      <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh</button>
    </div>
    {error && <div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={load} className="font-semibold underline">Try again</button></div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, key, Icon, tint, color]) => <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{loading ? <span className="inline-block h-9 w-16 animate-pulse rounded bg-slate-100"/> : (data?.stats?.[key] ?? "—")}</p></div><span className="rounded-xl p-3" style={{ background: tint, color }}><Icon size={21}/></span></div>
      </article>)}
    </div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Activity size={19}/></span><div><h3 className="font-bold text-slate-900">Recent activity</h3><p className="text-xs text-slate-500">Latest user and publishing events</p></div></div>
      {loading ? <div className="space-y-4 p-5">{[1,2,3].map(x => <div key={x} className="h-12 animate-pulse rounded-lg bg-slate-50"/>)}</div> : data?.activities?.length ? <ul className="divide-y divide-slate-100">{data.activities.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.type === "user_joined" ? "bg-indigo-500" : item.status === "failed" ? "bg-red-500" : item.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}/><span className="truncate text-sm text-slate-700">{item.message}</span></div><time className="shrink-0 text-xs text-slate-400">{dateLabel(item.createdAt)}</time></li>)}</ul> : <div className="px-5 py-12 text-center text-sm text-slate-500">No activity yet. New users and posts will appear here.</div>}
    </section>
  </div>;
}
