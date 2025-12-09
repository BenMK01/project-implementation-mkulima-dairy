// src/components/FeedDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from '../api';

interface FeedProduct {
  id: number;
  name: string;
  feed_type: string;
  description: string;
  region: string;
  price_per_kg: number | string;
  available_quantity_kg: number;
  image?: string;
  is_available: boolean;
  date_added: string;
}

const FeedDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [feed, setFeed] = useState<FeedProduct | null>(null);
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching feed:", err);
        if (err.response?.status === 404) {
          setError("Feed not found.");
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError("Failed to load feed.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [id, navigate]);

  const getImageUrl = (path?: string): string => {
    if (!path) return '';
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/feed-marketplace')} className="mb-6">
          ← Back to Marketplace
        </Button>
        <Card className="max-w-2xl mx-auto">
          <Skeleton className="h-64 w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-10 w-full mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Button onClick={() => navigate('/feed-marketplace')} className="mb-6">
          ← Back to Marketplace
        </Button>
        <h2 className="text-2xl text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/feed-marketplace')} className="mb-6">
        ← Back to Marketplace
      </Button>
      <Card className="max-w-2xl mx-auto">
        {feed.image ? (
          <img
            src={getImageUrl(feed.image)}
            alt={feed.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
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
            <div><strong>Price:</strong> KSh {Number(feed.price_per_kg).toFixed(2)} per kg</div>
            <div><strong>Available:</strong> {feed.available_quantity_kg} kg</div>
            <div><strong>Status:</strong> 
              <Badge variant={feed.is_available ? "default" : "secondary"}>
                {feed.is_available ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>
          <Button className="w-full mt-6">Add to Cart</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedDetails;