import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearAdminSession, getAdminProfile, hasAdminSession } from "../services/adminService";

export default function RequireAdmin() {
  const [state, setState] = useState(() => hasAdminSession() ? "loading" : "denied");
  useEffect(() => {
    if (!hasAdminSession()) return;
    getAdminProfile().then(() => setState("allowed")).catch(() => { clearAdminSession(); setState("denied"); });
  }, []);
  if (state === "loading") return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Verifying administrator session…</div>;
  if (state === "denied") return <Navigate to="/admin-login" replace/>;
  return <Outlet/>;
}
