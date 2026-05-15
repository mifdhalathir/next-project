"use client";

import { useEffect, useState } from "react";

export default function AtmosphereEngine() {
  const [area, setArea] = useState<string>("Indoor");
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncAtmosphere = () => {
      const storedArea = localStorage.getItem("karsa_area") || "Indoor";
      const storedStatus = localStorage.getItem("karsa_status"); // For reservation check later
      
      setArea(storedArea);
      // Determine if user is VIP / reserved (mock logic for now, adjust based on actual login data)
      const username = localStorage.getItem("karsa_user_name");
      const isVip = username && storedStatus === "reserved";
      setIsReserved(!!isVip);

      // Apply classes to body
      document.body.classList.remove("theme-outdoor", "theme-reserved");
      if (isVip) {
        document.body.classList.add("theme-reserved");
      } else if (storedArea === "Outdoor") {
        document.body.classList.add("theme-outdoor");
      }
    };

    // Initial sync
    setMounted(true);
    syncAtmosphere();

    // Listen for changes
    window.addEventListener("storage", syncAtmosphere);
    
    // Custom event for internal state changes not caught by 'storage' event
    const handleAtmosphereChange = () => syncAtmosphere();
    window.addEventListener("karsa_atmosphere_update", handleAtmosphereChange);

    return () => {
      window.removeEventListener("storage", syncAtmosphere);
      window.removeEventListener("karsa_atmosphere_update", handleAtmosphereChange);
    };
  }, []);

  // Generate random particles
  if (!mounted) return null;

  const particles = Array.from({ length: 15 }).map((_, i) => {
    if (area === "Outdoor") {
      // Leaves
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
      // Dust
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

  return (
    <div className="atmo-particles">
      {particles}
    </div>
  );
}
