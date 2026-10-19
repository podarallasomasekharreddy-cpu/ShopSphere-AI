
import { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw } from "lucide-react";

const GOLD = "#D4AF37";

const STATUSES = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const savedToken =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!savedToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "https://shopsphere-ai-zwey.onrender.com/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(data);
    } catch (err) {
      console.error("Admin orders error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const savedToken =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await fetch(
        `https://shopsphere-ai-zwey.onrender.com/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error("Update order status error:", err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Find product names in the order response
  const getItemNames = (order) => {
    const items =
      order.items ||
      order.order_items ||
      order.orderItems ||
      order.products ||
      [];

    return items
      .map(
        (item) =>
          item.product_name ||
          item.productName ||
          item.name ||
          item.title ||
          item.product?.name ||
          item.product?.product_name ||
          item.product?.title
      )
      .filter(Boolean);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg text-zinc-400">
            Loading admin orders...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={loadOrders}
              className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: GOLD }}
            >
              ShopSpher Administration
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              Customer Orders
            </h1>

            <p className="mt-3 text-zinc-400">
              View customer orders and manage delivery statuses.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:border-[#D4AF37]/50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* ORDER COUNT */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <ShoppingBag size={21} color={GOLD} />
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Total Orders
            </p>

            <p className="text-xl font-bold">
              {orders.length}
            </p>
          </div>
        </div>

        {/* ORDERS */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <ShoppingBag
              size={42}
              color={GOLD}
              className="mx-auto"
            />

            <h2 className="mt-5 text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-2 text-zinc-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const itemNames = getItemNames(order);

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* ORDER INFO */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold">
                          {itemNames.length > 0
                            ? itemNames.join(", ")
                            : order.order_number}
                        </h2>

                        <span
                          className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold"
                          style={{ color: GOLD }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1 text-sm">
                        <p className="text-zinc-300">
                          Customer:{" "}
                          <span className="text-white">
                            {order.customer_name || "Unknown"}
                          </span>
                        </p>

                        <p className="text-zinc-500">
                          {order.customer_email}
                        </p>

                        <p className="text-zinc-500">
                          Payment: {order.payment_method}
                        </p>

                        <p className="text-zinc-500">
                          Shipping: {order.shipping_method}
                        </p>

                        <p className="text-zinc-500">
                          Date:{" "}
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL + STATUS */}
                    <div className="flex flex-col gap-4 lg:min-w-[260px]">
                      <div>
                        <p className="text-sm text-zinc-500">
                          Order Total
                        </p>

                        <p className="mt-1 text-2xl font-black">
                          ₹{Number(order.total).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-zinc-500">
                          Update Status
                        </label>

                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                        >
                          {STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#111111]"
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId === order.id && (
                          <p className="mt-2 text-xs text-zinc-500">
                            Updating order...
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
