import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function ShopHero({ search, setSearch }) {
  return (
    <section className="relative isolate min-h-[500px] overflow-hidden bg-[#050505] lg:min-h-[560px]">
      {/* HERO IMAGE */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=2200&q=90"
          alt="Luxury fashion collection"
          className="h-full w-full object-cover"
        />

        {/* Only a subtle readability gradient — image stays visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-black/20" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-24 lg:min-h-[560px] lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px]">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.45em] text-[#D4AF37]">
              Premium Collection
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Luxury
              <span className="block text-[#D4AF37]">
                Collection
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
              Discover premium fashion, timeless accessories, and
              sophisticated lifestyle essentials curated for those who
              appreciate exceptional style.
            </p>

            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-white">
                  500+
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Products
                </p>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div>
                <p className="text-2xl font-bold text-white">
                  120+
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Brands
                </p>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  4.9
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Rating
                </p>
              </div>
            </div>
          </motion.div>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full lg:self-center"
          >
            <div className="rounded-[22px] border border-white/20 bg-black/40 p-3 shadow-2xl backdrop-blur-md">
              <div className="flex h-14 items-center rounded-[15px] border border-white/10 bg-black/50 px-5 transition-all duration-300 focus-within:border-[#D4AF37]/60">
                <Search
                  size={20}
                  className="mr-3 shrink-0 text-[#D4AF37]"
                />

                <input
                  type="text"
                  value={search || ""}
                  onChange={(e) =>
                    setSearch && setSearch(e.target.value)
                  }
                  placeholder="Search products, brands..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                />
              </div>

              <p className="px-2 pt-3 text-[10px] uppercase tracking-[0.18em] text-white/45">
                Find your next luxury essential
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM BLEND */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}