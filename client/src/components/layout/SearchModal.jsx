import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import allProducts from "../../data/products";

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

export default function SearchModal({
  open,
  onClose,
}) {
    const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const results = allProducts.filter((product) =>
  `${product.title} ${product.brand} ${product.category}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

const handleSearch = (e) => {
  if (e.key === "Enter" && search.trim()) {
    navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    onClose();
    setSearch("");
  }
};
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xl"
        >
          <motion.div
            initial={{
              y: -60,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -60,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="mx-auto mt-24 w-[95%] max-w-4xl overflow-hidden rounded-[34px] border border-white/10 bg-[#0A0A0A]"
          >
            <div className="flex items-center border-b border-white/10 px-8 py-6">
              <Search
                size={24}
                className="text-[#D4AF37]"
              />

              <input
  autoFocus
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={handleSearch}
  placeholder="Search premium products..."
  className="ml-5 flex-1 bg-transparent text-lg outline-none placeholder:text-zinc-500"
/>

              <button
                onClick={onClose}
                className="ml-5 rounded-xl p-2 hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            {search.trim() && (
  <div className="border-t border-white/10 px-8 py-6">
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
      Search Results
    </h3>

    {results.length === 0 ? (
      <p className="text-zinc-500">
        No products found.
      </p>
    ) : (
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {results.slice(0, 6).map((product) => (
          <button
            key={product.id}
            onClick={() => {
              navigate(`/product/${product.id}`);
              onClose();
              setSearch("");
            }}
            className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-[#D4AF37] hover:bg-white/10"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold text-white">
                {product.title}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {product.brand}
              </p>
            </div>

            <span className="font-bold text-[#D4AF37]">
              ₹{product.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    )}
  </div>
)}
            <div className="grid gap-10 p-8 md:grid-cols-2">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <Clock
                    size={18}
                    className="text-[#D4AF37]"
                  />

                  <h3 className="font-bold">
                    Recent Searches
                  </h3>
                </div>

                <div className="space-y-3">
                  {recentSearches.map((item) => (
  <button
    key={item}
    onClick={() => setSearch(item)}
    className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-[#D4AF37]"
  >
    {item}
  </button>
))}
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <TrendingUp
                    size={18}
                    className="text-[#D4AF37]"
                  />

                  <h3 className="font-bold">
                    Trending Searches
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {trending.map((item) => (
  <button
    key={item}
    onClick={() => setSearch(item)}
    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 transition hover:border-[#D4AF37]"
  >
    {item}
  </button>
))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}