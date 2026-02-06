"use client";  

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/Homepage/HeroSection";
import FeatureSection from "@/components/Homepage/FeatureSection";
import StatsSection from "@/components/Homepage/StatsSection";
import SolutionSection from "@/components/Homepage/SolutionSection";
import { Button } from "@/components/ui/Button";
import { ArrowUp } from "lucide-react";

function Homepage() {
  const [showButton, setShowButton] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <SolutionSection />

      {/* Scroll to top button */}
      {showButton && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
export default Homepage;

