"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { HiUserCircle, HiMenu, HiX } from "react-icons/hi";
import { RiShoppingBagLine, RiAdminLine, RiLogoutBoxLine, RiDashboardLine } from "react-icons/ri";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isAdminRoute ? "lg:pl-[250px]" : ""
        } ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/30"
            : "bg-transparent"
        }`}
      >
        <div className={isAdminRoute ? "w-full px-4 sm:px-6 lg:px-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-lg gradient-text hidden sm:block">
                Premiums Edu Market
              </span>
              <span className="font-bold text-lg gradient-text sm:hidden">
                PEM
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {!session ? (
                <>
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-xl text-white font-semibold"
                      style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card cursor-pointer"
                  >
                    <HiUserCircle className="text-2xl text-primary" />
                    <span className="text-sm font-semibold text-primary max-w-[120px] truncate">
                      {session.user?.name}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 glass-card overflow-hidden shadow-xl z-50"
                        style={{ borderRadius: "16px" }}
                      >
                        <Link
                          href="/dashboard/user/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-white/40 transition-colors"
                        >
                          <RiShoppingBagLine className="text-accent text-lg" />
                          My Orders
                        </Link>
                        {session.user?.role === "admin" && (
                          <Link
                            href="/dashboard/admin/orders"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-white/40 transition-colors"
                          >
                            <RiAdminLine className="text-accent text-lg" />
                            Admin Panel
                          </Link>
                        )}
                        <hr className="border-white/30 mx-4" />
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-red-50/50 transition-colors w-full text-left"
                        >
                          <RiLogoutBoxLine className="text-lg" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 z-50 p-6 md:hidden"
              style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold gradient-text text-lg">🎓 PEM</span>
                <button onClick={() => setMobileOpen(false)}>
                  <HiX className="text-2xl text-primary" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {!session ? (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold">
                        Login
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, #0D3B66, #1B9AAA)" }}>
                        Sign Up
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-primary">{session.user?.name}</p>
                    <Link href="/dashboard/user/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-primary border-b border-gray-100">
                      <RiShoppingBagLine className="text-accent text-lg" /> My Orders
                    </Link>
                    {session.user?.role === "admin" && (
                      <Link href="/dashboard/admin/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-primary border-b border-gray-100">
                        <RiAdminLine className="text-accent text-lg" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                      className="flex items-center gap-3 py-3 text-danger w-full"
                    >
                      <RiLogoutBoxLine className="text-lg" /> Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-[70px]" />
    </>
  );
}
