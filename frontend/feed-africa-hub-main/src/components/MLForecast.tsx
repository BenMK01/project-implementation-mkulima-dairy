// src/components/MLForecast.tsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the configured axios instance
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define the Forecast interface based on your backend model
interface Forecast {
  id: number;
  location: string;
  crop_type: string;
  predicted_availability: number; // e.g., 0.85
  prediction_date: string; // ISO string format
  confidence_level: number; // e.g., 0.9
  created_at: string; // ISO string format
}

const MLForecast: React.FC = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        // Fetch all forecasts or filter by location if needed: /api/forecast/?location=Nyeri%20County
        const response = await api.get('/api/forecast/');
        setForecasts(response.data);
      } catch (err) {
        console.error("Error fetching forecasts:", err);
        setError("Failed to load forecast data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Forage Availability Forecasts</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Machine learning predictions for feed availability based on location and seasonal trends.
      </p>

      {loading ? (
        // Skeleton loader for the table
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Location</TableHead>
                <TableHead>Crop Type</TableHead>
                <TableHead>Prediction Date</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md">
          {forecasts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No forecast data available.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Location</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Prediction Date</TableHead>
                  <TableHead>Availability Score</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecasts.map((forecast) => (
                  <TableRow key={forecast.id}>
                    <TableCell className="font-medium">{forecast.location}</TableCell>
                    <TableCell>{forecast.crop_type}</TableCell>
                    <TableCell>{new Date(forecast.prediction_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${forecast.predicted_availability * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {(forecast.predicted_availability * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${forecast.confidence_level * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {(forecast.confidence_level * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default MLForecast;