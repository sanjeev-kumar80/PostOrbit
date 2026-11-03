
import { useState } from 'react';
import { Menu, X, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ['Home', '#home'],
    ['Features', '#features'],
    ['About', '#about'],
    ['Our Team', '#team'],
    ['Contact', '#contact'],
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <a href="#home" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white">
            <Orbit size={25} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#17152F]">
            Post<span className="text-violet-600">Orbit</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-gray-600 hover:text-violet-600 transition"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="font-semibold text-gray-700 hover:text-violet-600"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 px-6 py-5 flex flex-col gap-5">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-medium"
            >
              {label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-violet-600 text-white text-center rounded-xl py-3 font-semibold"
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
