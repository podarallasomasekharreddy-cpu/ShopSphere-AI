import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, CreditCard, LockKeyhole,
  MapPin, PackageCheck, ShieldCheck, Sparkles, Tag, Truck, WalletCards,
} from "lucide-react";

const API = "http://localhost:5001/api";
const GOLD = "#D4AF37";
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [shipping, setShipping] = useState("express");
  const [payment, setPayment] = useState("razorpay");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [coupon, setCoupon] = useState("");

  const shippingCost = shipping === "standard" ? 199 : 0;
  const finalTotal = Number(cartTotal || 0) + shippingCost;

  useEffect(() => {
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!savedUser) {
      setLoadingAddresses(false);
      return;
    }
    try {
      const user = JSON.parse(savedUser);
      if (!user?.id) return setLoadingAddresses(false);
      fetch(`${API}/addresses/${user.id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch addresses");
          return response.json();
        })
        .then((data) => {
          setAddresses(data);
          if (data.length) setSelectedAddressId(data[0].id);
        })
        .catch((error) => {
          console.error("Failed to load addresses:", error);
          toast.error("Couldn't load saved addresses.");
        })
        .finally(() => setLoadingAddresses(false));
    } catch (error) {
      console.error("Failed to read user:", error);
      setLoadingAddresses(false);
    }
  }, []);

  const getCheckoutUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const orderPayload = (user, orderNumber, paymentMethod) => ({
    userId: user.id,
    orderNumber,
    total: finalTotal,
    shippingMethod: shipping,
    paymentMethod,
    addressId: selectedAddressId,
    items: cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      brand: item.brand,
      category: item.category,
      description: item.description,
      image: item.image,
      images: item.images,
      old_price: item.old_price ?? item.oldPrice ?? null,
      rating: item.rating,
      reviews: item.reviews,
      stock: item.stock,
      in_stock: item.in_stock ?? item.inStock,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  const saveOrder = async (user, orderNumber, paymentMethod, paymentProof = {}) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...orderPayload(user, orderNumber, paymentMethod), ...paymentProof }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to place order.");
    return data;
  };

  const finishOrder = (orderData, orderNumber) => {
    clearCart();
    navigate("/order-success", {
      state: { orderId: orderData.orderId, orderNumber: orderData.orderNumber || orderNumber },
    });
  };

  const placeOrder = async () => {
    if (placingOrder) return;
    if (!cartItems.length) return toast.error("Your cart is empty.");
    const user = getCheckoutUser();
    if (!user?.id) {
      toast.error("Please log in before placing an order.");
      navigate("/login");
      return;
    }
    if (!selectedAddressId) return toast.error("Please select a delivery address.");

    setPlacingOrder(true);
    const orderNumber = `SP-${Date.now().toString().slice(-8)}`;
    try {
      if (payment === "cod") {
        const data = await saveOrder(user, orderNumber, "cod");
        toast.success("Order placed successfully!");
        finishOrder(data, orderNumber);
        return;
      }

      // These endpoints must be added to server.js before online payments can work.
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout couldn't load. Check your internet connection.");

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const createResponse = await fetch(`${API}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload(user, orderNumber, "razorpay")),
      });
      const paymentOrder = await createResponse.json();
      if (!createResponse.ok) throw new Error(paymentOrder.message || "Unable to start payment.");

      const keyId = paymentOrder.keyId || paymentOrder.key_id;
      if (!keyId || !paymentOrder.id) throw new Error("Payment setup response is missing the Razorpay order ID or key ID.");

      const razorpay = new window.Razorpay({
        key: keyId,
        amount: paymentOrder.amount || Math.round(finalTotal * 100),
        currency: paymentOrder.currency || "INR",
        name: "ShopSpher",
        description: `Order ${orderNumber}`,
        order_id: paymentOrder.id,
        theme: { color: GOLD },
        prefill: { name: user.name || "", email: user.email || "" },
        notes: { orderNumber },
        modal: { ondismiss: () => setPlacingOrder(false) },
        handler: async (response) => {
          try {
            // The backend verifies Razorpay's signature and payment amount before
            // it creates the order, in the same request.
            const orderData = await saveOrder(user, orderNumber, "razorpay", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified. Your order is confirmed!");
            finishOrder(orderData, orderNumber);
          } catch (error) {
            console.error("Payment verification/order save error:", error);
            toast.error(error.message || "Payment succeeded but order confirmation needs support.");
            setPlacingOrder(false);
          }
        },
      });
      razorpay.on("payment.failed", (event) => {
        toast.error(event?.error?.description || "Payment failed. Please try again.");
        setPlacingOrder(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Unable to connect to the server.");
      setPlacingOrder(false);
    }
  };

  const sectionClass = "overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0b0b]";
  const optionClass = (active) => `group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition duration-200 ${active ? "border-[#D4AF37]/70 bg-[#D4AF37]/[0.07]" : "border-white/10 bg-white/[0.015] hover:border-white/25"}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-[#D4AF37]/[0.055] blur-[120px]" />
        <div className="absolute right-0 top-[38rem] h-80 w-80 rounded-full bg-amber-100/[0.025] blur-[100px]" />
      </div>

      <header className="relative border-b border-white/[0.08] pt-24 sm:pt-28">
        <div className="mx-auto max-w-[1320px] px-4 pb-7 sm:px-7 lg:px-10 lg:pb-9">
          <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px]">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 transition hover:text-white"><ArrowLeft size={14} /> Back to shopping</button>
            <span className="inline-flex items-center gap-2 text-[#D4AF37]"><LockKeyhole size={13} /> Secure checkout</span>
          </div>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4AF37]"><Sparkles size={13} /> The ShopSpher experience</p>
              <h1 className="font-serif text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">The final detail<span className="text-[#D4AF37]">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Review your selection, choose delivery, and complete your order.</p>
            </div>
            <div className="flex items-center gap-3 self-start border border-white/10 px-4 py-3 md:self-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/35 text-[#D4AF37]"><PackageCheck size={17} /></div>
              <div><p className="text-xs font-medium text-white">{cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Curated for you</p></div>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-3 border-y border-white/10 py-3 text-[9px] uppercase tracking-[0.16em] sm:text-[10px] sm:tracking-[0.22em]">
            <div className="flex items-center gap-2 text-[#D4AF37]"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D4AF37]/50">1</span> Delivery</div>
            <div className="flex items-center justify-center gap-2 text-zinc-400"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20">2</span> Payment</div>
            <div className="flex items-center justify-end gap-2 text-zinc-400"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20">3</span> Confirmation</div>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-4 py-5 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-7 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="min-w-0 space-y-4">
          <section className={`${sectionClass} p-4 sm:p-6`}>
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3"><MapPin className="text-[#D4AF37]" size={19} /><div><p className="text-sm font-semibold tracking-wide">Delivery address</p><p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-zinc-500">Where should we send it?</p></div></div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">01 / 03</span>
            </div>
            {loadingAddresses ? <div className="py-8 text-center text-sm text-zinc-500">Loading your saved addresses…</div> : addresses.length === 0 ? (
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-white/15 p-5 sm:flex-row sm:items-center"><div><p className="text-sm font-medium">No saved address yet</p><p className="mt-1 text-xs text-zinc-500">Add a delivery address to continue.</p></div><button type="button" onClick={() => navigate("/addresses")} className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#e6c75b]">Add address <ArrowRight size={14} /></button></div>
            ) : <div className="grid gap-2 sm:grid-cols-2">
              {addresses.map((address) => {
                const active = selectedAddressId === address.id;
                return <label key={address.id} className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition ${active ? "border-[#D4AF37]/65 bg-[#D4AF37]/[0.055]" : "border-white/10 hover:border-white/25"}`}>
                  <input type="radio" name="savedAddress" value={address.id} checked={active} onChange={() => setSelectedAddressId(address.id)} className="mt-1 accent-[#D4AF37]" />
                  <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold">{address.full_name}</p>{active && <Check size={15} className="shrink-0 text-[#D4AF37]" />}</div><p className="mt-1 text-xs text-zinc-400">{address.phone}</p><p className="mt-2 text-xs leading-5 text-zinc-300">{address.complete_address}</p><p className="mt-1 text-xs text-zinc-500">{address.city} · {address.postal_code}</p></div>
                </label>;
              })}
              <button type="button" onClick={() => navigate("/addresses")} className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-3 text-xs uppercase tracking-wider text-zinc-400 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"><MapPin size={15} /> Manage addresses <ArrowRight size={13} /></button>
            </div>}
          </section>

          <section className={`${sectionClass} p-4 sm:p-6`}>
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4"><div className="flex items-center gap-3"><Truck className="text-[#D4AF37]" size={19} /><div><p className="text-sm font-semibold tracking-wide">Delivery speed</p><p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-zinc-500">Choose your pace</p></div></div><span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">02 / 03</span></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className={optionClass(shipping === "express")}><input type="radio" name="shipping" value="express" checked={shipping === "express"} onChange={(e) => setShipping(e.target.value)} className="accent-[#D4AF37]" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold">Express delivery</p><p className="mt-1 text-[11px] text-zinc-500">Estimated 2–3 days</p></div><span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Complimentary</span></label>
              <label className={optionClass(shipping === "standard")}><input type="radio" name="shipping" value="standard" checked={shipping === "standard"} onChange={(e) => setShipping(e.target.value)} className="accent-[#D4AF37]" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold">Standard delivery</p><p className="mt-1 text-[11px] text-zinc-500">Reliable, considered delivery</p></div><span className="text-xs font-semibold">₹199</span></label>
            </div>
          </section>

          <section className={`${sectionClass} p-4 sm:p-6`}>
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4"><div className="flex items-center gap-3"><WalletCards className="text-[#D4AF37]" size={19} /><div><p className="text-sm font-semibold tracking-wide">Payment method</p><p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-zinc-500">A secure way to pay</p></div></div><span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">03 / 03</span></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className={optionClass(payment === "razorpay")}><input type="radio" name="payment" value="razorpay" checked={payment === "razorpay"} onChange={(e) => setPayment(e.target.value)} className="accent-[#D4AF37]" /><CreditCard size={18} className={payment === "razorpay" ? "text-[#D4AF37]" : "text-zinc-500"} /><div className="flex-1"><p className="text-xs font-semibold">Pay online</p><p className="mt-1 text-[11px] text-zinc-500">UPI, cards, net banking</p></div>{payment === "razorpay" && <Check size={15} className="text-[#D4AF37]" />}</label>
              <label className={optionClass(payment === "cod")}><input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={(e) => setPayment(e.target.value)} className="accent-[#D4AF37]" /><Truck size={18} className={payment === "cod" ? "text-[#D4AF37]" : "text-zinc-500"} /><div className="flex-1"><p className="text-xs font-semibold">Cash on delivery</p><p className="mt-1 text-[11px] text-zinc-500">Pay when it arrives</p></div>{payment === "cod" && <Check size={15} className="text-[#D4AF37]" />}</label>
            </div>
            {payment === "razorpay" && <p className="mt-3 flex items-center gap-2 text-[11px] leading-5 text-zinc-500"><ShieldCheck size={14} className="shrink-0 text-[#D4AF37]" /> Payments are securely processed by Razorpay. Card details are not stored by ShopSpher.</p>}
          </section>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="h-fit min-w-0 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#0a0a0a] lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6"><div><p className="font-serif text-xl tracking-tight">Your selection</p><p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Order summary</p></div><span className="text-xs text-zinc-500">{cartItems.length} items</span></div>
          <div className="max-h-[340px] space-y-0 overflow-y-auto px-5 sm:px-6">
            {cartItems.length === 0 ? <p className="py-8 text-sm text-zinc-500">Your bag is currently empty.</p> : cartItems.map((item) => <div key={item.id} className="flex gap-3 border-b border-white/[0.07] py-4 last:border-b-0">
              <div className="h-[68px] w-[58px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">{item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-contain p-1" /> : <div className="flex h-full items-center justify-center text-zinc-600"><PackageCheck size={18} /></div>}</div>
              <div className="min-w-0 flex-1"><p className="line-clamp-2 text-xs font-medium leading-5 text-zinc-200">{item.title}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500">Qty {item.quantity || 1}{item.brand ? ` · ${item.brand}` : ""}</p></div><p className="shrink-0 pt-0.5 text-xs font-semibold">{money(Number(item.price) * Number(item.quantity || 1))}</p>
            </div>)}
          </div>
          <div className="border-t border-white/10 px-5 py-4 sm:px-6">
            <label className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 focus-within:border-[#D4AF37]/50"><Tag size={15} className="shrink-0 text-[#D4AF37]" /><input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Promo code" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-600" /><button type="button" onClick={() => toast("Coupon codes aren't connected yet.")} className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Apply</button></label>
            <div className="space-y-3 text-xs"><div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>{money(cartTotal)}</span></div><div className="flex justify-between text-zinc-400"><span>Shipping</span><span className={shippingCost === 0 ? "text-[#D4AF37]" : "text-white"}>{shippingCost === 0 ? "Complimentary" : money(shippingCost)}</span></div><div className="flex justify-between text-zinc-400"><span>Taxes</span><span className="text-zinc-500">Included if applicable</span></div></div>
            <div className="my-4 border-t border-white/10" /><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Total due</p><p className="mt-1 text-[10px] text-zinc-600">INR · Inclusive where applicable</p></div><p className="font-serif text-3xl tracking-tight text-[#D4AF37]">{money(finalTotal)}</p></div>
            <button type="button" onClick={placeOrder} disabled={placingOrder || !cartItems.length || loadingAddresses || !addresses.length || !selectedAddressId} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.17em] text-black transition hover:bg-[#e8cb62] disabled:cursor-not-allowed disabled:opacity-40">{placingOrder ? "Processing…" : payment === "cod" ? "Place order" : "Continue to payment"}{!placingOrder && <ArrowRight size={15} />}</button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-zinc-600"><LockKeyhole size={11} /> Private, secure and thoughtfully handled</p>
          </div>
          <div className="grid grid-cols-3 border-t border-white/10 text-center"><div className="border-r border-white/10 px-2 py-3"><ShieldCheck size={15} className="mx-auto mb-1 text-[#D4AF37]"/><p className="text-[9px] uppercase tracking-wider text-zinc-500">Secure pay</p></div><div className="border-r border-white/10 px-2 py-3"><Truck size={15} className="mx-auto mb-1 text-[#D4AF37]"/><p className="text-[9px] uppercase tracking-wider text-zinc-500">Tracked ship</p></div><div className="px-2 py-3"><Sparkles size={15} className="mx-auto mb-1 text-[#D4AF37]"/><p className="text-[9px] uppercase tracking-wider text-zinc-500">Premium care</p></div></div>
        </motion.aside>
      </section>
    </main>
  );
}
