"use client";

import { useState, useEffect, useRef } from "react";
import { addKarsaNotification } from "./NotificationHub";
import { addActivityLog } from "./ActivityLog";
import { useKarsa } from "./KarsaContext";

export default function SmartTableModal() {
  const { tables, checkInTable } = useKarsa();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedArea, setSelectedArea] = useState<"Indoor" | "Outdoor" | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isReservationPick, setIsReservationPick] = useState(false);

  // Track when modal was opened manually (via button/event) so that
  // the auto-checkStatus from "storage" events doesn't interfere
  const manuallyOpenedRef = useRef(false);

  // Compute stats and occupied tables reactively from the Firestore table list
  const occupiedTables = tables.filter(t => t.status !== "available").map(t => t.id);
  const indoorOccupied = tables.filter(t => t.area === "Indoor" && t.status !== "available").length;
  const outdoorOccupied = tables.filter(t => t.area === "Outdoor" && t.status !== "available").length;

  useEffect(() => {
    const checkStatus = () => {
      // Don't interfere if modal was opened manually (e.g. from ReservationForm "LIHAT PETA MEJA")
      if (manuallyOpenedRef.current) return;

      const table = localStorage.getItem("karsa_table_number");
      const user = localStorage.getItem("karsa_user_name");
      const browseMode = sessionStorage.getItem("karsa_browse_mode");
      
      if (user && !table && browseMode !== "true") {
        setUserName(user);
        setIsOpen(true);
      } else if (!user) {
        setIsOpen(false);
      }
    };

    const handleOpenModal = (e: Event | CustomEvent) => {
      const user = localStorage.getItem("karsa_user_name") || "";
      setUserName(user);
      
      let directMap = false;
      let area: "Indoor" | "Outdoor" | null = null;
      let viewOnly = false;
      let reservationPick = false;

      if ('detail' in e && e.detail) {
        directMap = !!e.detail.directMap;
        viewOnly = !!e.detail.viewOnly;
        reservationPick = !!e.detail.reservationPick;
        if (e.detail.area === "Indoor" || e.detail.area === "Outdoor") {
          area = e.detail.area;
        }
      }

      setIsViewOnly(viewOnly);
      setIsReservationPick(reservationPick);

      if (reservationPick) {
        // Always show map directly for reservation picking (skip area selection)
        setShowMap(true);
        if (area) setSelectedArea(area);
      } else if (directMap && area) {
        setSelectedArea(area);
        setShowMap(true);
      } else {
        setShowMap(false);
        setSelectedArea(null);
      }

      // Mark as manually opened to prevent checkStatus interference
      manuallyOpenedRef.current = true;
      setIsOpen(true);
    };

    checkStatus();
    window.addEventListener("storage", checkStatus);
    window.addEventListener("openTableModal", handleOpenModal as EventListener);

    // ESC key to dismiss
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        manuallyOpenedRef.current = false;
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("storage", checkStatus);
      window.removeEventListener("openTableModal", handleOpenModal as EventListener);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Centralized close handler — always resets the manual-open ref
  const closeModal = () => {
    manuallyOpenedRef.current = false;
    setIsOpen(false);
  };

  const handleSelectTable = (t: number, area: "Indoor" | "Outdoor") => {
    if (occupiedTables.includes(t)) return;

    if (isReservationPick) {
      // In reservationPick mode (from ReservationForm), dispatch event with table info
      const displayNum = area === "Outdoor" ? t - 10 : t;
      window.dispatchEvent(
        new CustomEvent("reservationTableSelected", {
          detail: { tableNumber: displayNum, tableId: t, area },
        })
      );
      closeModal();
      setIsReservationPick(false);
      return;
    }

    if (isViewOnly) {
      // In viewOnly mode, we don't actually sit at the table
      closeModal();
      return;
    }

    sessionStorage.removeItem("karsa_browse_mode");
    checkInTable(t, area, userName || "Sultan").catch(e => console.error("Check-in error:", e));
    closeModal();
  };

  if (!isOpen) return null;

  const isIndoorCrowded = indoorOccupied >= 8;
  const isOutdoorCrowded = outdoorOccupied >= 4;
  const indoorAvailable = 10 - indoorOccupied;
  const outdoorAvailable = 5 - outdoorOccupied;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={closeModal} />
      <div className="bg-[#0A0A0A] border border-amber-500/20 rounded-[3rem] p-10 relative z-10 w-full max-w-xl shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-stone-500 hover:text-white transition-all text-sm"
          aria-label="Tutup"
        >
          ✕
        </button>

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
          <p className="text-stone-500 text-[10px] mt-3 font-black tracking-[0.3em] uppercase">
            {isReservationPick ? "Pilih meja untuk reservasi Anda" : isViewOnly ? "Lihat ketersediaan meja untuk reservasi" : "Pilih area dan nomor meja untuk memulai"}
          </p>
        </div>

        {!showMap ? (
          <div className="space-y-8">
            {/* Area Selection */}
            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => setSelectedArea("Indoor")}
                disabled={indoorAvailable <= 0}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
                  indoorAvailable <= 0
                  ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                  : selectedArea === "Indoor" 
                  ? "bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-105" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">❄️</span>
                <div className="text-center">
                  <h4 className={`text-sm font-black uppercase tracking-widest ${selectedArea === "Indoor" ? "text-amber-500" : "text-stone-300"}`}>Indoor</h4>
                  <p className={`text-[9px] font-bold mt-2 uppercase tracking-wider ${isIndoorCrowded ? "text-red-500" : "text-green-500"}`}>
                    {indoorAvailable > 0 ? `${indoorAvailable} Meja Tersedia` : "Penuh"} — {isIndoorCrowded ? "Ramai" : "Sepi"}
                  </p>
                  {/* Mini capacity bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${isIndoorCrowded ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${(indoorOccupied / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedArea("Outdoor")}
                disabled={outdoorAvailable <= 0}
                className={`group relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center gap-4 ${
                  outdoorAvailable <= 0
                  ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                  : selectedArea === "Outdoor" 
                  ? "bg-green-500/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-105" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">🌿</span>
                <div className="text-center">
                  <h4 className={`text-sm font-black uppercase tracking-widest ${selectedArea === "Outdoor" ? "text-green-500" : "text-stone-300"}`}>Outdoor</h4>
                  <p className={`text-[9px] font-bold mt-2 uppercase tracking-wider ${isOutdoorCrowded ? "text-red-500" : "text-green-500"}`}>
                    {outdoorAvailable > 0 ? `${outdoorAvailable} Meja Tersedia` : "Penuh"} — {isOutdoorCrowded ? "Ramai" : "Sepi"}
                  </p>
                  {/* Mini capacity bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${isOutdoorCrowded ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${(outdoorOccupied / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => { if (selectedArea) { setShowMap(true); } }}
              disabled={!selectedArea}
              className={`w-full py-5 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 ${
                selectedArea 
                ? "bg-white text-black shadow-xl hover:bg-amber-500 hover:text-white" 
                : "bg-white/5 text-stone-600 border border-white/5 cursor-not-allowed"
              }`}
            >
              🗺️ Buka Peta Meja
            </button>

            {/* Skip option */}
            <button
              onClick={() => {
                sessionStorage.setItem("karsa_browse_mode", "true");
                closeModal();
              }}
              className="w-full py-3 text-[9px] font-black tracking-[0.3em] uppercase text-stone-600 hover:text-stone-400 transition-colors"
            >
              Lanjutkan Tanpa Meja (Browse Mode)
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[9px] font-black tracking-[0.3em] uppercase text-stone-500 mb-1">REAL-TIME</p>
                <h2 className="text-3xl font-display font-black text-white">Peta Meja Karsa</h2>
                
                {/* Legend */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-900/50 border border-red-500/50"></div>
                    <span className="text-[10px] font-bold text-stone-400">Dipesan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-900/30 border border-amber-600/50"></div>
                    <span className="text-[10px] font-bold text-stone-400">Tersedia (Indoor)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-900/30 border border-green-600/50"></div>
                    <span className="text-[10px] font-bold text-stone-400">Tersedia (Outdoor)</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (isViewOnly || isReservationPick) {
                    closeModal();
                  } else {
                    setShowMap(false);
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* INDOOR SECTION */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">🏠</span>
                  <h3 className="text-[10px] font-black tracking-widest text-amber-500 uppercase">
                    AREA INDOOR — 10 MEJA
                  </h3>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({length: 10}, (_, i) => i + 1).map(t => {
                    const isOcc = occupiedTables.includes(t);
                    return (
                      <button
                        key={t}
                        disabled={isOcc || (isViewOnly && !isReservationPick)}
                        onClick={() => handleSelectTable(t, "Indoor")}
                        className={`relative aspect-[4/3] rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                          isOcc 
                            ? 'bg-red-950/20 border-red-900/30 opacity-50 cursor-not-allowed' 
                            : (isViewOnly && !isReservationPick)
                            ? 'bg-amber-950/20 border-amber-600/20 cursor-default opacity-80'
                            : 'bg-amber-950/20 border-amber-600/20 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(245,158,11,0.02)]'
                        }`}
                      >
                        <span className={`text-xl mb-1 ${isOcc ? 'filter grayscale opacity-50' : ''}`}>🪑</span>
                        <span className={`text-[10px] font-black ${isOcc ? 'text-stone-600' : 'text-amber-500'}`}>M{t}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* OUTDOOR SECTION */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">🌿</span>
                  <h3 className="text-[10px] font-black tracking-widest text-green-500 uppercase">
                    AREA OUTDOOR — 5 MEJA
                  </h3>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({length: 5}, (_, i) => i + 11).map(t => {
                    const isOcc = occupiedTables.includes(t);
                    // Outdoor display numbers typically 1-5 for visual, but actual ID is 11-15
                    const displayNum = t - 10;
                    return (
                      <button
                        key={t}
                        disabled={isOcc || (isViewOnly && !isReservationPick)}
                        onClick={() => handleSelectTable(t, "Outdoor")}
                        className={`relative aspect-[4/3] rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                          isOcc 
                            ? 'bg-red-950/20 border-red-900/30 opacity-50 cursor-not-allowed' 
                            : (isViewOnly && !isReservationPick)
                            ? 'bg-green-950/20 border-green-600/20 cursor-default opacity-80'
                            : 'bg-green-950/20 border-green-600/20 hover:border-green-500 hover:bg-green-500/10 cursor-pointer shadow-[inset_0_0_15px_rgba(34,197,94,0.02)]'
                        }`}
                      >
                        <span className={`text-xl mb-1 ${isOcc ? 'filter grayscale opacity-50' : ''}`}>🌿</span>
                        <span className={`text-[10px] font-black ${isOcc ? 'text-stone-600' : 'text-green-500'}`}>M{displayNum}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <p className="text-[9px] text-stone-600 font-bold tracking-wider">
                * Data diperbarui setiap saat oleh staff Karsa Cafe
              </p>
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
