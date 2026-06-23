"use client";

import { useState, useEffect } from "react";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { RiShoppingBag3Line, RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from "react-icons/ri";

const initialForm = {
  title: "",
  price: 0,
  termsAndConditions: "",
  badge: "",
  instantDelivery: true,
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      // Admin needs to see all products, ignoring pagination for the dashboard table for simplicity here,
      // or using a large limit.
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddPanel = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsPanelOpen(true);
  };

  const openEditPanel = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      termsAndConditions: product.termsAndConditions || "",
      badge: product.badge || "",
      instantDelivery: product.instantDelivery,
      isActive: product.isActive,
    });
    setEditingId(product._id);
    setIsPanelOpen(true);
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        toast.success(`Product ${!product.isActive ? "activated" : "deactivated"}`);
        fetchProducts();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        toast.success(editingId ? "Product updated" : "Product created");
        setIsPanelOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Products</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddPanel}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-colors"
        >
          <RiAddLine /> Add Product
        </motion.button>
      </div>

      {loading ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <tbody>
              {[1, 2, 3].map((i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" message="Add your first product to get started." icon={RiShoppingBag3Line} />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Title</th>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Price</th>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Status</th>
                  <th className="text-right px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-primary">{product.title}</div>
                      {product.badge && <div className="text-xs text-accent mt-0.5">{product.badge}</div>}
                    </td>
                    <td className="px-5 py-4 font-bold text-primary">৳{product.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          product.isActive ? "bg-success/20 text-green-700 hover:bg-success/30" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditPanel(product)}
                          className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          <RiEditLine className="text-lg" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product._id)}
                          className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        confirmColor="danger"
      />

      {/* Slide-in Form Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
              onClick={() => setIsPanelOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-primary">{editingId ? "Edit Product" : "Add Product"}</h2>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100">
                  <RiCloseLine className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/50 outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1">Price ($) *</label>
                      <input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/50 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1">Badge</label>
                      <input type="text" placeholder="e.g. Premium Aged" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/50 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1">Terms & Conditions</label>
                    <textarea
                      rows={4}
                      placeholder="Enter terms and conditions for this product..."
                      value={formData.termsAndConditions}
                      onChange={e => setFormData({...formData, termsAndConditions: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/50 outline-none resize-vertical"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.instantDelivery} onChange={e => setFormData({...formData, instantDelivery: e.target.checked})} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                      <span className="text-sm font-semibold text-primary">Instant Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                      <span className="text-sm font-semibold text-primary">Active</span>
                    </label>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" form="productForm" disabled={submitting} className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {submitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
