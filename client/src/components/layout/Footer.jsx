import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const GOLD = "#D4AF37";

const company = [
  "About",
  "Careers",
  "Blog",
  "Press",
];

const shop = [
  "Shop",
  "Collections",
  "New Arrivals",
  "Wishlist",
];

const support = [
  "Contact",
  "FAQs",
  "Returns",
  "Privacy Policy",
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">

          <div>

            <Link
              to="/"
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#9C7B18]">

                <span className="text-2xl font-black text-black">
                  S
                </span>

              </div>

              <div>

                <h2 className="text-3xl font-black text-white">
                  ShopSpher
                </h2>

                <p className="uppercase tracking-[0.35em] text-[#D4AF37] text-xs">
                  Luxury Commerce
                </p>

              </div>
            </Link>

            <p className="mt-8 max-w-md leading-8 text-zinc-400">
              Experience premium ecommerce with carefully
              curated luxury fashion, accessories,
              electronics and lifestyle products.
            </p>

            <div className="mt-8 flex gap-4">

              {[Mail, Phone, MapPin, ArrowRight].map(
  (Icon, index) => (
                  <motion.button
                    whileHover={{
                      y: -5,
                    }}
                    key={index}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-[#D4AF37]"
                  >
                    <Icon size={18} />
                  </motion.button>
                )
              )}

            </div>

          </div>

          <div>

            <h3 className="text-xl font-bold text-white">
              Company
            </h3>

            <div className="mt-7 space-y-4">

              {company.map((item) => (
                <p
                  key={item}
                  className="cursor-pointer text-zinc-400 hover:text-[#D4AF37]"
                >
                  {item}
                </p>
              ))}

            </div>

          </div>

          <div>

            <h3 className="text-xl font-bold text-white">
              Shop
            </h3>

            <div className="mt-7 space-y-4">

              {shop.map((item) => (
                <p
                  key={item}
                  className="cursor-pointer text-zinc-400 hover:text-[#D4AF37]"
                >
                  {item}
                </p>
              ))}

            </div>

          </div>
                    <div>

            <h3 className="text-xl font-bold text-white">
              Support
            </h3>

            <div className="mt-7 space-y-4">

              {support.map((item) => (
                <p
                  key={item}
                  className="cursor-pointer text-zinc-400 hover:text-[#D4AF37]"
                >
                  {item}
                </p>
              ))}

            </div>

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-3 text-zinc-400">
                <Mail
                  size={18}
                  color={GOLD}
                />

                support@shopspher.com
              </div>

              <div className="flex items-center gap-3 text-zinc-400">
                <Phone
                  size={18}
                  color={GOLD}
                />

                +91 98765 43210
              </div>

              <div className="flex items-start gap-3 text-zinc-400">
                <MapPin
                  size={18}
                  color={GOLD}
                />

                Hyderabad, Telangana, India
              </div>

            </div>

          </div>

        </div>

        <div className="my-16 h-px bg-white/10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">

          <div>

            <h2 className="text-3xl font-black">
              Join the ShopSpher Newsletter
            </h2>

            <p className="mt-3 text-zinc-400">
              Receive exclusive launches, luxury collections,
              premium offers and member-only updates.
            </p>

          </div>

          <div className="flex rounded-2xl border border-white/10 bg-white/5 p-2">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 outline-none"
            />

            <button className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-4 font-semibold text-black">
              Subscribe

              <ArrowRight size={18} />
            </button>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-center text-zinc-500 lg:flex-row">

          <p>
            © 2026 ShopSpher. All Rights Reserved.
          </p>

          <div className="flex gap-8">

            <p className="cursor-pointer hover:text-[#D4AF37]">
              Privacy
            </p>

            <p className="cursor-pointer hover:text-[#D4AF37]">
              Terms
            </p>

            <p className="cursor-pointer hover:text-[#D4AF37]">
              Cookies
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}