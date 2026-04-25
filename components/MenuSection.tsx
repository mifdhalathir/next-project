"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

const MENU_ITEMS = [
  // Snacks
  { id: 1, name: "Kentang Goreng", price: 15000, category: "snacks", img: "/images/kentang-goreng.png", desc: "Kentang goreng renyah dengan bumbu spesial." },
  { id: 2, name: "Nugget/Sosis", price: 18000, category: "snacks", img: "/images/nugget-sosis.png", desc: "Kombinasi nugget dan sosis goreng." },
  { id: 3, name: "Roti Bakar", price: 20000, category: "snacks", img: "/images/roti-bakar.png", desc: "Roti bakar dengan berbagai pilihan topping." },
  { id: 4, name: "Pisang Goreng", price: 15000, category: "snacks", img: "/images/pisang-goreng.png", desc: "Pisang goreng manis dan krispi." },
  { id: 5, name: "Cireng/Dimsum", price: 18000, category: "snacks", img: "/images/cireng-dimsum.png", desc: "Pilihan camilan gurih hangat." },

  // Coffee Based
  { id: 6, name: "Espresso", price: 12000, category: "coffee", img: "/images/espresso.png", desc: "Ekstrak kopi murni yang kuat." },
  { id: 7, name: "Americano", price: 15000, category: "coffee", img: "/images/americano.png", desc: "Espresso dengan air panas segar." },
  { id: 8, name: "Cappuccino", price: 20000, category: "coffee", img: "/images/cappuccino.png", desc: "Keseimbangan sempurna espresso, susu, dan busa." },
  { id: 9, name: "Latte", price: 20000, category: "coffee", img: "/images/latte.png", desc: "Espresso dengan susu lembut dan sedikit busa." },
  { id: 10, name: "Mochaccino", price: 22000, category: "coffee", img: "/images/mochaccino.png", desc: "Perpaduan kopi, susu, dan cokelat." },

  // Non-Coffee
  { id: 11, name: "Teh Tarik", price: 15000, category: "non-coffee", img: "/images/teh-tarik.png", desc: "Teh susu khas dengan busa melimpah." },
  { id: 12, name: "Lemon Tea", price: 12000, category: "non-coffee", img: "/images/lemon-tea.png", desc: "Teh segar dengan perasan jeruk lemon." },
  { id: 13, name: "Chocolate", price: 18000, category: "non-coffee", img: "/images/chocolate.png", desc: "Minuman cokelat premium yang kental." },
  { id: 14, name: "Milo", price: 15000, category: "non-coffee", img: "/images/milo.png", desc: "Minuman cokelat malt favorit semua orang." },
  { id: 15, name: "Matcha", price: 22000, category: "non-coffee", img: "/images/matcha.png", desc: "Matcha Jepang asli dengan susu segar." },

  // Minuman Dingin (Drinks)
  { id: 16, name: "Es Kopi Susu", price: 18000, category: "drinks", img: "/images/es-kopi-susu.png", desc: "Kopi susu gula aren yang menyegarkan." },
  { id: 17, name: "Milkshake", price: 22000, category: "drinks", img: "/images/milkshake.png", desc: "Susu kocok dengan berbagai rasa." },
  { id: 18, name: "Smoothies", price: 25000, category: "drinks", img: "/images/smoothies.png", desc: "Minuman buah segar yang sehat dan lezat." },

  // Dessert
  { id: 19, name: "Cake (Coklat/Red Velvet)", price: 25000, category: "dessert", img: "/images/cake.png", desc: "Pilihan cake lembut premium." },
  { id: 20, name: "Brownies", price: 18000, category: "dessert", img: "/images/brownies.png", desc: "Brownies cokelat fudge yang padat." },
  { id: 21, name: "Donat", price: 10000, category: "dessert", img: "/images/donat.png", desc: "Donat empuk dengan aneka topping." },
  { id: 22, name: "Croissant", price: 22000, category: "dessert", img: "/images/croissant.png", desc: "Pastry mentega yang renyah dan berlapis." },
  { id: 23, name: "Pancake/Waffle", price: 25000, category: "dessert", img: "/images/pancake-waffle.png", desc: "Sajian hangat dengan sirup atau es krim." },
];

export default function MenuSection() {
  const [filter, setFilter] = useState("all");
  const { cart, updateQty } = useCart();

  const filteredItems = filter === "all" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="menu" className="py-24 px-4 bg-stone-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.4em] text-xs uppercase mb-3 font-bold">Pilihan Terbaik</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Menu Favorit</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16" data-aos="fade-up" data-aos-delay="100">
          {[
            { id: "all", label: "Semua" },
            { id: "snacks", label: "Snacks" },
            { id: "coffee", label: "Coffee" },
            { id: "non-coffee", label: "Non-Coffee" },
            { id: "drinks", label: "Drinks" },
            { id: "dessert", label: "Dessert" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 border ${
                filter === cat.id 
                  ? "bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-900/40 scale-105" 
                  : "bg-white/5 border-white/10 text-stone-400 hover:border-amber-600 hover:text-amber-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const qty = cart[item.name]?.qty || 0;
            return (
              <div
                key={item.id}
                className="group relative bg-stone-900 rounded-[2rem] overflow-hidden shadow-xl transform transition-all duration-500 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Add Button in Corner */}
                  <button 
                    onClick={() => updateQty(item.name, qty + 1, item.price)}
                    className="absolute top-4 right-4 w-10 h-10 bg-amber-600 hover:bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:rotate-90 active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                  </button>
                </div>

                <div className="p-5 pb-6">
                  <h3 className="font-display text-lg font-bold text-white leading-tight mb-1">{item.name}</h3>
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
          })}
        </div>
      </div>
    </section>
  );
}
