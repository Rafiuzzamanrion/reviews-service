"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import toast from "react-hot-toast";
import { RiSettings3Line, RiAddLine, RiDeleteBinLine, RiToggleLine, RiToggleFill } from "react-icons/ri";

export default function AdminSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newMethod, setNewMethod] = useState({ name: "", key: "", details: [], isActive: true });
  const [newDetail, setNewDetail] = useState({ label: "", value: "", name: "" });

  const [deleteKey, setDeleteKey] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setPaymentMethods(data.paymentMethods || []);
    } catch (err) {
      toast.error("Failed to load settings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleActive = async (index) => {
    const updated = [...paymentMethods];
    updated[index].isActive = !updated[index].isActive;
    await saveMethods(updated);
  };

  const handleDelete = async () => {
    if (!deleteKey) return;
    try {
      const res = await fetch("/api/settings/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: deleteKey }),
      });
      if (res.ok) {
        toast.success("Payment method deleted");
        fetchSettings();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setDeleteKey(null);
  };

  const saveMethods = async (methods) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethods: methods }),
      });
      if (res.ok) {
        toast.success("Settings saved");
        fetchSettings();
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleAddDetail = () => {
    if (!newDetail.label || !newDetail.value) {
      toast.error("Label and value are required");
      return;
    }
    setNewMethod(prev => ({
      ...prev,
      details: [...prev.details, { ...newDetail }]
    }));
    setNewDetail({ label: "", value: "", name: "" });
  };

  const handleRemoveDetail = (idx) => {
    setNewMethod(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== idx)
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newMethod.name) {
      toast.error("Method name is required");
      return;
    }
    const key = newMethod.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    try {
      const res = await fetch("/api/settings/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newMethod, key }),
      });
      if (res.ok) {
        toast.success("Payment method added");
        setIsAdding(false);
        setNewMethod({ name: "", key: "", details: [], isActive: true });
        fetchSettings();
      } else {
        toast.error("Failed to add method");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Payment Settings</h1>
        {!isAdding && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 transition-colors"
          >
            <RiAddLine /> Add Method
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary mb-4 border-b border-white/40 pb-2">New Payment Method</h2>
              
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">Method Name (e.g. bKash, Binance) *</label>
                  <input
                    type="text"
                    required
                    value={newMethod.name}
                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/50 outline-none"
                  />
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-primary mb-3">Add Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Label (e.g. bKash Number)"
                      value={newDetail.label}
                      onChange={e => setNewDetail({ ...newDetail, label: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-accent/50 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. +8801...)"
                      value={newDetail.value}
                      onChange={e => setNewDetail({ ...newDetail, value: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-accent/50 outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name (Optional)"
                        value={newDetail.name}
                        onChange={e => setNewDetail({ ...newDetail, name: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-accent/50 outline-none"
                      />
                      <button type="button" onClick={handleAddDetail} className="px-3 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors font-bold text-xl">+</button>
                    </div>
                  </div>

                  {newMethod.details.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {newMethod.details.map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                          <div>
                            <span className="text-xs font-semibold text-text-secondary">{d.label}:</span>
                            <span className="ml-2 text-sm font-bold text-primary">{d.value}</span>
                            {d.name && <span className="ml-2 text-xs text-text-secondary">({d.name})</span>}
                          </div>
                          <button type="button" onClick={() => handleRemoveDetail(i)} className="text-danger hover:text-danger/70">
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors">
                    Save Method
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass-card h-48 animate-pulse bg-white/40" />)
        ) : paymentMethods.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="No Payment Methods" message="Add a payment method for customers to use during checkout." icon={RiSettings3Line} />
          </div>
        ) : (
          paymentMethods.map((method, index) => (
            <motion.div
              key={method.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 relative"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/40 pb-3">
                <h3 className="font-bold text-lg text-primary">{method.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(index)}
                    className="text-2xl transition-colors"
                  >
                    {method.isActive ? <RiToggleFill className="text-success" /> : <RiToggleLine className="text-gray-400" />}
                  </button>
                  <button
                    onClick={() => setDeleteKey(method.key)}
                    className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {method.details?.map((d, i) => (
                  <div key={i} className="bg-white/50 p-3 rounded-lg border border-white/60">
                    <div className="text-xs font-semibold text-text-secondary mb-0.5">{d.label}</div>
                    <div className="text-sm font-bold text-primary">{d.value}</div>
                    {d.name && <div className="text-xs text-text-secondary mt-0.5">{d.name}</div>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteKey}
        onClose={() => setDeleteKey(null)}
        onConfirm={handleDelete}
        title="Delete Payment Method"
        message="Are you sure you want to remove this payment method?"
      />
    </div>
  );
}
