
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
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
  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Page heading */}
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <button
              onClick={() => navigate("/")}
              className="transition hover:text-white"
            >
              Home
            </button>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>Cart</span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles size={16} color={GOLD} />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Shopping Cart
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            {isEmpty
              ? "Your next favourite piece is waiting to be discovered."
              : "Review your premium selections before proceeding to secure checkout."}
          </p>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          /* EMPTY CART */
          <motion.section
            key="empty-cart"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto flex min-h-[440px] max-w-7xl items-center justify-center px-6 py-16"
          >
            <div className="w-full max-w-2xl text-center">
              <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-gradient-to-br from-[#D4AF37]/15 to-transparent">
                <div className="absolute inset-3 rounded-full border border-white/5" />

                <ShoppingBag
                  size={52}
                  strokeWidth={1.2}
                  color={GOLD}
                />

                <span className="absolute -right-1 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414]">
                  <Plus size={19} color={GOLD} />
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
                A Little Luxury Awaits
              </p>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-400">
                Looks like you haven't added anything yet.
                Explore our curated collection and find something
                worth making yours.
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="group mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition duration-300 hover:scale-[1.03] hover:bg-[#e4c34c]"
              >
                <ShoppingCart size={19} />
                Explore Products
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="mt-5">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
                >
                  <ArrowLeft size={15} />
                  Back to Home
                </button>
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-600">
                  ShopSpher · Luxury Commerce
                </p>
              </div>
            </div>
          </motion.section>
        ) : (
          /* CART WITH PRODUCTS */
          <motion.section
            key="filled-cart"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.6fr_.7fr]"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Your Selection
                </h2>

                <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-sm text-[#D4AF37]">
                  {cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items
                </span>
              </div>

              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:border-[#D4AF37]/30"
                >
                  <div className="grid sm:grid-cols-[200px_1fr]">
                    <div className="h-56 overflow-hidden bg-[#111] sm:h-full sm:min-h-[250px]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-7">
                      <div>
                        <span className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">
                          {item.brand || "ShopSpher Collection"}
                        </span>

                        <h3 className="mt-3 text-2xl font-bold">
                          {item.title}
                        </h3>

                        <p className="mt-4 text-2xl font-black text-[#D4AF37]">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease ${item.title} quantity`}
                            className="p-3 transition hover:text-[#D4AF37]"
                          >
                            <Minus size={17} />
                          </button>

                          <span className="w-10 text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase ${item.title} quantity`}
                            className="p-3 transition hover:text-[#D4AF37]"
                          >
                            <Plus size={17} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={17} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 py-3 text-sm text-zinc-400 transition hover:text-[#D4AF37]"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </div>

            {/* ORDER SUMMARY: only visible with products */}
            <aside>
              <div className="sticky top-28 rounded-[30px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    className="text-[#D4AF37]"
                    size={23}
                  />

                  <h2 className="text-2xl font-bold">
                    Order Summary
                  </h2>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-bold">
                        Total
                      </span>

                      <span className="text-3xl font-black text-[#D4AF37]">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-[1.02] hover:bg-[#e4c34c]"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  Review your order before completing your purchase.
                </p>
              </div>
            </aside>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Premium footer banner only when the cart has products */}
      {!isEmpty && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111] via-[#161616] to-[#0b0b0b] p-8 sm:p-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Premium Shopping
            </span>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  Secure & Fast Checkout
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  Enjoy a seamless shopping experience with
                  premium support, fast delivery and hassle-free returns.
                </p>
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-4 font-semibold text-black transition hover:scale-105"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
