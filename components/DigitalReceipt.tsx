"use client";

import { useEffect, useState } from "react";
import { Order } from "./CartProvider";

interface DigitalReceiptProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalReceipt({ order, isOpen, onClose }: DigitalReceiptProps) {
  const qrUrl = order ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.id}` : "";

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="receipt-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 transition-all duration-500">
      {/* Container for roll animation */}
      <div className="relative w-full max-w-md animate-[receiptRoll_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] origin-top">
        {/* Print Machine Slot Simulation */}
        <div className="absolute -top-4 left-4 right-4 h-8 bg-stone-900 rounded-full shadow-inner z-20 print:hidden border-b-4 border-stone-800"></div>

        {/* Paper Receipt Card */}
        <div className="relative bg-white text-stone-900 border-x border-b border-stone-200 rounded-b-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] pt-12 p-8 print:bg-white print:text-black print:rounded-none print:shadow-none print:border-none print:pt-0 mt-4">
          
          {/* Dashed cut line detail */}
          <div className="absolute top-8 left-0 right-0 border-t-2 border-dashed border-stone-300 print:hidden"></div>
          <div className="absolute top-6 right-4 text-[8px] text-stone-400 uppercase tracking-widest print:hidden">✂ cut here</div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/20 rounded-full"></div>

          {/* Receipt Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8 mt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 shadow-inner">
                <span className="text-2xl">☕</span>
              </div>
              <h2 className="font-display text-2xl font-black tracking-tighter uppercase mb-1 text-stone-900">Karsa Kafe</h2>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.3em]">Digital Receipt • Official</p>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-sm font-black text-amber-600">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1">Table No.</p>
                <p className="text-sm font-black text-amber-600">#{order.tableNumber}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1">Customer</p>
                <p className="text-sm font-bold truncate text-stone-800">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-stone-500 uppercase tracking-widest mb-1">Date</p>
                <p className="text-sm font-bold text-stone-800">{new Date(order.timestamp).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3 mb-8">
              <p className="text-[9px] text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-2">Order Items</p>
              <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 w-6 h-6 flex items-center justify-center rounded-lg">{item.qty}x</span>
                      <span className="text-sm font-medium text-stone-800">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-stone-900">Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Total Amount</span>
                <span className="text-2xl font-black text-stone-900 tracking-tighter">Rp {order.total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center mb-8 p-6 bg-white rounded-[2rem]">
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                {qrUrl ? (
                  <img src={qrUrl} alt="Order QR" className="relative z-10 w-32 h-32" />
                ) : (
                  <div className="w-32 h-32 bg-stone-100 animate-pulse rounded-xl"></div>
                )}
              </div>
              <p className="text-[10px] text-stone-500 font-bold mt-4 text-center uppercase tracking-widest">Scan at cashier for pickup</p>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Simpan Struk
              </button>
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Print Only & Keyframes Styles */}
        <style jsx global>{`
          @keyframes receiptRoll {
            0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:hidden {
              display: none !important;
            }
            #receipt-modal, #receipt-modal * {
              visibility: visible;
            }
            #receipt-modal {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
