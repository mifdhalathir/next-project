"use client";

import { useState, useEffect } from "react";

export const playSound = (type: 'click' | 'success') => {
  if (typeof window === 'undefined') return;
  const soundEnabled = localStorage.getItem('karsa_sound_enabled') !== 'false';
  if (!soundEnabled) return;

  try {
    const audio = new Audio();
    if (type === 'click') {
      // Mechanical keyboard click
      audio.src = 'https://actions.google.com/sounds/v1/water/keyboard_typing_slow.ogg';
      audio.volume = 0.2;
    } else if (type === 'success') {
      // Lo-fi bell
      audio.src = 'https://actions.google.com/sounds/v1/alarms/dinner_bell_triangle.ogg';
      audio.volume = 0.4;
    }
    audio.play().catch(e => console.log('Audio blocked:', e));
    
    if (window.navigator.vibrate) {
      if (type === 'click') window.navigator.vibrate(10);
      else if (type === 'success') window.navigator.vibrate([30, 50, 30]);
    }
  } catch (err) {
    console.error(err);
  }
};

export default function AudioWidget() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('karsa_sound_enabled');
    if (stored === 'false') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabled(false);
    }
  }, []);

  const toggleSound = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    localStorage.setItem('karsa_sound_enabled', String(newVal));
    if (newVal) playSound('click');
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform hover:bg-amber-600 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
      title="Toggle Sound"
    >
      <span className="text-xl">{enabled ? '🔊' : '🔇'}</span>
    </button>
  );
}
