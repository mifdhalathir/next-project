"use client";

import { useEffect, useState, useRef } from "react";
import { Order, OrderStatus, Reservation } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";
import ActivityLog, { addActivityLog } from "@/components/ActivityLog";
import Chart from "chart.js/auto";

// Helper hook for running number animation
function useRunningNumber(value: number, duration: number = 1000) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let startTimestamp: number;
    const startValue = displayValue;
    const diff = value - startValue;
    if (diff === 0) return;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + diff * easeProgress));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);
  
  return displayValue;
}

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [alertedStock, setAlertedStock] = useState<Record<string, boolean>>({});
  const [lowStockToasts, setLowStockToasts] = useState<{name: string, stock: number}[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // New Summary States
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [popularMenu, setPopularMenu] = useState("-");
  const [topMenus, setTopMenus] = useState<{name: string, qty: number}[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [pendingResCount, setPendingResCount] = useState(0);
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const rawTotalRevenue = Number(typeof window !== "undefined" ? localStorage.getItem("karsa_revenue") || 0 : 0);
  const animatedRevenue = useRunningNumber(rawTotalRevenue, 1500);

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      const savedRes = localStorage.getItem("karsa_pesanan_masuk");
      const savedInv = localStorage.getItem("karsa_inventory");
      const savedReviews = localStorage.getItem("karsa_reviews");
      
      if (savedOrders) {
        const parsedOrders: any[] = JSON.parse(savedOrders);
        const mappedOrders: Order[] = parsedOrders.map(p => ({
            id: p.orderID,
            tableNumber: String(p.meja || "").replace(/[^\d]/g, ''),
            customerName: p.nama,
            items: p.items.map((it: any) => ({ name: it.nama, price: it.harga, qty: it.qty })),
            total: p.totalHarga,
            status: p.status === 'Pending' ? 'received' : 
                   (p.status === 'Diracik' ? 'preparing' : 
                   (p.status === 'Dikonfirmasi' ? 'ready' : 
                   (p.status === 'Selesai' ? 'completed' : 'received'))),
            timestamp: p.id
        }));
        setOrders(mappedOrders.filter(o => o.status !== "completed"));
        updateChart(parsedOrders);

        // Calculate Summary Stats
        const completed = parsedOrders.filter(p => p.status === 'Selesai');
        setCompletedOrdersCount(completed.length);
        setActiveOrdersCount(parsedOrders.length - completed.length);
        
        const itemCounts: Record<string, number> = {};
        completed.forEach(p => {
            p.items.forEach((it: any) => {
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

      } else {
        setCompletedOrdersCount(0);
        setActiveOrdersCount(0);
        setTopMenus([]);
        setPopularMenu("-");
        setIndoorCapacity(0);
        setOutdoorCapacity(0);
      }

      if (savedRes) {
        let parsedRes: any[] = JSON.parse(savedRes);
        const resList: Reservation[] = parsedRes.filter(p => !p.orderID).map(p => ({
            id: String(p.id),
            name: p.nama,
            time: `${p.tanggal} ${p.jam}`,
            guests: p.jumlah,
            notes: p.catatan,
            status: p.status === 'menunggu' ? 'pending' : (p.status === 'selesai' ? 'arrived' : 'cancelled' as any),
            timestamp: p.id
        }));
        setReservations(resList);

        const pending = parsedRes.filter(p => p.status === 'menunggu');
        setPendingResCount(pending.length);
      } else {
        setPendingResCount(0);
      }

      if (savedReviews) {
        const parsedReviews: any[] = JSON.parse(savedReviews);
        if (parsedReviews.length > 0) {
            const total = parsedReviews.reduce((sum, r) => sum + r.rating, 0);
            setAvgRating(total / parsedReviews.length);
            setReviewCount(parsedReviews.length);
        }
      }

      if (savedInv) {
        const inv = JSON.parse(savedInv);
        setInventory(inv);
        checkLowStock(inv);
      }
    } catch (e) {
      console.error("Data sync error:", e);
    }
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
        try { new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=service-bell-ring-14610.mp3').play().catch(()=>{}); } catch(e){}
      }
      if (stock >= 5 && newAlerts[name]) {
        delete newAlerts[name];
        changed = true;
      }
    }
    
    if (changed) {
      setAlertedStock(newAlerts);
      setLowStockToasts(newToasts);
    }
  };

  const dismissToast = (index: number) => {
    const t = [...lowStockToasts];
    t.splice(index, 1);
    setLowStockToasts(t);
  };

  const updateChart = (pesanan: any[]) => {
    if (!chartRef.current) return;
    const selesai = pesanan.filter(p => p.status === 'Selesai');
    const hourData = new Array(24).fill(0);
    selesai.forEach(p => {
        if (p.jam) {
            const h = parseInt(p.jam.split(':')[0]) || 0;
            if (h >= 0 && h < 24) hourData[h]++;
        }
    });
    const labels = Array.from({length: 24}, (_, i) => String(i).padStart(2,'0') + ':00');
    
    if (chartInstance.current) {
        chartInstance.current.data.datasets[0].data = hourData;
        chartInstance.current.update();
    } else {
        // Business Intel Mode Chart styling (Amber theme)
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ 
                    label: 'Sales Volume', 
                    data: hourData,
                    backgroundColor: 'rgba(255, 191, 0, 0.2)',
                    borderColor: 'rgba(255, 191, 0, 1)',
                    borderWidth: 2, 
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#FFBF00',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: 'rgba(255,191,0,0.5)', font: { size: 9 } }, grid: { display: true, color: 'rgba(255,191,0,0.1)' } },
                    y: { beginAtZero: true, ticks: { color: 'rgba(255,191,0,0.5)', font: { size: 10 }, stepSize: 1 }, grid: { display: true, color: 'rgba(255,191,0,0.1)' } }
                }
            }
        });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "PESANAN_HARI_INI" || e.key === "karsa_pesanan_masuk" || e.key === "karsa_inventory") {
        loadData();
      }
    };
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener("storage", handleStorage);
    window.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(loadData, 3000);
    const timeInterval = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
      clearInterval(timeInterval);
      if (chartInstance.current) chartInstance.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceOrder = (orderId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      if (savedOrders) {
        let pesananHariIni: any[] = JSON.parse(savedOrders);
        const order = pesananHariIni.find(p => p.orderID === orderId);
        if (!order) return;
        
        const stages = ['Pending', 'Diracik', 'Dikonfirmasi', 'Selesai'];
        const currentIdx = stages.indexOf(order.status);
        if (currentIdx < stages.length - 1) {
            const nextStage = stages[currentIdx + 1];
            pesananHariIni = pesananHariIni.map(p => p.orderID === orderId ? { ...p, status: nextStage } : p);
            
            if (nextStage === 'Selesai') {
              const totalRevenue = Number(localStorage.getItem("karsa_revenue") || 0);
              localStorage.setItem("karsa_revenue", (totalRevenue + order.totalHarga).toString());
              
              let pts = parseInt(localStorage.getItem('karsa_loyalty_points') || '0');
              if (pts < 5) { pts++; localStorage.setItem('karsa_loyalty_points', String(pts)); }
            }

            localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(pesananHariIni));
            const stageMap: Record<string, string> = { 'Pending': '0', 'Diracik': '1', 'Dikonfirmasi': '2', 'Selesai': '2' };
            localStorage.setItem('karsa_order_stage', stageMap[nextStage] || '0');
            
            addActivityLog(`Order ${orderId} → ${nextStage}`, "status");
            
            window.dispatchEvent(new Event("storage"));
            loadData();
        }
      }
    } finally {
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const printKitchenTicket = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const itemsHtml = order.items.map(it => '<tr><td style="padding:4px 0;border-bottom:1px dashed #ccc;">' + it.qty + 'x</td><td style="padding:4px 8px;border-bottom:1px dashed #ccc;">' + it.name + '</td></tr>').join('');
    const ticketHtml = '<!DOCTYPE html><html><head><title>Kitchen Ticket</title><style>body{font-family:Courier New,monospace;width:280px;margin:0 auto;padding:20px;color:#000;}h2{text-align:center;margin:0;font-size:16px;letter-spacing:2px;}.sep{border-top:2px dashed #000;margin:10px 0;}table{width:100%;font-size:13px;}.info{font-size:11px;margin:4px 0;}.footer{text-align:center;font-size:9px;color:#666;margin-top:12px;}@media print{body{width:100%;padding:5px;}}</style></head><body><h2>☕ KARSA CAFE</h2><p style="text-align:center;font-size:9px;color:#666;margin:2px 0;">KITCHEN ORDER TICKET</p><div class="sep"></div><p class="info"><b>Order:</b> ' + order.id + '</p><p class="info"><b>Nama:</b> ' + (order.customerName||'-') + '</p><p class="info"><b>Meja:</b> ' + (order.tableNumber||'-') + '</p><div class="sep"></div><table>' + itemsHtml + '</table><div class="sep"></div><p style="text-align:center;font-size:12px;font-weight:bold;">Total: Rp ' + (order.total||0).toLocaleString('id-ID') + '</p><div class="footer">Dicetak: ' + new Date().toLocaleString('id-ID') + '</div><script>window.onload=function(){window.print();}</script></body></html>';
    const w = window.open('', '_blank', 'width=320,height=500');
    if (w) { w.document.write(ticketHtml); w.document.close(); }
  };

  const adjustStock = (name: string, delta: number) => {
    const inv = { ...inventory };
    if (inv[name] !== undefined) inv[name] = Math.max(0, inv[name] + delta);
    else inv[name] = Math.max(0, 10 + delta);
    setInventory(inv);
    localStorage.setItem("karsa_inventory", JSON.stringify(inv));
    addActivityLog(`Stok ${name} diubah (${delta > 0 ? '+' : ''}${delta}) → ${inv[name]}`, "inventory");
    window.dispatchEvent(new Event("storage"));
  };

  const toggleMenuAvailability = (name: string) => {
    const inv = { ...inventory };
    if (inv[name] !== undefined) inv[name] = inv[name] <= 0 ? 10 : 0;
    else inv[name] = 0; // if not tracked, assume 0
    setInventory(inv);
    localStorage.setItem("karsa_inventory", JSON.stringify(inv));
    window.dispatchEvent(new Event("storage"));
  };

  const updateReservation = (id: string, status: "arrived" | "cancelled") => {
    const savedRes = localStorage.getItem("karsa_pesanan_masuk");
    if (savedRes) {
        let parsed: any[] = JSON.parse(savedRes);
        parsed = parsed.map(p => String(p.id) === id ? { ...p, status: status === 'arrived' ? 'dikonfirmasi' : 'batal' } : p);
        localStorage.setItem("karsa_pesanan_masuk", JSON.stringify(parsed));
        window.dispatchEvent(new Event("storage"));
        loadData();
    }
  };

  const deleteReservation = (id: string) => {
    if (!confirm("Hapus permanen data reservasi ini?")) return;
    const savedRes = localStorage.getItem("karsa_pesanan_masuk");
    if (savedRes) {
        let parsed: any[] = JSON.parse(savedRes);
        parsed = parsed.filter(p => String(p.id) !== id);
        localStorage.setItem("karsa_pesanan_masuk", JSON.stringify(parsed));
        window.dispatchEvent(new Event("storage"));
        loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#050400] text-white p-6 font-mono cursor-none flex flex-col relative overflow-hidden selection:bg-[#FFBF00]/30">
      {/* Cyber-Industrial Scanlines */}
      <div className="cyber-scanlines"></div>

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFBF00]/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B0000]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Custom Cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-[#FFBF00] rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px rgba(255,191,0,0.5)' }}
      ></div>
      <div 
        className="fixed w-1.5 h-1.5 bg-[#FFBF00] rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* Low Stock Toasts */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-4 pointer-events-none">
        {lowStockToasts.map((toast, idx) => (
          <div key={idx} className="cyber-glass-amber border-red-500/40 rounded-sm p-4 shadow-[0_0_30px_rgba(255,0,0,0.2)] flex items-center gap-3 w-80 animate-in slide-in-from-right duration-300 pointer-events-auto">
            <div className="w-10 h-10 bg-[#FF003C]/20 border border-[#FF003C]/50 flex items-center justify-center shrink-0">
              <span className="text-xl animate-pulse">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-[#FF003C] text-[13px] font-extrabold m-0 uppercase tracking-widest">CRITICAL STOCK</p>
              <p className="text-white/60 text-[11px] m-0 mt-0.5"><strong className="text-[#FFBF00]">{toast.name}</strong> lvl drops to <strong className="text-[#FF003C]">{toast.stock}</strong></p>
            </div>
            <button onClick={() => dismissToast(idx)} className="text-[#FF003C] hover:text-white text-lg px-2">×</button>
          </div>
        ))}
      </div>

      <header className="grid grid-cols-12 gap-6 mb-6 relative z-10">
        <div className="col-span-12 lg:col-span-4 cyber-glass-amber p-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-[#FFBF00]/20 rounded-sm border border-[#FFBF00]/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,191,0,0.3)]">
              <span className="text-2xl filter brightness-200">💎</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-[#FFBF00] drop-shadow-[0_0_10px_rgba(255,191,0,0.8)]">
              CASHIER <span className="text-white">SYS_CMD</span>
            </h1>
          </div>
          <p className="text-[#FFBF00]/50 text-[9px] uppercase tracking-[0.5em] font-bold">Business Intel Mode • Terminal 01</p>
        </div>

        <div className="col-span-12 lg:col-span-3 cyber-glass-amber p-6 flex flex-col justify-center border-t-4 border-t-[#FFBF00]">
          <span className="text-[10px] text-[#FFBF00]/70 uppercase tracking-widest font-black block mb-1">Live Revenue Tracker</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#FFBF00] tracking-tighter drop-shadow-[0_0_10px_rgba(255,191,0,0.4)]">
              Rp {animatedRevenue.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 cyber-glass-amber p-4 h-32 relative">
           <span className="absolute top-4 left-6 text-[10px] text-[#FFBF00]/70 uppercase tracking-widest font-black z-10">Volume Analytics</span>
           <div className="w-full h-full mt-2"><canvas ref={chartRef}></canvas></div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden relative z-10">
        
        {/* NEW SUMMARY ROW: Ringkasan Hari Ini & Top Summary Cards */}
        <div className="col-span-12 grid grid-cols-12 gap-6 mb-2">
          {/* Left: Ringkasan Hari Ini */}
          <div className="col-span-12 lg:col-span-8 cyber-glass-amber p-6">
             <h2 className="text-[#FFBF00] text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="text-xl">📊</span> Ringkasan Hari Ini (Pesanan Selesai)
             </h2>
             <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex flex-col justify-center">
                   <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">Total Pesanan</p>
                   <p className="text-3xl font-black text-white">{completedOrdersCount}</p>
                </div>
                <div className="bg-black/40 border border-[#FFBF00]/30 p-4 rounded-sm shadow-[inset_0_0_15px_rgba(255,191,0,0.1)] flex flex-col justify-center">
                   <p className="text-[10px] text-[#FFBF00]/70 uppercase font-bold tracking-widest mb-1">Total Pendapatan</p>
                   <p className="text-2xl font-black text-[#FFBF00] break-all">Rp {animatedRevenue.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-black/40 border border-[#39FF14]/30 p-4 rounded-sm shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] flex flex-col justify-center">
                   <p className="text-[10px] text-[#39FF14]/70 uppercase font-bold tracking-widest mb-1">Menu Terpopuler</p>
                   <p className="text-sm font-black text-[#39FF14] truncate mt-1">{popularMenu}</p>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 p-4 rounded-sm">
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-2">Statistik Menu (Top 3)</p>
                    {topMenus.length === 0 ? (
                        <p className="text-[10px] text-stone-600 italic">Belum ada data penjualan selesai.</p>
                    ) : (
                        topMenus.map((m, i) => (
                            <div key={i} className="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
                                <span className="text-xs text-stone-300 font-bold truncate pr-2">{m.name}</span>
                                <span className="text-[10px] text-[#FFBF00] font-black">{m.qty}x</span>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex flex-col justify-center">
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-1"><span className="text-[#FFBF00]">⭐</span> Rata-Rata Kepuasan</p>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-white">{avgRating.toFixed(1)}</span>
                        <div className="flex text-[#FFBF00] text-sm mb-1">
                           {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
                        </div>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">{reviewCount} rating masuk</p>
                </div>
             </div>
          </div>

          {/* Right: Summary Cards & Capacity */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
             <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="cyber-glass-amber p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-1">Total Aktif</p>
                    <p className="text-3xl font-black text-white">{activeOrdersCount}</p>
                </div>
                <div className="cyber-glass-amber p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] text-[#FFBF00]/70 uppercase font-bold tracking-widest mb-1">Menunggu</p>
                    <p className="text-3xl font-black text-[#FFBF00]">{pendingResCount}</p>
                </div>
             </div>
             
             <div className="cyber-glass-amber p-4 flex-1 flex flex-col justify-center">
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse"></span> Kapasitas Real-Time
                 </p>
                 
                 <div className="mb-3">
                     <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                         <span className="text-[#FFBF00]">🏠 Indoor</span>
                         <span className="text-stone-400">{indoorCapacity} / 10</span>
                     </div>
                     <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                         <div className="h-full bg-[#FFBF00] transition-all duration-500" style={{ width: `${Math.min((indoorCapacity/10)*100, 100)}%` }}></div>
                     </div>
                 </div>
                 
                 <div>
                     <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                         <span className="text-[#39FF14]">🌿 Outdoor</span>
                         <span className="text-stone-400">{outdoorCapacity} / 5</span>
                     </div>
                     <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                         <div className="h-full bg-[#39FF14] transition-all duration-500" style={{ width: `${Math.min((outdoorCapacity/5)*100, 100)}%` }}></div>
                     </div>
                 </div>
             </div>
          </div>
        </div>

        {/* Existing Grid Row */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-none bg-[#FFBF00] shadow-[0_0_10px_#FFBF00] animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FFBF00]">Floor Map</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3 p-2">
              {Array.from({ length: 12 }, (_, idx) => idx + 1).map((tableNum, i) => {
                const res = reservations[i]; 
                const isReserved = !!res && res.status === 'pending';
                // Find if any active order belongs to this table
                const activeOrder = orders.find(o => parseInt(o.tableNumber) === tableNum);
                const isOccupied = !!activeOrder;
                // Mock Table 7 asking for bill occasionally
                const isAskingBill = tableNum === 7 && currentTime % 60000 < 10000; // blink 10s every minute

                let tableClass = 'bg-black border-white/10 hover:border-white/30 text-stone-600';
                if (isAskingBill) {
                    tableClass = 'bg-[#8A2BE2]/20 border-[#8A2BE2] text-white shadow-[0_0_15px_#8A2BE2] animate-pulse';
                } else if (isReserved) {
                    tableClass = 'bg-[#8B0000]/40 border-[#FF003C] text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]';
                } else if (isOccupied) {
                    tableClass = 'bg-[#FFBF00]/20 border-[#FFBF00] text-white shadow-[0_0_10px_rgba(255,191,0,0.3)]';
                }

                return (
                  <div
                    key={tableNum}
                    className={`relative w-full aspect-square rounded-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border ${tableClass}`}
                    onClick={() => {
                      if (isReserved) {
                        alert(`RESERVATION: ${res.name} at ${res.time}`);
                      } else if (isAskingBill) {
                          alert(`TABLE ${tableNum} IS REQUESTING THE BILL!`);
                      }
                    }}
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">TBL</span>
                    <span className="text-xl font-black">{tableNum}</span>
                    
                    {/* Status Indicators */}
                    {isAskingBill && <div className="absolute top-1 right-1 w-2 h-2 bg-[#8A2BE2] rounded-none shadow-[0_0_5px_#8A2BE2]"></div>}
                    {isReserved && !isAskingBill && <div className="absolute top-1 right-1 w-2 h-2 bg-[#FF003C] rounded-none shadow-[0_0_5px_#FF003C]"></div>}
                    {isOccupied && !isAskingBill && !isReserved && <div className="absolute top-1 right-1 w-2 h-2 bg-[#FFBF00] rounded-none shadow-[0_0_5px_#FFBF00]"></div>}
                    
                    {isReserved && (
                      <div className="absolute inset-0 bg-black/90 rounded-sm opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity z-10 backdrop-blur-sm">
                         <button onClick={(e) => { e.stopPropagation(); updateReservation(res.id, "arrived"); }} className="bg-[#FFBF00] text-black text-[7px] font-black uppercase px-2 py-1 w-[80%] border border-[#FFBF00]">Check-in</button>
                         <button onClick={(e) => { e.stopPropagation(); updateReservation(res.id, "cancelled"); }} className="bg-transparent text-white text-[7px] font-black uppercase px-2 py-1 w-[80%] border border-white/30">Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="px-2 py-4 flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-widest text-stone-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FFBF00] shadow-[0_0_5px_#FFBF00]"></div> Occupied</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FF003C] shadow-[0_0_5px_#FF003C]"></div> Reserved</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#8A2BE2] shadow-[0_0_5px_#8A2BE2] animate-pulse"></div> Bill Req</span>
            </div>
          </div>
        </div>

        {/* Orders Column */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-none bg-[#39FF14] shadow-[0_0_10px_#39FF14] animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#39FF14]">Live Operations</h2>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar content-start">
            {orders.length === 0 ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center opacity-30 cyber-glass border-dashed border-white/10 py-24">
                <p className="font-black uppercase text-xs tracking-[0.4em] text-center text-[#FFBF00]">Awaiting Data Stream</p>
              </div>
            ) : (
              [...orders].sort((a, b) => b.timestamp - a.timestamp).map((order) => (
                <div key={order.id} className="cyber-glass-amber p-0 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform group border border-white/5">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <div>
                      <span className="px-2 py-0.5 bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40 text-[9px] font-black uppercase inline-block mb-1 shadow-[0_0_10px_rgba(255,191,0,0.1)]">TBL_{order.tableNumber}</span>
                      <h3 className="font-black text-xl text-white leading-none">{order.id}</h3>
                    </div>
                    <button onClick={() => printKitchenTicket(order.id)} className="bg-black border border-white/20 hover:border-[#00F2FF] text-[#00F2FF] p-2 transition shadow-[0_0_10px_rgba(0,242,255,0)] hover:shadow-[0_0_10px_rgba(0,242,255,0.3)]" title="Print Receipt">
                      🖨️
                    </button>
                  </div>

                  <div className="p-4 flex-1 space-y-2 bg-black/20">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/50 p-2 border border-white/5">
                        <span className="font-bold text-xs text-stone-300">{item.name}</span>
                        <span className="text-[9px] font-black text-[#FFBF00]">x{item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-black/60 border-t border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-stone-500">SYS_STATUS:</span>
                      <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-wider border ${
                          order.status === 'received' ? 'bg-[#FFBF00]/20 text-[#FFBF00] border-[#FFBF00]/50' : 
                          order.status === 'preparing' ? 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/50' : 
                          'bg-[#00F2FF]/20 text-[#00F2FF] border-[#00F2FF]/50'
                      }`}>
                        {order.status === 'received' ? 'Pending' : order.status === 'preparing' ? 'Diracik' : order.status === 'ready' ? 'Siap Antar' : 'Selesai'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => advanceOrder(order.id)} 
                        className="flex-1 bg-black border border-[#FFBF00]/50 hover:bg-[#FFBF00]/20 text-[#FFBF00] py-2.5 text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        [ NEXT STAGE ]
                      </button>
                      <button 
                        onClick={() => {
                          const updatedOrder = { ...order, status: 'ready' as OrderStatus }; // mock completion jump
                          advanceOrder(updatedOrder.id);
                        }} 
                        className="px-4 bg-black border border-[#39FF14]/50 hover:bg-[#39FF14]/20 text-[#39FF14] text-[9px] font-black uppercase transition-all"
                      >
                        ✅
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Column */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-none bg-[#FF003C] shadow-[0_0_10px_#FF003C] animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF003C]">Resource Manager</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
             {Object.entries(inventory).map(([name, stock]) => {
                const isOff = stock <= 0;
                const colorHex = isOff ? '#FF003C' : stock <= 3 ? '#FFBF00' : '#39FF14';
                return (
                  <div key={name} className="cyber-glass-amber p-3 relative bg-black/40 border-l-2" style={{ borderLeftColor: colorHex }}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-[10px] uppercase font-bold truncate flex-1">{name}</p>
                        <button 
                          onClick={() => toggleMenuAvailability(name)} 
                          className={`w-8 h-3 relative transition-colors border ${isOff ? 'bg-black border-[#FF003C]/50' : 'bg-black border-[#39FF14]/50'}`}
                        >
                          <div className={`absolute top-0 w-3 h-2.5 transition-transform ${isOff ? 'bg-[#FF003C] left-0' : 'bg-[#39FF14] translate-x-4'}`}></div>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-black tracking-tighter" style={{ color: colorHex }}>{isOff ? 'OFFLINE' : String(stock).padStart(2, '0')}</span>
                        <div className="flex gap-1">
                            <button onClick={() => adjustStock(name, -1)} className="w-6 h-6 bg-black border border-white/20 text-white hover:border-[#FF003C] hover:text-[#FF003C] text-xs font-bold transition-colors">-</button>
                            <button onClick={() => adjustStock(name, 1)} className="w-6 h-6 bg-black border border-white/20 text-white hover:border-[#39FF14] hover:text-[#39FF14] text-xs font-bold transition-colors">+</button>
                        </div>
                    </div>
                  </div>
                );
             })}
             {Object.keys(inventory).length === 0 && (
               <p className="text-[9px] uppercase tracking-widest text-[#FFBF00]/50 text-center mt-10">No Resource Data Synced.</p>
             )}
          </div>
        </div>

        {/* Activity Log Column - Below Inventory */}
        <div className="col-span-12 mt-4 cyber-glass-amber p-4">
          <ActivityLog />
        </div>

      </main>

      <style jsx global>{`
        /* Cyber-Industrial Glassmorphism Level 2 (Amber Gold Vibe) */
        .cyber-glass-amber { 
          background: rgba(15, 10, 0, 0.5); 
          backdrop-filter: blur(25px); 
          -webkit-backdrop-filter: blur(25px); 
          border: 1px solid rgba(255, 191, 0, 0.15);
          box-shadow: inset 0 0 20px rgba(255, 191, 0, 0.05);
          position: relative;
        }
        .cyber-glass-amber::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255,191,0,0.5), transparent, rgba(255,0,60,0.2));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        .cyber-scanlines {
            position: fixed;
            inset: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 50;
            opacity: 0.4;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); border-radius: 0px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 191, 0, 0.4); 
          border-radius: 0px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 191, 0, 0.8); }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
