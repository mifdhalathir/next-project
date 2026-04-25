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
      {/* Floating Order Bar (Toast) */}
      <div
        className={`fixed bottom-24 left-6 z-[45] bg-white dark:bg-wood-800 px-5 py-3 rounded-2xl shadow-xl transition-all duration-500 flex items-center gap-4 border border-amber-200 dark:border-wood-700 ${
          total > 0 ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">
          🛒
        </div>
        <div>
          <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide">
            Total Pesanan
          </p>
          <p className="font-bold text-lg text-amber-700 dark:text-amber-500">
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>
        <button
          onClick={checkout}
          className="ml-4 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wider transition"
        >
          Pesan
        </button>
      </div>

      {/* Order FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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
        className={`fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity flex justify-end ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div
          className={`w-full max-w-md bg-cream-50 dark:bg-wood-900 h-full shadow-2xl flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
            <h3 className="font-display text-xl font-bold text-wood-800 dark:text-cream-100">
              Pesanan Meja
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-cream-100 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h4 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Keranjang Anda
            </h4>
            <div className="space-y-3">
              {cartArray.length === 0 ? (
                <p className="text-stone-500 dark:text-stone-400 text-sm italic">
                  Keranjang masih kosong.
                </p>
              ) : (
                cartArray.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-cream-100 dark:bg-stone-800 p-3 rounded-lg"
                  >
                    <span className="text-sm font-bold text-wood-800 dark:text-cream-100">
                      {item.name} <span className="text-amber-700">x{item.qty}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-amber-700 font-semibold">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-wood-800 border-t border-stone-200 dark:border-stone-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-500 dark:text-stone-400">Total Pembayaran:</span>
              <span className="font-bold text-xl text-amber-700">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={checkout}
              disabled={total === 0}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white py-3 rounded-lg font-bold tracking-wider transition"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
