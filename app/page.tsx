"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-background mt-10">
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const zodiacSigns = [
  { symbol: "♈", name: "Aries" },
  { symbol: "♉", name: "Taurus" },
  { symbol: "♊", name: "Gemini" },
  { symbol: "♋", name: "Cancer" },
  { symbol: "♌", name: "Leo" },
  { symbol: "♍", name: "Virgo" },
  { symbol: "♎", name: "Libra" },
  { symbol: "♏", name: "Scorpio" },
  { symbol: "♐", name: "Sagittarius" },
  { symbol: "♑", name: "Capricorn" },
  { symbol: "♒", name: "Aquarius" },
  { symbol: "♓", name: "Pisces" },
];

const ZodiacRing = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.8,
      },
    },
  };

  const signVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-wrap justify-center gap-2 mx-auto"
    >
      {zodiacSigns.map((sign) => (
        <motion.div
          key={sign.name}
          variants={signVariants}
          whileHover={{ scale: 1.2 }}
          className="group cursor-pointer"
        >
          <div
            className="w-14 h-14 flex items-center justify-center text-4xl text-muted-foreground hover:text-primary transition-colors duration-300"
            title={sign.name}
          >
            {sign.symbol}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <div className="relative">
      <motion.div
        className="relative flex flex-col items-center justify-start px-4 md:px-8 pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-[0.03] pointer-events-none">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="aspect-square border border-white/20" />
          ))}
        </div>

        <motion.div
          className="relative z-20 text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ AstroHuff
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Unlock the secrets of the cosmos and discover your destiny through
            ancient vedic astrology powered by modern technology
          </motion.p>

          <ZodiacRing />

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              className="w-full sm:w-auto px-6 md:px-8 py-6 text-base sm:text-lg"
              variant="default"
              asChild
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button
              className="w-full sm:w-auto px-6 md:px-8 py-6 text-base sm:text-lg"
              variant="outline"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Dashboard preview will go here */}
        </motion.div>
      </motion.div>
    </div>
  );
};

const DashboardPreview = () => {
  return (
    <motion.div className="relative max-w-5xl mx-auto px-8 pb-32 pt-16">
      <div className="relative">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden"
        >
          <Image
            src="/dashboard.png"
            alt="AstroHuff Dashboard"
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-card/10 blur-3xl -z-10" />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Birth Chart Analysis",
      description:
        "Get detailed insights into your personality and life path with our advanced Kundli analysis",
      icon: "🌟",
    },
    {
      title: "Kundli Matching",
      description:
        "Find your perfect match with our comprehensive compatibility analysis",
      icon: "❤️",
    },
    {
      title: "Daily Panchang",
      description:
        "Stay aligned with cosmic energies through daily astrological updates",
      icon: "📅",
    },
    {
      title: "Ask AI Astrologer",
      description:
        "Get instant answers to your life questions from our AI-powered astrologer",
      icon: "🤖",
    },
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-8 pt-16 pb-24">
      <motion.h2
        className="text-4xl font-bold text-center mb-16 relative z-10"
        {...fadeIn}
      >
        Discover Your Cosmic Journey
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="group p-8 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:bg-card/40"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div className="text-5xl mb-6">{feature.icon}</motion.div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote:
        "AstroHuff has completely transformed how I understand my life path.",
      author: "Sarah M.",
      role: "Spiritual Coach",
    },
    {
      quote:
        "The AI astrologer provides incredibly accurate and insightful readings.",
      author: "Raj P.",
      role: "Tech Entrepreneur",
    },
    {
      quote: "The most comprehensive Kundli matching tool I've ever used.",
      author: "Priya K.",
      role: "Life Coach",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto px-8 py-32 overflow-hidden">
      <motion.h2
        className="text-4xl font-bold text-center mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        What Our Users Say
      </motion.h2>

      <div className="relative max-w-2xl mx-auto">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `${-100 * currentTestimonial}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                className="group p-8 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors hover:bg-card/40 flex flex-col items-start gap-4 w-full flex-shrink-0"
              >
                <div className="text-4xl mb-4">✨</div>
                <p className="text-lg italic relative">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto pt-4 border-t border-border/50 w-full">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTestimonial}
            className="hover:bg-card/40 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentTestimonial === index
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTestimonial}
            className="hover:bg-card/40 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <motion.div
      className="relative text-center py-32 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 relative">
        Begin Your Spiritual Journey Today
      </h2>
      <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative px-4">
        Join thousands of users discovering their cosmic destiny
      </p>
      <Button
        size="lg"
        className="px-8 sm:px-12 py-6 text-base sm:text-lg relative"
        asChild
      >
        <Link href="/sign-up">Start Free Trial</Link>
      </Button>
    </motion.div>
  );
};
