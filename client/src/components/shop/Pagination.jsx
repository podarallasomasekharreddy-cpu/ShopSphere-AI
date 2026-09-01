import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <section className="bg-[#050505] py-16">
      <div className="mx-auto flex max-w-[1450px] items-center justify-center gap-4 px-6 lg:px-12">

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((page) => Math.max(page - 1, 1))
          }
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
            currentPage === 1
              ? "cursor-not-allowed border-white/5 bg-[#111111] text-zinc-600"
              : "border-white/10 bg-[#111111] text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
          }`}
        >
          <ChevronLeft size={18} />
        </motion.button>

        {pages.map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(page)}
            className={`h-12 w-12 rounded-full font-semibold transition ${
              currentPage === page
                ? "bg-[#D4AF37] text-black"
                : "border border-white/10 bg-[#111111] text-white hover:border-[#D4AF37]"
            }`}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((page) =>
              Math.min(page + 1, totalPages)
            )
          }
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
            currentPage === totalPages
              ? "cursor-not-allowed border-white/5 bg-[#111111] text-zinc-600"
              : "border-white/10 bg-[#111111] text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
          }`}
        >
          <ChevronRight size={18} />
        </motion.button>

      </div>
    </section>
  );
}