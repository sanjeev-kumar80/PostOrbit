
import {
  Sparkles, Share2, CalendarDays,
  BarChart3, Layers, Zap
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Caption Generator',
    desc: 'Generate engaging, creative and platform-specific captions in seconds.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Share2,
    title: 'Multi-Platform Posting',
    desc: 'Manage your social media content from one centralized workspace.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Layers,
    title: 'Platform Selection',
    desc: 'Customize your content for Instagram, Facebook, LinkedIn and more.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: CalendarDays,
    title: 'Smart Scheduling',
    desc: 'Plan your content calendar and organize upcoming posts.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track content performance and understand audience engagement.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Faster Workflow',
    desc: 'Save time by managing your content creation in one place.',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-violet-600 font-bold text-sm uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17152F] mt-4">
            Everything You Need to
            <span className="gradient-text"> Grow Online</span>
          </h2>
          <p className="text-gray-500 mt-5 leading-7">
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
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70 hover:-translate-y-2 transition duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
                  <Icon size={27} />
                </div>

                <h3 className="text-xl font-bold text-[#17152F] mt-7">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-7 mt-3">
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
