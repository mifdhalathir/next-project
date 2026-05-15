"use client";

import { useEffect, useState } from "react";

export default function StatusMeja() {
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);

  useEffect(() => {
    // Simulated live data
    requestAnimationFrame(() => {
      setIndoorCapacity(Math.floor(Math.random() * 61) + 40); // 40% to 100%
      setOutdoorCapacity(Math.floor(Math.random() * 61) + 20); // 20% to 80%
    });
  }, []);

  const getStatusConfig = (capacity: number) => {
    if (capacity >= 90) return { color: "bg-red-500", label: "Penuh", text: "text-red-500" };
    if (capacity >= 70) return { color: "bg-amber-500", label: "Ramai", text: "text-amber-500" };
    return { color: "bg-green-500", label: "Tersedia", text: "text-green-500" };
  };

  const indoorConfig = getStatusConfig(indoorCapacity);
  const outdoorConfig = getStatusConfig(outdoorCapacity);

  return (
    <section id="statusMeja" className="py-24 relative overflow-hidden bg-black">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3">Live Occupancy</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
            Ketersediaan <span className="text-amber-500">Meja</span>
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Indoor Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <span className="text-xs font-black text-white uppercase tracking-widest">Indoor Area</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${indoorConfig.color} animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]`}></div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-white">{indoorCapacity}%</span>
              <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Occupancy</span>
            </div>
            
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className={`h-full transition-all duration-1000 ${indoorConfig.color}`} style={{ width: `${indoorCapacity}%` }}></div>
            </div>
            
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${indoorConfig.text}`}>{indoorConfig.label}</p>
          </div>

          {/* Outdoor Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌿</span>
                <span className="text-xs font-black text-white uppercase tracking-widest">Outdoor Area</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${outdoorConfig.color} animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]`}></div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-white">{outdoorCapacity}%</span>
              <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Occupancy</span>
            </div>
            
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className={`h-full transition-all duration-1000 ${outdoorConfig.color}`} style={{ width: `${outdoorCapacity}%` }}></div>
            </div>
            
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${outdoorConfig.text}`}>{outdoorConfig.label}</p>
          </div>
        </div>

        <p className="text-center text-stone-600 text-[9px] font-bold uppercase tracking-[0.4em] mt-12 italic">
          * Data real-time diperbarui setiap 5 menit oleh tim operasional KARSA
        </p>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(6px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </section>
  );
}
