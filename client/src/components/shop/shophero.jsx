import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

const GOLD = "#D4AF37";

export default function ShopHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050505]">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.04),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight className="h-4 w-4" />

            <span style={{ color: GOLD }}>Shop</span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              className="h-4 w-4"
              style={{ color: GOLD }}
            />

            <span
              className="text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: GOLD }}
            >
              Luxury Collection
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-tight text-white lg:text-5xl">
                Discover Premium
                <span
                  className="block"
                  style={{ color: GOLD }}
                >
                  Fashion & Lifestyle
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Explore carefully curated collections featuring luxury fashion,
                premium watches, footwear, accessories and everyday essentials
                from leading global brands.
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <h3
                  className="text-3xl font-bold"
                  style={{ color: GOLD }}
                >
                  500+
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Products
                </p>
              </div>

              <div>
                <h3
                  className="text-3xl font-bold"
                  style={{ color: GOLD }}
                >
                  120+
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Brands
                </p>
              </div>

              <div>
                <h3
                  className="text-3xl font-bold"
                  style={{ color: GOLD }}
                >
                  4.9★
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Rating
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}