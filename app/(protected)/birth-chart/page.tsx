"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BirthChartResponse } from "@/types/astrology";

const timezoneRegex = /^[+-](?:0[0-9]|1[0-2]):[0-5][0-9]$/;

const birthChartSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please enter a valid time (HH:MM)"),
  latitude: z
    .string()
    .regex(
      /^-?(?:90|[1-8]?[0-9](?:\.[0-9]{1,6})?)$/,
      "Please enter a valid latitude between -90 and 90"
    ),
  longitude: z
    .string()
    .regex(
      /^-?(?:180|1[0-7][0-9]|[1-9]?[0-9](?:\.[0-9]{1,6})?)$/,
      "Please enter a valid longitude between -180 and 180"
    ),
  timezone: z
    .string()
    .regex(
      timezoneRegex,
      "Please enter a valid timezone offset (e.g. +05:30 or -08:00)"
    ),
});

type BirthChartData = z.infer<typeof birthChartSchema>;

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function ChartDisplay({
  data,
  rasiSvg,
  navamsaSvg,
}: {
  data: BirthChartResponse["output"];
  rasiSvg: { statusCode: number; output: string };
  navamsaSvg: { statusCode: number; output: string };
}) {
  if (!data) return null;

  const [, planetMap] = data;
  const planets = Object.entries(planetMap).filter(
    ([key]) => !["debug", "13"].includes(key)
  );

  return (
    <div className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Rasi (Birth) Chart</h3>
          <div
            className="w-full aspect-square bg-white rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: rasiSvg.output }}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Navamsa (D9) Chart</h3>
          <div
            className="w-full aspect-square bg-white rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: navamsaSvg.output }}
          />
        </div>
      </div>

      {/* Planetary Positions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
        <div className="grid grid-cols-1 gap-4">
          {planets.map(([name, planet]) => (
            <div
              key={name}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-muted-foreground">
                    {zodiacSigns[planet.current_sign - 1]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {planet.normDegree.toFixed(2)}°
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Full: {planet.fullDegree.toFixed(2)}°
                  </div>
                </div>
              </div>
              {planet.isRetro === "true" && (
                <div className="mt-2 text-sm text-primary">Retrograde</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BirthChartPage() {
  const [chartData, setChartData] = useState<BirthChartResponse | null>(null);
  const [rasiSvg, setRasiSvg] = useState<{
    statusCode: number;
    output: string;
  } | null>(null);
  const [navamsaSvg, setNavamsaSvg] = useState<{
    statusCode: number;
    output: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BirthChartData>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      latitude: "",
      longitude: "",
      timezone: "",
    },
  });

  const onSubmit = async (data: BirthChartData) => {
    try {
      setLoading(true);
      setError(null);

      const { date, time, latitude, longitude, timezone } = data;
      const [year, month, day] = date.split("-");
      const [hours, minutes] = time.split(":");

      // Convert timezone from format "+05:30" to float 5.5
      const [tzHours, tzMinutes] = timezone.replace("+", "").split(":");
      const timezoneFloat =
        parseFloat(tzHours) +
        (parseFloat(tzMinutes) / 60) * (timezone.startsWith("-") ? -1 : 1);

      const requestBody = {
        year: parseInt(year),
        month: parseInt(month),
        date: parseInt(day),
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: 0,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone: timezoneFloat,
        settings: {
          observation_point: "topocentric",
          ayanamsha: "lahiri",
        },
      };

      // Fetch planetary positions
      const planetResponse = await fetch(
        "https://json.freeastrologyapi.com/planets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ASTROLOGY_API_KEY!,
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Fetch Rasi chart SVG
      const rasiResponse = await fetch(
        "https://json.freeastrologyapi.com/horoscope-chart-svg-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ASTROLOGY_API_KEY!,
          },
          body: JSON.stringify({
            ...requestBody,
            language: "en",
          }),
        }
      );

      // Fetch Navamsa chart SVG
      const navamsaResponse = await fetch(
        "https://json.freeastrologyapi.com/navamsa-chart-svg-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ASTROLOGY_API_KEY!,
          },
          body: JSON.stringify({
            ...requestBody,
            language: "en",
          }),
        }
      );

      if (!planetResponse.ok || !rasiResponse.ok || !navamsaResponse.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const [planetData, rasiData, navamsaData] = await Promise.all([
        planetResponse.json(),
        rasiResponse.json(),
        navamsaResponse.json(),
      ]);

      setChartData(planetData);
      setRasiSvg(rasiData);
      setNavamsaSvg(navamsaData);
    } catch (err) {
      console.error("Birth chart API error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Birth Chart Analysis
            </h1>
            <p className="text-lg text-muted-foreground/80">
              Enter your birth details to generate your personalized birth chart
            </p>
          </motion.div>

          <Card className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 28.6139" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 77.2090" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. +05:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Chart...
                    </>
                  ) : (
                    "Generate Birth Chart"
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          {chartData?.output && rasiSvg && navamsaSvg && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <ChartDisplay
                  data={chartData.output}
                  rasiSvg={rasiSvg}
                  navamsaSvg={navamsaSvg}
                />
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
