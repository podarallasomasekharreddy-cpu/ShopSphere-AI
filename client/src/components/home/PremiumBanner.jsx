import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PremiumBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#050505] py-32">

      <div className="max-w-[1450px] mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[42px] border border-white/10"
        >

          <img
            src="/images/virat-kohli.png"
            alt="Luxury Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />

          <div className="relative max-w-3xl px-10 md:px-20 py-24 md:py-36">

            <span className="uppercase tracking-[0.35em] text-[#D4AF37] text-sm">

              Exclusive Collection

            </span>

            <h2 className="mt-6 text-5xl md:text-7xl font-black leading-tight text-white">

              Luxury Is
              <br />
              Not A Choice.
              <br />
              It's A Lifestyle.

            </h2>

            <p className="mt-8 text-[#D6D6D6] text-lg leading-8 max-w-xl">

              Elevate your wardrobe and lifestyle with our latest
              handcrafted premium collections, designed for people who
              appreciate timeless elegance.

            </p>

<button
  type="button"
  onClick={() => navigate("/shop")}
  className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,.35)]"
>
              Explore Collection

              <ArrowRight size={18} />

            </button>

          </div>

        </motion.div>

      </div>

    </section>
  );
}