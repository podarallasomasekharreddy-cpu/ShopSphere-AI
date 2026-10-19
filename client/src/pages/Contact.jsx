
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const GOLD = "#D4AF37";
const API_BASE =
  import.meta.env.VITE_API_URL || "https://shopsphere-ai-zwey.onrender.com";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not send your message.");
      }

      setStatus({
        type: "success",
        message: data.message || "Your message has been sent successfully!",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message === "Failed to fetch"
            ? "Cannot connect to the server. Please try again shortly."
            : error.message || "Unable to send your message.",
      });
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-[#111] p-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>
            <ChevronRight size={15} />
            <span style={{ color: GOLD }}>Contact</span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles size={16} color={GOLD} />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Get In Touch
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">Contact Us</h1>

          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Have a question? Send us a message and we’ll get back to you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[420px_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {[
            {
              Icon: MapPin,
              title: "Office",
              content: (
                <>
                  ShopSpher Headquarters
                  <br />
                  Hyderabad, Telangana
                  <br />
                  India
                </>
              ),
            },
            {
              Icon: Phone,
              title: "Phone",
              content: "90xx78xx90",
            },
            {
              Icon: Mail,
              title: "Email",
              content: "podarallasomasekharreddy@gmail.com",
            },
            {
              Icon: Clock,
              title: "Support Hours",
              content: (
                <>
                  Monday – Sunday
                  <br />
                  Contact us anytime
                </>
              ),
            },
          ].map(({ Icon, title, content }) => (
            <motion.div
              key={title}
              whileHover={{ y: -5, borderColor: "rgba(212,175,55,0.45)" }}
              transition={{ duration: 0.25 }}
              className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <Icon size={30} color={GOLD} />
              <h3 className="mt-5 text-2xl font-bold">{title}</h3>
              <p className="mt-4 break-words leading-8 text-zinc-400">
                {content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-10"
        >
          <h2 className="text-3xl font-black">Send us a Message</h2>

          <p className="mt-3 text-zinc-400">
            Fill in your details below to get in touch.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                aria-label="Full Name"
                autoComplete="name"
                maxLength={100}
                required
                className={inputClass}
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                aria-label="Email Address"
                autoComplete="email"
                maxLength={254}
                required
                className={inputClass}
              />

              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                aria-label="Phone Number"
                autoComplete="tel"
                maxLength={25}
                className={`${inputClass} md:col-span-2`}
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={8}
                placeholder="Write your message..."
                aria-label="Your message"
                maxLength={5000}
                required
                className={`${inputClass} resize-y md:col-span-2`}
              />
            </div>

            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                  status.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={21} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={21} className="mt-0.5 shrink-0" />
                )}
                <p>{status.message}</p>
              </motion.div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-5 text-lg font-bold text-black transition hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending Message..." : "Send Message"}
                <Send size={20} />
              </button>

              <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
                <h3 className="text-lg font-bold text-[#D4AF37]">
                  Get In Touch
                </h3>

                <p className="mt-3 leading-7 text-zinc-300">
                  Send your questions or feedback through this form.
                  Your message will be delivered to the ShopSpher contact
                  email once the server is configured.
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
