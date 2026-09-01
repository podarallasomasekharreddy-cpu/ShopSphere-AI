import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
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

export default function Account() {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      fetch(`http://localhost:5001/api/orders/${parsedUser.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }

          return response.json();
        })
        .then((data) => {
          setOrders(data);
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
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              My Account
            </span>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
                <Sparkles
                  size={15}
                  color={GOLD}
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Account Dashboard
                </span>
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
                Welcome back,
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
                Manage your ShopSpher account, track your orders,
                wishlist and saved delivery information in one place.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
                Account Active
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-400">
                Premium Member
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

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

                <p className="mt-7 text-sm font-semibold text-zinc-500">
                  Your ShopSpher activity
                </p>

                <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
                  Your premium shopping experience,
                  all in one place.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  Track your purchases, manage saved products and
                  keep your delivery information ready for your next order.
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-zinc-300">
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


            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
            >

              <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-7 md:flex-row md:items-center">

                <div>
                  <h2 className="text-2xl font-black">
                    Recent Orders
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Your latest ShopSpher purchases.
                  </p>
                </div>

                <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  {orders.length} Orders
                </div>

              </div>


              <div className="p-7">

                {loading ? (

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-10 text-center">
                    <p className="text-zinc-500">
                      Loading your orders...
                    </p>
                  </div>

                ) : orders.length === 0 ? (

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-10 text-center">

                    <Package
                      size={42}
                      color={GOLD}
                      className="mx-auto"
                    />

                    <h3 className="mt-5 text-xl font-bold">
                      No Orders Yet
                    </h3>

                    <p className="mt-2 text-zinc-500">
                      Your completed orders will appear here.
                    </p>

                    <button
                      onClick={() => navigate("/shop")}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-black transition hover:scale-[1.02]"
                    >
                      Start Shopping
                      <ArrowRight size={17} />
                    </button>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {orders.slice(0, 5).map((order) => (

  <div
    key={order.id}
    onClick={() =>
      navigate(`/orders/${user.id}/${order.id}`)
    }
    className="flex cursor-pointer flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-[#D4AF37]/30 md:flex-row md:items-center"
  >

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                            <Package
                              size={21}
                              color={GOLD}
                            />
                          </div>

                          <div>
                            <h3 className="font-bold">
                              Order #{order.order_number}
                            </h3>

                            <p className="mt-1 text-sm text-zinc-500">
                              {new Date(
                                order.created_at
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                        </div>


                        <div className="flex items-center justify-between gap-8 md:justify-end">

                          <div>
                            <p className="text-xs uppercase tracking-wider text-zinc-600">
                              Total
                            </p>

                            <p className="mt-1 text-lg font-black text-[#D4AF37]">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </p>
                          </div>


                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                                order.status === "Delivered"
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </motion.div>

          </div>

        </div>

      </section>

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