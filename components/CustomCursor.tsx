"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the device has a coarse pointer (like touch screens)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    if (mediaQuery.matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Make kursor visible smoothly on client-side mounting
    cursor.style.opacity = "1";

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Optimasi Premium: Hanya update CSS variables secara lokal jika di atas .menu-card
      const target = e.target as HTMLElement;
      if (target) {
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

    // Use event delegation for hover states to perfectly support dynamic elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest(
        "a, button, input, select, textarea, .menu-card, .gallery-img, label"
      );
      if (isInteractive) {
        cursor.classList.add("cursor-hover");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest(
        "a, button, input, select, textarea, .menu-card, .gallery-img, label"
      );
      if (isInteractive) {
        cursor.classList.remove("cursor-hover");
      }
    };

    // Premium Easing Animation Loop (Lerp)
    const updatePosition = () => {
      // Easing factor ditingkatkan ke 0.3 untuk respon kursor yang instan & super snappy
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      cursorPos.current.x += dx * 0.3;
      cursorPos.current.y += dy * 0.3;

      // translate3d forces GPU hardware acceleration for maximum framerate
      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;

      rafIdRef.current = requestAnimationFrame(updatePosition);
    };

    // Start the animation frame loop
    rafIdRef.current = requestAnimationFrame(updatePosition);

    // Register event listeners
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    // Rigorous cleanup of listeners and RAF to prevent memory leaks
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
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
        opacity: 0, // Starts fully transparent, becomes visible on client-mount
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    ></div>
  );
}

