"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { RiFlashlightLine, RiShieldCheckLine, RiStackLine } from "react-icons/ri";
import { FaTag } from "react-icons/fa";

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
          ${product.price.toFixed(2)}
        </span>
        <span className="text-sm text-text-secondary font-medium">/piece</span>
      </div>

      {/* Stock & Min Order chips */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-warning/20 text-yellow-700">
          <RiStackLine /> Stock: {product.stock?.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
          Min: {product.minOrder} pcs
        </span>
        {product.instantDelivery && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-success/15 text-green-700">
            <RiFlashlightLine /> Instant Delivery
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 text-sm text-text-secondary border-t border-white/40 pt-4">
        {product.format && (
          <div className="flex items-center gap-2">
            <RiStackLine className="text-accent shrink-0" />
            <span>Format: <span className="font-medium text-primary">{product.format}</span></span>
          </div>
        )}
        {product.access && (
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="text-accent shrink-0" />
            <span>Access: <span className="font-medium text-primary">{product.access}</span></span>
          </div>
        )}
        {product.policy && (
          <div className="flex items-center gap-2">
            <FaTag className="text-accent shrink-0" />
            <span>Policy: <span className="font-medium text-primary">{product.policy}</span></span>
          </div>
        )}
      </div>

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
