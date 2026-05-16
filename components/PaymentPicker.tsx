"use client";

import { useState } from "react";

export type PaymentMethod = "tunai" | "qris" | "transfer";

interface PaymentPickerProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: "tunai",    label: "Tunai",         icon: "💵", desc: "Bayar langsung di kasir" },
  { id: "qris",     label: "QRIS",          icon: "📱", desc: "Scan QR untuk bayar" },
  { id: "transfer", label: "Transfer Bank", icon: "🏦", desc: "BCA / Mandiri / BNI" },
];

export default function PaymentPicker({ selected, onChange }: PaymentPickerProps) {
  const [showQRIS, setShowQRIS] = useState(false);

  return (
    <div className="mt-6 p-5 bg-stone-800/50 border border-white/10 rounded-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">
        💳 Metode Pembayaran
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {PAYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              onChange(opt.id);
              if (opt.id === "qris") setShowQRIS(true);
              else setShowQRIS(false);
            }}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
              selected === opt.id
                ? "bg-amber-500/15 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/15"
            }`}
          >
            <span className={`text-xl transition-transform duration-300 ${selected === opt.id ? "scale-110" : ""}`}>
              {opt.icon}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
              selected === opt.id ? "text-amber-500" : "text-stone-500"
            }`}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-[10px] text-stone-500 mt-3 text-center italic">
        {PAYMENT_OPTIONS.find(o => o.id === selected)?.desc}
      </p>

      {/* QRIS QR Code Preview */}
      {showQRIS && selected === "qris" && (
        <div className="mt-4 p-4 bg-white rounded-xl flex flex-col items-center gap-3">
          <div className="w-32 h-32 bg-stone-100 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=KARSA-QRIS-PAYMENT`}
              alt="QRIS Code"
              className="w-28 h-28"
            />
          </div>
          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest text-center">
            Scan QRIS di atas untuk bayar
          </p>
          <p className="text-[9px] text-stone-400 text-center">
            Berlaku untuk semua e-wallet & m-banking
          </p>
        </div>
      )}

      {/* Transfer Bank Info */}
      {selected === "transfer" && (
        <div className="mt-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">BCA</span>
            <span className="text-xs font-mono font-black text-amber-500">1234 5678 90</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">Mandiri</span>
            <span className="text-xs font-mono font-black text-amber-500">0987 6543 21</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-400">BNI</span>
            <span className="text-xs font-mono font-black text-amber-500">1122 3344 55</span>
          </div>
          <p className="text-[9px] text-stone-500 text-center mt-2 italic">
            a.n. KARSA KAFE PADANG
          </p>
        </div>
      )}
    </div>
  );
}
