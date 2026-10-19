
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import staticProducts from "../../data/products";
import {
  ArrowRight,
  Heart,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const API_URL = "http://localhost:5001/api/products";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const getImage = (product) => {
  let images = product.images;

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      images = [];
    }
  }

  const image =
    product.image ||
    product.image_url ||
    product.imageUrl ||
    (Array.isArray(images) ? images[0] : "");

  if (!image || typeof image !== "string") return "";

  if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
    return image;
  }

  return `http://localhost:5001${
    image.startsWith("/") ? image : `/${image}`
  }`;
};

const normalizeProduct = (product) => ({
  ...product,
  title: String(product.title || product.name || "Product"),
  category: product.category || product.collection || "Collection",
  image: getImage(product),
  price: product.price ?? 0,
  rating: product.rating ?? 0,
});

const formatPrice = (price) => {
  if (typeof price === "string" && /[₹$€£]/.test(price)) {
    return price;
  }

  const amount = Number(price);

  return Number.isFinite(amount)
    ? currency.format(amount)
    : "Price unavailable";
};

const TrendingProducts = () => {
  const navigate = useNavigate();

  const {
    wishlistItems = [],
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        if (active && Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) => Number(b.id) - Number(a.id)
          );

          setDbProducts(sorted.map(normalizeProduct));
        }
      } catch (error) {
        console.error("Could not load trending products:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const localProducts = staticProducts.map(normalizeProduct);

  const databaseProducts = dbProducts.filter(
    (product) => product.image
  );

  const databaseTitles = new Set(
    databaseProducts.map((product) => product.title.toLowerCase())
  );

  const fallbackProducts = localProducts.filter(
    (product) =>
      product.image &&
      !databaseTitles.has(product.title.toLowerCase())
  );

  // Six products total: one featured, three on the right,
  // and two more in the row underneath.
  const productsToShow = [
    ...databaseProducts,
    ...fallbackProducts,
  ].slice(0, 6);

  const isWishlisted = (product) =>
    wishlistItems.some(
      (item) => String(item.id) === String(product.id)
    );

  const toggleWishlist = (product) => {
    if (isWishlisted(product)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const ProductHeart = ({ product }) => (
    <button
      type="button"
      aria-label="Toggle wishlist"
      onClick={() => toggleWishlist(product)}
      className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:p-3"
    >
      <Heart
        size={18}
        fill={isWishlisted(product) ? "currentColor" : "none"}
      />
    </button>
  );

  const ProductCard = ({ product, index = 0 }) => (
    <motion.article
      key={`${product.id}-${product.title}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative flex min-w-0 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] transition hover:border-[#D4AF37]/40"
    >
      <button
        type="button"
        onClick={() => navigate(`/product/${product.id}`)}
        className="w-[32%] shrink-0 overflow-hidden bg-[#171717] sm:w-[34%]"
        aria-label={`View ${product.title}`}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full min-h-[125px] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-3 pr-11 sm:p-4 sm:pr-12">
        <p className="line-clamp-1 text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] sm:text-xs">
          {product.category}
        </p>

        <button
          type="button"
          onClick={() => navigate(`/product/${product.id}`)}
          className="mt-2 line-clamp-2 text-left text-sm font-bold text-white transition hover:text-[#D4AF37] sm:text-base"
        >
          {product.title}
        </button>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
          <Star
            size={14}
            className="fill-[#D4AF37] text-[#D4AF37]"
          />
          {product.rating || "New"}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#D4AF37] sm:text-base">
            {formatPrice(product.price)}
          </span>

          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 px-2.5 py-1.5 text-xs font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black sm:px-3"
          >
            Explore <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="absolute right-2 top-2">
        <ProductHeart product={product} />
      </div>
    </motion.article>
  );

  const featured = productsToShow[0];
  const sideProducts = productsToShow.slice(1, 3);
  const bottomProducts = productsToShow.slice(3, 5);

  return (
    <section className="relative overflow-hidden bg-[#050505] py-2 md:py-3">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              <Sparkles size={14} />
              Trending Collection
            </span>

            <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              Crafted for
              <span className="mt-1 block bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#D4AF37] bg-clip-text text-transparent">
                Modern Luxury
              </span>
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-gray-400">
              Discover timeless pieces selected for exceptional
              craftsmanship, premium materials, and refined elegance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Explore Collection
            <ArrowRight size={18} />
          </button>
        </div>

        {loading && productsToShow.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            Loading products...
          </p>
        ) : productsToShow.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            No products available right now.
          </p>
        ) : (
          <>
            {/* Product layout: featured left, two right, two underneath */}
<div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2 lg:gap-3">
  {/* Left column */}
  <div className="flex flex-col gap-4">
    {featured && (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-[360px] overflow-hidden rounded-[24px] border border-white/10 bg-[#111] sm:h-[400px] lg:h-[470px]"
      >
        <button
          type="button"
          onClick={() => navigate(`/product/${featured.id}`)}
          className="absolute inset-0 h-full w-full text-left"
          aria-label={`View ${featured.title}`}
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </button>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute right-4 top-4 z-10">
          <ProductHeart product={featured} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-black/40 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] sm:text-xs">
            <ShieldCheck size={14} />
            Featured Luxury
          </span>

          <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
            {featured.category}
          </p>

          <h3 className="mt-2 line-clamp-2 text-2xl font-bold text-white sm:text-3xl">
            {featured.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-white">
            <Star size={15} className="fill-[#D4AF37] text-[#D4AF37]" />
            {featured.rating || "New"}
          </div>

          <p className="mt-2 text-xl font-bold text-[#D4AF37] sm:text-2xl">
            {formatPrice(featured.price)}
          </p>

          <button
            type="button"
            onClick={() => navigate(`/product/${featured.id}`)}
            className="pointer-events-auto mt-3 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Explore Product
            <ArrowRight size={17} />
          </button>
        </div>
      </motion.article>
    )}

    {/* Product directly below the featured card */}
    {bottomProducts[0] && (
      <ProductCard product={bottomProducts[0]} index={3} />
    )}
  </div>

  {/* Right column: two cards above, one directly below */}
  <div className="flex flex-col gap-4">
    {sideProducts.map((product, index) => (
      <ProductCard
        key={`${product.id}-${product.title}`}
        product={product}
        index={index}
      />
    ))}

    {bottomProducts[1] && (
      <ProductCard product={bottomProducts[1]} index={4} />
    )}
  </div>
</div>

            
          </>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
