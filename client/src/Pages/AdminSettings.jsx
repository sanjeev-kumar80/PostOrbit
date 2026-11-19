import { useEffect, useState } from "react";
import { KeyRound, UserRound, ShieldCheck } from "lucide-react";
import { changeAdminPassword, getAdminProfile } from "../services/adminService";

export default function AdminSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getAdminProfile().then((result) => setProfile(result.user)).catch((err) => setProfileError(err.message)).finally(() => setLoading(false)); }, []);
  const submit = async (event) => {
    event.preventDefault(); setNotice(""); setError("");
    if (form.newPassword !== form.confirmPassword) { setError("New passwords do not match."); return; }
    setSaving(true);
    try { const result = await changeAdminPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }); setNotice(result.message); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    catch (err) { setError(err.message || "Unable to update password"); }
    finally { setSaving(false); }
  };
  const field = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";
  return <div className="mx-auto max-w-3xl space-y-7"><div><p className="text-sm font-semibold text-indigo-600">ACCOUNT</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Settings</h2><p className="mt-2 text-sm text-slate-500">Manage your administrator profile and sign-in credentials.</p></div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><UserRound size={19}/></span><div><h3 className="font-bold">Admin profile</h3><p className="text-xs text-slate-500">Account information from your secure profile</p></div></div>{loading ? <p className="text-sm text-slate-500">Loading profile…</p> : profileError ? <p role="alert" className="text-sm text-red-600">{profileError}</p> : <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Name</p><p className="mt-1 font-semibold">{profile?.name}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Email</p><p className="mt-1 font-semibold">{profile?.email}</p></div><div className="flex items-center gap-2 text-xs text-slate-500 sm:col-span-2"><ShieldCheck size={15} className="text-emerald-600"/>Role verified by the server · {profile?.role}</div></div>}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><KeyRound size={19}/></span><div><h3 className="font-bold">Change password</h3><p className="text-xs text-slate-500">Use at least 8 characters for your new password</p></div></div>{notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}{error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Current password<input required type="password" autoComplete="current-password" className={field} value={form.currentPassword} onChange={e => setForm({...form,currentPassword:e.target.value})}/></label><label className="block text-sm font-medium">New password<input required minLength={8} type="password" autoComplete="new-password" className={field} value={form.newPassword} onChange={e => setForm({...form,newPassword:e.target.value})}/></label><label className="block text-sm font-medium">Confirm new password<input required minLength={8} type="password" autoComplete="new-password" className={field} value={form.confirmPassword} onChange={e => setForm({...form,confirmPassword:e.target.value})}/></label><button disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{saving ? "Updating…" : "Update password"}</button></form></section>
  </div>;
}
