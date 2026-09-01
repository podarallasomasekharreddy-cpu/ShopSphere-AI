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
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const GOLD = "#D4AF37";

export default function OrderSuccess() {
  const location = useLocation();
  const { userId, orderId: routeOrderId } = useParams();

  const orderId = location.state?.orderId || routeOrderId;
  const orderNumber = location.state?.orderNumber;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const savedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!savedUser || !orderId) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(savedUser);

const response = await fetch(
  `http://localhost:5001/api/orders/${userId || user.id}/${orderId}`
);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();

        setOrder(data.order);
        setItems(data.items || []);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-16">
            <p className="text-lg text-zinc-400">
              Loading your order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-5xl">

        {/* SUCCESS HEADER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[36px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl md:p-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
            }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10"
          >
            <CheckCircle2 size={52} color={GOLD} />
          </motion.div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Order Confirmed
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Thank You For Your Order!
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Your order has been successfully placed. We’ll
            prepare your premium products for delivery.
          </p>

          {/* ORDER ID + STATUS */}
          <div className="mx-auto mt-10 grid max-w-2xl gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 text-left">
              <div className="flex items-center gap-3">
                <Package size={22} color={GOLD} />

                <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Order Number
                </span>
              </div>

              <p className="mt-3 text-xl font-bold">
                {order?.order_number || orderNumber}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 text-left">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} color={GOLD} />

                <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Status
                </span>
              </div>

              <p className="mt-3 text-xl font-bold text-green-400">
                {order?.status || "Confirmed"}
              </p>
            </div>

          </div>
        </motion.div>

        {/* ORDER DETAILS */}
        {order && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">

            {/* LEFT */}
            <div className="space-y-8">

              {/* PRODUCTS */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Package size={22} color={GOLD} />

                  <h2 className="text-2xl font-bold">
                    Order Items
                  </h2>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] p-5"
                    >
                      <div>
                        <p className="font-bold">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-[#D4AF37]">
                        ₹{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <MapPin size={22} color={GOLD} />

                  <h2 className="text-2xl font-bold">
                    Delivery Address
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                  <p className="font-bold">
                    {order.full_name}
                  </p>

                  <p className="mt-2 text-zinc-400">
                    {order.phone}
                  </p>

                  <p className="mt-2 text-zinc-400">
                    {order.complete_address}
                  </p>

                  <p className="mt-1 text-zinc-400">
                    {order.city} - {order.postal_code}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="h-fit space-y-6">

              {/* ORDER SUMMARY */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
                <h2 className="text-2xl font-black">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-5">

                  <div className="flex items-center gap-3 text-zinc-400">
                    <Truck size={20} color={GOLD} />

                    <span>
                      Shipping:{" "}
                      <span className="text-white">
                        {order.shipping_method}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-400">
                    <CreditCard size={20} color={GOLD} />

                    <span>
                      Payment:{" "}
                      <span className="text-white">
                        {order.payment_method}
                      </span>
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        Total
                      </span>

                      <span className="text-3xl font-black text-[#D4AF37]">
                        ₹{Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* MESSAGE */}
        <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5 text-center">
          <p className="text-zinc-300">
            Your order is being prepared and will be delivered soon.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            to="/shop"
            className="flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold transition hover:border-[#D4AF37]"
          >
            <Home size={18} />
            Back Home
          </Link>

        </div>

      </div>
    </main>
  );
}