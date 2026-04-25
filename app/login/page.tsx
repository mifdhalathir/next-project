"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";

export default function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-wood-950">
        {/* Background with Blur */}
        <div className="absolute inset-0">
          <img
            src="/images/empty_cafe_interior.png"
            alt=""
            className="w-full h-full object-cover blur-sm opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-wood-950/40"></div>
        </div>

        {/* Login Card */}
        <div className="login-card relative z-10 w-full max-w-md mx-4" data-aos="zoom-in" data-aos-duration="1000">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
            <div className="text-center mb-10">
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-amber-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-amber-500/30 shadow-lg transform rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20V4"></path>
                    <path d="m7 12 5-5"></path>
                    <path d="m7 12 5 5"></path>
                    <path d="M12 7h2a4 4 0 0 1 0 8h-2"></path>
                  </svg>
                </div>
                <h1 className="font-display text-3xl font-bold text-white tracking-[0.2em]">
                  KARSA KAFE
                </h1>
              </div>
              <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-4"></div>
              <p className="text-cream-100/60 text-sm">Masuk ke ruang inspirasi Anda</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-cream-100 text-xs uppercase tracking-widest mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@contoh.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-cream-100 text-xs uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div className="flex items-center justify-between text-xs tracking-wide">
                <label className="flex items-center text-cream-100/40 cursor-pointer hover:text-cream-100 transition">
                  <input type="checkbox" className="mr-2 accent-amber-600 rounded" />{" "}
                  Ingat saya
                </label>
                <a
                  href="#"
                  className="text-amber-400/60 hover:text-amber-400 transition"
                >
                  Lupa password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-amber-900/20"
              >
                {isProcessing ? "Memverifikasi..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center">
              <p className="text-cream-100/30 text-[10px] uppercase tracking-widest mb-4">Atau masuk dengan</p>
              <div className="flex gap-5">
                <a href="#" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-pink-500 transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-colors"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-green-500 transition-colors"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              </div>
            </div>

            <p className="text-center text-cream-100/20 text-[10px] uppercase tracking-widest mt-10">
              Belum punya akun?{" "}
              <a href="#" className="text-amber-500/60 hover:text-amber-400 transition ml-1 font-bold">
                Daftar
              </a>
            </p>
            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/")}
                className="text-cream-100/40 text-[10px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
              >
                &larr; Kembali ke Beranda
              </button>
            </div>
          </div>
          <p className="text-center text-white/10 text-[10px] uppercase tracking-[0.4em] mt-8">
            &copy; 2024 Karsa Kafe Padang
          </p>
        </div>
      </div>
    </>
  );
}
