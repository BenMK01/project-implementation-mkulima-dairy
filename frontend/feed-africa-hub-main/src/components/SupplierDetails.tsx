import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Supplier {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  region?: string;
  email?: string;
  phone_number?: string;
  website?: string;
}

const SupplierDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid supplier id');
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/suppliers/${id}/`);
        setSupplier(res.data);
      } catch (err) {
        console.error('Error fetching supplier', err);
        setError('Failed to load supplier');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  if (!supplier) return <div className="container mx-auto px-4 py-8">Supplier not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{supplier.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{supplier.region}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{supplier.description}</p>
          <div className="space-y-2">
            {supplier.email && <div><strong>Email:</strong> <a href={`mailto:${supplier.email}`}>{supplier.email}</a></div>}
            {supplier.phone_number && <div><strong>Phone:</strong> <a href={`tel:${supplier.phone_number}`}>{supplier.phone_number}</a></div>}
            {supplier.website && <div><strong>Website:</strong> <a href={supplier.website} target="_blank" rel="noopener noreferrer">{supplier.website}</a></div>}
          </div>

          <div className="mt-6">
            <Link to="/feed-marketplace">
              <Button variant="outline">Back to Marketplace</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDetails;