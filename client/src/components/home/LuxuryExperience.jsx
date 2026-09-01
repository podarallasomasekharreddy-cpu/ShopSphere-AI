import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Headset,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Curated Luxury",
    description:
      "Every product is carefully selected by experts to meet our premium quality standards.",
  },
  {
    icon: Truck,
    title: "Worldwide Delivery",
    description:
      "Fast, insured and reliable shipping to more than 120 countries around the world.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Bank-grade encrypted checkout with complete buyer protection and secure transactions.",
  },
  {
    icon: Headset,
    title: "Luxury Concierge",
    description:
      "Dedicated customer specialists available whenever you need assistance.",
  },
];

export default function LuxuryExperience() {
  return (
    <section className="bg-[#050505] py-32">

      <div className="max-w-[1450px] mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >

          <span className="uppercase tracking-[0.35em] text-[#D4AF37] text-sm">
            Why ShopSpher
          </span>

          <h2 className="mt-6 text-5xl lg:text-6xl font-black text-white">
            Crafted For Premium Living
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-[#A7A7A7] leading-8">
            Luxury is more than products. Every detail of ShopSpher is
            designed to provide an exceptional shopping experience.
          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                }}
                className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#111111]/80 backdrop-blur-xl p-10"
              >

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent" />

                <div className="relative">

                  <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">

                    <Icon
                      size={30}
                      className="text-[#D4AF37]"
                    />

                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-5 text-[#A7A7A7] leading-8">
                    {feature.description}
                  </p>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}