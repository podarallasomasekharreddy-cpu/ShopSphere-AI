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
  whileHover={{ y: -10 }}
  transition={{ duration: 0.35 }}
  onClick={() => navigate(`/product/${product.id}`)}
  className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]"
>
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <button className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-black">
          <Heart size={20} />
        </button>

        <div className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
          {product.badge}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
          {product.brand}
        </p>

        <h3 className="text-2xl font-bold text-white">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <Star
            size={18}
            fill="#D4AF37"
            className="text-[#D4AF37]"
          />

          <span className="text-white">
            {product.rating}
          </span>

          <span className="text-[#888]">
            ({product.reviews})
          </span>
        </div>

        <p className="line-clamp-2 text-[#A5A5A5]">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      product.inStock
        ? "bg-emerald-500/20 text-emerald-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {product.inStock ? "In Stock" : "Out of Stock"}
  </span>

  <button className="text-sm font-semibold text-[#D4AF37] transition hover:text-white">
    Quick View
  </button>
</div>

        <div className="flex items-end justify-between pt-3">
          <div>
            <p className="text-3xl font-black text-[#D4AF37]">
              ${product.price}
            </p>

            <p className="text-[#666666] line-through">
              ${product.oldPrice}
            </p>
          </div>

          <div className="flex gap-3">
  <button
  onClick={(e) => {
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }}
  className="rounded-full border border-white/10 p-3 text-white transition hover:border-[#D4AF37]"
>
  <Heart
    size={18}
    fill={isWishlisted ? "#D4AF37" : "none"}
    className={
      isWishlisted
        ? "text-[#D4AF37]"
        : "hover:text-[#D4AF37]"
    }
  />
</button>

  <button
  onClick={(e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
    });
  }}
  className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:scale-105"
>
    <ShoppingBag size={18} />
    Add to Cart
  </button>
</div>
        </div>
      </div>
    </motion.div>
  );
}