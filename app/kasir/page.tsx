"use client";

import { useEffect, useState, useRef } from "react";
import { Order, OrderStatus, Reservation } from "@/components/CartProvider";
import { addKarsaNotification } from "@/components/NotificationHub";
import ActivityLog, { addActivityLog } from "@/components/ActivityLog";
import Chart from "chart.js/auto";

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

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      const savedRes = localStorage.getItem("karsa_pesanan_masuk");
      const savedInv = localStorage.getItem("karsa_inventory");
      
      if (savedOrders) {
        const parsedOrders: any[] = JSON.parse(savedOrders);
        const mappedOrders: Order[] = parsedOrders.map(p => ({
            id: p.orderID,
            tableNumber: p.meja.replace('Meja ', ''),
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
        chartInstance.current = new Chart(chartRef.current, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{ label: 'Pesanan Selesai', data: hourData,
                    backgroundColor: hourData.map(v => v > 0 ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.05)'),
                    borderColor: hourData.map(v => v > 0 ? 'rgba(245,158,11,0.9)' : 'rgba(255,255,255,0.1)'),
                    borderWidth: 1, borderRadius: 4 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } }, grid: { display: false } },
                    y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 }, stepSize: 1 } }
                }
            }
        });
    }
  };

  useEffect(() => {
    loadData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "PESANAN_HARI_INI" || e.key === "karsa_pesanan_masuk" || e.key === "karsa_inventory") {
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
      if (chartInstance.current) chartInstance.current.destroy();
    };
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

  const totalRevenue = Number(typeof window !== "undefined" ? localStorage.getItem("karsa_revenue") || 0 : 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans cursor-none flex flex-col relative overflow-hidden selection:bg-amber-500/30">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Custom Cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-white rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-difference"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}
      ></div>
      <div 
        className="fixed w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* Low Stock Toasts */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-4 pointer-events-none">
        {lowStockToasts.map((toast, idx) => (
          <div key={idx} className="bg-[#0f0a05] border border-red-500/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 w-80 animate-in slide-in-from-right duration-300 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-red-500 text-[13px] font-extrabold m-0">Woi Ngab!</p>
              <p className="text-white/60 text-[11px] m-0 mt-0.5">Stok <strong className="text-amber-500">{toast.name}</strong> sisa <strong className="text-red-500">{toast.stock}</strong>! Segera restock!</p>
            </div>
            <button onClick={() => dismissToast(idx)} className="text-white/30 hover:text-white text-lg">×</button>
          </div>
        ))}
      </div>

      <header className="grid grid-cols-12 gap-6 mb-6 relative z-10">
        <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
            <h1 className="font-display text-3xl font-black tracking-tighter uppercase italic">
              KARSA <span className="text-amber-500">KASIR</span>
            </h1>
          </div>
          <p className="text-stone-500 text-[9px] uppercase tracking-[0.5em] font-bold">POS & Management System</p>
        </div>

        <div className="col-span-12 lg:col-span-3 glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col justify-center">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-black block mb-1">Revenue Hari Ini</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500 tracking-tighter">Rp {totalRevenue.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 glass-card p-4 rounded-[2rem] border border-white/10 h-32 relative">
           <span className="absolute top-4 left-6 text-[10px] text-stone-500 uppercase tracking-widest font-black z-10">Grafik Pesanan</span>
           <div className="w-full h-full mt-2"><canvas ref={chartRef}></canvas></div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden relative z-10">
        {/* Reservation Column */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Reservasi</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {reservations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 rounded-[2rem] py-12">
                <p className="font-black uppercase text-[10px] tracking-widest text-center px-8">Kosong</p>
              </div>
            ) : (
              [...reservations].sort((a, b) => b.timestamp - a.timestamp).map((res) => (
                <div key={res.id} className={`glass-card p-5 rounded-[1.8rem] border border-white/5 relative overflow-hidden ${res.status === 'arrived' ? 'opacity-40 grayscale border-green-500/10' : 'hover:border-amber-500/30'}`}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${res.status === 'pending' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-black text-lg leading-tight">{res.name}</h4>
                      <p className="text-[9px] text-stone-500 uppercase font-bold tracking-widest">{res.id}</p>
                    </div>
                    <button onClick={() => deleteReservation(res.id)} className="text-stone-700 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
                  </div>
                  <p className="text-xs font-bold text-stone-300 mb-4">Jam: {res.time}</p>
                  {res.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateReservation(res.id, "arrived")} className="flex-1 bg-amber-500 text-black text-[9px] font-black uppercase py-2 rounded-lg">Check-in</button>
                      <button onClick={() => updateReservation(res.id, "cancelled")} className="px-3 bg-white/5 text-[9px] font-black uppercase py-2 rounded-lg text-stone-500">Batal</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders Column */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Live Orders</h2>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar content-start">
            {orders.length === 0 ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 rounded-[3rem] py-24">
                <p className="font-black uppercase text-xs tracking-[0.4em] text-center italic">Menunggu Pesanan...</p>
              </div>
            ) : (
              [...orders].sort((a, b) => b.timestamp - a.timestamp).map((order) => (
                <div key={order.id} className="glass-card rounded-[2rem] overflow-hidden flex flex-col border border-white/5 hover:border-green-500/30 hover:-translate-y-1 transition-all">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <span className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-[9px] font-black uppercase">Meja {order.tableNumber}</span>
                      <h3 className="font-black text-xl text-white mt-1">{order.id}</h3>
                    </div>
                    <button onClick={() => printKitchenTicket(order.id)} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 p-2 rounded-xl transition border border-purple-500/20" title="Cetak Struk">
                      🖨️
                    </button>
                  </div>

                  <div className="p-4 flex-1 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="font-bold text-xs text-stone-200">{item.name}</span>
                        <span className="text-[9px] font-black text-amber-500">x{item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase font-bold text-stone-500">Status:</span>
                      <span className="text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider bg-stone-800 text-amber-500">
                        {order.status === 'received' ? 'Pending' : order.status === 'preparing' ? 'Diracik' : order.status === 'ready' ? 'Siap Antar' : 'Selesai'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => advanceOrder(order.id)} 
                        className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all"
                      >
                        🔄 Update Status
                      </button>
                      <button 
                        onClick={() => {
                          order.status = 'ready'; // mock completion jump
                          advanceOrder(order.id);
                          advanceOrder(order.id); // jump to ready if needed
                        }} 
                        className="px-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl text-[9px] font-black uppercase transition-all"
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
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Stok & Menu</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
             {Object.entries(inventory).map(([name, stock]) => {
                const isOff = stock <= 0;
                const color = isOff ? 'red' : stock <= 3 ? 'amber' : 'green';
                return (
                  <div key={name} className={`bg-${color}-500/10 border border-${color}-500/20 p-3 rounded-xl relative`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-xs font-bold truncate flex-1">{name}</p>
                        <button 
                          onClick={() => toggleMenuAvailability(name)} 
                          className={`w-8 h-4 rounded-full relative transition-colors ${isOff ? 'bg-stone-700' : 'bg-green-500'}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isOff ? 'left-0.5' : 'translate-x-4'}`}></div>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-${color}-400 text-lg font-black`}>{isOff ? 'OFF' : stock}</span>
                        <div className="flex gap-1">
                            <button onClick={() => adjustStock(name, -1)} className="w-6 h-6 rounded bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/40">-</button>
                            <button onClick={() => adjustStock(name, 1)} className="w-6 h-6 rounded bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/40">+</button>
                        </div>
                    </div>
                  </div>
                );
             })}
             {Object.keys(inventory).length === 0 && (
               <p className="text-xs text-stone-500 italic text-center mt-10">Belum ada data inventori disinkronkan.</p>
             )}
          </div>
        </div>

        {/* Activity Log Column - Below Inventory */}
        <div className="col-span-12 mt-4">
          <ActivityLog />
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
