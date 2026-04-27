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

      {/* Floating Music Visualizer Sync: Ambient Glow Line */}

      <div 
        className={`fixed bottom-0 left-0 w-full z-[100] pointer-events-none transition-all duration-1000 ${
          isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        <div className="ambient-glow-line bg-amber-500 w-full shadow-[0_0_20px_#f59e0b]"></div>
      </div>
    </>
  );
}
