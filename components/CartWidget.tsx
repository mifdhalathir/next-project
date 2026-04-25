"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function CartWidget() {
  const { cart, total, totalItems, removeFromCart, addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartArray = Object.values(cart);

  const checkout = () => {
    if (total === 0) return;
    let msg = "Halo Karsa Cafe, saya ingin memesan menu berikut dari meja:\n\n";
    for (const item of cartArray) {
      msg += `- ${item.name} (${item.qty}x) = Rp ${(item.price * item.qty).toLocaleString("id-ID")}\n`;
    }
    msg += `\n*Total: Rp ${total.toLocaleString("id-ID")}*`;

    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <>
      {/* Sticky Order Bar at Bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[55] bg-stone-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 transition-all duration-500 transform ${
          total > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-amber-600/20 items-center justify-center text-2xl shadow-inner border border-amber-600/30">
              🛒
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.3em] mb-0.5">
                Ringkasan Pesanan
              </p>
              <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Total Pesanan: <span className="text-amber-500 ml-1">Rp {total.toLocaleString("id-ID")}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="hidden md:flex items-center gap-2 text-stone-400 hover:text-white transition text-xs font-bold uppercase tracking-widest px-4"
            >
              Lihat Detail ({totalItems})
            </button>
            <button
              onClick={checkout}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black tracking-[0.2em] uppercase transition transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-900/40 flex items-center gap-2"
            >
              <span>Pesan via WA</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal Toggle FAB (Hidden when sticky bar is active to avoid clutter, or kept for mobile) */}
      <div className={`fixed bottom-24 right-6 z-50 transition-all duration-500 ${total > 0 ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-amber-700 hover:bg-amber-800 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 text-2xl relative"
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Cart Modal */}
      <div
        className={`fixed inset-0 bg-black/80 z-[60] backdrop-blur-md transition-opacity flex justify-end ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div
          className={`w-full max-w-md bg-wood-900 h-full shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Daftar Pesanan
              </h3>
              <p className="text-stone-500 text-xs uppercase tracking-widest mt-1">Meja #01 • Karsa Kafe</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {cartArray.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center text-4xl mb-4 opacity-20">🛒</div>
                <p className="text-stone-500 text-sm italic">
                  Keranjang Anda masih kosong.<br/>Pilih menu favorit Anda sekarang!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartArray.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-amber-500/30 transition-colors group"
                  >
                    <div>
                      <span className="block text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-xs text-stone-500">Rp {item.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-stone-800 rounded-xl px-2 py-1">
                        <button onClick={() => removeFromCart(item.name)} className="text-stone-400 hover:text-white">-</button>
                        <span className="text-xs font-bold text-amber-500 w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item.name, item.price)} className="text-stone-400 hover:text-white">+</button>
                      </div>
                      <span className="text-sm font-black text-white w-20 text-right">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 bg-stone-900 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-stone-500 uppercase tracking-widest text-xs font-bold">Total Pembayaran</span>
              <span className="font-black text-3xl text-amber-500 tracking-tighter">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={checkout}
              disabled={total === 0}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:grayscale text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-900/40"
            >
              Konfirmasi & Pesan via WA
            </button>
          </div>
        </div>
      </div>
    </>

  );
}
