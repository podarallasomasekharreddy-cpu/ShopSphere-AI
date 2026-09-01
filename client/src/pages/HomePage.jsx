import Hero from "../components/home/Hero";
import TrendingProducts from "../components/home/TrendingProducts";
import Categories from "../components/home/Categories";
import LuxuryExperience from "../components/home/LuxuryExperience";
import PremiumBanner from "../components/home/PremiumBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrendingProducts />
      <Categories />
      <LuxuryExperience />
      <PremiumBanner />
    </>
  );
}