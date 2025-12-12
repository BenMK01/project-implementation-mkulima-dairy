import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart, User, LogOut, MessageSquare, X } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api'; // use centralized axios instance

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [aiUnreadCount, setAiUnreadCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/auth/user/');
        // Accept both { user: {...} } and direct user object
        const userData = (res.data && (res.data.user ?? res.data)) as User | null;
        setCurrentUser(userData);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Initialize unread count from localStorage (default 1 to highlight new feature)
  useEffect(() => {
    const raw = localStorage.getItem('ai_unread');
    const n = raw ? parseInt(raw, 10) : 1;
    setAiUnreadCount(Number.isFinite(n) ? n : 0);
  }, []);

  // Clear unread when user navigates to the chat page
  useEffect(() => {
    if (location.pathname === '/ai-feed') {
      localStorage.setItem('ai_unread', '0');
      setAiUnreadCount(0);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/');
    } catch (err) {
      // ignore logout errors
    } finally {
      setCurrentUser(null);
      navigate('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed-marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setIsSearching(false);
  };

  // Close search input and mobile menu when navigating to another page
  useEffect(() => {
    setIsSearching(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) return <header className="bg-background border-b border-border sticky top-0 z-50 p-4">Loading...</header>;

  const markAiSeen = () => {
    localStorage.setItem('ai_unread', '0');
    setAiUnreadCount(0);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <Link to="/" className="text-2xl font-bold text-foreground">Mkulima Dairy Feeds</Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-green-600">Home</Link>
            <Link to="/feed-marketplace" className="text-foreground hover:text-green-600">Marketplace</Link>
            <Link to="/feed-recommendations" className="text-foreground hover:text-green-600">Recommendations</Link>
            <Link to="/forecasts" className="text-foreground hover:text-green-600">Forecasts</Link>

            {/* AI Feed chat link (desktop nav) */}
            <Link
              to="/ai-feed"
              className="text-foreground hover:text-green-600 flex items-center gap-2"
              onClick={markAiSeen}
              title="AI Feed Recommendations"
            >
              <span>AI Feed</span>
              {aiUnreadCount > 0 ? (
                <span className="text-xs bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">New</span>
              ) : (
                <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">AI</span>
              )}
            </Link>
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
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearching(false)}>
                  ✕
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearching(true)} aria-label="Search feeds">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Quick AI chat button (visible on all sizes) */}
            <Link to="/ai-feed" aria-label="AI Feed recommendations" onClick={markAiSeen} title="AI Feed recommendations">
              <Button variant="ghost" size="icon" title="AI Feed recommendations">
                <div className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {aiUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {aiUnreadCount > 9 ? '9+' : aiUnreadCount}
                    </span>
                  )}
                </div>
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label="View cart">
              <Button variant="ghost" size="icon" aria-label="View cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* User */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="hidden md:inline text-sm text-foreground">
                  {currentUser.username}
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login" aria-label="Login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 w-72 max-w-full h-full bg-white z-50 shadow-lg transform transition-transform"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div className="text-lg font-semibold">Menu</div>
              </div>
              <div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <Link to="/" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/feed-marketplace" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
              <Link to="/feed-recommendations" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Recommendations</Link>
              <Link to="/forecasts" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Forecasts</Link>

              {/* AI Feed link inside mobile drawer with badge */}
              <Link
                to="/ai-feed"
                className="flex items-center justify-between w-full text-gray-800 font-medium"
                onClick={() => {
                  markAiSeen();
                  setIsMobileMenuOpen(false);
                }}
              >
                <span>AI Feed</span>
                {aiUnreadCount > 0 ? (
                  <span className="text-xs bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">New</span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">AI</span>
                )}
              </Link>

              <Link to="/cart" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>

              {currentUser ? (
                <>
                  <Link to="/profile" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{currentUser.username}</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;