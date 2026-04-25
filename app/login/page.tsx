"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import { addKarsaNotification } from "@/components/NotificationHub";

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
    
    if (!username || !password) {
      setError("Harap isi semua kolom");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    // Simulate successful login
    setTimeout(() => {
      localStorage.setItem("karsa_user_name", username);
      if (tableNumber) {
        localStorage.setItem("karsa_table_number", tableNumber);
      }
      
      // Notify Kasir
      addKarsaNotification(`Pelanggan ${username} telah Aktif (Meja ${tableNumber || '??'})`, "info");
      
      window.dispatchEvent(new Event("storage")); // Notify components
      
      // If table is selected, go to Menu (Customer), else go to Kasir (Staff)
      if (tableNumber) {
        router.push("/");
      } else {
        router.push("/kasir");
      }
    }, 1500);
  };

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black selection:bg-amber-500 selection:text-black">
        {/* Background with Soft Blur */}
        <div className="absolute inset-0">
          <img
            src="/images/empty_cafe_interior.png"
            alt="Cafe Interior"
            className="w-full h-full object-cover blur-md opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* Login Card with Glassmorphism */}
        <div 
          className={`relative z-10 w-full max-w-md mx-4 transition-all duration-1000 transform ${shake ? 'animate-shake' : ''}`}
          data-aos="fade-up"
        >
          <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            {/* Logo Section */}
            <div className="text-center mb-10 relative">
              <div className="w-20 h-20 mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-full h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                   {/* Placeholder for image_4.png or high-quality logo */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                     <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                     <line x1="6" y1="2" x2="6" y2="4"></line>
                     <line x1="10" y1="2" x2="10" y2="4"></line>
                     <line x1="14" y1="2" x2="14" y2="4"></line>
                   </svg>
                </div>
              </div>
              <h1 className="font-display text-4xl font-black text-white tracking-tighter italic">
                KARSA <span className="text-amber-500">KAFE</span>
              </h1>
              <div className="w-12 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] uppercase font-black tracking-widest text-center mb-6 animate-bounce">
                {error}
              </p>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-transparent border-b-2 border-white/10 text-white placeholder-white/20 py-3 outline-none focus:border-amber-500 transition-all font-medium"
                />
                <span className="absolute right-0 bottom-3 text-white/20">👤</span>
              </div>

              <div className="relative">
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white py-3 outline-none focus:border-amber-500 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="" className="bg-stone-900 text-white/40">Pilih Nomor Meja (Opsional)</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')} className="bg-stone-900 text-white">
                      Meja {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span className="absolute right-0 bottom-3 text-white/20 pointer-events-none">🪑</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-b-2 border-white/10 text-white placeholder-white/20 py-3 outline-none focus:border-amber-500 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-white/40 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3 3"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line><path d="M14.21 14.21a3 3 0 0 1-4.42-4.42"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl text-xs font-black tracking-[0.3em] uppercase transition-all shadow-xl shadow-amber-900/40 relative overflow-hidden group/btn active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">{isProcessing ? "MEMVERIFIKASI..." : "MASUK"}</span>
              </button>
            </form>

            <div className="mt-12 text-center space-y-4">
               <button 
                  onClick={() => router.push("/")}
                  className="text-white/30 text-[10px] uppercase tracking-widest hover:text-amber-500 transition-colors"
               >
                 &larr; Kembali ke Beranda
               </button>
            </div>
          </div>

          <p className="text-center text-white/5 text-[9px] uppercase tracking-[0.6em] mt-10 font-bold">
            KARSA KAFE COMMAND SYSTEM V1.0
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        button:hover {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </>
  );
}

