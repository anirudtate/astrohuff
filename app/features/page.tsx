"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const features = [
  {
    title: "Birth Chart Analysis",
    description:
      "Get detailed insights into your personality and life path with our advanced Kundli analysis. Understand your strengths, weaknesses, and life purpose.",
    icon: "🌟",
  },
  {
    title: "Kundli Matching",
    description:
      "Find your perfect match with our comprehensive compatibility analysis. Compare horoscopes and get detailed marriage compatibility reports.",
    icon: "❤️",
  },
  {
    title: "Daily Panchang",
    description:
      "Stay aligned with cosmic energies through daily astrological updates. Get muhurat timings and auspicious moments for important activities.",
    icon: "📅",
  },
  {
    title: "Ask AI Astrologer",
    description:
      "Get instant answers to your life questions from our AI-powered astrologer. Available 24/7 for personalized guidance.",
    icon: "🤖",
  },
  {
    title: "Transit Predictions",
    description:
      "Track planetary movements and their impact on your life. Get personalized predictions for career, relationships, and more.",
    icon: "🌍",
  },
  {
    title: "Gemstone Recommendations",
    description:
      "Discover which gemstones can enhance your life based on your birth chart. Get detailed recommendations for wearing and caring for your stones.",
    icon: "💎",
  },
  {
    title: "Numerology Analysis",
    description:
      "Unlock the power of numbers in your life. Get insights based on your name and birth date numerology.",
    icon: "🔢",
  },
  {
    title: "Yearly Horoscope",
    description:
      "Plan your year ahead with detailed yearly predictions. Get month-by-month forecasts for all areas of life.",
    icon: "📊",
  },
  {
    title: "Remedial Solutions",
    description:
      "Get personalized remedies for planetary doshas. Learn about mantras, rituals, and practices to harmonize your energies.",
    icon: "🕉️",
  },
  {
    title: "Career Guidance",
    description:
      "Make informed career decisions based on your astrological chart. Discover your natural talents and ideal profession.",
    icon: "💼",
  },
  {
    title: "Relationship Insights",
    description:
      "Understanding your relationships through vedic astrology. Get guidance for personal and professional relationships.",
    icon: "🤝",
  },
  {
    title: "Health Astrology",
    description:
      "Learn about potential health concerns and preventive measures based on your birth chart. Get holistic wellness recommendations.",
    icon: "🏥",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Astrological Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our full suite of vedic astrology tools and features
              designed to guide you on your spiritual journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-8 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:bg-card/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div className="text-5xl mb-6">
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
