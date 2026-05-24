"use client";

import { motion, AnimatePresence } from "motion/react";
import { RiCloseLine, RiAlertLine } from "react-icons/ri";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", confirmColor = "danger" }) {
  const colorMap = {
    danger: "bg-danger hover:bg-danger/90",
    warning: "bg-warning hover:bg-warning/90 text-primary",
    accent: "bg-accent hover:bg-accent/90",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card p-6 w-full max-w-sm relative text-center"
              style={{ background: "rgba(255,255,255,0.92)" }}
            >
              <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <RiAlertLine className="text-3xl text-danger" />
              </div>
              <h3 className="font-bold text-lg text-primary mb-2">{title || "Are you sure?"}</h3>
              <p className="text-sm text-text-secondary mb-6">{message || "This action cannot be undone."}</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-white transition-colors ${colorMap[confirmColor] || colorMap.danger}`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
