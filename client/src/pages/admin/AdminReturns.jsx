import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  RotateCcw,
  Package,
  User,
  IndianRupee,
} from "lucide-react";

const GOLD = "#D4AF37";

const STATUS_OPTIONS = [
  "Requested",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "Processing",
  "Completed",
  "Rejected",
];

const REFUND_OPTIONS = [
  "Not Applicable",
  "Pending",
  "Processed",
];

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "https://shopsphere-ai-zwey.onrender.com/api/admin/returns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch returns");
      }

      const data = await response.json();
      setReturns(data);
    } catch (err) {
      console.error("Failed to load returns:", err);
      setError("Unable to load return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const filteredReturns = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return returns;
    }

    return returns.filter(
      (item) =>
        item.customer_name?.toLowerCase().includes(query) ||
        item.customer_email?.toLowerCase().includes(query) ||
        item.order_number?.toLowerCase().includes(query) ||
        item.product_title?.toLowerCase().includes(query) ||
        item.request_type?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query)
    );
  }, [returns, search]);

  const updateStatus = async (requestId, status, refundStatus) => {
    try {
      const token = getToken();

      const response = await fetch(
        `https://shopsphere-ai-zwey.onrender.com/api/return-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            refundStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update return");
      }

      await fetchReturns();
    } catch (err) {
      console.error("Failed to update return:", err);
      setError("Unable to update return request.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusClass = (status) => {
    if (status === "Completed") {
      return "border-green-500/20 bg-green-500/10 text-green-300";
    }

    if (status === "Rejected") {
      return "border-red-500/20 bg-red-500/10 text-red-300";
    }

    if (status === "Requested") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  };

  const returnCount = returns.filter(
    (item) => item.request_type === "Return"
  ).length;

  const exchangeCount = returns.filter(
    (item) => item.request_type === "Exchange"
  ).length;

  const pendingCount = returns.filter(
    (item) =>
      item.status !== "Completed" &&
      item.status !== "Rejected"
  ).length;

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
              <RotateCcw size={16} color={GOLD} />

              <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Return Management
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Returns & Exchanges
            </h1>

            <p className="mt-2 text-zinc-500">
              Review and manage customer return and exchange requests.
            </p>
          </div>

          <button
            onClick={fetchReturns}
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
              placeholder="Search by customer, order, product, type or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050505] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37]/50"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Total Requests
            </p>

            <p className="mt-2 text-2xl font-bold">
              {returns.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Pending
            </p>

            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: GOLD }}
            >
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Returns
            </p>

            <p className="mt-2 text-2xl font-bold">
              {returnCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Exchanges
            </p>

            <p className="mt-2 text-2xl font-bold">
              {exchangeCount}
            </p>
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
            <table className="w-full min-w-[1250px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Request
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Refund
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center text-zinc-500"
                    >
                      Loading return requests...
                    </td>
                  </tr>
                ) : filteredReturns.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >
                      <RotateCcw
                        size={36}
                        className="mx-auto mb-3 text-zinc-700"
                      />

                      <p className="font-semibold text-zinc-400">
                        No return requests found
                      </p>

                      <p className="mt-1 text-sm text-zinc-600">
                        Return and exchange requests will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.025]"
                    >
                      {/* Request */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: `${GOLD}12`,
                            }}
                          >
                            <RotateCcw
                              size={18}
                              color={GOLD}
                            />
                          </div>

                          <div>
                            <p className="font-semibold">
                              #{item.id}
                            </p>

                            <p
                              className="text-xs"
                              style={{ color: GOLD }}
                            >
                              {item.request_type}
                            </p>

                            <p className="text-xs text-zinc-600">
                              {item.order_number || `Order #${item.order_id}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-2">
                          <User
                            size={15}
                            className="mt-0.5 text-zinc-500"
                          />

                          <div>
                            <p className="font-semibold text-white">
                              {item.customer_name || "Unknown"}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {item.customer_email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                              <Package
                                size={18}
                                className="text-zinc-600"
                              />
                            </div>
                          )}

                          <div className="max-w-[230px]">
                            <p className="font-medium text-white">
                              {item.product_title || "Product unavailable"}
                            </p>

                            <p className="text-xs text-zinc-600">
                              Product #{item.product_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="max-w-[220px] px-6 py-5">
                        <p className="text-sm text-zinc-400">
                          {item.reason || "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateStatus(
                              item.id,
                              e.target.value,
                              item.refund_status
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold outline-none ${statusClass(
                            item.status
                          )}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#111] text-white"
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Refund */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <IndianRupee
                            size={14}
                            className="text-zinc-500"
                          />

                          <select
                            value={
                              item.refund_status ||
                              "Not Applicable"
                            }
                            onChange={(e) =>
                              updateStatus(
                                item.id,
                                item.status,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-xs font-semibold text-zinc-300 outline-none focus:border-[#D4AF37]/50"
                          >
                            {REFUND_OPTIONS.map((status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-[#111] text-white"
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {formatDate(item.created_at)}
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