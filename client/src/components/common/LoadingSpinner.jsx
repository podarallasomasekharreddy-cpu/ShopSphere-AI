import { motion } from "framer-motion";

export default function LoadingSpinner({
  size = 70,
  text = "Loading...",
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-8">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative"
      >
        <div
          style={{
            width: size,
            height: size,
          }}
          className="rounded-full border-[5px] border-white/10"
        />

        <div
          style={{
            width: size,
            height: size,
          }}
          className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-[#D4AF37]"
        />
      </motion.div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-white">
          {text}
        </h3>

        <p className="mt-2 text-zinc-500">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}