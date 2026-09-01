import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const GOLD = "#D4AF37";


export default function Cart() {
const navigate = useNavigate();

const {
  cartItems,
  cartTotal,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = useCart();


  const subtotal = cartTotal;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Cart
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Shopping Cart
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Your Cart
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Review your premium selections before proceeding
            to secure checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.6fr_.7fr]">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="grid md:grid-cols-[220px_1fr]">
                <div className="h-64 overflow-hidden">
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

                    <p className="mt-5 text-3xl font-black text-[#D4AF37]">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                    <div className="flex items-center rounded-2xl border border-white/10 bg-white/5">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-4 hover:text-[#D4AF37]"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="w-16 text-center text-lg font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-4 hover:text-[#D4AF37]"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
  onClick={() => removeFromCart(item.id)}
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

        <div>
          <div className="sticky top-28 rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <ShoppingBag
                className="text-[#D4AF37]"
                size={22}
              />

              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>

                <span>
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>

                <span className="text-green-400">
                  FREE
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Tax</span>

                <span>₹0</span>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex justify-between">
                  <span className="text-xl font-bold">
                    Total
                  </span>

                  <span className="text-3xl font-black text-[#D4AF37]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
  onClick={() => navigate("/checkout")}
  className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-5 font-bold text-black transition hover:scale-[1.02]"
>
  Proceed To Checkout

  <ArrowRight size={20} />
</button>
          </div>
        </div>
      </section>
            <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#161616] to-[#0b0b0b] p-10">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                Premium Shopping
              </span>

              <h2 className="mt-4 text-4xl font-black">
                Secure & Fast Checkout
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
                Complete your purchase using our secure checkout experience
                with premium support, fast delivery and hassle-free returns.
              </p>
            </div>

            <button className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}