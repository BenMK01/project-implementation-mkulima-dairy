// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api'; // <-- use the centralized axios instance

interface User {
  id: number;
  username: string;
  email: string;
}

const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/user/');
        // Support backends that return either { user: {...} } or the user object directly
        const userData = (res.data && (res.data.user ?? res.data)) as User;
        setCurrentUser(userData);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/');
    } catch (err) {
      // ignore errors on logout
    } finally {
      setCurrentUser(null);
      // use navigate to stay within SPA routing
      navigate('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed-marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsSearching(false);
  };

  // Close search input when navigating to another page
  useEffect(() => {
    setIsSearching(false);
    setSearchQuery('');
  }, [location.pathname]);

  if (loading) return <header className="bg-background border-b border-border sticky top-0 z-50 p-4">Loading...</header>;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Mkulima Dairy Feeds</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-green-600">Home</Link>
            <Link to="/feed-marketplace" className="text-foreground hover:text-green-600">Marketplace</Link>
            <Link to="/feed-recommendations" className="text-foreground hover:text-green-600">Recommendations</Link>
            <Link to="/forecasts" className="text-foreground hover:text-green-600">Forecasts</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search */}
            {isSearching ? (
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search feeds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearching(false)}>
                  ✕
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearching(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* User */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="hidden md:inline text-sm text-foreground">
                  {currentUser.username}
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon">
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
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