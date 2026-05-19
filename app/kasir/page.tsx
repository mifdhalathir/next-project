"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Chart from 'chart.js/auto';

export default function KasirPage() {
  const router = useRouter();
  
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [pendingResCount, setPendingResCount] = useState(0);
  const [indoorCapacity, setIndoorCapacity] = useState(0);
  const [outdoorCapacity, setOutdoorCapacity] = useState(0);

  const [pesananHariIniList, setPesananHariIniList] = useState<any[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const defaultInventory: Record<string, number> = {
    "Kopi Susu Karsa": 20,
    "Iced Americano": 15,
    "Matcha Latte": 12,
    "Red Velvet Latte": 10,
    "Nasi Goreng Katsu": 8,
    "Indomie Spesial": 15,
    "Mix Platter": 6,
  };

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      const savedRes = localStorage.getItem("karsa_pesanan_masuk");
      const savedInv = localStorage.getItem("karsa_inventory");
      
      let parsedOrders: any[] = [];
      if (savedOrders) {
        parsedOrders = JSON.parse(savedOrders);
        setPesananHariIniList(parsedOrders);
        
        const completed = parsedOrders.filter((p: any) => p.status === 'Selesai');
        setActiveOrdersCount(parsedOrders.length - completed.length);
        
        let ind = 0, out = 0;
        parsedOrders.filter((p: any) => p.status !== 'Selesai').forEach((p: any) => {
            const t = parseInt(String(p.meja || "").replace(/[^\d]/g, ''));
            if (!isNaN(t)) {
                if (t <= 10) ind++;
                else if (t <= 15) out++;
            }
        });
        setIndoorCapacity(ind);
        setOutdoorCapacity(out);

        updateChart(parsedOrders);
      } else {
        setPesananHariIniList([]);
        setActiveOrdersCount(0);
        setIndoorCapacity(0);
        setOutdoorCapacity(0);
      }

      if (savedRes) {
        const parsedRes: any[] = JSON.parse(savedRes);
        setPendingResCount(parsedRes.filter((p: any) => p.status === 'menunggu').length);
      } else {
        setPendingResCount(0);
      }

      if (savedInv) {
        setInventory(JSON.parse(savedInv));
      } else {
        setInventory(defaultInventory);
        localStorage.setItem("karsa_inventory", JSON.stringify(defaultInventory));
      }
    } catch (e) { console.error("Sync error", e); }
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
    
    if (chartInstance.current) {
        chartInstance.current.data.datasets[0].data = hourData;
        chartInstance.current.update();
    } else {
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => String(i).padStart(2,'0') + ':00'),
                datasets: [{ 
                    label: 'Pesanan Selesai', 
                    data: hourData,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderColor: '#f59e0b',
                    borderWidth: 2, 
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#f59e0b'
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#78716c', font: { size: 8 } }
                    },
                    y: { 
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#78716c', font: { size: 8 }, stepSize: 1, precision: 0 },
                      beginAtZero: true
                    }
                }
            }
        });
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    const interval = setInterval(loadData, 3000);
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const adjustStock = (name: string, delta: number) => {
    const inv = { ...inventory };
    inv[name] = Math.max(0, (inv[name] || 0) + delta);
    setInventory(inv);
    localStorage.setItem("karsa_inventory", JSON.stringify(inv));
    window.dispatchEvent(new Event("storage"));
  };

  const advanceOrder = (orderId: string) => {
    try {
      const savedOrders = localStorage.getItem("PESANAN_HARI_INI");
      if (savedOrders) {
        let pesananList: any[] = JSON.parse(savedOrders);
        const order = pesananList.find(p => p.orderID === orderId);
        if (order) {
          const stages = ['Pending', 'Diracik', 'Dikonfirmasi', 'Selesai'];
          const currentIdx = stages.indexOf(order.status);
          if (currentIdx < stages.length - 1) {
            order.status = stages[currentIdx + 1];
            localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(pesananList));
            window.dispatchEvent(new Event("storage"));
            loadData();
          }
        }
      }
    } catch(e) {}
  };

  const clearPesananMasuk = () => {
    if(confirm("Yakin ingin menghapus semua pesanan masuk?")) {
      localStorage.setItem("karsa_pesanan_masuk", "[]");
      loadData();
    }
  };

  const resetStock = () => {
    if(confirm("Reset semua stok ke nilai default?")) {
      setInventory(defaultInventory);
      localStorage.setItem("karsa_inventory", JSON.stringify(defaultInventory));
      loadData();
    }
  };

  const resetPesananHariIni = () => {
    if(confirm("Hapus semua riwayat pesanan hari ini?")) {
      localStorage.setItem("PESANAN_HARI_INI", "[]");
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0500] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-900 rounded-lg flex items-center justify-center text-amber-500 font-serif">K</div>
            <div>
              <h1 className="font-serif font-black text-xl text-amber-500 tracking-wider">KARSA KASIR</h1>
              <p className="text-[9px] text-stone-500 tracking-[0.3em] font-bold">DASHBOARD RESERVASI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
              <span className="text-[10px] text-green-500 font-black tracking-widest uppercase">Live</span>
            </div>
            <button onClick={() => router.push('/')} className="text-[9px] text-stone-500 hover:text-white font-black tracking-widest uppercase transition-colors">
              ← Kembali
            </button>
          </div>
        </header>

        {/* CHARTS SECTION */}
        <div className="border border-amber-500/20 rounded-2xl p-6 mb-8 bg-[#110a05] shadow-lg shadow-black/50">
          
          {/* ANALITIK JAM SIBUK MOCK */}
          <div className="mb-6 border border-blue-500/20 rounded-xl p-4 bg-[#0a1015]">
            <h3 className="text-[9px] font-black text-blue-400 mb-6 tracking-widest uppercase flex items-center gap-2">
              📊 Analitik Jam Sibuk
            </h3>
            <div className="h-10 relative flex items-end px-2">
               {/* Timeline line */}
               <div className="w-full h-px bg-blue-500/30 absolute bottom-5 left-0"></div>
               {/* Points */}
               <div className="w-full flex justify-between relative z-10">
                 {['00:00', '08:00', '12:00', '16:00', '22:00'].map((time, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mb-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                     <span className="text-[8px] text-stone-500 font-bold">{time}</span>
                   </div>
                 ))}
               </div>
            </div>
            {pesananHariIniList.length === 0 && (
              <p className="text-[9px] text-stone-500 mt-4 italic">Belum ada data pesanan.</p>
            )}
          </div>

          {/* GRAFIK PENJUALAN PER JAM */}
          <div className="border border-amber-500/20 rounded-xl p-4 bg-[#110a05]">
            <h3 className="text-[9px] font-black text-amber-500 mb-4 tracking-widest uppercase flex items-center gap-2">
              📊 Grafik Penjualan Per Jam (Chart.js)
            </h3>
            <div className="h-40 w-full">
               <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#110a05] border border-white/5 rounded-[1.5rem] p-5 shadow-lg shadow-black/50">
            <p className="text-[9px] text-stone-500 font-black tracking-widest mb-3 uppercase">Total Aktif</p>
            <p className="text-4xl font-black text-white">{activeOrdersCount}</p>
          </div>
          <div className="bg-[#110a05] border border-white/5 rounded-[1.5rem] p-5 shadow-lg shadow-black/50">
            <p className="text-[9px] text-stone-500 font-black tracking-widest mb-3 uppercase">Menunggu</p>
            <p className="text-4xl font-black text-amber-500">{pendingResCount}</p>
          </div>
          <div className="bg-[#110a05] border border-white/5 rounded-[1.5rem] p-5 shadow-lg shadow-black/50">
            <p className="text-[9px] text-stone-500 font-black tracking-widest mb-3 uppercase flex items-center gap-2">
              <span className="text-blue-400">🏠</span> Indoor
            </p>
            <p className="text-4xl font-black text-blue-400">{indoorCapacity} <span className="text-[10px] text-stone-500 font-bold">/ 10 meja</span></p>
          </div>
          <div className="bg-[#110a05] border border-white/5 rounded-[1.5rem] p-5 shadow-lg shadow-black/50">
            <p className="text-[9px] text-stone-500 font-black tracking-widest mb-3 uppercase flex items-center gap-2">
              <span className="text-green-500">🌿</span> Outdoor
            </p>
            <p className="text-4xl font-black text-green-500">{outdoorCapacity} <span className="text-[10px] text-stone-500 font-bold">/ 5 meja</span></p>
          </div>
        </div>

        {/* REAL-TIME CAPACITY */}
        <div className="bg-[#110a05] border border-white/5 rounded-[1.5rem] p-6 mb-12 shadow-lg shadow-black/50">
          <h3 className="text-[9px] font-black text-stone-500 tracking-widest uppercase mb-5 flex items-center gap-2">
            ⚙ Kapasitas Real-Time (Dari Data Reservasi)
          </h3>
          <div className="grid grid-cols-2 gap-10">
            <div>
               <div className="flex justify-between text-[11px] font-black mb-3">
                 <span className="text-amber-500 flex items-center gap-2">🏠 Indoor</span>
                 <span className="text-white">{indoorCapacity} / 10</span>
               </div>
               <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 transition-all duration-500" style={{width: `${Math.min((indoorCapacity/10)*100, 100)}%`}}></div>
               </div>
            </div>
            <div>
               <div className="flex justify-between text-[11px] font-black mb-3">
                 <span className="text-green-500 flex items-center gap-2">🌿 Outdoor</span>
                 <span className="text-white">{outdoorCapacity} / 5</span>
               </div>
               <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${Math.min((outdoorCapacity/5)*100, 100)}%`}}></div>
               </div>
            </div>
          </div>
        </div>

        {/* PESANAN MASUK HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-black bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">Pesanan Masuk</h2>
          <button onClick={clearPesananMasuk} className="px-5 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors flex items-center gap-2">
            🗑 Hapus Semua
          </button>
        </div>

        {/* MANAJEMEN STOK MENU */}
        <div className="bg-[#110a05] border border-white/5 rounded-2xl p-6 mb-8 shadow-lg shadow-black/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-stone-500 tracking-widest uppercase flex items-center gap-2">
              📦 Manajemen Stok Menu
            </h3>
            <button onClick={resetStock} className="px-4 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-colors flex items-center gap-2">
              🔄 Reset Stok
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(inventory).map(([name, stock]) => (
              <div key={name} className="bg-[#0c1810] border border-green-500/20 rounded-xl p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(34,197,94,0.03)] hover:border-green-500/40 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-black text-white leading-tight pr-4">{name}</span>
                  {/* Mock Toggle Switch */}
                  <div className={`w-8 h-4 rounded-full flex items-center p-0.5 justify-end ${stock > 0 ? 'bg-green-500' : 'bg-stone-700'}`}>
                    <div className="w-3 h-3 rounded-full bg-white shadow-sm"></div>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className={`text-2xl font-black ${stock > 0 ? 'text-green-500' : 'text-red-500'}`}>{stock}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => adjustStock(name, -1)} className="w-7 h-7 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center justify-center text-sm font-black transition-colors">-</button>
                    <button onClick={() => adjustStock(name, 1)} className="w-7 h-7 rounded bg-green-500/20 text-green-500 hover:bg-green-500/30 flex items-center justify-center text-sm font-black transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PESANAN HARI INI */}
        <div className="bg-[#110a05] border border-amber-500/20 rounded-2xl p-6 mb-12 shadow-lg shadow-black/50">
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-2xl font-serif font-black text-white flex items-center gap-3">
                📄 Pesanan Hari Ini <span className="text-[10px] text-stone-500 tracking-widest font-sans font-bold">(dari PESANAN_HARI_INI)</span>
              </h3>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest mt-2">DATA OTOMATIS DARI CHECKOUT MENU PELANGGAN</p>
            </div>
            <button onClick={resetPesananHariIni} className="px-4 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors flex items-center gap-2">
              🗑 Reset
            </button>
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 text-[9px] text-stone-500 font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-3">
                <div>Order ID</div>
                <div>Pelanggan</div>
                <div>Meja / Area</div>
                <div>Items</div>
                <div>Total</div>
                <div>Waktu</div>
                <div>Status</div>
                <div>Aksi</div>
              </div>
              
              {pesananHariIniList.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-[11px] italic font-bold">
                  Belum ada pesanan hari ini.
                </div>
              ) : (
                <div className="space-y-1">
                  {pesananHariIniList.map(p => (
                    <div key={p.orderID} className="grid grid-cols-8 text-[11px] text-white py-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                       <div className="font-mono text-stone-400">{p.orderID}</div>
                       <div className="font-black">{p.nama}</div>
                       <div className="text-stone-300">{p.meja}</div>
                       <div className="text-stone-400">{p.items?.length || 0} items</div>
                       <div className="text-amber-500 font-black tracking-wide">Rp {p.totalHarga?.toLocaleString()}</div>
                       <div className="text-stone-400 font-mono text-[10px]">{p.jam}</div>
                       <div>
                         <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider ${
                            p.status === 'Selesai' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
                            p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                         }`}>
                           {p.status}
                         </span>
                       </div>
                       <div>
                         <button 
                           onClick={() => advanceOrder(p.orderID)} 
                           disabled={p.status === 'Selesai'}
                           className={`px-4 py-1.5 font-black rounded-lg text-[9px] uppercase tracking-widest transition-all ${
                             p.status === 'Selesai' 
                               ? 'bg-white/5 text-stone-500 cursor-not-allowed'
                               : 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                           }`}
                         >
                           {p.status === 'Selesai' ? 'Selesai' : 'Proses'}
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
