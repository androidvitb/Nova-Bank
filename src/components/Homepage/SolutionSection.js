"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, ShieldCheck, Headphones } from "lucide-react";

function SolutionSection() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/register");
  };

  const cards = [
    {
      title: "INVOICE",
      description:
        "Create and send an unlimited number of fully customizable invoices directly from your account.",
      image: "/SolutionSection_Image1.png",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      title: "INTEGRATIONS",
      description:
        "From Stripe to Shopify, integrate with multiple apps to manage everything from one place.",
      image: "/SolutionSection_Image2.png",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "PARTNER PERKS",
      description:
        "Save thousands on tools like Gusto and Hubspot with exclusive perks.",
      image: "/SolutionSection_Image1.png",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "SUPPORT",
      description:
        "Our support team is available 24/7 to assist with any inquiries.",
      image: "/SolutionSection_Image2.png",
      icon: <Headphones className="w-6 h-6" />,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      id="solution-section"
      className="relative my-8 px-4 sm:px-8 py-16 bg-background overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary/20 rounded-full filter blur-2xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 360, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-orange-500/20 rounded-full filter blur-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 flex flex-col sm:flex-row justify-between items-end gap-6"
      >
        <div className="text-3xl sm:text-4xl text-center sm:text-left font-extrabold tracking-tight dark:text-white max-w-2xl">
          <span className="text-primary block mb-2">OUR SOLUTION</span>
          MAKES IT EASIER FOR YOU IN ALL TRANSACTIONS
        </div>
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            size="icon"
            className="swiper-button-prev-custom rounded-full hover:bg-primary hover:text-white transition-colors h-12 w-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            className="swiper-button-next-custom rounded-full bg-primary text-white h-12 w-12 shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>

      {/* Swiper Carousel */}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Navigation, Pagination]}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <motion.div
              whileHover={{ y: -10 }}
              className={`p-10 h-[420px] rounded-3xl transition-all duration-500 flex flex-col justify-between border ${
                index === activeIndex
                  ? "bg-primary text-white shadow-2xl border-primary scale-105 z-10"
                  : "bg-card text-card-foreground border-border hover:border-primary/50"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-2xl ${
                      index === activeIndex ? "bg-white/20" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {card.icon}
                  </div>
                  <div
                    className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border ${
                      index === activeIndex ? "border-white/40 text-white" : "border-primary/20 text-primary"
                    }`}
                  >
                    {card.title}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">
                  {card.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    index === activeIndex ? "text-white/90" : "text-muted-foreground"
                  }`}
                >
                  {card.description}
                </p>
              </div>
              <div className="relative mt-6 flex justify-center">
                <div className={`absolute inset-0 blur-2xl opacity-20 ${index === activeIndex ? 'bg-white' : 'bg-primary'}`} />
                <Image
                  src={card.image}
                  alt={card.title}
                  width={240}
                  height={140}
                  className="rounded-2xl max-h-32 object-contain relative z-10 dark:invert transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CTA Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row justify-between mt-24 p-12 rounded-[40px] bg-secondary/30 dark:bg-zinc-900/50 backdrop-blur-sm border border-border items-center gap-10"
      >
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 dark:text-white">
            ALL IN ONE MONEY MANAGEMENT
          </h2>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Running a business is complicated enough. Your banking solution should
            be simple—and help simplify. Spend less time managing your finances and
            more time running your business with Novo.
          </p>
        </div>
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="rounded-full px-10 h-16 text-lg font-bold shadow-xl hover:scale-105 transition-transform flex gap-3 items-center group"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
}

export default SolutionSection;
