// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import FeedMarketplace from "./components/FeedMarketplace";
import FeedDetails from "./components/FeedDetails";
import FeedRecommendations from "./components/FeedRecommendations";
import MLForecast from "./components/MLForecast"; // Import the new MLForecast component
import NotFound from "./pages/NotFound";
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";


const queryClient = new QueryClient();

// Layout component to wrap routes that need Header and Footer
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
          {/* Route for the main page (Index) */}
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          {/* Route for the feed marketplace */}
          <Route path="/feed-marketplace" element={<MainLayout><FeedMarketplace /></MainLayout>} />
          {/* Route for feed details, expects an 'id' parameter */}
          <Route path="/feed/:id" element={<MainLayout><FeedDetails /></MainLayout>} />
          {/* Route for feed recommendations */}
          <Route path="/feed-recommendations" element={<MainLayout><FeedRecommendations /></MainLayout>} />
          {/* NEW: Route for ML Forecasts */}
          <Route path="/forecasts" element={<MainLayout><MLForecast /></MainLayout>} />
          {/* Redirect any unmatched route to Index */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;