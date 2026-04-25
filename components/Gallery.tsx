"use client";

import { useState } from "react";

const GALLERY_IMAGES = [
  "/images/kopi-susu-karsa.png",
  "/images/matcha-latte.png",
  "/images/mix-platter.png",
  "/images/indomie-goreng.png",
  "/images/nasi-goreng-katsu.png",
];

export default function Gallery() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <>
      <section 
        id="gallery" 
        className="py-20 px-4 bg-wood-800 text-white relative bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/images/kopi-susu-karsa.png')" }}
      >
        <div className="absolute inset-0 bg-wood-900/80"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14" data-aos="fade-up">
            <p className="text-amber-400 tracking-[.3em] text-xs uppercase mb-2">Visual Mahal</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Karsa Gallery</h2>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
          </div>

          <div className="columns-2 md:columns-3 gap-4 space-y-4" data-aos="fade-up" data-aos-delay="200">
            {GALLERY_IMAGES.map((src, index) => (
              <img 
                key={index}
                src={src}
                className="w-full rounded-2xl cursor-pointer hover:opacity-80 transition duration-300 shadow-lg object-cover"
                alt={`Gallery ${index}`}
                onClick={() => setLightboxImg(src)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <div 
        className={`fixed inset-0 z-[100] items-center justify-center bg-wood-900/60 backdrop-blur-xl transition-all duration-300 ${
          lightboxImg ? "flex opacity-100" : "hidden opacity-0 pointer-events-none"
        }`}
        onClick={() => setLightboxImg(null)}
      >
        <button 
          className="absolute top-6 right-8 text-cream-100/50 hover:text-white text-4xl transition"
          onClick={() => setLightboxImg(null)}
        >
          &times;
        </button>
        {lightboxImg && (
          <img 
            src={lightboxImg}
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl transform transition-transform duration-300 object-contain scale-100"
            onClick={(e) => e.stopPropagation()}
            alt="Lightbox"
          />
        )}
      </div>
    </>
  );
}
