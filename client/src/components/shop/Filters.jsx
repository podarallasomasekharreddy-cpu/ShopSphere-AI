import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
  Check,
  Star,
} from "lucide-react";

import shopProducts from "../../data/shopProducts";

const GOLD = "#D4AF37";

const uniqueValues = (key) =>
  [...new Set(shopProducts.map((item) => item[key]).filter(Boolean))].sort();

export default function Filters({
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
    () =>
      Math.max(...shopProducts.map((item) => Number(item.price) || 0)),
    []
  );

  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prev) =>
      prev === section ? null : section
    );
  };

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedBrand !== "All" ? 1 : 0) +
    (price < maxPrice ? 1 : 0) +
    (rating > 0 ? 1 : 0) +
    (inStock ? 1 : 0);

  const sortLabel =
    {
      featured: "Featured",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
      newest: "Newest",
      rating: "Highest Rated",
      name: "A - Z",
    }[sort] || "Featured";

  const closeDrawer = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  return (
    <>
      {/* FILTER / SORT BAR */}

      <div className="flex w-full items-center justify-between gap-3 border-y border-white/10 py-4">
        {/* FILTER BUTTON */}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.07]"
        >
          <SlidersHorizontal
            size={17}
            className="transition-colors group-hover:text-[#D4AF37]"
          />

          <span>Filters</span>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[10px] font-bold text-black">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* SORT BUTTON */}

        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setOpenSection("sort");
          }}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.07]"
        >
          <span className="text-zinc-500">
            Sort by
          </span>

          <span className="font-medium text-white">
            {sortLabel}
          </span>

          <ChevronDown
            size={15}
            className="text-zinc-500 transition-transform group-hover:text-[#D4AF37]"
          />
        </button>
      </div>

      {/* DRAWER */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            />

            {/* DRAWER */}

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="fixed right-0 top-0 z-[90] flex h-screen w-full max-w-[460px] flex-col border-l border-white/10 bg-[#090909] shadow-2xl"
            >
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: GOLD }}
                  >
                    ShopSpher
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Filter & Sort
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-[#D4AF37]/50 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              {/* CONTENT */}

              <div className="flex-1 overflow-y-auto">

                {/* SORT */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSection("sort")}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        Sort
                      </p>

                      <p className="mt-1 text-base font-medium text-white">
                        {sortLabel}
                      </p>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-zinc-500 transition-transform ${
                        openSection === "sort"
                          ? "rotate-180 text-[#D4AF37]"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openSection === "sort" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 px-6 pb-5">
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
                              onClick={() => setSort(value)}
                              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                              <span>{label}</span>

                              {sort === value && (
                                <Check
                                  size={17}
                                  style={{ color: GOLD }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CATEGORY */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSection("category")}
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <div className="text-left">
                      <p className="text-base font-medium text-white">
                        Category
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {selectedCategory}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-zinc-500 transition-transform ${
                        openSection === "category"
                          ? "rotate-90 text-[#D4AF37]"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openSection === "category" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 px-6 pb-5">
                          {["All", ...categories].map(
                            (category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() =>
                                  setSelectedCategory(category)
                                }
                                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <span>
                                  {category === "All"
                                    ? "All Categories"
                                    : category}
                                </span>

                                {selectedCategory === category && (
                                  <Check
                                    size={17}
                                    style={{ color: GOLD }}
                                  />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* BRAND */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSection("brand")}
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <div className="text-left">
                      <p className="text-base font-medium text-white">
                        Brand
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {selectedBrand}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-zinc-500 transition-transform ${
                        openSection === "brand"
                          ? "rotate-90 text-[#D4AF37]"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openSection === "brand" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 px-6 pb-5">
                          {["All", ...brands].map(
                            (brand) => (
                              <button
                                key={brand}
                                type="button"
                                onClick={() =>
                                  setSelectedBrand(brand)
                                }
                                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <span>
                                  {brand === "All"
                                    ? "All Brands"
                                    : brand}
                                </span>

                                {selectedBrand === brand && (
                                  <Check
                                    size={17}
                                    style={{ color: GOLD }}
                                  />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PRICE */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSection("price")}
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <div className="text-left">
                      <p className="text-base font-medium text-white">
                        Price
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Up to ₹{price.toLocaleString()}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-zinc-500 transition-transform ${
                        openSection === "price"
                          ? "rotate-90 text-[#D4AF37]"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openSection === "price" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            value={price}
                            onChange={(e) =>
                              setPrice(Number(e.target.value))
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-yellow-500"
                          />

                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-zinc-500">
                              ₹0
                            </span>

                            <span
                              className="font-semibold"
                              style={{ color: GOLD }}
                            >
                              ₹{price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RATING */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleSection("rating")}
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <div className="text-left">
                      <p className="text-base font-medium text-white">
                        Rating
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {rating === 0
                          ? "All ratings"
                          : `${rating}+ stars`}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-zinc-500 transition-transform ${
                        openSection === "rating"
                          ? "rotate-90 text-[#D4AF37]"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openSection === "rating" && (
                      <motion.div
                        initial={{ height: 0, opacity: 1 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 px-6 pb-5">
                          {[4, 3, 2, 1, 0].map(
                            (value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() =>
                                  setRating(value)
                                }
                                className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/5"
                              >
                                <div className="flex items-center gap-1">
                                  {Array.from({
                                    length: 5,
                                  }).map((_, index) => (
                                    <Star
                                      key={index}
                                      size={15}
                                      className={
                                        index < value
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-zinc-700"
                                      }
                                    />
                                  ))}

                                  <span className="ml-2 text-sm text-zinc-400">
                                    {value === 0
                                      ? "All ratings"
                                      : `${value}+`}
                                  </span>
                                </div>

                                {rating === value && (
                                  <Check
                                    size={17}
                                    style={{ color: GOLD }}
                                  />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AVAILABILITY */}

                <div className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className="flex w-full items-center justify-between px-6 py-5"
                  >
                    <div className="text-left">
                      <p className="text-base font-medium text-white">
                        Availability
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {inStock
                          ? "In stock only"
                          : "All products"}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                        inStock
                          ? "bg-[#D4AF37]"
                          : "bg-zinc-800"
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: inStock ? 20 : 0,
                        }}
                        className="h-4 w-4 rounded-full bg-white"
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* FOOTER */}

              <div className="border-t border-white/10 bg-[#090909] p-5">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      closeDrawer();
                    }}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
                  >
                    <RotateCcw size={16} />
                    Clear All
                  </button>

                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="h-12 flex-[1.4] rounded-full bg-[#D4AF37] text-sm font-bold text-black transition hover:bg-[#e4c354]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}