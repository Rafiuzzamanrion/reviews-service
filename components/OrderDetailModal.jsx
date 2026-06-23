"use client";

import { motion, AnimatePresence } from "motion/react";
import { RiCloseLine, RiExternalLinkLine } from "react-icons/ri";

const statusStyles = {
  Pending: "bg-warning/20 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-success/20 text-green-700",
  Cancelled: "bg-danger/20 text-red-600",
};

const refillStyles = {
  Pending: "bg-warning/20 text-yellow-700",
  Fulfilled: "bg-success/20 text-green-700",
  Rejected: "bg-danger/20 text-red-600",
};

export default function OrderDetailModal({ isOpen, onClose, order }) {
  if (!order) return null;

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
              className="glass-card p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto relative"
              style={{ background: "rgba(255,255,255,0.92)" }}
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-primary">
                <RiCloseLine className="text-2xl" />
              </button>

              <h3 className="font-bold text-xl text-primary mb-4 pr-8">
                Order #{order._id?.slice(-6).toUpperCase()}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Product</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">{order.productSnapshot?.title || "—"}</p>
                    {order.productSnapshot?.badge && (
                      <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent uppercase">
                        {order.productSnapshot.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</span>
                    <div className="mt-0.5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Price</span>
                    <p className="text-sm font-bold text-accent mt-0.5">${order.productSnapshot?.price?.toFixed(2) || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Quantity</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">{order.quantity}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Total</span>
                    <p className="text-sm font-bold text-accent mt-0.5">${order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Date</span>
                    <p className="text-sm text-primary mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <hr className="border-white/30" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Customer Name</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">{order.fullName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Customer Email</span>
                    <p className="text-sm text-primary mt-0.5">{order.userId?.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Contact</span>
                    <p className="text-sm text-primary mt-0.5">{order.contact || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Delivery Address</span>
                    <p className="text-sm text-primary mt-0.5">{order.deliveryAddress || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Payment Method</span>
                    <p className="text-sm text-primary mt-0.5">{order.paymentMethod || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Transaction ID</span>
                    <p className="text-sm font-mono text-primary mt-0.5">{order.transactionId || "—"}</p>
                  </div>
                </div>

                {order.businessLink && (
                  <>
                    <hr className="border-white/30" />
                    <div>
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Business Link</span>
                      <p className="text-sm text-primary mt-0.5 break-all">{order.businessLink}</p>
                    </div>
                  </>
                )}

                {order.completionLink && (
                  <>
                    <hr className="border-white/30" />
                    <div>
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Completion Link</span>
                      <a
                        href={order.completionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent font-semibold mt-0.5 flex items-center gap-1 hover:underline break-all"
                      >
                        {order.completionLink} <RiExternalLinkLine className="shrink-0" />
                      </a>
                    </div>
                  </>
                )}

                {order.refillRequest?.requested && (
                  <>
                    <hr className="border-white/30" />
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Refill Request</span>
                      <div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${refillStyles[order.refillRequest.status]}`}>
                          {order.refillRequest.status}
                        </span>
                      </div>
                      {order.refillRequest.note && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs font-semibold text-text-secondary">User Note</span>
                          <p className="text-sm text-primary mt-0.5">{order.refillRequest.note}</p>
                        </div>
                      )}
                      {order.refillRequest.adminNote && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs font-semibold text-text-secondary">Admin Note</span>
                          <p className="text-sm text-primary mt-0.5">{order.refillRequest.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
