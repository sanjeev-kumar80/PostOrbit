import { Link } from "react-router-dom";

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 4 3 5-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.45H4.97V9h2.96v9.45ZM6.45 7.71a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12 10.74H15.5v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.2-1.77 2.43v4.68H9.24V9h2.84v1.29h.04c.4-.74 1.36-1.53 2.8-1.53 3 0 3.55 1.97 3.55 4.53v5.16Z" />
    </svg>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#F8F7FF]">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* Hero Content */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            <SparklesIcon />
            AI-Powered Social Media Management
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-[#17152F] sm:text-6xl">
            One Click
            <span className="block text-violet-600">
              Social Publishing.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Create engaging content, generate AI-powered captions, schedule
            posts and manage all your social media platforms from one
            powerful dashboard.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-violet-600 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1 hover:bg-violet-700"
            >
              Start Free →
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-[#17152F] transition hover:border-violet-400 hover:text-violet-600"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon />
              </span>
              AI Content Creation
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon />
              </span>
              Smart Scheduling
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-300/40 to-indigo-300/40 blur-2xl" />

          <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-violet-200/50 sm:p-7">
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <h3 className="text-lg font-bold text-[#17152F]">
                  Dashboard Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your social media at a glance
                </p>
              </div>

              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <ChartIcon />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-gray-500">Total Posts</p>
                <h2 className="mt-2 text-3xl font-bold text-[#17152F]">120</h2>
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  +12% this month
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4">
                <p className="text-sm text-gray-500">Connected Accounts</p>
                <h2 className="mt-2 text-3xl font-bold text-[#17152F]">4</h2>
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  All accounts active
                </p>
              </div>
            </div>

            {/* Scheduled Posts */}
            <div className="mt-6 rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[#17152F]">
                  Upcoming Posts
                </h4>
                <span className="text-sm font-medium text-violet-600">
                  View all
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                    <InstagramIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#17152F]">
                      Instagram Campaign
                    </p>
                    <p className="text-xs text-gray-500">Today, 05:30 PM</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <FacebookIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#17152F]">
                      Product Launch
                    </p>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    Pending
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                    <LinkedinIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#17152F]">
                      Weekly Business Update
                    </p>
                    <p className="text-xs text-gray-500">Friday, 11:00 AM</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom AI card */}
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white">
              <div className="rounded-xl bg-white/20 p-3">
                <SparklesIcon />
              </div>
              <div>
                <h4 className="font-semibold">AI Caption Generator</h4>
                <p className="mt-1 text-sm text-violet-100">
                  Create engaging captions in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <CalendarIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-[#17152F]">
                  Smart Scheduling
                </p>
                <p className="text-xs text-gray-500">Save your time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;