"use client";

import { useState, useEffect } from "react";

export default function MembershipSection() {
  const [userName, setUserName] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const checkUser = () => {
      const name = localStorage.getItem("karsa_user_name");
      setUserName(name);
      if (name) {
        const userPoints = Number(localStorage.getItem(`karsa_points_${name}`) || 0);
        setPoints(userPoints);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const tiers = [
    { name: "Bronze", min: 0, color: "text-amber-700", bg: "bg-amber-700/10", border: "border-amber-700/20" },
    { name: "Silver", min: 100, color: "text-stone-300", bg: "bg-stone-300/10", border: "border-stone-300/20" },
    { name: "Gold", min: 500, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  const currentTier = [...tiers].reverse().find(t => points >= t.min) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];

  return (
    <section id="rewards" className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div data-aos="fade-right">
            <span className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3 block">Exclusive Program</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase mb-6">
              Karsa <span className="text-amber-500">Elite</span> Rewards
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-lg">
              Kumpulkan poin dari setiap pesananmu dan tukarkan dengan berbagai keuntungan eksklusif, mulai dari gratis kopi hingga akses workshop spesial.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {tiers.map((tier) => (
                <div 
                  key={tier.name}
                  className={`p-6 rounded-[2rem] border transition-all duration-500 ${tier.name === currentTier.name ? `${tier.bg} ${tier.border} scale-105 shadow-xl` : "bg-white/5 border-white/5 opacity-40 grayscale"}`}
                >
                  <div className={`text-2xl mb-2 ${tier.color}`}>✦</div>
                  <h4 className={`font-black text-sm uppercase tracking-widest ${tier.color}`}>{tier.name}</h4>
                  <p className="text-[10px] text-stone-500 font-bold mt-1">{tier.min}+ Points</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="absolute inset-0 bg-amber-600/20 blur-[100px] rounded-full"></div>
            
            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              </div>

              {userName ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-3xl">
                      {userName[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-2xl tracking-tight">{userName}</h3>
                      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${currentTier.color}`}>{currentTier.name} Member</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest font-black block mb-2">Total Karsa Points</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-white tracking-tighter">{points}</span>
                      <span className="text-amber-500 font-bold uppercase text-[10px] tracking-widest">Points</span>
                    </div>
                    
                    {nextTier && (
                      <div className="mt-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                          <span className="text-stone-500">Progress to {nextTier.name}</span>
                          <span className="text-amber-500">{Math.round((points / nextTier.min) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
                            style={{ width: `${Math.min((points / nextTier.min) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-white text-black py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 transition-all shadow-xl active:scale-95">
                    Tukarkan Hadiah 🎁
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-amber-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <span className="text-4xl">🔐</span>
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tight mb-4">Mulai Kumpulkan Poin</h3>
                  <p className="text-stone-500 text-sm mb-8 px-4">Login sekarang untuk melihat status keanggotaan dan poin hadiahmu.</p>
                  <button className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-amber-900/40">
                    Login Membership
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
