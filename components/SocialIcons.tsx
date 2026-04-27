"use client";

import Link from "next/link";

interface SocialIconsProps {
  className?: string;
  iconSize?: number;
}

export default function SocialIcons({ className = "", iconSize = 16 }: SocialIconsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        href="https://instagram.com/karsacafe"
        target="_blank"
        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
        style={{ 
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
        }}
        title="Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </Link>

      <Link
        href="https://tiktok.com/@karsacafe"
        target="_blank"
        className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-white/10"
        title="TikTok"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" className="stroke-cyan-400 drop-shadow-[1px_1px_0px_#ff0050]"></path>
        </svg>
      </Link>

      <Link
        href="https://wa.me/yournumber"
        target="_blank"
        className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
        title="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </Link>
    </div>
  );
}
