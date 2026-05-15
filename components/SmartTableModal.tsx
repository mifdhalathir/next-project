"use client";

import { useState, useEffect } from "react";
import { addKarsaNotification } from "./NotificationHub";

export default function SmartTableModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [area, setArea] = useState<"Indoor" | "Outdoor" | null>(null);
  const [occupiedTables, setOccupiedTables] = useState<number[]>([]);

  const loadOccupiedTables = () => {
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
      } catch(e) {}
    }
    setOccupiedTables(activeTables);
  };

  useEffect(() => {
    // Check local storage on mount
    const checkStatus = () => {
      const table = localStorage.getItem("karsa_table_number");
      const user = localStorage.getItem("karsa_user_name") || "Sultan";
      setUserName(user);
      
      if (!table) {
        setIsOpen(true);
        loadOccupiedTables();
      } else {
        setIsOpen(false);
      }
    };

    checkStatus();

    window.addEventListener("storage", checkStatus);
    window.addEventListener("openTableModal", () => setIsOpen(true));
    return () => {
      window.removeEventListener("storage", checkStatus);
      window.removeEventListener("openTableModal", () => setIsOpen(true));
    };
  }, []);

  const handleSelectTable = (t: number, selectedArea: "Indoor" | "Outdoor") => {
    if (occupiedTables.includes(t)) return;

    const tableStr = String(t).padStart(2, '0');
    localStorage.setItem("karsa_table_number", tableStr);
    localStorage.setItem("karsa_area", selectedArea);
    localStorage.setItem("karsa_jam_masuk", new Date().toISOString());
    
    window.dispatchEvent(new Event("storage"));
    setIsOpen(false);
    
    addKarsaNotification(`Meja ${tableStr} (${selectedArea}) berhasil dipilih!`, "success");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[4px] transition-all duration-500">
      <div className="bg-[#111] border border-amber-500/30 rounded-[2rem] p-8 relative z-10 w-full max-w-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">☕</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-wide">
            Halo <span className="text-amber-500">{userName}</span>,
            <br /> Pilih Spot Nyamanmu!
          </h2>
          <p className="text-stone-400 text-xs mt-2 font-medium tracking-widest uppercase">Silakan pilih meja sebelum memesan</p>
        </div>

        {!showMap ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Area Selection Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setArea("Indoor"); setShowMap(true); }}
                className="group relative overflow-hidden p-6 rounded-3xl border border-white/10 bg-[#1A1A1A]/80 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">❄️</span>
                <div className="text-center">
                  <h4 className="text-amber-500 text-sm font-black uppercase tracking-widest">Indoor</h4>
                  <p className="text-[10px] text-stone-400 font-bold tracking-wider mt-1 uppercase">Nyaman & Tenang</p>
                </div>
              </button>

              <button
                onClick={() => { setArea("Outdoor"); setShowMap(true); }}
                className="group relative overflow-hidden p-6 rounded-3xl border border-white/10 bg-[#1A1A1A]/80 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-3"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">🌿</span>
                <div className="text-center">
                  <h4 className="text-green-500 text-sm font-black uppercase tracking-widest">Outdoor</h4>
                  <p className="text-[10px] text-stone-400 font-bold tracking-wider mt-1 uppercase">Segar & Asri</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => { setArea(null); setShowMap(true); }}
              className="w-full bg-[#1A1A1A]/80 border border-dashed border-[#444] hover:border-amber-500 hover:text-amber-500 text-stone-300 py-4 rounded-2xl text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:scale-125 transition-transform">🗺️</span> Buka Peta Meja
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <button 
              onClick={() => setShowMap(false)}
              className="mb-6 text-[10px] text-stone-500 hover:text-amber-500 font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              ← Kembali
            </button>

            {(!area || area === "Indoor") && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>❄️</span> Indoor Area
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({length: 10}, (_, i) => i + 1).map(t => {
                    const isOcc = occupiedTables.includes(t);
                    return (
                      <button
                        key={t}
                        disabled={isOcc}
                        onClick={() => handleSelectTable(t, "Indoor")}
                        className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                          isOcc 
                            ? 'bg-red-950/20 border-red-900/30 opacity-50 cursor-not-allowed' 
                            : 'bg-[#222] border-white/10 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        }`}
                      >
                        <span className="text-[9px] font-black text-stone-500 uppercase">Meja</span>
                        <span className={`text-xl font-black ${isOcc ? 'text-red-500/50' : 'text-amber-500'}`}>{t}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {(!area || area === "Outdoor") && (
              <div>
                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>🌿</span> Outdoor Area
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({length: 5}, (_, i) => i + 11).map(t => {
                    const isOcc = occupiedTables.includes(t);
                    return (
                      <button
                        key={t}
                        disabled={isOcc}
                        onClick={() => handleSelectTable(t, "Outdoor")}
                        className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                          isOcc 
                            ? 'bg-red-950/20 border-red-900/30 opacity-50 cursor-not-allowed' 
                            : 'bg-[#222] border-white/10 hover:border-green-500 hover:bg-green-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        }`}
                      >
                        <span className="text-[9px] font-black text-stone-500 uppercase">Meja</span>
                        <span className={`text-xl font-black ${isOcc ? 'text-red-500/50' : 'text-green-500'}`}>{t}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
