"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import ReservationForm from "@/components/ReservationForm";
import TestimonialSlider from "@/components/TestimonialSlider";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Gallery from "@/components/Gallery";
import StatusMeja from "@/components/StatusMeja";
import MapsSection from "@/components/MapsSection";
import Footer from "@/components/Footer";
import AmbientWidget from "@/components/AmbientWidget";
import CartWidget from "@/components/CartWidget";
import LiveChatWidget from "@/components/LiveChatWidget";
import FABMenu from "@/components/FABMenu";
import InstagramGrid from "@/components/InstagramGrid";
import CeritaKami from "@/components/CeritaKami";
import OfflineToast from "@/components/OfflineToast";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import OrderTrackerCard from "@/components/OrderTrackerCard";

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 50,
      duration: 800,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <CartProvider>
      <PageTransition />
      <CustomCursor />
      <OfflineToast />
      <Navbar />
      <main>
        <Hero />
        <CeritaKami />
        <MenuSection />
        <ReservationForm />
        <TestimonialSlider />
        <BeforeAfterSlider />
        <Gallery />
        <StatusMeja />
        <MapsSection />
        <InstagramGrid />
      </main>
      <Footer />
      <AmbientWidget />
      <FABMenu />
      <CartWidget />
      <LiveChatWidget />
      <LiveActivityFeed />
      <OrderTrackerCard />
    </CartProvider>
  );
}
