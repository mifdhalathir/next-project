"use client";

import { useEffect, useState, useRef } from "react";
import { Order, OrderStatus, Reservation } from "@/components/CartProvider";

export default function CommandCenterPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadData = () => {
    const savedOrders = localStorage.getItem("karsa_orders");
    const savedRes = localStorage.getItem("karsa_reservations");
    
    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);
      setOrders(parsedOrders);
      
      // Check for new orders to play sound
      setLastOrderCount(prev => {
        if (parsedOrders.length > prev) {
          audioRef.current?.play().catch(() => {});
        }
        return parsedOrders.length;
      });
    } else {
      setOrders([]);
      setLastOrderCount(0);
    }

    if (savedRes) {
      setReservations(JSON.parse(savedRes));
    } else {
      setReservations([]);
    }
  };

  useEffect(() => {
    // Setup Audio
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    
    loadData();
    
    const handleStorage = () => loadData();
    window.addEventListener("storage", handleStorage);
    
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    
    const interval = setInterval(loadData, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    let finalOrders = updated;
    if (newStatus === "completed") {
      // Move to history/revenue logic could go here if needed
      finalOrders = orders.filter(order => order.id !== orderId);
      
      // Track total revenue in localStorage
      const completedOrder = orders.find(o => o.id === orderId);
      if (completedOrder) {
        const totalRevenue = Number(localStorage.getItem("karsa_revenue") || 0);
        localStorage.setItem("karsa_revenue", (totalRevenue + completedOrder.total).toString());
      }
    }
    setOrders(finalOrders);
    localStorage.setItem("karsa_orders", JSON.stringify(finalOrders));
    window.dispatchEvent(new Event("storage"));
  };

  const updateReservation = (id: string, status: "arrived" | "cancelled") => {
    const updated = reservations.map(r => r.id === id ? { ...r, status } : r);
    setReservations(updated);
    localStorage.setItem("karsa_reservations", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const totalRevenue = Number(typeof window !== "undefined" ? localStorage.getItem("karsa_revenue") || 0 : 0);
  
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("kopi") || n.includes("espresso") || n.includes("latte") || n.includes("americano")) return "☕";
    if (n.includes("cake") || n.includes("brownies") || n.includes("donat") || n.includes("waffle")) return "🍰";
    if (n.includes("teh") || n.includes("lemon") || n.includes("milo") || n.includes("matcha")) return "🍵";
    if (n.includes("kentang") || n.includes("nugget") || n.includes("cireng")) return "🍟";
    return "🍽️";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans cursor-none overflow-hidden flex flex-col">
      {/* Custom White Cursor */}
      <div 
        className="fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)`, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}
      ></div>

      <header className="flex justify-between items-end mb-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="font-display text-5xl font-black tracking-tighter italic">KARSA <span className="text-amber-500">kafe </span></h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.6em] mt-2 font-black">Elite Dashboard • Kasir & Dapur System</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <span className="block text-[10px] text-stone-500 uppercase tracking-widest font-black">Revenue Hari Ini</span>
            <span className="text-3xl font-black text-amber-500 tracking-tighter">Rp {totalRevenue.toLocaleString("id-ID")}</span>
          </div>
          <div className="h-12 w-px bg-white/10 mx-2"></div>
          <div className="flex gap-4">
            <div className="bg-stone-900/50 px-6 py-3 rounded-2xl border border-white/5 text-center min-w-[120px]">
              <span className="block text-[9px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Antrean</span>
              <span className="text-2xl font-black text-white">{orders.length}</span>
            </div>
            <div className="bg-stone-900/50 px-6 py-3 rounded-2xl border border-white/5 text-center min-w-[120px]">
              <span className="block text-[9px] text-stone-500 uppercase tracking-widest mb-1 font-bold">Reservasi</span>
              <span className="text-2xl font-black text-amber-500">{reservations.filter(r => r.status === "pending").length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {/* Reservation Column */}
        <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Daftar Reservasi</h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {reservations.length === 0 ? (
              <div className="py-20 text-center opacity-20 border border-dashed border-white/10 rounded-3xl font-black uppercase text-xs tracking-widest">Kosong</div>
            ) : (
              reservations.sort((a, b) => b.timestamp - a.timestamp).map((res) => (
                <div key={res.id} className={`glass-card p-6 rounded-3xl border border-white/5 transition-all duration-500 ${res.status === 'arrived' ? 'opacity-40 grayscale' : 'hover:border-amber-500/30'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-amber-500 font-black text-lg tracking-tighter">{res.name}</span>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-stone-500 font-mono">{res.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[9px] text-stone-500 uppercase font-black tracking-widest">Waktu</p>
                      <p className="text-xs font-bold text-white">{res.time}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-stone-500 uppercase font-black tracking-widest">Tamu</p>
                      <p className="text-xs font-bold text-white">{res.guests} Orang</p>
                    </div>
                  </div>
                  {res.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateReservation(res.id, "arrived")} className="flex-1 bg-amber-600 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-amber-500 transition-all">Check-in</button>
                      <button onClick={() => updateReservation(res.id, "cancelled")} className="px-4 bg-white/5 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-red-900/20 transition-all border border-white/5">Batal</button>
                    </div>
                  )}
                  {res.status === "arrived" && (
                    <div className="text-center py-2 border border-green-500/20 bg-green-500/5 rounded-xl">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Pelanggan Tiba ✅</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Pesanan Menu Aktif</h2>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {orders.length === 0 ? (
              <div className="col-span-2 py-40 text-center opacity-20 border border-dashed border-white/10 rounded-[3rem] font-black uppercase text-sm tracking-widest">Menunggu Pesanan...</div>
            ) : (
              orders.sort((a, b) => b.timestamp - a.timestamp).map((order) => {
                const waitTime = Math.floor((Date.now() - order.timestamp) / 60000);
                const isLate = waitTime >= 10 && order.status === "received";

                return (
                  <div 
                    key={order.id} 
                    className={`glass-card rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 ${isLate ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'hover:border-amber-500/30'}`}
                  >
                    <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isLate ? 'bg-red-500/10' : 'bg-white/2'}`}>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-amber-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2 inline-block">Meja {order.tableNumber}</span>
                        <h3 className="font-black text-xl tracking-tighter">{order.id}</h3>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black font-mono ${isLate ? 'text-red-500 animate-pulse' : 'text-stone-400'}`}>
                          {waitTime} MIN AGO
                        </p>
                        <p className="text-[9px] text-stone-600 uppercase font-black">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <div className="p-6 flex-1 space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">{getCategoryIcon(item.name)}</span>
                            <div>
                              <span className="text-xs font-black text-white group-hover:text-amber-500 transition-colors">{item.name}</span>
                              <p className="text-[10px] text-stone-500 font-bold">Qty: {item.qty}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-stone-900/50 border-t border-white/5 backdrop-blur-xl">
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <button onClick={() => updateOrderStatus(order.id, "preparing")} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === "preparing" ? "bg-amber-600 text-white shadow-xl shadow-amber-900/40" : "bg-white/5 text-stone-500 hover:bg-white/10"}`}>Masak</button>
                          <button onClick={() => updateOrderStatus(order.id, "ready")} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === "ready" ? "bg-green-600 text-white shadow-xl shadow-green-900/40" : "bg-white/5 text-stone-500 hover:bg-white/10"}`}>Siap</button>
                        </div>
                        <button onClick={() => updateOrderStatus(order.id, "completed")} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-200 transition-all shadow-2xl">Selesaikan Order</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.5); }
      `}</style>
    </div>
  );
}
