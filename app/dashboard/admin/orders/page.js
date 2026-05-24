"use client";

import { useState, useEffect } from "react";
import OrderTable from "@/components/OrderTable";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { RiFileList3Line } from "react-icons/ri";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [refillOrder, setRefillOrder] = useState(null);
  const [refillNote, setRefillNote] = useState("");
  const [refillStatus, setRefillStatus] = useState("Fulfilled");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?view=admin&status=${filter}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleRefillSubmit = async () => {
    try {
      const res = await fetch(`/api/orders/${refillOrder._id}/refill`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: refillStatus, adminNote: refillNote }),
      });
      if (res.ok) {
        toast.success(`Refill marked as ${refillStatus}`);
        setRefillOrder(null);
        setRefillNote("");
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update refill");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-white/40 bg-white/50 text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 glass-card"
        >
          {["All", "Pending", "Processing", "Completed", "Cancelled"].map((s) => (
            <option key={s} value={s}>{s} Orders</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" message="There are no orders matching this filter." icon={RiFileList3Line} />
      ) : (
        <OrderTable
          orders={orders}
          isAdmin={true}
          onStatusUpdate={handleStatusUpdate}
          onRefill={(order) => {
            setRefillOrder(order);
            setRefillStatus("Fulfilled");
            setRefillNote("");
          }}
        />
      )}

      {/* Admin Refill Handler Modal */}
      {refillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-md bg-white/95">
            <h3 className="font-bold text-xl text-primary mb-2">Handle Refill Request</h3>
            <p className="text-sm text-text-secondary mb-4">
              Order #{refillOrder._id.slice(-6).toUpperCase()}
            </p>
            
            <div className="bg-warning/10 p-3 rounded-lg mb-4 border border-warning/20">
              <span className="text-xs font-semibold text-yellow-700 block mb-1">User Note:</span>
              <p className="text-sm text-yellow-800">{refillOrder.refillRequest.note || "No note provided"}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Action</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRefillStatus("Fulfilled")}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${refillStatus === "Fulfilled" ? "bg-success text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    Fulfill
                  </button>
                  <button
                    onClick={() => setRefillStatus("Rejected")}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${refillStatus === "Rejected" ? "bg-danger text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Admin Note (optional)</label>
                <textarea
                  value={refillNote}
                  onChange={(e) => setRefillNote(e.target.value)}
                  placeholder="Explain why it was rejected, or add details..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRefillOrder(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefillSubmit}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
