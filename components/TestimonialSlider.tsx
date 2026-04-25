"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  { name: 'Rina Putri', major: 'Mahasiswa Sastra Inggris UNP', rating: 5, text: 'Tempatnya cozy banget! WiFi kencang, colokan banyak, dan kopinya enak. Cocok banget buat nugas sampai malam.', avatar: '👩‍🎓' },
  { name: 'Fadli Rahman', major: 'Mahasiswa Teknik Informatika UNP', rating: 5, text: 'Karsa Cafe jadi basecamp kedua saya. Suasananya bikin fokus, dan harga mahasiswa banget!', avatar: '👨‍💻' },
  { name: 'Dinda Maharani', major: 'Mahasiswa Manajemen UNP', rating: 4, text: 'Suka banget sama Matcha Latte-nya! Tempatnya Instagramable dan staffnya ramah-ramah.', avatar: '👩‍💼' },
  { name: 'Arif Budiman', major: 'Mahasiswa Pendidikan Fisika UNP', rating: 5, text: 'Nasi goreng katsu-nya juara! Porsi besar, harga bersahabat. Langganan setiap minggu.', avatar: '👨‍🔬' },
  { name: 'Sari Wulandari', major: 'Mahasiswa Psikologi UNP', rating: 5, text: 'Area outdoor-nya asik buat diskusi kelompok. Recommended banget buat anak UNP!', avatar: '👩‍🏫' }
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const changeSlide = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(newIndex);
      setIsAnimating(false);
    }, 300);
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
    <section id="testimoni" className="py-20 px-4 bg-cream-100 dark:bg-wood-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-700 tracking-[.3em] text-xs uppercase mb-2">Social Proof</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-wood-800 dark:text-cream-100">
            Apa Kata Mereka?
          </h2>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
        </div>
        <div data-aos="fade-up" data-aos-delay="200">
          <div
            id="testimonialContainer"
            className="min-h-[200px] transition-all duration-300"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateX(30px)" : "translateX(0)",
            }}
          >
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-wood-800 dark:text-cream-100">{t.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{t.major}</p>
                </div>
              </div>
              <div className="text-amber-500 text-lg mb-3 tracking-wide">{stars}</div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic">"{t.text}"</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition flex items-center justify-center"
            >
              &#8592;
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition flex items-center justify-center"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
