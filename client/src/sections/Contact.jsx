
import { Mail, Send, MapPin } from "lucide-react";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Contact form UI is ready! Backend integration will come later.");
  };

  return (
    <section
      id="contact"
      className="section-padding"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <span className="font-bold text-sm uppercase tracking-widest theme-accent">
            Contact Us
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-5 theme-heading">
            Let's Start a
            <span className="gradient-text"> Conversation.</span>
          </h2>

          <p className="leading-8 mt-6 max-w-lg theme-muted">
            Have questions, suggestions or ideas? We would love
            to hear from you.
          </p>

          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center theme-icon-box">
                <Mail />
              </div>
              <div>
                <h4 className="font-bold theme-heading">Email</h4>
                <p className="text-sm theme-muted">
                  Contact us through our team
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center theme-icon-box">
                <MapPin />
              </div>
              <div>
                <h4 className="font-bold theme-heading">Location</h4>
                <p className="text-sm theme-muted">India</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-7 md:p-9 rounded-3xl border space-y-5 theme-card theme-form"
        >
          <div>
            <label className="block font-semibold text-sm mb-2 theme-heading">
              Your Name
            </label>
            <input
              required
              type="text"
              placeholder="Enter your name"
              className="theme-input w-full px-4 py-3 rounded-xl border outline-none transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-2 theme-heading">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="theme-input w-full px-4 py-3 rounded-xl border outline-none transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-2 theme-heading">
              Message
            </label>
            <textarea
              required
              rows="4"
              placeholder="Write your message..."
              className="theme-input w-full px-4 py-3 rounded-xl border outline-none resize-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: "var(--accent-gradient)" }}
          >
            Send Message <Send size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
