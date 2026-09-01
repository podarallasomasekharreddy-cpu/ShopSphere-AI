import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Clock,
  RotateCcw,
  RefreshCw,
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

const [returnRequests, setReturnRequests] = useState([]);
const [showReturnForm, setShowReturnForm] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [requestType, setRequestType] = useState("Return");
const [reason, setReason] = useState("");
const [returnLoading, setReturnLoading] = useState(false);
const [returnMessage, setReturnMessage] = useState("");

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

const submitReturnRequest = async () => {
  if (!selectedItem || !reason) {
    setReturnMessage("Please select a reason.");
    return;
  }

  try {
    setReturnLoading(true);
    setReturnMessage("");

    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!savedUser) {
      setReturnMessage("Please login again.");
      return;
    }

    const user = JSON.parse(savedUser);

    const response = await fetch(
      `http://localhost:5001/api/orders/${order.id}/return-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          orderId: Number(order.id),
          productId: Number(selectedItem.product_id),
          requestType: requestType,
          reason: reason,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to submit request"
      );
    }

    setReturnMessage(
      data.message || `${requestType} request submitted successfully.`
    );

    setReturnRequests((prev) => [
      ...prev,
      {
        product_id: selectedItem.product_id,
        request_type: requestType,
        reason: reason,
        status: "Requested",
        refund_status: "Not Applicable",
      },
    ]);

    setShowReturnForm(false);
    setSelectedItem(null);
    setReason("");
  } catch (error) {
    console.error("Return/exchange error:", error);

    setReturnMessage(
      error.message || "Failed to submit request"
    );
  } finally {
    setReturnLoading(false);
  }
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
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                Order Details
              </p>

              <h1 className="mt-3 text-3xl font-black md:text-4xl">
                Order #{order.order_number}
              </h1>

              <p className="mt-3 text-zinc-500">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
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
        </motion.div>

        {/* TRACKING */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10"
        >
          <div className="flex items-center gap-3">
            <Truck size={24} color={GOLD} />

            <h2 className="text-2xl font-black">
              Track Your Order
            </h2>
          </div>

          <div className="mt-10">
            {STATUS_STEPS.map((step, index) => {
  const Icon = step.icon;
  const completed = index <= activeStatusIndex;
  const current = index === activeStatusIndex;
  const trackingEntry = getTrackingEntry(step.key);

              return (
                <div
                  key={step.key}
                  className="relative flex gap-5"
                >
                  {index !== STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[19px] top-12 h-16 w-px ${
                        index < activeStatusIndex
                          ? "bg-[#D4AF37]"
                          : "bg-white/10"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      completed
                        ? "border-[#D4AF37]/40 bg-[#D4AF37]/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <Icon
                      size={19}
                      color={completed ? GOLD : "#71717a"}
                    />
                  </div>

                  <div className="pb-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className={`font-bold ${
                          completed
                            ? "text-white"
                            : "text-zinc-500"
                        }`}
                      >
                        {step.label}
                      </h3>

                      {current && (
                        <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-500">
  {completed
    ? step.description
    : "We'll update you when your order reaches this stage."}
</p>

{trackingEntry && (
  <p className="mt-2 text-xs text-zinc-600">
    {new Date(trackingEntry.created_at).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}
  </p>
)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* ITEMS */}
            <section className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Package size={23} color={GOLD} />

                <h2 className="text-2xl font-black">
                  Order Items
                </h2>
              </div>

              <div className="mt-7 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#111] p-5"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      )}

                      <div>
                        <h3 className="font-bold">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-[#D4AF37]">
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* RETURN / EXCHANGE */}
{order.status === "Delivered" && (
  <section className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
    <div className="flex items-center gap-3">
      <RefreshCw size={23} color={GOLD} />

      <h2 className="text-2xl font-black">
        Returns & Exchanges
      </h2>
    </div>

    <p className="mt-3 text-sm leading-6 text-zinc-500">
      Need to return or exchange something? Select an item
      below to start your request.
    </p>

    <div className="mt-7 space-y-4">
      {items.map((item) => {
        const existingRequest = returnRequests.find(
          (request) =>
            Number(request.product_id) === Number(item.product_id)
        );

        return (
          <div
            key={item.product_id}
            className="rounded-2xl border border-white/10 bg-[#111] p-5"
          >
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                )}

                <div>
                  <h3 className="font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              {existingRequest ? (
                <div className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#D4AF37]">
                  {existingRequest.request_type} Requested
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setRequestType("Return");
                      setShowReturnForm(true);
                      setReturnMessage("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <RotateCcw size={16} />
                    Return
                  </button>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setRequestType("Exchange");
                      setShowReturnForm(true);
                      setReturnMessage("");
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition hover:scale-105"
                  >
                    <RefreshCw size={16} />
                    Exchange
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* REQUEST FORM */}
    {showReturnForm && selectedItem && (
      <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
              {requestType} Request
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {selectedItem.title}
            </h3>
          </div>

          <button
            onClick={() => {
              setShowReturnForm(false);
              setSelectedItem(null);
              setReason("");
            }}
            className="text-zinc-500 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        <label className="mt-6 block text-sm font-semibold text-zinc-300">
          Why do you want to {requestType.toLowerCase()} this item?
        </label>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-3 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
        >
          <option value="">
            Select a reason
          </option>
          <option value="Product damaged">
            Product damaged
          </option>
          <option value="Wrong product received">
            Wrong product received
          </option>
          <option value="Product not as expected">
            Product not as expected
          </option>
          <option value="Size or fit issue">
            Size or fit issue
          </option>
          <option value="Changed my mind">
            Changed my mind
          </option>
          <option value="Other">
            Other
          </option>
        </select>

        {returnMessage && (
          <p className="mt-4 text-sm text-[#D4AF37]">
            {returnMessage}
          </p>
        )}

        <button
          onClick={submitReturnRequest}
          disabled={returnLoading}
          className="mt-6 w-full rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {returnLoading
            ? "Submitting..."
            : `Submit ${requestType} Request`}
        </button>
      </div>
    )}
  </section>
)}

            {/* DELIVERY */}
            <section className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <MapPin size={23} color={GOLD} />

                <h2 className="text-2xl font-black">
                  Delivery Details
                </h2>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-[#111] p-6">
                <h3 className="font-bold">
                  {order.full_name}
                </h3>

                <p className="mt-2 text-zinc-400">
                  {order.phone}
                </p>

                <p className="mt-3 leading-7 text-zinc-400">
                  {order.complete_address}
                  <br />
                  {order.city} - {order.postal_code}
                </p>
              </div>
            </section>

          </div>

          {/* RIGHT */}
          <div className="h-fit space-y-8">

            {/* SUMMARY */}
            <section className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-black">
                Order Summary
              </h2>

              <div className="mt-7 space-y-5">

                <div className="flex items-center gap-3 text-zinc-400">
                  <Truck size={19} color={GOLD} />

                  <span>
                    Shipping:{" "}
                    <strong className="text-white">
                      {order.shipping_method}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <CreditCard size={19} color={GOLD} />

                  <span>
                    Payment:{" "}
                    <strong className="text-white">
                      {order.payment_method}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <Clock size={19} color={GOLD} />

                  <span>
                    Status:{" "}
                    <strong className="text-white">
                      {order.status}
                    </strong>
                  </span>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      Total
                    </span>

                    <span className="text-3xl font-black text-[#D4AF37]">
                      ₹
                      {Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* DELIVERY NOTE */}
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
              <p className="text-sm leading-6 text-zinc-300">
                Your tracking information will update as your
                order moves through each delivery stage.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}