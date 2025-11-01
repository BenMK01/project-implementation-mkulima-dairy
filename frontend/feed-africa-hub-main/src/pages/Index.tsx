import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeedMarketplace from "@/components/FeedMarketplace";
import FeedRecommendations from "@/components/FeedRecommendations";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeedMarketplace />
      <FeedRecommendations />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
