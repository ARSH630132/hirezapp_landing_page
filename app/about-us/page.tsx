"use client";

import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import GarageSection from "@/components/sections/GarageSection";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#010101] text-white overflow-x-hidden">
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">
        <Header />
        <GarageSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
