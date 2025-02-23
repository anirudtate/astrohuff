"use client";

import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Birth Chart Analysis",
    description:
      "Explore your personality and life path through Kundli analysis.",
    icon: "🌟",
    href: "/birth-chart",
  },
  {
    title: "Kundli Matching",
    description: "Find your perfect match with compatibility analysis.",
    icon: "❤️",
    href: "/kundli-matching",
  },
  {
    title: "Daily Panchang",
    description: "Get daily astrological updates and muhurat timings.",
    icon: "📅",
    href: "/panchang",
  },
  {
    title: "Ask AI Astrologer",
    description: "Get instant answers from our AI-powered astrologer.",
    icon: "🤖",
    href: "/ai-astrologer",
  },
  {
    title: "Transit Predictions",
    description: "Track planetary movements and their impact on your life.",
    icon: "🌍",
    href: "/transits",
  },
  {
    title: "Gemstone Recommendations",
    description: "Discover gemstones that can enhance your life.",
    icon: "💎",
    href: "/gemstones",
  },
  {
    title: "Numerology Analysis",
    description: "Unlock the power of numbers in your life.",
    icon: "🔢",
    href: "/numerology",
  },
  {
    title: "Yearly Horoscope",
    description: "Get detailed yearly predictions for all areas of life.",
    icon: "📊",
    href: "/yearly-horoscope",
  },
  {
    title: "Remedial Solutions",
    description: "Get personalized remedies for planetary doshas.",
    icon: "🕉️",
    href: "/remedies",
  },
  {
    title: "Career Guidance",
    description: "Make informed career decisions based on your chart.",
    icon: "💼",
    href: "/career",
  },
  {
    title: "Relationship Insights",
    description: "Understand relationships through vedic astrology.",
    icon: "🤝",
    href: "/relationships",
  },
  {
    title: "Health Astrology",
    description: "Learn about health aspects from your birth chart.",
    icon: "🏥",
    href: "/health",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Welcome{user?.displayName ? `, ${user.displayName}` : ""}
            </h1>
            <p className="text-lg text-muted-foreground/80">
              Your cosmic journey continues here
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} href={feature.href}>
                <motion.div
                  className="group p-8 rounded-xl bg-cosmic-purple/5 backdrop-blur-sm border border-cosmic-purple/20 hover:bg-cosmic-purple/10 transition-all hover:scale-105 duration-300 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div className="text-4xl mb-4 cosmic-glow">
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-cosmic-purple">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
