"use client";

import { useRef, useState, useEffect } from "react";

interface MagneticWrapperProps {
  children: React.ReactNode;
  distance?: number;
  strength?: number;
}

export default function MagneticWrapper({ 
  children, 
  distance = 50, 
  strength = 0.5 
}: MagneticWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < distance) {
        // Move towards cursor
        setPosition({ 
          x: deltaX * strength, 
          y: deltaY * strength 
        });
      } else {
        // Reset position
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [distance, strength]);

  return (
    <div 
      ref={wrapperRef}
      className="magnetic-wrap"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </div>
  );
}
