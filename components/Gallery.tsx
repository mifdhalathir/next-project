"use client";

import { useState } from "react";

const GALLERY_IMAGES = [
  { src: "/images/kopi-susu-karsa.png", title: "Signature Karsa", span: "row-span-2 col-span-2" },
  { src: "/images/matcha-latte.png", title: "Green Zen", span: "col-span-1" },
  { src: "/images/mix-platter.png", title: "Shared Joy", span: "col-span-1" },
  { src: "/images/indomie-goreng.png", title: "Comfort Food", span: "col-span-1" },
  { src: "/images/nasi-goreng-katsu.png", title: "Golden Katsu", span: "col-span-1" },
];

export default function Gallery() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <>
      <section 
        id="gallery" 
        className="py-24 px-4 bg-black relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3 block">Atmosphere</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
              Karsa <span className="text-amber-500">Gallery</span>
            </h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]" data-aos="fade-up" data-aos-delay="200">
            {GALLERY_IMAGES.map((item, index) => (
              <div 
                key={index} 
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer ${item.span || ""}`}
                onClick={() => setLightboxImg(item.src)}
              >
                <img 
                  src={item.src}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{item.title}</p>
                  <p className="text-white font-bold text-xs uppercase tracking-tighter">View Full Scene</p>
                </div>
                {/* Glassy border effect */}
                <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors rounded-[2rem] pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <div 
        className={`fixed inset-0 z-[100] items-center justify-center bg-black/90 backdrop-blur-2xl transition-all duration-500 ${
          lightboxImg ? "flex opacity-100" : "hidden opacity-0 pointer-events-none"
        }`}
        onClick={() => setLightboxImg(null)}
      >
        <button 
          className="absolute top-8 right-8 w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white text-3xl hover:bg-amber-600 transition-all duration-300 border border-white/10"
          onClick={() => setLightboxImg(null)}
        >
          &times;
        </button>
        {lightboxImg && (
          <div className="relative p-4 max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImg}
              className="w-full h-auto max-h-[85vh] rounded-[3rem] shadow-2xl object-contain border border-white/10"
              alt="Lightbox"
            />
          </div>
        )}
      </div>
    </>
  );
}
