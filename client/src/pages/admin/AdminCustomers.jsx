import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  Mail,
  ShoppingBag,
} from "lucide-react";

const GOLD = "#D4AF37";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "https://shopsphere-ai-zwey.onrender.com/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                borderColor: `${GOLD}40`,
                backgroundColor: `${GOLD}10`,
              }}
            >
              <Users size={16} color={GOLD} />

              <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Customer Management
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Customers
            </h1>

            <p className="mt-2 text-zinc-500">
              View and manage registered ShopSpher customers.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:border-[#D4AF37]/40 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050505] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37]/50"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: `${GOLD}12` }}
              >
                <Users size={20} color={GOLD} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Total Customers
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <Search size={20} className="text-zinc-400" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Showing
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {filteredCustomers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Total Spent
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-zinc-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >
                      <Users
                        size={36}
                        className="mx-auto mb-3 text-zinc-700"
                      />

                      <p className="font-semibold text-zinc-400">
                        No customers found
                      </p>

                      <p className="mt-1 text-sm text-zinc-600">
                        Try a different name or email.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold"
                            style={{
                              borderColor: `${GOLD}40`,
                              color: GOLD,
                              backgroundColor: `${GOLD}10`,
                            }}
                          >
                            {customer.name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {customer.name || "Unknown"}
                            </p>

                            <p className="text-xs text-zinc-600">
                              Customer #{customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Mail size={15} />
                          {customer.email}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm">
                          <ShoppingBag
                            size={15}
                            className="text-zinc-500"
                          />
                          <span>{customer.orders_count || 0}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className="font-semibold"
                          style={{ color: GOLD }}
                        >
                          {formatCurrency(customer.total_spent)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {formatDate(customer.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}