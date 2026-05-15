"use client";

import { useEffect, useState } from "react";

export default function StatusMeja() {
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);

  useEffect(() => {
    // Simulated live data
    setIndoorCapacity(Math.floor(Math.random() * 61) + 40); // 40% to 100%
    setOutdoorCapacity(Math.floor(Math.random() * 61) + 20); // 20% to 80%
  }, []);

  const getStatusConfig = (capacity: number) => {
    if (capacity > 80) return { 
      color: "text-red-500", 
      bg: "bg-red-500", 
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]",
      label: "Full House"
    };
    if (capacity > 50) return { 
      color: "text-amber-500", 
      bg: "bg-amber-500", 
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
      label: "Steady"
    };
    return { 
      color: "text-green-500", 
      bg: "bg-green-500", 
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
      label: "Available"
    };
  };

  const getStatusText = (capacity: number, area: string) => {
    if (capacity > 80) return `Area ${area} sedang sangat ramai. Disarankan reservasi!`;
    if (capacity > 50) return `Area ${area} mulai terisi, tapi masih ada ruang untukmu.`;
    return `Area ${area} masih lega, waktu terbaik untuk datang!`;
  };

  const indoor = getStatusConfig(indoorCapacity);
  const outdoor = getStatusConfig(outdoorCapacity);
  const isWaitlist = indoorCapacity > 80 || outdoorCapacity > 80;

  return (
    <section id="statusMeja" className="py-24 relative overflow-hidden bg-black">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3">Live Occupancy</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
            Ketersediaan <span className="text-amber-500">Meja</span>
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Indoor Area */}
          <div className="bg-[#1a1412] p-10 rounded-3xl border border-white/5 relative group transition-all duration-500" data-aos="fade-right">
            <h3 className="text-center text-xl font-bold text-cream-100 mb-6 flex items-center justify-center gap-2">
              🏠 Area Indoor
            </h3>
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className={`w-3 h-3 rounded-full ${indoor.bg} ${indoor.glow} animate-pulse`}></div>
              <span className={`${indoor.color} font-bold text-sm tracking-wide`}>
                {Math.floor((indoorCapacity/100)*10)}/10 Meja Terpakai
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full mb-6 relative overflow-hidden">
               <div 
                 className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 bg-stone-600`}
                 style={{ width: `${indoorCapacity}%` }}
               ></div>
            </div>
            <p className="text-stone-400 text-sm text-center">
              Saat ini area Indoor sedang <span className="font-bold">{indoorCapacity}% penuh</span>
            </p>
          </div>

          {/* Outdoor Area */}
          <div className="bg-[#1a1412] p-10 rounded-3xl border border-white/5 relative group transition-all duration-500" data-aos="fade-left">
            <h3 className="text-center text-xl font-bold text-cream-100 mb-6 flex items-center justify-center gap-2">
              🌿 Area Outdoor
            </h3>
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className={`w-3 h-3 rounded-full ${outdoor.bg} ${outdoor.glow} animate-pulse`}></div>
              <span className={`${outdoor.color} font-bold text-sm tracking-wide`}>
                {Math.floor((outdoorCapacity/100)*5)}/5 Meja Terpakai
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full mb-6 relative overflow-hidden">
               <div 
                 className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 bg-stone-600`}
                 style={{ width: `${outdoorCapacity}%` }}
               ></div>
            </div>
            <p className="text-stone-400 text-sm text-center">
              Area Outdoor <span className="font-bold">{outdoorCapacity > 80 ? 'hampir penuh' : 'masih luas'}</span>, yuk merapat!
            </p>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        <div 
          className={`bg-[#e6ffe6] px-8 py-5 rounded-2xl border border-green-500/20 flex items-center justify-center gap-4 max-w-xl mx-auto shadow-2xl transition-all duration-500 mt-8`}
          data-aos="zoom-in"
        >
          <div className="text-xl">⏳</div>
          <p className="text-green-800 font-bold text-sm tracking-wide">
            Meja tersedia, langsung gas ke lokasi!
          </p>
        </div>

        <p className="text-center text-stone-600 text-[9px] font-bold uppercase tracking-[0.4em] mt-12 italic">
          * Data real-time diperbarui setiap 5 menit oleh tim operasional KARSA
        </p>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </section>
  );
}
