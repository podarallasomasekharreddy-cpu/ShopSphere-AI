import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GOLD = "#D4AF37";

const STATUS_STEPS = [
  {
    key: "Confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    key: "Packed",
    label: "Order Packed",
    description: "Your items have been packed.",
    icon: Package,
  },
  {
    key: "Shipped",
    label: "Shipped",
    description: "Your package is on its way.",
    icon: Truck,
  },
  {
    key: "Out for Delivery",
    label: "Out for Delivery",
    description: "Your package is arriving soon.",
    icon: Truck,
  },
  {
    key: "Delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: CheckCircle2,
  },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { userId, orderId } = useParams();
const [order, setOrder] = useState(null);
const [items, setItems] = useState([]);
const [tracking, setTracking] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const savedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!savedUser) {
          navigate("/login", { replace: true });
          return;
        }

        const user = JSON.parse(savedUser);

        const response = await fetch(
          `http://localhost:5001/api/orders/${userId || user.id}/${orderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load order details"
          );
        }

        setOrder(data.order);
        setItems(data.items || []);

        const trackingResponse = await fetch(
  `http://localhost:5001/api/orders/${userId || user.id}/${orderId}/tracking`
);

const trackingData = await trackingResponse.json();

if (trackingResponse.ok) {
  setTracking(trackingData);
}
      } catch (error) {
        console.error("Order details error:", error);
        setError(error.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [navigate, userId, orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-lg text-zinc-400">
              Loading your order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-12">
            <h1 className="text-3xl font-black">
              Unable to load order
            </h1>

            <p className="mt-4 text-zinc-400">
              {error || "Order not found."}
            </p>

            <button
              onClick={() => navigate("/account")}
              className="mt-8 rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black"
            >
              Back to Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(
    (step) => step.key === order.status
  );

  const activeStatusIndex =
    currentStatusIndex === -1 ? 0 : currentStatusIndex;

    const getTrackingEntry = (status) => {
  return tracking.find((entry) => entry.status === status);
};

  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <button
          onClick={() => navigate("/account")}
          className="mb-8 flex items-center gap-2 text-zinc-400 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft size={18} />
          Back to My Orders
        </button>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                Order Details
              </p>
              <h1 className="mt-3 break-words text-2xl font-black md:text-3xl">
                {items[0]?.title || items[0]?.product_name || items[0]?.name || items[0]?.product_title || "Your ShopSpher Order"}
              </h1>
              <p className="mt-3 text-zinc-500">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-5 py-4 md:min-w-[250px]">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Order Number
                </p>
                <p className="mt-2 break-all text-xl font-black text-[#D4AF37] md:text-2xl">
                  #{order.order_number}
                </p>
              </div>
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Current Status
                </p>
                <p className="mt-2 text-lg font-bold text-green-400">
                  {order.status}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TRACKING + ORDER ITEMS: side-by-side to use the available width */}
        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-2">
          {/* TRACKING */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full min-w-0 rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
          >
            <div className="flex items-center gap-3">
              <Truck size={24} color={GOLD} />
              <h2 className="text-2xl font-black">Track Your Order</h2>
            </div>

            <div className="mt-8">
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const completed = index <= activeStatusIndex;
                const current = index === activeStatusIndex;
                const trackingEntry = getTrackingEntry(step.key);

                return (
                  <div key={step.key} className="relative flex gap-4">
                    {index !== STATUS_STEPS.length - 1 && (
                      <div className={`absolute left-[19px] top-12 h-[calc(100%-12px)] min-h-10 w-px ${index < activeStatusIndex ? "bg-[#D4AF37]" : "bg-white/10"}`} />
                    )}
                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${completed ? "border-[#D4AF37]/40 bg-[#D4AF37]/10" : "border-white/10 bg-white/5"}`}>
                      <Icon size={19} color={completed ? GOLD : "#71717a"} />
                    </div>
                    <div className="min-w-0 pb-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className={`font-bold ${completed ? "text-white" : "text-zinc-500"}`}>{step.label}</h3>
                        {current && <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">Current</span>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {completed ? step.description : "We'll update you when your order reaches this stage."}
                      </p>
                      {trackingEntry && (
                        <p className="mt-2 text-xs text-zinc-600">
                          {new Date(trackingEntry.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ORDER ITEMS: moved beside tracking; no longer a separate lower section */}
          <section className="flex h-full min-w-0 flex-col rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="flex items-center gap-3">
              <Package size={23} color={GOLD} />
              <h2 className="text-2xl font-black">Order Items</h2>
              <span className="ml-auto rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="mt-7 flex-1 space-y-5">
              {items.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-[#111] p-5 text-sm text-zinc-500">
                  No item details are available for this order.
                </p>
              ) : items.map((item, index) => (
                <article key={item.product_id ?? item.id ?? index} className="flex min-w-0 flex-col gap-5 rounded-2xl border border-white/10 bg-[#111] p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] sm:h-44 sm:w-44 md:h-48 md:w-48">
                    {item.image ? (
                      <img src={item.image} alt={item.title || "Order item"} className="h-full w-full object-cover" />
                    ) : (
                      <Package size={42} color={GOLD} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                      ShopSpher Collection
                    </p>
                    <h3 className="mt-2 break-words text-lg font-bold leading-snug md:text-xl">
                      {item.title || "Product"}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400">
                      Quantity: <span className="font-semibold text-white">{item.quantity || 1}</span>
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Unit price: ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Item total</p>
                      <p className="mt-1 text-xl font-black text-[#D4AF37]">
                        ₹{(Number(item.price) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Order total</p>
                  <p className="mt-1 text-sm text-zinc-500">Including all items in this order</p>
                </div>
                <p className="shrink-0 text-2xl font-black text-[#D4AF37]">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* DELIVERY DETAILS + ORDER SUMMARY */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <section className="min-w-0 rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="flex items-center gap-3">
              <MapPin size={23} color={GOLD} />
              <h2 className="text-2xl font-black">Delivery Details</h2>
            </div>
            <div className="mt-7 rounded-2xl border border-white/10 bg-[#111] p-6">
              <h3 className="font-bold">{order.full_name}</h3>
              <p className="mt-2 text-zinc-400">{order.phone}</p>
              <p className="mt-3 leading-7 text-zinc-400">
                {order.complete_address}<br />
                {order.city} - {order.postal_code}
              </p>
            </div>
          </section>

          <div className="h-fit space-y-8">
            <section className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <h2 className="text-2xl font-black">Order Summary</h2>
              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-3 text-zinc-400"><Truck size={19} color={GOLD} /><span>Shipping: <strong className="text-white">{order.shipping_method}</strong></span></div>
                <div className="flex items-center gap-3 text-zinc-400"><CreditCard size={19} color={GOLD} /><span>Payment: <strong className="text-white">{order.payment_method}</strong></span></div>
                <div className="flex items-center gap-3 text-zinc-400"><Clock size={19} color={GOLD} /><span>Status: <strong className="text-white">{order.status}</strong></span></div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-black text-[#D4AF37] sm:text-3xl">₹{Number(order.total).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </main>
  );
}