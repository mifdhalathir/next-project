"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

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

  useEffect(() => {
    const currentAuth = auth;
    if (!currentAuth) return;
    
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(currentAuth);
        if (result?.user) {
          const user = result.user;
          const displayName = user.displayName || "Sultan";
          
          localStorage.setItem("karsa_user_name", displayName);
          if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);
          
          addActivityLog(`Login Google: ${displayName}`, "login");
          addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
          window.dispatchEvent(new Event("storage"));
          router.push("/");
        }
      } catch (err) {
        console.error("Redirect login error:", err);
        setError("Google Login Gagal. Silakan coba lagi.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    };
    checkRedirect();
  }, [router]);

  const handleGoogleLogin = async () => {
    const currentAuth = auth;
    const currentProvider = googleProvider;
    
    if (!currentAuth || !currentProvider) {
      setError("Fitur Google Login belum dikonfigurasi. Pakai login nama saja ya! 🛠️");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    try {
      setIsProcessing(true);
      const result = await signInWithPopup(currentAuth, currentProvider);
      const user = result.user;
      const displayName = user.displayName || "Sultan";
      
      localStorage.setItem("karsa_user_name", displayName);
      if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);
      
      addActivityLog(`Login Google: ${displayName}`, "login");
      addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (err: unknown) {
      console.error("Popup login error:", err);
      
      const errorObj = err as { code?: string; message?: string };
      
      // Fallback to redirect if popup is blocked or closed
      if (errorObj.code === 'auth/popup-closed-by-user' || errorObj.message?.includes('Cross-Origin') || errorObj.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(currentAuth, currentProvider);
          return; // Don't set processing to false yet, we are redirecting
        } catch (redirectErr) {
          console.error("Fallback redirect failed:", redirectErr);
        }
      }
      
      // Tampilkan error spesifik dari Firebase jika ada
      let errorMessage = "Google Login Gagal. Silakan coba lagi.";
      if (errorObj.code === 'auth/unauthorized-domain') {
        errorMessage = "Domain Vercel belum didaftarkan di Firebase Console!";
      } else if (errorObj.message) {
        // Ambil pesan error aslinya agar gampang di-debug di Vercel
        errorMessage = `Error: ${errorObj.message}`;
      }
      
      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsProcessing(false); // Pastikan state kembali ke false
    }
  };

  return (
    <>
      <PageTransition />
      
      <div className="min-h-screen flex flex-col md:flex-row bg-stone-950 selection:bg-amber-500 selection:text-black">
        
        {/* ========== LEFT: IMAGE PANEL ========== */}
        <div className="relative w-full h-44 sm:h-56 md:w-1/2 md:h-screen flex-shrink-0 overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop')",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-stone-950/60 to-stone-950" />
          
          {/* Text overlay – hidden on mobile, shown on md+ */}
          <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center px-12 text-center z-10">
            <div className="w-20 h-20 mb-8 relative group">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all duration-500"></div>
              <div className="relative w-full h-full bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-full flex items-center justify-center text-3xl">☕</div>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Selamat Datang<br/>di <span className="text-amber-500">KARSA</span>
            </h2>
            <p className="text-stone-400 text-xs lg:text-sm mt-4 max-w-xs leading-relaxed">
              Nikmati kopi terbaik Padang dalam suasana yang menginspirasi
            </p>
            <div className="w-12 h-0.5 bg-amber-500 mt-6"></div>
          </div>

          {/* Mobile mini-branding overlay */}
          <div className="flex md:hidden absolute inset-0 items-center justify-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-full flex items-center justify-center text-lg">☕</div>
              <h2 className="font-display text-xl font-black text-white tracking-[0.15em] uppercase">
                KARSA <span className="text-amber-500">CAFE</span>
              </h2>
            </div>
          </div>
        </div>

        {/* ========== RIGHT: FORM PANEL ========== */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(217,119,6,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(120,53,15,0.12)_0%,_transparent_70%)] pointer-events-none"></div>

          <div 
            className={`relative z-10 w-full max-w-md px-6 py-8 sm:px-10 sm:py-12 md:px-12 md:py-16 lg:px-16 transition-all duration-700 ${shake ? 'animate-shake' : ''}`}
          >
            {/* Header – shown on all screens */}
            <div className="text-center md:text-left mb-6 sm:mb-8 md:mb-10">
              {/* Coffee icon – only on md+ (mobile has it in the image panel) */}
              <div className="hidden md:block w-14 h-14 lg:w-16 lg:h-16 mb-5 relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all duration-500"></div>
                <div className="relative w-full h-full bg-[#1A1A1A] border border-amber-500/30 rounded-full flex items-center justify-center text-2xl lg:text-3xl">☕</div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-stone-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold mt-2 sm:mt-3">
                Masukkan nama untuk melanjutkan
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-center">
                <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleSimpleLogin} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 px-5 py-3.5 sm:px-6 sm:py-4 md:py-5 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all shadow-xl shadow-amber-900/20 active:scale-[0.98]"
              >
                {isProcessing ? "MEMPROSES..." : "MASUK SEKARANG"}
              </button>

              <div className="relative flex items-center justify-center my-5 sm:my-6 md:my-8">
                <div className="border-t border-[#333] w-full"></div>
                <span className="text-stone-600 text-[9px] px-4 bg-stone-950 absolute font-black tracking-[0.4em] uppercase">ATAU</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-amber-500/30 text-white py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 sm:gap-4 group"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Login
              </button>
            </form>

            <p className="text-center md:text-left text-stone-700 text-[8px] sm:text-[9px] tracking-[0.4em] sm:tracking-[0.5em] uppercase mt-6 sm:mt-8 md:mt-10 font-black">
              &copy; 2024 KARSA CAFE PADANG
            </p>
          </div>
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
