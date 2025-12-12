import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api"; // your axios instance

interface FeedProduct {
  id: number;
  name: string;
  description?: string;
  feed_type?: string;
  region?: string;
  price_per_kg?: number;
  available_quantity_kg?: number;
  image?: string | null;
  is_available?: boolean;
}

const FeedDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [feed, setFeed] = useState<FeedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No feed id provided.");
      setLoading(false);
      return;
    }

    const fetchFeed = async () => {
      setLoading(true);
      setError(null);

      // Candidate backend URLs (try common patterns)
      const candidates = [
        `/marketplace/api/feeds/${id}/`,
        `/marketplace/api/feeds/${id}`,
        `/api/feeds/${id}/`,
        `/api/feeds/${id}`,
      ];

      let lastErr: any = null;
      for (const url of candidates) {
        try {
          const resp = await api.get(url);
          setFeed(resp.data);
          setLoading(false);
          return;
        } catch (err: any) {
          lastErr = err;
          const status = err?.response?.status;
          if (status && status !== 404) {
            setError(`Failed to load feed (status ${status}).`);
            setLoading(false);
            return;
          }
          // if 404, try next candidate
        }
      }

      const message = lastErr?.response?.data
        ? JSON.stringify(lastErr.response.data)
        : "Feed not found (404) or network error.";
      setError(message);
      setLoading(false);
    };

    fetchFeed();
  }, [id]);

  if (loading) return <div className="p-8">Loading feed details…</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!feed) return <div className="p-8">Feed not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold mb-2">{feed.name}</h1>

      {feed.image ? (
        <img src={feed.image} alt={feed.name} className="w-full max-w-md object-cover rounded mb-4" />
      ) : (
        <div className="w-full max-w-md h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}

      <p className="mt-4">{feed.description}</p>

      <div className="mt-4 space-y-1">
        <p><strong>Type:</strong> {feed.feed_type ?? "—"}</p>
        <p><strong>Region:</strong> {feed.region ?? "—"}</p>
        <p><strong>Price:</strong> KSh {feed.price_per_kg ?? "—"} / kg</p>
        <p><strong>Available:</strong> {feed.available_quantity_kg ?? "—"} kg</p>
        <p><strong>Status:</strong> {feed.is_available ? "Available" : "Unavailable"}</p>
      </div>
    </div>
  );
};

export default FeedDetails;