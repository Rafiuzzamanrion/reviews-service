"use client";

import { motion } from "motion/react";
import { RiLoader4Line, RiArrowDownLine } from "react-icons/ri";

export default function ShowMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-10">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-primary border-2 border-primary/30 glass-card hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RiLoader4Line className="animate-spin text-xl" />
            Loading...
          </>
        ) : (
          <>
            <RiArrowDownLine className="text-xl" />
            Show More Products
          </>
        )}
      </motion.button>
    </div>
  );
}
