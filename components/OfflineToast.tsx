"use client";

import { useEffect, useState } from "react";

export default function OfflineToast() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[80] glass-form px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 flex items-start gap-3 border-l-4 border-l-red-500 ${
        isOffline ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0 pointer-events-none"
      }`}
    >
      <span className="text-2xl mt-0.5">📡</span>
      <div>
        <h4 className="font-bold text-wood-800 dark:text-cream-100">Oopps, koneksi hilang!</h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-[250px]">
          Tenang, Karsa Cafe di Air Tawar tetap buka sampai jam 12 malam. Yuk mampir!
        </p>
      </div>
    </div>
  );
}
