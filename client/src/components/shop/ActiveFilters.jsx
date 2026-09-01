import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";

export default function ActiveFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  rating,
  setRating,
  inStock,
  setInStock,
  resetFilters,
}) {
  const filters = [];

  if (selectedCategory !== "All") {
    filters.push({
      label: selectedCategory,
      remove: () => setSelectedCategory("All"),
    });
  }

  if (selectedBrand !== "All") {
    filters.push({
      label: selectedBrand,
      remove: () => setSelectedBrand("All"),
    });
  }

  if (rating > 0) {
    filters.push({
      label: `${rating}+ Stars`,
      remove: () => setRating(0),
    });
  }

  if (inStock) {
    filters.push({
      label: "In Stock",
      remove: () => setInStock(false),
    });
  }

  if (filters.length === 0) return null;

  return (
    <section className="pb-10">
      <div className="mx-auto flex max-w-[1450px] flex-wrap items-center gap-3 px-6 lg:px-12">
        <AnimatePresence>
          {filters.map((filter) => (
            <motion.button
              key={filter.label}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={filter.remove}
              className="flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#111111] px-5 py-3 text-sm text-white transition hover:border-[#D4AF37]"
            >
              {filter.label}

              <X size={15} />
            </motion.button>
          ))}
        </AnimatePresence>

        <button
          onClick={resetFilters}
          className="ml-auto flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:border-[#D4AF37] hover:text-white"
        >
          <RotateCcw size={16} />
          Reset All
        </button>
      </div>
    </section>
  );
}