"use client";

import { useState, useRef, useEffect } from "react";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        btnRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChat = (type: string) => {
    let msg = "";
    if (type === "menu") msg = "Halo Karsa Cafe, saya ingin bertanya tentang stok menu hari ini.";
    if (type === "lokasi") msg = "Halo Karsa Cafe, boleh minta petunjuk arah/lokasi kafe?";
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div id="liveChatWidget" className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      <div
        ref={popupRef}
        className={`bg-white dark:bg-wood-800 p-4 rounded-xl shadow-2xl border border-stone-200 dark:border-wood-700 w-64 transform origin-bottom-right transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex gap-3 mb-4 items-start">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 text-sm">
            👨‍💼
          </div>
          <div className="bg-cream-100 dark:bg-stone-700 p-3 rounded-lg rounded-tl-none text-sm text-stone-700 dark:text-cream-100">
            Halo! Ada yang bisa kami bantu?
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleChat("menu")}
            className="w-full text-left px-4 py-2 text-sm bg-amber-50 dark:bg-wood-700 hover:bg-amber-100 dark:hover:bg-wood-600 text-amber-800 dark:text-amber-400 rounded-lg transition font-medium"
          >
            ☕ Tanya Stok Menu
          </button>
          <button
            onClick={() => handleChat("lokasi")}
            className="w-full text-left px-4 py-2 text-sm bg-amber-50 dark:bg-wood-700 hover:bg-amber-100 dark:hover:bg-wood-600 text-amber-800 dark:text-amber-400 rounded-lg transition font-medium"
          >
            📍 Tanya Lokasi
          </button>
        </div>
      </div>
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 text-2xl"
      >
        💬
      </button>
    </div>
  );
}
