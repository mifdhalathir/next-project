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
      // Filter only for Kitchen (received or preparing)
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
    <div className="min-h-screen bg-[#060606] text-white p-6 font-sans cursor-none flex flex-col">
      {/* Custom White Cursor */}
      <div 
        className="fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)`, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}
      ></div>

      <header className="flex justify-between items-end mb-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="font-display text-5xl font-black tracking-tighter italic">KARSA <span className="text-amber-500">DAPUR</span></h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.6em] mt-2 font-black">Kitchen Production System • Monitor Masak</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-stone-900/50 px-8 py-4 rounded-3xl border border-white/5 text-center min-w-[150px]">
            <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Harus Dimasak</span>
            <span className="text-3xl font-black text-white">{orders.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {orders.length === 0 ? (
          <div className="py-40 text-center opacity-20 border border-dashed border-white/10 rounded-[3rem] font-black uppercase text-xl tracking-widest italic">
            Semua Pesanan Sudah Dimasak 🔥
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.sort((a, b) => a.timestamp - b.timestamp).map((order) => {
              const waitTime = Math.floor((Date.now() - order.timestamp) / 60000);
              const isLate = waitTime >= 10 && order.status === "received";

              return (
                <div 
                  key={order.id} 
                  className={`glass-card rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 transition-all duration-700 animate-in zoom-in-95 ${isLate ? 'border-red-500/50' : 'hover:border-amber-500/30'}`}
                >
                  <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isLate ? 'bg-red-500/10' : 'bg-white/2'}`}>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-amber-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2 inline-block">Meja {order.tableNumber}</span>
                      <h3 className="font-black text-xl tracking-tighter">{order.id}</h3>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black font-mono ${isLate ? 'text-red-500 animate-pulse' : 'text-stone-400'}`}>{waitTime}M AGO</p>
                    </div>
                  </div>

                  <div className="p-6 flex-1 space-y-5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{getCategoryIcon(item.name)}</span>
                          <div>
                            <span className="text-sm font-black text-white group-hover:text-amber-500 transition-colors">{item.name}</span>
                            <p className="text-[10px] text-stone-500 font-bold">Jumlah: {item.qty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-stone-900/50 border-t border-white/5">
                    {order.status === "received" ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "preparing")} 
                        className="w-full bg-amber-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/40"
                      >
                        Mulai Masak 👨‍🍳
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "cooked")} 
                        className="w-full bg-green-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-green-500 transition-all shadow-xl shadow-green-900/40 animate-pulse"
                      >
                        Selesai Masak & Kirim ke Kasir ✅
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
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
