"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RiCloseLine, RiRefreshLine } from "react-icons/ri";

const refillStyles = {
  Pending: "bg-warning/20 text-yellow-700",
  Fulfilled: "bg-success/20 text-green-700",
  Rejected: "bg-danger/20 text-red-600",
};

export default function RefillModal({ isOpen, onClose, order, onSubmit }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const alreadyRequested = order.refillRequest?.requested;

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit(order._id, note);
    setLoading(false);
    setNote("");
    onClose();
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
              className="glass-card p-6 w-full max-w-md relative"
              style={{ background: "rgba(255,255,255,0.9)" }}
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-primary">
                <RiCloseLine className="text-2xl" />
              </button>

              <h3 className="font-bold text-xl text-primary flex items-center gap-2 mb-1">
                <RiRefreshLine className="text-accent" />
                {alreadyRequested ? "Refill Status" : "Request Refill"}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Order #{order._id?.slice(-6).toUpperCase()} — {order.productSnapshot?.title}
              </p>

              {alreadyRequested ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Status</span>
                    <div className="mt-1">
                      <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${refillStyles[order.refillRequest.status]}`}>
                        {order.refillRequest.status}
                      </span>
                    </div>
                  </div>
                  {order.refillRequest.note && (
                    <div>
                      <span className="text-xs font-semibold text-text-secondary">Your Note</span>
                      <p className="mt-1 text-sm text-primary bg-white/50 p-3 rounded-xl">{order.refillRequest.note}</p>
                    </div>
                  )}
                  {order.refillRequest.adminNote && (
                    <div>
                      <span className="text-xs font-semibold text-text-secondary">Admin Note</span>
                      <p className="mt-1 text-sm text-primary bg-white/50 p-3 rounded-xl">{order.refillRequest.adminNote}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">Note (optional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Describe the issue or reason for refill..."
                      className="w-full p-3 rounded-xl border border-white/40 bg-white/50 text-primary text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                      rows={3}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
