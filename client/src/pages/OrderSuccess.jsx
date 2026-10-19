
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Home,
  MapPin,
  Truck,
  CreditCard,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const GOLD = "#D4AF37";
const API = "http://localhost:5001/api";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "Order placed successfully";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Order placed successfully";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function DetailCard({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B0B0B] p-5 transition duration-300 hover:border-[#D4AF37]/30">
      <div className="mb-3 flex items-center gap-2.5">
        <Icon size={17} color={GOLD} strokeWidth={1.7} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {label}
        </span>
      </div>
      <div className="break-words text-sm font-medium leading-6 text-zinc-100">
        {children || "Not available"}
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
        <Icon size={20} color={GOLD} strokeWidth={1.6} />
      </div>
      <div>
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/80">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
          <Package size={28} color={GOLD} />
        </div>
        <p className="text-sm tracking-wide text-zinc-400">
          Preparing your order details...
        </p>
      </div>
    </main>
  );
}

export default function OrderSuccess() {
  const location = useLocation();
  const { userId, orderId: routeOrderId } = useParams();

  const orderId = location.state?.orderId || routeOrderId;
  const orderNumber = location.state?.orderNumber;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const savedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!savedUser || !orderId) {
          if (!cancelled) {
            setOrder(null);
            setItems([]);
          }
          return;
        }

        const user = JSON.parse(savedUser);
        const currentUserId = userId || user.id;

        if (!currentUserId) {
          if (!cancelled) setLoadError(true);
          return;
        }

        const response = await fetch(
          `${API}/orders/${encodeURIComponent(currentUserId)}/${encodeURIComponent(orderId)}`
        );

        if (!response.ok) {
          throw new Error("Could not retrieve order details.");
        }

        const data = await response.json();

        if (!cancelled) {
          setOrder(data.order || null);
          setItems(Array.isArray(data.items) ? data.items : []);
          setLoadError(!data.order);
        }
      } catch (error) {
        console.error("Failed to load order:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, userId]);

  if (loading) return <LoadingScreen />;

  const displayOrderNumber =
    order?.order_number || orderNumber || orderId || "Confirmed";

  const orderStatus = order?.status || "Confirmed";
  const orderDate = formatDate(
    order?.created_at || order?.order_date || order?.createdAt
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pb-20 pt-28 text-white sm:px-6 sm:pt-32">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[140px]" />
      <div className="pointer-events-none absolute left-0 top-[650px] h-80 w-80 rounded-full bg-[#D4AF37]/[0.025] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 sm:justify-start">
          <Link to="/" className="transition hover:text-[#D4AF37]">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="transition hover:text-[#D4AF37]">
            Collection
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#D4AF37]">Order Confirmation</span>
        </div>

        {/* SUCCESS HERO */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-gradient-to-b from-[#17150E] via-[#0C0C0B] to-[#090909] px-5 py-12 text-center sm:rounded-[36px] sm:px-12 sm:py-16 lg:py-20"
        >
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10" />
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/[0.06]" />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/[0.08] shadow-[0_0_60px_rgba(212,175,55,0.10)]"
            >
              <div className="absolute inset-2 rounded-full border border-[#D4AF37]/20" />
              <CheckCircle2
                size={43}
                color={GOLD}
                strokeWidth={1.4}
              />
              <Sparkles
                className="absolute -right-2 -top-1"
                size={19}
                color={GOLD}
              />
            </motion.div>

            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#D4AF37] sm:text-xs">
              Thank you for choosing ShopSpher
            </p>

            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              An exceptional choice.
              <span className="mt-2 block italic text-[#D4AF37]">
                Beautifully yours.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Your order has been placed successfully. We appreciate your
              trust in us and look forward to bringing your selection to you.
            </p>

            {loadError && (
              <div className="mx-auto mt-6 max-w-xl rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm leading-6 text-amber-200">
                Your order confirmation is available, but we couldn't load
                all the order details right now. You can check your orders
                again shortly.
              </div>
            )}

            <div className="mx-auto mt-9 flex max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row">
              <div className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-black/30 px-5 py-4 text-left">
                <Package size={21} color={GOLD} strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                    Order number
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {displayOrderNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-black/30 px-5 py-4 text-left">
                <CalendarDays size={21} color={GOLD} strokeWidth={1.5} />
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                    Order date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {orderDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {orderStatus}
              </span>
            </div>
          </div>
        </motion.section>

        {/* ORDER INFORMATION */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-8 grid items-start gap-7 lg:grid-cols-[1fr_360px]"
          >
            {/* LEFT COLUMN */}
            <div className="space-y-7">
              {/* PRODUCTS */}
              <section className="rounded-[26px] border border-white/[0.08] bg-[#0B0B0B] p-5 sm:rounded-[30px] sm:p-8">
                <SectionHeading
                  icon={ShoppingBag}
                  eyebrow="Your selection"
                  title={`Order Items${items.length ? ` (${items.length})` : ""}`}
                />

                {items.length > 0 ? (
                  <div className="divide-y divide-white/[0.07]">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.product_id || item.id || item.title}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * index }}
                        className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#121212]">
                          <Package
                            size={26}
                            color={GOLD}
                            strokeWidth={1.2}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-semibold text-white sm:text-base">
                            {item.title || item.product_name || "Product"}
                          </p>
                          <p className="mt-2 text-xs text-zinc-500">
                            Quantity: {item.quantity || 1}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatPrice(item.price)} per item
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-[#D4AF37] sm:text-base">
                            {formatPrice(
                              Number(item.price || 0) *
                                Number(item.quantity || 1)
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-white/[0.06] bg-black/20 p-5 text-sm text-zinc-500">
                    Item details aren't available right now.
                  </p>
                )}
              </section>

              {/* DELIVERY */}
              <section className="rounded-[26px] border border-white/[0.08] bg-[#0B0B0B] p-5 sm:rounded-[30px] sm:p-8">
                <SectionHeading
                  icon={MapPin}
                  eyebrow="Made for you"
                  title="Delivery Address"
                />

                <div className="rounded-2xl border border-white/[0.07] bg-[#080808] p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {order.full_name || "Customer"}
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {order.phone || "Phone number unavailable"}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
                      <Home size={18} color={GOLD} />
                    </div>
                  </div>

                  <div className="border-t border-white/[0.07] pt-4">
                    <p className="text-sm leading-7 text-zinc-400">
                      {order.complete_address || "Address unavailable"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {[order.city, order.state, order.postal_code]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.035] p-4">
                  <Truck
                    size={18}
                    color={GOLD}
                    className="mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Delivery, with care
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Your order will be prepared for delivery to the address
                      provided.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              <section className="overflow-hidden rounded-[26px] border border-[#D4AF37]/20 bg-gradient-to-b from-[#15130D] to-[#0B0B0B] p-6 sm:rounded-[30px] sm:p-7">
                <div className="mb-7 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                      A closer look
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Order Summary
                    </h2>
                  </div>
                  <ShieldCheck
                    size={26}
                    color={GOLD}
                    strokeWidth={1.4}
                  />
                </div>

                <div className="space-y-5">
                  <DetailCard icon={Truck} label="Shipping method">
                    {order.shipping_method || "Standard Delivery"}
                  </DetailCard>

                  <DetailCard icon={CreditCard} label="Payment method">
                    {order.payment_method || "Not specified"}
                  </DetailCard>

                  <DetailCard icon={Clock3} label="Order status">
                    <span className="text-emerald-300">{orderStatus}</span>
                  </DetailCard>
                </div>

                <div className="my-7 border-t border-dashed border-white/15" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Total amount
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Including applicable charges
                    </p>
                  </div>

                  <p className="text-3xl font-semibold tracking-tight text-[#D4AF37]">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/30 p-4">
                  <ShieldCheck
                    size={19}
                    color={GOLD}
                    className="shrink-0"
                  />
                  <p className="text-[11px] leading-5 text-zinc-500">
                    Thank you for shopping with ShopSpher. Keep your order
                    number handy for future reference.
                  </p>
                </div>
              </section>

              <div className="rounded-[24px] border border-white/[0.07] bg-[#0B0B0B] p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/[0.08]">
                    <Sparkles size={18} color={GOLD} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      The ShopSpher experience
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">
                      Thoughtful selections. Timeless style. An experience
                      designed around you.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {/* IF ORDER DETAILS COULDN'T BE LOADED */}
        {!order && !loadError && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0B0B0B] p-6 text-center">
            <Package size={28} color={GOLD} className="mx-auto mb-3" />
            <h2 className="text-lg font-semibold">Order confirmation</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Your order reference is{" "}
              <span className="font-semibold text-[#D4AF37]">
                {displayOrderNumber}
              </span>
              . Sign in or visit your orders page to view the full details.
            </p>
          </div>
        )}

        {/* FOOTER MESSAGE */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 border-t border-white/[0.07] py-8 text-center">
          <div className="h-px w-12 bg-[#D4AF37]/60" />
          <p className="font-serif text-xl italic text-zinc-300">
            Thank you for being part of ShopSpher.
          </p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
            Curated for those who appreciate the finer things
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-3 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-sm font-bold text-black transition duration-300 hover:scale-[1.02] hover:bg-[#E6C65A]"
          >
            <ShoppingBag size={17} />
            Continue Shopping
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/[0.05]"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
