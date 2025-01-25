"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Star,
  Moon,
  Sun,
  Clock,
  MapPin,
  Calculator,
  Book,
  MessageCircle,
  Gift,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Welcome & Birth Details Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
              </h1>
              <p className="text-muted-foreground">
                Your Personal Astrological Dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" className="text-sm">
                <Clock className="mr-2 h-4 w-4" />
                Birth Time: 10:30 AM
              </Button>
              <Button variant="outline" className="text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                Location: New Delhi
              </Button>
            </div>
          </div>

          {/* Today's Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Today&apos;s Panchang</p>
                    <h3 className="text-2xl font-bold">Shubh</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rahu Kaal</p>
                    <h3 className="text-lg font-bold">10:30 - 12:00</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Nakshatra</p>
                    <h3 className="text-lg font-bold">Rohini</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Yoga</p>
                    <h3 className="text-lg font-bold">Shubha</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Features */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Essential Features</CardTitle>
                <CardDescription>
                  Access your personalized astrological tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Calculator className="h-6 w-6 mb-2" />
                    Free Kundli
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Kundli Matching
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Book className="h-6 w-6 mb-2" />
                    Horoscope 2025
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <MessageCircle className="h-6 w-6 mb-2" />
                    Talk to Astrologer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Gift className="h-6 w-6 mb-2" />
                    Festival Calendar
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Star className="h-6 w-6 mb-2" />
                    Today&apos;s Horoscope
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Remedies & Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Remedies & Reports</CardTitle>
                <CardDescription>Personalized solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Gemstones Report
                    </span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Mangal Dosha
                    </span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Sade Sati Report
                    </span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Lal Kitab
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Festivals */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Festivals</CardTitle>
                <CardDescription>Important dates and muhurat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "Feb 10, 2025",
                      event: "Mahashivratri",
                      type: "Major",
                    },
                    { date: "Mar 25, 2025", event: "Holi", type: "Major" },
                    {
                      date: "Apr 17, 2025",
                      event: "Ram Navami",
                      type: "Major",
                    },
                  ].map((festival, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">{festival.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {festival.date}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          festival.type === "Major"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {festival.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ask an Astrologer */}
            <Card>
              <CardHeader>
                <CardTitle>Ask an Astrologer</CardTitle>
                <CardDescription>Expert consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get instant answers from verified astrologers
                  </p>
                  <Button className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Consultation
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    First consultation free*
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
