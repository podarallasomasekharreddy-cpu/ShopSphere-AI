import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  X,
  ZoomIn,
} from "lucide-react";

import products from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const normalizeArray = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {
  wishlistItems,
  addToWishlist,
  removeFromWishlist,
} = useWishlist();

const product = useMemo(
  () => products.find((item) => String(item.id) === String(id)),
  [id]
);

const isWishlisted = wishlistItems.some(
  (item) => item.id === product?.id
);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return normalizeArray(product.images, [product.image]).filter(Boolean);
  }, [product]);

  const sizes = useMemo(
    () =>
      normalizeArray(product?.sizes, [
        "S",
        "M",
        "L",
        "XL",
      ]),
    [product]
  );

  const colors = useMemo(
    () =>
      normalizeArray(product?.colors, [
        "Midnight Black",
        "Royal Gold",
      ]),
    [product]
  );

  const highlights = useMemo(
    () =>
      normalizeArray(product?.highlights, [
        "Premium craftsmanship",
        "Luxury finish",
        "Designed for everyday comfort",
        "Long-lasting quality",
      ]),
    [product]
  );

  const specifications = useMemo(() => {
    if (Array.isArray(product?.specifications) && product.specifications.length)
      return product.specifications;

    return [
      { label: "Category", value: product?.category || "Premium Collection" },
      { label: "Brand", value: product?.brand || "ShopSpher" },
      { label: "Material", value: product?.material || "Premium Quality" },
      { label: "Availability", value: "In Stock" },
    ];
  }, [product]);

  const rating = product?.rating ?? 4.8;
  const reviews = product?.reviews ?? 284;

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category === product.category ||
            item.brand === product.brand)
      )
      .slice(0, 4);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
 
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(sizes[0]);
    setSelectedColor(colors[0]);
    setQuantity(1);
    
  }, [sizes, colors, id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-bold text-amber-400">
            Product Not Found
          </h2>
          <p className="mt-4 text-gray-400">
            The product you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-amber-500 bg-amber-500/10 px-6 py-3 text-amber-300 transition hover:bg-amber-500 hover:text-black"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % gallery.length);

  const previousImage = () =>
    setSelectedImage((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/shop")}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-900 px-4 py-2 text-sm text-amber-300 transition hover:border-amber-400 hover:bg-zinc-800"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </button>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <motion.div
                layout
                className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-zinc-950"
              >
                <img
                  src={gallery[selectedImage]}
                  alt={product.title}
                  className="h-[560px] w-full cursor-zoom-in object-cover"
                  onClick={() => setZoomOpen(true)}
                />

                <button
                  onClick={() => setZoomOpen(true)}
                  className="absolute right-5 top-5 rounded-full bg-black/70 p-3 text-amber-300 transition hover:bg-amber-500 hover:text-black"
                >
                  <ZoomIn size={18} />
                </button>

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-amber-300 transition hover:bg-amber-500 hover:text-black"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-amber-300 transition hover:bg-amber-500 hover:text-black"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </motion.div>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      selectedImage === index
                        ? "border-amber-400"
                        : "border-zinc-700"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title}-${index}`}
                      className="h-28 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="inline-flex w-fit items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-sm text-amber-300">
                Premium Collection
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight">
                {product.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="text-4xl font-bold text-amber-400">
                  {currency.format(product.price)}
                </span>

                <div className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2">
                  <Star
                    size={18}
                    className="fill-amber-400 text-amber-400"
                  />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-gray-500">
                    ({reviews} reviews)
                  </span>
                </div>
              </div>

              <p className="mt-6 leading-8 text-gray-300">
                {product.description}
              </p>

              <div className="mt-8">
                <h3 className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-300">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border px-5 py-3 transition ${
                        selectedSize === size
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-zinc-700 bg-zinc-900 hover:border-amber-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
                            <div className="mt-8">
                <h3 className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-300">
                  Select Color
                </h3>

                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border px-5 py-3 transition ${
                        selectedColor === color
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-zinc-700 bg-zinc-900 hover:border-amber-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
                  <button
                    onClick={decrease}
                    className="p-4 transition hover:bg-zinc-800"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="min-w-14 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={increase}
                    className="p-4 transition hover:bg-zinc-800"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <motion.button
  whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.02 }}
  onClick={() =>
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    })
  }
  className="flex-1 rounded-xl bg-amber-400 px-6 py-4 font-bold text-black shadow-lg shadow-amber-500/20 transition"
>
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag size={20} />
                    Add to Cart
                  </span>
                </motion.button>

                <button
  onClick={() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }}
  className={`rounded-xl border p-4 transition ${
    isWishlisted
      ? "border-red-500 bg-red-500 text-white"
      : "border-zinc-700 bg-zinc-900 hover:border-amber-400"
  }`}
>
  <Heart
    size={22}
    className={isWishlisted ? "fill-current" : ""}
  />
</button>
              </div>

              <div className="mt-10 rounded-3xl border border-amber-500/20 bg-zinc-900/70 p-6">
                <h3 className="mb-5 text-xl font-bold text-amber-300">
                  Product Highlights
                </h3>

                <div className="space-y-4">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <Check
                        size={18}
                        className="mt-1 text-amber-400"
                      />

                      <p className="text-gray-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-800">
                <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
                  <h3 className="text-xl font-bold text-amber-300">
                    Specifications
                  </h3>
                </div>

                <div className="divide-y divide-zinc-800">
                  {specifications.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="flex items-center justify-between bg-black/40 px-6 py-4"
                    >
                      <span className="text-gray-400">
                        {item.label}
                      </span>

                      <span className="font-medium text-white">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-24">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-black text-amber-300">
                Related Products
              </h2>

              <Link
                to="/shop"
                className="rounded-xl border border-amber-500/30 px-5 py-3 text-amber-300 transition hover:border-amber-400 hover:bg-zinc-900"
              >
                View All
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
                >
                  <Link to={`/product/${item.id}`}>
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-72 w-full object-cover transition duration-500 hover:scale-110"
                      />
                    </div>

                    <div className="space-y-3 p-5">
                      <h3 className="line-clamp-2 text-lg font-bold">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-400">
                          {currency.format(item.price)}
                        </span>

                        <div className="flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1 text-sm">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          {item.rating ?? 4.8}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6"
          >
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-zinc-900 p-3 text-white transition hover:bg-red-500"
            >
              <X size={22} />
            </button>

            <button
              onClick={previousImage}
              className="absolute left-6 rounded-full bg-zinc-900 p-3 text-white hover:bg-amber-500 hover:text-black"
            >
              <ChevronLeft size={24} />
            </button>
                        <motion.img
              key={gallery[selectedImage]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={gallery[selectedImage]}
              alt={product.title}
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain"
            />

            <button
              onClick={nextImage}
              className="absolute right-6 rounded-full bg-zinc-900 p-3 text-white transition hover:bg-amber-500 hover:text-black"
            >
              <ChevronRight size={24} />
            </button>

            {gallery.length > 1 && (
              <div className="absolute bottom-8 flex gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-modal-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border transition ${
                      selectedImage === index
                        ? "border-amber-400"
                        : "border-zinc-700"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title}-preview-${index}`}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
            </AnimatePresence>
    </>
  );
};

export default ProductDetails;