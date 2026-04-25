"use client";

import { useEffect, useState, useRef } from "react";
import { Order, OrderStatus, Reservation } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem("karsa_orders");
      const savedRes = localStorage.getItem("karsa_reservations");
      
      if (savedOrders) {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        const kasirOrders = parsedOrders.filter(o => o.status === "cooked" || o.status === "ready");
        setOrders(kasirOrders);
      }

      if (savedRes) {
        let parsedRes: Reservation[] = JSON.parse(savedRes);
        if (parsedRes.length > 30) {
          parsedRes = parsedRes.slice(-30);
          localStorage.setItem("karsa_reservations", JSON.stringify(parsedRes));
        }
        setReservations(parsedRes);
      }
    } catch (e) {
      console.error("Data sync error:", e);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "karsa_orders" || e.key === "karsa_reservations" || e.key === "karsa_notifications") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
    const interval = setInterval(loadData, 3000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
      clearInterval(interval);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const savedOrders = localStorage.getItem("karsa_orders");
      if (savedOrders) {
        const allOrders: Order[] = JSON.parse(savedOrders);
        const updated = allOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );

        let finalOrders = updated;
        if (newStatus === "completed") {
          finalOrders = updated.filter(order => order.id !== orderId);
          const completedOrder = allOrders.find(o => o.id === orderId);
          if (completedOrder) {
            const totalRevenue = Number(localStorage.getItem("karsa_revenue") || 0);
            localStorage.setItem("karsa_revenue", (totalRevenue + completedOrder.total).toString());
          }
        }

        localStorage.setItem("karsa_orders", JSON.stringify(finalOrders));
        window.dispatchEvent(new Event("storage"));
        loadData();
      }
    } finally {
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const updateReservation = (id: string, status: "arrived" | "cancelled") => {
    const updated = reservations.map(r => r.id === id ? { ...r, status } : r);
    setReservations(updated);
    localStorage.setItem("karsa_reservations", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const deleteReservation = (id: string) => {
    if (!confirm("Hapus permanen data reservasi ini?")) return;
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem("karsa_reservations", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const totalRevenue = Number(typeof window !== "undefined" ? localStorage.getItem("karsa_revenue") || 0 : 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans cursor-none flex flex-col relative overflow-hidden selection:bg-amber-500/30">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

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
        <div className="col-span-12 lg:col-span-6 glass-card p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h1 className="font-display text-4xl font-black tracking-tighter">KARSA <span className="text-amber-500">KASIR</span></h1>
          </div>
          <p className="text-stone-500 text-[9px] uppercase tracking-[0.5em] font-bold">POS & Reservation Management System</p>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-black block mb-1">Revenue Hari Ini</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500 tracking-tighter">Rp {totalRevenue.toLocaleString("id-ID")}</span>
            <span className="text-xs text-green-500 font-bold tracking-tight">+12.5%</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-2 glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col justify-between items-center text-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-black block mb-1">Siap Antar</span>
          <span className="text-4xl font-black text-white">{orders.length}</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-8 overflow-hidden relative z-10">
        {/* Reservation Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Antrean Reservasi</h2>
            </div>
            <span className="text-[10px] font-bold text-stone-600">{reservations.length} TOTAL</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {reservations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 rounded-[2rem] py-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <p className="font-black uppercase text-[10px] tracking-widest text-center px-8">Belum ada reservasi masuk</p>
              </div>
            ) : (
              [...reservations].sort((a, b) => b.timestamp - a.timestamp).map((res) => (
                <div key={res.id} className={`glass-card p-6 rounded-[1.8rem] border border-white/5 transition-all duration-500 relative overflow-hidden group ${res.status === 'arrived' ? 'opacity-40 grayscale border-green-500/10' : 'hover:border-amber-500/30 shadow-xl shadow-black/40'}`}>
                  {/* Status Gradient Bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${res.status === 'pending' ? 'bg-amber-500' : 'bg-green-500'}`}></div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-black text-xl tracking-tight leading-tight">{res.name}</h4>
                      <p className="text-[9px] text-stone-500 uppercase font-bold tracking-widest mt-1">ID: {res.id}</p>
                    </div>
                    <button 
                      onClick={() => deleteReservation(res.id)}
                      className="text-stone-700 hover:text-red-500 transition-all p-2 bg-white/5 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <span className="text-xs font-bold text-stone-300">{res.time}</span>
                    </div>
                  </div>

                  {res.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateReservation(res.id, "arrived")} className="flex-1 bg-amber-500 text-black text-[10px] font-black uppercase py-3.5 rounded-xl hover:bg-white transition-all shadow-lg shadow-amber-500/20 active:scale-95">Check-in</button>
                      <button onClick={() => updateReservation(res.id, "cancelled")} className="px-4 bg-white/5 text-[10px] font-black uppercase py-3.5 rounded-xl hover:bg-red-500/10 transition-all border border-white/5 text-stone-500 active:scale-95">Batal</button>
                    </div>
                  )}
                  
                  {res.status === "arrived" && (
                    <div className="flex items-center justify-center gap-2 py-3 border border-green-500/20 bg-green-500/5 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Pelanggan Tiba</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready to Serve Orders */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Pesanan Siap Saji</h2>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar content-start">
            {orders.length === 0 ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 rounded-[3rem] py-24">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                </div>
                <p className="font-black uppercase text-xs tracking-[0.4em] text-center italic">Menunggu Dapur Selesai Masak...</p>
              </div>
            ) : (
              [...orders].sort((a, b) => b.timestamp - a.timestamp).map((order) => (
                <div key={order.id} className="glass-card rounded-[2.2rem] overflow-hidden flex flex-col border border-white/5 transition-all hover:border-green-500/30 hover:translate-y-[-4px] shadow-2xl shadow-black/40">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Meja {order.tableNumber}</span>
                      <h3 className="font-black text-2xl tracking-tighter text-white">{order.id}</h3>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                  </div>

                  <div className="p-6 flex-1 space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="font-bold text-sm text-stone-200">{item.name}</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-black text-amber-500">x{item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    {order.status === "cooked" ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "ready")} 
                        className="w-full bg-green-600 text-white py-4.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-500 transition-all shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)] active:scale-[0.98]"
                      >
                        Terima & Siapkan 🛎️
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            const name = order.customerName || `Pelanggan Meja ${order.tableNumber}`;
                            addKarsaNotification(`Halo ${name}, pesananmu sudah ready di meja/konter!`, "alert");
                          }} 
                          className="flex-1 bg-amber-500 text-black py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-[0.97]"
                        >
                          Panggil 📣
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, "completed")} 
                          className="flex-1 bg-white text-black py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition-all shadow-lg active:scale-[0.97]"
                        >
                          Lunas 💰
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .glass-card { 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(24px); 
          -webkit-backdrop-filter: blur(24px); 
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse { animation: pulse 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
