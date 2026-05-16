"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";

export default function DapurPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [currentTime, setCurrentTime] = useState(0);

  interface RawOrder {
    orderID: string;
    meja: string;
    nama: string;
    items: { nama: string; harga: number; qty: number }[];
    totalHarga: number;
    status: string;
    id: number;
  }

  const playDing = () => {
    try {
      // Placeholder ding sound
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play prevented by browser", e));
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = () => {
    const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
    if (savedOrders) {
      try {
        const parsedOrders: RawOrder[] = JSON.parse(savedOrders);
        const kitchenOrders: Order[] = parsedOrders
          .filter(p => p.status === "Pending" || p.status === "Preparing" || p.status === "Diracik")
          .map(p => ({
              id: p.orderID,
              tableNumber: String(p.meja || "").replace(/[^\d]/g, ''),
              customerName: p.nama,
              items: p.items.map(it => ({ name: it.nama, price: it.harga, qty: it.qty })),
              total: p.totalHarga,
              status: (p.status === 'Pending' ? 'received' : 'preparing') as OrderStatus,
              timestamp: p.id
          }));
        
        setOrders(prev => {
          // Play ding if there are new pending orders
          const newPending = kitchenOrders.filter(o => o.status === 'received').length;
          const oldPending = prev.filter(o => o.status === 'received').length;
          if (newPending > oldPending) {
              playDing();
          }
          return kitchenOrders;
        });
      } catch (e) {
        console.error("Failed to parse PESANAN_HARI_INI in Dapur", e);
      }
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
        setCurrentTime(Date.now());
        loadData();
    });

    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener("storage", loadData);
    window.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(loadData, 2000);
    const timeInterval = setInterval(() => setCurrentTime(Date.now()), 60000);
    
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
      clearInterval(timeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const savedOrders = localStorage.getItem("PESANAN_HARI_INI");

    if (savedOrders) {
      let pesananHariIni: RawOrder[] = JSON.parse(savedOrders);
      const mappedStatus = newStatus === 'preparing' ? 'Diracik' : (newStatus === 'cooked' ? 'Dikonfirmasi' : 'Pending');

      pesananHariIni = pesananHariIni.map(p => {
        if (p.orderID === orderId) {
            if (newStatus === "preparing") {
                addKarsaNotification(`Pesanan ${p.nama} (Meja ${p.meja}) sedang diproses`, "info");
                addActivityLog(`Dapur: Mulai masak ${p.orderID} (${p.nama})`, "status");
            } else if (newStatus === "cooked") {
                addKarsaNotification(`Pesanan ${p.nama} (Meja ${p.meja}) SELESAI dimasak`, "success");
                addActivityLog(`Dapur: Selesai masak ${p.orderID} (${p.nama})`, "status");
            }
            return { ...p, status: mappedStatus };
        }
        return p;
      });

      localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(pesananHariIni));
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

  const isOnlyDrinks = (items: {name: string}[]) => {
    return items.every(item => {
      const n = item.name.toLowerCase();
      return n.includes("kopi") || n.includes("espresso") || n.includes("latte") || 
             n.includes("americano") || n.includes("teh") || n.includes("lemon") || 
             n.includes("milo") || n.includes("matcha") || n.includes("yakult") || n.includes("squash");
    });
  };

  const toggleCheck = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#02050A] text-white p-6 font-mono cursor-none flex flex-col relative overflow-hidden selection:bg-[#00F2FF]/30">
      {/* Cyber-Industrial Scanlines & Noise */}
      <div className="cyber-scanlines"></div>
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F2FF]/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#39FF14]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Custom White Cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-[#00F2FF] rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)`, boxShadow: '0 0 15px rgba(0,242,255,0.5)' }}
      ></div>
      <div 
        className="fixed w-1.5 h-1.5 bg-[#00F2FF] rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%)` }}
      ></div>

      <header className="grid grid-cols-12 gap-6 mb-8 relative z-10">
        <div className="col-span-12 lg:col-span-8 cyber-glass p-8 flex flex-col justify-center">
          <div className="flex items-center gap-5 mb-2">
            <div className="w-16 h-16 bg-[#00F2FF]/20 rounded-xl border border-[#00F2FF]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              <span className="text-3xl filter brightness-200">🍳</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase text-[#00F2FF] drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]">
                KITCHEN <span className="text-white">SYS_01</span>
              </h1>
              <p className="text-[#00F2FF]/60 text-[10px] uppercase tracking-[0.5em] font-bold">High-Efficiency KDS Mode • Live Sync Active</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 cyber-glass p-6 flex flex-col items-center justify-center text-center border-t-4 border-t-[#00F2FF]">
          <span className="text-[10px] text-[#00F2FF] uppercase tracking-widest mb-1 font-bold">Active Queue</span>
          <span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{orders.length}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-40 opacity-30 cyber-glass border-dashed">
            <div className="text-8xl mb-6 grayscale opacity-50">💤</div>
            <p className="font-black uppercase text-xl tracking-[0.4em] text-center text-[#00F2FF]">System Idle</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {[...orders].sort((a, b) => a.timestamp - b.timestamp).map((order) => {
              const timeToUse = currentTime || order.timestamp;
              const waitTime = Math.floor((timeToUse - order.timestamp) / 60000);
              const isLate = waitTime >= 15;
              const isPriority = isOnlyDrinks(order.items);
              const isPreparing = order.status === 'preparing';

              // Neon Colors Based on Status
              const accentColor = isPreparing ? '#39FF14' : '#00F2FF'; // Electric Green vs Neon Blue
              const bgGlow = isPreparing ? 'rgba(57, 255, 20, 0.1)' : 'rgba(0, 242, 255, 0.1)';

              return (
                <div 
                  key={order.id} 
                  className="relative cyber-card flex flex-col transition-all duration-500 animate-in zoom-in-95"
                  style={{
                    borderColor: isLate ? '#FF003C' : accentColor,
                    boxShadow: isLate ? `0 0 30px rgba(255,0,60,0.3)` : `0 0 20px ${bgGlow}`,
                  }}
                >
                  {/* Priority Badge */}
                  {isPriority && (
                    <div className="absolute -top-3 -right-3 bg-[#FFBF00] text-black text-[10px] font-black px-4 py-1 rounded-sm shadow-[0_0_15px_#FFBF00] border border-black z-20 animate-pulse uppercase tracking-widest transform rotate-3">
                      ⚡ KILAT
                    </div>
                  )}

                  <div className="p-5 border-b flex justify-between items-center bg-black/40" style={{ borderColor: `${accentColor}40` }}>
                    <div>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest mb-2 inline-block bg-black border" style={{ color: accentColor, borderColor: accentColor }}>TBL_{order.tableNumber}</span>
                      <h3 className="font-black text-xl tracking-tighter leading-none mt-1 text-white">{order.id}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${isLate ? 'bg-[#FF003C]/20 text-[#FF003C] border-[#FF003C] animate-pulse shadow-[0_0_15px_#FF003C]' : 'bg-black border-white/20 text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isPreparing ? 'animate-spin' : ''}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="text-[12px] font-black">{waitTime}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-3 bg-black/20">
                    {order.items.map((item, i) => {
                      const isChecked = checkedItems[`${order.id}-${i}`];
                      return (
                        <div 
                          key={i} 
                          onClick={() => toggleCheck(order.id, i)}
                          className={`flex justify-between items-center p-3 rounded-sm border cursor-pointer transition-all ${isChecked ? 'bg-white/5 border-white/10 opacity-50 grayscale' : 'bg-black/50 hover:bg-white/5'} border-white/10`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${isChecked ? 'bg-[#39FF14] border-[#39FF14]' : 'border-white/30'}`}>
                                {isChecked && <span className="text-black text-[10px] font-black">✓</span>}
                            </div>
                            <span className="text-xl">{getCategoryIcon(item.name)}</span>
                            <div>
                              <span className={`text-sm font-bold block leading-tight ${isChecked ? 'line-through text-stone-500' : 'text-white'}`}>{item.name}</span>
                              <p className="text-[10px] text-stone-400 font-bold mt-0.5">QTY: <span className={isChecked ? '' : 'text-white'}>{item.qty}</span></p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-5 bg-black/60 border-t" style={{ borderColor: `${accentColor}40` }}>
                    {order.status === "received" ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "preparing")} 
                        className="w-full text-black py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}80` }}
                      >
                        [ INITIALIZE ] 👨‍🍳
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateOrderStatus(order.id, "cooked")} 
                        className="w-full text-black py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all animate-pulse active:scale-[0.98]"
                        style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
                      >
                        [ DEPLOY_ORDER ] ✅
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
        /* Cyber-Industrial Glassmorphism Level 2 */
        .cyber-glass { 
          background: rgba(10, 15, 25, 0.4); 
           
          -webkit- 
          border: 1px solid rgba(0, 242, 255, 0.1);
          box-shadow: inset 0 0 20px rgba(0, 242, 255, 0.05);
          position: relative;
        }
        .cyber-glass::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(0,242,255,0.4), transparent, rgba(57,255,20,0.2));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        .cyber-card {
            background: rgba(5, 10, 15, 0.6);
            
            border-width: 1px;
            border-style: solid;
        }

        .cyber-scanlines {
            position: fixed;
            inset: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 50;
            opacity: 0.3;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0, 242, 255, 0.3); 
          border-radius: 4px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 242, 255, 0.6);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
