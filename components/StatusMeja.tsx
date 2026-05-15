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
    if (capacity >= 90) return { color: "bg-red-500", label: "Hampir Penuh", text: "text-red-500" };
    if (capacity >= 70) return { color: "bg-amber-500", label: "Ramai", text: "text-amber-500" };
    return { color: "bg-green-500", label: "Tersedia", text: "text-green-500" };
  };

  const indoorConfig = getStatusConfig(indoorCapacity);
  const outdoorConfig = getStatusConfig(outdoorCapacity);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Indoor</span>
          <div className={`w-2 h-2 rounded-full ${indoorConfig.color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{indoorCapacity}%</span>
        </div>
        <p className={`text-[8px] font-bold uppercase tracking-tighter mt-1 ${indoorConfig.text}`}>{indoorConfig.label}</p>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Outdoor</span>
          <div className={`w-2 h-2 rounded-full ${outdoorConfig.color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{outdoorCapacity}%</span>
        </div>
        <p className={`text-[8px] font-bold uppercase tracking-tighter mt-1 ${outdoorConfig.text}`}>{outdoorConfig.label}</p>
      </div>
    </div>
  );
}
