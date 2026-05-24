"use client";

import { useState, useEffect } from "react";
import OrderTable from "@/components/OrderTable";
import RefillModal from "@/components/RefillModal";
import EmptyState from "@/components/EmptyState";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";
import toast from "react-hot-toast";
import Link from "next/link";
import { RiShoppingBagLine, RiArrowLeftLine } from "react-icons/ri";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refillOrder, setRefillOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefill = async (orderId, note) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/refill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        toast.success("Refill request submitted!");
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to request refill");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-2 group">
          <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-primary">My Orders</h1>
      </div>

      {loading ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <tbody>
              {[1, 2, 3].map((i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Your orders will appear here after you make a purchase."
          icon={RiShoppingBagLine}
        />
      ) : (
        <OrderTable
          orders={orders}
          onRefill={(order) => setRefillOrder(order)}
          isAdmin={false}
        />
      )}

      <RefillModal
        isOpen={!!refillOrder}
        onClose={() => setRefillOrder(null)}
        order={refillOrder}
        onSubmit={handleRefill}
      />
    </div>
  );
}
