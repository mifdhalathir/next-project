"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase"; 
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  getRedirectResult, 
  signInWithRedirect 
} from "firebase/auth";
import PageTransition from "@/components/PageTransition";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // ── Cek Hasil Redirect Google Login (Anti-Stuck) ──
  useEffect(() => {
    if (!auth) return;
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth!); 
        if (result?.user) {
          const user = result.user;
          const displayName = user.displayName || "Sultan";
          
          localStorage.setItem("karsa_user_name", displayName);
          localStorage.setItem("karsa_username", displayName);
          localStorage.setItem("karsa_uid", user.uid);
          if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);
          
          addActivityLog(`Login Google: ${displayName}`, "login");
          addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
          window.dispatchEvent(new Event("storage"));
          router.push("/");
        }
      } catch (err: any) {
        console.error("Redirect login error:", err);
        setError("Google Login Gagal. Silakan coba lagi.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    };
    checkRedirect();
  }, [router]);

  // ── Email + Password Login ──
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth!, email, password); 
      const user = userCredential.user;
      const displayName = user.displayName || email.split("@")[0] || "Customer";

      localStorage.setItem("karsa_user_name", displayName);
      localStorage.setItem("karsa_username", displayName);
      localStorage.setItem("karsa_uid", user.uid);
      if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);

      addActivityLog(`Login Email: ${displayName}`, "login");
      addKarsaNotification(`Selamat datang kembali, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage")); 
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email atau password yang Anda masukkan salah!");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid!");
      } else {
        setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Google Popup / Redirect Login ──
  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      setError("Fitur Google Login belum dikonfigurasi.");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth!, googleProvider); 
      const user = result.user;
      const displayName = user.displayName || "Customer";
      
      localStorage.setItem("karsa_user_name", displayName);
      localStorage.setItem("karsa_username", displayName);
      localStorage.setItem("karsa_uid", user.uid);
      localStorage.setItem("karsa_user_avatar", user.photoURL || "");

      addActivityLog(`Login Google: ${displayName}`, "login");
      addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage"));

      router.push("/");
    } catch (err: any) {
      console.error("Popup login error:", err);
      
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth!, googleProvider); 
          return;
        } catch (redirectErr) {
          console.error("Fallback redirect failed:", redirectErr);
        }
      }
      
      setError("Gagal login dengan Google.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <PageTransition />
      
      <div className="min-h-screen flex flex-col md:flex-row bg-stone-950 selection:bg-amber-500 selection:text-black">

        {/* ========== KIRI: PANEL GAMBAR ESTETIK ========== */}
        <div className="relative w-full h-44 sm:h-56 md:w-1/2 md:h-screen flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-stone-950/60 to-stone-950" />
          
          {/* Teks Overlay Desktop */}
          <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center px-12 text-center z-10">
            <div className="w-20 h-20 mb-8 relative group">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all duration-500"></div>
              <div className="relative w-full h-full bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-full flex items-center justify-center text-3xl">☕</div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Selamat Datang<br/>di <span className="text-amber-500">KARSA</span>
            </h2>
            <p className="text-stone-400 text-xs lg:text-sm mt-4 max-w-xs leading-relaxed">
              Nikmati kopi terbaik Padang dalam suasana yang menginspirasi
            </p>
            <div className="w-12 h-0.5 bg-amber-500 mt-6"></div>
          </div>

          {/* Mini Branding Mobile */}
          <div className="flex md:hidden absolute inset-0 items-center justify-center z-10">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-2xl border border-amber-500/20">
              <div className="text-lg">☕</div>
              <h2 className="text-xl font-black text-white tracking-[0.15em] uppercase">
                KARSA <span className="text-amber-500">CAFE</span>
              </h2>
            </div>
          </div>
        </div>

        {/* ========== KANAN: PANEL FORM LOGIN ========== */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden p-4 sm:p-8">
          <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(217,119,6,0.05)_0%,_transparent_70%)] pointer-events-none"></div>

          {/* Card Glassmorphic */}
          <div className={`relative z-10 w-full max-w-md px-6 py-8 sm:px-10 bg-[#121212]/90 border border-zinc-800 rounded-3xl backdrop-blur-md shadow-2xl transition-all duration-700 ${shake ? 'animate-shake' : ''}`}>
            
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-white">
                KARSA <span className="text-amber-500">CAFE</span>
              </h1>
              <p className="text-stone-500 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold mt-2">
                Login untuk melanjutkan
              </p>
            </div>

            {/* Notifikasi Error Dinamis */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl mb-4 text-center">
                <p className="text-red-400 text-xs font-bold tracking-wide">{error}</p>
              </div>
            )}

            {/* Form Utama */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              
              {/* Input Email */}
              <div className="relative flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="customer@example.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-stone-600 outline-none transition-all text-sm"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="relative flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase pl-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    placeholder="Masukkan password"
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-stone-600 outline-none transition-all text-sm"
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => addKarsaNotification("Hubungi admin KARSA untuk mereset password 📞", "warning")}
                    className="text-amber-500/80 hover:text-amber-400 text-[10px] sm:text-[11px] font-bold tracking-wide"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer select-none">
                  <input type="checkbox" className="accent-amber-500 rounded bg-zinc-900 border-zinc-800" />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-xs font-black tracking-[0.25em] uppercase transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    <span>MEMPROSES...</span>
                  </>
                ) : (
                  "MASUK SEKARANG"
                )}
              </button>
            </form>

            {/* Pembatas ATAU */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-zinc-800 w-full"></div>
              <span className="text-stone-600 text-[9px] px-4 bg-[#121212] absolute font-black tracking-[0.4em] uppercase">ATAU</span>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isProcessing}
              className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-300 font-medium py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-all text-sm active:scale-[0.99] disabled:opacity-50"
            >
              <span className="text-base">🌐</span>
              <span>LOGIN DENGAN GOOGLE</span>
            </button>

            {/* Link Daftar Akun */}
            <p className="text-center text-stone-500 text-[10px] sm:text-[11px] mt-6">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-amber-500 hover:text-amber-400 font-bold underline underline-offset-2"
              >
                Daftar di sini
              </button>
            </p>

            {/* Copyright */}
            <p className="text-center text-stone-700 text-[8px] tracking-[0.4em] uppercase mt-8 font-black">
              &copy; 2026 KARSA CAFE PADANG
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