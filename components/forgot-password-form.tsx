"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { sendPasswordResetEmail } from "@/lib/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
import * as z from "zod"
import Link from "next/link";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  })

  const getFirebaseErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email address"
      case "auth/invalid-email":
        return "Invalid email address"
      case "auth/too-many-requests":
        return "Too many requests. Please try again later"
      default:
        return "An error occurred while sending the password reset email"
    }
  }

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setError("")
      setSuccess(false)
      setLoading(true)

      const { error: resetError } = await sendPasswordResetEmail(data.email)
      
      if (resetError) {
        setError(resetError instanceof FirebaseError 
          ? getFirebaseErrorMessage(resetError)
          : "Failed to send password reset email")
        return
      }

      setSuccess(true)
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {error && (
                <p className="text-sm text-red-500 text-center" role="alert">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-500 text-center" role="alert">
                  Check your email for a link to reset your password
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  disabled={loading || isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500" role="alert">{errors.email.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline underline-offset-4 text-primary">
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 