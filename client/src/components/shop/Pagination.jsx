import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <section className="bg-[#050505] py-14">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-5">

        {/* PREVIOUS */}
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((page) =>
              Math.max(page - 1, 1)
            )
          }
          className={`mr-3 flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${
            currentPage === 1
              ? "cursor-not-allowed text-zinc-700"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <ChevronLeft size={17} />
          <span className="hidden sm:inline">
            Previous
          </span>
        </motion.button>

        {/* PAGE NUMBERS */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1.5 backdrop-blur-xl">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 min-w-[30px] items-center justify-center px-1 text-sm text-zinc-500"
                >
                  …
                </span>
              );
            }

            const isActive = currentPage === page;

            return (
              <motion.button
                key={page}
                whileTap={{ scale: 0.94 }}
                onClick={() => setCurrentPage(page)}
                className={`flex h-9 min-w-[36px] items-center justify-center rounded-full px-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.18)]"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* NEXT */}
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((page) =>
              Math.min(page + 1, totalPages)
            )
          }
          className={`ml-3 flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${
            currentPage === totalPages
              ? "cursor-not-allowed text-zinc-700"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="hidden sm:inline">
            Next
          </span>
          <ChevronRight size={17} />
        </motion.button>

      </div>
    </section>
  );
}