import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

const options = [
  "Featured",
  "Newest",
  "Best Selling",
  "Price: Low → High",
  "Price: High → Low",
  "Highest Rated",
];

export default function ProductSort() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Featured");

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-[#111111]/90 px-6 py-3 text-white transition hover:border-[#D4AF37]"
      >
        <ArrowUpDown
          size={17}
          className="text-[#D4AF37]"
        />

        <span className="font-medium">
          {selected}
        </span>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>

        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 15,
            }}
            transition={{
              duration: 0.25,
            }}
            className="absolute right-0 mt-4 w-72 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/95 backdrop-blur-2xl"
          >

            {options.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-6 py-4 transition hover:bg-white/5 ${
                  selected === item
                    ? "text-[#D4AF37]"
                    : "text-white"
                }`}
              >

                {item}

                {selected === item && (
                  <Check size={17} />
                )}

              </button>
            ))}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}