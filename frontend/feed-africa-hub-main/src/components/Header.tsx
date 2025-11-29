// src/components/Header.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios, { AxiosResponse } from 'axios';

// Define TypeScript types for user and API responses
interface User {
  id: number;
  username: string;
  email: string;
}

interface CurrentUserResponse {
  user: User | null;
}

interface LoginResponse {
  message: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

// Configure axios base URL for your Django backend
// Update this if your Django backend runs on a different port
axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Or http://localhost:8000
// Important: Include credentials to allow session cookies to be sent
axios.defaults.withCredentials = true;

const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To handle initial loading state

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response: AxiosResponse<CurrentUserResponse> = await axios.get('/api/auth/user/');
        setCurrentUser(response.data.user);
      } catch (error) {
        // If status is 401, user is not logged in, which is fine
        if (axios.isAxiosError(error) && error.response?.status !== 401) {
          console.error("Error fetching user:", error);
          // Optionally handle other errors (network, server, etc.)
        }
        // Set user to null if not authenticated (status 401 is expected)
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch CSRF token first (this sets the cookie)
    const fetchCSRFToken = async () => {
      try {
        await axios.get('/api/auth/csrf/'); // This call sets the CSRF cookie
        fetchCurrentUser(); // Then fetch the user
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        setLoading(false); // Still set loading to false even if CSRF fails
        setCurrentUser(null); // Assume not logged in
      }
    };

    fetchCSRFToken();
  }, []);

  const handleLogin = async () => {
    // In a real app, you'd have a login form. Here's a simple example with hardcoded values for testing.
    // Replace this with your actual login form logic.
    const username = prompt("Enter username:"); // Use a proper form in production
    const password = prompt("Enter password:"); // Use a proper form in production

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      const response: AxiosResponse<LoginResponse> = await axios.post('/api/auth/login/', {
        username,
        password
      });
      setCurrentUser(response.data.user);
      alert(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Login failed");
      } else {
        console.error("Login error:", error);
        alert("An unexpected error occurred during login.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response: AxiosResponse<LogoutResponse> = await axios.post('/api/auth/logout/');
      setCurrentUser(null);
      alert(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout error:", error.response?.data);
        alert("Logout failed");
      } else {
        console.error("Logout error:", error);
        alert("An unexpected error occurred during logout.");
      }
    }
  };

  if (loading) {
    // Simple loading indicator while fetching user status
    return <header className="bg-background border-b border-border sticky top-0 z-50 p-4">Loading...</header>;
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Mkulima Dairy Feeds</span>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/feed-marketplace" className="text-foreground hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/feed-recommendations" className="text-foreground hover:text-primary transition-colors">Feed Recommendations</Link>
            <Link to="/forecasts" className="text-foreground hover:text-primary transition-colors">Forecasts</Link> {/* NEW: Link to Forecasts */}
            <a href="#regions" className="text-foreground hover:text-primary transition-colors">Regional Plans</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* User Info / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {/* Updated: Username is now a Link to the profile page */}
                <Link to="/profile" className="hidden md:inline text-sm text-foreground">{currentUser.username}</Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleLogin}>
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;