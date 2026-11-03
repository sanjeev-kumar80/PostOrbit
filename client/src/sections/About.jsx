
import { Target, Lightbulb, Rocket } from "lucide-react";

const aboutItems = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Make social media management simple and accessible.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    desc: "Help creators and businesses grow with intelligent tools.",
  },
  {
    icon: Rocket,
    title: "Our Approach",
    desc: "Combine AI, automation and simplicity in one platform.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="section-padding theme-section"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-bold uppercase tracking-widest text-sm theme-accent">
            About PostOrbit
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-5 leading-tight theme-heading">
            Your Social Media.
            <span className="gradient-text"> Simplified.</span>
          </h2>

          <p className="leading-8 mt-6 theme-muted">
            PostOrbit is an AI-powered social media management platform
            designed to simplify how individuals and businesses create,
            organize and manage their online content.
          </p>

          <p className="leading-8 mt-4 theme-muted">
            Our goal is to bring content creation, platform management
            and performance tracking together in one simple workspace.
          </p>
        </div>

        <div className="space-y-5">
          {aboutItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl p-6 flex gap-5 border theme-card theme-card-hover"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center theme-icon-box">
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-lg theme-heading">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-6 theme-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
