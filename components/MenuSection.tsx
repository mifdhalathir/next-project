"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { playSound } from "./AudioWidget";

const MENU_ITEMS = [
  // Snacks
  { id: 1, name: "Kentang Goreng", price: 15000, category: "snacks", img: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Kentang goreng renyah dengan bumbu spesial." },
  { id: 2, name: "Nugget/Sosis", price: 18000, category: "snacks", img: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop", desc: "Kombinasi nugget dan sosis goreng." },
  { id: 3, name: "Roti Bakar", price: 20000, category: "snacks", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop", desc: "Roti bakar dengan berbagai pilihan topping." },
  { id: 5, name: "Cireng/Dimsum", price: 18000, category: "snacks", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop", desc: "Pilihan camilan gurih hangat." },

  // Coffee Based
  { id: 6, name: "Espresso", price: 12000, category: "coffee", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop", desc: "Ekstrak kopi murni yang kuat." },
  { id: 7, name: "Americano", price: 15000, category: "coffee", img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Espresso dengan air panas segar." },
  { id: 8, name: "Cappuccino", price: 20000, category: "coffee", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop", desc: "Keseimbangan sempurna espresso, susu, dan busa." },
  { id: 9, name: "Latte", price: 20000, category: "coffee", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Espresso dengan susu lembut dan sedikit busa." },
  { id: 10, name: "Mochaccino", price: 22000, category: "coffee", img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop", desc: "Perpaduan kopi, susu, dan cokelat." },

  // Non-Coffee
  { id: 11, name: "Teh Tarik", price: 15000, category: "non-coffee", img: "https://images.pexels.com/photos/3735169/pexels-photo-3735169.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Teh susu khas dengan busa melimpah." },
  { id: 12, name: "Lemon Tea", price: 12000, category: "non-coffee", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", desc: "Teh segar dengan perasan jeruk lemon." },
  { id: 13, name: "Chocolate", price: 18000, category: "non-coffee", img: "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Minuman cokelat premium yang kental." },
  { id: 14, name: "Milo", price: 15000, category: "non-coffee", img: "https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Minuman cokelat malt favorit semua orang." },
  { id: 15, name: "Matcha", price: 22000, category: "non-coffee", img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=800&auto=format&fit=crop", desc: "Matcha Jepang asli dengan susu segar." },

  // Minuman Dingin (Drinks)
  { id: 16, name: "Es Kopi Susu", price: 18000, category: "drinks", img: "https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Kopi susu gula aren yang menyegarkan." },
  { id: 17, name: "Milkshake", price: 22000, category: "drinks", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop", desc: "Susu kocok dengan berbagai rasa." },
  { id: 18, name: "Smoothies", price: 25000, category: "drinks", img: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=800&auto=format&fit=crop", desc: "Minuman buah segar yang sehat dan lezat." },

  // Dessert
  { id: 19, name: "Cake Slice", price: 25000, category: "dessert", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop", desc: "Pilihan cake lembut premium." },
  { id: 20, name: "Brownies", price: 18000, category: "dessert", img: "https://images.unsplash.com/photo-1461009312844-e80697a81cc7?q=80&w=800&auto=format&fit=crop", desc: "Brownies cokelat fudge yang padat." },
  { id: 21, name: "Donat", price: 10000, category: "dessert", img: "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Donat empuk dengan aneka topping." },
  { id: 22, name: "Croissant", price: 22000, category: "dessert", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop", desc: "Pastry mentega yang renyah dan berlapis." },
  { id: 23, name: "Waffle", price: 25000, category: "dessert", img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Sajian hangat dengan sirup atau es krim." },
];

export default function MenuSection() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { cart, updateQty } = useCart();
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInv = () => {
      try {
        const inv = JSON.parse(localStorage.getItem("karsa_inventory") || "{}");
        setInventory(inv);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    
    // Simulate initial loading to show skeleton shimmer effect
    setTimeout(() => {
      fetchInv();
    }, 1200);

    const interval = setInterval(fetchInv, 5000);
    window.addEventListener("storage", fetchInv);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", fetchInv);
    };
  }, []);

  let filteredItems = filter === "all" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === filter);
  if (searchTerm) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <section id="menu" className="py-24 px-4 bg-theme">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.4em] text-xs uppercase mb-3 font-bold">Pilihan Terbaik</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-theme">Menu Kami</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mt-6"></div>
          
          {/* [CORE SYSTEM] Area Banner */}
          {(() => {
            if (typeof window === "undefined") return null;
            const area = localStorage.getItem("karsa_area") || "Indoor";
            return (
              <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
                {area === "Outdoor" ? (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-950/20">
                    <span className="text-3xl">🌿</span>
                    <div className="text-left">
                      <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">Area Outdoor — Smoking Area</p>
                      <p className="text-stone-500 text-[11px] mt-0.5 italic">Nikmati udara segar & suasana terbuka ☀️</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-950/20">
                    <span className="text-3xl">❄️</span>
                    <div className="text-left">
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Area Indoor — AC / No Smoking</p>
                      <p className="text-stone-500 text-[11px] mt-0.5 italic">Zona nyaman ber-AC, bebas asap rokok 🚭</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Rekomendasi Barista Section */}
        <div className="mb-24">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="text-amber-500 tracking-[.4em] text-[10px] uppercase mb-2 font-bold">✨ Pilihan Kami</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-theme">Rekomendasi Barista</h3>
            <div className="w-10 h-0.5 bg-amber-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 16, name: "Kopi Susu Karsa", price: 18000, img: "https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Signature es kopi susu, andalan semua kalangan." },
              { id: 7, name: "Iced Americano", price: 15000, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800", desc: "Espresso dengan air es segar, cocok buat fokus." },
              { id: 15, name: "Matcha Latte", price: 22000, img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=800&auto=format&fit=crop", desc: "Matcha premium dengan susu segar yang creamy." }
            ].map((item, index) => {
              const qty = cart[item.name]?.qty || 0;
              return (
                <div key={item.id} className="relative bg-stone-900 border border-amber-600/20 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)] group" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl z-20 tracking-widest shadow-lg">BEST SELLER</div>
                  <div className="h-56 overflow-hidden relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6 relative z-10 -mt-16">
                    <h4 className="font-display text-xl font-bold text-white mb-1">{item.name}</h4>
                    <p className="text-stone-400 text-xs mb-6 h-8">{item.desc}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-amber-500 font-bold">Rp {item.price.toLocaleString("id-ID")}</p>
                      <button 
                        onClick={() => { updateQty(item.name, qty + 1, item.price); playSound('click'); }} 
                        className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg active:scale-95"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood & Search Section */}
        <div className="max-w-xl mx-auto mb-16 text-center" data-aos="fade-up">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-6">Lagi Ngerasa Gimana Hari Ini?</p>
          <div className="flex justify-center gap-4 mb-8">
            {['🥺', '😴', '🤩', '🤓'].map((emoji, i) => (
              <button 
                key={i} 
                className="w-14 h-14 rounded-full border border-white/10 bg-white/5 hover:border-amber-500 hover:bg-amber-500/10 flex items-center justify-center text-2xl transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Cari menu kopi, makanan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
          {[
            { id: "all", label: "Semua", icon: "🍱" },
            { id: "snacks", label: "Snacks", icon: "🍟" },
            { id: "coffee", label: "Coffee", icon: "☕" },
            { id: "non-coffee", label: "Non-Coffee", icon: "🍵" },
            { id: "drinks", label: "Drinks", icon: "🥤" },
            { id: "dessert", label: "Dessert", icon: "🍰" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`relative z-20 flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 border ${
                filter === cat.id 
                  ? "bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-900/40 scale-105" 
                  : "bg-white/5 border-white/10 text-stone-400 hover:border-amber-600 hover:text-amber-500"
              }`}
            >
              <span className={`text-sm transition-transform duration-500 ${filter === cat.id ? "scale-125 rotate-12" : "group-hover:scale-110"}`}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            /* Skeleton Loading with Shimmer */
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="bg-stone-800/50 rounded-[2rem] overflow-hidden shadow-xl animate-pulse">
                <div className="h-44 bg-stone-700/50 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="p-5 pb-6">
                  <div className="h-5 bg-stone-700/50 rounded-md w-3/4 mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-stone-700/50 rounded-md w-full mb-1 relative overflow-hidden">
                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-stone-700/50 rounded-md w-5/6 mb-4 relative overflow-hidden">
                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="h-5 bg-stone-700/50 rounded-md w-1/3 relative overflow-hidden">
                       <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredItems.map((item, index) => {
            const qty = cart[item.name]?.qty || 0;
            const stock = inventory[item.name];
            const isSoldOut = stock !== undefined && stock <= 0;
            const isLowStock = stock !== undefined && stock > 0 && stock <= 3;
            const isVip = typeof window !== 'undefined' && localStorage.getItem('karsa_status') === 'reserved';

            return (
              <div
                key={item.id}
                className={`group relative bg-stone-900 rounded-[2rem] overflow-hidden shadow-xl transform transition-all duration-500 hover:-translate-y-1 ${isVip ? 'ruby-border-glow' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSoldOut ? 'grayscale' : ''}`}
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Smart Badge Logic */}
                    {(() => {
                      if (isSoldOut) {
                        return <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10">SOLD OUT</div>;
                      } else if (isLowStock) {
                        return <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">SISA {stock}</div>;
                      }

                      const area = typeof window !== 'undefined' ? localStorage.getItem('karsa_area') || 'Indoor' : 'Indoor';
                      
                      if (area === 'Indoor' && item.category === 'coffee') {
                        return <div className="atmo-badge bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">📚 Buat Nugas</div>;
                      } else if (area === 'Outdoor' && item.category === 'drinks') {
                        return <div className="atmo-badge bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]">☀️ Segar di Luar</div>;
                      }

                      const hour = new Date().getHours();
                      if (hour >= 18 || hour < 5) {
                        if (item.name.includes("Matcha") || item.name.includes("Teh")) {
                          return <div className="absolute top-4 left-4 bg-amber-500 text-black text-[8px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">BEST SELLER MALAM 🌙</div>;
                        }
                      } else if (hour >= 10 && hour < 16) {
                        if (item.category === "drinks" || item.name.includes("Cold Brew") || item.name.includes("Smoothies")) {
                          return <div className="absolute top-4 left-4 bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce">SEGAR BANGET ❄️</div>;
                        }
                      }
                      return null;
                    })()}

                    {/* Add Button in Corner */}
                  <button 
                    onClick={() => {
                      if (isSoldOut) return;
                      updateQty(item.name, qty + 1, item.price);
                      playSound('click');
                    }}
                    disabled={isSoldOut}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 z-20 ${isSoldOut ? 'bg-stone-700 text-stone-500 cursor-not-allowed opacity-50' : 'bg-amber-600 hover:bg-amber-500 text-white hover:rotate-90 active:scale-90'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                  </button>
                </div>

                <div className="p-5 pb-6">
                  <h3 className="font-display text-lg font-bold text-theme leading-tight mb-1">{item.name}</h3>
                  <p className="text-stone-500 text-[11px] leading-relaxed mb-4 h-8 overflow-hidden line-clamp-2">
                    {item.desc}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <p className="text-amber-500 font-black text-lg tracking-tighter">
                      <span className="text-[10px] font-normal text-stone-600 mr-1 italic">Rp</span>
                      {item.price.toLocaleString("id-ID")}
                    </p>
                    
                    {qty > 0 && (
                      <div className="flex items-center gap-2 bg-stone-800 rounded-lg p-1 px-2 border border-white/5">
                        <button
                          onClick={() => updateQty(item.name, qty - 1, item.price)}
                          className="w-4 h-4 text-stone-500 hover:text-white transition text-xs"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-bold text-white w-3 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(item.name, qty + 1, item.price)}
                          className="w-4 h-4 text-stone-500 hover:text-white transition text-xs"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </section>
  );
}
