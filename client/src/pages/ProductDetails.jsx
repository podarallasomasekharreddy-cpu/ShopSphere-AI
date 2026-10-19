
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
  X,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const GOLD = "#D6B44A";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return [];
};

const resolveImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
    return image;
  }

  return `http://localhost:5001${
    image.startsWith("/") ? image : `/${image}`
  }`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useWishlist();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);

        const [regularResponse, onlineResponse] = await Promise.all([
          fetch("http://localhost:5001/api/products"),
          fetch("http://localhost:5001/api/online-products"),
        ]);

        const regularData = await regularResponse.json();
        const onlineData = await onlineResponse.json();

        if (!regularResponse.ok || !onlineResponse.ok) {
          throw new Error("Unable to load products.");
        }

        const regularProducts = Array.isArray(regularData)
          ? regularData
          : regularData.products || [];

        const onlineProducts = Array.isArray(onlineData)
          ? onlineData
          : onlineData.products || [];

        // Keep the API's original IDs so product links remain compatible
        // with ProductGrid and the existing product-details route.
        if (active) {
          setAllProducts([
            ...regularProducts,
            ...onlineProducts,
          ]);
        }

        const isOnlineProduct = id.startsWith("online-");
        const searchId = isOnlineProduct
          ? id.replace(/^online-/, "")
          : id;

        const preferredProducts = isOnlineProduct
          ? onlineProducts
          : regularProducts;

        const otherProducts = isOnlineProduct
          ? regularProducts
          : onlineProducts;

        let item = preferredProducts.find(
          (candidate) => String(candidate.id) === String(searchId)
        );

        if (!item) {
          item = otherProducts.find(
            (candidate) => String(candidate.id) === String(searchId)
          );
        }

        if (!item || !active) {
          if (active) setProduct(null);
          return;
        }

        const images = parseArray(item.images)
          .filter(Boolean)
          .map(resolveImageUrl);

        const mainImage = resolveImageUrl(
          item.image || item.thumbnail || images[0] || ""
        );

        const normalizedProduct = {
          ...item,
          id: item.id,
          title: item.title || item.name || "Untitled Product",
          price: Number(item.price) || 0,
          originalPrice: Number(
            item.originalPrice || item.original_price || item.discountPrice
          ) || 0,
          image: mainImage,
          images: images.length
            ? images
            : mainImage
              ? [mainImage]
              : [],
          sizes: parseArray(item.sizes),
          colors: parseArray(item.colors),
          features: parseArray(item.features || item.highlights),
          specifications: (() => {
            const raw = item.specifications;
            if (Array.isArray(raw)) return raw;
            if (raw && typeof raw === "object") {
              return Object.entries(raw).map(([label, value]) => ({
                label,
                value,
              }));
            }
            if (typeof raw === "string") {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
                if (parsed && typeof parsed === "object") {
                  return Object.entries(parsed).map(([label, value]) => ({
                    label,
                    value,
                  }));
                }
              } catch {
                return raw.trim() ? [{ label: "Details", value: raw }] : [];
              }
            }
            return [];
          })(),
        };

        setProduct(normalizedProduct);
        setSelectedImage(0);
        setSelectedSize(normalizedProduct.sizes[0] || "");
        setSelectedColor(normalizedProduct.colors[0] || "");
        setQuantity(1);
      } catch (error) {
        console.error("Product details error:", error);
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      active = false;
    };
  }, [id]);

  const images = product?.images || [];

  const sizes = product?.sizes?.length
    ? product.sizes
    : ["S", "M", "L", "XL"];

  const colors = product?.colors?.length
    ? product.colors
    : ["Midnight Black", "Royal Gold"];

  const isWishlisted = product
    ? wishlistItems.some(
        (item) => String(item.id) === String(product.id)
      )
    : false;

  const toggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const previousImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    if (images.length < 2) return;

    setSelectedImage((current) => (current + 1) % images.length);
  };

  useEffect(() => {
    if (!zoomOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setZoomOpen(false);
      if (event.key === "ArrowLeft") previousImage();
      if (event.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomOpen, images.length]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#080807] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D6B44A]" />
          <p className="mt-5 text-sm tracking-[0.2em] text-[#b7a36a]">
            PREPARING YOUR SELECTION
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#080807] px-5 text-white">
        <div className="max-w-md text-center">
          <ShoppingBag
            className="mx-auto h-10 w-10"
            style={{ color: GOLD }}
          />
          <p className="mt-5 text-xs tracking-[0.3em] text-[#D6B44A]">
            SHOPSPHER
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight">
            Product unavailable
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            We couldn't find this product. Return to the shop to explore
            the collection.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#D6B44A] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ead17b]"
          >
            <ArrowLeft size={17} />
            Back to shop
          </button>
        </div>
      </main>
    );
  }

  const discount =
    product.originalPrice > product.price && product.originalPrice > 0
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : Number(product.discountPercentage || product.discount || 0);

  const specifications =
    product.specifications.length > 0
      ? product.specifications
      : [
          { label: "Brand", value: product.brand || "ShopSpher" },
          {
            label: "Category",
            value: product.category || "Premium collection",
          },
          {
            label: "Availability",
            value: product.stock === 0 ? "Out of stock" : "Available",
          },
        ];

  const addProductToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const buyNow = () => {
    addProductToCart();
    navigate("/cart");
  };

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#080807] pb-20 text-[#f3f0e8]">
        <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
          <div className="absolute -left-48 top-64 h-96 w-96 rounded-full bg-[#b99a43]/[0.035] blur-[130px]" />
          <div className="absolute -right-48 top-[550px] h-96 w-96 rounded-full bg-[#b99a43]/[0.025] blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-[1360px] px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <nav className="flex min-w-0 items-center gap-2 text-xs text-zinc-500 sm:text-sm">
              <Link to="/" className="transition hover:text-[#e2c66f]">
                Home
              </Link>
              <ChevronRight size={14} />
              <Link
                to="/shop"
                className="transition hover:text-[#e2c66f]"
              >
                Shop
              </Link>
              <ChevronRight size={14} />
              <span className="max-w-44 truncate text-[#d6b44a]">
                {product.title}
              </span>
            </nav>

            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 transition hover:border-[#b99a43]/60 hover:text-[#e2c66f] sm:text-sm"
            >
              <ArrowLeft size={15} />
              Back to shop
            </button>
          </div>

          <section className="grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-16">
            <div className="min-w-0">
              <div className="group relative overflow-hidden rounded-[26px] border border-[#b99a43]/20 bg-gradient-to-br from-[#171613] via-[#11110f] to-[#0b0b0a] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,180,74,0.055),transparent_65%)]" />

                <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#b99a43]/25 bg-black/60 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#d6b44a] backdrop-blur-sm sm:left-5 sm:top-5 sm:px-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d6b44a]" />
                  Curated selection
                </div>

                <button
                  onClick={toggleWishlist}
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition sm:right-5 sm:top-5 ${
                    isWishlisted
                      ? "border-rose-400/50 bg-rose-500/15 text-rose-300"
                      : "border-white/10 bg-black/50 text-white hover:border-[#b99a43]/50 hover:text-[#e2c66f]"
                  }`}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                </button>

                {images.length > 0 ? (
                  <div className="relative flex h-[310px] items-center justify-center p-7 sm:h-[390px] sm:p-9 lg:h-[440px] xl:h-[475px]">
                    <img
                      key={images[selectedImage]}
                      src={images[selectedImage]}
                      alt={product.title}
                      onClick={() => setZoomOpen(true)}
                      className="relative z-[1] h-full w-full cursor-zoom-in object-contain p-2 transition-transform duration-500 group-hover:scale-[1.025]"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white transition hover:border-[#b99a43]/50 hover:text-[#e2c66f] sm:left-4"
                        >
                          <ChevronLeft size={19} />
                        </button>
                        <button
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-white transition hover:border-[#b99a43]/50 hover:text-[#e2c66f] sm:right-4"
                        >
                          <ChevronRight size={19} />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setZoomOpen(true)}
                      className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm transition hover:border-[#b99a43]/50 hover:text-[#e2c66f] sm:bottom-5 sm:left-5"
                    >
                      <ZoomIn size={14} />
                      View details
                    </button>

                    {discount > 0 && (
                      <span className="absolute bottom-4 right-4 z-10 rounded-full bg-[#d6b44a] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black sm:bottom-5 sm:right-5">
                        Save {discount}%
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[310px] items-center justify-center text-sm text-zinc-500 sm:h-[390px] lg:h-[440px]">
                    Image unavailable
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`overflow-hidden rounded-2xl border bg-[#11110f] p-2 transition sm:p-3 ${
                        selectedImage === index
                          ? "border-[#d6b44a]/80 shadow-[0_0_0_1px_rgba(214,180,74,0.12)]"
                          : "border-white/[0.08] hover:border-[#d6b44a]/40"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="h-[56px] w-full object-contain sm:h-[72px]"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-2 py-4 text-center">
                  <ShieldCheck size={19} className="text-[#d6b44a]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300 sm:text-[10px]">
                    Quality first
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-2 py-4 text-center">
                  <Truck size={19} className="text-[#d6b44a]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300 sm:text-[10px]">
                    Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-2 py-4 text-center">
                  <RotateCcw size={19} className="text-[#d6b44a]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300 sm:text-[10px]">
                    Easy support
                  </span>
                </div>
              </div>

              <section className="mt-5 rounded-2xl border border-[#b99a43]/20 bg-gradient-to-br from-[#171510] to-[#0c0c0b] p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d6b44a]">
                  Product information
                </p>
                <h2 className="mt-2 text-xl font-medium tracking-tight text-[#f3f0e8]">
                  Specifications
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
                  {specifications.map((specification, index) => {
                    const label =
                      typeof specification === "object" && specification !== null
                        ? specification.label || specification.name || `Specification ${index + 1}`
                        : `Specification ${index + 1}`;
                    const value =
                      typeof specification === "object" && specification !== null
                        ? specification.value ?? specification.description ?? "—"
                        : specification;
                    return (
                      <div
                        key={`${label}-${index}`}
                        className={`grid grid-cols-1 gap-1.5 px-3 py-3 text-xs sm:grid-cols-[0.85fr_1.15fr] sm:gap-3 ${
                          index % 2 === 0 ? "bg-white/[0.025]" : "bg-transparent"
                        } ${index < specifications.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                      >
                        <span className="text-zinc-500">{label}</span>
                        <span className="break-words text-zinc-200">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="min-w-0 pt-1 lg:pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d6b44a] sm:text-xs">
                {product.brand || "ShopSpher collection"}
              </p>

              <h1 className="mt-4 max-w-2xl text-[32px] font-medium leading-[1.13] tracking-[-0.04em] text-[#f4f0e6] sm:text-[40px] lg:text-[42px] xl:text-[48px]">
                {product.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-[#d6b44a]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(Number(product.rating || 4))
                          ? "text-[#d6b44a]"
                          : "text-zinc-700"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-zinc-200">
                  {product.rating ?? "4.8"}
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">
                  {product.reviews ?? 3} reviews
                </span>
                {product.category && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-zinc-400">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-[#b99a43]/50 via-white/[0.08] to-transparent sm:my-7" />

              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <span className="text-[34px] font-semibold tracking-[-0.04em] text-[#d6b44a] sm:text-[40px]">
                  {currency.format(product.price)}
                </span>

                {product.originalPrice > product.price &&
                  product.originalPrice > 0 && (
                    <span className="pb-1 text-sm text-zinc-500 line-through">
                      {currency.format(product.originalPrice)}
                    </span>
                  )}

                {discount > 0 && (
                  <span className="mb-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-[10px] font-semibold text-emerald-400">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                Inclusive of listed price
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {product.stock === 0 ? "Currently unavailable" : "Available to order"}
              </div>

              <div className="mt-6 sm:mt-7">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-300">
                  About this product
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aaa69d] sm:text-[15px] sm:leading-8">
                  {product.description ||
                    "A thoughtfully selected piece from the ShopSpher collection, chosen for its distinctive design and everyday appeal."}
                </p>
              </div>

              <div className="mt-6 border-t border-white/[0.07] pt-5 sm:mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                    Select size
                  </h2>
                  <span className="text-[10px] text-zinc-600">
                    {selectedSize ? `Selected: ${selectedSize}` : "Choose an option"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 rounded-xl border px-4 py-2.5 text-xs transition ${
                        selectedSize === size
                          ? "border-[#d6b44a] bg-[#d6b44a] font-semibold text-black"
                          : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-[#d6b44a]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                    Select colour
                  </h2>
                  <span className="text-[10px] text-zinc-600">
                    {selectedColor || "Choose an option"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${
                        selectedColor === color
                          ? "border-[#d6b44a]/80 bg-[#d6b44a]/[0.08] text-[#e4cb7c]"
                          : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-[#d6b44a]/40"
                      }`}
                    >
                      {selectedColor === color && <Check size={13} />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/[0.07] pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                    Quantity
                  </h2>
                  <span className="text-[10px] text-zinc-500">
                    Selected quantity: {quantity}
                  </span>
                </div>

                <div className="flex flex-wrap items-stretch gap-3">
                  <div className="flex h-[50px] items-center rounded-xl border border-white/10 bg-white/[0.025]">
                    <button
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      aria-label="Decrease quantity"
                      className="flex h-full w-10 items-center justify-center text-zinc-400 transition hover:text-[#e2c66f]"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-8 text-center text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((current) => current + 1)
                      }
                      aria-label="Increase quantity"
                      className="flex h-full w-10 items-center justify-center text-zinc-400 transition hover:text-[#e2c66f]"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={addProductToCart}
                    className="flex h-[50px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b44a] to-[#e1c35f] px-4 text-sm font-semibold text-black transition hover:brightness-110"
                  >
                    <ShoppingBag size={17} />
                    Add to cart
                  </button>

                  <button
                    onClick={toggleWishlist}
                    aria-label="Toggle wishlist"
                    className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border transition ${
                      isWishlisted
                        ? "border-rose-400/40 bg-rose-500/10 text-rose-300"
                        : "border-white/10 text-zinc-300 hover:border-[#d6b44a]/50 hover:text-[#e2c66f]"
                    }`}
                  >
                    <Heart
                      size={19}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                  </button>
                </div>

                <button
                  onClick={buyNow}
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#b99a43]/40 bg-transparent text-sm font-medium text-[#dfc15c] transition hover:bg-[#d6b44a]/[0.07]"
                >
                  Buy now
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/[0.07] pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="mt-0.5 shrink-0 text-[#d6b44a]" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      Delivery information
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                      Delivery options are shown during checkout.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#d6b44a]" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      Shop with confidence
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                      A carefully selected ShopSpher product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {product.features.length > 0 && (
            <section className="mt-10 rounded-2xl border border-[#b99a43]/20 bg-gradient-to-br from-[#171510] to-[#0c0c0b] p-5 sm:mt-12 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d6b44a]">
                The details
              </p>
              <h2 className="mt-3 text-xl font-medium text-[#f3f0e8]">
                Product highlights
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-4"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#d6b44a]"
                    />
                    <span className="text-sm leading-6 text-zinc-300">
                      {typeof feature === "object"
                        ? feature.label || feature.name || feature.value
                        : feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 border-t border-white/[0.08] pt-10 sm:mt-16 sm:pt-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d6b44a]">
              Curated for you
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-[#f3f0e8] sm:text-3xl">
                  You may also like
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  More considered finds from the ShopSpher collection.
                </p>
              </div>
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 rounded-full border border-[#b99a43]/40 px-4 py-2.5 text-xs text-[#dfc15c] transition hover:bg-[#d6b44a]/[0.08] sm:text-sm"
              >
                Explore the shop <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {allProducts
                .filter((item) => String(item.id) !== String(product.id))
                .filter((item, index, array) =>
                  array.findIndex((candidate) => String(candidate.id) === String(item.id)) === index
                )
                .sort((a, b) => {
                  const currentCategory = String(product.category || "").toLowerCase();
                  const aMatch = currentCategory && String(a.category || "").toLowerCase() === currentCategory;
                  const bMatch = currentCategory && String(b.category || "").toLowerCase() === currentCategory;
                  return Number(bMatch) - Number(aMatch);
                })
                .slice(0, 4)
                .map((item) => {
                  const itemImages = parseArray(item.images);
                  const image = resolveImageUrl(item.image || item.thumbnail || itemImages[0] || "");
                  const title = item.title || item.name || "ShopSpher product";
                  const itemId = String(item.id);
                  return (
                    <button
                      key={itemId}
                      type="button"
                      onClick={() => {
                        navigate(`/product/${itemId}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10100e] text-left transition duration-300 hover:-translate-y-1 hover:border-[#b99a43]/50"
                    >
                      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#191814] to-[#0b0b0a] p-4 sm:h-48 sm:p-6">
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-[#b99a43]/50" />
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="truncate text-[9px] uppercase tracking-[0.16em] text-[#d6b44a]">
                          {item.brand || item.category || "ShopSpher"}
                        </p>
                        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium text-zinc-100 transition group-hover:text-[#e5c968]">
                          {title}
                        </h3>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#d6b44a]">
                            {currency.format(Number(item.price) || 0)}
                          </span>
                          <ArrowRight size={15} className="shrink-0 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-[#d6b44a]" />
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>
        </div>
      </main>

      {zoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-[#d6b44a]/50 hover:text-[#e2c66f]"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white sm:left-8"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <img
            src={images[selectedImage]}
            alt={product.title}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[78vh] max-w-full object-contain"
          />

          {images.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white sm:right-8"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <p className="absolute bottom-5 left-0 right-0 text-center text-xs tracking-wider text-zinc-400">
            {product.title} · {selectedImage + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
