
import { BrowserRouter, useLocation } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import Footer from "./components/layout/Footer";

function AppLayout() {
  const location = useLocation();

  // Hide the shared footer on every admin page.
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#050505]">
      <ScrollToTop />

      <Navbar />

      <AppRouter />

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
