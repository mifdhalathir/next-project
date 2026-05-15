"use client";

import { useEffect, useState } from "react";
import MagneticWrapper from "./MagneticWrapper";

interface Star {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export default function Hero() {
  const [greeting, setGreeting] = useState("");
  const [isNight, setIsNight] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const setDynamicVibe = () => {
      const hour = new Date().getHours();
      const userName = localStorage.getItem("karsa_user_name") || "";
      const nameStr = userName ? `, ${userName}` : "";

      if (hour >= 6 && hour < 11) {
        setGreeting(`Selamat Pagi 🌅${nameStr}`);
        setIsNight(false);
      } else if (hour >= 18 || hour < 6) {
        setGreeting(`Selamat Malam 🌙${nameStr}`);
        setIsNight(true);
      } else {
        setGreeting(`Selamat Siang${nameStr} ☀️`);
        setIsNight(false);
      }
    };

    setDynamicVibe();
    const interval = setInterval(setDynamicVibe, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isNight) {
      const newStars = [...Array(50)].map((_, i) => ({
        id: i,
        width: Math.random() * 3 + 'px',
        height: Math.random() * 3 + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        delay: Math.random() * 5 + 's',
        duration: Math.random() * 3 + 2 + 's'
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStars(newStars);
    }
  }, [isNight]);

  return (
    <section id="home" className={`relative h-screen flex items-center justify-center ${isNight ? 'bg-wood-900' : ''}`}>
      {/* Background Image */}
      <img
        src="/images/empty_cafe_interior.png"
        alt="Karsa Cafe Background"
        className={`fixed inset-0 w-full h-full object-cover -z-10 transition-opacity duration-1000 ${isNight ? 'opacity-30' : 'opacity-100'}`}
      />
      <div className={`hero-overlay absolute inset-0 ${isNight ? 'bg-black/60' : ''}`}></div>
      
      {/* Starry Night Effect for Night Time */}
      {isNight && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {stars.map((star) => (
            <div 
              key={star.id} 
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: star.width,
                height: star.height,
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative text-center px-4 z-10" data-aos="fade-right" data-aos-duration="1000">
        <p className="text-amber-400 tracking-[.15em] text-sm mb-2 font-bold uppercase">
          {greeting}
        </p>
        <p
          className="text-amber-400/80 tracking-[.35em] text-xs mb-4 uppercase blur-reveal"
          style={{ animationDelay: "0.5s" }}
        >
          Est. 2024 &bull; Padang
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-tight mb-6 flex flex-col items-center">
          <span className="typewriter border-r-4 border-amber-400 overflow-hidden whitespace-nowrap inline-block">
            Ruang Inspirasi
          </span>
          <span
            className="blur-reveal block text-3xl sm:text-4xl mt-2 text-cream-200"
            style={{ animationDelay: "2s" }}
          >
            di Air Tawar
          </span>
        </h1>
        <p
          className="blur-reveal text-cream-200 text-lg md:text-xl max-w-xl mx-auto mb-8"
          style={{ animationDelay: "2.5s" }}
        >
          Tempat nugas, ngopi, dan diskusi paling nyaman untuk mahasiswa Air Tawar dan sekitarnya.
        </p>
        <MagneticWrapper>
          <button
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="blur-reveal inline-block bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full text-sm tracking-wider transition transform hover:scale-105"
            style={{ animationDelay: "3s" }}
          >
            Lihat Menu
          </button>
        </MagneticWrapper>
      </div>
    </section>
  );
}
