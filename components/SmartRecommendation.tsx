"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";

// Recommendation engine: pairs items based on category complementarity
const PAIRING_MAP: Record<string, { pair: string; reason: string }[]> = {
  // Coffee pairs
  "Espresso":     [{ pair: "Brownies", reason: "Pahit & manis yang legendaris" }, { pair: "Croissant", reason: "Klasik ala café Paris" }],
  "Americano":    [{ pair: "Roti Bakar", reason: "Sarapan Sultan yang simpel" }, { pair: "Cake Slice", reason: "Balance antara bold & sweet" }],
  "Cappuccino":   [{ pair: "Donat", reason: "Foam lembut + donat manis = surga" }, { pair: "Waffle", reason: "Combo brunch favorit" }],
  "Latte":        [{ pair: "Cake Slice", reason: "Creamy meets fluffy" }, { pair: "Croissant", reason: "Smooth latte + buttery pastry" }],
  "Mochaccino":   [{ pair: "Brownies", reason: "Double cokelat attack!" }, { pair: "Waffle", reason: "Choco heaven di sore hari" }],
  "Es Kopi Susu": [{ pair: "Kentang Goreng", reason: "Nongkrong vibes yang legit" }, { pair: "Cireng/Dimsum", reason: "Gurih + manis gula aren" }],

  // Non-Coffee pairs
  "Teh Tarik":    [{ pair: "Roti Bakar", reason: "Mamak style yang otentik" }, { pair: "Donat", reason: "Teh tarik + donat = nostalgia" }],
  "Lemon Tea":    [{ pair: "Cake Slice", reason: "Segar & manis, cocok buat siang" }],
  "Chocolate":    [{ pair: "Waffle", reason: "Choco lovers wajib coba!" }, { pair: "Brownies", reason: "Cokelat overload yang nikmat" }],
  "Milo":         [{ pair: "Nugget/Sosis", reason: "Anak kos vibes yang real" }, { pair: "Kentang Goreng", reason: "Comfort food combo" }],
  "Matcha":       [{ pair: "Cake Slice", reason: "Earthy meets sweet" }, { pair: "Croissant", reason: "Japanese-French fusion" }],

  // Snacks pairs  
  "Kentang Goreng":   [{ pair: "Es Kopi Susu", reason: "Nongkrong duo yang perfect" }, { pair: "Milkshake", reason: "Salty + creamy = adiktif" }],
  "Nugget/Sosis":     [{ pair: "Milo", reason: "Anak kos paling relate" }, { pair: "Lemon Tea", reason: "Segar setelah gorengan" }],
  "Roti Bakar":       [{ pair: "Teh Tarik", reason: "Sarapan ala mamak" }, { pair: "Cappuccino", reason: "Morning combo terbaik" }],
  "Cireng/Dimsum":    [{ pair: "Es Kopi Susu", reason: "Street food + kopi = life" }],

  // Dessert pairs
  "Cake Slice":  [{ pair: "Latte", reason: "Elegant afternoon tea vibes" }],
  "Brownies":    [{ pair: "Espresso", reason: "Bitter + sweet masterclass" }],
  "Donat":       [{ pair: "Cappuccino", reason: "Foam + glaze yang addictive" }],
  "Croissant":   [{ pair: "Americano", reason: "Café culture authentic" }],
  "Waffle":      [{ pair: "Chocolate", reason: "Warm choco + crispy waffle" }],

  // Drinks pairs
  "Milkshake":   [{ pair: "Kentang Goreng", reason: "American diner classic" }],
  "Smoothies":   [{ pair: "Croissant", reason: "Healthy + indulgent" }],
};

// Time-based suggestions
function getTimeSuggestion(): { name: string; reason: string } {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return { name: "Cappuccino", reason: "☀️ Morning boost yang sempurna" };
  if (hour >= 10 && hour < 14) return { name: "Es Kopi Susu", reason: "🌤️ Siang panas? Kopi dingin aja!" };
  if (hour >= 14 && hour < 17) return { name: "Matcha", reason: "🍵 Afternoon pick-me-up" };
  if (hour >= 17 && hour < 20) return { name: "Teh Tarik", reason: "🌅 Senja + Teh Tarik = perfect" };
  return { name: "Chocolate", reason: "🌙 Cokelat hangat buat menemani malam" };
}

// Prices lookup
const MENU_PRICES: Record<string, number> = {
  "Kentang Goreng": 15000, "Nugget/Sosis": 18000, "Roti Bakar": 20000, "Cireng/Dimsum": 18000,
  "Espresso": 12000, "Americano": 15000, "Cappuccino": 20000, "Latte": 20000, "Mochaccino": 22000,
  "Teh Tarik": 15000, "Lemon Tea": 12000, "Chocolate": 18000, "Milo": 15000, "Matcha": 22000,
  "Es Kopi Susu": 18000, "Milkshake": 22000, "Smoothies": 25000,
  "Cake Slice": 25000, "Brownies": 18000, "Donat": 10000, "Croissant": 22000, "Waffle": 25000,
};

export default function SmartRecommendation() {
  const { cart, updateQty } = useCart();
  const [recommendations, setRecommendations] = useState<{ name: string; reason: string; price: number }[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cartItems = Object.keys(cart);
    const recs: { name: string; reason: string; price: number }[] = [];
    const addedNames = new Set<string>();

    // Cart-based recommendations
    for (const itemName of cartItems) {
      const pairings = PAIRING_MAP[itemName];
      if (pairings) {
        for (const p of pairings) {
          if (!cart[p.pair] && !addedNames.has(p.pair) && MENU_PRICES[p.pair]) {
            recs.push({ name: p.pair, reason: `Pasangan serasi untuk ${itemName}: ${p.reason}`, price: MENU_PRICES[p.pair] });
            addedNames.add(p.pair);
          }
        }
      }
    }

    // If cart is empty, show time-based suggestion
    if (recs.length === 0) {
      const timeSugg = getTimeSuggestion();
      if (MENU_PRICES[timeSugg.name]) {
        recs.push({ name: timeSugg.name, reason: timeSugg.reason, price: MENU_PRICES[timeSugg.name] });
      }
    }

    setRecommendations(recs.slice(0, 3));
  }, [cart]);

  if (recommendations.length === 0 || !isVisible) return null;

  return (
    <div className="mt-10 mb-6" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 border border-amber-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          style={{ background: "linear-gradient(135deg, rgba(44,26,18,0.9), rgba(26,16,10,0.95))" }}>
          
          {/* Ambient glow */}
          <div className="absolute top-[-50%] right-[-30%] w-[60%] h-[120%] pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-30%] left-[-20%] w-[40%] h-[80%] pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-black uppercase tracking-[0.15em]">Smart Recommendation</h3>
                  <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Pasangan Serasi • AI Suggestion</p>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-stone-600 hover:text-stone-400 transition text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={rec.name}
                  className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 hover:bg-white/[0.06] transition-all duration-500"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold text-sm group-hover:text-amber-500 transition-colors">{rec.name}</h4>
                      <p className="text-amber-500 font-black text-xs mt-1">
                        Rp {rec.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="text-lg opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">✨</span>
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed mb-4 italic">{rec.reason}</p>
                  <button
                    onClick={() => updateQty(rec.name, (cart[rec.name]?.qty || 0) + 1, rec.price)}
                    className="w-full bg-amber-600/20 hover:bg-amber-600 border border-amber-600/30 hover:border-amber-600 text-amber-500 hover:text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
