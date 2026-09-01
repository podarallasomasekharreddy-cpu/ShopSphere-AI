import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    color: "text-green-400",
  },
  error: {
    icon: AlertCircle,
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    color: "text-red-400",
  },
  info: {
    icon: Info,
    border: "border-[#D4AF37]/30",
    bg: "bg-[#D4AF37]/10",
    color: "text-[#D4AF37]",
  },
};

export default function Toast({
  show,
  title = "Notification",
  message = "",
  type = "info",
  onClose,
}) {
  const config = variants[type] || variants.info;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25 }}
          className="fixed right-6 top-24 z-[9999]"
        >
          <div
            className={`w-[360px] rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl`}
          >
            <div className="flex items-start gap-4 p-5">
              <Icon
                size={24}
                className={config.color}
              />

              <div className="flex-1">
                <h3 className="font-bold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}