"use client";

import { useEffect, useState, useRef } from "react";
import { Order, OrderStatus } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";

export default function DapurPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const loadData = () => {
    const savedOrders = localStorage.getItem("karsa_orders");
    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);
      const kitchenOrders = parsedOrders.filter(o => o.status === "received" || o.status === "preparing");
      setOrders(kitchenOrders);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
    const interval = setInterval(loadData, 2000);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
      clearInterval(interval);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const savedOrders = localStorage.getItem("karsa_orders");
    if (savedOrders) {
      const allOrders: Order[] = JSON.parse(savedOrders);
      const updated = allOrders.map(order => {
        if (order.id === orderId) {
          if (newStatus === "preparing") {
            addKarsaNotification(`Pesanan ${order.customerName} (Meja ${order.tableNumber}) sedang diproses`, "info");
          } else if (newStatus === "cooked") {
            addKarsaNotification(`Pesanan ${order.customerName} (Meja ${order.tableNumber}) SELESAI dimasak`, "success");
          }
          return { ...order, status: newStatus };
        }
        return order;
      });
      localStorage.setItem("karsa_orders", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      loadData();
    }
  };

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("kopi") || n.includes("espresso") || n.includes("latte") || n.includes("americano")) return "☕";
    if (n.includes("cake") || n.includes("brownies") || n.includes("donat") || n.includes("waffle")) return "🍰";
    if (n.includes("teh") || n.includes("lemon") || n.includes("milo") || n.includes("matcha")) return "🍵";
    if (n.includes("kentang") || n.includes("nugget") || n.includes("cireng")) return "🍟";
    return "🍽️";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans cursor-none flex flex-col relative overflow-hidden selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Custom White Cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-white rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-difference"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)`, boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}
      ></div>
      <div 
        className="fixed w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)` }}
      ></div>

      <header className="grid grid-cols-12 gap-6 mb-8 relative z-10">
        <div className="col-span-12 lg:col-span-8 glass-card p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-black tracking-tighter">KARSA <span className="text-amber-500 uppercase italic">Dapur</span></h1>
              <p className="text-stone-500 text-[9px] uppercase tracking-[0.5em] font-bold">Kitchen Production Monitor • Real-time Sync</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Harus Dimasak</span>
          <span className="text-5xl font-black text-white tracking-tighter">{orders.length}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 border border-dashed border-white/10 rounded-[4rem]">
            <div className="text-8xl mb-6">🔥</div>
            <p className="font-black uppercase text-xl tracking-[0.4em] text-center italic">Semua Pesanan Sudah Dimasak</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {[...orders].sort((a, b) => a.timestamp - b.timestamp).map((order) => {
              const waitTime = Math.floor((Date.now() - order.timestamp) / 60000);
              const isLate = waitTime >= 10 && order.status === "received";
              const heatLevel = Math.min(waitTime * 10, 100);

              return (
                <div 
                  key={order.id} 
                  className={`glass-card rounded-[2.5rem] overflow-hidden flex flex-col border transition-all duration-700 animate-in zoom-in-95 hover:translate-y-[-8px] ${isLate ? 'border-red-500/40 shadow-[0_20px_50px_rgba(239,68,68,0.2)]' : 'border-white/5 shadow-2xl shadow-black/60 hover:border-amber-500/30'}`}
                  style={{
                    boxShadow: isLate ? `0 0 ${heatLevel}px rgba(239,68,68,0.15)` : ''
                  }}
                >
                  <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isLate ? 'bg-red-500/10' : 'bg-white/[0.02]'}`}>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Meja {order.tableNumber}</span>
                      <h3 className="font-black text-2xl tracking-tighter leading-none mt-1">{order.id}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLate ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-stone-400 border-white/5'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isLate ? 'animate-spin' : ''}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="text-[10px] font-black font-mono">{waitTime}M</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{getCategoryIcon(item.name)}</span>
                          <div>
                            <span className="text-sm font-black text-white group-hover:text-amber-500 transition-colors block leading-tight">{item.name}</span>
                            <p className="text-[10px] text-stone-500 font-bold mt-1">QTY: {item.qty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-white/[0.01] border-t border-white/5">
                    {order.status === "received" ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "preparing")} 
                        className="w-full bg-amber-500 text-black py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-[0.98]"
                      >
                        Mulai Masak 👨‍🍳
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "cooked")} 
                        className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-green-500 transition-all shadow-[0_10px_30px_rgba(22,163,74,0.3)] animate-pulse active:scale-[0.98]"
                      >
                        Selesai & Kirim ✅
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx global>{`
        .glass-card { 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(32px); 
          -webkit-backdrop-filter: blur(32px); 
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.1); }
        }
        .animate-pulse { animation: pulse 10s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
