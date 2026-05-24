"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RiShoppingBag3Line, RiGroupLine, RiSettings3Line, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { HiOutlineClipboardList } from "react-icons/hi";

const links = [
  { href: "/dashboard/admin/orders", label: "Orders", icon: HiOutlineClipboardList },
  { href: "/dashboard/admin/products", label: "Products", icon: RiShoppingBag3Line },
  { href: "/dashboard/admin/users", label: "Users", icon: RiGroupLine },
  { href: "/dashboard/admin/settings", label: "Settings", icon: RiSettings3Line },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 mt-4">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active
                ? "bg-accent/15 text-accent shadow-sm"
                : "text-text-secondary hover:bg-white/40 hover:text-primary"
            }`}
          >
            <Icon className="text-lg" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] min-h-screen fixed left-0 top-0 pt-6 glass-card z-50"
        style={{ borderRadius: 0, borderRight: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)" }}
      >
        <div className="p-6">
          <h2 className="font-bold text-primary text-lg">Admin Panel</h2>
          <p className="text-xs text-text-secondary mt-1">Manage your store</p>
        </div>
        <div className="px-3">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white"
        style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
      >
        <RiMenuLine className="text-xl" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[280px] z-50 pt-6 lg:hidden"
              style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between px-6 mb-2">
                <h2 className="font-bold text-primary text-lg">Admin Panel</h2>
                <button onClick={() => setOpen(false)}>
                  <RiCloseLine className="text-2xl text-primary" />
                </button>
              </div>
              <div className="px-3">
                <NavLinks />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
