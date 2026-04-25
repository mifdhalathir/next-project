"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-wood-900 text-cream-200 py-14 px-4 animated-grid relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-sm relative z-10">
        <div>
          <h3 className="font-display text-xl font-bold text-white mb-3">KARSA CAFE</h3>
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
          <h4 className="font-semibold text-white mb-3">Jam Operasional</h4>
          <p className="text-stone-400">Setiap Hari</p>
          <p className="text-amber-400 font-semibold text-lg">08.00 - 00.00 WIB</p>
          <div className="flex space-x-3 mt-4">
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-700 transition text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-700 transition text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-700 transition text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-stone-500 text-xs relative z-10">
        &copy; {new Date().getFullYear()} Karsa Cafe Padang. All rights reserved.
      </div>
    </footer>
  );
}
