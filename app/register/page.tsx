"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";

import { auth, googleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";

export default function Register() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama Lengkap wajib diisi!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!email.trim()) {
      setError("Email wajib diisi!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password minimal 6 karakter!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);

    try {
      if (!auth) throw new Error("Firebase auth tidak tersedia");
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's profile with their name
      await updateProfile(user, {
        displayName: name
      });
      
      localStorage.setItem("karsa_user_name", name);
      localStorage.setItem("karsa_username", name);
      localStorage.setItem("karsa_uid", user.uid);
      
      addActivityLog(`Register Email: ${name}`, "login");
      addKarsaNotification(`Pendaftaran berhasil! Selamat datang, ${name}! 👋`, "success");
      window.dispatchEvent(new Event("storage")); 
      router.push("/");
    } catch (err: any) {
      console.error("Register error:", err);
      let errorMessage = "Pendaftaran Gagal. Silakan coba lagi.";
      if (err.code === "auth/invalid-email") errorMessage = "Format email tidak valid!";
      else if (err.code === "auth/email-already-in-use") errorMessage = "Email sudah terdaftar! Silakan Login.";
      else if (err.code === "auth/weak-password") errorMessage = "Password terlalu lemah (minimal 6 karakter)!";
      else if (err.message) errorMessage = `Error: ${err.message}`;

      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    const currentAuth = auth;
    const currentProvider = googleProvider;
    
    if (!currentAuth || !currentProvider) {
      setError("Fitur Google Login belum dikonfigurasi.");
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
      localStorage.setItem("karsa_username", displayName);
      localStorage.setItem("karsa_uid", user.uid);
      if (user.photoURL) localStorage.setItem("karsa_user_avatar", user.photoURL);
      
      addActivityLog(`Login Google: ${displayName}`, "login");
      addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (err: any) {
      console.error("Popup login error:", err);
      let errorMessage = "Google Login Gagal. Silakan coba lagi.";
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = "Domain belum didaftarkan di Firebase Console!";
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsProcessing(false);
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
              backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920&auto=format&fit=crop')",
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
              Bergabung<br/>dengan <span className="text-amber-500">KARSA</span>
            </h2>
            <p className="text-stone-400 text-xs lg:text-sm mt-4 max-w-xs leading-relaxed">
              Jadilah bagian dari cerita kami dan nikmati berbagai keuntungan eksklusif
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
            {/* Header */}
            <div className="text-center md:text-left mb-6 sm:mb-8 md:mb-10">
              <h1 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="text-stone-500 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold mt-2 sm:mt-3">
                Daftar untuk mulai memesan
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-center animate-in fade-in duration-300">
                <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              
              {/* Name Input */}
              <div className="relative group">
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Nama Lengkap"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 pl-11 sm:pl-12 pr-5 py-3.5 sm:py-4 md:py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all font-medium"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="contoh@email.com"
                  autoComplete="email"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 pl-11 sm:pl-12 pr-5 py-3.5 sm:py-4 md:py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all font-medium"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="relative group">
                  <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Masukkan password Anda"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 pl-11 sm:pl-12 pr-12 py-3.5 sm:py-4 md:py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-white py-3.5 sm:py-4 md:py-4 mt-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all shadow-xl shadow-amber-900/20 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    MEMPROSES...
                  </span>
                ) : (
                  "DAFTAR SEKARANG"
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-stone-500 text-[10px] sm:text-[11px] tracking-wide pt-1">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline underline-offset-2"
                >
                  Masuk di sini
                </button>
              </p>

              <div className="relative flex items-center justify-center my-5 sm:my-6">
                <div className="border-t border-[#333] w-full"></div>
                <span className="text-stone-600 text-[9px] px-4 bg-stone-950 absolute font-black tracking-[0.4em] uppercase">ATAU</span>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="w-full bg-[#1A1A1A] hover:bg-[#222] disabled:opacity-50 border border-[#333] hover:border-amber-500/30 text-white py-3.5 sm:py-4 md:py-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 sm:gap-4 group"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                DAFTAR DENGAN GOOGLE
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
