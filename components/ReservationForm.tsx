"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useCart } from "./CartProvider";

export default function ReservationForm() {
  const { placeReservation } = useCart();
  const [formData, setFormData] = useState({
    nama: "",
    area: "",
    jumlah: "",
    tanggal: "",
    jam: "",
    catatan: "",
  });
  
  const [capacity, setCapacity] = useState({
    indoor: { total: 10, used: 8 },
    outdoor: { total: 5, used: 2 }
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedCap = localStorage.getItem('karsa_area_capacity');
      if (savedCap) {
        requestAnimationFrame(() => {
          setCapacity(JSON.parse(savedCap));
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(errors.filter((err) => err !== e.target.name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!formData.nama) newErrors.push("nama");
    if (!formData.area) newErrors.push("area");
    if (!formData.jumlah) newErrors.push("jumlah");
    if (!formData.tanggal) newErrors.push("tanggal");
    if (!formData.jam) newErrors.push("jam");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#b45309", "#d97706", "#fcd34d", "#ffffff"],
    });

    setShowSuccess(true);

    setTimeout(() => {
      placeReservation({
        name: formData.nama,
        time: `${formData.tanggal} ${formData.jam}`,
        guests: parseInt(formData.jumlah),
        notes: `Area: ${formData.area}. ${formData.catatan}`,
      });

      setFormData({ nama: "", area: "", jumlah: "", tanggal: "", jam: "", catatan: "" });
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <section id="reservasi" className="py-20 px-4 bg-wood-800 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="%23fff" stroke-width=".5"/%3E%3C/svg%3E\')',
          }}
        ></div>
        <div className="max-w-xl mx-auto relative">
          <div className="text-center mb-10" data-aos="fade-up">
            <p className="text-amber-400 tracking-[.3em] text-xs uppercase mb-2">Book Your Spot</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100">Reservasi Meja</h2>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="glass-form rounded-2xl p-8 space-y-5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                className={`w-full bg-white/10 border text-cream-100 placeholder-stone-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                  errors.includes("nama") ? "border-red-500 shake" : "border-cream-200/20"
                }`}
              />
            </div>

            {/* Area Selection */}
            <div>
              <label className="block text-cream-200 text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <span className="text-amber-500">🪑</span> PILIH AREA DUDUK
              </label>
              <div className={`grid grid-cols-2 gap-4 ${errors.includes("area") ? "p-1 border border-red-500 rounded-2xl shake" : ""}`}>
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, area: "Indoor" }); setErrors(errors.filter(e => e !== "area")); }}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.area === "Indoor" ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                >
                  <span className="text-3xl mb-1">🏠</span>
                  <span className="text-xs font-black text-white tracking-widest uppercase">INDOOR</span>
                  <span className="text-[9px] text-green-500 font-black tracking-widest uppercase">
                    ({capacity.indoor.used}/{capacity.indoor.total} MEJA) - SEPI
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, area: "Outdoor" }); setErrors(errors.filter(e => e !== "area")); }}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.area === "Outdoor" ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                >
                  <span className="text-3xl mb-1">🌿</span>
                  <span className="text-xs font-black text-white tracking-widest uppercase">OUTDOOR</span>
                  <span className="text-[9px] text-green-500 font-black tracking-widest uppercase">
                    ({capacity.outdoor.used}/{capacity.outdoor.total} MEJA) - SEPI
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("openTableModal"))}
                className="w-full mt-3 py-3 border border-dashed border-white/20 rounded-xl text-[10px] font-bold text-stone-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2 tracking-widest uppercase"
              >
                🗺️ LIHAT PETA MEJA
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">Jumlah Orang</label>
                <select
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  className={`w-full bg-white/10 border text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition appearance-none ${
                    errors.includes("jumlah") ? "border-red-500 shake" : "border-cream-200/20"
                  }`}
                >
                  <option value="" className="text-stone-800">Pilih</option>
                  <option value="1" className="text-stone-800">1 Orang</option>
                  <option value="2" className="text-stone-800">2 Orang</option>
                  <option value="3" className="text-stone-800">3-4 Orang</option>
                  <option value="5" className="text-stone-800">5-8 Orang</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">Tanggal Kedatangan</label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full bg-white/10 border text-cream-100 placeholder-stone-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                    errors.includes("tanggal") ? "border-red-500 shake" : "border-cream-200/20"
                  }`}
                />
              </div>
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">Jam Kedatangan</label>
                <input
                  type="time"
                  name="jam"
                  value={formData.jam}
                  onChange={handleChange}
                  className={`w-full bg-white/10 border text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                    errors.includes("jam") ? "border-red-500 shake" : "border-cream-200/20"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Catatan</label>
              <textarea
                name="catatan"
                rows={3}
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Permintaan khusus..."
                className="w-full bg-white/10 border border-cream-200/20 text-cream-100 placeholder-stone-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg text-sm tracking-wider transition transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? "Memproses..." : "Kirim Reservasi"}
            </button>
          </form>
        </div>
      </section>

      {/* Success Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[80] bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 flex flex-col items-center gap-1 ${
          showSuccess ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <h4 className="font-bold">Reservasi Berhasil Terkirim!</h4>
        </div>
        <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Silakan datang sesuai jam yang dipesan</p>
      </div>
    </>
  );
}
