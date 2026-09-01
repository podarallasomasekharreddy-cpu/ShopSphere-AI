import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
  Star,
} from "lucide-react";

import shopProducts from "../../data/shopProducts";

const GOLD = "#D4AF37";

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: {
      duration: 0.18,
    },
  },
};

const uniqueValues = (key) =>
  [...new Set(shopProducts.map((item) => item[key]).filter(Boolean))].sort();

function Filters({
  sort,
  setSort,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  price,
  setPrice,
  rating,
  setRating,
  inStock,
  setInStock,
  resetFilters,
}) {
  const categories = useMemo(() => uniqueValues("category"), []);
  const brands = useMemo(() => uniqueValues("brand"), []);

  const maxPrice = useMemo(
    () => Math.max(...shopProducts.map((item) => Number(item.price) || 0)),
    []
  );

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const closeMenu = () => setOpenMenu(null);

  const Dropdown = ({
    id,
    title,
    value,
    width = "w-56",
    children,
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleMenu(id)}
        className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white backdrop-blur-xl transition hover:border-[#D4AF37]/40 hover:bg-white/10"
      >
        <span className="text-zinc-400">{title}</span>

        <span className="font-medium text-white">
          {value}
        </span>

        <ChevronDown
          className={`ml-auto h-4 w-4 transition ${
            openMenu === id ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {openMenu === id && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute left-0 top-14 z-50 ${width} overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B]/95 p-3 shadow-2xl backdrop-blur-3xl`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-3xl">
        <div className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-3">
          <SlidersHorizontal
            className="h-5 w-5"
            style={{ color: GOLD }}
          />

          <span
            className="text-sm font-semibold tracking-wider uppercase"
            style={{ color: GOLD }}
          >
            Filters
          </span>
        </div>

        <Dropdown
          id="category"
          title="Category"
          value={selectedCategory}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              closeMenu();
            }}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white transition hover:bg-white/10"
          >
            <span>All Categories</span>

            {selectedCategory === "All" && (
              <Check
                className="h-4 w-4"
                style={{ color: GOLD }}
              />
            )}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category);
                closeMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white transition hover:bg-white/10"
            >
              <span>{category}</span>

              {selectedCategory === category && (
                <Check
                  className="h-4 w-4"
                  style={{ color: GOLD }}
                />
              )}
            </button>
          ))}
        </Dropdown>

        <Dropdown
          id="brand"
          title="Brand"
          value={selectedBrand}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedBrand("All");
              closeMenu();
            }}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white transition hover:bg-white/10"
          >
            <span>All Brands</span>

            {selectedBrand === "All" && (
              <Check
                className="h-4 w-4"
                style={{ color: GOLD }}
              />
            )}
          </button>

          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => {
                setSelectedBrand(brand);
                closeMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white transition hover:bg-white/10"
            >
              <span>{brand}</span>

              {selectedBrand === brand && (
                <Check
                  className="h-4 w-4"
                  style={{ color: GOLD }}
                />
              )}
            </button>
          ))}
        </Dropdown>
                <Dropdown
          id="price"
          title="Price"
          value={`₹${price.toLocaleString()}`}
          width="w-72"
        >
          <div className="space-y-5 p-2">
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-yellow-500"
            />

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-zinc-400">
                Maximum Price
              </span>

              <span
                className="font-semibold"
                style={{ color: GOLD }}
              >
                ₹{price.toLocaleString()}
              </span>
            </div>
          </div>
        </Dropdown>

        <Dropdown
          id="rating"
          title="Rating"
          value={rating === 0 ? "All" : `${rating}+`}
          width="w-64"
        >
          {[4, 3, 2, 1, 0].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRating(value);
                closeMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < value
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>

              {rating === value && (
                <Check
                  className="h-4 w-4"
                  style={{ color: GOLD }}
                />
              )}
            </button>
          ))}
        </Dropdown>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => setInStock(!inStock)}
          className={`flex h-12 items-center gap-3 rounded-2xl border px-5 transition ${
            inStock
              ? "border-[#D4AF37]/40 bg-[#D4AF37]/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <motion.div
            animate={{
              backgroundColor: inStock
                ? "rgba(212,175,55,.25)"
                : "rgba(255,255,255,.06)",
            }}
            className="flex h-6 w-11 items-center rounded-full px-1"
          >
            <motion.div
              animate={{
                x: inStock ? 18 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="h-4 w-4 rounded-full bg-white"
            />
          </motion.div>

          <span className="text-sm text-white">
            In Stock
          </span>
        </motion.button>

        <Dropdown
          id="sort"
          title="Sort"
          value={
            {
              featured: "Featured",
              "price-asc": "Price ↑",
              "price-desc": "Price ↓",
              newest: "Newest",
              rating: "Top Rated",
              name: "A - Z",
            }[sort] || "Featured"
          }
          width="w-64"
        >
          {[
            ["featured", "Featured"],
            ["price-asc", "Price: Low to High"],
            ["price-desc", "Price: High to Low"],
            ["rating", "Highest Rated"],
            ["newest", "Newest"],
            ["name", "A - Z"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSort(value);
                closeMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10"
            >
              <span className="text-white">
                {label}
              </span>

              {sort === value && (
                <Check
                  className="h-4 w-4"
                  style={{ color: GOLD }}
                />
              )}
            </button>
          ))}
        </Dropdown>
                <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={resetFilters}
          className="ml-auto flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-[#D4AF37]/40 hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </motion.button>
      </div>
    </div>
  );
}

export default Filters;