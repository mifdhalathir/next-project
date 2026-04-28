"use client";

import { useEffect, useState } from "react";
import { Order, useCart } from "./CartProvider";
import { addKarsaNotification } from "./NotificationHub";

export default function RecentOrders() {
  const [userName, setUserName] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { addToCart } = useCart();

  const loadRecentOrders = () => {
    const currentUserName = localStorage.getItem("karsa_user_name");
    setUserName(currentUserName);

    if (currentUserName) {
      const historyJson = localStorage.getItem("karsa_completed_orders");
      if (historyJson) {
        const history: Order[] = JSON.parse(historyJson);
        // Filter orders for the current user and take the latest 3 unique orders (by item content maybe?)
        // Or just the latest 5 orders.
        const userOrders = history.filter(o => o.customerName === currentUserName);
        setRecentOrders(userOrders.slice(0, 5));
      }
    } else {
      setRecentOrders([]);
    }
  };

  useEffect(() => {
    loadRecentOrders();
    window.addEventListener("storage", loadRecentOrders);
    return () => window.removeEventListener("storage", loadRecentOrders);
  }, []);

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      for (let i = 0; i < item.qty; i++) {
        addToCart(item.name, item.price);
      }
    });
    addKarsaNotification(`Menu dari pesanan ${order.id} ditambahkan ke keranjang!`, "success");
  };

  if (!userName || recentOrders.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-black">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-aos="fade-up">
          <div>
            <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Personalized Experience</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
              Pesanan <span className="text-amber-500">Terakhirmu</span>
            </h2>
            <p className="text-stone-500 text-sm mt-4 font-medium max-w-xl">
              Selamat datang kembali, <span className="text-white font-bold">{userName}</span>. Ingin menikmati menu favoritmu lagi? Cukup satu klik untuk memesan kembali.
            </p>
          </div>

          {/* Loyalty Points Mini Widget */}
          <div className="bg-amber-600/10 border border-amber-500/20 backdrop-blur-xl rounded-[2rem] p-6 flex items-center gap-6 group hover:border-amber-500/40 transition-all duration-500">
            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/40 group-hover:scale-110 transition-transform">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Loyalty Points</p>
              <p className="text-2xl font-black text-white leading-none">
                {localStorage.getItem(`karsa_points_${userName}`) || 0}
                <span className="text-[10px] text-stone-500 ml-2 uppercase tracking-widest">PTS</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentOrders.map((order, index) => (
            <div 
              key={order.id}
              className="glass-card group p-6 rounded-[2.5rem] border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:translate-y-[-8px] relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Glow Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">
                    {new Date(order.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <h3 className="text-white font-black text-xl tracking-tight uppercase italic">Order #{order.id.split('-')[1]}</h3>
                </div>
                <div className="bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Selesai</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-amber-500">
                        {item.qty}
                      </span>
                      <span className="text-stone-300 text-sm font-bold">{item.name}</span>
                    </div>
                    <span className="text-white font-black text-xs tracking-tight">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] text-stone-500 font-black uppercase tracking-widest mb-1">Total Biaya</span>
                  <span className="text-lg font-black text-white tracking-tighter">Rp {order.total.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={() => handleReorder(order)}
                  className="bg-amber-600 hover:bg-white hover:text-black text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-900/20 active:scale-95 group-hover:shadow-amber-500/20"
                >
                  Pesan Lagi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </section>
  );
}
