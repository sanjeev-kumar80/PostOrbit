import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, LogOut, ShieldCheck, Menu, X, Users, Share2, FileText, CalendarClock, ChartNoAxesCombined } from "lucide-react";
import { adminLogout } from "../services/adminService";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = async () => { try { await adminLogout(); } finally { navigate("/admin-login", { replace: true }); } };
  const navClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`;

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <Link to="/admin" className="flex items-center gap-3 px-2 py-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><ShieldCheck size={21}/></span><span><b className="block text-lg leading-tight">PostOrbit</b><small className="text-xs text-slate-500">Admin console</small></span></Link>
      <button className="absolute right-4 top-6 lg:hidden" onClick={() => setOpen(false)}><X size={20}/></button>
      <p className="mb-3 mt-10 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
      <nav className="space-y-1"><NavLink end to="/admin" className={navClass} onClick={() => setOpen(false)}><LayoutDashboard size={18}/>Overview</NavLink><NavLink to="/admin/users" className={navClass} onClick={() => setOpen(false)}><Users size={18}/>Users</NavLink><NavLink to="/admin/social-accounts" className={navClass} onClick={() => setOpen(false)}><Share2 size={18}/>Social accounts</NavLink><NavLink to="/admin/posts" className={navClass} onClick={() => setOpen(false)}><FileText size={18}/>Posts</NavLink><NavLink to="/admin/scheduled-posts" className={navClass} onClick={() => setOpen(false)}><CalendarClock size={18}/>Scheduled posts</NavLink><NavLink to="/admin/analytics" className={navClass} onClick={() => setOpen(false)}><ChartNoAxesCombined size={18}/>Analytics</NavLink><NavLink to="/admin/settings" className={navClass} onClick={() => setOpen(false)}><Settings size={18}/>Settings</NavLink></nav>
      <div className="mt-auto border-t border-slate-100 pt-4"><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"><LogOut size={18}/>Sign out</button><Link to="/" className="mt-2 block px-3 py-2 text-xs text-slate-400 hover:text-slate-700">← Back to website</Link></div>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><p className="hidden text-sm text-slate-500 lg:block">Administration</p><div className="ml-auto flex items-center gap-3"><span className="hidden text-sm font-medium text-slate-600 sm:block">Platform administrator</span><span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">A</span></div></header><main className="mx-auto max-w-7xl p-5 md:p-8"><Outlet/></main></div>
  </div>;
}
