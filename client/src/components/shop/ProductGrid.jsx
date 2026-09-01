import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const PRODUCTS_PER_PAGE = 7;

export default function ProductGrid({
  selectedCategory,
  selectedBrand,
  selectedCollection,
  price,
  rating,
  inStock,
  sort,
  search,
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products from MySQL through Express API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      products = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== "All") {
      products = products.filter(
        (product) => product.brand === selectedBrand
      );
    }

    // Collection filter
    if (
      selectedCollection &&
      selectedCollection !== "All"
    ) {
      products = products.filter(
        (product) =>
          product.collection === selectedCollection
      );
    }

    // Price filter
    products = products.filter(
      (product) => Number(product.price) <= Number(price)
    );

    // Rating filter
    products = products.filter(
      (product) => Number(product.rating) >= Number(rating)
    );

    // Stock filter
    if (inStock) {
      products = products.filter(
        (product) => product.in_stock === 1
      );
    }

    // Search filter
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase().trim();

      products = products.filter((product) =>
        [
          product.title,
          product.brand,
          product.category,
          product.collection,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Sorting
    switch (sort) {
      case "price-low":
        products.sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
        break;

      case "price-high":
        products.sort(
          (a, b) => Number(b.price) - Number(a.price)
        );
        break;

      case "rating":
        products.sort(
          (a, b) =>
            Number(b.rating) - Number(a.rating)
        );
        break;

      case "newest":
        products.sort(
          (a, b) => Number(b.id) - Number(a.id)
        );
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

  // Reset pagination whenever filters change
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

  // Loading state
  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-[#D4AF37]">
          Loading luxury products...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-[#111111] py-24 text-center">
        <h2 className="text-3xl font-bold text-white">
          Something went wrong
        </h2>

        <p className="mt-4 text-zinc-500">
          {error}
        </p>

        <p className="mt-2 text-sm text-zinc-600">
          Make sure the ShopSpher backend is running on port 5001.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-14 flex items-end justify-between">
        <div>
          <p className="mb-4 uppercase tracking-[0.35em] text-[#D4AF37]">
            Premium Collection
          </p>

          <h2 className="text-5xl font-black text-white">
            Explore Luxury Products
          </h2>

          <p className="mt-5 text-zinc-400">
            {filteredProducts.length} Products Found
          </p>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#111111] py-24 text-center">
          <h2 className="text-3xl font-bold text-white">
            No Products Found
          </h2>

          <p className="mt-4 text-zinc-500">
            Try changing your filters.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </motion.div>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}