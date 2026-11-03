
import { useLoginModal } from "../context/LoginModalContext";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.6 10.6 0 0 1 5.57 0c2.12-1.45 3.06-1.15 3.06-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.45H4.97V9h2.96v9.45ZM6.45 7.71a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12 10.74H15.5v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.2-1.77 2.43v4.68H9.24V9h2.84v1.29h.04c.4-.74 1.36-1.53 2.8-1.53 3 0 3.55 1.97 3.55 4.53v5.16Z" />
    </svg>
  );
}

export default function Footer() {
  const { openLoginModal } = useLoginModal();

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold theme-heading">
              Post<span className="theme-accent">Orbit</span>
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-7 theme-muted">
              Create, schedule and publish your social media content from one
              place. Let AI make your social media workflow easier.
            </p>

            <div className="mt-6 flex gap-4 theme-muted">
              <a href="#" aria-label="Instagram" className="transition hover:text-violet-500">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="GitHub" className="transition hover:text-violet-500">
                <GithubIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-violet-500">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold theme-heading">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm theme-muted">
              <li><a href="#home" className="transition hover:text-violet-500">Home</a></li>
              <li><a href="#features" className="transition hover:text-violet-500">Features</a></li>
              <li><a href="#about" className="transition hover:text-violet-500">About Us</a></li>
              <li><a href="#team" className="transition hover:text-violet-500">Our Team</a></li>
              <li><a href="#contact" className="transition hover:text-violet-500">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold theme-heading">Features</h3>
            <ul className="mt-5 space-y-3 text-sm theme-muted">
              <li>AI Caption Generator</li>
              <li>Multi-Platform Publishing</li>
              <li>Smart Scheduling</li>
              <li>Analytics Dashboard</li>
              <li>Content Management</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold theme-heading">Get Started</h3>
            <p className="mt-5 text-sm leading-7 theme-muted">
              Start managing all your social media accounts from one simple
              dashboard.
            </p>

            <button
              type="button"
              onClick={openLoginModal}
              className="mt-5 inline-block rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--accent-gradient)" }}
            >
              Get Started
            </button>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-6 text-center text-sm theme-muted"
          style={{ borderColor: "var(--border)" }}
        >
          © {new Date().getFullYear()} PostOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
