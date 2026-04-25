"use client";

import { useCart } from "./CartProvider";

export default function OrderTrackerCard() {
  const { activeOrder } = useCart();

  if (!activeOrder || activeOrder.status === "completed") return null;

  const getProgress = () => {
    switch (activeOrder.status) {
      case "received": return 25;
      case "preparing": 
      case "cooked": return 60;
      case "ready": return 100;
      default: return 0;
    }
  };

  const getStatusText = () => {
    switch (activeOrder.status) {
      case "received": return "Pesanan Diterima";
      case "preparing": return "Sedang Dimasak";
      case "cooked": return "Hampir Siap";
      case "ready": return "Siap Antar / Ambil!";
      default: return "";
    }
  };

  const progress = getProgress();

  return (
    <div 
      className="fixed bottom-32 right-6 z-[45] w-72 glass-form p-6 rounded-3xl border border-amber-500/30 shadow-2xl animate-in slide-in-from-right duration-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Status Pesanan</h4>
          <p className="text-sm font-black text-white">{activeOrder.id}</p>
        </div>
        <div className="bg-amber-500/10 p-2 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
           <span className={`text-[11px] font-bold ${progress === 100 ? 'text-green-400' : 'text-stone-400'}`}>
             {getStatusText()}
           </span>
           <span className="text-[10px] font-mono text-amber-500">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
           <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                progress === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500'
              } ${progress === 60 ? 'animate-pulse' : ''}`}
              style={{ width: `${progress}%` }}
           ></div>
        </div>
      </div>

      <p className="text-[9px] text-stone-500 italic">
        {progress < 100 ? "Harap tunggu sebentar, kru kami sedang bekerja." : "Silakan menuju konter atau tunggu kru mengantar ke mejamu."}
      </p>
    </div>
  );
}
