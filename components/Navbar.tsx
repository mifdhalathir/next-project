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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          <img
            src="/images/image_4.png"
            alt="Karsa Kafe Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wider transition transform hover:scale-105"
          >
            Login
          </Link>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white text-2xl p-2"
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
