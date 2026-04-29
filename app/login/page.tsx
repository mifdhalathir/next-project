"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import { addKarsaNotification } from "@/components/NotificationHub";
import SocialIcons from "@/components/SocialIcons";
import MagneticWrapper from "@/components/MagneticWrapper";



export default function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !tableNumber) {
      setError("Eits! Isi namamu dan pilih nomor meja dulu ya!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    // Simulate successful login
    setTimeout(() => {
      localStorage.setItem("karsa_user_name", username);
      localStorage.setItem("karsa_table_number", tableNumber);
      sessionStorage.setItem("username", username);
      
      // Notify Kasir
      addKarsaNotification(`Pelanggan ${username} telah Aktif (Meja ${tableNumber || '??'})`, "info");
      
      window.dispatchEvent(new Event("storage")); // Notify components
      
      // Selalu arahkan ke Halaman Utama (Web Utama)
      router.push("/");
    }, 1500);
  };

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden mesh-gradient selection:bg-amber-500 selection:text-black">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/20 rounded-full blur-[120px]"></div>

        {/* Login Card with Glassmorphism */}
        <div 
          className={`relative z-10 w-full max-w-md mx-4 transition-all duration-1000 transform ${shake ? 'animate-shake' : ''}`}
          data-aos="zoom-in"
        >
          <div className="bg-black/20 backdrop-blur-[50px] border border-white/10 rounded-[3rem] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden group relative">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none"></div>

            {/* Logo Section */}
            <div className="text-center mb-12 relative">
              <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-[0.5em] mb-4 animate-pulse">Wangi kopi sudah menantimu</p>
              
              <div className="w-24 h-24 mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full"></div>
                <div className="relative w-full h-full bg-black/40 border border-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden">
                   <img 
                    src="/images/logo.png" 
                    alt="Karsa Kafe Logo" 
                    className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" 
                   />
                </div>
              </div>

              <h1 className="font-display text-5xl font-black text-white tracking-tighter italic">
                KARSA <span className="text-amber-500">KAFE</span>
              </h1>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="w-10 h-[1px] bg-white/5"></div>
                <SocialIcons />
                <div className="w-10 h-[1px] bg-white/5"></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-2xl mb-8 animate-bounce">
                <p className="text-red-400 text-[9px] uppercase font-black tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group/input relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="NAMA LENGKAP"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl text-white placeholder-white/20 py-4 px-6 outline-none focus:border-amber-500 focus:bg-white/10 transition-all font-black tracking-widest text-xs uppercase"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-amber-500 transition-colors">👤</span>
              </div>

              <div className="group/input relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl text-white placeholder-white/20 py-4 px-6 outline-none focus:border-amber-500 focus:bg-white/10 transition-all font-black tracking-widest text-xs uppercase"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>

              <div className="group/input relative">
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl text-white py-4 px-6 outline-none focus:border-amber-500 focus:bg-white/10 transition-all font-black tracking-widest text-xs uppercase appearance-none cursor-pointer"
                >
                  <option value="" className="bg-stone-950">NOMOR MEJA</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')} className="bg-stone-950">
                      MEJA {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">🪑</span>
              </div>

              <MagneticWrapper strength={0.4} distance={60}>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-2xl text-xs font-black tracking-[0.4em] uppercase transition-all shadow-2xl relative overflow-hidden group/btn btn-glow-pulse active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10">{isProcessing ? "MEMVERIFIKASI..." : "MASUK KE KARSA"}</span>
                </button>
              </MagneticWrapper>
            </form>

            <div className="mt-12 text-center">
               <button 
                  onClick={() => router.push("/")}
                  className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-black hover:text-amber-500 transition-all border-b border-transparent hover:border-amber-500 pb-1"
               >
                 &larr; Kembali ke Beranda
               </button>
            </div>
          </div>

          <p className="text-center text-white/10 text-[8px] uppercase tracking-[0.8em] mt-12 font-black">
            AUTHENTIC EXPERIENCE &bull; EST. 2024
          </p>
        </div>
      </div>



      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          75% { transform: translateX(15px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </>
  );
}
