"use client";

import { useKarsa } from "./KarsaContext";

export default function LoyaltyCard() {
  const { userPoints, addUserPoints, userName } = useKarsa();

  // If user is not logged in, points default to 0
  const points = userName ? Math.min(userPoints, 5) : 0;
  const hasCoupon = points >= 5;

  const claimCoupon = async () => {
    if (points >= 5) {
      try {
        await addUserPoints(-5);
        alert("🎉 Kupon Kopi Gratis berhasil diklaim! Tunjukkan ke kasir.");
      } catch (e) {
        console.error("Deducting loyalty points failed", e);
      }
    }
  };

  return (
    <div className="mt-12 flex justify-center" data-aos="fade-up">
      <div className="max-w-[340px] w-full">
        <div className="relative overflow-hidden rounded-[20px] p-6 border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
          style={{ background: "linear-gradient(135deg, #2c1a12 0%, #1a100a 100%)" }}>
          {/* Ambient glow */}
          <div className="absolute top-[-50%] right-[-50%] w-full h-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-1">
              <p className="text-amber-500/50 text-[9px] font-extrabold uppercase tracking-[0.2em]">🎫 Karsa Loyalty Card</p>
              <p className="text-white/30 text-[10px] font-bold">{points}/5 Stamp</p>
            </div>

            {/* Stamp Grid */}
            <div className="grid grid-cols-5 gap-3 my-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-[22px] transition-all duration-400 ${
                    i < points
                      ? "border-2 border-amber-500 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "border-2 border-dashed border-white/15"
                  }`}
                  style={i < points ? { animation: "stampBounce 0.5s ease" } : {}}
                >
                  {i < points ? "☕" : ""}
                </div>
              ))}
            </div>

            <p className="text-white/40 text-[10px] text-center">
              Kumpulkan 5 stamp, dapet 1 Kopi Gratis!
            </p>

            {hasCoupon && (
              <div className="mt-3.5 p-4 rounded-2xl text-center border border-green-500/30"
                style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", animation: "couponPop 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <p className="text-green-500 text-sm font-black">🎉 Selamat! Kamu dapet 1 Kopi Gratis!</p>
                <p className="text-green-500/60 text-[10px] mt-1">Tunjukkan ke kasir untuk klaim</p>
                <button
                  onClick={claimCoupon}
                  className="mt-2.5 bg-green-500 text-white px-5 py-2 rounded-[10px] text-[11px] font-extrabold uppercase tracking-wider cursor-pointer hover:bg-green-400 transition-all"
                >
                  Klaim Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes stampBounce {
          0% { transform: scale(0); }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes couponPop {
          0% { transform: scale(0) rotate(-5deg); opacity: 0; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
