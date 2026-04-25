"use client";

import { useState } from "react";

const RECOMMENDATIONS = [
  { name: "Kopi Susu Karsa", price: "Rp 18.000", img: "/images/kopi-susu-karsa.png" },
  { name: "Nasi Goreng Katsu", price: "Rp 28.000", img: "/images/nasi-goreng-katsu.png" },
  { name: "Matcha Latte", price: "Rp 22.000", img: "/images/matcha-latte.png" },
];

export default function FABMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-[120%] z-[51] flex flex-col items-center gap-4">
      {/* Pop-up Menu */}
      <div
        className={`bg-white/90 dark:bg-wood-800/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 w-56 transform origin-bottom transition-all duration-500 ease-out ${
          isOpen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-12 pointer-events-none"
        }`}
      >
        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 border-b border-amber-700/10 pb-2">
          Rekomendasi Hari Ini
        </h4>
        <div className="space-y-4">
          {RECOMMENDATIONS.map((item, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-stone-800 dark:text-cream-100 leading-tight">{item.name}</span>
                <span className="text-[10px] text-amber-600 font-semibold">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform ${
          isOpen ? "bg-wood-800 rotate-180" : "bg-amber-600 hover:scale-110"
        }`}
      >
        <span className="text-2xl">
          {isOpen ? "✕" : "📖"}
        </span>
      </button>
    </div>
  );
}
