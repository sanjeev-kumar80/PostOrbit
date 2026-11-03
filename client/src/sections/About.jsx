
import { Target, Lightbulb, Rocket } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section-padding bg-[#F8F7FF]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <span className="text-violet-600 font-bold uppercase tracking-widest text-sm">
            About PostOrbit
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17152F] mt-5 leading-tight">
            Your Social Media.
            <span className="gradient-text"> Simplified.</span>
          </h2>

          <p className="text-gray-500 leading-8 mt-6">
            PostOrbit is an AI-powered social media management platform
            designed to simplify how individuals and businesses create,
            organize and manage their online content.
          </p>

          <p className="text-gray-500 leading-8 mt-4">
            Our goal is to bring content creation, platform management
            and performance tracking together in one simple workspace.
          </p>
        </div>

        <div className="space-y-5">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              desc: 'Make social media management simple and accessible.',
            },
            {
              icon: Lightbulb,
              title: 'Our Vision',
              desc: 'Help creators and businesses grow with intelligent tools.',
            },
            {
              icon: Rocket,
              title: 'Our Approach',
              desc: 'Combine AI, automation and simplicity in one platform.',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="bg-white rounded-2xl p-6 flex gap-5 shadow-sm border border-violet-100">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#17152F]">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 mt-2 leading-6">
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
