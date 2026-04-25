"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Initial load animation
    setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setIsLoading(false), 700);
    }, 500);
  }, []);

  useEffect(() => {
    // Trigger exit animation then load when path changes
    setIsLoaded(false);
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, [pathname]);

  return (
    <>
      {isLoading && (
        <div
          id="loadingScreen"
          className={`fixed inset-0 z-[999999] bg-wood-900 flex flex-col items-center justify-center transition-opacity duration-700 ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21H20V19H2V21ZM20 8H18V5H20C20.55 5 21 5.45 21 6C21 6.55 20.55 7 20 7H20V8ZM16 15C16 16.66 14.66 18 13 18H7C5.34 18 4 16.66 4 15V3H16V15ZM18 3H18V3C19.66 3 21 4.34 21 6C21 7.66 19.66 9 18 9V9H16V3H18ZM11 5H9V14H11V5ZM15 5H13V14H15V5Z" />
            </svg>
            <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-[0.3em] uppercase animate-pulse">
            KARSA
          </h1>
          <p className="text-amber-400 text-xs tracking-widest mt-2 uppercase">Menyiapkan Ruang...</p>
        </div>
      )}

      <div
        className={`page-transition ${isLoaded && !isLoading ? "loaded" : ""}`}
      ></div>
    </>
  );
}
