import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import products from "../../data/products";
import {
  ArrowRight,
  Heart,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/*const products = [
  {
    id: 1,
    title: "Royal Chronograph",
    category: "Luxury Timepiece",
    price: "$8,490",
    rating: 4.9,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Obsidian Leather Bag",
    category: "Designer Collection",
    price: "$2,190",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Signature Fragrance",
    category: "Luxury Essence",
    price: "$380",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Elite Headphones",
    category: "Premium Audio",
    price: "$899",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
];*/

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const TrendingProducts = () => {
  const navigate = useNavigate();
  const featured = products[0];
  const sideProducts = products.slice(1, 5);

  return (
    <section className="relative overflow-hidden bg-[#050505] py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-100px] h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_45%)]" />
      </div>

      <div className="relative max-w-[1450px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#D4AF37] backdrop-blur-xl">
              <Sparkles size={14} />
              Trending Collection
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Crafted for
              <span className="block bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#D4AF37] bg-clip-text text-transparent">
                Modern Luxury
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-400">
              Discover an exclusive selection of timeless luxury pieces designed
              with exceptional craftsmanship, premium materials, and refined
              elegance.
            </p>
          </div>

          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  onClick={() => navigate("/shop")}
  className="group inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition"
>
            Explore Collection
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </motion.button>
        </motion.div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
          {/* Featured Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl"
          >
            <div className="absolute inset-0">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute right-6 top-6 flex gap-3">
              <button className="rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-xl transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
                <Heart size={18} />
              </button>
            </div>

            <div className="relative flex h-full min-h-[640px] flex-col justify-end p-8 md:p-12">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] backdrop-blur-xl">
                <ShieldCheck size={14} />
                Featured Luxury
              </div>

              <p className="text-sm uppercase tracking-[0.3em] text-gray-300">
                {featured.category}
              </p>

              <h3 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
                {featured.title}
              </h3>

              <div className="mt-6 flex items-center gap-2">
                <Star
                  size={18}
                  className="fill-[#D4AF37] text-[#D4AF37]"
                />
                <span className="font-semibold text-white">
                  {featured.rating}
                </span>
                <span className="text-gray-400">
                  Premium Customer Rating
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                    Starting From
                  </p>
                  <h4 className="mt-2 text-4xl font-bold text-[#D4AF37]">
                    {featured.price}
                  </h4>
                </div>

             <motion.button
  type="button"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  onClick={(e) => {
    e.preventDefault();
    navigate(`/product/${featured.id}`);
  }}
  className="group inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition"
>
                  Explore
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="flex flex-col gap-8">
            {sideProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index + 1}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl"
              >
                <div className="grid min-h-[198px] grid-cols-[150px_1fr]">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  </div>

                  <div className="relative flex flex-col justify-between p-6">
                    <button className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur-xl transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
                      <Heart size={16} />
                    </button>

                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">
                        {product.category}
                      </p>

                      <h3 className="mt-3 text-2xl font-bold text-white">
                        {product.title}
                      </h3>

                      <div className="mt-4 flex items-center gap-2">
                        <Star
                          size={16}
                          className="fill-[#D4AF37] text-[#D4AF37]"
                        />
                        <span className="font-medium text-white">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#D4AF37]">
                        {product.price}
                      </span>

                 <motion.button
  type="button"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.96 }}
  onClick={(e) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  }}
  className="group inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
>
                        Explore
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;