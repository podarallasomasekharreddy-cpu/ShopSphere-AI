import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Heart,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const GOLD = "#D4AF37";

// Read product details from common order/API response shapes.
function getOrderPreview(order) {
  const itemCollections = [
    order?.items, order?.order_items, order?.orderItems, order?.products,
    order?.line_items, order?.lineItems, order?.cart_items, order?.cartItems,
    order?.details,
  ];
  const items = itemCollections.find((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  const item = Array.isArray(items) ? items[0] : items;
  const product = item?.product ?? item?.Product ?? item?.product_details ??
    item?.productDetails ?? item?.product_data ?? item?.productData ?? item?.item ?? {};

  const name = item?.product_name ?? item?.productName ?? item?.item_name ??
    item?.itemName ?? item?.name ?? item?.title ?? product?.product_name ??
    product?.productName ?? product?.name ?? product?.title ?? product?.product_title ??
    product?.productTitle ?? order?.product_name ?? order?.productName ??
    order?.item_name ?? order?.itemName ?? order?.product?.name ??
    order?.product?.title ?? null;

  const image = item?.image_url ?? item?.imageUrl ?? item?.image ?? item?.thumbnail ??
    item?.thumbnail_url ?? item?.thumbnailUrl ?? item?.product_image ??
    item?.productImage ?? item?.image_path ?? item?.imagePath ?? product?.image_url ??
    product?.imageUrl ?? product?.image ?? product?.thumbnail ??
    product?.product_image ?? product?.productImage ?? order?.image_url ??
    order?.imageUrl ?? order?.product_image ?? order?.productImage ??
    order?.product?.image_url ?? order?.product?.imageUrl ?? order?.product?.image ?? null;

  const quantity = item?.quantity ?? item?.qty ?? product?.quantity ?? order?.quantity ?? null;
  return {
    name: typeof name === "string" && name.trim() ? name : null,
    image: typeof image === "string" && image.trim() ? image : null,
    quantity,
  };
}

// Some order-list APIs return only totals/status. If so, try the matching
// order-detail endpoint to retrieve its product name and thumbnail.
async function loadOrderWithProductDetails(order, userId) {
  // The list endpoint returns order summaries only. The detail endpoint returns
  // { order: {...}, items: [{ title, image, quantity, ... }] }.
  const currentPreview = getOrderPreview(order);
  if (currentPreview.name && currentPreview.image) return order;

  try {
    const response = await fetch(
      `https://shopsphere-ai-zwey.onrender.com/api/orders/${userId}/${order.id}`
    );
    if (!response.ok) return order;

    const payload = await response.json();
    const detail = payload?.order ?? payload?.data?.order ?? payload?.data ?? {};

    // IMPORTANT: items is a sibling of payload.order in the backend response,
    // not a property inside payload.order. Keep it when merging the response.
    const detailItems =
      payload?.items ??
      payload?.order_items ??
      payload?.orderItems ??
      detail?.items ??
      detail?.order_items ??
      detail?.orderItems ??
      detail?.products ??
      [];

    return {
      ...order,
      ...(detail && typeof detail === "object" ? detail : {}),
      items: detailItems,
    };
  } catch (error) {
    console.error(`Could not load product details for order ${order.id}:`, error);
    return order;
  }
}

export default function Account() {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    // User is not logged in
    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      // Fetch real orders from MySQL
      fetch(`https://shopsphere-ai-zwey.onrender.com/api/orders/${parsedUser.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }

          return response.json();
        })
        .then(async (data) => {
          // APIs may return an array directly or an object containing orders.
          const orderList = Array.isArray(data)
            ? data
            : data?.orders ?? data?.data?.orders ?? data?.data ?? [];

          if (!Array.isArray(orderList)) {
            setOrders([]);
            return;
          }

          // Fill missing product labels/images from each order's detail response.
          const enrichedOrders = await Promise.all(
            orderList.map((order) => loadOrderWithProductDetails(order, parsedUser.id))
          );
          setOrders(enrichedOrders);
        })
        .catch((error) => {
          console.error("Failed to load orders:", error);
          setOrders([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Failed to load user:", error);

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-36 pb-10">

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">

          {/* =================================================
              LEFT ACCOUNT SIDEBAR
          ================================================= */}

          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-[30px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >

            {/* Profile */}
            <div className="flex flex-col items-center border-b border-white/10 pb-7">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/20">
                <User
                  size={42}
                  color={GOLD}
                />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                {user?.name || "ShopSpher Member"}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {user?.email || "Premium Member"}
              </p>

            </div>


            {/* Navigation */}
            <div className="mt-7 space-y-3">

              <button
                className="flex w-full items-center justify-between rounded-2xl bg-[#D4AF37] px-5 py-4 font-bold text-black"
              >
                <span className="flex items-center gap-3">
                  <Package size={19} />
                  Orders
                </span>

                <ArrowRight size={17} />
              </button>


              <button
                onClick={() => navigate("/wishlist")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-5 py-4 text-zinc-300 transition hover:border-[#D4AF37]/50 hover:bg-white/5"
              >
                <span className="flex items-center gap-3">
                  <Heart size={19} />
                  Wishlist
                </span>

                <span className="text-sm text-zinc-500">
                  {wishlistCount}
                </span>
              </button>


              <button
                onClick={() => navigate("/addresses")}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-5 py-4 text-zinc-300 transition hover:border-[#D4AF37]/50 hover:bg-white/5"
              >
                <MapPin size={19} />
                Addresses
              </button>


              <button
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-5 py-4 text-zinc-300 transition hover:border-[#D4AF37]/50 hover:bg-white/5"
              >
                <CreditCard size={19} />
                Payment Methods
              </button>


              <button
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-5 py-4 text-zinc-300 transition hover:border-[#D4AF37]/50 hover:bg-white/5"
              >
                <Settings size={19} />
                Settings
              </button>


              <button
                onClick={logout}
                className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
              >
                <ShieldCheck size={19} />
                Logout
              </button>

            </div>

            {/* RECENT ORDERS in the left sidebar */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-lg font-black">Recent Orders</h3>
                <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-2.5 py-1 text-xs font-bold text-[#D4AF37]">{orders.length}</span>
              </div>

              {loading ? (
                <p className="rounded-xl border border-white/10 p-3 text-sm text-zinc-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="rounded-xl border border-white/10 p-3 text-sm text-zinc-500">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => navigate(`/orders/${user.id}/${order.id}`)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-[#D4AF37]/40"
                    >
                      {(() => {
                        const preview = getOrderPreview(order);
                        return (
                          <>
                            <span className="flex min-w-0 items-center gap-3">
                              {preview.image ? (
                                <img
                                  src={preview.image}
                                  alt={preview.name}
                                  className="h-12 w-12 shrink-0 rounded-lg border border-white/10 bg-white/5 object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                                  <Package size={19} />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-bold text-zinc-100">{preview.name || "ShopSpher order"}</span>
                                <span className="mt-1 block text-xs text-zinc-500">
                                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                  {preview.quantity != null ? ` · Qty ${preview.quantity}` : ""}
                                </span>
                              </span>
                            </span>
                            <span className="mt-3 flex items-center justify-between gap-2">
                              <span className="text-sm font-black text-[#D4AF37]">₹{Number(order.total).toLocaleString("en-IN")}</span>
                              <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-[10px] font-bold text-yellow-400">{order.status}</span>
                            </span>
                          </>
                        );
                      })()}
                    </button>
                  ))}
                </div>
              )}

              {!loading && orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllOrders(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 font-bold text-black transition hover:bg-[#e2c04d]"
                >
                  See all orders <ArrowRight size={16} />
                </button>
              )}
            </div>

          </motion.aside>


          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div className="space-y-8">

            {/* =================================================
                BLUE-STYLE FEATURE CARD
                But adapted to ShopSpher GOLD
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#17130a] via-[#171717] to-[#0b0b0b] p-8 md:p-10"
            >

              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

              <div className="relative">

                <div className="inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Personal Dashboard
                </div>

                <p className="mt-4 text-sm font-semibold text-zinc-400">
                  Your ShopSpher activity
                </p>

                <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-zinc-300">
                  <CheckCircle2
                    size={19}
                    color={GOLD}
                  />

                  Your account is secured and ready to shop.
                </div>

              </div>
            </motion.div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid gap-5 md:grid-cols-3">

              <DashboardStat
                icon={<Package size={20} />}
                value={orders.length}
                label="Total Orders"
              />

              <DashboardStat
                icon={<Heart size={20} />}
                value={wishlistCount}
                label="Wishlist Items"
              />

              <DashboardStat
                icon={<ShieldCheck size={20} />}
                value="Gold"
                label="Membership"
              />

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div>

              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles
                    size={21}
                    color={GOLD}
                  />

                  <h2 className="text-2xl font-black">
                    Quick Actions
                  </h2>
                </div>

                <p className="mt-2 text-zinc-500">
                  Manage your ShopSpher account without searching
                  through different pages.
                </p>
              </div>


              <div className="grid gap-5 md:grid-cols-3">

                <QuickAction
                  icon={<MapPin size={23} />}
                  label="DELIVERY"
                  title="Manage Addresses"
                  description="Add and manage your saved delivery addresses."
                  onClick={() => navigate("/addresses")}
                />

                <QuickAction
                  icon={<Heart size={23} />}
                  label="COLLECTION"
                  title="View Wishlist"
                  description="Explore products you have saved for later."
                  onClick={() => navigate("/wishlist")}
                />

                <QuickAction
                  icon={<Package size={23} />}
                  label="ORDERS"
                  title="View Orders"
                  description="Track your previous ShopSpher purchases."
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                />

              </div>

            </div>


            {/* DISCOVER MORE — expanded to use the available right-side space */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex min-h-[360px] min-w-0 flex-col justify-between overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#17130a] via-[#111111] to-[#080808] p-8 md:p-10"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-3xl" />
              <div className="relative max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">Discover More</p>
                <h2 className="mt-4 text-3xl font-black md:text-4xl">Explore the collection</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">Find your next favourite piece across ShopSpher’s curated luxury collections.</p>
              </div>
              <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate("/shop")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-4 font-bold text-black transition hover:bg-[#e2c04d]">
                  Browse products <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate("/wishlist")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-4 font-semibold text-zinc-200 transition hover:border-[#D4AF37]/40">
                  <Heart size={18} /> View Wishlist ({wishlistCount})
                </button>
              </div>
            </motion.section>
          </div>

        </div>

      </section>

      {/* Full-screen all-orders view, opened by the sidebar See all orders button */}
      {showAllOrders && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#050505] text-white">
          <div className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">ShopSpher Account</p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">All orders</h1>
                <p className="mt-2 text-sm text-zinc-500">Your complete purchase history · {orders.length} orders</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllOrders(false)}
                className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-zinc-200 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              >
                Back to account
              </button>
            </div>

            {loading ? (
              <p className="rounded-2xl border border-white/10 p-6 text-zinc-400">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-6 text-zinc-400">You haven’t placed any orders yet.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => navigate(`/orders/${user.id}/${order.id}`)}
                    className="flex w-full flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#D4AF37]/40 sm:p-6"
                  >
                    {(() => {
                      const preview = getOrderPreview(order);
                      return (
                        <>
                          {preview.image ? (
                            <img src={preview.image} alt={preview.name} className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-white/5 object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]"><Package size={24} /></span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block break-words text-base font-bold">{preview.name || "ShopSpher order"}</span>
                            <span className="mt-1 block text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}{preview.quantity != null ? ` · Qty ${preview.quantity}` : ""}</span>
                          </span>
                        </>
                      );
                    })()}
                    <span className="sm:min-w-[130px] sm:text-right">
                      <span className="block text-lg font-black text-[#D4AF37]">₹{Number(order.total).toLocaleString("en-IN")}</span>
                      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${String(order.status).toLowerCase() === "delivered" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>{order.status}</span>
                    </span>
                    <ArrowRight size={18} className="text-zinc-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon,
  value,
  label,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-zinc-500">
            {label}
          </p>

          <p className="mt-5 text-4xl font-black text-[#D4AF37]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

      </div>

    </motion.div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  title,
  description,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group flex min-h-[220px] flex-col rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur-xl transition hover:border-[#D4AF37]/30"
    >
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] text-zinc-500">
          {label}
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-black">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {description}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-[#D4AF37]">
        Open

        <ArrowRight
          size={17}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </motion.button>
  );
}