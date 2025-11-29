// src/components/FeedMarketplace.tsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the configured axios instance
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

// Define the FeedProduct interface based on your backend model
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
}

// Define filter options (match your backend choices)
const FEED_TYPES = [
  'Dairy Meal', 'Calf Feed', 'Hay', 'Silage', 'Mineral Mix', 'Other'
];

const REGIONS = [
  'Central', 'Rift Valley', 'Eastern', 'Nairobi', 'Western', 'Coast', 'Nyanza', 'North Eastern'
];

const FeedMarketplace: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [filters, setFilters] = useState({
    region: '',
    feed_type: '',
    is_available: true, // Default to showing only available feeds
  });

  // Fetch feeds based on current filters
  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params: Record<string, string | boolean> = {};
      if (filters.region) params.region = filters.region;
      if (filters.feed_type) params.feed_type = filters.feed_type;
      // Only add is_available if it's false
      if (filters.is_available === false) params.is_available = false;

      const response = await api.get('/marketplace/api/feeds/', { params });
      setFeeds(response.data);
    } catch (err) {
      console.error("Error fetching feeds:", err);
      setError("Failed to load feeds. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feeds whenever filters change
  useEffect(() => {
    fetchFeeds();
  }, [filters]);

  // Handle filter changes
  const handleRegionChange = (value: string) => {
    setFilters(prev => ({ ...prev, region: value === "all" ? '' : value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, feed_type: value === "all" ? '' : value }));
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, is_available: checked }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      region: '',
      feed_type: '',
      is_available: true,
    });
  };

  // Helper to resolve full image URL
  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000${imagePath}`;
  };

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Feed Marketplace</h1>

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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="availability-filter"
              checked={filters.is_available}
              onCheckedChange={(checked) => handleAvailabilityChange(checked as boolean)}
            />
            <Label htmlFor="availability-filter">Show only available</Label>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleResetFilters} className="w-full">
              Reset Filters
            </Button>
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
          {feeds.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No feed products match the current filters.
            </div>
          ) : (
            feeds.map((feed) => (
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
                </CardContent>
                <div className="px-4 pb-4">
                  <Link to={`/feed/${feed.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
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