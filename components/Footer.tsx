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
              IG
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-700 transition text-sm"
            >
              WA
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-700 transition text-sm"
            >
              TT
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
