"use client";

import { useState } from "react";

export default function BeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section id="transformation" className="py-20 px-4 bg-wood-800 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-400 tracking-[.3em] text-xs uppercase mb-2">Vibe Berbeda</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100">Karsa Transformation</h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
        </div>
        
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group" data-aos="zoom-in">
          {/* Night Image (Bottom/Background) */}
          <img 
            src="/images/empty_cafe_interior.png" 
            alt="Night Vibe" 
            className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 sepia-[.4] hue-rotate-[320deg]"
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.src = "/images/kopi-susu-karsa.png";
            }}
          />
          
          {/* Day Image (Top/Foreground) */}
          <img 
            src="/images/empty_cafe_interior.png" 
            alt="Day Vibe" 
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)` }}
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.src = "/images/kopi-susu-karsa.png";
            }}
          />

          {/* Range Slider */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0 p-0 before-after-slider" 
          />

          {/* Slider Handle */}
          <div 
            className="absolute inset-y-0 w-1 bg-white/80 pointer-events-none flex items-center justify-center z-10 transition-transform duration-75" 
            style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-white text-white font-bold text-xs neon-glow">
              &lt;&gt;
            </div>
          </div>
        </div>
        <div className="flex justify-between text-stone-400 text-xs uppercase tracking-widest mt-4 font-bold px-2">
          <span>Siang (Fokus Nugas)</span>
          <span>Malam (Chill & Nongkrong)</span>
        </div>
      </div>
    </section>
  );
}
