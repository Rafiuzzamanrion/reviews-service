"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
};

export default function AnimatedPage({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
