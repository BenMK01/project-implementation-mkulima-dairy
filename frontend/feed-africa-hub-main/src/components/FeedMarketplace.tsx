// frontend/src/components/FeedMarketplace.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addToCart } from '@/lib/cart';

interface FeedProduct {
  id: number;
  name: string;
  feed_type: string;
  description: string;
  region: string;
  price_per_kg: number;
  available_quantity_kg: number;
  image?: string;
  is_available: boolean;
  date_added: string;
  supplier?: any; // object {id, name} or supplier id
}

interface Supplier {
  id: number;
  name: string;
}

const FEED_TYPES = ['Dairy Meal', 'Calf Feed', 'Hay', 'Silage', 'Mineral Mix', 'Other'];
const REGIONS = ['Central', 'Rift Valley', 'Eastern', 'Nairobi', 'Western', 'Coast', 'Nyanza', 'North Eastern'];
const CART_KEY = "cart";

const FeedMarketplace: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = (new URLSearchParams(location.search).get('search') || '').trim().toLowerCase();
    setSearchQuery(q);
  }, [location.search]);

  const [filters, setFilters] = useState({
    region: '',
    feed_type: '',
    is_available: true,
  });

  // Fetch suppliers for the filter dropdown
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get('/api/suppliers/');
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setSuppliers(data);
      } catch (err) {
        console.warn("Failed to fetch suppliers", err);
      }
    };
    fetchSuppliers();
  }, []);

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | boolean> = {};
      if (filters.region) params.region = filters.region;
      if (filters.feed_type) params.feed_type = filters.feed_type;
      if (filters.is_available === false) params.is_available = false;
      if (selectedSupplier) params.supplier_id = selectedSupplier;

      const response = await api.get('/marketplace/api/feeds/', { params });
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setFeeds(data);
    } catch (err) {
      console.error("Error fetching feeds:", err);
      setError("Failed to load feeds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedSupplier]);

  const filteredFeeds = React.useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    if (!q) return feeds;
    return feeds.filter(feed =>
      (feed.name || '').toLowerCase().includes(q) ||
      (feed.description || '').toLowerCase().includes(q) ||
      (feed.feed_type || '').toLowerCase().includes(q) ||
      (feed.region || '').toLowerCase().includes(q)
    );
  }, [feeds, searchQuery]);

  const handleRegionChange = (value: string) => {
    setFilters(prev => ({ ...prev, region: value === "all" ? '' : value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, feed_type: value === "all" ? '' : value }));
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, is_available: checked }));
  };

  const handleResetFilters = () => {
    setFilters({ region: '', feed_type: '', is_available: true });
    setSelectedSupplier('');
    setSearchParams({});
  };

  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000${imagePath}`;
  };

  const getSupplierName = (feed: FeedProduct) => {
    if (!feed.supplier) return null;
    if (typeof feed.supplier === 'object') return feed.supplier.name;
    return String(feed.supplier);
  };

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Feed Marketplace {searchQuery && `- Search: "${searchQuery}"`}
      </h1>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-muted/20 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filter Feeds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region-filter">Region</Label>
            <Select value={filters.region || "all"} onValueChange={handleRegionChange}>
              <SelectTrigger id="region-filter">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {REGIONS.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-filter">Feed Type</Label>
            <Select value={filters.feed_type || "all"} onValueChange={handleTypeChange}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {FEED_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-filter">Supplier</Label>
            <Select value={selectedSupplier || "all"} onValueChange={(v: string) => setSelectedSupplier(v === 'all' ? '' : v)}>
              <SelectTrigger id="supplier-filter">
                <SelectValue placeholder="All suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="availability-filter"
              checked={filters.is_available}
              onCheckedChange={(checked) => handleAvailabilityChange(checked as boolean)}
            />
            <Label htmlFor="availability-filter">Show only available</Label>
            <div className="flex-1 text-right">
              <Button variant="outline" onClick={handleResetFilters} className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="w-full">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-5/6 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No feeds match your search or filters.
            </div>
          ) : (
            filteredFeeds.map((feed) => (
              <Card key={feed.id} className="w-full flex flex-col">
                {feed.image ? (
                  <img
                    src={getImageUrl(feed.image)}
                    alt={feed.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => (e.currentTarget.src = '')}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{feed.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{feed.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={feed.is_available ? "default" : "secondary"}>
                      {feed.is_available ? "Available" : "Unavailable"}
                    </Badge>
                    <span className="font-semibold">KSh {feed.price_per_kg} / kg</span>
                  </div>
                  <p className="text-xs text-gray-500">Type: {feed.feed_type}</p>
                  <p className="text-xs text-gray-500">Region: {feed.region}</p>
                  <p className="text-xs text-gray-500">Available Qty: {feed.available_quantity_kg} kg</p>
                  {getSupplierName(feed) && (
                    <p className="text-xs text-gray-700 mt-2">
                      Supplier: {' '}
                      <Link to={`/supplier/${typeof feed.supplier === 'object' ? feed.supplier.id : feed.supplier}`} className="text-primary hover:underline">
                        {getSupplierName(feed)}
                      </Link>
                    </p>
                  )}
                </CardContent>
                <div className="px-4 pb-4 flex space-x-2">
                  <Link to={`/feed/${feed.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <Button className="w-full" onClick={() => {
                    const ok = addToCart({ id: feed.id, name: feed.name, price_per_kg: feed.price_per_kg, quantity: 1 });
                    if (ok) alert('Added to cart');
                    else alert('Failed to add to cart');
                  }}>
                    Add
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeedMarketplace;