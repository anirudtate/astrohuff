"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { AiAstrologerPreview } from "@/components/ai-astrologer-preview";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-background mt-10">
        <HeroSection />
        <div className="py-20">
          <AiAstrologerPreview />
        </div>
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

  const zodiacColors: Record<number, string> = {
    0: "bg-cosmic-purple/10 border-cosmic-purple/20 hover:bg-cosmic-purple/20",
    1: "bg-cosmic-blue/10 border-cosmic-blue/20 hover:bg-cosmic-blue/20",
    2: "bg-cosmic-pink/10 border-cosmic-pink/20 hover:bg-cosmic-pink/20",
    3: "bg-cosmic-teal/10 border-cosmic-teal/20 hover:bg-cosmic-teal/20",
    4: "bg-cosmic-yellow/10 border-cosmic-yellow/20 hover:bg-cosmic-yellow/20",
    5: "bg-cosmic-orange/10 border-cosmic-orange/20 hover:bg-cosmic-orange/20",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-wrap justify-center gap-4 mx-auto"
    >
      {zodiacSigns.map((sign, index) => (
        <motion.div
          key={sign.name}
          variants={signVariants}
          whileHover={{ scale: 1.2 }}
          className="group cursor-pointer"
        >
          <div
            className={`w-16 h-16 flex items-center justify-center text-4xl rounded-2xl backdrop-blur-sm transition-all duration-300 ${
              zodiacColors[index % 6]
            }`}
            title={sign.name}
          >
            <span className="">{sign.symbol}</span>
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
            <span className="cosmic-glow">✨</span>{" "}
            <span className="cosmic-glow">AstroHuff</span>
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
            <Button size="lg" variant="default">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline">
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
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <motion.div className="relative max-w-5xl mx-auto px-8 pb-32 pt-16">
      <motion.div
        className="relative"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Rainbow glow effects with reduced spread */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-pink rounded-[32px] opacity-50 blur-lg animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-teal via-cosmic-yellow to-cosmic-orange rounded-[32px] opacity-30 blur-xl animate-pulse delay-75" />

        <div className="relative z-10 rounded-[32px] overflow-hidden group">
          {/* Glass border container */}
          <div className="absolute inset-0 rounded-[32px] bg-white/20 backdrop-blur-sm">
            {/* Inner glass border */}
            <div className="absolute inset-[8px] rounded-[24px] bg-white/5 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-[24px] bg-background/40 backdrop-blur-md" />
            </div>
          </div>

          {/* Main content container */}
          <div className="relative rounded-[20px] overflow-hidden bg-background/20 backdrop-blur-sm m-[12px]">
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <Image
                src="/dashboard.png"
                alt="AstroHuff Dashboard Light Mode"
                width={1200}
                height={675}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  currentTheme === "dark" ? "opacity-0" : "opacity-100"
                }`}
                priority
              />
              <Image
                src="/dashboard-dark.png"
                alt="AstroHuff Dashboard Dark Mode"
                width={1200}
                height={675}
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                  currentTheme === "dark" ? "opacity-100" : "opacity-0"
                }`}
                priority
              />
            </div>
          </div>
        </div>
      </motion.div>
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
  ] as const;

  return (
    <div className="relative max-w-7xl mx-auto px-8 pt-16 pb-24">
      <motion.h2
        className="text-4xl sm:text-5xl font-bold text-center mb-16 relative z-10 cosmic-text-gradient cosmic-glow"
        {...fadeIn}
      >
        Discover Your Cosmic Journey
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="group p-8 rounded-xl bg-cosmic-purple/5 backdrop-blur-sm border border-cosmic-purple/20 hover:bg-cosmic-purple/10 transition-all hover:scale-105 duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div className="text-5xl mb-6 cosmic-glow">
              {feature.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-3 text-cosmic-purple">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Button variant="outline" size="lg" asChild>
          <Link href="/features" className="flex items-center gap-2">
            More Features
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote:
        "AstroHuff has completely transformed how I understand my life path. The insights provided are incredibly accurate and have helped me make better decisions.",
      author: "Sarah M.",
      role: "Spiritual Coach",
      avatar: "✨",
    },
    {
      quote:
        "The AI astrologer provides incredibly accurate and insightful readings. It's like having a personal astrologer available 24/7 to guide me through life's challenges.",
      author: "Raj P.",
      role: "Tech Entrepreneur",
      avatar: "🌟",
    },
    {
      quote:
        "The most comprehensive Kundli matching tool I've ever used. It helped me understand compatibility aspects I never knew existed.",
      author: "Priya K.",
      role: "Life Coach",
      avatar: "⭐",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

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
        className="text-4xl sm:text-5xl font-bold text-center mb-16 cosmic-text-gradient cosmic-glow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        What Our Users Say
      </motion.h2>

      <div className="relative max-w-4xl mx-auto">
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
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <p className="text-xl italic relative text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto pt-4 border-t border-border/50 w-full">
                  <p className="font-semibold text-lg">{testimonial.author}</p>
                  <p className="text-muted-foreground">{testimonial.role}</p>
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
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  currentTestimonial === index
                    ? "bg-primary"
                    : "bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
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
      className="relative text-center py-32 px-4 sm:px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 cosmic-text-gradient cosmic-glow">
            Unlock Your Cosmic Potential
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Join our community of seekers discovering their true path through
            ancient wisdom and modern technology
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" variant="default">
            <Link href="/sign-up" className="flex items-center gap-2">
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/features">View Features</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
