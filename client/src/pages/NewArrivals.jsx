
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ChevronRight,
  Flame,
  ArrowRight,
  LoaderCircle,
  PackageSearch,
} from "lucide-react";

const GOLD = "#D4AF37";
const API = "https://shopsphere-ai-zwey.onrender.com";

const getArray = (data) =>
  Array.isArray(data)
    ? data
    : data?.products ?? data?.data ?? data?.results ?? [];

const getCategory = (p) => {
  const value =
    p.category ??
    p.categoryName ??
    p.category_name ??
    p.collection ??
    p.productCategory ??
    p.product_category;

  if (value && typeof value === "object") {
    return value.name ?? value.title ?? value.category ?? "Other";
  }

  return String(value || "Other").trim();
};

const getDate = (p) => {
  const value =
    p.created_at ??
    p.createdAt ??
    p.date_added ??
    p.dateAdded ??
    p.added_at ??
    p.addedAt ??
    p.created_on ??
    p.createdOn;

  if (value) {
    const time = new Date(value).getTime();
    if (Number.isFinite(time)) return time;
  }

  // Fallback only when the API does not provide a creation date.
  const id = Number(p.id ?? p.product_id);
  return Number.isFinite(id) ? id : 0;
};

const getImage = (p) => {
  let image =
    p.image ??
    p.image_url ??
    p.imageUrl ??
    p.thumbnail ??
    p.thumbnail_url;

  if (!image && Array.isArray(p.images)) {
    image = p.images[0];
  }

  if (image && typeof image === "object") {
    image = image.url ?? image.src ?? image.image_url;
  }

  if (typeof image !== "string" || !image.trim()) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(image)) return image;
  if (image.startsWith("//")) return `https:${image}`;
  if (image.startsWith("/")) return `${API}${image}`;

  return image;
};

const getPrice = (p) => {
  const value =
    p.price ??
    p.salePrice ??
    p.sale_price ??
    p.discountedPrice ??
    p.discounted_price ??
    p.regular_price;

  if (value == null || value === "") return null;

  const price = Number(String(value).replace(/[₹,\s]/g, ""));
  return Number.isFinite(price) ? price : null;
};

const normalizeProduct = (p, source) => ({
  ...p,
  id: p.id ?? p.product_id ?? p.productId,
  _source: source,
  _category: getCategory(p),
  _date: getDate(p),
  _name:
    p.title ??
    p.name ??
    p.product_name ??
    p.productName ??
    "Product",
  _image: getImage(p),
  _price: getPrice(p),
});

export default function NewArrivals() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      const endpoints = [
        { url: `${API}/api/products`, source: "database" },
        { url: `${API}/api/online-products`, source: "online" },
      ];

      try {
        const results = await Promise.all(
          endpoints.map(async ({ url, source }) => {
            try {
              const response = await fetch(url, {
                signal: controller.signal,
              });

              if (!response.ok) return [];

              const data = await response.json();

              return getArray(data).map((p) =>
                normalizeProduct(p, source)
              );
            } catch (err) {
              if (err.name === "AbortError") throw err;
              return [];
            }
          })
        );

        if (controller.signal.aborted) return;

        const seen = new Set();

        const combined = results.flat().filter((p) => {
          if (p.id == null) return false;

          const key = `${p._source}:${p.id}`;

          if (seen.has(key)) return false;

          seen.add(key);
          return true;
        });

        setProducts(combined);

        if (!combined.length) {
          setError(
            "No products were found. Please check that your product API is running."
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const arrivals = useMemo(() => {
    const categories = new Map();

    products.forEach((product) => {
      const label = String(product._category || "Other").trim();
      const key = label.toLowerCase();

      if (!categories.has(key)) {
        categories.set(key, []);
      }

      categories.get(key).push(product);
    });

    const selected = [...categories.values()]
      .map((categoryProducts) =>
        [...categoryProducts]
          .sort((a, b) => b._date - a._date)
          .slice(0, 2)
      )
      .sort(
        (a, b) =>
          (b[0]?._date ?? 0) - (a[0]?._date ?? 0)
      )
      .flat()
      .slice(0, 16);

    return selected;
  }, [products]);

  const openProduct = (product) => {
    // Keep the product ID format used by your existing product routes.
    navigate(`/product/${product.id}`);
  };

  const formatPrice = (price) => {
    if (price == null) return "Price unavailable";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const badges = [
    "JUST DROPPED",
    "NEW ARRIVAL",
    "RECENTLY ADDED",
    "CURATED",
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-8 pb-6" >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <button
                onClick={() => navigate("/")}
                className="transition hover:text-white"
              >
                Home
              </button>

              <ChevronRight className="h-4 w-4" />

              <span style={{ color: GOLD }}>
                New Arrivals
              </span>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
              <Sparkles
                className="h-4 w-4"
                style={{ color: GOLD }}
              />

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Just Dropped
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black lg:text-5xl">
              Discover
              <span className="block text-[#D4AF37]">
                New Arrivals
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 pt-7 pb-12">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex items-center gap-2 text-[#D4AF37]">
              <Flame size={18} />
              Fresh from the catalogue
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Latest Products
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              {loading
                ? "Finding the latest additions..."
                : `${arrivals.length} `}
            </p>
          </div>

          <button
            onClick={() => navigate("/shop?sort=newest")}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#e4c454]"
          >
            View All <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02]">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#D4AF37]" />
            <p className="text-sm text-zinc-400">
              Loading new arrivals...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] px-6 text-center">
            <PackageSearch className="h-9 w-9 text-[#D4AF37]" />

            <p className="max-w-xl text-zinc-400">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#D4AF37] px-5 py-2.5 font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        ) : arrivals.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] px-6 text-center">
            <PackageSearch className="h-9 w-9 text-[#D4AF37]" />

            <p className="text-zinc-400">
              No products are available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {arrivals.map((item, index) => (
              <motion.article
                key={`${item._source}-${item.id}`}
                onClick={() => openProduct(item)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    openProduct(item);
                  }
                }}
                role="link"
                tabIndex={0}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.06,
                }}
                viewport={{ once: true, amount: 0.12 }}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#10100f] p-5 sm:h-60">
                  {item._image ? (
                    <img
                      src={item._image}
                      alt={item._name}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                    />
                  ) : (
                    <PackageSearch className="h-12 w-12 text-zinc-700" />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1.5 text-[10px] font-bold tracking-wider text-black">
                    {badges[index % badges.length]}
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white transition group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                      {item._category}
                    </span>

                    <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-semibold text-white transition group-hover:text-[#D4AF37]">
                      {item._name}
                    </h3>

                    <p className="mt-3 text-xl font-bold text-white">
                      {formatPrice(item._price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Explore Product
                    </span>

                    <span className="text-xs text-zinc-400 transition group-hover:text-[#D4AF37]">
                      View Details
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#161616] to-[#0b0b0b] p-8 sm:p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                Limited Release
              </span>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Fresh Styles, Straight from the Source
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                Discover recently added pieces across the ShopSpher
                catalogue. Check back as new products arrive.
              </p>
            </div>

            <button
              onClick={() => navigate("/shop?sort=newest")}
              className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#e4c454]"
            >
              Explore All Products
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
