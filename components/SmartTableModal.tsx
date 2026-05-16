"use client";

import { useState, useEffect } from "react";
import { addKarsaNotification } from "./NotificationHub";

export default function SmartTableModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedArea, setSelectedArea] = useState<"Indoor" | "Outdoor" | null>(null);
  const [occupiedTables, setOccupiedTables] = useState<number[]>([]);
  
  // Capacity Stats
  const [indoorOccupied, setIndoorOccupied] = useState(0);
  const [outdoorOccupied, setOutdoorOccupied] = useState(0);

  const loadData = () => {
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
    
    setIndoorOccupied(activeTables.filter(t => t >= 1 && t <= 10).length);
    setOutdoorOccupied(activeTables.filter(t => t >= 11 && t <= 15).length);
  };

  useEffect(() => {
    const checkStatus = () => {
      const table = localStorage.getItem("karsa_table_number");
      const user = localStorage.getItem("karsa_user_name");
      
      if (user && !table) {
        setUserName(user);
        setIsOpen(true);
        loadData();
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

  const handleSelectTable = (t: number, area: "Indoor" | "Outdoor") => {
    if (occupiedTables.includes(t)) return;

    const tableStr = String(t).padStart(2, '0');
    localStorage.setItem("karsa_table_number", tableStr);
    localStorage.setItem("karsa_area", area);
    localStorage.setItem("karsa_jam_masuk", new Date().toISOString());
    
    window.dispatchEvent(new Event("storage"));
    setIsOpen(false);
    
    addKarsaNotification(`Meja ${tableStr} (${area}) dipilih. Selamat menikmati! ☕`, "success");
  };

  if (!isOpen) return null;

  const isIndoorCrowded = indoorOccupied >= 8;
  const isOutdoorCrowded = outdoorOccupied >= 4;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-[#0A0A0A] border border-amber-500/20 rounded-[3rem] p-10 relative z-10 w-full max-w-xl shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden">
        
        {/* Amber Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full"></div>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
             <span className="text-3xl animate-bounce-slow">📍</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-tight">
            Halo <span className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{userName || 'Sultan'}</span>,
            <br />Pilih Spot Nyamanmu!
          </h2>
          <p className="text-stone-500 text-[10px] mt-3 font-black tracking-[0.3em] uppercase">Pilih area dan nomor meja untuk memulai</p>
        </div>

        {!showMap ? (
          <div className="space-y-8">
            {/* Area Selection */}
            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setSelectedArea("Indoor")}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
                  selectedArea === "Indoor" 
                  ? "bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-105" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">❄️</span>
                <div className="text-center">
                  <h4 className={`text-sm font-black uppercase tracking-widest ${selectedArea === "Indoor" ? "text-amber-500" : "text-stone-300"}`}>Indoor</h4>
                  <p className={`text-[9px] font-bold mt-2 uppercase tracking-wider ${isIndoorCrowded ? "text-red-500" : "text-green-500"}`}>
                    {indoorOccupied}/10 Meja — {isIndoorCrowded ? "Ramai" : "Sepi"}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedArea("Outdoor")}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
                  selectedArea === "Outdoor" 
                  ? "bg-green-500/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-105" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">🌿</span>
                <div className="text-center">
                  <h4 className={`text-sm font-black uppercase tracking-widest ${selectedArea === "Outdoor" ? "text-green-500" : "text-stone-300"}`}>Outdoor</h4>
                  <p className={`text-[9px] font-bold mt-2 uppercase tracking-wider ${isOutdoorCrowded ? "text-red-500" : "text-green-500"}`}>
                    {outdoorOccupied}/5 Meja — {isOutdoorCrowded ? "Ramai" : "Sepi"}
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => { if (selectedArea) setShowMap(true); }}
              disabled={!selectedArea}
              className={`w-full py-5 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 ${
                selectedArea 
                ? "bg-white text-black shadow-xl hover:bg-amber-500 hover:text-white" 
                : "bg-white/5 text-stone-600 border border-white/5 cursor-not-allowed"
              }`}
            >
              🗺️ Buka Peta Meja
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
               <button 
                onClick={() => setShowMap(false)}
                className="text-[10px] text-stone-500 hover:text-amber-500 font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
              >
                ← Kembali
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${selectedArea === "Indoor" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-green-500/10 border-green-500/30 text-green-500"}`}>
                Area {selectedArea}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {(selectedArea === "Indoor" ? Array.from({length: 10}, (_, i) => i + 1) : Array.from({length: 5}, (_, i) => i + 11)).map(t => {
                const isOcc = occupiedTables.includes(t);
                return (
                  <button
                    key={t}
                    disabled={isOcc}
                    onClick={() => handleSelectTable(t, selectedArea!)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-500 ${
                      isOcc 
                        ? 'bg-stone-900 border-white/5 opacity-30 cursor-not-allowed' 
                        : 'bg-[#151515] border-white/5 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <span className="text-[8px] font-black text-stone-600 uppercase mb-1">Meja</span>
                    <span className={`text-xl font-black ${isOcc ? 'text-stone-700' : 'text-white group-hover:text-amber-500 transition-colors'}`}>{t}</span>
                    {!isOcc && <div className="absolute top-2 right-2 w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
