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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="#"
          className="font-display text-2xl font-bold text-white tracking-widest flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
            <line x1="6" y1="2" x2="6" y2="4"></line>
            <line x1="10" y1="2" x2="10" y2="4"></line>
            <line x1="14" y1="2" x2="14" y2="4"></line>
          </svg>
          KARSA CAFE
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#home"
            className="nav-link text-cream-100 hover:text-cream-300 text-sm tracking-wide"
          >
            HOME
          </Link>
          <Link
            href="#menu"
            className="nav-link text-cream-100 hover:text-cream-300 text-sm tracking-wide"
          >
            MENU
          </Link>
          <Link
            href="#reservasi"
            className="nav-link text-cream-100 hover:text-cream-300 text-sm tracking-wide"
          >
            RESERVASI
          </Link>
          <Link
            href="#kontak"
            className="nav-link text-cream-100 hover:text-cream-300 text-sm tracking-wide"
          >
            KONTAK
          </Link>
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            title="Dark Mode"
          >
            <span>{isDark ? "🌙" : "☀️"}</span>
          </button>
          <Link
            href="/login"
            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-1.5 rounded text-sm transition"
          >
            Login
          </Link>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white text-2xl"
        >
          &#9776;
        </button>
      </div>
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
