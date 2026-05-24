"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ProductCard from "./ProductCard";
import ShowMoreButton from "./ShowMoreButton";
import { ProductCardSkeleton } from "./LoadingSkeleton";

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function ProductGrid({ initialProducts, initialPage, totalPages }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(initialPage || 1);
  const [maxPages, setMaxPages] = useState(totalPages || 1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/products?page=${nextPage}&limit=12`);
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
      setMaxPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load more products:", err);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {products.map((product, idx) => (
          <ProductCard key={product._id} product={product} index={idx} />
        ))}
      </motion.div>

      <ShowMoreButton
        onClick={loadMore}
        loading={loading}
        hasMore={page < maxPages}
      />
    </>
  );
}
