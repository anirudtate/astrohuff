"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormValues {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: "male" | "female" | "other";
}

interface Step {
  id: string;
  title: string;
  description: string;
  fields: (keyof FormValues)[];
  validation: (data: FormValues) => { isValid: boolean; error?: string };
}

const steps: Step[] = [
  {
    id: "name",
    title: "What's your name?",
    description: "Enter your full name as you'd like to be addressed",
    fields: ["name"],
    validation: (data: FormValues) => ({
      isValid: data.name.trim().length >= 2,
      error: "Please enter your name (at least 2 characters)",
    }),
  },
  {
    id: "birth-date-time",
    title: "When were you born?",
    description: "Your birth date and time are crucial for accurate readings",
    fields: ["birthDate", "birthTime"],
    validation: (data: FormValues) => {
      if (!data.birthDate) {
        return { isValid: false, error: "Please select your birth date" };
      }
      if (!data.birthTime) {
        return { isValid: false, error: "Please enter your birth time" };
      }
      return { isValid: true };
    },
  },
  {
    id: "birth-place",
    title: "Where were you born?",
    description: "Your birth place helps us calculate your exact natal chart",
    fields: ["birthPlace"],
    validation: (data: FormValues) => ({
      isValid: data.birthPlace.trim().length >= 2,
      error: "Please enter your birth place (City, Country)",
    }),
  },
  {
    id: "gender",
    title: "What's your gender?",
    description: "This helps us provide more personalized readings",
    fields: ["gender"],
    validation: (data: FormValues) => ({
      isValid: ["male", "female", "other"].includes(data.gender),
      error: "Please select your gender",
    }),
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      gender: "" as "male" | "female" | "other",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (profile?.onboardingCompleted) {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [user, profile, router]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    try {
      setSubmitting(true);

      // Validate current step
      const step = steps[currentStep];
      const validation = step.validation(data);

      if (!validation.isValid) {
        // Set error for current step fields
        step.fields.forEach((field) => {
          form.setError(field, {
            type: "manual",
            message: validation.error || "This field is required",
          });
        });
        return;
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        form.clearErrors();
        return;
      }

      await updateUserProfile(user.uid, {
        ...data,
        onboardingCompleted: true,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const currentFields = steps[currentStep].fields;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    {currentFields.includes("name") && (
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          {...form.register("name")}
                          className={
                            form.formState.errors.name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentFields.includes("birthDate") && (
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">
                          Birth Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          {...form.register("birthDate")}
                          className={
                            form.formState.errors.birthDate
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {form.formState.errors.birthDate && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.birthDate.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentFields.includes("birthTime") && (
                      <div className="space-y-2">
                        <Label htmlFor="birthTime">
                          Birth Time <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="birthTime"
                          type="time"
                          {...form.register("birthTime")}
                          className={
                            form.formState.errors.birthTime
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {form.formState.errors.birthTime && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.birthTime.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentFields.includes("birthPlace") && (
                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">
                          Birth Place{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="birthPlace"
                          placeholder="City, Country"
                          {...form.register("birthPlace")}
                          className={
                            form.formState.errors.birthPlace
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {form.formState.errors.birthPlace && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.birthPlace.message}
                          </p>
                        )}
                      </div>
                    )}

                    {currentFields.includes("gender") && (
                      <div className="space-y-2">
                        <Label>
                          Gender <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid grid-cols-3 gap-4">
                          {["male", "female", "other"].map((option) => (
                            <Button
                              key={option}
                              type="button"
                              variant={
                                form.getValues("gender") === option
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full capitalize"
                              onClick={() => {
                                form.setValue(
                                  "gender",
                                  option as "male" | "female" | "other"
                                );
                                form.clearErrors("gender");
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {form.formState.errors.gender && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.gender.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    disabled={submitting}
                  >
                    Previous
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : currentStep === steps.length - 1 ? (
                    "Complete"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
