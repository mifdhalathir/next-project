"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SocialIcons from "./SocialIcons";
import MagneticWrapper from "./MagneticWrapper";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [userName, setUserName] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [area, setArea] = useState<string>("Indoor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 80);
    };

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    
    const checkUser = () => {
      setUserName(localStorage.getItem("karsa_user_name"));
      setTableNumber(localStorage.getItem("karsa_table_number"));
      setStatus(localStorage.getItem("karsa_status"));
      setArea(localStorage.getItem("karsa_area") || "Indoor");
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    checkUser();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkUser);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");

    // Default to dark mode (true) if no preference is stored
    if (stored === "false") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      if (stored === null) localStorage.setItem("darkMode", "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("karsa_user_name");
    localStorage.removeItem("karsa_table_number");
    localStorage.removeItem("karsa_area");
    localStorage.removeItem("karsa_user_avatar");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("karsa_voucher_used");
    setUserName(null);
    setTableNumber(null);
    window.dispatchEvent(new Event("storage"));
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
            <div className="flex items-center gap-4">
              {logoError ? (
                <div className="w-11 h-11 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 backdrop-blur-md shadow-inner">
                  <span className="text-xl">☕</span>
                </div>
              ) : (
                <img 
                  src="/images/logo.png" 
                  alt="Karsa Kafe Logo" 
                  onError={() => setLogoError(true)}
                  className="w-14 h-14 object-contain brightness-0 invert drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500" 
                />
              )}
              <span className="font-display text-xl font-black text-white tracking-[0.2em] uppercase hidden sm:block">
                KARSA <span className="text-amber-500">KAFE</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-xs tracking-widest font-bold uppercase">HOME</button>
            <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-xs tracking-widest font-bold uppercase">MENU</button>
            <button onClick={() => document.getElementById('reservasi')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-xs tracking-widest font-bold uppercase">RESERVASI</button>
            <button onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-xs tracking-widest font-bold uppercase">KONTAK</button>
            
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-white ml-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               {currentTime || "00:00:00"} <span className="text-green-500 ml-1">OPEN NOW</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/10"
            >
              <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
            </button>
            {userName ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  {(() => {
                    if (!mounted) return null;
                    const isVip = status === "reserved";
                    
                    if (isVip) {
                      return (
                        <span className="text-[#E0115F] font-black text-[10px] uppercase tracking-widest bg-[#E0115F]/10 px-4 py-2 rounded-full border border-[#E0115F]/30 shadow-[0_0_15px_rgba(224,17,95,0.2)]">
                          VIP Guest: {userName} {tableNumber && `• MEJA ${tableNumber}`}
                        </span>
                      );
                    }
                    
                    const areaColor = area === "Outdoor" ? "text-green-500" : "text-amber-500";
                    const areaIcon = area === "Outdoor" ? "🌿" : "❄️";
                    const bgColor = area === "Outdoor" ? "bg-green-500/10" : "bg-amber-500/10";
                    const borderColor = area === "Outdoor" ? "border-green-500/30" : "border-amber-500/30";
                    
                    return (
                      <span className={`${areaColor} font-black text-[10px] uppercase tracking-widest ${bgColor} px-4 py-2 rounded-full border ${borderColor}`}>
                        {userName} {tableNumber && `• Meja ${tableNumber} [${area} ${areaIcon}]`}
                      </span>
                    );
                  })()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-white/40 hover:text-red-500 transition-colors text-[9px] font-bold uppercase tracking-widest"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SocialIcons className="mr-2" />
                <MagneticWrapper>
                  <Link
                    href="/login"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-amber-900/40"
                  >
                    LOGIN
                  </Link>
                </MagneticWrapper>
              </div>

            )}
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
        <button
          onClick={() => { document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          className="block text-cream-100 py-2 text-sm w-full text-left"
        >
          HOME
        </button>
        <button
          onClick={() => { document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          className="block text-cream-100 py-2 text-sm w-full text-left"
        >
          MENU
        </button>
        <button
          onClick={() => { document.getElementById('reservasi')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          className="block text-cream-100 py-2 text-sm w-full text-left"
        >
          RESERVASI
        </button>
        <button
          onClick={() => { document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          className="block text-cream-100 py-2 text-sm w-full text-left"
        >
          KONTAK
        </button>
        {userName ? (
          <div className="pt-4 border-t border-white/5">
             <span className="block text-amber-500 text-xs font-black uppercase tracking-widest mb-1">{userName}</span>
             {tableNumber && <span className="block text-stone-500 text-[10px] font-bold mb-3 uppercase tracking-widest">Meja {tableNumber}</span>}
             <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="block w-full bg-red-900/20 text-red-500 text-center py-3 rounded-xl text-xs font-bold uppercase"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block bg-amber-700 text-white text-center py-3 rounded-xl text-xs font-bold uppercase"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
