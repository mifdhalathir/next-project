"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [area, setArea] = useState<string>("Indoor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 80);

    const checkUser = () => {
      setUserName(localStorage.getItem("karsa_user_name"));
      setUserAvatar(localStorage.getItem("karsa_user_avatar"));
      setTableNumber(localStorage.getItem("karsa_table_number"));
      setArea(localStorage.getItem("karsa_area") || "Indoor");
    };

    requestAnimationFrame(() => {
      setMounted(true);
      checkUser();
    });

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkUser);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "false") {
      document.documentElement.classList.remove("dark");
      requestAnimationFrame(() => setIsDark(false));
    } else {
      document.documentElement.classList.add("dark");
      requestAnimationFrame(() => setIsDark(true));
      if (stored === null) localStorage.setItem("darkMode", "true");
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
    } catch (e) {
      window.location.href = "/login";
    }
  };

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
    <nav id="navbar" className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 relative">
        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center md:items-start group">
            <div className="flex items-center gap-4">
              {logoError ? (
                <div className="w-11 h-11 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                  <span className="text-xl">☕</span>
                </div>
              ) : (
                <img 
                  src="/images/logo.png" 
                  alt="Logo" 
                  onError={() => setLogoError(true)}
                  className="w-14 h-14 object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-110" 
                />
              )}
              <span className="font-display text-xl font-black text-white tracking-[0.2em] uppercase hidden sm:block">
                KARSA <span className="text-amber-500">KAFE</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] tracking-widest font-black uppercase">HOME</button>
            <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] tracking-widest font-black uppercase">MENU / PESAN</button>
            <button onClick={() => document.getElementById('reservasi')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] tracking-widest font-black uppercase">RESERVASI</button>
            <button onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] tracking-widest font-black uppercase">KONTAK</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
            </button>

            {mounted && userName ? (
              <div className="flex items-center gap-4">
                {/* Avatar: Google photo or initials badge */}
                {userAvatar ? (
                  <button
                    onClick={() => window.dispatchEvent(new Event("openTableModal"))}
                    className="relative group/avatar flex items-center gap-3 cursor-pointer border border-white/10 hover:border-amber-500/50 px-3 py-1.5 rounded-full bg-white/5 transition-all"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={userAvatar}
                        alt={userName}
                        referrerPolicy="no-referrer"
                        className="relative w-8 h-8 rounded-full object-cover border-2 border-amber-500/60 shadow-lg shadow-amber-900/30 transition-transform duration-300 group-hover/avatar:scale-110"
                      />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-amber-400 hidden sm:block">
                      {userName.split(" ")[0]} {tableNumber ? `| 📍 Meja ${tableNumber}` : "| 📍 Pilih Meja"}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => window.dispatchEvent(new Event("openTableModal"))}
                    className={`font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:border-amber-500 transition-colors ${
                      area === "Outdoor"
                        ? "text-green-500 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                        : "text-amber-500 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
                    } px-4 py-2 rounded-full border flex items-center gap-2 shadow-lg`}
                  >
                    {/* Initials badge for manual login */}
                    <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[8px] font-black shrink-0">
                      {userName.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="opacity-80 hidden sm:inline">{userName.split(" ")[0]}</span>
                    <span className="opacity-40 hidden sm:inline">|</span>
                    <span className="hidden sm:inline">📍 {tableNumber ? `Meja ${tableNumber}` : "Pilih Meja"}</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white/40 hover:text-red-500 transition-colors text-[9px] font-bold uppercase tracking-widest"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-amber-900/40"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
