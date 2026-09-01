import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";

const GOLD = "#D4AF37";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Contact
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles size={16} color={GOLD} />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Get In Touch
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Contact Us
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Have questions about our products or your order?
            Our premium support team is always ready to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[420px_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <MapPin size={30} color={GOLD} />

            <h3 className="mt-5 text-2xl font-bold">
              Office
            </h3>

            <p className="mt-4 leading-8 text-zinc-400">
              ShopSpher Headquarters
              <br />
              Hyderabad, Telangana
              <br />
              India
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <Phone size={30} color={GOLD} />

            <h3 className="mt-5 text-2xl font-bold">
              Phone
            </h3>

            <p className="mt-4 text-zinc-400">
              +91 98765 43210
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <Mail size={30} color={GOLD} />

            <h3 className="mt-5 text-2xl font-bold">
              Email
            </h3>

            <p className="mt-4 text-zinc-400">
              support@shopspher.com
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <Clock size={30} color={GOLD} />

            <h3 className="mt-5 text-2xl font-bold">
              Support Hours
            </h3>

            <p className="mt-4 text-zinc-400">
              Monday – Sunday
              <br />
              24 × 7 Premium Support
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[34px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >
          <h2 className="text-3xl font-black">
            Send us a Message
          </h2>

          <p className="mt-3 text-zinc-400">
            Fill in the details below and our team will get
            back to you shortly.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <input
              placeholder="Full Name"
              className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none"
            />

            <input
              placeholder="Email Address"
              className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none"
            />

            <input
              placeholder="Phone Number"
              className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none md:col-span-2"
            />

            <textarea
              rows={8}
              placeholder="Write your message..."
              className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none md:col-span-2"
            />
          </div>

          <div className="mt-8">
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-5 text-lg font-bold text-black transition hover:scale-[1.02]">
              Send Message

              <Send size={20} />
            </button>

            <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
              <h3 className="text-lg font-bold text-[#D4AF37]">
                Premium Customer Support
              </h3>

              <p className="mt-3 leading-7 text-zinc-300">
                Our dedicated luxury shopping specialists are
                available around the clock to assist with
                orders, returns, product recommendations and
                any questions regarding your ShopSpher
                experience.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}