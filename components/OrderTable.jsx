"use client";

import { motion } from "motion/react";
import { RiRefreshLine } from "react-icons/ri";

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

export default function OrderTable({ orders, onRefill, isAdmin, onStatusUpdate, onOrderClick }) {
  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/30">
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Order ID</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Product</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Qty</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Total</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Status</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Date</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Action</th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="border-b border-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                onClick={() => onOrderClick && onOrderClick(order)}
              >
                <td className="px-5 py-4 text-sm font-mono text-primary">
                  #{order._id?.slice(-6).toUpperCase()}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-primary">
                  {order.productSnapshot?.title || "—"}
                </td>
                <td className="px-5 py-4 text-sm text-primary">{order.quantity}</td>
                <td className="px-5 py-4 text-sm font-bold text-accent">
                  ${order.totalPrice?.toFixed(2)}
                </td>
                  <td className="px-5 py-4">
                    {isAdmin && onStatusUpdate ? (
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          onStatusUpdate(order._id, e.target.value, order);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusStyles[order.status]}`}
                      >
                      {["Pending", "Processing", "Completed", "Cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      // Admin View
                      order.refillRequest?.requested ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefill && onRefill(order);
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity shadow-sm ${refillStyles[order.refillRequest.status]}`}
                        >
                          Refill: {order.refillRequest.status}
                        </motion.button>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">No Request</span>
                      )
                    ) : (
                      // User View
                      order.refillRequest?.requested ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefill && onRefill(order);
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity shadow-sm ${refillStyles[order.refillRequest.status]}`}
                        >
                          Refill: {order.refillRequest.status}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefill && onRefill(order);
                          }}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        >
                          <RiRefreshLine /> Request Refill
                        </motion.button>
                      )
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrderClick && onOrderClick(order);
                    }}
                  >
                    View
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
