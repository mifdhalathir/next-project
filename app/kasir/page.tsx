"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";
import { addActivityLog } from "@/components/ActivityLog";
import ActivityLog from "@/components/ActivityLog";
import Chart from 'chart.js/auto';

// Custom Hook for running numbers
function useRunningNumber(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (end - start || 1)));
    const timer = setInterval(() => {
      start += increment;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function KasirPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");

  // Summary States
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [pendingResCount, setPendingResCount] = useState(0);
  const [popularMenu, setPopularMenu] = useState("-");
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);
  const [avgRating, setAvgRating] = useState(5.0);
  const [reviewCount, setReviewCount] = useState(0);
  const [topMenus, setTopMenus] = useState<{name: string, qty: number}[]>([]);

  // Inventory Alerts
  const [lowStockToasts, setLowStockToasts] = useState<{name: string, stock: number}[]>([]);
  const [alertedStock, setAlertedStock] = useState<Record<string, boolean>>({});

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  interface RawOrder {
    orderID: string;
    meja: string;
    nama: string;
    items: { nama: string; harga: number; qty: number }[];
    totalHarga: number;
    status: string;
    id: number;
    jam?: string;
  }

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

  const rawTotalRevenue = Number(typeof window !== "undefined" ? localStorage.getItem("karsa_revenue") || 0 : 0);

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      const savedRes = localStorage.getItem("karsa_pesanan_masuk");
      const savedInv = localStorage.getItem("karsa_inventory");
      const savedReviews = localStorage.getItem("karsa_reviews");
      
      if (savedOrders) {
        const parsedOrders: RawOrder[] = JSON.parse(savedOrders);
        const mappedOrders: Order[] = parsedOrders.map(p => ({
            id: p.orderID,
            tableNumber: String(p.meja || "").replace(/[^\d]/g, ''),
            customerName: p.nama,
            items: p.items.map(it => ({ name: it.nama, price: it.harga, qty: it.qty })),
            total: p.totalHarga,
            status: p.status === 'Pending' ? 'received' : 
                   (p.status === 'Diracik' ? 'preparing' : 
                   (p.status === 'Dikonfirmasi' ? 'ready' : 
                   (p.status === 'Selesai' ? 'completed' : 'received'))),
            timestamp: p.id
        }));
        setOrders(mappedOrders.filter(o => o.status !== "completed"));
        updateChart(parsedOrders);

        const completed = parsedOrders.filter(p => p.status === 'Selesai');
        setCompletedOrdersCount(completed.length);
        setActiveOrdersCount(parsedOrders.length - completed.length);
        
        const itemCounts: Record<string, number> = {};
        completed.forEach(p => {
            p.items.forEach(it => {
                itemCounts[it.nama] = (itemCounts[it.nama] || 0) + it.qty;
            });
        });
        
        const sortedMenus = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
        setTopMenus(sortedMenus.slice(0, 3).map(m => ({name: m[0], qty: m[1]})));
        setPopularMenu(sortedMenus.length > 0 ? sortedMenus[0][0] : "-");
        
        let ind = 0, out = 0;
        parsedOrders.filter(p => p.status !== 'Selesai').forEach(p => {
            const t = parseInt(String(p.meja || "").replace(/[^\d]/g, ''));
            if (!isNaN(t)) {
                if (t <= 10) ind++;
                else if (t <= 15) out++;
            }
        });
        setIndoorCapacity(ind);
        setOutdoorCapacity(out);
      }

      if (savedRes) {
        const parsedRes: any[] = JSON.parse(savedRes);
        const resList = parsedRes.map(p => ({
            id: String(p.id),
            name: p.nama,
            time: `${p.tanggal} ${p.jam}`,
            guests: p.jumlah,
            notes: p.catatan,
            status: (p.status === 'menunggu' ? 'pending' : (p.status === 'dikonfirmasi' || p.status === 'selesai' ? 'arrived' : 'cancelled')),
            timestamp: p.id,
            tableNumber: String(p.catatan || "").match(/Meja (\d+)/)?.[1] || ""
        }));
        setReservations(resList);
        setPendingResCount(parsedRes.filter(p => p.status === 'menunggu' && p.isReservation).length);
      }

      if (savedReviews) {
        const parsedReviews: { rating: number }[] = JSON.parse(savedReviews);
        if (parsedReviews.length > 0) {
            setAvgRating(parsedReviews.reduce((sum, r) => sum + r.rating, 0) / parsedReviews.length);
            setReviewCount(parsedReviews.length);
        }
      }

      if (savedInv) {
        const inv = JSON.parse(savedInv);
        setInventory(inv);
        checkLowStock(inv);
      }
    } catch (e) { console.error("Sync error", e); }
  };

  const checkLowStock = (inv: Record<string, number>) => {
    const newAlerts = { ...alertedStock };
    const newToasts = [...lowStockToasts];
    let changed = false;
    for (const [name, stock] of Object.entries(inv)) {
      if (stock > 0 && stock < 5 && !newAlerts[name]) {
        newAlerts[name] = true;
        newToasts.push({ name, stock });
        changed = true;
      }
      if (stock >= 5 && newAlerts[name]) { delete newAlerts[name]; changed = true; }
    }
    if (changed) { setAlertedStock(newAlerts); setLowStockToasts(newToasts); }
  };

  const updateChart = (pesanan: RawOrder[]) => {
    if (!chartRef.current) return;
    const selesai = pesanan.filter(p => p.status === 'Selesai');
    const hourData = new Array(24).fill(0);
    selesai.forEach(p => {
        if (p.jam) {
            const h = parseInt(p.jam.split(':')[0]) || 0;
            if (h >= 0 && h < 24) hourData[h]++;
        }
    });
    if (chartInstance.current) {
        chartInstance.current.data.datasets[0].data = hourData;
        chartInstance.current.update();
    } else {
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => String(i).padStart(2,'0')),
                datasets: [{ 
                    label: 'Sales', 
                    data: hourData,
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderColor: '#f59e0b',
                    borderWidth: 2, 
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, beginAtZero: true }
                }
            }
        });
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("mousemove", (e) => setMousePos({ x: e.clientX, y: e.clientY }));
    const interval = setInterval(loadData, 3000);
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const advanceOrder = (orderId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      if (savedOrders) {
        let pesananHariIni: RawOrder[] = JSON.parse(savedOrders);
        const order = pesananHariIni.find(p => p.orderID === orderId);
        if (order) {
          const stages = ['Pending', 'Diracik', 'Dikonfirmasi', 'Selesai'];
          const currentIdx = stages.indexOf(order.status);
          if (currentIdx < stages.length - 1) {
            const nextStatus = stages[currentIdx + 1];
            order.status = nextStatus;
            if (nextStatus === 'Selesai') {
              const currentRev = Number(localStorage.getItem("karsa_revenue") || 0);
              localStorage.setItem("karsa_revenue", String(currentRev + order.totalHarga));
              addActivityLog(`Order ${orderId} Selesai — Rp ${order.totalHarga.toLocaleString()}`, "order");
            }
            localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(pesananHariIni));
            window.dispatchEvent(new Event("storage"));
            loadData();
          }
        }
      }
    } catch(e) {}
    setIsUpdating(false);
  };

  const adjustStock = (name: string, delta: number) => {
    const inv = { ...inventory };
    inv[name] = Math.max(0, (inv[name] || 0) + delta);
    setInventory(inv);
    localStorage.setItem("karsa_inventory", JSON.stringify(inv));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30 overflow-hidden relative cursor-none">
      {/* Custom Cursor */}
      <div 
        className="fixed w-8 h-8 border border-amber-500/50 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
      ></div>
      <div 
        className="fixed w-1 h-1 bg-amber-500 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      ></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.05)_0%,_transparent_70%)] pointer-events-none"></div>

      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 relative z-50">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-2xl font-bold text-black">K</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase">CASHIER<span className="text-amber-500">_PRO</span></h1>
            <p className="text-[9px] text-stone-500 font-bold tracking-[0.4em] uppercase mt-0.5">Automated POS System v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">Total Revenue</span>
            <span className="text-xl font-black text-amber-500 tracking-tighter">Rp {rawTotalRevenue.toLocaleString("id-ID")}</span>
          </div>
          <div className="h-10 w-px bg-white/5"></div>
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-xl transition-all duration-300"
          >
            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white text-red-500">Sign Out</span>
            <span className="text-lg group-hover:scale-125 transition-transform">🔒</span>
          </button>
        </div>
      </header>

      <main className="p-8 grid grid-cols-12 gap-8 h-[calc(100vh-80px)] overflow-hidden">
        {/* Left: Summary */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-2">Active Orders</p>
              <h3 className="text-4xl font-black">{activeOrdersCount}</h3>
            </div>
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-2">Wait List</p>
              <h3 className="text-4xl font-black">{pendingResCount}</h3>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/5 rounded-3xl h-40 relative overflow-hidden">
             <canvas ref={chartRef}></canvas>
          </div>

          <div className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Floor Map
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((t) => {
                const res = reservations.find(r => parseInt(r.tableNumber) === t && r.status === 'pending');
                const occ = orders.find(o => parseInt(o.tableNumber) === t);
                return (
                  <div key={t} className={`aspect-square rounded-2xl border flex items-center justify-center transition-all ${
                    res ? 'bg-red-500/10 border-red-500' : (occ ? 'bg-amber-500/10 border-amber-500' : 'bg-white/5 border-white/5')
                  }`}>
                    <span className="text-xl font-black">{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Management */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 overflow-hidden">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab("orders")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${activeTab === 'orders' ? 'bg-amber-500 text-black' : 'text-stone-500'}`}>Orders</button>
            <button onClick={() => setActiveTab("reservations")} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${activeTab === 'reservations' ? 'bg-amber-500 text-black' : 'text-stone-500'}`}>Reservations</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
            {activeTab === 'orders' ? (
              orders.map((order) => (
                <div key={order.id} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xl font-black">{order.customerName} <span className="text-stone-500 ml-2">T{order.tableNumber}</span></h4>
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full">{order.status}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-bold uppercase text-stone-300">
                        <span>{it.qty}x {it.name}</span>
                        <span>Rp {(it.price * it.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xl font-black text-amber-500">Rp {order.total.toLocaleString()}</span>
                    <button onClick={() => advanceOrder(order.id)} className="px-6 py-2 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-amber-500 transition-colors">Advance</button>
                  </div>
                </div>
              ))
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                  <h4 className="text-xl font-black mb-1">{res.name}</h4>
                  <p className="text-[10px] text-stone-500 font-black uppercase mb-4">{res.time} • {res.guests} GUESTS</p>
                  <p className="text-[11px] text-stone-400 italic bg-black/20 p-4 rounded-xl border border-white/5">{res.notes}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Stocks */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] p-6 overflow-hidden flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-6">Inventory</h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {Object.entries(inventory).map(([name, stock]) => (
                <div key={name} className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase">{name}</span>
                    <span className={`text-[10px] font-black ${stock < 5 ? 'text-red-500' : 'text-amber-500'}`}>{stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => adjustStock(name, -1)} className="flex-1 h-8 bg-white/5 rounded-lg text-xs font-bold">-</button>
                    <button onClick={() => adjustStock(name, 1)} className="flex-1 h-8 bg-white/5 rounded-lg text-xs font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 191, 0, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
