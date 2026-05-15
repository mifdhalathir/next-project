"use client";

import React, { useEffect, useState } from "react";

export default function AtmosphereEngine() {
  const [area, setArea] = useState<string>("Indoor");
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const syncAtmosphere = () => {
      const storedArea = localStorage.getItem("karsa_area") || "Indoor";
      const storedStatus = localStorage.getItem("karsa_status");
      
      setArea(storedArea);
      const username = localStorage.getItem("karsa_user_name");
      const isVip = username && storedStatus === "reserved";
      setIsReserved(!!isVip);

      document.body.classList.remove("theme-outdoor", "theme-reserved");
      if (isVip) {
        document.body.classList.add("theme-reserved");
      } else if (storedArea === "Outdoor") {
        document.body.classList.add("theme-outdoor");
      }
    };

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
    
    const newParticles = Array.from({ length: 15 }).map((_, i) => {
      if (area === "Outdoor") {
        return (
          <div
            key={`leaf-${i}`}
            className="leaf-particle"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `-${Math.random() * 20 + 10}vh`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 10}s`,
              ['--lx' as string]: `${(Math.random() - 0.5) * 300}px`,
              ['--lr' as string]: `${(Math.random() - 0.5) * 720}deg`,
            }}
          >
            {["🍂", "🍃", "🍁"][Math.floor(Math.random() * 3)]}
          </div>
        );
      } else {
        return (
          <div
            key={`dust-${i}`}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDuration: `${Math.random() * 20 + 20}s`,
              animationDelay: `${Math.random() * 15}s`,
              ['--dx' as string]: `${(Math.random() - 0.5) * 200}px`,
              ['--dy' as string]: `${-(Math.random() * 300 + 200)}px`,
            }}
          ></div>
        );
      }
    });
    
    setParticles(newParticles);
  }, [area, mounted]);

  if (!mounted) return null;

  return (
    <div className="atmo-particles">
      {particles}
    </div>
  );
}
