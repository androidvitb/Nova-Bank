"use client";
import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from "lucide-react";

// Original feature list
const features = [
  {
    title: "Access Your Card at any time",
    description:
      "Every Nova checking account comes with a free physical debit card and virtual debit, so you always have access at your fingertips.",
  },
  {
    title: "Make Your Money Work for You",
    description:
      "Invest your money efficiently with Nova's automated savings features.",
  },
  {
    title: "Pay and get paid your way",
    description:
      "Send and receive payments seamlessly with no hidden fees.",
  },
  {
    title: "Free from hidden fees",
    description:
      "With Nova, enjoy transparent banking without worrying about hidden charges.",
  },
];

// New testimonial data for carousel section
const testimonials = [
  {
    quote:
      "Nova transformed the way I manage my business finances. The interface is both beautiful and intuitive!",
    author: "Alex D.",
    role: "Entrepreneur",
  },
  {
    quote:
      "The security and ease of use have made Nova my go-to banking solution. I highly recommend it!",
    author: "Maria S.",
    role: "Freelancer",
  },
  {
    quote:
      "A seamless experience from sign-up to everyday banking. Nova’s features are exactly what I needed.",
    author: "John K.",
    role: "Small Business Owner",
  },
];

// A simple testimonial slider component using Framer Motion
function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const testimonialCount = testimonials.length;

  const nextTestimonial = React.useCallback(() =>
    setCurrent((prev) => (prev + 1) % testimonialCount), [testimonialCount]);

  const prevTestimonial = () =>
    setCurrent((prev) => (prev - 1 + testimonialCount) % testimonialCount);

  React.useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-card text-card-foreground rounded-xl p-8 shadow-lg border min-h-[200px] flex flex-col justify-center"
        >
          <p className="text-lg italic text-muted-foreground mb-6">
            &quot;{testimonials[current].quote}&quot;
          </p>
          <div className="text-right border-t pt-4">
            <p className="font-bold text-foreground">
              {testimonials[current].author}
            </p>
            <p className="text-sm text-muted-foreground">
              {testimonials[current].role}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevTestimonial}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextTestimonial}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function FeatureSection() {
  const [expanded, setExpanded] = useState(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.5 });
  const isLeftInView = useInView(leftRef, { once: true, threshold: 0.5 });
  const isRightInView = useInView(rightRef, { once: true, threshold: 0.5 });

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div id="resources-section" className="relative overflow-hidden py-20">
      {/* Animated decorative blob in the background */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="px-20 max-sm:px-4 flex flex-col lg:flex-row gap-10 lg:px-2 max-w-7xl mx-auto">
        {/* Left Section - Enhanced Hero with overlay */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isLeftInView ? 1 : 0, x: isLeftInView ? 0 : -50 }}
          transition={{ duration: 0.5 }}
          className="lg:h-[450px] relative w-full lg:w-[40%] flex flex-col lg:flex-row gap-2 bg-card text-card-foreground rounded-xl p-10 shadow-lg overflow-hidden border"
        >
          {/* Background overlay pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center">
            <div className="text-4xl font-bold leading-tight">
              ONLINE BANKING THAT TAKES YOUR BUSINESS TO THE{" "}
              <span className="text-primary">NEXT LEVEL</span>
            </div>
            <div className="text-sm text-muted-foreground mt-6 leading-relaxed">
              Monitor all your purchases in one place, and freeze or unfreeze
              your cards in a few taps.
            </div>
            <Button
              className="mt-8 w-fit rounded-full px-8 h-11"
              size="lg"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-end z-10 mt-8 lg:mt-0">
            <Image
              src="/FeatureSection_Image1.png"
              alt="Feature showcasing online banking"
              width={208}
              height={150}
              className="rounded-xl w-52 max-sm:hidden object-contain"
            />
          </div>
        </motion.div>

        {/* Right Section - Accordion & Benefits with Tab-like Header */}
        <motion.div
          ref={rightRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: isRightInView ? 1 : 0,
            x: isRightInView ? 0 : 50,
          }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[60%] bg-muted/50 rounded-xl shadow-md overflow-hidden border transition-colors duration-300"
        >
          <div className="flex text-lg border-b">
            <div className="bg-card py-4 px-8 flex justify-center border-r">
              <div className="bg-primary px-4 h-8 flex items-center rounded-full text-white font-bold text-sm">
                BENEFITS
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-4 py-2">
              {["Invoice", "Integration", "Partner Perks", "Nova Boost"].map(
                (item) => (
                  <div key={item} className="bg-background px-4 py-1 rounded-full text-xs font-medium border text-muted-foreground">
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary w-2 h-2 rounded-full"></div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-card rounded-xl border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ShieldCheck className="text-2xl text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Security First</h4>
                  <p className="text-xs text-muted-foreground">Your data is always encrypted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card w-full p-8 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <div
                  className="flex justify-between items-center cursor-pointer group"
                  onClick={() => toggleExpand(index)}
                >
                  <h3
                    className={`text-lg font-medium transition-colors ${
                      expanded === index ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  {expanded === index ? (
                    <ChevronUp className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <ChevronDown className="text-muted-foreground h-5 w-5" />
                  )}
                </div>

                <AnimatePresence>
                  {expanded === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Info Section with Security/FDIC details */}
      <div className="px-4 mt-20 max-w-7xl mx-auto">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="bg-card text-card-foreground rounded-xl p-8 md:p-14 shadow-xl border"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left space-y-4">
              <div className="flex gap-3 text-2xl items-center justify-center md:justify-start font-bold">
                <ShieldCheck className="text-primary h-8 w-8" />
                <span>FDIC insured</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your deposits are insured for up to $250,000 through our
                partner bank, Middlesex Federal Savings.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="flex gap-3 text-2xl items-center justify-center md:justify-start font-bold">
                <Lock className="text-primary h-8 w-8" />
                <span>Powerful security</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our bank-grade encryption ensures that your information remains
                safe and secure at all times.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="flex gap-3 text-2xl items-center justify-center md:justify-start font-bold">
                <CreditCard className="text-primary h-8 w-8" />
                <span>Instant controls</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Freeze or unfreeze your cards anytime with just a few taps
                through our mobile app.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 w-full justify-center mt-16">
            <Image
              src="/FeatureSection_Image2.png"
              alt="Feature Image 2"
              width={300}
              height={256}
              className="h-48 sm:h-64 object-contain transition-transform hover:scale-105 duration-300"
            />
            <Image
              src="/FeatureSection_Image3.png"
              alt="Feature Image 3"
              width={300}
              height={256}
              className="h-48 sm:h-64 object-contain max-sm:hidden transition-transform hover:scale-105 duration-300"
            />
          </div>
        </motion.div>
      </div>

      {/* New Call-to-Action (CTA) Card */}
      <motion.div
        className="mt-20 bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-12 max-w-4xl mx-auto shadow-2xl text-white flex flex-col items-center text-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to elevate your banking experience?
        </h2>
        <p className="mb-10 text-lg opacity-90 max-w-2xl">
          Join thousands of savvy business owners who trust Nova for secure,
          seamless, and innovative banking.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="rounded-full px-10 h-12 text-primary font-bold hover:scale-105 transition-transform"
        >
          Get Started Today
        </Button>
      </motion.div>

      {/* New Testimonials Carousel Section */}
      <TestimonialSlider />
    </div>
  );
}

export default FeatureSection;
