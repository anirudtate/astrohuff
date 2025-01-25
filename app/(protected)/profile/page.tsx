"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import * as z from "zod";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth() as { user: User | null };
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
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div
                      className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}
                  {success && (
                    <div
                      className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm"
                      role="alert"
                    >
                      Profile updated successfully
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      {...register("displayName")}
                      id="displayName"
                      placeholder="Your display name"
                      disabled={loading || isSubmitting}
                      className="max-w-md"
                    />
                    {errors.displayName && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                    {(loading || isSubmitting) && (
                      <p className="text-sm text-muted-foreground">
                        Updating your profile...
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.metadata.creationTime
                        ? new Date(
                            user.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Sign In</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.metadata.lastSignInTime
                        ? new Date(
                            user.metadata.lastSignInTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
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
