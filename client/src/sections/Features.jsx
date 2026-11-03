
import {
  Sparkles,
  Share2,
  CalendarDays,
  BarChart3,
  Layers,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Caption Generator",
    desc: "Generate engaging, creative and platform-specific captions in seconds.",
  },
  {
    icon: Share2,
    title: "Multi-Platform Posting",
    desc: "Manage your social media content from one centralized workspace.",
  },
  {
    icon: Layers,
    title: "Platform Selection",
    desc: "Customize your content for Instagram, Facebook, LinkedIn and more.",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    desc: "Plan your content calendar and organize upcoming posts.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track content performance and understand audience engagement.",
  },
  {
    icon: Zap,
    title: "Faster Workflow",
    desc: "Save time by managing your content creation in one place.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="section-padding"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-bold text-sm uppercase tracking-widest theme-accent">
            What We Offer
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 theme-heading">
            Everything You Need to
            <span className="gradient-text"> Grow Online</span>
          </h2>

          <p className="mt-5 leading-7 theme-muted">
            Powerful tools to simplify your social media workflow
            and make content management effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group p-8 rounded-3xl border theme-card theme-card-hover transition duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center theme-icon-box">
                  <Icon size={27} />
                </div>

                <h3 className="text-xl font-bold mt-7 theme-heading">
                  {feature.title}
                </h3>

                <p className="leading-7 mt-3 theme-muted">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
