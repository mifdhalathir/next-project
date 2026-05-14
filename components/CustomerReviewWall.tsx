"use client";

import { useState, useEffect, FormEvent } from "react";

type Review = { nama: string; komentar: string; waktu: string };

export default function CustomerReviewWall() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nama, setNama] = useState("");
  const [komentar, setKomentar] = useState("");

  const loadReviews = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("karsa_customer_reviews") || "[]");
      setReviews(saved);
    } catch { setReviews([]); }
  };

  useEffect(() => {
    loadReviews();
    // Auto-fill name from logged-in user
    const savedName = localStorage.getItem("karsa_user_name");
    if (savedName && !nama) setNama(savedName);
    const interval = setInterval(loadReviews, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !komentar.trim()) return;
    const newReview: Review = { nama: nama.trim(), komentar: komentar.trim(), waktu: new Date().toLocaleDateString("id-ID") };
    const updated = [...reviews, newReview];
    localStorage.setItem("karsa_customer_reviews", JSON.stringify(updated));
    setReviews(updated);
    setNama("");
    setKomentar("");
  };

  const doubled = reviews.length > 0 ? [...reviews, ...reviews] : [];

  return (
    <section className="py-24 px-4 bg-theme-secondary relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.4em] text-[10px] uppercase mb-3 font-black">💬 Testimoni</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-theme tracking-tighter italic uppercase">
            Apa Kata <span className="text-amber-500">Karsa-Lovers?</span>
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        {/* Auto-Carousel */}
        <div className="overflow-hidden mb-12 relative" data-aos="fade-up" data-aos-delay="100">
          {reviews.length === 0 ? (
            <p className="text-stone-400 text-sm italic text-center py-8">Belum ada review. Jadi yang pertama!</p>
          ) : (
            <div className="review-track flex gap-4 hover:[animation-play-state:paused]">
              {doubled.map((r, i) => (
                <div key={i} className="min-w-[280px] max-w-[280px] flex-shrink-0 bg-stone-900 rounded-2xl p-5 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#b45309)" }}>
                      {r.nama[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-white">{r.nama}</p>
                      <p className="text-[10px] text-stone-500">{r.waktu}</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-stone-400 italic">&ldquo;{r.komentar}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="max-w-md mx-auto" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-stone-900 p-6 rounded-3xl border border-white/5 shadow-xl">
            <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-[0.2em] mb-4">✍️ Tulis Review Kamu</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              />
              <textarea
                rows={3}
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder="Ceritakan pengalamanmu di Karsa Cafe..."
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition resize-none"
              />
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-900/40"
              >
                Kirim Review
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .review-track {
          animation: scrollReview 30s linear infinite;
          width: max-content;
        }
        @keyframes scrollReview {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
