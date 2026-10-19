import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-[#050505] pt-28 lg:pt-36 pb-24">

      {/* Background Glow */}

      <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#D4AF37]/10 blur-[180px]" />

      <div className="max-w-[1450px] mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
          >

            <div className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#111111]/70 backdrop-blur-xl px-5 py-2">

              <span className="w-2 h-2 rounded-full bg-[#D4AF37] mr-3 animate-pulse"/>

              <span className="uppercase tracking-[0.35em] text-xs text-[#D4AF37]">
                Luxury Collection 2026
              </span>

            </div>

            <h1 className="mt-10 text-white font-black leading-[1.02] text-5xl md:text-7xl xl:text-[88px]">

              Discover

              <span className="block text-[#D4AF37]">
                Timeless
              </span>

              Luxury

            </h1>

            <p className="mt-8 text-[#A7A7A7] text-lg leading-8 max-w-xl">

              Experience an exclusive destination where premium
              fashion, luxury accessories and cutting-edge technology
              come together in one elegant shopping experience.

            </p>

            <div className="flex flex-wrap gap-5 mt-12">

<button
  onClick={() => navigate("/shop")}
  className="group flex items-center gap-3 rounded-full bg-[#D4AF37] text-black px-8 py-4 font-semibold hover:scale-105 duration-300 shadow-[0_0_40px_rgba(212,175,55,.30)]"
>
                Shop Collection

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 duration-300"
                />

              </button>

              <button className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#111111]/70 backdrop-blur-xl px-8 py-4 text-white hover:border-[#D4AF37]">

                <Play
                  size={18}
                  className="group-hover:text-[#D4AF37]"
                />

                Watch Story

              </button>

            </div>

            <div className="grid grid-cols-3 gap-8 mt-20">

              

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            className="relative"
          >

            <div className="overflow-hidden rounded-[40px] border border-white/10">

              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop"
                alt=""
                className="w-full h-[760px] object-cover hover:scale-105 duration-700"
              />

            </div>

            <motion.div

              

            >

              

            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}