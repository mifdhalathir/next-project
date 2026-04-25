"use client";

import { useState } from "react";

export default function CeritaKami() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-20 px-4 bg-cream-50 dark:bg-stone-950 transition-colors duration-500 overflow-hidden border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div data-aos="fade-up">
          <p className="text-amber-700 dark:text-amber-500 tracking-[.3em] text-xs uppercase mb-2">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-theme mb-6">Cerita Kami</h2>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto mb-8"></div>
        </div>

        <div className="text-theme opacity-80 leading-relaxed space-y-4" data-aos="fade-up" data-aos-delay="100">
          <p className="text-lg italic font-medium">
            "Karsa bermula dari sebuah mimpi sederhana untuk menciptakan ruang bagi para pemimpi dan pejuang tugas di Padang."
          </p>
          
          <div 
            className={`grid transition-all duration-700 ease-in-out overflow-hidden ${
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <p className="pt-4">
                Didirikan pada tahun 2024, Karsa Kafe lahir dari pengamatan kami terhadap mahasiswa di sekitar Air Tawar yang membutuhkan tempat nyaman tidak hanya untuk sekadar minum kopi, tapi untuk benar-benar berkarya. Nama 'Karsa' sendiri berarti kekuatan jiwa atau niat murni untuk mewujudkan sesuatu.
              </p>
              <p className="pt-4">
                Setiap sudut di kafe ini kami rancang dengan detail—mulai dari pencahayaan yang pas untuk membaca, stop kontak di setiap meja, hingga playlist musik yang membantu fokus. Kami percaya bahwa secangkir kopi yang baik adalah bahan bakar terbaik untuk menyelesaikan tugas akhir, skripsi, atau proyek kreatif Anda.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-10 group flex flex-col items-center mx-auto focus:outline-none"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="text-sm font-bold text-amber-700 tracking-widest uppercase mb-2 group-hover:text-amber-800 transition">
            {isExpanded ? "Tutup Cerita" : "Baca Selengkapnya"}
          </span>
          <div className={`w-8 h-8 rounded-full border-2 border-amber-700 flex items-center justify-center transition-all duration-500 ${isExpanded ? "rotate-180" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700"><path d="m6 9 6 6 6-6"></path></svg>
          </div>
        </button>
      </div>
    </section>
  );
}
