"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 15) {
      setGreeting("Selamat Pagi, Kak! Udah siap nugas?");
    } else if (hour >= 15 && hour < 19) {
      setGreeting("Senja di Karsa paling asik bareng Mocktail");
    } else {
      setGreeting("Lembur tugas? Kopi Susu Karsa siap nemenin");
    }
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source
          src="https://cdn.pixabay.com/video/2023/10/22/186121-877112316_tiny.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-overlay absolute inset-0"></div>
      <div className="relative text-center px-4" data-aos="fade-right" data-aos-duration="1000">
        <p className="text-amber-400 tracking-[.15em] text-sm mb-2 font-bold uppercase">
          {greeting}
        </p>
        <p
          className="text-amber-400/80 tracking-[.35em] text-xs mb-4 uppercase blur-reveal"
          style={{ animationDelay: "0.5s" }}
        >
          Est. 2024 &bull; Padang
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-tight mb-6 flex flex-col items-center">
          <span className="typewriter border-r-4 border-amber-400 overflow-hidden whitespace-nowrap inline-block">
            Ruang Inspirasi
          </span>
          <span
            className="blur-reveal block text-3xl sm:text-4xl mt-2 text-cream-200"
            style={{ animationDelay: "2s" }}
          >
            di Air Tawar
          </span>
        </h1>
        <p
          className="blur-reveal text-cream-200 text-lg md:text-xl max-w-xl mx-auto mb-8"
          style={{ animationDelay: "2.5s" }}
        >
          Tempat nugas, ngopi, dan diskusi paling nyaman untuk mahasiswa Air Tawar dan sekitarnya.
        </p>
        <Link
          href="#menu"
          className="blur-reveal inline-block bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full text-sm tracking-wider transition transform hover:scale-105"
          style={{ animationDelay: "3s" }}
        >
          Lihat Menu
        </Link>
      </div>
    </section>
  );
}
