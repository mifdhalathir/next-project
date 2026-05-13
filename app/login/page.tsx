"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import { addKarsaNotification } from "@/components/NotificationHub";
import SocialIcons from "@/components/SocialIcons";
import MagneticWrapper from "@/components/MagneticWrapper";

// Firebase configuration (Pastikan npm install firebase)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default function Login() {
  const [step, setStep] = useState<"login" | "table">("login");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  
  const [tableNumber, setTableNumber] = useState("");
  const [area, setArea] = useState("Indoor");
  const router = useRouter();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username) {
      setError("Isi namamu dulu ya, Ngab!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("table");
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    try {
      if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        alert("Firebase API Key masih dummy! Menggunakan data simulasi untuk demo...");
        setUsername("Sultan " + Math.floor(Math.random() * 1000));
        setAvatar(`https://ui-avatars.com/api/?name=Sultan&background=f59e0b&color=fff`);
        setStep("table");
        return;
      }
      
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUsername(user.displayName || "Sultan");
      setAvatar(user.photoURL || "");
      setStep("table");
    } catch (err: any) {
      setError("Google Login Gagal: " + err.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGoToMenu = () => {
    setError("");
    if (!tableNumber) {
      setError("Pilih meja dulu, Ngab!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("karsa_user_name", username);
      localStorage.setItem("karsa_table_number", tableNumber);
      localStorage.setItem("karsa_area", area);
      if (avatar) localStorage.setItem("karsa_user_avatar", avatar);
      
      sessionStorage.setItem("username", username);
      
      // Notify Kasir
      addKarsaNotification(`Pelanggan ${username} telah Aktif (Area ${area}, Meja ${tableNumber})`, "info");
      
      window.dispatchEvent(new Event("storage")); // Notify components
      
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
            <div className="text-center mb-10 relative">
              <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-[0.5em] mb-4 animate-pulse">Wangi kopi sudah menantimu</p>
              
              <div className="w-20 h-20 mx-auto mb-4 relative group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full"></div>
                <div className="relative w-full h-full bg-black/40 border border-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden">
                   <img 
                    src="/images/logo.png" 
                    alt="Karsa Kafe" 
                    className="w-16 h-16 object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-amber-500 font-black text-2xl">K</span>';
                    }}
                   />
                </div>
              </div>

              <h1 className="font-display text-4xl font-black text-white tracking-tighter italic">
                KARSA <span className="text-amber-500">KAFE</span>
              </h1>
              
              {step === "login" && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="w-10 h-[1px] bg-white/5"></div>
                  <SocialIcons />
                  <div className="w-10 h-[1px] bg-white/5"></div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-2xl mb-6 animate-bounce">
                <p className="text-red-400 text-[9px] uppercase font-black tracking-widest text-center">
                  {error}
                </p>
              </div>
            )}
            
            {step === "login" ? (
              <form onSubmit={handleManualLogin} className="space-y-6">
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

                <MagneticWrapper strength={0.4} distance={60}>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl text-xs font-black tracking-[0.4em] uppercase transition-all shadow-2xl relative overflow-hidden group/btn btn-glow-pulse active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative z-10">{isProcessing ? "MEMVERIFIKASI..." : "LOGIN MANUAL"}</span>
                  </button>
                </MagneticWrapper>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-white/10 w-full"></div>
                  <span className="text-white/30 text-[10px] px-3 bg-transparent absolute font-black tracking-widest backdrop-blur-md rounded-full">ATAU</span>
                </div>

                <MagneticWrapper strength={0.2} distance={30}>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl text-xs font-black tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    SIGN IN WITH GOOGLE
                  </button>
                </MagneticWrapper>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  {avatar && (
                    <img src={avatar} alt="Profile" className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-amber-500 object-cover shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  )}
                  <p className="text-white/70 text-xs uppercase tracking-widest font-bold">Selamat datang,</p>
                  <p className="text-amber-500 font-display text-2xl font-bold mt-1">{username}</p>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pilih Area</label>
                  <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                          <input type="radio" name="area" value="Indoor" checked={area === "Indoor"} onChange={(e) => setArea(e.target.value)} className="peer sr-only" />
                          <div className="text-center py-3 rounded-xl border border-white/5 bg-white/5 text-white/50 peer-checked:bg-amber-500/20 peer-checked:border-amber-500 peer-checked:text-amber-500 transition-all font-black text-xs uppercase tracking-widest">Indoor</div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                          <input type="radio" name="area" value="Outdoor" checked={area === "Outdoor"} onChange={(e) => setArea(e.target.value)} className="peer sr-only" />
                          <div className="text-center py-3 rounded-xl border border-white/5 bg-white/5 text-white/50 peer-checked:bg-amber-500/20 peer-checked:border-amber-500 peer-checked:text-amber-500 transition-all font-black text-xs uppercase tracking-widest">Outdoor</div>
                      </label>
                  </div>
                </div>

                <div className="group/input relative">
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl text-white py-4 px-6 outline-none focus:border-amber-500 focus:bg-white/10 transition-all font-black tracking-widest text-xs uppercase appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-stone-950">PILIH NOMOR MEJA</option>
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
                    type="button"
                    onClick={handleGoToMenu}
                    disabled={isProcessing}
                    className={`w-full py-5 rounded-2xl text-xs font-black tracking-[0.4em] uppercase transition-all shadow-2xl relative overflow-hidden group/btn btn-glow-pulse active:scale-95 ${!tableNumber ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
                  >
                    {tableNumber && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>}
                    <span className="relative z-10">{isProcessing ? "MEMPROSES..." : "MASUK KE MENU"}</span>
                  </button>
                </MagneticWrapper>
              </div>
            )}

            <div className="mt-8 text-center">
               <button 
                  onClick={() => router.push("/")}
                  className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-black hover:text-amber-500 transition-all border-b border-transparent hover:border-amber-500 pb-1"
               >
                 &larr; Kembali ke Beranda
               </button>
            </div>
          </div>

          <p className="text-center text-white/10 text-[8px] uppercase tracking-[0.8em] mt-8 font-black">
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}
