"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

const MENU_ITEMS = [
  { id: 1, name: "Kopi Susu Karsa", price: 18000, category: "coffee", img: "/images/kopi-susu-karsa.png", desc: "Signature es kopi susu." },
  { id: 2, name: "Iced Americano", price: 15000, category: "coffee", img: "/images/kopi-susu-karsa.png", desc: "Espresso dengan air es segar.", filter: "grayscale-[0.2]" },
  { id: 3, name: "Matcha Latte", price: 22000, category: "non-coffee", img: "/images/matcha-latte.png", desc: "Matcha premium & susu creamy." },
  { id: 4, name: "Red Velvet Latte", price: 24000, category: "non-coffee", img: "/images/matcha-latte.png", desc: "Cokelat red velvet yang manis.", filter: "hue-rotate-180" },
  { id: 5, name: "Nasi Goreng Katsu", price: 28000, category: "meals", img: "/images/nasi-goreng-katsu.png", desc: "Nasi goreng & chicken katsu." },
  { id: 6, name: "Indomie Spesial", price: 15000, category: "meals", img: "/images/indomie-goreng.png", desc: "Dengan telur & topping lengkap." },
  { id: 7, name: "Mix Platter", price: 35000, category: "meals", img: "/images/mix-platter.png", desc: "Kombinasi snack untuk berbagi." },
];

export default function MenuSection() {
  const [filter, setFilter] = useState("all");
  const { cart, updateQty } = useCart();

  const filteredItems = filter === "all" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="menu" className="py-24 px-4 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-amber-700 tracking-[.4em] text-xs uppercase mb-3 font-bold">Pilihan Terbaik</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-wood-900">Menu Favorit</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16" data-aos="fade-up" data-aos-delay="100">
          {["all", "coffee", "non-coffee", "meals"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border-2 ${
                filter === cat 
                  ? "bg-amber-700 border-amber-700 text-white shadow-lg shadow-amber-900/20 scale-105" 
                  : "bg-transparent border-stone-200 text-stone-500 hover:border-amber-700 hover:text-amber-700"
              }`}
            >
              {cat === "all" ? "Semua" : cat === "coffee" ? "Coffee" : cat === "non-coffee" ? "Non-Coffee" : "Meals"}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredItems.map((item, index) => {
            const qty = cart[item.name]?.qty || 0;
            return (
              <div
                key={item.id}
                className="group relative bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all duration-500 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.filter || ""}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Add Button in Corner */}
                  <button 
                    onClick={() => updateQty(item.name, qty + 1, item.price)}
                    className="absolute top-6 right-6 w-12 h-12 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:rotate-90 active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                  </button>
                </div>

                <div className="p-8 pb-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-2xl font-bold text-white leading-tight">{item.name}</h3>
                  </div>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2">
                    {item.desc}
                  </p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <p className="text-amber-500 font-black text-2xl tracking-tighter">
                      <span className="text-xs font-normal text-stone-500 mr-1 italic">Rp</span>
                      {item.price.toLocaleString("id-ID")}
                    </p>
                    
                    {qty > 0 && (
                      <div className="flex items-center gap-3 bg-stone-800 rounded-xl p-1 px-3 border border-white/5">
                        <button
                          onClick={() => updateQty(item.name, qty - 1, item.price)}
                          className="w-6 h-6 text-stone-400 hover:text-white transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(item.name, qty + 1, item.price)}
                          className="w-6 h-6 text-stone-400 hover:text-white transition"
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
