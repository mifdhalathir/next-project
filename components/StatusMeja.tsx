"use client";

import { useEffect, useState } from "react";

export default function StatusMeja() {
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);

  useEffect(() => {
    setIndoorCapacity(Math.floor(Math.random() * 61) + 40); // 40% to 100%
    setOutdoorCapacity(Math.floor(Math.random() * 61) + 20); // 20% to 80%
  }, []);

  const getStatusClasses = (capacity: number) => {
    if (capacity > 80) return { bg: "bg-red-500", text: "text-red-600", dot: "indicator-dot bg-red-500" };
    if (capacity > 50) return { bg: "bg-amber-500", text: "text-amber-600", dot: "indicator-dot bg-amber-500" };
    return { bg: "bg-green-500", text: "text-green-600", dot: "indicator-dot bg-green-500" };
  };

  const getStatusText = (capacity: number, area: string) => {
    if (capacity > 80) return `Saat ini area ${area} sedang Sangat Rame`;
    if (capacity > 50) return `Saat ini area ${area} sedang Lumayan Rame`;
    return `Saat ini area ${area} sedang Santai`;
  };

  const indoorClasses = getStatusClasses(indoorCapacity);
  const outdoorClasses = getStatusClasses(outdoorCapacity);

  const isWaitlist = indoorCapacity > 80 || outdoorCapacity > 80;

  return (
    <section id="statusMeja" className="py-20 px-4 bg-cream-50 dark:bg-wood-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-700 tracking-[.3em] text-xs uppercase mb-2">Real-Time</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-wood-800 dark:text-cream-100">
            Status Ketersediaan Meja
          </h2>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-white dark:bg-wood-900 rounded-2xl p-8 shadow-md text-center">
            <h3 className="font-display text-xl font-semibold text-wood-800 dark:text-cream-100 mb-4">🏠 Area Indoor</h3>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className={indoorClasses.dot}></span>
              <span className={`${indoorClasses.text} font-bold text-lg`}>{indoorCapacity}% Terisi</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-3 mb-4">
              <div className={`${indoorClasses.bg} h-3 rounded-full transition-all duration-1000`} style={{ width: `${indoorCapacity}%` }}></div>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-semibold">{getStatusText(indoorCapacity, "Indoor")}</p>
          </div>
          
          <div className="bg-white dark:bg-wood-900 rounded-2xl p-8 shadow-md text-center">
            <h3 className="font-display text-xl font-semibold text-wood-800 dark:text-cream-100 mb-4">🌿 Area Outdoor</h3>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className={outdoorClasses.dot}></span>
              <span className={`${outdoorClasses.text} font-bold text-lg`}>{outdoorCapacity}% Terisi</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-3 mb-4">
              <div className={`${outdoorClasses.bg} h-3 rounded-full transition-all duration-1000`} style={{ width: `${outdoorCapacity}%` }}></div>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-semibold">{getStatusText(outdoorCapacity, "Outdoor")}</p>
          </div>
        </div>

        {/* Waitlist Indicator */}
        <div
          className={`mt-8 mx-auto max-w-md border-l-4 p-4 rounded-xl text-center shadow-md transition-all duration-300 ${
            isWaitlist ? "bg-red-100 border-red-500 text-red-800" : "bg-green-100 border-green-500 text-green-800"
          }`}
          data-aos="zoom-in"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl animate-pulse">⏳</span>
            <p className="font-bold">
              {isWaitlist ? "Antrean saat ini sekitar 15 menit" : "Meja tersedia, langsung gas ke lokasi!"}
            </p>
          </div>
        </div>

        <p className="text-center text-stone-400 text-xs mt-6">* Data diperbarui secara berkala oleh staff Karsa Cafe</p>
      </div>
    </section>
  );
}
