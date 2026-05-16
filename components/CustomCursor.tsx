"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return; 
    }
    if (typeof window === 'undefined') return;
    
    setIsVisible(true);

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // We only request a frame if we aren't already updating it
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
      
      // Set CSS variables for flashlight effect
      document.documentElement.style.setProperty('--cursor-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${mouseY}px`);
    };

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      rafId = 0;
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mousedown", down, { passive: true });
    document.addEventListener("mouseup", up, { passive: true });

    const interactables = document.querySelectorAll(
      "a, button, input, select, textarea, .menu-card, .gallery-img, label"
    );

    const hoverOn = () => setIsHovering(true);
    const hoverOff = () => setIsHovering(false);

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", hoverOn);
      el.addEventListener("mouseleave", hoverOff);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", hoverOn);
        el.removeEventListener("mouseleave", hoverOff);
      });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? "cursor-hover" : ""} ${
        isClicking ? "cursor-click" : ""
      }`}
      style={{ left: 0, top: 0, willChange: "transform" }}
    ></div>
  );
}
