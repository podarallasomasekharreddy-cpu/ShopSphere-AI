import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const GOLD = "#D4AF37";



export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Wishlist
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Saved Products
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            My Wishlist
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Save your favourite premium products and purchase
            them whenever you're ready.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="grid md:grid-cols-[230px_1fr]">
                <div className="h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-110"
                  />
                </div>
                                <div className="flex flex-col justify-between p-7">
                  <div>
                    <span className="text-sm uppercase tracking-[0.22em] text-[#D4AF37]">
                      {item.brand}
                    </span>

                    <h2 className="mt-3 text-3xl font-bold">
                      {item.title}
                    </h2>

                    <div className="mt-6 flex items-end gap-4">
                      <span className="text-3xl font-black text-[#D4AF37]">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </span>

                      <span className="pb-1 text-lg text-zinc-500 line-through">
                       {item.oldPrice
  ? `₹${Number(item.oldPrice).toLocaleString("en-IN")}`
  : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
  onClick={() => {
  addToCart(item);
  removeFromWishlist(item.id);
}}
  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
>
                      <ShoppingBag size={20} />
                      Add To Cart
                    </button>

                    <button
  onClick={() => removeFromWishlist(item.id)}
  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#D4AF37]"
>
                      <Heart
                        size={20}
                        className="text-[#D4AF37]"
                      />
                    </button>

                    <button
  onClick={() => removeFromWishlist(item.id)}
  className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 transition hover:bg-red-500/20"
>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#161616] to-[#0b0b0b] p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                Premium Picks
              </span>

              <h2 className="mt-4 text-4xl font-black">
                Ready To Checkout?
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
                Move your saved luxury products to your cart and
                complete your purchase with secure checkout.
              </p>
            </div>

            <Link
  to="/cart"
  className="flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105"
>
              View Cart

              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
        
  );
}