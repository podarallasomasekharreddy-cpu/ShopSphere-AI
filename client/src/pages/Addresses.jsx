import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Sparkles,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const GOLD = "#D4AF37";

export default function Addresses() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    postalCode: "",
    completeAddress: "",
  });

  // ===============================
  // LOAD LOGGED-IN USER
  // ===============================

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const currentUser = JSON.parse(savedUser);
      setUser(currentUser);

      fetchAddresses(currentUser.id);
    } catch (error) {
      console.error("Failed to load user:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ===============================
  // FETCH ADDRESSES
  // ===============================

  const fetchAddresses = async (userId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5001/api/addresses/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch addresses"
        );
      }

      setAddresses(data);
    } catch (error) {
      console.error("Fetch addresses error:", error);
      toast.error("Unable to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================
  // ADD ADDRESS
  // ===============================

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.phone ||
      !form.city ||
      !form.postalCode ||
      !form.completeAddress
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (!user) {
      toast.error("Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ...form,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save address"
        );
      }

      toast.success("Address saved successfully.");

      setForm({
        fullName: "",
        phone: "",
        city: "",
        postalCode: "",
        completeAddress: "",
      });

      setShowForm(false);

      fetchAddresses(user.id);
    } catch (error) {
      console.error("Add address error:", error);
      toast.error(error.message || "Unable to save address.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">

      {/* ===============================
          HEADER
      =============================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white"
            >
              Home
            </button>

            <ChevronRight size={15} />

            <button
              onClick={() => navigate("/account")}
              className="hover:text-white"
            >
              My Account
            </button>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Addresses
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles size={16} color={GOLD} />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Delivery Addresses
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            My Addresses
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Manage your saved delivery addresses for a faster
            checkout experience.
          </p>

        </div>
      </section>

      {/* ===============================
          ADDRESS SECTION
      =============================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-black">
            Saved Addresses
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3 font-bold text-black transition hover:scale-[1.02]"
          >
            <Plus size={18} />

            Add Address
          </button>

        </div>

        {/* ===============================
            ADD ADDRESS FORM
        =============================== */}

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddAddress}
            className="mt-8 rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >

            <h3 className="text-2xl font-bold">
              Add New Address
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none focus:border-[#D4AF37]"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none focus:border-[#D4AF37]"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none focus:border-[#D4AF37]"
              />

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none focus:border-[#D4AF37]"
              />

              <textarea
                name="completeAddress"
                value={form.completeAddress}
                onChange={handleChange}
                rows={4}
                placeholder="Complete Address"
                className="rounded-2xl border border-white/10 bg-[#111] p-4 outline-none focus:border-[#D4AF37] md:col-span-2"
              />

            </div>

            <div className="mt-6 flex gap-4">

              <button
                type="submit"
                className="rounded-2xl bg-[#D4AF37] px-6 py-3 font-bold text-black"
              >
                Save Address
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-white/10 px-6 py-3"
              >
                Cancel
              </button>

            </div>

          </motion.form>
        )}

        {/* ===============================
            ADDRESS LIST
        =============================== */}

        {loading ? (
          <div className="mt-10 rounded-[30px] border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-zinc-400">
              Loading your addresses...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="mt-10 rounded-[30px] border border-white/10 bg-white/5 p-10 text-center">

            <MapPin
              size={42}
              color={GOLD}
              className="mx-auto"
            />

            <h3 className="mt-5 text-2xl font-bold">
              No Saved Addresses
            </h3>

            <p className="mt-3 text-zinc-500">
              Add your first delivery address to make checkout
              faster.
            </p>

          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
                      <MapPin
                        size={22}
                        color={GOLD}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        {address.full_name}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        {address.phone}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-6 space-y-2 text-zinc-400">

                  <p>
                    {address.complete_address}
                  </p>

                  <p>
                    {address.city} - {address.postal_code}
                  </p>

                </div>

              </motion.div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}