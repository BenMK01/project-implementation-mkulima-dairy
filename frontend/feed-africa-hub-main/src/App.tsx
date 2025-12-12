import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import FeedMarketplace from "./components/FeedMarketplace";
import FeedDetails from "./components/FeedDetails";
import FeedRecommendations from "./components/FeedRecommendations";
import MLForecast from "./components/MLForecast";
import NotFound from "./pages/NotFound";
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import Cart from "./components/Cart"; // <-- added import
import AIRecommendationsChat from "@/components/AIRecommendationsChat";

const queryClient = new QueryClient();

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/feed-marketplace" element={<MainLayout><FeedMarketplace /></MainLayout>} />
          <Route path="/feed/:id" element={<MainLayout><FeedDetails /></MainLayout>} />
          <Route path="/feed-recommendations" element={<MainLayout><FeedRecommendations /></MainLayout>} />
          <Route path="/forecasts" element={<MainLayout><MLForecast /></MainLayout>} />

          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} /> {/* <-- cart route */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />

          {/* AI chat route — placed before the wildcard so it's reachable */}
          <Route path="/ai-feed" element={<MainLayout><AIRecommendationsChat /></MainLayout>} />

          {/* Catch-all must remain last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;