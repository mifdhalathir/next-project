"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Open from 08:00 to 00:00
      setIsOpen(hour >= 8 && hour < 24);
    };

    checkTime();
    const timer = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <footer id="kontak" className="bg-wood-900 text-cream-200 py-14 px-4 animated-grid relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-sm relative z-10">
        <div>
          <h3 className="font-display text-xl font-bold text-white mb-3">KARSA KAFE</h3>
          <p className="text-stone-400 leading-relaxed">
            Ruang inspirasi untuk berkarya, berdiskusi, dan menikmati kopi terbaik di Air Tawar, Padang.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Alamat</h4>
          <p className="text-stone-400 leading-relaxed">
            Jl. Belibis, Air Tawar Barat,<br />Kec. Padang Utara, Kota Padang,<br />Sumatera Barat
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            Jam Operasional
            {isOpen ? (
              <span className="flex items-center gap-1 bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                OPEN NOW
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                CLOSED
              </span>
            )}
          </h4>
          <p className="text-stone-400">Setiap Hari</p>
          <p className="text-amber-400 font-semibold text-lg">08.00 - 00.00 WIB</p>
        </div>
      </div>
      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-xs relative z-10 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            title="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </Link>
          <Link
            href="#"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg overflow-hidden"
            title="Instagram"
            style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </Link>
          <Link
            href="#"
            className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-white/20"
            title="TikTok"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" className="stroke-cyan-400 drop-shadow-[1px_1px_0px_rgba(255,0,80,1)]"></path></svg>
          </Link>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Karsa Kafe Padang. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
