// src/components/FeedDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from '../api'; // Make sure this points to your configured axios instance

// Define the FeedProduct interface matching your Django model
interface FeedProduct {
  id: number;
  name: string;
  feed_type: string;
  description: string;
  region: string;
  price_per_kg: number;
  available_quantity_kg: number;
  image?: string; // Optional field
  is_available: boolean;
  date_added: string; // ISO format
}

const FeedDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [feed, setFeed] = useState<FeedProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid feed ID.");
      setLoading(false);
      return;
    }

    const fetchFeed = async () => {
      try {
        const response = await api.get<FeedProduct>(`/marketplace/api/feeds/${id}/`);
        setFeed(response.data);
      } catch (err: any) {
        console.error("Error fetching feed details:", err);
        if (err.response?.status === 404) {
          setError("Feed not found.");
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError("Failed to load feed details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Feed Details</h1>
        <Card className="w-full max-w-2xl mx-auto">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-lg">{error}</div>
        <Button className="mt-4" onClick={() => navigate('/feed-marketplace')}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/feed-marketplace')} className="mb-6">
        ← Back to Marketplace
      </Button>
      <Card className="w-full max-w-2xl mx-auto">
        {feed.image ? (
          <img
            src={feed.image.startsWith('http') ? feed.image : `http://127.0.0.1:8000${feed.image}`}
            alt={feed.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{feed.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{feed.description}</p>
          <div className="space-y-2 text-sm">
            <div><strong>Type:</strong> {feed.feed_type}</div>
            <div><strong>Region:</strong> {feed.region}</div>
            <div><strong>Price:</strong> KSh {feed.price_per_kg} per kg</div>
            <div><strong>Available Quantity:</strong> {feed.available_quantity_kg} kg</div>
            <div><strong>Status:</strong> 
              <Badge variant={feed.is_available ? "default" : "secondary"} className="ml-2">
                {feed.is_available ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            <div><strong>Added:</strong> {new Date(feed.date_added).toLocaleDateString()}</div>
          </div>
          <Button className="w-full mt-6">Add to Cart</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedDetails;