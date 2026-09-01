import {
  ShoppingBag,
  Package,
  Users,
  RotateCcw,
  TrendingUp,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

const GOLD = "#D4AF37";

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const savedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!savedUser) {
          throw new Error("Admin session not found");
        }

        const user = JSON.parse(savedUser);

        if (user.role !== "admin") {
          throw new Error("Admin access required");
        }

        const savedToken =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (!savedToken) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          "http://localhost:5001/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setDashboard(data);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: dashboard?.totalOrders ?? 0,
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: dashboard?.products ?? 0,
      icon: Package,
    },
    {
      title: "Customers",
      value: dashboard?.customers ?? 0,
      icon: Users,
    },
    {
      title: "Returns",
      value: dashboard?.returns ?? 0,
      icon: RotateCcw,
    },
  ];

  const orderStatuses = [
    {
      title: "Confirmed",
      value: dashboard?.orderStatuses?.Confirmed ?? 0,
      icon: Clock3,
    },
    {
      title: "Shipped",
      value: dashboard?.orderStatuses?.Shipped ?? 0,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: dashboard?.orderStatuses?.Delivered ?? 0,
      icon: CheckCircle2,
    },
  ];



    if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg text-zinc-400">
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    
    // YOUR EXISTING DASHBOARD JSX STARTS HERE
    
 <main className="min-h-screen bg-[#050505] px-6 pb-20 pt-28 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            ShopSpher Administration
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Manage orders, products, customers, and return
            requests from one place.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                    <Icon size={23} color={GOLD} />
                  </div>

                  <TrendingUp
                    size={18}
                    className="text-zinc-600"
                  />
                </div>

                <p className="mt-6 text-sm text-zinc-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-black">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ORDER STATUS */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-black">
              Order Overview
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Current order distribution by status.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {orderStatuses.map((status) => {
              const Icon = status.icon;

              return (
                <div
                  key={status.title}
                  className="rounded-2xl border border-white/10 bg-[#111111] p-6"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={21} color={GOLD} />

                    <span className="text-sm text-zinc-400">
                      {status.title}
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-black">
                    {status.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* MANAGEMENT */}
        <section className="mt-8">
          <h2 className="text-2xl font-black">
            Management
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-[#D4AF37]/40">
              <ShoppingBag size={26} color={GOLD} />

              <h3 className="mt-5 text-xl font-bold">
                Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                View customer orders and update delivery
                statuses.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-[#D4AF37]/40">
              <Package size={26} color={GOLD} />

              <h3 className="mt-5 text-xl font-bold">
                Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Manage your ShopSpher products, prices,
                stock, and images.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-[#D4AF37]/40">
              <Users size={26} color={GOLD} />

              <h3 className="mt-5 text-xl font-bold">
                Customers
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                View registered customers and their order
                activity.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-[#D4AF37]/40">
              <RotateCcw size={26} color={GOLD} />

              <h3 className="mt-5 text-xl font-bold">
                Returns & Exchanges
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Review and process customer return and
                exchange requests.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}