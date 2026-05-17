"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the device has a coarse pointer (like touch screens)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    if (mediaQuery.matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // On first movement, snap the cursor coordinates instantly and fade in
      // This prevents the cursor from starting or flashing in the top-left (0, 0)
      if (!hasMoved.current) {
        cursorPos.current.x = e.clientX;
        cursorPos.current.y = e.clientY;
        cursor.style.opacity = "1";
        hasMoved.current = true;
      } else if (cursor.style.opacity === "0") {
        cursor.style.opacity = "1";
      }

      const target = e.target as HTMLElement;
      if (target) {
        // Robust check for interactive elements to add hover state stability (no flicker!)
        const isInteractive = target.closest(
          "a, button, input, select, textarea, .menu-card, .gallery-img, label, [role='button']"
        );
        
        if (isInteractive) {
          cursor.classList.add("cursor-hover");
        } else {
          cursor.classList.remove("cursor-hover");
        }

        // Localized flashlight effect on .menu-card only
        const menuCard = target.closest(".menu-card") as HTMLElement;
        if (menuCard) {
          menuCard.style.setProperty("--cursor-x", `${e.clientX}px`);
          menuCard.style.setProperty("--cursor-y", `${e.clientY}px`);
        }
      }
    };

    const onMouseDown = () => {
      cursor.classList.add("cursor-click");
    };

    const onMouseUp = () => {
      cursor.classList.remove("cursor-click");
    };

    // Hide cursor when leaving browser viewport, show it back when entering
    const onMouseLeaveWindow = () => {
      cursor.style.opacity = "0";
    };

    const onMouseEnterWindow = () => {
      if (hasMoved.current) {
        cursor.style.opacity = "1";
      }
    };

    // Premium Snappy Easing Loop (Lerp)
    const updatePosition = () => {
      // Easing factor set to 0.35 for ultra-responsive, instant tracking
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      cursorPos.current.x += dx * 0.35;
      cursorPos.current.y += dy * 0.35;

      // translate3d forces GPU hardware acceleration for maximum frame-rate
      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;

      rafIdRef.current = requestAnimationFrame(updatePosition);
    };

    // Start the animation frame loop
    rafIdRef.current = requestAnimationFrame(updatePosition);

    // Register event listeners
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveWindow, { passive: true });
    document.addEventListener("mouseenter", onMouseEnterWindow, { passive: true });

    // Rigorous cleanup of listeners and RAF to prevent memory leaks
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0, // Hidden until first mousemove
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    ></div>
  );
}

