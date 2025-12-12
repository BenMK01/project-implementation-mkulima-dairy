import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

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

const SuppliersList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/suppliers/');
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setSuppliers(data);
      } catch (err) {
        console.error("Error loading suppliers", err);
        setError("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><Skeleton className="h-36 w-full" /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Suppliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(s => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader className="p-4">
              <CardTitle>{s.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{s.region}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{s.description || 'No description'}</p>
            </CardContent>
            <div className="p-4">
              <Link to={`/supplier/${s.id}`}>
                <Button className="w-full">View Supplier</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuppliersList;