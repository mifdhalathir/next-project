"use client";

import Link from "next/link";

export default function MapsSection() {
  return (
    <section id="maps" className="py-20 px-4 bg-wood-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-400 tracking-[.3em] text-xs uppercase mb-2">Lokasi</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100">Temukan Kami</h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg" data-aos="fade-up" data-aos-delay="200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.296!2d100.348!3d-0.895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTMnNDIuMCJTIDEwMMKwMjAnNTMuMCJF!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="text-center mt-8" data-aos="fade-up" data-aos-delay="400">
          <Link
            href="https://www.google.com/maps/search/Karsa+Cafe+Padang+Air+Tawar"
            target="_blank"
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full text-sm tracking-wider transition transform hover:scale-105"
          >
            📍 Buka di Google Maps
          </Link>
        </div>
      </div>
    </section>
  );
}
