
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import allProducts from "../../data/products";

const API_BASE = "https://shopsphere-ai-zwey.onrender.com";

const recentSearches = [
  "Nike Shoes",
  "Apple Watch",
  "Gaming Laptop",
  "Leather Jacket",
];

const trending = [
  "Sneakers",
  "Luxury Watches",
  "Headphones",
  "Smartphones",
  "Backpacks",
  "Perfumes",
];

const getImage = (product) => {
  if (product.image) return product.image;
  if (product.image_url) return product.image_url;

  if (Array.isArray(product.images)) {
    return product.images[0] || "";
  }

  if (typeof product.images === "string") {
    try {
      const images = JSON.parse(product.images);
      return Array.isArray(images) ? images[0] || "" : "";
    } catch {
      return product.images;
    }
  }

  return "";
};

const getTitle = (product) =>
  String(product.title || product.name || "Untitled Product");

const getPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Price unavailable";
  }

  const amount = Number(price);

  if (!Number.isFinite(amount)) return String(price);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SearchModal({ open, onClose }) {
  const [search, setSearch] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadProducts() {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data)) {
          setDbProducts(data);
        }
      } catch (error) {
        console.error("Search database products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const products = useMemo(() => {
    const combined = [...dbProducts, ...allProducts];
    const seen = new Set();

    return combined.filter((product) => {
      const title = getTitle(product).toLowerCase();
      const brand = String(product.brand || "").toLowerCase();
      const price = String(product.price ?? "");
      const key = `${title}|${brand}|${price}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [dbProducts]);

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return [];

    return products
      .filter((product) => {
        const searchableText = [
          getTitle(product),
          product.brand,
          product.category,
          product.collection,
          product.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(term);
      })
      .slice(0, 6);
  }, [products, search]);

  const submitSearch = (value = search) => {
    const term = value.trim();

    if (!term) return;

    navigate(`/search?query=${encodeURIComponent(term)}`);
    setSearch("");
    onClose();
  };

  const openProduct = (product) => {
    if (product.id === undefined || product.id === null) return;

    navigate(`/product/${product.id}`);
    setSearch("");
    onClose();
  };

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 px-3 py-8 backdrop-blur-xl sm:px-6"
        >
          <motion.div
            initial={{ y: -35, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -25, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0A0A0A] shadow-2xl sm:mt-16"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:px-8"
            >
              <Search size={23} className="shrink-0 text-[#D4AF37]" />

              <input
                autoFocus
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, brands or categories..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-zinc-500 sm:text-lg"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <X size={22} />
              </button>
            </form>

            {search.trim() ? (
              <div className="border-b border-white/10 px-5 py-6 sm:px-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Matching Products
                  </h3>

                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="text-sm text-zinc-400 transition hover:text-[#D4AF37]"
                  >
                    View all results →
                  </button>
                </div>

                {results.length === 0 ? (
                  <p className="py-5 text-zinc-400">
                    {loading
                      ? "Loading products..."
                      : "No matching products. Try another name, brand or category."}
                  </p>
                ) : (
                  <div className="max-h-[45vh] space-y-3 overflow-y-auto">
                    {results.map((product, index) => (
                      <button
                        type="button"
                        key={`${product.id}-${getTitle(product)}-${index}`}
                        onClick={() => openProduct(product)}
                        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[#D4AF37]/60 hover:bg-white/[0.07]"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                          {getImage(product) ? (
                            <img
                              src={getImage(product)}
                              alt={getTitle(product)}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Search size={20} className="text-zinc-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {getTitle(product)}
                          </p>

                          <p className="mt-1 truncate text-sm text-zinc-500">
                            {product.brand || product.category || "ShopSpher Collection"}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-[#D4AF37]">
                          {getPrice(product.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-8 p-5 sm:grid-cols-2 sm:p-8">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <Clock size={18} className="text-[#D4AF37]" />
                    <h3 className="font-bold text-white">Recent Searches</h3>
                  </div>

                  <div className="space-y-3">
                    {recentSearches.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setSearch(item)}
                        className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-[#D4AF37]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <TrendingUp size={18} className="text-[#D4AF37]" />
                    <h3 className="font-bold text-white">Trending Searches</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {trending.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setSearch(item)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
