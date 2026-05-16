"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [username, setUsername] = useState("");

  const router = useRouter();

  const handleSimpleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim()) {
      setError("Isi namamu dulu ya, Sultan! 👑");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("karsa_user_name", username);
      addActivityLog(`Login: ${username}`, "login");
      addKarsaNotification(`Selamat datang, ${username}! 👋`, "success");
      window.dispatchEvent(new Event("storage")); 
      router.push("/");
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      setError("Fitur Google Login belum dikonfigurasi. Pakai login nama saja ya! 🛠️");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    try {
      setIsProcessing(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || "Sultan";
      
      localStorage.setItem("karsa_user_name", displayName);
      if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);
      
      addActivityLog(`Login Google: ${displayName}`, "login");
      addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (err: unknown) {
      setError("Google Login Gagal. Silakan coba lagi.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <PageTransition />
      
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-950 selection:bg-amber-500 selection:text-black cursor-none">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(217,119,6,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(120,53,15,0.2)_0%,_transparent_70%)] pointer-events-none"></div>

        <div 
          className={`relative z-10 w-full max-w-[420px] mx-4 transition-all duration-700 ${shake ? 'animate-shake' : ''}`}
          data-aos="zoom-in"
        >
          <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] px-8 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all duration-500"></div>
                <div className="relative w-full h-full bg-[#222] border border-amber-500/30 rounded-full flex items-center justify-center text-3xl">☕</div>
              </div>

              <h1 className="font-display text-3xl font-black text-white tracking-[0.2em] uppercase">
                KARSA <span className="text-amber-500">CAFE</span>
              </h1>
              <p className="text-stone-500 text-[10px] tracking-[0.4em] uppercase font-black mt-3">Ruang Inspirasi</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl mb-6 text-center">
                <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleSimpleLogin} className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-2xl text-white placeholder-stone-600 px-6 py-5 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-2xl text-xs font-black tracking-[0.3em] uppercase transition-all shadow-xl shadow-amber-900/20 active:scale-95"
              >
                {isProcessing ? "MEMPROSES..." : "MASUK SEKARANG"}
              </button>

              <div className="relative flex items-center justify-center my-8">
                <div className="border-t border-[#333] w-full"></div>
                <span className="text-stone-600 text-[9px] px-4 bg-[#151515] absolute font-black tracking-[0.4em] uppercase">ATAU</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#222] hover:bg-[#282828] border border-[#333] hover:border-amber-500/30 text-white py-5 rounded-2xl text-xs font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Login
              </button>
            </form>
          </div>

          <p className="text-center text-stone-700 text-[9px] tracking-[0.5em] uppercase mt-10 font-black">
            &copy; 2024 KARSA CAFE PADANG
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </>
  );
}
