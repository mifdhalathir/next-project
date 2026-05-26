"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { useCart } from "./CartProvider";
import { useKarsa } from "./KarsaContext";

function getAreaLabel(used: number, total: number) {
  const ratio = used / total;
  if (ratio >= 1) return { label: "PENUH", color: "text-red-500" };
  if (ratio >= 0.7) return { label: "RAMAI", color: "text-amber-400" };
  if (ratio >= 0.4) return { label: "SEDANG", color: "text-yellow-400" };
  return { label: "SEPI", color: "text-green-500" };
}

export default function ReservationForm() {
  const { placeReservation } = useCart();
  const { tables } = useKarsa();
  
  const [formData, setFormData] = useState({
    nama: "",
    area: "",
    jumlah: "",
    tanggal: "",
    jam: "",
    catatan: "",
  });

  const [selectedTableNumber, setSelectedTableNumber] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute capacity reactively from the Firestore table list
  const indoorUsed = tables.filter((t) => t.area === "Indoor" && t.status !== "available").length;
  const outdoorUsed = tables.filter((t) => t.area === "Outdoor" && t.status !== "available").length;

  const capacity = {
    indoor: { total: 10, used: indoorUsed },
    outdoor: { total: 5, used: outdoorUsed },
  };

  useEffect(() => {
    const savedName = localStorage.getItem("karsa_user_name");
    if (savedName) {
      setFormData((prev) => ({ ...prev, nama: savedName }));
    }

    // Listen for table selection from SmartTableModal (reservationPick mode)
    const handleTableSelected = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        const tableLabel = `${detail.area === "Outdoor" ? "O" : "I"}${detail.tableNumber}`;
        setSelectedTableNumber(tableLabel);
        setFormData((prev) => ({ ...prev, area: detail.area }));
        // Clear area error if any
        setErrors((prev) => {
          const next = { ...prev };
          delete next.area;
          return next;
        });
      }
    };

    window.addEventListener("reservationTableSelected", handleTableSelected);

    // Cleanup timers and event listener on unmount
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      window.removeEventListener("reservationTableSelected", handleTableSelected);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.area) newErrors.area = "Pilih area duduk terlebih dahulu";
    if (!formData.jumlah) newErrors.jumlah = "Pilih jumlah orang";
    if (!formData.tanggal) newErrors.tanggal = "Pilih tanggal kedatangan";
    if (!formData.jam) newErrors.jam = "Pilih jam kedatangan";

    // Validate tanggal is not in the past
    if (formData.tanggal) {
      const today = new Date().toISOString().split("T")[0];
      if (formData.tanggal < today) {
        newErrors.tanggal = "Tanggal tidak boleh di masa lalu";
      }
    }

    // Validate jam operasional (08:00 - 21:59)
    if (formData.jam && !newErrors.jam) {
      const [h, m] = formData.jam.split(":").map(Number);
      if (h < 8 || h >= 22) {
        newErrors.jam = "Jam harus antara 08:00 — 21:59";
      }
    }

    // Check if selected area is full
    if (formData.area === "Indoor" && capacity.indoor.total - capacity.indoor.used <= 0) {
      newErrors.area = "Area Indoor sudah penuh, pilih Outdoor";
    }
    if (formData.area === "Outdoor" && capacity.outdoor.total - capacity.outdoor.used <= 0) {
      newErrors.area = "Area Outdoor sudah penuh, pilih Indoor";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Capture form data before resetting (avoid stale closure bug)
    const submittedData = { ...formData };

    setIsSubmitting(true);
    try {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#b45309", "#d97706", "#fcd34d", "#ffffff"],
      });
    } catch (err) {
      // Confetti may fail in some environments, don't block submission
    }

    setShowSuccess(true);

    // Use captured data, not formData from closure
    submitTimerRef.current = setTimeout(() => {
      placeReservation({
        name: submittedData.nama,
        time: `${submittedData.tanggal} ${submittedData.jam}`,
        guests: parseInt(submittedData.jumlah),
        notes: submittedData.catatan,
        area: submittedData.area as "Indoor" | "Outdoor" | undefined,
        tableNumber: selectedTableNumber || undefined,
      });

      // Reset form but keep nama from localStorage
      const savedName = localStorage.getItem("karsa_user_name") || "";
      setFormData({
        nama: savedName,
        area: "",
        jumlah: "",
        tanggal: "",
        jam: "",
        catatan: "",
      });
      setSelectedTableNumber("");
      setIsSubmitting(false);
      setErrors({});

      successTimerRef.current = setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const indoorLabel = getAreaLabel(capacity.indoor.used, capacity.indoor.total);
  const outdoorLabel = getAreaLabel(capacity.outdoor.used, capacity.outdoor.total);
  const indoorAvailable = capacity.indoor.total - capacity.indoor.used;
  const outdoorAvailable = capacity.outdoor.total - capacity.outdoor.used;

  const hasErrors = Object.keys(errors).length > 0;

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
            <p className="text-amber-400 tracking-[.3em] text-xs uppercase mb-2">
              Book Your Spot
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100">
              Reservasi Meja
            </h2>
            <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
          </div>

          {/* Error Summary Banner */}
          {hasErrors && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300" data-aos="fade-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-sm">⚠️</span>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Mohon lengkapi data berikut:</p>
              </div>
              <ul className="space-y-1">
                {Object.values(errors).map((msg, i) => (
                  <li key={i} className="text-red-300/80 text-xs flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-red-400 rounded-full shrink-0"></span>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="glass-form rounded-2xl p-8 space-y-5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                className={`w-full bg-white/10 border text-cream-100 placeholder-stone-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                  errors.nama
                    ? "border-red-500 shake"
                    : "border-cream-200/20"
                }`}
              />
              {errors.nama && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.nama}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("openTableModal", {
                      detail: { 
                        directMap: !!formData.area, 
                        viewOnly: true, 
                        reservationPick: true,
                        area: formData.area || undefined
                      },
                    })
                  );
                }}
                className="w-full block mt-3 relative z-10 py-3 border border-dashed border-amber-500/30 bg-amber-500/5 rounded-xl text-[10px] font-black text-amber-500 hover:text-white hover:bg-amber-500 hover:border-amber-500 transition-all flex items-center justify-center gap-2 tracking-widest uppercase"
              >
                🗺️ LIHAT PETA MEJA
              </button>

              {/* Selected Table Badge */}
              {selectedTableNumber && (
                <div className="mt-2 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 animate-in slide-in-from-top-2 duration-300">
                  <span className="text-sm">🪑</span>
                  <span className="text-amber-400 text-xs font-bold">Meja {selectedTableNumber} dipilih</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTableNumber("")}
                    className="ml-auto text-stone-500 hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Area Selection */}
            <div>
              <label className="block text-cream-200 text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <span className="text-amber-500">🪑</span> PILIH AREA DUDUK
              </label>
              <div
                className={`grid grid-cols-2 gap-4 ${
                  errors.area
                    ? "p-1 border border-red-500 rounded-2xl shake"
                    : ""
                }`}
              >
                {/* Indoor Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (indoorAvailable <= 0) return;
                    setFormData((prev) => ({ ...prev, area: "Indoor" }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.area;
                      return next;
                    });
                  }}
                  disabled={indoorAvailable <= 0}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                    indoorAvailable <= 0
                      ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                      : formData.area === "Indoor"
                      ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-3xl mb-1">🏠</span>
                  <span className="text-xs font-black text-white tracking-widest uppercase">
                    INDOOR
                  </span>
                  <span
                    className={`text-[9px] font-black tracking-widest uppercase ${indoorLabel.color}`}
                  >
                    {indoorAvailable} MEJA TERSEDIA — {indoorLabel.label}
                  </span>
                  {/* Capacity bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        indoorLabel.label === "PENUH"
                          ? "bg-red-500"
                          : indoorLabel.label === "RAMAI"
                          ? "bg-amber-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          (capacity.indoor.used / capacity.indoor.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </button>

                {/* Outdoor Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (outdoorAvailable <= 0) return;
                    setFormData((prev) => ({ ...prev, area: "Outdoor" }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.area;
                      return next;
                    });
                  }}
                  disabled={outdoorAvailable <= 0}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                    outdoorAvailable <= 0
                      ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                      : formData.area === "Outdoor"
                      ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-3xl mb-1">🌿</span>
                  <span className="text-xs font-black text-white tracking-widest uppercase">
                    OUTDOOR
                  </span>
                  <span
                    className={`text-[9px] font-black tracking-widest uppercase ${outdoorLabel.color}`}
                  >
                    {outdoorAvailable} MEJA TERSEDIA — {outdoorLabel.label}
                  </span>
                  {/* Capacity bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        outdoorLabel.label === "PENUH"
                          ? "bg-red-500"
                          : outdoorLabel.label === "RAMAI"
                          ? "bg-amber-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          (capacity.outdoor.used / capacity.outdoor.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </button>
              </div>
              {errors.area && (
                <p className="text-red-400 text-[10px] mt-2 font-medium">{errors.area}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">
                  Jumlah Orang
                </label>
                <select
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  className={`w-full bg-white/10 border text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition appearance-none ${
                    errors.jumlah
                      ? "border-red-500 shake"
                      : "border-cream-200/20"
                  }`}
                >
                  <option value="" className="text-stone-800">
                    Pilih
                  </option>
                  <option value="1" className="text-stone-800">
                    1 Orang
                  </option>
                  <option value="2" className="text-stone-800">
                    2 Orang
                  </option>
                  <option value="3" className="text-stone-800">
                    3-4 Orang
                  </option>
                  <option value="5" className="text-stone-800">
                    5-8 Orang
                  </option>
                </select>
                {errors.jumlah && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.jumlah}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">
                  Tanggal Kedatangan
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full bg-white/10 border text-cream-100 placeholder-stone-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                    errors.tanggal
                      ? "border-red-500 shake"
                      : "border-cream-200/20"
                  }`}
                />
                {errors.tanggal && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.tanggal}</p>
                )}
              </div>
              <div>
                <label className="block text-cream-200 text-sm mb-1.5">
                  Jam Kedatangan
                </label>
                <input
                  type="time"
                  name="jam"
                  value={formData.jam}
                  onChange={handleChange}
                  min="08:00"
                  max="21:59"
                  className={`w-full bg-white/10 border text-cream-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition ${
                    errors.jam
                      ? "border-red-500 shake"
                      : "border-cream-200/20"
                  }`}
                />
                {errors.jam ? (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.jam}</p>
                ) : (
                  <p className="text-stone-500 text-[9px] mt-1 tracking-wide">
                    Jam operasional: 08:00 — 22:00
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">
                Catatan
              </label>
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
          showSuccess
            ? "translate-y-0 opacity-100"
            : "-translate-y-32 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <h4 className="font-bold">Reservasi Berhasil Terkirim!</h4>
        </div>
        <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">
          Silakan datang sesuai jam yang dipesan
        </p>
      </div>
    </>
  );
}