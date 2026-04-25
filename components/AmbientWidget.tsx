"use client";

import { useState, useRef } from "react";

export default function AmbientWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <div
        id="ambientWidget"
        data-aos="zoom-in"
        data-aos-delay="500"
        data-aos-offset="0"
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-[45] glass-form p-3 rounded-2xl flex items-center gap-3 shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
      >
        <button
          className="w-10 h-10 bg-amber-700 hover:bg-amber-800 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <span>{isPlaying ? "⏸" : "▶"}</span>
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-stone-800 dark:text-cream-100">Karsa Focus</span>
          <div className={`flex items-end gap-1 h-4 mt-1 ${isPlaying ? "visualizer-active" : ""}`}>
            <div className="bar w-1 bg-amber-500 rounded-t-sm h-1"></div>
            <div className="bar w-1 bg-amber-500 rounded-t-sm h-1"></div>
            <div className="bar w-1 bg-amber-500 rounded-t-sm h-1"></div>
            <div className="bar w-1 bg-amber-500 rounded-t-sm h-1"></div>
          </div>
        </div>
        <audio ref={audioRef} loop>
          <source
            src="https://cdn.pixabay.com/download/audio/2022/02/07/audio_1ab70d740a.mp3?filename=cafe-background-noise-100414.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>

      {/* Floating Socials Sidebar */}
      <div
        id="floatingSocials"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3 p-3 glass-form rounded-r-2xl transform transition-all duration-500 ${
          isPlaying ? "translate-x-[-150%] opacity-0" : ""
        }`}
      >
        <a href="#" className="group flex items-center gap-3 text-white hover:text-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">IG</div>
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold">
            @karsacafe
          </span>
        </a>
        <a href="#" className="group flex items-center gap-3 text-white hover:text-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">TK</div>
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold">
            @karsacafe
          </span>
        </a>
        <a href="#" className="group flex items-center gap-3 text-white hover:text-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">WA</div>
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold">
            Hubungi
          </span>
        </a>
      </div>
    </>
  );
}
