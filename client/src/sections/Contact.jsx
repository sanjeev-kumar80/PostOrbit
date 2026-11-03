
import { Mail, Send, MapPin } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Contact form UI is ready! Backend integration will come later.');
  };

  return (
    <section id="contact" className="section-padding bg-[#F8F7FF]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

        <div>
          <span className="text-violet-600 font-bold text-sm uppercase tracking-widest">
            Contact Us
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#17152F] mt-5">
            Let's Start a
            <span className="gradient-text"> Conversation.</span>
          </h2>

          <p className="text-gray-500 leading-8 mt-6 max-w-lg">
            Have questions, suggestions or ideas? We would love
            to hear from you.
          </p>

          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Mail />
              </div>
              <div>
                <h4 className="font-bold text-[#17152F]">Email</h4>
                <p className="text-gray-500 text-sm">Contact us through our team</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <MapPin />
              </div>
              <div>
                <h4 className="font-bold text-[#17152F]">Location</h4>
                <p className="text-gray-500 text-sm">India</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 md:p-9 rounded-3xl shadow-xl shadow-violet-100/70 border border-violet-100 space-y-5"
        >
          <div>
            <label className="block font-semibold text-sm mb-2">Your Name</label>
            <input
              required
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-2">Email Address</label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-2">Message</label>
            <textarea
              required
              rows="4"
              placeholder="Write your message..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-200 transition"
          >
            Send Message <Send size={18} />
          </button>
        </form>

      </div>
    </section>
  );
}
