"use client";

import { useState, useEffect } from "react";

const RANDOM_NAMES = ["Seseorang", "Mahasiswa UNP", "Pelanggan Meja 4", "Penggemar Kopi", "Sobat Karsa"];
const RANDOM_ITEMS = ["Kopi Susu Karsa", "Matcha Latte", "Kentang Goreng", "Roti Bakar Cokelat", "Croissant", "Mocktail Sunset"];

export default function LiveActivityFeed() {
  const [feed, setFeed] = useState<{ id: number; text: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const generateActivity = () => {
      const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const item = RANDOM_ITEMS[Math.floor(Math.random() * RANDOM_ITEMS.length)];
      const text = `${name} baru saja memesan ${item}`;
      
      setFeed({ id: Date.now(), text });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    const interval = setInterval(generateActivity, 15000);
    setTimeout(generateActivity, 3000); // First one after 3s

    return () => clearInterval(interval);
  }, []);

  if (!feed) return null;

  return (
    <div 
      className={`fixed top-24 right-6 z-[40] transition-all duration-500 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <div className="glass-form px-5 py-3 rounded-2xl flex items-center gap-3 border border-amber-500/30 shadow-lg shadow-amber-900/20">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Live Feed</span>
        <p className="text-xs font-bold text-white/80 dark:text-cream-100 italic">
          "{feed.text}"
        </p>
      </div>
    </div>
  );
}
