"use client";

import { useState, useEffect } from "react";

export default function AreaBanner() {
  const [area, setArea] = useState<string | null>(null);

  useEffect(() => {
    const checkArea = () => {
      const storedArea = localStorage.getItem("karsa_area");
      if (storedArea) setArea(storedArea);
    };

    checkArea();
    window.addEventListener("storage", checkArea);
    return () => window.removeEventListener("storage", checkArea);
  }, []);

  if (!area) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm animate-fade-in" style={{ animation: "fadeInDown 0.8s ease" }}>
      {area === "Outdoor" ? (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 backdrop-blur-md shadow-lg shadow-green-900/20">
          <span className="text-2xl drop-shadow-lg">🌿</span>
          <div>
            <p className="text-green-400 text-[11px] font-extrabold uppercase tracking-[0.12em]">Open Air | Smoking Area</p>
            <p className="text-green-400/70 text-[10px] mt-0.5">Pemandangan Asri</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md shadow-lg shadow-amber-900/20">
          <span className="text-2xl drop-shadow-lg">❄️</span>
          <div>
            <p className="text-amber-400 text-[11px] font-extrabold uppercase tracking-[0.12em]">Full AC Area</p>
            <p className="text-amber-400/70 text-[10px] mt-0.5">Suasana Tenang & Hangat</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
