import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Gem,
  Globe,
  Users,
} from "lucide-react";

const GOLD = "#D4AF37";

const values = [
  {
    icon: Gem,
    title: "Luxury Quality",
    description:
      "Every product is carefully selected to deliver premium craftsmanship and timeless elegance.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Shopping",
    description:
      "Secure payments, verified brands and reliable customer support for every purchase.",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description:
      "Fast global shipping with premium packaging and real-time order tracking.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Thousands of happy customers trust ShopSpher for their luxury lifestyle shopping.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              About
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Our Story
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            About ShopSpher
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            ShopSpher is a premium luxury ecommerce destination
            built for customers who appreciate exceptional
            quality, exclusive collections and an elevated online
            shopping experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >
          <h2 className="text-4xl font-black">
            Our Mission
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-zinc-400">
            Our mission is to redefine luxury ecommerce by
            bringing together premium fashion, lifestyle and
            technology products through an elegant, secure and
            customer-focused platform. Every experience is
            designed to be seamless, modern and unforgettable.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {values.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Icon
                    size={28}
                    color={GOLD}
                  />
                </div>
                                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-zinc-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-[34px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#171717] to-[#0b0b0b] p-10"
        >
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <h2 className="text-5xl font-black text-[#D4AF37]">
                50K+
              </h2>

              <p className="mt-3 text-zinc-400">
                Happy Customers
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-black text-[#D4AF37]">
                1K+
              </h2>

              <p className="mt-3 text-zinc-400">
                Premium Products
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-black text-[#D4AF37]">
                100+
              </h2>

              <p className="mt-3 text-zinc-400">
                Luxury Brands
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-black text-[#D4AF37]">
                24/7
              </h2>

              <p className="mt-3 text-zinc-400">
                Customer Support
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}