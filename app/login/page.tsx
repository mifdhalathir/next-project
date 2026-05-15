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
  const [step, setStep] = useState<"login" | "table" | "register">("login");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  
  // Table selection states
  const [tableNumber, setTableNumber] = useState("");
  const [area, setArea] = useState("Indoor");
  const [guests, setGuests] = useState(1);
  const [showMapModal, setShowMapModal] = useState(false);

  // Dynamic status states
  const [indoorOccupied, setIndoorOccupied] = useState(0);
  const [outdoorOccupied, setOutdoorOccupied] = useState(0);
  const [occupiedTables, setOccupiedTables] = useState<number[]>([]);

  const router = useRouter();

  const countTableStatus = () => {
    const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
    const activeTables: number[] = [];
    if (savedOrders) {
        try {
            const parsed = JSON.parse(savedOrders);
            parsed.forEach((p: { status: string; meja: string }) => {
                if (p.status !== "Selesai") {
                    const t = parseInt(String(p.meja || "").replace(/[^\d]/g, ''));
                    
                    if (!isNaN(t)) activeTables.push(t);
                }
            });
        } catch {
            console.error("Failed to parse PESANAN_HARI_INI");
        }
    }
    
    setOccupiedTables(activeTables);
    
    const indoor = activeTables.filter(t => t >= 1 && t <= 10).length;
    const outdoor = activeTables.filter(t => t >= 11 && t <= 15).length;
    
    setIndoorOccupied(indoor);
    setOutdoorOccupied(outdoor);
  };

  useEffect(() => {
    if (step === "table") {
        requestAnimationFrame(() => {
            countTableStatus();
        });
    }
  }, [step]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Isi nama dan passwordmu dulu ya!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      let users: { name: string; email: string; password: string }[] = [];
      try { users = JSON.parse(localStorage.getItem('karsa_users') || '[]'); } catch { console.error("Failed to parse users"); }
      
      const user = users.find(u => (u.name === username || u.email === username) && u.password === password);
      
      if (user) {
        setUsername(user.name);
        addActivityLog(`Login manual: ${user.name}`, "login");
        setStep("table");
      } else {
        // Fallback for demo if no users exist yet
        if (users.length === 0) {
          setStep("table");
        } else {
          setError("Email/Nama atau Password salah, Ngab! ❌");
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regName || !regEmail || !regPassword) {
      setError("Semua field harus diisi, Ngab!");
      setShake(true);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Password nggak cocok, Ngab! ❌");
      setShake(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      let users: { name: string; email: string; password: string }[] = [];
      try { users = JSON.parse(localStorage.getItem('karsa_users') || '[]'); } catch { console.error("Failed to parse users"); }

      if (users.some(u => u.email === regEmail)) {
        setError("Email ini sudah terdaftar, Ngab!");
        setIsProcessing(false);
        return;
      }

      const newUser = { name: regName, email: regEmail, password: regPassword };
      users.push(newUser);
      localStorage.setItem('karsa_users', JSON.stringify(users));

      addActivityLog(`User baru terdaftar: ${regName} (${regEmail})`, "login");
      alert('Pendaftaran Berhasil! Silakan Login, Sultan! 🎉');
      setStep("login");
      setIsProcessing(false);
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      setError("Fitur Google Login belum dikonfigurasi (Firebase API Key Kosong). Hubungi Admin! 🛠️");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    try {
      setIsProcessing(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      setUsername(user.displayName || "Sultan");
      setAvatar(user.photoURL || "");
      
      addActivityLog(`Login Google: ${user.displayName}`, "login");
      addKarsaNotification(`Selamat datang, ${user.displayName}! 👋`, "success");
      
      setStep("table");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Login dibatalkan, Sultan.");
      } else {
        setError("Google Login Gagal: " + (firebaseError.message || String(err)));
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsProcessing(false);
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
      localStorage.setItem("karsa_guests", String(guests));
      if (avatar) localStorage.setItem("karsa_user_avatar", avatar);
      
      sessionStorage.setItem("username", username);
      addKarsaNotification(`Pelanggan ${username} telah Aktif (Area ${area}, Meja ${tableNumber}, ${guests} Org)`, "info");
      addActivityLog(`${username} login → Meja ${tableNumber} (${area})`, "login");
      window.dispatchEvent(new Event("storage")); 
      
      router.push("/");
    }, 1500);
  };

  const isIndoorCrowded = indoorOccupied >= 7; // > 70% of 10
  const isOutdoorCrowded = outdoorOccupied >= 4; // > 70% of 5

  return (
    <>
      <PageTransition />
      <CustomCursor />
      
      {/* Table Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMapModal(false)}></div>
            <div className="bg-[#111] border border-amber-500/30 rounded-3xl p-8 relative z-10 w-full max-w-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in-95 duration-300">
                <button onClick={() => setShowMapModal(false)} className="absolute top-4 right-6 text-white/50 hover:text-white text-2xl">×</button>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-widest mb-6 text-center">🗺️ Denah Meja Interaktif</h2>
                
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">🏠 Indoor Area (Full AC)</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {Array.from({length: 10}, (_, i) => i + 1).map(t => {
                            const isOcc = occupiedTables.includes(t);
                            return (
                                <button
                                    key={t}
                                    disabled={isOcc}
                                    onClick={() => { setTableNumber(String(t).padStart(2, '0')); setArea('Indoor'); setShowMapModal(false); }}
                                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                                        isOcc ? 'bg-stone-900 border-stone-800 opacity-50 cursor-not-allowed' : 
                                        'bg-[#222] border-white/10 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]'
                                    }`}
                                >
                                    <span className="text-[10px] font-black text-stone-500 uppercase">Meja</span>
                                    <span className={`text-xl font-black ${isOcc ? 'text-stone-600' : 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]'}`}>{t}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">🌿 Outdoor Area (Smoking)</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {Array.from({length: 5}, (_, i) => i + 11).map(t => {
                            const isOcc = occupiedTables.includes(t);
                            return (
                                <button
                                    key={t}
                                    disabled={isOcc}
                                    onClick={() => { setTableNumber(String(t).padStart(2, '0')); setArea('Outdoor'); setShowMapModal(false); }}
                                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                                        isOcc ? 'bg-stone-900 border-stone-800 opacity-50 cursor-not-allowed' : 
                                        'bg-[#222] border-white/10 hover:border-green-500 hover:bg-green-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]'
                                    }`}
                                >
                                    <span className="text-[10px] font-black text-stone-500 uppercase">Meja</span>
                                    <span className={`text-xl font-black ${isOcc ? 'text-stone-600' : 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`}>{t}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-950 selection:bg-amber-500 selection:text-black">
        {/* Glow ambient background as requested by Dark Glassmorphism & Amber Glow */}
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[150px] opacity-70 pointer-events-none"></div>

        {/* Form Container */}
        <div 
          className={`relative z-10 w-full max-w-[420px] mx-4 transition-all duration-700 ${shake ? 'animate-shake' : ''}`}
          data-aos="zoom-in"
        >
          <div className="bg-[#151515]/80 backdrop-blur-[6px] border border-white/5 rounded-[2rem] px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 relative group transition-transform duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
                <img 
                  src="/images/logo.png" 
                  alt="Logo" 
                  className="relative w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              <h1 className="font-display text-3xl font-bold text-white tracking-[0.2em] uppercase">
                KARSA <span className="text-amber-500">CAFE</span>
              </h1>
              <p className="text-stone-400 text-xs tracking-widest uppercase font-medium mt-2">
                {step === "register" ? "Gabung Jadi Sultan" : "Ruang Inspirasi"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl mb-6 text-center">
                <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest">{error}</p>
              </div>
            )}

            {step === "login" ? (
              <form onSubmit={handleManualLogin} className="space-y-5">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan nama Anda / Email"
                    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#B45309] hover:bg-[#D97706] text-white py-4 rounded-[1.2rem] text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(180,83,9,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] mt-2"
                >
                  {isProcessing ? "MEMVERIFIKASI..." : "LOGIN MANUAL"}
                </button>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-[#333333] w-full"></div>
                  <span className="text-stone-400 text-xs px-4 bg-transparent absolute font-bold tracking-widest">ATAU</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-[#222] hover:bg-[#333] border border-[#333] hover:border-amber-500/50 text-white py-4 rounded-[1.2rem] text-sm font-bold transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            ) : step === "register" ? (
              <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                />
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi Password"
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-[1.2rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:bg-[#222] transition-all"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#B45309] hover:bg-[#D97706] text-white py-4 rounded-[1.2rem] text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(180,83,9,0.4)] mt-2"
                >
                  {isProcessing ? "MENDAFTARKAN..." : "DAFTAR SEKARANG"}
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in font-sans">
                
                {/* Field Nama */}
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="w-full bg-[#1A1A1A]/80 backdrop-blur-[4px] border border-[#333] rounded-[1rem] text-white placeholder-stone-500 px-5 py-4 text-sm focus:outline-none focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all font-medium"
                    />
                </div>

                {/* Area Selector Title */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 text-xs">🪑</span>
                    <h3 className="text-stone-300 text-[10px] font-bold uppercase tracking-widest">Pilih Area Duduk</h3>
                </div>

                {/* The Dynamic Area Selector Cards */}
                <div className="flex gap-4">
                    {/* Indoor Card */}
                    <div 
                        onClick={() => setArea('Indoor')}
                        className={`flex-1 relative overflow-hidden p-4 rounded-[20px] border cursor-pointer transition-all duration-300 backdrop-blur-[4px] flex flex-col items-center justify-center gap-2 ${
                            area === 'Indoor' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                            : 'bg-[#1A1A1A]/80 border-[#333] hover:border-amber-500/50'
                        }`}
                    >
                        <span className="text-2xl drop-shadow-md">🏠</span>
                        <div className="text-center">
                            <h4 className="text-white text-xs font-bold uppercase tracking-widest">Indoor</h4>
                            <p className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isIndoorCrowded ? 'text-red-500' : 'text-green-500'}`}>
                                ({indoorOccupied}/10 MEJA) - {isIndoorCrowded ? 'RAMAI' : 'SEPI'}
                            </p>
                        </div>
                    </div>

                    {/* Outdoor Card */}
                    <div 
                        onClick={() => setArea('Outdoor')}
                        className={`flex-1 relative overflow-hidden p-4 rounded-[20px] border cursor-pointer transition-all duration-300 backdrop-blur-[4px] flex flex-col items-center justify-center gap-2 ${
                            area === 'Outdoor' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                            : 'bg-[#1A1A1A]/80 border-[#333] hover:border-amber-500/50'
                        }`}
                    >
                        <span className="text-2xl drop-shadow-md">🌿</span>
                        <div className="text-center">
                            <h4 className="text-white text-xs font-bold uppercase tracking-widest">Outdoor</h4>
                            <p className={`text-[9px] font-black uppercase tracking-wider mt-1 ${isOutdoorCrowded ? 'text-red-500' : 'text-green-500'}`}>
                                ({outdoorOccupied}/5 MEJA) - {isOutdoorCrowded ? 'RAMAI' : 'SEPI'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Trigger Button */}
                <button
                    type="button"
                    onClick={() => setShowMapModal(true)}
                    className="w-full bg-[#1A1A1A]/80 border border-dashed border-[#444] hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5 text-stone-300 py-3 rounded-[1rem] text-[11px] font-bold tracking-[0.1em] uppercase transition-all backdrop-blur-[4px]"
                >
                    🗺️ Lihat Peta Meja {tableNumber ? `(Terpilih: Meja ${tableNumber})` : ''}
                </button>

                {/* Jumlah Orang Input */}
                <div>
                  <label className="block text-stone-200 text-[10px] font-bold uppercase tracking-widest mb-2">Jumlah Orang</label>
                  <div className="flex bg-[#1A1A1A]/80 border border-[#333] rounded-[1rem] overflow-hidden backdrop-blur-[4px]">
                      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-12 h-12 flex items-center justify-center text-stone-400 hover:bg-white/5 hover:text-amber-500 transition-colors">-</button>
                      <input 
                          type="number" 
                          min="1" 
                          max="20" 
                          value={guests} 
                          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                          className="flex-1 bg-transparent text-center text-white font-bold focus:outline-none"
                      />
                      <button type="button" onClick={() => setGuests(guests + 1)} className="w-12 h-12 flex items-center justify-center text-stone-400 hover:bg-white/5 hover:text-amber-500 transition-colors">+</button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoToMenu}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-[1.2rem] text-sm font-bold tracking-[0.2em] uppercase transition-all mt-4 ${!tableNumber ? 'bg-[#222] text-stone-500 cursor-not-allowed border border-[#333]' : 'bg-[#B45309] hover:bg-[#D97706] text-white shadow-[0_0_20px_rgba(180,83,9,0.4)]'}`}
                >
                  {isProcessing ? "MEMPROSES..." : "MASUK KE MENU"}
                </button>
              </div>
            )}

            {(step === "login" || step === "register") && (
              <p className="text-center text-stone-400 text-xs mt-8 font-medium">
                {step === "login" ? (
                  <>Belum punya akun? <span onClick={() => setStep("register")} className="text-amber-500 cursor-pointer hover:text-amber-400 font-bold">Daftar di Sini</span></>
                ) : (
                  <>Sudah punya akun? <span onClick={() => setStep("login")} className="text-amber-500 cursor-pointer hover:text-amber-400 font-bold">Login di Sini</span></>
                )}
              </p>
            )}
          </div>

          <p className="text-center text-stone-600 text-[10px] tracking-widest uppercase mt-8 font-medium">
            &copy; 2024 KARSA CAFE PADANG
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
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}
