
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const GOLD = "#D4AF37";

const company = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const shop = [
  { label: "Shop", path: "/shop" },
  { label: "Collections", path: "/collections" },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Wishlist", path: "/wishlist" },
];

const support = [
  { label: "Contact Support", path: "/contact" },
  { label: "Returns", path: "/account/orders" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter your email address.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail
    );

    if (!validEmail) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }

    // No newsletter API is configured yet. Don't claim a subscription
    // succeeded until the backend can actually save the address.
    setNewsletterStatus("error");
    setNewsletterMessage(
      "Newsletter subscriptions aren't available yet. Please check back soon."
    );
  };

  const renderLinks = (items) =>
    items.map((item) => (
      <Link
        key={item.label}
        to={item.path}
        className="block text-sm text-zinc-400 transition-colors duration-200 hover:text-[#D4AF37]"
      >
        {item.label}
      </Link>
    ));

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* Main footer columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.8fr_1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="ShopSpher home"
              className="group inline-flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#9C7B18] transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
                <span className="text-2xl font-black text-black">
                  S
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-wide sm:text-3xl">
                  ShopSpher
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  Luxury Commerce
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-zinc-400">
              Discover carefully curated fashion, accessories,
              electronics, and lifestyle products for a premium
              shopping experience.
            </p>

            {/* Functional contact links */}
            <div className="mt-7 flex flex-wrap gap-3">
              <motion.a
                href="mailto:podarallasomasekharreddy@gmail.com"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Email ShopSpher"
                title="Email ShopSpher"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <Mail size={18} />
              </motion.a>

              <motion.a
                href="tel:+919032665886"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Call ShopSpher"
                title="Call ShopSpher"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <Phone size={18} />
              </motion.a>

              <motion.a
                href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C%20Telangana%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Find Hyderabad on Google Maps"
                title="Location"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <MapPin size={18} />
              </motion.a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-lg font-bold">Company</h3>
            <div className="mt-6 space-y-4">
              {renderLinks(company)}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-lg font-bold">Shop</h3>
            <div className="mt-6 space-y-4">
              {renderLinks(shop)}
            </div>
          </div>

          {/* Support and contact */}
          <div>
            <h3 className="text-lg font-bold">Support</h3>

            <div className="mt-6 space-y-4">
              {renderLinks(support)}
            </div>

            <div className="mt-8 space-y-5">
              <a
                href="mailto:podarallasomasekharreddy@gmail.com"
                className="flex items-start gap-3 break-all text-sm leading-6 text-zinc-400 transition hover:text-[#D4AF37]"
              >
                <Mail
                  size={17}
                  color={GOLD}
                  className="mt-1 shrink-0"
                />
                <span>
                  podarallasomasekharreddy@gmail.com
                </span>
              </a>

              <a
                href="tel:+919032665886"
                className="flex items-center gap-3 text-sm text-zinc-400 transition hover:text-[#D4AF37]"
              >
                <Phone
                  size={17}
                  color={GOLD}
                  className="shrink-0"
                />
                <span>+91 90326 65886</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C%20Telangana%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm leading-6 text-zinc-400 transition hover:text-[#D4AF37]"
              >
                <MapPin
                  size={17}
                  color={GOLD}
                  className="mt-1 shrink-0"
                />
                <span>Hyderabad, Telangana, India</span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="my-14 h-px bg-white/10 sm:my-16" />

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Stay in the know
            </p>

            <h2 className="text-2xl font-black sm:text-3xl">
              Join the ShopSpher Newsletter
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              Get updates about new collections, product launches,
              and exclusive offers when newsletter subscriptions
              become available.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full"
          >
            <div className="flex min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 transition focus-within:border-[#D4AF37]/60">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setNewsletterMessage("");
                  setNewsletterStatus("idle");
                }}
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-500 sm:px-4"
              />

              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-3 py-3 text-sm font-bold text-black transition hover:bg-[#E5C454] sm:px-5"
              >
                Subscribe
                <ArrowRight size={17} />
              </button>
            </div>

            {newsletterMessage && (
              <p
                role="status"
                className={`mt-3 flex items-start gap-2 text-xs leading-5 ${
                  newsletterStatus === "success"
                    ? "text-green-400"
                    : "text-amber-400"
                }`}
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {newsletterMessage}
              </p>
            )}
          </form>
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-7 text-center sm:mt-16 lg:flex-row lg:text-left">
          <p className="text-xs leading-6 text-zinc-500">
            © {new Date().getFullYear()} ShopSpher. All rights reserved.
          </p>

          <p className="text-xs text-zinc-500">
            Crafted for a premium shopping experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
