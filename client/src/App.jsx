import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import Footer from "./components/layout/Footer";


export default function App() {
  return (
    <BrowserRouter>
  <ScrollToTop />

  <div className="min-h-screen bg-[#050505]">
    <Navbar />
    <AppRouter />
    <Footer />
  </div>
</BrowserRouter>
  );
}