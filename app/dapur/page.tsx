"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type OrderStatus } from "@/components/CartProvider";
import { addActivityLog } from "@/components/ActivityLog";
import { useKarsa } from "@/components/KarsaContext";

export default function DapurPage() {
  const router = useRouter();
  const { orders: firestoreOrders, updateOrderStatus: firestoreUpdateOrderStatus } = useKarsa();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Compute kitchen orders reactively from the Firestore order list
  const activeKitchenOrders = firestoreOrders
    .filter(p => p.status === "Pending" || p.status === "Diracik" || p.status === "Dikonfirmasi")
    .map(p => ({
        id: p.orderID,
        tableNumber: String(p.meja || "").replace(/[^\d]/g, ''),
        customerName: p.nama,
        items: p.items.map(it => ({ name: it.nama, price: it.harga, qty: it.qty })),
        total: p.totalHarga,
        status: (p.status === 'Pending' ? 'received' : (p.status === 'Diracik' ? 'preparing' : 'ready')) as OrderStatus,
        timestamp: p.id
    }));

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
    } catch (e) {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
    const timeInterval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setIsProcessing(orderId);
    const mappedStatus = newStatus === 'preparing' ? 'Diracik' : (newStatus === 'ready' ? 'Dikonfirmasi' : 'Pending');
    
    firestoreUpdateOrderStatus(orderId, mappedStatus)
      .catch(e => console.error("Firestore status update failed", e))
      .finally(() => setIsProcessing(null));
  };

  const toggleCheck = (orderId: string, itemName: string) => {
    const key = `${orderId}-${itemName}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col cursor-none">
      {/* Custom Cursor */}
      <div 
        className="fixed w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
      ></div>
      <div 
        className="fixed w-1 h-1 bg-cyan-500 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-cyan-500/20 px-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
             <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-cyan-400">KITCHEN<span className="text-white">_COMMAND</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">Operational Display System v4.2</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Queue</span>
            <span className="text-xl font-black text-white">{activeKitchenOrders.length} <span className="text-cyan-500 text-sm">ORDERS</span></span>
          </div>
          <div className="w-px h-10 bg-white/5"></div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300"
          >
            Terminal Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-hidden relative z-10 flex gap-8">
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {activeKitchenOrders.length > 0 ? activeKitchenOrders.map((order) => {
              const timeElapsed = Math.floor((currentTime - order.timestamp) / 60000);
              const isUrgent = timeElapsed > 15;
              return (
                <div key={order.id} className={`bg-slate-900/80 border rounded-[2rem] overflow-hidden transition-all duration-500 ${
                  isUrgent ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-slate-800 hover:border-cyan-500/30'
                } ${isProcessing === order.id ? 'scale-[0.98] opacity-50' : ''}`}>
                  <div className={`px-6 py-4 flex items-center justify-between ${
                    order.status === 'received' ? 'bg-cyan-500/10' : (order.status === 'preparing' ? 'bg-amber-500/10' : 'bg-green-500/10')
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5">
                        <span className="text-2xl font-black text-white">{order.tableNumber}</span>
                      </div>
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">{order.customerName}</h3>
                        <p className="text-[9px] font-bold text-slate-500">#{order.id}</p>
                      </div>
                    </div>
                    <p className={`text-[10px] font-black uppercase ${isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>{timeElapsed}m ELAPSED</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {order.items.map((it, idx) => {
                      const isChecked = checkedItems[`${order.id}-${it.name}`];
                      return (
                        <div key={idx} onClick={() => toggleCheck(order.id, it.name)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          isChecked ? 'bg-cyan-500/10 border-cyan-500/20 opacity-40' : 'bg-white/5 border-white/5'
                        }`}>
                          <div className="flex items-center gap-4">
                             <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${isChecked ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                               {isChecked && <span className="text-[10px] font-black text-black">✓</span>}
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>{it.qty}x {it.name}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => {
                        if (order.status === 'received') updateOrderStatus(order.id, 'preparing');
                        else if (order.status === 'preparing') updateOrderStatus(order.id, 'ready');
                      }}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                        order.status === 'received' ? 'bg-cyan-500 text-black' : (order.status === 'preparing' ? 'bg-amber-500 text-black' : 'bg-green-500 text-black')
                      }`}
                    >
                      {order.status === 'received' ? 'Start Cooking' : (order.status === 'preparing' ? 'Mark as Ready' : 'Order Ready')}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full h-96 flex flex-col items-center justify-center opacity-20">
                <p className="text-xl font-black uppercase tracking-[1em]">Station Idle</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 flex flex-col gap-6">
           <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-[2rem]">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-6">Status</h2>
              <div className="space-y-4">
                 <div className="flex justify-between"><span className="text-[10px] uppercase text-slate-500">System</span><span className="text-[10px] font-black text-green-500">OK</span></div>
                 <div className="flex justify-between"><span className="text-[10px] uppercase text-slate-500">Terminal</span><span className="text-[10px] font-black">NODE_01</span></div>
              </div>
           </div>
           <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-[2rem] text-center">
              <p className="text-[8px] font-black text-cyan-500 uppercase mb-1">Local Time</p>
              <p className="text-2xl font-black">{new Date(currentTime).toLocaleTimeString()}</p>
           </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
