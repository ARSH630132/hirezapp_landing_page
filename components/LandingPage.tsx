"use client";

import { motion } from "motion/react";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BuildAIEnterpriseSection from "@/components/sections/BuildAIEnterpriseSection";
import FoundrySection from "@/components/sections/FoundrySection";
import GarageSection from "@/components/sections/GarageSection";
import HeroSection from "@/components/sections/HeroSection";
import IndustrySolutionsSection from "@/components/sections/IndustrySolutionsSection";
import InsightsSection from "@/components/sections/InsightsSection";
import ProductizedAssetsSection from "@/components/sections/ProductizedAssetsSection";
import TalkToAgentSection from "@/components/sections/TalkToAgentSection";
import { pageStaggerVariants } from "@/lib/animations";

export default function LandingPage() {
  return (
    <motion.main
      className="min-h-screen bg-[#010101] text-white overflow-x-hidden"
      initial="hidden"
      animate="show"
      variants={pageStaggerVariants}
    >
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">
        <Header />
        <HeroSection />
        <TalkToAgentSection />
        <BuildAIEnterpriseSection />
        <FoundrySection />
        <IndustrySolutionsSection />
        <InsightsSection />
        {/* <ProductizedAssetsSection /> */}
        <GarageSection />
        <ContactSection />
        <Footer />
      </div>
    </motion.main>
  );
}
