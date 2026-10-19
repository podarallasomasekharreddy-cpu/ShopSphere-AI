import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const PRODUCTS_PER_PAGE = 8;
const API_BASE_URL = "https://shopsphere-ai-zwey.onrender.com";

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return [];
};

const normalizeImageUrl = (imagePath) => {
  if (typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }

  const path = imagePath.trim();

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  if (path.startsWith("//")) {
    return `https:${path}`;
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return path;
};

const normalizeProduct = (product, source) => {
  const rawImages = parseArray(product.images);
  const imageCandidates = [
    product.image,
    product.thumbnail,
    ...rawImages,
  ]
    .filter(Boolean)
    .map((image) => {
      if (typeof image === "string") return image;
      return image?.url || image?.src || image?.image || "";
    })
    .map(normalizeImageUrl)
    .filter(Boolean);

  const stockValue = product.inStock ?? product.in_stock ?? false;

  const inStock =
    stockValue === true ||
    stockValue === 1 ||
    stockValue === "1";

  let specifications = product.specifications ?? {};

  if (typeof specifications === "string") {
    try {
      specifications = JSON.parse(specifications);
    } catch {
      specifications = {};
    }
  }

  return {
    ...product,

    // Keep the source in the key to avoid ID collisions between APIs.
    id: product.id,
    _source: source,
    _key: `${source}-${product.id}`,

    title:
      product.title ||
      product.name ||
      product.product_name ||
      "Untitled Product",

    price: Number(product.price) || 0,
    oldPrice: product.oldPrice ?? product.old_price ?? null,
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews ?? product.review_count) || 0,

    category:
      product.category ??
      product.category_name ??
      product.product_category ??
      "",

    brand: product.brand ?? product.brand_name ?? "",

    collection:
      product.collection ??
      product.collection_name ??
      "",

    image: imageCandidates[0] || "",
    images: [...new Set(imageCandidates)],

    inStock,
    in_stock: inStock ? 1 : 0,

    colors: parseArray(product.colors),
    sizes: parseArray(product.sizes),
    features: parseArray(product.features),
    specifications,
  };
};

const matchesCategory = (product, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "All") {
    return true;
  }

  const selected = normalizeText(selectedCategory);
  const category = normalizeText(product.category);

  return (
    category === selected ||
    category.includes(selected) ||
    selected.includes(category)
  );
};

const matchesCollection = (product, selectedCollection) => {
  if (!selectedCollection || selectedCollection === "All") {
    return true;
  }

  const selected = normalizeText(selectedCollection);

  const values = [
    product.collection,
    product.category,
    product.title,
  ]
    .filter(Boolean)
    .map(normalizeText);

  // Match exact names and common longer category labels.
  // Beauty can match "Beauty & Personal Care", for example.
  return values.some(
    (value) =>
      value === selected ||
      value.includes(selected) ||
      selected.includes(value)
  );
};

export default function ProductGrid({
  selectedCategory = "All",
  selectedBrand = "All",
  selectedCollection = "All",
  price = 500000,
  rating = 0,
  inStock = false,
  sort = "featured",
  search = "",
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const [mysqlResponse, onlineResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/online-products`),
        ]);

        if (!mysqlResponse.ok) {
          throw new Error(
            `Database products request failed (${mysqlResponse.status})`
          );
        }

        if (!onlineResponse.ok) {
          throw new Error(
            `Online products request failed (${onlineResponse.status})`
          );
        }

        const [mysqlData, onlineData] = await Promise.all([
          mysqlResponse.json(),
          onlineResponse.json(),
        ]);

        const databaseProducts = Array.isArray(mysqlData)
          ? mysqlData
          : mysqlData.products;

        const sampleProducts = Array.isArray(onlineData)
          ? onlineData
          : onlineData.products;

        if (
          !Array.isArray(databaseProducts) ||
          !Array.isArray(sampleProducts)
        ) {
          throw new Error("The API returned an unexpected product format.");
        }

        const normalizedDatabaseProducts = databaseProducts.map(
          (product) => normalizeProduct(product, "mysql")
        );

        const normalizedSampleProducts = sampleProducts.map(
          (product) => normalizeProduct(product, "online")
        );

        if (!cancelled) {
          // Keep both data sources, as in the original implementation.
          setAllProducts([
            ...normalizedDatabaseProducts,
            ...normalizedSampleProducts,
          ]);
        }
      } catch (err) {
        console.error("Error fetching ShopSpher products:", err);

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load products. Please check the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (selectedCategory && selectedCategory !== "All") {
      products = products.filter((product) =>
        matchesCategory(product, selectedCategory)
      );
    }

    if (selectedBrand && selectedBrand !== "All") {
      const selected = normalizeText(selectedBrand);

      products = products.filter(
        (product) => normalizeText(product.brand) === selected
      );
    }

    if (selectedCollection && selectedCollection !== "All") {
      products = products.filter((product) =>
        matchesCollection(product, selectedCollection)
      );
    }

    products = products.filter(
      (product) => product.price <= Number(price)
    );

    products = products.filter(
      (product) => product.rating >= Number(rating)
    );

    if (inStock) {
      products = products.filter((product) => product.inStock);
    }

    if (search.trim()) {
      const searchTerm = normalizeText(search);

      products = products.filter((product) =>
        [
          product.title,
          product.brand,
          product.category,
          product.collection,
          product.description,
        ]
          .filter(Boolean)
          .some((value) => normalizeText(value).includes(searchTerm))
      );
    }

    switch (sort) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;

      case "newest":
        products.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();

          if (dateA !== dateB) return dateB - dateA;

          return Number(b.id) - Number(a.id);
        });
        break;

      default:
        break;
    }

    return products;
  }, [
    allProducts,
    selectedCategory,
    selectedBrand,
    selectedCollection,
    price,
    rating,
    inStock,
    sort,
    search,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedBrand,
    selectedCollection,
    price,
    rating,
    inStock,
    sort,
    search,
  ]);

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37]" />

        <p className="text-lg text-[#D4AF37]">
          Curating your luxury selection...
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Loading products from ShopSpher
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-[#111111] px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">
          Products could not be loaded
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          {error}
        </p>

        <p className="mt-3 text-sm text-zinc-500">
          Check that your backend is running on port 5001.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-7 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
            ShopSpher Selection
          </p>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            {selectedCollection && selectedCollection !== "All"
              ? selectedCollection
              : selectedCategory && selectedCategory !== "All"
                ? selectedCategory
                : "Explore Luxury Products"}
          </h2>

          <p className="mt-3 text-zinc-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#090909] px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-2xl text-[#D4AF37]">
            ✦
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            No matching products found
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            We couldn't find products matching this selection. Try another
            category or clear your filters.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product._key}
                product={product}
              />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
