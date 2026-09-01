import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Sparkles,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";

const GOLD = "#D4AF37";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [shipping, setShipping] = useState("express");
const [payment, setPayment] = useState("card");

const [addresses, setAddresses] = useState([]);
const [selectedAddressId, setSelectedAddressId] = useState(null);
const [loadingAddresses, setLoadingAddresses] = useState(true);

const shippingCost = shipping === "standard" ? 199 : 0;

  const finalTotal = cartTotal + shippingCost;

useEffect(() => {
  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!savedUser) {
    setLoadingAddresses(false);
    return;
  }

  try {
    const user = JSON.parse(savedUser);

    if (!user?.id) {
      setLoadingAddresses(false);
      return;
    }

    fetch(`http://localhost:5001/api/addresses/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }

        return response.json();
      })
      .then((data) => {
        setAddresses(data);

        // Automatically select the first saved address
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      })
      .catch((error) => {
        console.error("Failed to load addresses:", error);
        toast.error("Failed to load saved addresses.");
      })
      .finally(() => {
        setLoadingAddresses(false);
      });
  } catch (error) {
    console.error("Failed to read user:", error);
    setLoadingAddresses(false);
  }
}, []);

const placeOrder = async () => {
  if (cartItems.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  const user = JSON.parse(
    localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "null"
  );

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!user || !user.id) {
    toast.error("Please login before placing an order.");
    navigate("/login");
    return;
  }

  try {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    const addressId = selectedAddressId;

    // Create order number
    const orderNumber = `SP-${Date.now()
      .toString()
      .slice(-8)}`;

    // Create order in MySQL
    const orderResponse = await fetch(
      "http://localhost:5001/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          userId: user.id,
          orderNumber,
          total: finalTotal,
          shippingMethod: shipping,
          paymentMethod: payment,
          addressId: addressId,
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      toast.error(
        orderData.message || "Failed to place order."
      );
      return;
    }

    // Clear cart after successful order
    clearCart();

    // Go to order success page
navigate("/order-success", {
  state: {
    orderId: orderData.orderId,
    orderNumber: orderData.orderNumber,
  },
});
  } catch (error) {
    console.error("Place order error:", error);
    toast.error("Unable to connect to the server.");
  }
};
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Checkout
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Secure Checkout
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Checkout
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Complete your order with secure payment and
            premium delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_.8fr]">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <MapPin
                size={22}
                color={GOLD}
              />

              <h2 className="text-2xl font-bold">
                Delivery Address
              </h2>
            </div>

            <div className="space-y-5">

  {loadingAddresses ? (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-6 text-center">
      <p className="text-zinc-400">
        Loading saved addresses...
      </p>
    </div>
  ) : addresses.length === 0 ? (

    <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">

      <div className="flex items-start gap-4">

        <MapPin
          size={22}
          color={GOLD}
          className="mt-1 shrink-0"
        />

        <div>
          <h3 className="font-bold">
            No Saved Addresses
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            You don't have any saved delivery addresses yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/addresses")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            Add New Address
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>

  ) : (

    <>

      <div className="space-y-4">

        {addresses.map((address) => (

          <label
            key={address.id}
            className={`block cursor-pointer rounded-2xl border p-5 transition ${
              selectedAddressId === address.id
                ? "border-[#D4AF37]/40 bg-[#D4AF37]/10"
                : "border-white/10 bg-[#111] hover:border-[#D4AF37]/30"
            }`}
          >

            <div className="flex items-start gap-4">

              <input
                type="radio"
                name="savedAddress"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() =>
                  setSelectedAddressId(address.id)
                }
                className="mt-1 accent-[#D4AF37]"
              />

              <div className="flex-1">

                <div className="flex items-center justify-between gap-4">

                  <h3 className="font-bold">
                    {address.full_name}
                  </h3>

                  {selectedAddressId === address.id && (
                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                      Selected
                    </span>
                  )}

                </div>

                <p className="mt-2 text-sm text-zinc-400">
                  {address.phone}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {address.complete_address}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {address.city} - {address.postal_code}
                </p>

              </div>

            </div>

          </label>

        ))}

      </div>

      <button
        type="button"
        onClick={() => navigate("/addresses")}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#111] py-4 font-semibold transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
      >
        <MapPin size={18} />
        Add New Address
        <ArrowRight size={17} />
      </button>

    </>

  )}

</div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <Truck
                size={22}
                color={GOLD}
              />

              <h2 className="text-2xl font-bold">
                Shipping Method
              </h2>
            </div>

            <div className="space-y-4">
              <label
  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
    shipping === "express"
      ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
      : "border-white/10"
  }`}
>
  <div className="flex items-center gap-3">
    <input
      type="radio"
      name="shipping"
      value="express"
      checked={shipping === "express"}
      onChange={(e) => setShipping(e.target.value)}
      className="accent-[#D4AF37]"
    />

    <span>Express Delivery (2-3 Days)</span>
  </div>

  <span className="font-bold text-[#D4AF37]">
    FREE
  </span>
</label>

<label
  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
    shipping === "standard"
      ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
      : "border-white/10"
  }`}
>
  <div className="flex items-center gap-3">
    <input
      type="radio"
      name="shipping"
      value="standard"
      checked={shipping === "standard"}
      onChange={(e) => setShipping(e.target.value)}
      className="accent-[#D4AF37]"
    />

    <span>Standard Delivery</span>
  </div>

  <span>₹199</span>
</label>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard
                size={22}
                color={GOLD}
              />

              <h2 className="text-2xl font-bold">
                Payment Method
              </h2>
            </div>

            <div className="space-y-4">
              <label
  className={`block cursor-pointer rounded-2xl border p-5 transition ${
    payment === "card"
      ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
      : "border-white/10"
  }`}
>
  <input
    type="radio"
    name="payment"
    value="card"
    checked={payment === "card"}
    onChange={(e) => setPayment(e.target.value)}
    className="mr-3 accent-[#D4AF37]"
  />

  Credit / Debit Card
</label>

<label
  className={`block cursor-pointer rounded-2xl border p-5 transition ${
    payment === "upi"
      ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
      : "border-white/10"
  }`}
>
  <input
    type="radio"
    name="payment"
    value="upi"
    checked={payment === "upi"}
    onChange={(e) => setPayment(e.target.value)}
    className="mr-3 accent-[#D4AF37]"
  />

  UPI
</label>

<label
  className={`block cursor-pointer rounded-2xl border p-5 transition ${
    payment === "cod"
      ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
      : "border-white/10"
  }`}
>
  <input
    type="radio"
    name="payment"
    value="cod"
    checked={payment === "cod"}
    onChange={(e) => setPayment(e.target.value)}
    className="mr-3 accent-[#D4AF37]"
  />

  Cash On Delivery
</label>
            </div>
          </div>
        </motion.div>
                <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-fit rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:sticky lg:top-28"
        >
          <h2 className="text-2xl font-black">
            Order Summary
          </h2>

          <div className="mt-8 space-y-5">
  {cartItems.map((item) => (
    <div
      key={item.id}
      className="flex justify-between gap-4 text-zinc-400"
    >
      <span>
        {item.title} × {item.quantity}
      </span>

      <span>
        ₹{(item.price * item.quantity).toLocaleString()}
      </span>
    </div>
  ))}

  <div className="flex justify-between text-zinc-400">
  <span>Shipping</span>

  <span className="text-green-400">
    {shippingCost === 0
      ? "FREE"
      : `₹${shippingCost.toLocaleString()}`}
  </span>
</div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111] p-4">
              <Tag
                size={18}
                color={GOLD}
              />

              <input
                type="text"
                placeholder="Coupon Code"
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between">
                <span className="text-xl font-bold">
                  Total
                </span>

                <span className="text-3xl font-black text-[#D4AF37]">
  ₹{finalTotal.toLocaleString()}
</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4">
              <ShieldCheck
                size={22}
                color={GOLD}
              />

              <span className="text-sm text-zinc-300">
                Your payment is protected with secure
                end-to-end encryption.
              </span>
            </div>

            <button
  onClick={placeOrder}
  className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-5 font-bold text-black transition hover:scale-[1.02]"
>
  Place Order

  <ArrowRight size={20} />
</button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}