
const GithubIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.6 10.6 0 0 1 5.57 0c2.12-1.45 3.06-1.15 3.06-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
  </svg>
);

const LinkedinIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.45H4.97V9h2.96v9.45ZM6.45 7.71a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12 10.74H15.5v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.2-1.77 2.43v4.68H9.24V9h2.84v1.29h.04c.4-.74 1.36-1.53 2.8-1.53 3 0 3.55 1.97 3.55 4.53v5.16Z" />
  </svg>
);

const members = [
  {
    name: "Team Member 1",
    role: "Project Lead & Developer",
    initials: "TM",
    color: "from-violet-500 to-indigo-600",
  },
  {
    name: "Team Member 2",
    role: "Frontend Developer",
    initials: "TM",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Team Member 3",
    role: "Backend Developer",
    initials: "TM",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Team Member 4",
    role: "UI/UX & Research",
    initials: "TM",
    color: "from-indigo-500 to-violet-600",
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="section-padding"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-bold uppercase tracking-widest text-sm theme-accent">
            Meet The People
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 theme-heading">
            The Team Behind <span className="gradient-text">PostOrbit</span>
          </h2>

          <p className="mt-5 theme-muted">
            A team working together to make social media management smarter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {members.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border p-6 text-center theme-card theme-card-hover transition"
            >
              <div
                className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
              >
                {member.initials}
              </div>

              <h3 className="text-lg font-bold mt-6 theme-heading">
                {member.name}
              </h3>

              <p className="text-sm mt-2 theme-accent">
                {member.role}
              </p>

              <div className="flex justify-center gap-4 mt-5 theme-muted">
                <a href="#" aria-label={`${member.name} LinkedIn`} className="hover:text-violet-500 transition">
                  <LinkedinIcon />
                </a>
                <a href="#" aria-label={`${member.name} GitHub`} className="hover:text-violet-500 transition">
                  <GithubIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
