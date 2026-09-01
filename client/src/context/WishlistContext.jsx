import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
 const [wishlistItems, setWishlistItems] = useState(() => {
  const savedWishlist = localStorage.getItem("shopspher-wishlist");

  return savedWishlist ? JSON.parse(savedWishlist) : [];
});
useEffect(() => {
  localStorage.setItem(
    "shopspher-wishlist",
    JSON.stringify(wishlistItems)
  );
}, [wishlistItems]);
  const addToWishlist = (item) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}