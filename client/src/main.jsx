import React from "react";
import ReactDOM from "react-dom/client";

import "./assets/styles/global.css";
import "./assets/styles/responsive.css";

import App from "./App";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
  <WishlistProvider>
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#111111",
            color: "#ffffff",
            border: "1px solid #D4AF37",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#111111",
            },
          },
        }}
      />
      <App />
    </>
  </WishlistProvider>
</CartProvider>
  </React.StrictMode>
);