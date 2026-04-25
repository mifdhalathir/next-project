"use client";

import { useState, useEffect, useRef } from "react";

export type KarsaNotification = {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: number;
};

export default function NotificationHub() {
  const [notifications, setNotifications] = useState<KarsaNotification[]>([]);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const loadNotifications = () => {
    const saved = localStorage.getItem("karsa_notifications");
    if (saved) {
      const parsed: KarsaNotification[] = JSON.parse(saved);
      const now = Date.now();
      // Only show notifications from the last 1 minute for a clean chat feel
      const recent = parsed.filter(n => now - n.timestamp < 60000);
      setNotifications(recent.sort((a, b) => b.timestamp - a.timestamp));

      // Check for specialized "Call" alert for THIS specific user
      const currentUserName = localStorage.getItem("karsa_user_name");
      const lastCall = recent.find(n => n.type === "alert" && n.message.includes(currentUserName || "___"));
      if (lastCall && (!activeAlert || activeAlert !== lastCall.id)) {
         setActiveAlert(lastCall.id);
      }
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("storage", loadNotifications);
    const interval = setInterval(loadNotifications, 2000);
    return () => {
      window.removeEventListener("storage", loadNotifications);
      clearInterval(interval);
    };
  }, [activeAlert]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeAlert === id) setActiveAlert(null);
  };

  return (
    <>
      {/* Floating Notification Center */}
      <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-3 w-72 pointer-events-none">
        {notifications.slice(0, 5).map((n) => (
          <div 
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-500 animate-in slide-in-from-right fade-in ${
              n.type === 'alert' ? 'bg-red-500/90 border-white text-white scale-105' :
              n.type === 'success' ? 'bg-green-600/90 border-white/20 text-white' :
              'bg-amber-500/90 border-white/20 text-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-black leading-tight uppercase tracking-tight">{n.message}</p>
              <button onClick={() => removeNotification(n.id)} className="text-white/50 hover:text-white">&times;</button>
            </div>
            <span className="text-[8px] font-bold opacity-50 block mt-1">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        ))}
      </div>

      {/* Full Screen Ready Modal for Customer */}
      {activeAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
           <div className="absolute inset-0 bg-amber-600/20 backdrop-blur-3xl"></div>
           <div className="relative bg-white text-stone-900 p-10 rounded-[3rem] shadow-2xl text-center max-w-sm border-4 border-amber-500 animate-bounce-short">
              <div className="text-6xl mb-6">🔔</div>
              <h2 className="font-display text-3xl font-black mb-2 tracking-tighter italic">PESANAN READY!</h2>
              <p className="text-sm font-bold opacity-70 mb-8">Halo! Pesananmu sudah siap di meja/konter. Silakan dinikmati! ✨</p>
              <button 
                onClick={() => setActiveAlert(null)}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                OKE, SIAP!
              </button>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-short { animation: bounce-short 2s infinite ease-in-out; }
      `}</style>
    </>
  );
}

// Helper to add notifications from anywhere
export const addKarsaNotification = (message: string, type: KarsaNotification["type"] = "info") => {
  const saved = localStorage.getItem("karsa_notifications");
  const parsed = saved ? JSON.parse(saved) : [];
  const newNotif: KarsaNotification = {
    id: `NOTIF-${Date.now()}`,
    message,
    type,
    timestamp: Date.now()
  };
  localStorage.setItem("karsa_notifications", JSON.stringify([...parsed, newNotif]));
  window.dispatchEvent(new Event("storage"));
};
