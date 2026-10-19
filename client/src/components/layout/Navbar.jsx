import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
} from "lucide-react";
import SearchModal from "./SearchModal";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop",
    path: "/shop",
  },
  {
    name: "Collections",
    path: "/collections",
  },
  {
    name: "New Arrivals",
    path: "/new-arrivals",
  },
  {
    name: "About",
    path: "/about",
  },
];

const adminNavItems = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Products",
    path: "/admin/products",
  },
  {
    name: "Orders",
    path: "/admin/orders",
  },
  {
    name: "Customers",
    path: "/admin/customers",
  },
  {
    name: "Returns",
    path: "/admin/returns",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

const { cartCount } = useCart();
const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
        }}
        className="fixed top-0 left-0 w-full z-50 px-4 lg:px-8 pt-4 transition-all duration-500"
      >
        <div className="max-w-[1450px] mx-auto rounded-[26px] border border-white/10 bg-[#111111]/55 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.45)] px-6 lg:px-10">
          <div className="h-[88px] flex items-center justify-between rounded-2xl">

            {/* Logo */}

            <Link
  to={isAdminPage ? "/admin" : "/"}
  className="group flex items-center gap-3 select-none"
  aria-label={isAdminPage ? "Admin Dashboard" : "ShopSpher Home"}
>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#9C7B18] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,.35)]">

                <span className="font-black text-black text-xl">
                  S
                </span>

              </div>

              <div>

                <h1 className="text-white text-2xl font-black tracking-[0.18em]">
                  ShopSpher
                </h1>

                <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37]">
                  Luxury Commerce
                </p>

              </div>
            </Link>

            {/* Desktop */}

            {!isAdminPage && (
  <nav className="hidden lg:flex items-center gap-9">

              {navItems.map((item) => (
                <NavLink
  key={item.name}
  to={item.path}
  className="relative text-[15px] tracking-wide"
>
  {({ isActive }) => (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
          className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_8px_30px_rgba(0,0,0,.20)]"
        />
      )}

      <span
className={`relative z-10 block rounded-full px-5 py-2.5 transition-all duration-300 hover:bg-white/[0.05] hover:backdrop-blur-md ${          isActive
            ? "text-[#D4AF37]"
            : "text-gray-300 hover:text-white"
        }`}
      >
        {item.name}
      </span>
    </div>
  )}
</NavLink>
              ))}
              </nav>
)}

{isAdminPage && (
  <nav className="hidden lg:flex items-center gap-7">
    {adminNavItems.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        className="relative text-[15px] tracking-wide"
      >
        {({ isActive }) => (
          <div className="relative">

            {isActive && (
              <motion.div
                layoutId="adminNavIndicator"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
                className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_8px_30px_rgba(0,0,0,.20)]"
              />
            )}

            <span
              className={`relative z-10 block rounded-full px-5 py-2.5 transition-all duration-300 hover:bg-white/[0.05] hover:backdrop-blur-md ${
                isActive
                  ? "text-[#D4AF37]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </span>

          </div>
        )}
      </NavLink>
    ))}
  </nav>
)}

            {/* Right */}

{!isAdminPage && (
  <div className="hidden lg:flex items-center gap-3">
              <button
  onClick={() => setSearchOpen(true)}
  className="group w-11 h-11 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_30px_rgba(0,0,0,.25)] flex items-center justify-center hover:border-[#D4AF37] transition"
>
  <Search
    size={19}
    className="text-white group-hover:text-[#D4AF37]"
  />
</button>

              <Link to="/wishlist">
  <button className="relative group w-11 h-11 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_30px_rgba(0,0,0,.25)] flex items-center justify-center hover:border-[#D4AF37] transition">

    <Heart
      size={19}
      className="text-white group-hover:text-[#D4AF37]"
    />

    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
      {wishlistCount}
    </span>

  </button>
</Link>

              <Link to="/cart">
  <button className="relative group w-11 h-11 rounded-full border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_8px_30px_rgba(0,0,0,.25)] flex items-center justify-center hover:border-[#D4AF37] transition">

    <ShoppingBag
      size={19}
      className="text-white group-hover:text-[#D4AF37]"
    />

    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
  {cartCount}
</span>

  </button>
</Link>

              <Link to="/account">
  <button className="ml-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b58d15] text-black font-semibold hover:scale-105 transition duration-300 shadow-[0_0_35px_rgba(212,175,55,.30)] flex items-center gap-2">

    <User size={18} />

    Account

  </button>
</Link>

              </div>
)}

            {/* Mobile */}

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white"
            >
              <Menu size={30} />
            </button>

          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}

      <AnimatePresence>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[999]"
          >

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.35,
              }}
              className="absolute right-0 top-0 h-full w-[330px] bg-[#0B0B0B] border-l border-white/10"
            >

              <div className="flex items-center justify-between p-6 border-b border-white/10">

                <h2 className="text-white text-xl font-bold">
                  Menu
                </h2>

                <button
                  onClick={() => setMobileOpen(false)}
                >
                  <X
                    size={28}
                    className="text-white"
                  />
                </button>

              </div>

              <div className="flex flex-col px-7 py-8 gap-7">

                {navItems.map((item) => (
  <NavLink
    key={item.name}
    to={item.path}
    onClick={() => setMobileOpen(false)}
    className="relative"
  >
    {({ isActive }) => (
      <div className="relative">

        {isActive && (
          <motion.div
            layoutId="mobileNavIndicator"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
            className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.08] backdrop-blur-xl"
          />
        )}

        <span
          className={`relative z-10 block rounded-2xl px-5 py-3 text-lg transition-all duration-300 ${
            isActive
              ? "text-[#D4AF37]"
              : "text-white hover:bg-white/[0.05]"
          }`}
        >
          {item.name}
        </span>

      </div>
    )}
  </NavLink>
))}

                <Link
  to="/account"
  onClick={() => setMobileOpen(false)}
  className="mt-6 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b48b17] text-black font-bold text-center"
>
  My Account
</Link>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

<SearchModal
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
/>

</>
);
}