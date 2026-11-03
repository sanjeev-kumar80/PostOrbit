
import { Link } from 'react-router-dom';
import { Orbit, UserRound, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LoginSelection() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6 py-12">

      <div className="max-w-4xl w-full">

        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-12">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-[#17152F]">
            <Orbit className="text-violet-600" size={32} />
            Post<span className="text-violet-600">Orbit</span>
          </Link>

          <h1 className="text-4xl font-extrabold text-[#17152F] mt-8">
            Welcome to PostOrbit
          </h1>

          <p className="text-gray-500 mt-3">
            Choose how you want to access the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">

          <div className="bg-white p-9 rounded-3xl border border-violet-100 shadow-xl shadow-violet-100/50 hover:-translate-y-2 transition">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <UserRound size={32} />
            </div>

            <h2 className="text-2xl font-bold mt-7 text-[#17152F]">
              User Login
            </h2>

            <p className="text-gray-500 leading-7 mt-3">
              Access your dashboard, create AI captions and manage
              your social media posts.
            </p>

            <Link
              to="/user-login"
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition"
            >
              Continue as User <ArrowRight size={18} />
            </Link>
          </div>

          <div className="bg-[#17152F] p-9 rounded-3xl shadow-xl hover:-translate-y-2 transition">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-violet-300 flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>

            <h2 className="text-2xl font-bold mt-7 text-white">
              Admin Login
            </h2>

            <p className="text-gray-400 leading-7 mt-3">
              Manage platform users, monitor posts and control
              the overall application.
            </p>

            <Link
              to="/admin-login"
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-[#17152F] font-bold hover:bg-violet-100 transition"
            >
              Continue as Admin <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
