"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/components/CartProvider";

export default function DapurPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    const saved = localStorage.getItem("karsa_orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadOrders();
    // Listen for changes from other tabs
    window.addEventListener("storage", loadOrders);
    return () => window.removeEventListener("storage", loadOrders);
  }, []);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    // If completed, we might want to remove it or just mark it
    // The prompt says "tombol 'Selesai' untuk menghapus pesanan yang sudah diantar"
    let finalOrders = updated;
    if (newStatus === "completed") {
      finalOrders = orders.filter(order => order.id !== orderId);
    }

    setOrders(finalOrders);
    localStorage.setItem("karsa_orders", JSON.stringify(finalOrders));
    window.dispatchEvent(new Event("storage"));
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-white p-8 font-sans cursor-none overflow-x-hidden">
      {/* Custom White Cursor */}
      <div 
        className="fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          transform: `translate(-50%, -50%) scale(1)`,
          boxShadow: '0 0 15px rgba(255,255,255,0.5)'
        }}
      ></div>
      <div 
        className="fixed w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999]"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          transform: `translate(-50%, -50%)`
        }}
      ></div>

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tighter">Kitchen Monitor</h1>
            <p className="text-amber-500 text-xs uppercase tracking-[0.4em] mt-2 font-black">Karsa Kafe • Real-time Dashboard</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              <span className="block text-[10px] text-stone-500 uppercase tracking-widest mb-1">Pesanan Aktif</span>
              <span className="text-2xl font-black text-amber-500">{orders.length}</span>
            </div>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-5xl mb-6 opacity-20">🍳</div>
            <h2 className="text-xl font-bold text-stone-500">Belum ada pesanan masuk</h2>
            <p className="text-stone-600 text-sm mt-2">Dapur sedang santai. Tunggu pelanggan memesan!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.sort((a, b) => b.timestamp - a.timestamp).map((order) => (
              <div 
                key={order.id} 
                className="bg-stone-900 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:border-amber-500/30"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/2">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-600 text-[10px] font-black uppercase tracking-widest mb-2">
                      Meja {order.tableNumber}
                    </span>
                    <h3 className="font-black text-lg">{order.id}</h3>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="p-6 flex-1 space-y-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-amber-500 text-sm">
                          {item.qty}
                        </span>
                        <span className="text-sm font-bold text-stone-300">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-white/2 border-t border-white/5">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(order.id, "preparing")}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          order.status === "preparing" 
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40" 
                          : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                        }`}
                      >
                        Masak
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, "ready")}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          order.status === "ready" 
                          ? "bg-green-600 text-white shadow-lg shadow-green-900/40" 
                          : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                        }`}
                      >
                        Siap
                      </button>
                    </div>
                    <button 
                      onClick={() => updateStatus(order.id, "completed")}
                      className="w-full bg-white text-stone-950 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-200 transition-all shadow-xl"
                    >
                      Selesai & Antar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
