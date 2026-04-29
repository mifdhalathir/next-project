"use client";

import { useEffect, useState } from "react";
import { useCart, Order } from "./CartProvider";

export default function QueueTracker() {
  const { activeOrder } = useCart();
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const updateQueue = () => {
      const savedOrders = localStorage.getItem("karsa_orders");
      if (savedOrders) {
        const orders: Order[] = JSON.parse(savedOrders);
        
        // Count orders that are not yet ready or completed
        const activeOrders = orders.filter(o => 
          ["received", "preparing", "cooked"].includes(o.status)
        );

        if (activeOrder) {
          // Count how many orders were placed BEFORE the user's active order
          const beforeMe = activeOrders.filter(o => o.timestamp < activeOrder.timestamp);
          setQueueCount(beforeMe.length);
        } else {
          // If no active order, just show total queue
          setQueueCount(activeOrders.length);
        }
      }
    };

    updateQueue();
    const interval = setInterval(updateQueue, 5000); // Check every 5s
    window.addEventListener("storage", updateQueue);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateQueue);
    };
  }, [activeOrder]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-12" data-aos="fade-up">
      <div className="relative overflow-hidden bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10">
        {/* Animated Background Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/5 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Queue Number Circle */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-600/10 border-2 border-amber-600/20 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber-500/10 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full"></div>
              <span className="font-display text-4xl md:text-6xl font-black text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {queueCount}
              </span>
            </div>
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-2 border-dashed border-amber-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Live Kitchen Queue</h3>
            <p className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {queueCount > 0 ? (
                <>
                  Ada <span className="text-amber-500">{queueCount}</span> pesanan sebelum kamu. <br className="hidden md:block" />
                  <span className="text-stone-400 text-lg md:text-xl font-normal mt-2 block italic">Harap bersabar, barista kami sedang bekerja! ☕</span>
                </>
              ) : (
                <>
                  Antrean Kosong! <br className="hidden md:block" />
                  <span className="text-amber-500">Kopi kamu bakal jadi prioritas utama sekarang! ✨</span>
                </>
              )}
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1.5 h-6 bg-amber-500/20 rounded-full overflow-hidden">
                  <div className="w-full bg-amber-500 animate-[bounce_1.5s_infinite]" style={{ animationDelay: `${i * 0.2}s`, height: '40%' }}></div>
                </div>
              ))}
            </div>
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Real-time Tracker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
