"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return; // Disable on touch devices
    }
    
    setIsVisible(true);

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);

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
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor ${isHovering ? "cursor-hover" : ""} ${
        isClicking ? "cursor-click" : ""
      }`}
      style={{ left: position.x, top: position.y }}
    ></div>
  );
}
