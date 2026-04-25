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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-wood-800">
        {/* Background */}
        <img
          src="/images/empty_cafe_interior.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-wood-900/90 to-wood-800/80"></div>

        {/* Login Card */}
        <div className="login-card relative z-10 w-full max-w-md mx-4">
          <div className="bg-cream-50/10 backdrop-blur-lg border border-cream-200/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-white tracking-widest flex items-center justify-center gap-3">
                <img
                  src="/images/image_4.png"
                  alt="Karsa Kafe Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                KARSA KAFE
              </h1>
              <div className="w-12 h-0.5 bg-amber-500 mx-auto mt-3 mb-4"></div>
              <p className="text-stone-400 text-sm">Masuk ke akun Anda</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@contoh.com"
                  className="w-full bg-white/10 border border-cream-200/20 text-cream-100 placeholder-stone-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full bg-white/10 border border-cream-200/20 text-cream-100 placeholder-stone-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-stone-400">
                  <input type="checkbox" className="mr-2 accent-amber-700" />{" "}
                  Ingat saya
                </label>
                <a
                  href="#"
                  className="text-amber-400 hover:text-amber-300 transition"
                >
                  Lupa password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg text-sm tracking-wider transition transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isProcessing ? "Memproses..." : "Masuk"}
              </button>
            </form>
            
            <div className="mt-6 flex flex-col items-center">
              <p className="text-stone-500 text-xs mb-3">Atau masuk dengan</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-md group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 group-hover:text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-md group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:text-[#ff0050]"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-md group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366] group-hover:text-green-600"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              </div>
            </div>

            <p className="text-center text-stone-500 text-xs mt-6">
              Belum punya akun?{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                Daftar
              </a>
            </p>
            <div className="text-center mt-4">
              <button
                onClick={() => router.push("/")}
                className="text-stone-400 text-xs hover:text-amber-400 transition"
              >
                &larr; Kembali ke Beranda
              </button>
            </div>
          </div>
          <p className="text-center text-stone-600 text-xs mt-6">
            &copy; 2024 Karsa Kafe Padang
          </p>
        </div>
      </div>
    </>
  );
}
