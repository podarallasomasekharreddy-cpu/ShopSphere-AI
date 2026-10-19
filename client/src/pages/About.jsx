
import { motion } from "framer-motion";
import { Sparkles, Code2, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Modern Technology",
    description:
      "Built with React, Node.js, Express and MySQL.",
  },
  {
    icon: Sparkles,
    title: "Luxury Experience",
    description:
      "A premium black-and-gold interface with smooth animations.",
  },
  {
    icon: ShieldCheck,
    title: "Core Functionality",
    description:
      "Product browsing, user authentication and shopping features.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 pt-24 pb-16 text-white md:pt-28 md:pb-24">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 mt-4 text-center md:mt-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles size={15} />
            About the Project
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Meet <span className="text-[#D4AF37]">ShopSpher</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            A luxury e-commerce web application that combines
            premium design, modern technology and seamless shopping
            functionality.
          </p>
        </motion.section>

        {/* Project Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.05] sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            The Vision
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Luxury. Technology. Simplicity.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            ShopSpher demonstrates how a modern e-commerce platform
            can deliver an elegant interface with practical shopping
            features through a full-stack web application.
          </p>
        </motion.section>

        {/* Project Highlights */}
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group rounded-2xl border border-white/10 bg-[#0D0D0D] p-6 transition-colors duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_12px_35px_rgba(212,175,55,0.08)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={23} />
                </div>

                <h3 className="text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 text-center text-xs uppercase tracking-[0.25em] text-gray-600"
        >
          Designed with purpose. Built with technology.
        </motion.p>

      </div>
    </main>
  );
}
