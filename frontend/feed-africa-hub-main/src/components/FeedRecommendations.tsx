// src/components/FeedRecommendations.tsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the configured axios instance
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the FeedProduct interface (nested within Recommendation)
interface FeedProduct {
  id: number;
  name: string;
  feed_type: string;
  description: string;
  region: string;
  price_per_kg: number;
  available_quantity_kg: number;
  image?: string; // Optional
  is_available: boolean;
  date_added: string; // ISO string format
}

// Define the Recommendation interface based on your backend model and serializer
interface Recommendation {
  id: number;
  feed_product_details: FeedProduct; // Nested details of the FeedProduct
  breed: string; // Cow breed
  region: string; // Region
  reason?: string; // Optional reason for recommendation
  created_at: string; // ISO string format
}

// Define filter options (match your backend choices)
const BREEDS = [
  'Friesian', 'Ayrshire', 'Jersey', 'Guernsey', 'Brown Swiss', 'Holstein', 'Other'
];

const REGIONS = [
  'Central', 'Rift Valley', 'Eastern', 'Nairobi', 'Western', 'Coast', 'Nyanza', 'North Eastern'
];

const FeedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [filters, setFilters] = useState({
    breed: '',
    region: '',
  });

  // Fetch recommendations based on current filters
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params: Record<string, string> = {};
      if (filters.breed) params.breed = filters.breed;
      if (filters.region) params.region = filters.region;

      const response = await api.get('/api/recommendations/', { params });
      setRecommendations(response.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations whenever filters change
  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  // Handle filter changes
  const handleBreedChange = (value: string) => {
    if (value === "all") {
      setFilters(prev => ({ ...prev, breed: '' }));
    } else {
      setFilters(prev => ({ ...prev, breed: value }));
    }
  };

  const handleRegionChange = (value: string) => {
    if (value === "all") {
      setFilters(prev => ({ ...prev, region: '' }));
    } else {
      setFilters(prev => ({ ...prev, region: value }));
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      breed: '',
      region: '',
    });
  };

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Updated main heading */}
      <h1 className="text-3xl font-bold text-foreground mb-6">Feed Recommendations</h1>
      {/* Optional subtitle */}
      <p className="text-sm text-muted-foreground mb-6">Tailored suggestions based on breed and region.</p>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-muted/20 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filter Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="breed-filter">Breed</Label>
            <Select value={filters.breed || "all"} onValueChange={handleBreedChange}>
              <SelectTrigger id="breed-filter">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                {BREEDS.map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="flex items-end">
            <Button variant="outline" onClick={handleResetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        // Show skeleton loaders while data is loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
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
        // Display the recommendations
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="w-full flex flex-col">
              {/* Recommendation-specific header */}
              <CardHeader className="bg-muted/30 pb-3"> {/* Light background to distinguish */}
                <div className="flex justify-between items-start">
                  <div>
                    {/* Feed product name */}
                    <CardTitle className="text-lg">{rec.feed_product_details.name}</CardTitle>
                    {/* Recommendation context: breed and region */}
                    <p className="text-xs text-muted-foreground mt-1">For <span className="font-semibold">{rec.breed}</span> in <span className="font-semibold">{rec.region}</span></p>
                  </div>
                  {/* Visual indicator for recommendation */}
                  <Badge variant="outline" className="text-xs">Recommended</Badge>
                </div>
                {/* Reason for recommendation (if available) */}
                {rec.reason && (
                  <p className="text-xs text-muted-foreground mt-2 italic">"{rec.reason}"</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col"> {/* Ensure content fills card height */}
                {/* Display image from the linked FeedProduct details */}
                {rec.feed_product_details.image ? (
                  <img
                    src={rec.feed_product_details.image} // Assuming the backend returns the full URL
                    alt={rec.feed_product_details.name}
                    className="w-full h-32 object-cover rounded-lg mt-2" // Reduced height
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mt-2">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                {/* General feed product description */}
                <p className="text-sm text-muted-foreground mt-3 flex-grow">{rec.feed_product_details.description}</p>
                {/* Feed product availability and price */}
                <div className="flex justify-between items-center mt-2">
                  <Badge variant={rec.feed_product_details.is_available ? "default" : "secondary"}>
                    {rec.feed_product_details.is_available ? "Available" : "Unavailable"}
                  </Badge>
                  <span className="font-semibold text-sm">KSh {rec.feed_product_details.price_per_kg} / kg</span>
                </div>
                {/* Feed product type and quantity */}
                <p className="text-xs text-gray-500 mt-1">Type: {rec.feed_product_details.feed_type}</p>
                <p className="text-xs text-gray-500">Available Qty: {rec.feed_product_details.available_quantity_kg} kg</p>
                {/* Link to view details for the specific feed product */}
                <Link to={`/feed/${rec.feed_product_details.id}`} className="w-full mt-4">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedRecommendations;