"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import AnimatedPage from "@/components/AnimatedPage";
import toast from "react-hot-toast";
import { RiLockLine, RiLockPasswordLine, RiArrowLeftLine } from "react-icons/ri";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        toast.success("Password reset successful! Please log in.");
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <AnimatedPage>
        <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-mesh px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 sm:p-10 w-full max-w-md text-center"
            style={{ background: "rgba(255,255,255,0.82)" }}
          >
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <RiLockPasswordLine className="text-3xl text-danger" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Invalid Link</h1>
            <p className="text-sm text-text-secondary mb-6">This password reset link is invalid or missing.</p>
            <Link href="/forgot-password" className="font-semibold text-accent hover:underline">
              Request a new reset link
            </Link>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-mesh px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-6 group">
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 sm:p-10 w-full max-w-md"
            style={{ background: "rgba(255,255,255,0.82)" }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <RiLockPasswordLine className="text-3xl text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
              <p className="text-sm text-text-secondary mt-1">Enter your new password</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 text-danger text-sm font-medium px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">New Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/40 bg-white/50 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/40 bg-white/50 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-base shadow-md disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
