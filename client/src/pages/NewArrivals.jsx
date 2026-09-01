import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";

const GOLD = "#D4AF37";

const arrivals = [
  {
    id: 1,
    title: "Premium Leather Jacket",
    category: "Fashion",
    price: "₹18,999",
    badge: "JUST DROPPED",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Luxury Smart Watch",
    category: "Watches",
    price: "₹49,999",
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Premium Sneakers",
    category: "Footwear",
    price: "₹14,999",
    badge: "LIMITED",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Designer Handbag",
    category: "Accessories",
    price: "₹29,999",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Luxury Sunglasses",
    category: "Accessories",
    price: "₹11,999",
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "Signature Perfume",
    category: "Beauty",
    price: "₹8,999",
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function NewArrivals() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Home</span>

              <ChevronRight className="h-4 w-4" />

              <span style={{ color: GOLD }}>
                New Arrivals
              </span>
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
                Just Dropped
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black lg:text-5xl">
              Discover
              <span
                className="block"
                style={{ color: GOLD }}
              >
                New Arrivals
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Explore the latest premium fashion, luxury accessories,
              footwear and exclusive products freshly added to
              ShopSpher.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2 text-[#D4AF37]">
              <Flame size={18} />
              Trending This Week
            </span>

            <h2 className="mt-3 text-4xl font-black">
              Latest Products
            </h2>
          </div>

         <button
  onClick={() => navigate("/shop?sort=newest")}
  className="hidden items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black lg:flex"
>
  View All

  <ArrowRight size={18} />
</button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {arrivals.map((item, index) => (
            <motion.div
  key={item.id}
  onClick={() => navigate("/shop?sort=newest")}
  initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold tracking-wider text-black">
                  {item.badge}
                </div>
              </div>
                            <div className="space-y-5 p-6">
                <div>
                  <span className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                    {item.category}
                  </span>

                  <h2 className="mt-3 text-2xl font-bold text-white transition group-hover:text-[#D4AF37]">
                    {item.title}
                  </h2>

                  <p className="mt-4 text-3xl font-black text-white">
                    {item.price}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Shop Now
                  </span>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 transition hover:bg-[#D4AF37] hover:text-black"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#161616] to-[#0b0b0b] p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                Limited Release
              </span>

              <h2 className="mt-4 text-4xl font-black text-white">
                Fresh Styles Every Week
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                Stay ahead with exclusive launches, seasonal collections,
                premium accessories and luxury fashion curated exclusively
                for ShopSpher customers.
              </p>
            </div>

            <button
  onClick={() => navigate("/shop?sort=newest")}
  className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105"
>
  Explore New Arrivals
</button>
          </div>
        </motion.div>
      </section>
    </main>
       
  );
}