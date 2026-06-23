"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import Link from "next/link";
import AnimatedPage from "@/components/AnimatedPage";
import toast from "react-hot-toast";
import { RiMailLine, RiLockLine, RiUserLine, RiUserAddLine, RiArrowLeftLine } from "react-icons/ri";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("Account created! Please log in.");
        router.push("/login");
      } else {
        toast.success("Welcome to Buy GMB reviews!");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-mesh px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-6 group">
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
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
              <RiUserAddLine className="text-3xl text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Create Account</h1>
            <p className="text-sm text-text-secondary mt-1">Join Buy GMB reviews</p>
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
              <label className="block text-sm font-semibold text-primary mb-1.5">Full Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/40 bg-white/50 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Password</label>
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
              <p className="text-xs text-text-secondary mt-1.5">Minimum 6 characters</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-base shadow-md disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
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
