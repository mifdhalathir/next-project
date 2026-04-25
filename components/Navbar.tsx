"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const isDeepNight = currentHour >= 18 || currentHour < 8;
    const stored = localStorage.getItem("darkMode");

    if (stored === "true" || (stored === null && isDeepNight)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("darkMode", "false");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("darkMode", "true");
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 relative">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center md:items-start group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20V4"></path>
                  <path d="m7 12 5-5"></path>
                  <path d="m7 12 5 5"></path>
                  <path d="M12 7h2a4 4 0 0 1 0 8h-2"></path>
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-white tracking-[0.2em] uppercase">
                KARSA KAFE
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="#home" className="nav-link text-cream-100 hover:text-cream-300 text-xs tracking-widest font-bold uppercase">HOME</Link>
            <Link href="#menu" className="nav-link text-cream-100 hover:text-cream-300 text-xs tracking-widest font-bold uppercase">MENU</Link>
            <Link href="#reservasi" className="nav-link text-cream-100 hover:text-cream-300 text-xs tracking-widest font-bold uppercase">RESERVASI</Link>
            <Link href="#kontak" className="nav-link text-cream-100 hover:text-cream-300 text-xs tracking-widest font-bold uppercase">KONTAK</Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            >
              <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
            </button>
            <Link
              href="/login"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </div>  <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white text-2xl p-2"
        >
          &#9776;
        </button>
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-wood-800/95 backdrop-blur px-4 pb-4 space-y-2`}
      >
        <Link
          href="#home"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block text-cream-100 py-2 text-sm"
        >
          HOME
        </Link>
        <Link
          href="#menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block text-cream-100 py-2 text-sm"
        >
          MENU
        </Link>
        <Link
          href="#reservasi"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block text-cream-100 py-2 text-sm"
        >
          RESERVASI
        </Link>
        <Link
          href="#kontak"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block text-cream-100 py-2 text-sm"
        >
          KONTAK
        </Link>
        <Link
          href="/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block bg-amber-700 text-white text-center py-2 rounded text-sm"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
