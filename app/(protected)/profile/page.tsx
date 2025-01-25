"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { updateProfile } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import * as z from "zod";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  photoURL: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setError("");
      setSuccess(false);
      setLoading(true);

      if (!user) {
        setError("You must be logged in to update your profile");
        return;
      }

      const { error: updateError } = await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      if (updateError) {
        setError(
          updateError instanceof FirebaseError
            ? "Failed to update profile"
            : "An unexpected error occurred"
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Update your profile information
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <p
                      className="text-sm text-red-500 text-center"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  {success && (
                    <p
                      className="text-sm text-green-500 text-center"
                      role="alert"
                    >
                      Profile updated successfully
                    </p>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      {...register("displayName")}
                      id="displayName"
                      placeholder="Your display name"
                      disabled={loading || isSubmitting}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="photoURL">Profile Photo URL</Label>
                    <Input
                      {...register("photoURL")}
                      id="photoURL"
                      placeholder="https://example.com/photo.jpg"
                      disabled={loading || isSubmitting}
                    />
                    {errors.photoURL && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.photoURL.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
