"use client";

import Link from "next/link";

export default function SocialSidebar() {
  return (
    <div
      id="floatingSocials"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4 p-4 bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-r-3xl shadow-2xl transition-all duration-500 hover:pl-6"
    >
      <Link
        href="https://instagram.com/karsacafe"
        target="_blank"
        className="group flex items-center gap-4 transition-all"
        title="Instagram"
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6"
          style={{ 
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            boxShadow: '0 4px 15px rgba(220, 39, 67, 0.3)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap text-xs font-black uppercase tracking-widest text-white drop-shadow-md">
          @karsacafe
        </span>
      </Link>

      <Link
        href="https://tiktok.com/@karsacafe"
        target="_blank"
        className="group flex items-center gap-4 transition-all"
        title="TikTok"
      >
        <div 
          className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg border border-white/10 transition-transform group-hover:scale-110 group-hover:-rotate-6"
          style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" className="stroke-cyan-400 drop-shadow-[1.5px_1.5px_0px_#ff0050]"></path>
          </svg>
        </div>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap text-xs font-black uppercase tracking-widest text-white drop-shadow-md">
          TikTok
        </span>
      </Link>

      <Link
        href="https://wa.me/yournumber"
        target="_blank"
        className="group flex items-center gap-4 transition-all"
        title="WhatsApp"
      >
        <div 
          className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
          style={{ boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap text-xs font-black uppercase tracking-widest text-white drop-shadow-md">
          WhatsApp
        </span>
      </Link>
    </div>
  );
}
