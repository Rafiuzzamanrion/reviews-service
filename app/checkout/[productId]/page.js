"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import AnimatedPage from "@/components/AnimatedPage";
import toast from "react-hot-toast";
import Link from "next/link";
import { RiFileCopyLine, RiCheckLine, RiShoppingCartLine, RiFlashlightLine, RiArrowLeftLine } from "react-icons/ri";

export default function CheckoutPage({ params }) {
  const { productId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState("");

  const [quantity, setQuantity] = useState(20);
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [deliveryType, setDeliveryType] = useState("Email");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/settings"),
        ]);
        const prodData = await prodRes.json();
        const settingsData = await settingsRes.json();
        setProduct(prodData);
        setSettings(settingsData);
        if (prodData.minOrder) setQuantity(prodData.minOrder);
        const activeMethods = settingsData.paymentMethods?.filter((m) => m.isActive);
        if (activeMethods?.length > 0) setPaymentMethod(activeMethods[0].key);
      } catch (err) {
        toast.error("Failed to load product data");
      }
      setLoading(false);
    }
    fetchData();
  }, [productId]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  const totalPrice = product ? (quantity * product.price).toFixed(2) : "0.00";

  const activeMethods = settings?.paymentMethods?.filter((m) => m.isActive) || [];
  const selectedMethod = activeMethods.find((m) => m.key === paymentMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push(`/login?callbackUrl=/checkout/${productId}`);
      return;
    }

    if (!fullName || !contact || !deliveryAddress || !paymentMethod || !transactionId) {
      toast.error("Please fill in all fields");
      return;
    }

    if (quantity < product.minOrder) {
      toast.error(`Minimum order is ${product.minOrder}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          fullName,
          contact,
          deliveryAddress: `${deliveryType}: ${deliveryAddress}`,
          paymentMethod: selectedMethod?.name || paymentMethod,
          transactionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        setSubmitting(false);
        return;
      }

      toast.success("Order placed successfully!");
      router.push("/dashboard/user/orders");
    } catch (err) {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <p className="text-text-secondary">Product not found.</p>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-8 group">
          <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Product Info & Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Product Banner */}
            <div className="glass-card p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.82)" }}>
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary">{product.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {product.badge && (
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-accent/10 text-accent uppercase tracking-wider">{product.badge}</span>
                    )}
                    {product.instantDelivery && (
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-success/15 text-green-700 flex items-center gap-1 uppercase tracking-wider">
                        <RiFlashlightLine /> Instant Delivery
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-4xl font-extrabold text-accent">${product.price.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-text-secondary ml-1">/ piece</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-text-secondary mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  <span>Minimum Order: {product.minOrder}</span>
                  <span>Stock Available: {product.stock?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Summary & Quantity */}
            <div className="glass-card p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.82)" }}>
              <h2 className="text-lg font-bold text-primary mb-4 border-b border-gray-100 pb-2">Order Summary</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary mb-2">
                  Quantity (pieces)
                </label>
                <input
                  type="number"
                  min={product.minOrder}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || product.minOrder)}
                  className="w-full px-4 py-3 text-lg font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <span className="font-semibold text-text-secondary">Subtotal</span>
                <span className="font-bold text-primary">${totalPrice}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="font-semibold text-text-secondary">Fees</span>
                <span className="font-bold text-success">Free</span>
              </div>
              <div className="flex items-center justify-between py-4 mt-2">
                <span className="text-lg font-bold text-primary">Total to Pay</span>
                <span className="text-2xl font-extrabold text-accent">${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 space-y-6" style={{ background: "rgba(255,255,255,0.82)" }}>
              <h2 className="text-xl font-bold text-primary mb-4 border-b border-gray-100 pb-3">Delivery Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Contact (WhatsApp/Email) *</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="Your WhatsApp or Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Where should we deliver the accounts? *</label>
                <div className="flex gap-3 mb-3">
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-1/3 px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
                  >
                    <option>Email</option>
                    <option>WhatsApp</option>
                  </select>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    placeholder={deliveryType === "Email" ? "your@email.com" : "+880xxxxxxxxx"}
                    className="w-2/3 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-primary mt-8 mb-4 border-b border-gray-100 pb-3">Payment Information</h2>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-3">1. Select a Payment Method</label>
                {activeMethods.length === 0 ? (
                  <p className="text-sm font-semibold text-danger bg-danger/10 p-3 rounded-lg">No payment methods currently available. Please contact support.</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3 mb-5">
                      {activeMethods.map((m) => (
                         <button
                          key={m.key}
                          type="button"
                          onClick={() => setPaymentMethod(m.key)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                            paymentMethod === m.key
                              ? "border-accent bg-accent text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-600 hover:border-accent/40"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>

                    {selectedMethod && (
                      <div className="bg-gray-50/80 rounded-xl p-5 mb-5 border border-gray-200 shadow-inner">
                        <p className="text-sm font-semibold text-primary mb-3">Send <span className="font-extrabold text-accent">${totalPrice}</span> to one of the following details:</p>
                        <div className="space-y-3">
                          {selectedMethod.details?.map((detail, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{detail.label}</span>
                                <p className="text-base font-bold text-primary truncate mt-0.5">{detail.value}</p>
                                {detail.name && (
                                  <p className="text-xs font-semibold text-text-secondary mt-0.5">{detail.name}</p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(detail.value, detail.label)}
                                className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                                  copied === detail.label ? "bg-success text-white" : "bg-accent/10 text-accent hover:bg-accent/20"
                                }`}
                                title="Copy to clipboard"
                              >
                                {copied === detail.label ? <RiCheckLine className="text-xl" /> : <RiFileCopyLine className="text-xl" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">2. Enter Transaction ID *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="e.g., 9X7A5B2C or TRX123456"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-mono text-primary"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || activeMethods.length === 0}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
                >
                  <RiShoppingCartLine className="text-2xl" />
                  {submitting ? "Processing Order..." : `Confirm & Pay $${totalPrice}`}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </AnimatedPage>
  );
}
