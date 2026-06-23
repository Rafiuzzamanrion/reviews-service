"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import AnimatedPage from "@/components/AnimatedPage";
import toast from "react-hot-toast";
import { RiMailLine, RiArrowLeftLine, RiLockUnlockLine } from "react-icons/ri";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        setSent(true);
        if (data.devLink) {
          setDevLink(data.devLink);
          toast.success("Reset link generated! Use the link below.");
        } else {
          toast.success(data.message || "Check your email for the reset link.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

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
                <RiLockUnlockLine className="text-3xl text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
              <p className="text-sm text-text-secondary mt-1">
                {sent ? "Check your email for the reset link" : "Enter your email to receive a reset link"}
              </p>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-text-secondary">
                  We sent a password reset link to <span className="font-semibold text-primary">{email}</span>.
                  The link expires in 1 hour.
                </p>
                {devLink && (
                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-left">
                    <p className="text-xs font-semibold text-accent mb-2">Your password reset link:</p>
                    <a href={devLink} className="text-sm text-accent font-semibold break-all hover:underline">
                      {devLink}
                    </a>
                    <p className="text-xs text-text-secondary mt-2">Click the link above to reset your password. It expires in 1 hour.</p>
                  </div>
                )}
                <button
                  onClick={() => { setSent(false); setEmail(""); setDevLink(""); }}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Try a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Email</label>
                  <div className="relative">
                    <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </form>
            )}

            <p className="text-center text-sm text-text-secondary mt-6">
              Remember your password?{" "}
              <Link href="/login" className="font-semibold text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
