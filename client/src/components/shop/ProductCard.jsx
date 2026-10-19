import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#111111] transition-shadow duration-300 hover:border-white/20 hover:shadow-xl"
    >
      {/* IMAGE */}

      <div className="relative h-[240px] shrink-0 overflow-hidden bg-[#0b0b0b]">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {product.badge && (
          <div className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-black">
            {product.badge}
          </div>
        )}

        {/* TOP WISHLIST */}

        <button
          onClick={(e) => {
            e.stopPropagation();

            if (isWishlisted) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product);
            }
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
        >
          <Heart
            size={16}
            fill={isWishlisted ? "#D4AF37" : "none"}
            className={
              isWishlisted
                ? "text-[#D4AF37]"
                : "text-white"
            }
          />
        </button>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-4">

        {/* BRAND */}

        <p className="min-h-[18px] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
          {product.brand}
        </p>

        {/* TITLE */}

        <h3 className="mt-1.5 min-h-[48px] line-clamp-2 text-lg font-bold leading-6 text-white">
          {product.title}
        </h3>

        {/* RATING */}

        <div className="mt-2 flex h-5 items-center gap-1.5">
          <Star
            size={15}
            fill="#D4AF37"
            className="shrink-0 text-[#D4AF37]"
          />

          <span className="text-xs font-medium text-white">
            {product.rating}
          </span>

          <span className="text-xs text-[#777]">
            ({product.reviews})
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className="mt-2 min-h-[40px] line-clamp-2 text-xs leading-5 text-[#A5A5A5]">
          {product.description}
        </p>

        {/* STOCK + QUICK VIEW */}

        <div className="mt-3 flex h-6 items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              product.inStock
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {product.inStock
              ? "In Stock"
              : "Out of Stock"}
          </span>

          <button
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-[#D4AF37] transition hover:text-white"
          >
            Quick View
          </button>
        </div>

        {/* PRICE */}

        <div className="mt-3 flex min-h-[48px] items-end justify-between">
          <div>
            <p className="text-xl font-black leading-none text-[#D4AF37]">
              ₹{product.price}
            </p>

            {product.oldPrice && (
              <p className="mt-1.5 text-xs text-[#666666] line-through">
                ₹{product.oldPrice}
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-4 flex h-10 gap-2">

          {/* WISHLIST */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              if (isWishlisted) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product);
              }
            }}
            className="flex w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-transparent text-white transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <Heart
              size={17}
              fill={isWishlisted ? "#D4AF37" : "none"}
              className={
                isWishlisted
                  ? "text-[#D4AF37]"
                  : "text-white"
              }
            />
          </button>

          {/* ADD TO CART */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              addToCart({
                ...product,
                quantity: 1,
              });
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-3 text-xs font-bold text-black transition-all duration-300 hover:bg-[#e4c354] hover:shadow-lg"
          >
            <ShoppingBag size={16} />

            <span>Add to Cart</span>
          </button>

        </div>
      </div>
    </motion.div>
  );
}