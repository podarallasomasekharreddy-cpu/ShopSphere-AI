import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GOLD = "#D4AF37";

const collections = [
  {
    id: 1,
    collection: "Men",
    title: "Men's Collection",
    subtitle: "Premium fashion curated for the modern gentleman.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    badge: "NEW SEASON",
  },
  {
    id: 2,
    collection: "Women",
    title: "Women's Collection",
    subtitle: "Elegant silhouettes with timeless luxury.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    badge: "TRENDING",
  },
  {
    id: 3,
    collection: "Women",
    title: "Luxury Watches",
    
    subtitle: "Precision craftsmanship from iconic brands.",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    badge: "PREMIUM",
  },
  {
    id: 4,
    collection: "Sneakers",
    title: "Sneakers",
    subtitle: "Luxury streetwear meets modern comfort.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badge: "LIMITED",
  },
  {
    id: 5,
    collection: "Accessories",
    title: "Accessories",
    subtitle: "Complete every outfit with refined details.",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    badge: "SIGNATURE",
  },
  {
    id: 6,
    collection: "Luxury Bags",
    title: "Luxury Bags",
    subtitle: "Crafted with elegance for every occasion.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    badge: "BESTSELLER",
  },
];

export default function Collections() {
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
                Collections
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
                Curated Luxury
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black lg:text-5xl">
              Explore Our
              <span
                className="block"
                style={{ color: GOLD }}
              >
                Premium Collections
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Discover thoughtfully curated collections featuring
              premium fashion, luxury accessories and timeless
              essentials.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
  key={collection.id}
  onClick={() =>
  navigate(
    `/shop?collection=${encodeURIComponent(collection.collection)}`
  )
}
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
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold tracking-wider text-black">
                  {collection.badge}
                </div>
              </div>
                            <div className="space-y-5 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white transition group-hover:text-[#D4AF37]">
                    {collection.title}
                  </h2>

                  <p className="mt-3 leading-7 text-zinc-400">
                    {collection.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Explore Collection
                  </span>

                  <motion.button
  onClick={(e) => {
    e.stopPropagation();
    navigate(
  `/shop?collection=${encodeURIComponent(collection.collection)}`
);
  }}
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
                Exclusive Selection
              </span>

              <h2 className="mt-4 text-4xl font-black text-white">
                Crafted For Every Lifestyle
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                From luxury apparel and premium accessories to timeless
                watches and designer footwear, discover collections
                carefully curated to elevate your everyday style.
              </p>
            </div>

            <button
  onClick={() => navigate("/shop")}
  className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105"
>
              Explore All Collections
            </button>
          </div>
        </motion.div>
      </section>
    </main>
      );
}