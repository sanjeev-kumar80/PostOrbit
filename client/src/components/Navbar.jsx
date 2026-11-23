
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLoginModal } from "../context/LoginModalContext";
import {
  clearUserSession,
  hasUserSession,
  validateUserSession,
} from "../services/authService";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className="h-5 w-5">
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
    </svg>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    let active = true;
    let checkId = 0;

    const syncSession = async () => {
      const currentCheck = ++checkId;
      if (!hasUserSession()) {
        setIsLoggedIn(false);
        setSessionChecked(true);
        return;
      }

      setSessionChecked(false);
      try {
        await validateUserSession();
        if (active && currentCheck === checkId) setIsLoggedIn(true);
      } catch (error) {
        if (!active || currentCheck !== checkId) return;

        const authFailure = /invalid|expired|token|inactive|unauthorized/i.test(
          error.message || ""
        );
        if (authFailure) clearUserSession();
        setIsLoggedIn(!authFailure);
      } finally {
        if (active && currentCheck === checkId) setSessionChecked(true);
      }
    };

    syncSession();
    window.addEventListener("postorbit-auth-change", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      active = false;
      window.removeEventListener("postorbit-auth-change", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Our Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <a href="#home" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3977B9] text-lg font-bold text-white">
            P
          </div>
          <span className="text-xl font-bold tracking-tight theme-text">
            Post<span style={{ color: "var(--accent)" }}>Orbit</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 rounded-full border px-8 py-3 md:flex theme-card">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {sessionChecked && isLoggedIn ? (
            <Link
              to="/dashboard"
              className="hidden rounded-full bg-[#202939] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3977B9] sm:inline-flex"
            >
              Dashboard
            </Link>
          ) : sessionChecked ? (
            <button
              type="button"
              onClick={openLoginModal}
              className="hidden rounded-full bg-[#202939] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3977B9] sm:inline-flex"
            >
              Login
            </button>
          ) : null}

          {/* Mobile Menu Button */}
          {/* <button
            type="button"
            onClick={() => {
              closeMenu();
              openLoginModal();
            }}
            className="primary-button w-full"
          >
            Login
          </button> */}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t px-6 py-5 md:hidden theme-bg theme-border">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="nav-link"
              >
                {link.name}
              </a>
            ))}

            {sessionChecked && isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="primary-button w-full"
              >
                Dashboard
              </Link>
            ) : sessionChecked ? (
              <Link
                to="/signup"
                onClick={closeMenu}
                className="primary-button w-full"
              >
                Login
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
