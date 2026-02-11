import Hero from "@/components/landing-page/Hero";
import FeaturedCategories from "@/components/landing-page/FeaturedCategories";
import ProductList from "@/components/landing-page/ProductList";
import MerchantCTA from "@/components/landing-page/Merchantcta";
import HowItWorks from "@/components/landing-page/Howitworks";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <ProductList />
      <MerchantCTA />
      <HowItWorks />
    </>
  );
}
