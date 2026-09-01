import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link, NavLink } from "react-router-dom";
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-[#050505]/90 border-b border-white/10 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1450px] mx-auto px-6 lg:px-12">
          <div className="h-[88px] flex items-center justify-between">

            {/* Logo */}

            <Link
              to="/"
              className="group flex items-center gap-3 select-none"
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

            <nav className="hidden lg:flex items-center gap-9">

              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative text-[15px] tracking-wide transition duration-300 ${
                      isActive
                        ? "text-[#D4AF37]"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}

                      {isActive && (
                        <motion.div
                          layoutId="navIndicator"
                          className="absolute left-0 -bottom-3 h-[2px] w-full bg-[#D4AF37]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right */}

            <div className="hidden lg:flex items-center gap-3">

              <button
  onClick={() => setSearchOpen(true)}
  className="group w-11 h-11 rounded-full border border-white/10 bg-[#111111]/70 backdrop-blur-lg flex items-center justify-center hover:border-[#D4AF37] transition"
>
  <Search
    size={19}
    className="text-white group-hover:text-[#D4AF37]"
  />
</button>

              <Link to="/wishlist">
  <button className="relative group w-11 h-11 rounded-full border border-white/10 bg-[#111111]/70 backdrop-blur-lg flex items-center justify-center hover:border-[#D4AF37] transition">

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
  <button className="relative group w-11 h-11 rounded-full border border-white/10 bg-[#111111]/70 backdrop-blur-lg flex items-center justify-center hover:border-[#D4AF37] transition">

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
  <button className="ml-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b58d15] text-black font-semibold hover:scale-105 transition duration-300 shadow-[0_0_35px_rgba(212,175,55,.25)] flex items-center gap-2">

    <User size={18} />

    Account

  </button>
</Link>

            </div>

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
                    className={({ isActive }) =>
                      `text-lg transition ${
                        isActive
                          ? "text-[#D4AF37]"
                          : "text-white"
                      }`
                    }
                  >
                    {item.name}
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