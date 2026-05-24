"use client";

import { motion } from "motion/react";
import { RiInboxLine } from "react-icons/ri";

export default function EmptyState({ title = "Nothing here yet", message = "No data to display.", icon: Icon = RiInboxLine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
        <Icon className="text-4xl text-accent" />
      </div>
      <h3 className="font-bold text-xl text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm">{message}</p>
    </motion.div>
  );
}
