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
      <div className="bg-wood-900 min-h-screen flex items-center justify-center p-4">
        <div className="login-card glass-form rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="font-display text-3xl font-bold text-white tracking-widest mb-2">KARSA CAFE</h1>
            <p className="text-stone-400 text-sm">Masuk untuk pengalaman personal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-cream-200 text-xs mb-1.5 uppercase tracking-wider">Email/Username</label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-cream-200/10 text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-cream-200 text-xs mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-cream-200/10 text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg text-sm tracking-wider font-bold transition transform hover:scale-[1.02] mt-4 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isProcessing ? "Memproses..." : "Masuk"}
            </button>
            
            <p className="text-center text-stone-500 text-xs mt-4">
              Atau kembali ke <a href="/" className="text-amber-500 hover:text-amber-400">Beranda</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
