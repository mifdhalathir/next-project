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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // ── Validation helpers ──
  const validatePhone = (val: string): string | null => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "Nomor HP wajib diisi!";
    if (digits.length < 10 || digits.length > 13) return "Nomor HP harus 10-13 digit!";
    return null;
  };

  const validatePassword = (val: string): string | null => {
    if (!val) return "Password wajib diisi!";
    if (val.length < 6) return "Password minimal 6 karakter!";
    return null;
  };

  // ── Phone+Password Login ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setError(phoneErr);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsProcessing(false);
      return;
    }

    const passErr = validatePassword(password);
    if (passErr) {
      setError(passErr);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    // Simulate auth delay (replace with real API later)
    setTimeout(() => {
      const cleanPhone = phone.replace(/\D/g, "");
      const displayName = `User-${cleanPhone.slice(-4)}`;

      localStorage.setItem("karsa_user_phone", cleanPhone);
      localStorage.setItem("karsa_user_name", displayName);

      addActivityLog(`Login: ${displayName} (${cleanPhone})`, "login");
      addKarsaNotification(`Selamat datang, ${displayName}! 👋`, "success");
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    }, 1200);
  };

  // ── Google redirect check ──
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
      }
    };
    checkRedirect();
  }, [router]);

  // ── Google popup login ──
  const handleGoogleLogin = async () => {
    const currentAuth = auth;
    const currentProvider = googleProvider;

    if (!currentAuth || !currentProvider) {
      setError("Google Login belum dikonfigurasi. Pakai login HP saja ya! 🛠️");
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

      if (
        errorObj.code === "auth/popup-closed-by-user" ||
        errorObj.message?.includes("Cross-Origin") ||
        errorObj.code === "auth/popup-blocked"
      ) {
        try {
          await signInWithRedirect(currentAuth, currentProvider);
          return;
        } catch (redirectErr) {
          console.error("Fallback redirect failed:", redirectErr);
        }
      }

      let errorMessage = "Google Login Gagal. Silakan coba lagi.";
      if (errorObj.code === "auth/unauthorized-domain") {
        errorMessage = "Domain belum didaftarkan di Firebase Console!";
      } else if (errorObj.message) {
        errorMessage = `Error: ${errorObj.message}`;
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

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-950 selection:bg-amber-500 selection:text-black px-4 py-8">
        {/* Ambient glow */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(217,119,6,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(120,53,15,0.15)_0%,_transparent_70%)] pointer-events-none" />

        <div
          className={`relative z-10 w-full max-w-[440px] transition-all duration-700 ${shake ? "animate-shake" : ""}`}
        >
          {/* ── Main Card ── */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-[2rem] sm:rounded-[2.5rem] px-6 sm:px-8 py-10 sm:py-12 shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
            {/* Glow accent top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            {/* Logo */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-all duration-500" />
                <div className="relative w-full h-full bg-[#1a1a1a] border border-amber-500/30 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                  ☕
                </div>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                KARSA <span className="text-amber-500">CAFE</span>
              </h1>
              <p className="text-stone-500 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold mt-2 sm:mt-3">
                Masuk ke akunmu
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-2.5 sm:py-3 rounded-xl mb-5 text-center animate-in fade-in duration-300">
                <p className="text-red-400 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider px-3">
                  {error}
                </p>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
              {/* Phone input */}
              <div>
                <label className="block text-stone-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-2">
                  Nomor HP / WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-stone-600 text-sm pointer-events-none">
                    📱
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^\d]/g, ""));
                      if (error) setError("");
                    }}
                    placeholder="08xxxxxxxxxx"
                    maxLength={13}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 pl-11 sm:pl-12 pr-5 py-3.5 sm:py-4 text-sm focus:outline-none focus:border-amber-500/60 focus:bg-[#1e1e1e] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-stone-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-stone-600 text-sm pointer-events-none">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Masukkan Password Anda"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl sm:rounded-2xl text-white placeholder-stone-600 pl-11 sm:pl-12 pr-12 py-3.5 sm:py-4 text-sm focus:outline-none focus:border-amber-500/60 focus:bg-[#1e1e1e] transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500 transition-colors p-1"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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

                {/* Lupa Password */}
                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="text-amber-500/70 hover:text-amber-400 text-[10px] sm:text-[11px] font-bold tracking-wider transition-colors"
                    onClick={() =>
                      addKarsaNotification(
                        "Hubungi admin KARSA di WhatsApp untuk reset password 📞",
                        "warning"
                      )
                    }
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:hover:bg-amber-800 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase transition-all shadow-xl shadow-amber-900/20 active:scale-[0.98] disabled:cursor-not-allowed mt-1"
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
                  "MASUK SEKARANG"
                )}
              </button>

              {/* Daftar link */}
              <p className="text-center text-stone-500 text-[10px] sm:text-[11px] tracking-wide">
                Belum punya akun?{" "}
                <button
                  type="button"
                  className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline underline-offset-2"
                  onClick={() =>
                    addKarsaNotification(
                      "Fitur pendaftaran segera hadir! Hubungi admin untuk akun baru 🚀",
                      "warning"
                    )
                  }
                >
                  Daftar di sini
                </button>
              </p>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2 sm:my-3">
                <div className="border-t border-[#2a2a2a] w-full" />
                <span className="text-stone-600 text-[9px] px-4 bg-[#111111] absolute font-black tracking-[0.4em] uppercase">
                  ATAU
                </span>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] disabled:opacity-50 border border-[#2a2a2a] hover:border-amber-500/30 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black tracking-[0.15em] uppercase transition-all flex items-center justify-center gap-3 group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login dengan Google
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-stone-700 text-[8px] sm:text-[9px] tracking-[0.4em] uppercase mt-8 font-black">
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
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </>
  );
}
