"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { RiFlashlightLine } from "react-icons/ri";

const cardVariants = {
  initial: { opacity: 0, y: 32, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

const statusColor = {
  "Premium Aged": "bg-yellow-100 text-yellow-700",
  "Mix Domain": "bg-blue-100 text-blue-700",
  "Single Domain": "bg-green-100 text-green-700",
};

export default function ProductCard({ product, index }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(13,59,102,0.18)" }}
      transition={{ duration: 0.2 }}
      className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer"
    >
      {/* Badge ribbon */}
      {product.badge && (
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              statusColor[product.badge] || "bg-accent/10 text-accent"
            }`}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-bold text-2xl text-primary pr-24 leading-tight">
        {product.title}
      </h3>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-extrabold text-accent">
          ৳{product.price.toFixed(2)}
        </span>
      </div>

      {/* Stock & Min Order chips */}
      <div className="flex flex-wrap gap-2">
        {product.instantDelivery && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-success/15 text-green-700">
            <RiFlashlightLine /> Instant Delivery
          </span>
        )}
      </div>

      {/* Terms & Conditions */}
      {product.termsAndConditions && (
        <div className="text-sm text-text-secondary border-t border-white/40 pt-4">
          <p className="truncate" title={product.termsAndConditions}>
            {product.termsAndConditions}
          </p>
        </div>
      )}

      {/* CTA Button */}
      <Link href={`/checkout/${product._id}`} className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl text-white font-bold text-base shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #0D3B66 0%, #1B9AAA 100%)" }}
        >
          Select & Order
        </motion.button>
      </Link>
    </motion.div>
  );
}
