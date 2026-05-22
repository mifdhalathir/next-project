"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Sesuaikan path config Firebase lo
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data login standar agar tersinkron dengan sistem kasir
      localStorage.setItem("karsa_uid", user.uid);
      localStorage.setItem("karsa_username", user.displayName || user.email?.split("@")[0] || "Customer");
      
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email atau password yang Anda masukkan salah!");
      } else {
        setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
    } finally {
      // PENTING: State loading di-reset di sini agar tombol tidak stuck di "MEMPROSES..."
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("karsa_uid", user.uid);
      localStorage.setItem("karsa_username", user.displayName || "Customer");
      localStorage.setItem("karsa_user_avatar", user.photoURL || "");

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Gagal login dengan Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      {/* Container Utama - Card Dark Glassmorphism Karsa Cafe */}
      <div className="w-full max-w-[450px] bg-[#121212]/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center backdrop-blur-md shadow-2xl">
        
        {/* Logo Cangkir Kopi */}
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <span className="text-2xl">☕</span>
        </div>

        {/* Judul & Branding */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-white text-center">
          KARSA <span className="text-amber-500">CAFE</span>
        </h1>
        <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase mt-1 mb-6">
          Ruang Inspirasi
        </p>

        <h2 className="text-lg font-medium text-zinc-300 mb-6 text-center">
          Welcome Back, Please login to your account
        </h2>

        {/* Notifikasi Error Dinamis */}
        {error && (
          <div className="w-full p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form Login Utama */}
        <form onSubmit={handleEmailLogin} className="w-full flex flex-col space-y-4">
          
          {/* Input Email */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">📧</span>
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase pl-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-11 pr-12 text-white placeholder-zinc-600 outline-none transition-all text-sm"
                disabled={loading}
              />
              {/* Toggle Mata (Show/Hide Password) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Info Tambahan Form */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer select-none">
              <input type="checkbox" className="accent-amber-500 rounded bg-zinc-900 border-zinc-800" />
              <span>Remember me</span>
            </label>
            <Link href="#" className="text-amber-500 hover:underline transition-all">
              Forgot password?
            </Link>
          </div>

          {/* Tombol Masuk Utama */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800/50 text-white font-bold tracking-widest uppercase py-3.5 rounded-xl mt-4 shadow-lg shadow-amber-600/10 active:scale-[0.99] transition-all text-sm flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>MEMPROSES...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Pembatas ATAU */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-[1px] bg-zinc-800"></div>
          <span className="text-xs tracking-widest text-zinc-600 uppercase px-4 select-none">Or</span>
          <div className="flex-1 h-[1px] bg-zinc-800"></div>
        </div>

        {/* Tombol Google Login Alternatif */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-300 font-medium py-3 rounded-xl flex items-center justify-center space-x-3 transition-all text-sm active:scale-[0.99]"
        >
          <span className="text-base">🌐</span>
          <span>Sign in with Google</span>
        </button>

        {/* Link Daftar Akun */}
        <p className="text-xs text-zinc-500 mt-8 text-center">
          Don't have an account?{" "}
          <Link href="#" className="text-white font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        {/* Footer Hak Cipta */}
        <p className="text-[10px] tracking-widest text-zinc-600 uppercase mt-10 text-center select-none">
          © 2026 Karsa Cafe Padang
        </p>

      </div>
    </div>
  );
}