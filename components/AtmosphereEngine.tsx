"use client";

import React, { useEffect, useState } from "react";

interface ParticleData {
  id: number;
  left: string;
  top: string;
  duration: string;
  delay: string;
  lx?: string;
  lr?: string;
  dx?: string;
  dy?: string;
  emoji?: string;
}

export default function AtmosphereEngine() {
  const [area, setArea] = useState<string>("Indoor");
  const [mounted, setMounted] = useState(false);
  const [particleData, setParticleData] = useState<ParticleData[]>([]);

  useEffect(() => {
    const syncAtmosphere = () => {
      const storedArea = localStorage.getItem("karsa_area") || "Indoor";
      const storedStatus = localStorage.getItem("karsa_status");
      
      setArea(storedArea);
      const username = localStorage.getItem("karsa_user_name");
      const isVip = username && storedStatus === "reserved";

      document.body.classList.remove("theme-outdoor", "theme-reserved");
      if (isVip) {
        document.body.classList.add("theme-reserved");
      } else if (storedArea === "Outdoor") {
        document.body.classList.add("theme-outdoor");
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    syncAtmosphere();

    window.addEventListener("storage", syncAtmosphere);
    const handleAtmosphereChange = () => syncAtmosphere();
    window.addEventListener("karsa_atmosphere_update", handleAtmosphereChange);

    return () => {
      window.removeEventListener("storage", syncAtmosphere);
      window.removeEventListener("karsa_atmosphere_update", handleAtmosphereChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const newParticles: ParticleData[] = Array.from({ length: 15 }).map((_, i) => {
      if (area === "Outdoor") {
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          top: `-${Math.random() * 20 + 10}vh`,
          duration: `${Math.random() * 10 + 15}s`,
          delay: `${Math.random() * 10}s`,
          lx: `${(Math.random() - 0.5) * 300}px`,
          lr: `${(Math.random() - 0.5) * 720}deg`,
          emoji: ["🍂", "🍃", "🍁"][Math.floor(Math.random() * 3)]
        };
      } else {
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          duration: `${Math.random() * 20 + 20}s`,
          delay: `${Math.random() * 15}s`,
          dx: `${(Math.random() - 0.5) * 200}px`,
          dy: `${-(Math.random() * 300 + 200)}px`
        };
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticleData(newParticles);
  }, [area, mounted]);

  if (!mounted) return null;

  return (
    <div className="atmosphere-engine fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {particleData.map((p) => {
        if (area === "Outdoor") {
          return (
            <div
              key={`leaf-${p.id}`}
              className="leaf-particle"
              style={{
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay,
                ['--lx' as string]: p.lx,
                ['--lr' as string]: p.lr,
              }}
            >
              {p.emoji}
            </div>
          );
        } else {
          return (
            <div
              key={`dust-${p.id}`}
              className="dust-particle"
              style={{
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay,
                ['--dx' as string]: p.dx,
                ['--dy' as string]: p.dy,
              }}
            ></div>
          );
        }
      })}
    </div>
  );
}
