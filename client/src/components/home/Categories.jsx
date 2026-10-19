
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Watch,
  Shirt,
  ShoppingBag,
  Footprints,
  Gem,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "Men's Collection",
    category: "Men",
    subtitle: "Modern Masculinity",
    icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Women's Collection",
    category: "Women",
    subtitle: "Effortless Elegance",
    icon: ShoppingBag,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Accessories",
    category: "Accessories",
    subtitle: "The Finishing Touch",
    icon: Gem,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Premium Footwear",
    category: "Shoes",
    subtitle: "Step Into Style",
    icon: Footprints,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Watches",
    category: "Watches",
    subtitle: "Timeless Precision",
    icon: Watch,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  const openCategory = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-[#050505] py-12 sm:py-16">
      <div className="mx-auto max-w-[1450px] px-5 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
            Shop by Category
          </span>

          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Curated Luxury Collections
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-7 text-[#A7A7A7]">
            Discover signature collections across fashion, accessories,
            footwear and timeless watches.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, index) => {
            const Icon = item.icon;
            const wideCard = false;

            return (
              <motion.article
                key={item.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => openCategory(item.category)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCategory(item.category);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${item.title}`}
                className={`group relative h-[330px] cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#111111] sm:h-[360px] lg:h-[390px] ${
                  wideCard ? "lg:col-span-2" : "lg:col-span-1"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />

                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/50 backdrop-blur-md sm:left-5 sm:top-5">
                  <Icon size={22} className="text-[#D4AF37]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] sm:text-xs">
                    {item.subtitle}
                  </span>

                  <h3 className="mt-2 text-xl font-bold leading-tight text-white sm:text-2xl">
                    {item.title}
                  </h3>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors group-hover:text-[#D4AF37]">
                    Explore Collection
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
