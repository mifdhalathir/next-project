"use client";

import { useState } from "react";

export default function CeritaKami() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden border-y border-white/5">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div data-aos="fade-up">
          <span className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3 block">Our Heritage</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase mb-6">
            Cerita <span className="text-amber-500">Kami</span>
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto mb-10"></div>
        </div>

        <div className="text-white/80 leading-relaxed space-y-6" data-aos="fade-up" data-aos-delay="100">
          <p className="text-xl md:text-2xl italic font-light tracking-tight text-white/90">
            "Karsa bermula dari sebuah mimpi sederhana untuk menciptakan ruang bagi para pemimpi dan pejuang tugas di Padang."
          </p>
          
          <div 
            className={`grid transition-all duration-1000 ease-in-out overflow-hidden ${
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="space-y-6 text-sm md:text-base font-medium text-stone-400 max-w-2xl mx-auto pt-6">
                <p>
                  Didirikan pada tahun 2024, Karsa Kafe lahir dari pengamatan kami terhadap mahasiswa di sekitar Air Tawar yang membutuhkan tempat nyaman tidak hanya untuk sekadar minum kopi, tapi untuk benar-benar berkarya. Nama 'Karsa' sendiri berarti kekuatan jiwa atau niat murni untuk mewujudkan sesuatu.
                </p>
                <p>
                  Setiap sudut di kafe ini kami rancang dengan detail—mulai dari pencahayaan yang pas untuk membaca, stop kontak di setiap meja, hingga playlist musik yang membantu fokus. Kami percaya bahwa secangkir kopi yang baik adalah bahan bakar terbaik untuk menyelesaikan tugas akhir, skripsi, atau proyek kreatif Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-12 group flex flex-col items-center mx-auto focus:outline-none transition-all duration-300 active:scale-95"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="text-[10px] font-black text-amber-500 tracking-[0.3em] uppercase mb-4 group-hover:text-white transition-colors duration-500">
            {isExpanded ? "Tutup Cerita" : "Baca Selengkapnya"}
          </span>
          <div className={`w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-700 group-hover:border-amber-500/50 group-hover:bg-amber-600/10 ${isExpanded ? "rotate-180" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m6 9 6 6 6-6"></path></svg>
          </div>
        </button>
      </div>
    </section>
  );
}
