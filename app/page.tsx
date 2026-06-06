"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import ReservationForm from "@/components/ReservationForm";
import Gallery from "@/components/Gallery";
import MapsSection from "@/components/MapsSection";
import Footer from "@/components/Footer";
import CartWidget from "@/components/CartWidget";
import FABMenu from "@/components/FABMenu";
import CeritaKami from "@/components/CeritaKami";
import OfflineToast from "@/components/OfflineToast";
import LoyaltyCard from "@/components/LoyaltyCard";
import AreaBanner from "@/components/AreaBanner";
import SmartTableModal from "@/components/SmartTableModal";

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 50,
      duration: 800,
      easing: "ease-out-cubic",
    });

    // Dynamic Tab Title
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Kopi Susu Karsa Menunggumu! ☕";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <CartProvider>
      <SmartTableModal />
      <Navbar />
      <Hero />
      <AreaBanner />
      <main className="relative overflow-hidden selection:bg-amber-500/30">
        <CeritaKami />
        <MenuSection />
        <LoyaltyCard />
        <ReservationForm />
        <Gallery />
        <MapsSection />
      </main>
      <Footer />
      <FABMenu />
      <CartWidget />
      <OfflineToast />
    </CartProvider>
  );
}
