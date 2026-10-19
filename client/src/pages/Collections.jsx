import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GOLD = "#D4AF37";
const API_URL = "http://localhost:5001/api/online-products";

function formatCategory(category) {
  return String(category)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Collections() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCollections() {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] =
          await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}?limit=0`),
          ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error(
            "Unable to load categories from the dataset."
          );
        }

        const categoryData = await categoryResponse.json();
        const productData = await productResponse.json();

        const categories = Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || [];

        const products = Array.isArray(productData)
          ? productData
          : productData.products || [];

        const categoryCards = categories.map((category, index) => {
          const matchingProduct = products.find(
            (product) =>
              String(product.category).toLowerCase() ===
              String(category).toLowerCase()
          );

          return {
            id: category,
            collection: category,
            title: formatCategory(category),
            subtitle: `Explore products in ${formatCategory(category)}.`,
            image:
              matchingProduct?.image ||
              matchingProduct?.thumbnail ||
              matchingProduct?.images?.[0] ||
              "",
            badge: index === 0 ? "EXPLORE" : "COLLECTION",
          };
        });

        if (!cancelled) {
          setCollections(categoryCards);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Something went wrong while loading collections."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  const openCollection = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-28 text-white sm:pt-32">
      {/* Collections hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="transition hover:text-[#D4AF37]"
              >
                Home
              </button>

              <ChevronRight className="h-4 w-4" />

              <span style={{ color: GOLD }}>Collections</span>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
              <Sparkles className="h-4 w-4" style={{ color: GOLD }} />

              <span
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: GOLD }}
              >
                Explore the Dataset
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Explore Our
              <span className="block" style={{ color: GOLD }}>
                Product Categories
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              Discover every category available in our product
              catalogue. Select a category to explore its products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collection cards */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {loading && (
          <div
            role="status"
            className="py-20 text-center text-zinc-400"
          >
            Loading all product categories...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-300">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#E5C454]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && collections.length === 0 && (
          <p className="py-20 text-center text-zinc-400">
            No categories were found.
          </p>
        )}

        {!loading && !error && collections.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection, index) => (
              <motion.article
                key={collection.id}
                onClick={() => openCollection(collection.collection)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCollection(collection.collection);
                  }
                }}
                role="link"
                tabIndex={0}
                aria-label={`Explore ${collection.title} products`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 6) * 0.06,
                }}
                viewport={{ once: true }}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors duration-300 hover:border-[#D4AF37]/40"
              >
                <div className="relative h-64 overflow-hidden bg-zinc-900 sm:h-72">
                  {collection.image ? (
                    <img
                      src={collection.image}
                      alt={collection.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      No image available
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold tracking-wider text-black">
                    {collection.badge}
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white transition group-hover:text-[#D4AF37]">
                      {collection.title}
                    </h2>

                    <p className="mt-3 leading-7 text-zinc-400">
                      {collection.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.15em] text-zinc-500 sm:tracking-[0.2em]">
                      Explore Category
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 transition duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black">
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Full catalogue call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#111111] via-[#161616] to-[#0b0b0b] p-7 sm:mt-20 sm:p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                Full Catalogue
              </span>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Find Your Next Favourite
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                Browse the full product catalogue and discover
                something new.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#E5C454]"
            >
              Explore All Products
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
