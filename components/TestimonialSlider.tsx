"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  { name: 'Rina Putri', major: 'Mahasiswa Sastra Inggris UNP', rating: 5, text: 'Tempatnya cozy banget! WiFi kencang, colokan banyak, dan kopinya enak. Cocok banget buat nugas sampai malam.', avatar: '👩‍🎓' },
  { name: 'Fadli Rahman', major: 'Mahasiswa Teknik Informatika UNP', rating: 5, text: 'Karsa Cafe jadi basecamp kedua saya. Suasananya bikin fokus, dan harga mahasiswa banget!', avatar: '👨‍💻' },
  { name: 'Dinda Maharani', major: 'Mahasiswa Manajemen UNP', rating: 5, text: 'Suka banget sama Matcha Latte-nya! Tempatnya Instagramable dan staffnya ramah-ramah.', avatar: '👩‍💼' },
  { name: 'Arif Budiman', major: 'Mahasiswa Pendidikan Fisika UNP', rating: 5, text: 'Nasi goreng katsu-nya juara! Porsi besar, harga bersahabat. Langganan setiap minggu.', avatar: '👨‍🔬' },
  { name: 'Sari Wulandari', major: 'Mahasiswa Psikologi UNP', rating: 5, text: 'Area outdoor-nya asik buat diskusi kelompok. Recommended banget buat anak UNP!', avatar: '👩‍🏫' }
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const changeSlide = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(newIndex);
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    changeSlide((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    changeSlide((current + 1) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[current];
  const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);

  return (
    <section id="testimoni" className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)' }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase mb-3 block">Social Proof</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
            Apa Kata <span className="text-amber-500">Mereka?</span>
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto mt-6"></div>
        </div>

        <div className="relative min-h-[350px] flex items-center justify-center">
          <div
            className={`w-full transition-all duration-700 ease-out flex flex-col items-center ${
              isAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
            }`}
          >
            <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group max-w-2xl w-full text-center">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 text-6xl text-amber-500/10 font-serif leading-none select-none">“</div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-amber-900/20 transition-transform duration-500 hover:scale-110">
                  {t.avatar}
                </div>
                
                <div className="text-amber-500 text-sm mb-6 tracking-[0.2em] font-black">{stars}</div>
                
                <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed italic mb-10 px-4">
                  "{t.text}"
                </p>
                
                <div>
                  <h4 className="font-black text-white text-xl tracking-tight uppercase italic mb-1">{t.name}</h4>
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">{t.major}</p>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 text-6xl text-amber-500/10 font-serif leading-none select-none rotate-180">“</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-12 mt-12" data-aos="fade-up">
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-500 flex items-center justify-center group active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button 
                key={i}
                onClick={() => changeSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-amber-500' : 'w-2 bg-white/10 hover:bg-white/20'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-500 flex items-center justify-center group active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
}
