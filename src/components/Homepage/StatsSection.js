"use client";
import React from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users, TrendingUp, Star, CreditCard } from "lucide-react";

function StatsSection() {
  return (
    <motion.div
      id="result-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col lg:flex-row px-10 lg:px-20 justify-center items-center my-20 gap-10 overflow-hidden"
    >
      {/* Animated Background Element */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <Image
        src="/StatsSection_Image1.png"
        alt="Stats Visual"
        width={600}
        height={400}
        className="w-full lg:w-1/2 object-contain relative z-10"
      />

      <div className="py-10 max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary px-5 text-white rounded-full max-sm:m-auto py-2 text-center w-52 font-semibold"
        >
          OUR CUSTOMERS
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl my-6 max-sm:text-center font-bold dark:text-white"
        >
          FOR GROWING TEAMS AND THE SELF-EMPLOYED ALIKE
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center">
          <p className="text-muted-foreground text-sm w-64 max-sm:text-center">
            Whether you&apos;re just getting started or employ an established team,
            Novo can help you get your business&apos;s finances in order. Here&apos;s how
            small business customers have found success using Novo&apos;s powerful
            digital banking tools.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-6 flex gap-2 items-center hover:scale-105 transition-transform"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-8">
          <Image src="/StatsSection_Image2.png" alt="Stats Graph" width={600} height={300} className="w-full dark:invert" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-secondary/50 dark:bg-zinc-900/50 backdrop-blur-sm py-6 rounded-b-xl flex flex-wrap justify-around items-center gap-6 dark:text-white border-x border-b border-border"
          >
            <StatItem icon={<Users className="w-5 h-5 text-primary" />} value={200000} label="CUSTOMERS" post={"+"} />
            <StatItem icon={<TrendingUp className="w-5 h-5 text-primary" />} value={0} label="MONTHLY FEE" pre={"$"} />
            <StatItem
              icon={<CreditCard className="w-5 h-5 text-primary" />}
              value={500000000}
              label="FASTER PAYMENTS"
              pre={"$"}
              post={"+"}
            />
            <StatItem icon={<Star className="w-5 h-5 text-primary fill-primary" />} value={4.9} label="APP RATING" />
          </motion.div>
        </div>

        {/* New Call-to-Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 bg-gradient-to-r from-primary to-orange-500 rounded-xl p-8 text-white text-center shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="text-2xl font-bold mb-4 relative z-10">
            Join Thousands of Happy Customers
          </div>
          <div className="mb-6 text-sm text-white/90 relative z-10">
            Experience the simplicity and power of Novo&apos;s digital banking today.
          </div>
          <Button
            variant="secondary"
            className="rounded-full px-8 py-6 text-lg font-bold bg-white text-primary hover:bg-gray-100 relative z-10"
          >
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

const StatItem = ({ icon, value, label, pre, post }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  return (
    <div className="text-center flex flex-col items-center gap-1" ref={ref}>
      <div className="mb-1">{icon}</div>
      <div className="text-2xl font-bold">
        {inView && (
          <div className="flex items-center justify-center">
            {pre}
            <CountUp
              end={value}
              duration={2.5}
              formattingFn={(num) => formatNumber(num)}
              preserveValue={true}
            />
            {post}
          </div>
        )}
      </div>
      <div className="text-[10px] font-medium text-muted-foreground tracking-wider">{label}</div>
    </div>
  );
};

const formatNumber = (num) => {
  if (num >= 1_000_000) return Math.round(num / 1_000_000) + "M";
  if (num >= 1_000) return Math.round(num / 1_000) + "K";
  return num.toString();
};

export default StatsSection;
