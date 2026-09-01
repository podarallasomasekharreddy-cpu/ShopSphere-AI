import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title = "Nothing Found",
  description = "There is nothing to display here yet.",
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="flex h-28 w-28 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10"
      >
        <PackageSearch
          size={52}
          className="text-[#D4AF37]"
        />
      </motion.div>

      <h2 className="mt-8 text-3xl font-black text-white">
        {title}
      </h2>

      <p className="mt-4 max-w-md leading-8 text-zinc-400">
        {description}
      </p>
    </div>
  );
}