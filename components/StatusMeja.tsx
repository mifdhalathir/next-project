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
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative group transition-all duration-500 hover:border-amber-500/20" data-aos="fade-right">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">🏠 Area Indoor</h3>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{indoor.label}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${indoor.bg} ${indoor.glow} animate-pulse`}></div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className={`text-3xl font-black inline-block ${indoor.color} tracking-tighter`}>
                    {indoorCapacity}%
                  </span>
                  <span className="text-stone-600 text-[10px] font-black uppercase tracking-widest ml-2">Occupied</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-white/5">
                <div 
                  style={{ width: `${indoorCapacity}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${indoor.bg} transition-all duration-1000 ease-out`}
                ></div>
              </div>
            </div>
            <p className="text-stone-400 text-sm font-medium leading-relaxed italic opacity-80">
              "{getStatusText(indoorCapacity, "Indoor")}"
            </p>
          </div>

          {/* Outdoor Area */}
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative group transition-all duration-500 hover:border-amber-500/20" data-aos="fade-left">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">🌿 Area Outdoor</h3>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{outdoor.label}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${outdoor.bg} ${outdoor.glow} animate-pulse`}></div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className={`text-3xl font-black inline-block ${outdoor.color} tracking-tighter`}>
                    {outdoorCapacity}%
                  </span>
                  <span className="text-stone-600 text-[10px] font-black uppercase tracking-widest ml-2">Occupied</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-white/5">
                <div 
                  style={{ width: `${outdoorCapacity}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${outdoor.bg} transition-all duration-1000 ease-out`}
                ></div>
              </div>
            </div>
            <p className="text-stone-400 text-sm font-medium leading-relaxed italic opacity-80">
              "{getStatusText(outdoorCapacity, "Outdoor")}"
            </p>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        <div 
          className={`glass-card p-6 rounded-3xl border ${isWaitlist ? 'border-red-500/30' : 'border-green-500/30'} flex items-center justify-center gap-6 max-w-2xl mx-auto shadow-2xl transition-all duration-500 hover:scale-[1.02]`}
          data-aos="zoom-in"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isWaitlist ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
            {isWaitlist ? "⏳" : "✨"}
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isWaitlist ? 'text-red-500' : 'text-green-500'}`}>
              Current Situation
            </p>
            <p className="text-white font-bold text-sm tracking-tight">
              {isWaitlist ? "Antrean saat ini sekitar 15 menit. Yuk amankan mejamu!" : "Meja tersedia di kedua area. Langsung gas ke lokasi!"}
            </p>
          </div>
          <a href="#reservasi" className={`ml-auto px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isWaitlist ? 'bg-red-600 text-white hover:bg-white hover:text-black' : 'bg-green-600 text-white hover:bg-white hover:text-black'}`}>
            {isWaitlist ? "Reservasi" : "Arahkan"}
          </a>
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
