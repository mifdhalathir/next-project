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
    <section id="menu" className="py-20 px-4 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14" data-aos="fade-up">
          <p className="text-amber-700 tracking-[.3em] text-xs uppercase mb-2">Pilihan Terbaik</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-wood-800">Menu Kami</h2>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10" data-aos="fade-up" data-aos-delay="100">
          {["all", "coffee", "non-coffee", "meals"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn px-5 py-2 rounded-full border border-amber-700 text-sm font-medium transition ${
                filter === cat ? "active bg-amber-700 text-white" : "text-amber-700"
              }`}
            >
              {cat === "all" ? "Semua" : cat === "coffee" ? "Coffee" : cat === "non-coffee" ? "Non-Coffee" : "Meals"}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const qty = cart[item.name]?.qty || 0;
            return (
              <div
                key={item.id}
                className="menu-item menu-card bg-white rounded-2xl overflow-hidden shadow-md"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={index * 50}
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className={`w-full h-full object-cover hover:scale-110 transition duration-500 ${item.filter || ""}`}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-md font-semibold text-wood-800">{item.name}</h3>
                  <p className="text-stone-500 text-xs mt-1">{item.desc}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-amber-700 font-bold text-sm">Rp {item.price.toLocaleString("id-ID")}</p>
                    <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(item.name, qty - 1, item.price)}
                        className="w-6 h-6 rounded-full bg-white dark:bg-wood-800 text-amber-700 dark:text-amber-500 font-bold flex items-center justify-center hover:bg-amber-200 transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(item.name, qty + 1, item.price)}
                        className="w-6 h-6 rounded-full bg-white dark:bg-wood-800 text-amber-700 dark:text-amber-500 font-bold flex items-center justify-center hover:bg-amber-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filter === "all" && (
             <div className="menu-card bg-white rounded-2xl overflow-hidden shadow-md flex items-center justify-center" data-aos="fade-up" data-aos-duration="800">
                <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
                        <span className="text-amber-700 text-3xl">+</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-wood-800">Dan Lainnya</h3>
                    <p className="text-stone-500 text-sm mt-1">Kunjungi cafe kami untuk menu selengkapnya!</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
