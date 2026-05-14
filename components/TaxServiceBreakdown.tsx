"use client";

interface TaxServiceBreakdownProps {
  subtotal: number;
  voucherDiscount: number;
}

export function calculateTaxService(subtotal: number, voucherDiscount: number = 0) {
  const afterDiscount = subtotal - voucherDiscount;
  const serviceFee = Math.round(afterDiscount * 0.05);   // Service Charge 5%
  const taxPB1 = Math.round(afterDiscount * 0.10);       // PB1 Tax 10%
  const grandTotal = afterDiscount + serviceFee + taxPB1;
  
  return { afterDiscount, serviceFee, taxPB1, grandTotal };
}

export default function TaxServiceBreakdown({ subtotal, voucherDiscount }: TaxServiceBreakdownProps) {
  const { afterDiscount, serviceFee, taxPB1, grandTotal } = calculateTaxService(subtotal, voucherDiscount);

  if (subtotal <= 0) return null;

  return (
    <div className="space-y-2 mb-4 p-4 bg-white/[0.03] rounded-xl border border-white/5">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">📊 Rincian Biaya</p>

      <div className="flex justify-between items-center">
        <span className="text-[11px] text-stone-400">Subtotal</span>
        <span className="text-xs font-bold text-stone-300">
          Rp {subtotal.toLocaleString("id-ID")}
        </span>
      </div>

      {voucherDiscount > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-green-500">Diskon Voucher</span>
          <span className="text-xs font-bold text-green-500">
            - Rp {voucherDiscount.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      <div className="border-t border-white/5 my-2"></div>

      <div className="flex justify-between items-center">
        <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          Service Charge (5%)
        </span>
        <span className="text-xs font-bold text-stone-300">
          + Rp {serviceFee.toLocaleString("id-ID")}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          PB1 / Pajak (10%)
        </span>
        <span className="text-xs font-bold text-stone-300">
          + Rp {taxPB1.toLocaleString("id-ID")}
        </span>
      </div>

      <div className="border-t border-amber-500/20 my-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-amber-500">Grand Total</span>
          <span className="text-xl font-black text-amber-500 tracking-tighter">
            Rp {grandTotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <p className="text-[8px] text-stone-600 text-center italic mt-1">
        * Harga sudah termasuk PB1 10% dan service charge 5%
      </p>
    </div>
  );
}
