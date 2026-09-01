import { motion } from "framer-motion";
import {
  Watch,
  Shirt,
  Laptop,
  Gem,
  Armchair,
  Headphones,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "Luxury Watches",
    subtitle: "Swiss Excellence",
    icon: Watch,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Premium Fashion",
    subtitle: "New Collection",
    icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Tech",
    subtitle: "Future Ready",
    icon: Laptop,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Jewellery",
    subtitle: "Hand Crafted",
    icon: Gem,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Living",
    subtitle: "Modern Interior",
    icon: Armchair,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Premium Audio",
    subtitle: "Immersive Sound",
    icon: Headphones,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Categories() {
  return (
    <section className="bg-[#050505] py-32">

      <div className="max-w-[1450px] mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center mb-20"
        >

          <span className="uppercase tracking-[0.35em] text-[#D4AF37] text-sm">

            Shop By Category

          </span>

          <h2 className="mt-6 text-5xl lg:text-6xl font-black text-white">

            Curated Luxury Collections

          </h2>

          <p className="mt-6 text-[#A7A7A7] max-w-3xl mx-auto leading-8">

            Discover premium collections crafted for elegance,
            innovation and timeless luxury.

          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {categories.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div

                key={item.title}

                initial={{ opacity: 0, y: 50 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{
                  delay: index * .08,
                  duration: .5,
                }}

                whileHover={{
                  y: -12,
                }}

                className="group relative overflow-hidden rounded-[34px] border border-white/10 h-[470px]"

              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"/>

                <div className="absolute top-7 left-7 w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center">

                  <Icon
                    size={28}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div className="absolute bottom-8 left-8 right-8">

                  <span className="uppercase tracking-[0.3em] text-[#D4AF37] text-xs">

                    {item.subtitle}

                  </span>

                  <h3 className="mt-3 text-3xl font-bold text-white">

                    {item.title}

                  </h3>

                  <button className="flex items-center gap-3 mt-7 text-white group-hover:text-[#D4AF37] transition">

                    Explore Collection

                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-2 transition"
                    />

                  </button>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}