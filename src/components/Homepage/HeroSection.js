"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CustomChatbot from "./Chatbot";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageSquare, ChevronDown, DollarSign, CheckCircle2 } from "lucide-react";

function HeroSection() {
  const router = useRouter();
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleLiveChat = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const fadeInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Decorative Blobs */}
      <motion.div
        className="absolute top-[-80px] left-[-80px] w-40 h-40 bg-primary/30 rounded-full filter blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-80px] right-[-80px] w-56 h-56 bg-orange-500/30 rounded-full filter blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pb-28 px-20 max-sm:px-4 flex flex-col lg:flex-row gap-10 mt-10 pt-[80px] relative z-10">
        {/* Left Column: Content & CTAs */}
        <div className="w-full lg:w-[30%] relative px-4">
          <div
            className="text-[40px] lg:text-[55px] text-center sm:text-left leading-none absolute max-sm:relative w-full lg:w-[600px] z-20 
              bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 font-extrabold drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(253,83,57,0.3)]"
          >
            ALL YOUR BUSINESS BANKING IN ONE PLATFORM
          </div>
          <div className="h-32 max-sm:h-0"></div>
          <div className="pt-20 max-sm:pt-10 max-sm:text-center pb-10 text-muted-foreground text-sm lg:text-base">
            Take your business to new heights with faster cash flow and clear
            financial insights—all with a free Novo account. Apply in 10 minutes.
          </div>
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-lg h-12 px-8 group"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-lg h-12 px-8 ml-0 sm:ml-4"
              onClick={handleLiveChat}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Live Chat
            </Button>
          </div>
          <div className="py-8 max-sm:text-center text-muted-foreground">
            Already Started?{" "}
            <span className="text-primary font-semibold cursor-pointer hover:underline">
              Finish Application
            </span>
          </div>
        </div>

        {/* Middle Column: Hero Image & Info Cards */}
        <div className="w-full lg:w-[60%] flex justify-end rounded-3xl relative h-[300px] lg:h-[500px]">
          <img
            src="/heroSection_Image1.png"
            alt="HeroImage"
            className="w-full h-full object-cover rounded-3xl shadow-2xl dark:opacity-80"
          />
          <motion.div
            className="bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl px-4 py-2 absolute top-24 left-8 lg:top-52 lg:left-32 flex gap-2 items-center justify-center shadow-lg"
            variants={fadeInFromLeft}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-primary/20 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Nova Balance</div>
              <div className="text-white/80 text-xs">$17,500</div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl px-4 py-2 absolute top-40 right-5 lg:top-72 lg:right-10 flex gap-2 items-center justify-center shadow-lg"
            variants={fadeInFromRight}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Invoice Paid</div>
              <div className="text-white/80 text-xs">$900</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Secondary Image & Feature Card */}
        <div className="w-full lg:w-[30%] px-4">
          <img
            src="/heroSection_Image2.png"
            alt="HeroImage"
            className="rounded-2xl w-full h-auto shadow-xl dark:opacity-80"
          />
          <div className="mt-8 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <ArrowRight className="h-8 w-8 text-primary rotate-45" />
            </div>
            <div>
              <div className="font-bold text-lg lg:text-xl text-foreground">
                Instant card control
              </div>
              <div className="text-sm mt-1 text-muted-foreground">
                Monitor all your purchases in one place, and freeze or unfreeze
                your card in just a few taps.
              </div>
            </div>
          </div>
        </div>

        {isChatbotVisible && <CustomChatbot />}
      </div>

      {/* Animated Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-muted-foreground"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-8 w-8" />
      </motion.div>
    </div>
  );
}

export default HeroSection;
