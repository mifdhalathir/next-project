"use client";

interface TaxServiceBreakdownProps {
  subtotal: number;
  voucherDiscount: number;
}

export function calculateTaxService(subtotal: number, voucherDiscount: number = 0) {
  const afterDiscountValue = subtotal - voucherDiscount;
  const serviceFee = Math.round(afterDiscountValue * 0.05);   // Service Charge 5%
  const taxPB1 = Math.round(afterDiscountValue * 0.10);       // PB1 Tax 10%
  const grandTotal = afterDiscountValue + serviceFee + taxPB1;
  
  return { afterDiscount: afterDiscountValue, serviceFee, taxPB1, grandTotal };
}

export default function TaxServiceBreakdown({ subtotal, voucherDiscount }: TaxServiceBreakdownProps) {
  const { afterDiscount, serviceFee, taxPB1, grandTotal } = calculateTaxService(subtotal, voucherDiscount);

  if (subtotal <= 0) return null;

  return (
    <div className="space-y-3 p-6 bg-stone-900/50 rounded-2xl border border-white/5  mb-6">
      <div className="flex justify-between text-xs text-stone-400 font-medium">
        <span>Subtotal</span>
        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>
      
      {voucherDiscount > 0 && (
        <div className="flex justify-between text-xs text-green-500 font-bold">
          <span>Voucher Diskon</span>
          <span>-Rp {voucherDiscount.toLocaleString("id-ID")}</span>
        </div>
      )}

      <div className="flex justify-between text-xs text-stone-300 font-bold border-t border-white/5 pt-3">
        <span>Setelah Diskon</span>
        <span>Rp {afterDiscount.toLocaleString("id-ID")}</span>
      </div>

      <div className="flex justify-between text-xs text-stone-400">
        <span>Service Charge (5%)</span>
        <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between text-xs text-stone-400">
        <span>PB1 Tax (10%)</span>
        <span>Rp {taxPB1.toLocaleString("id-ID")}</span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <span className="text-sm font-black text-white uppercase tracking-widest">Total Bayar</span>
        <span className="text-xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          Rp {grandTotal.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
