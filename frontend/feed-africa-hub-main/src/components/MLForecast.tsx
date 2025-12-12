import React, { useEffect, useState } from "react";
import api from "../api";

type Projection = {
  date: string;
  available_kg: number;
  status: string;
};

type RegionForage = {
  region: string;
  current_total_kg: number;
  daily_consumption_kg: number;
  projections: Projection[];
};

type ForageResponse = {
  region: string;
  generated_at: string;
  days: number;
  regions: RegionForage[];
};

const ForageForecasts: React.FC<{ region?: string; days?: number }> = ({ region = "", days = 7 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ForageResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = {};
        if (region) params.region = region;
        if (days) params.days = days;
        const resp = await api.get("/api/forecast/forage/", { params });
        setData(resp.data as ForageResponse);
      } catch (err: any) {
        console.error("Forage forecast fetch error:", err);
        setError("Failed to load forage forecasts.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region, days]);

  if (loading) return <div className="p-4">Loading forage availability…</div>;
  if (error) return <div className="p-4 text-red-700 font-medium">{error}</div>;
  if (!data || !data.regions || data.regions.length === 0) {
    return <div className="p-4 text-gray-700">No forage data available.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Forage Availability Forecast — <span className="font-medium text-gray-700">{data.region}</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.regions.map((r) => (
          <div key={r.region} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-semibold text-gray-900">{r.region}</div>
                <div className="text-sm text-gray-700 mt-1">Current stock: <span className="font-medium text-gray-900">{r.current_total_kg.toLocaleString()} kg</span></div>
                <div className="text-sm text-gray-700 mt-0.5">Estimated daily usage: <span className="font-medium text-gray-900">{r.daily_consumption_kg.toLocaleString()} kg/day</span></div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Projection ({data.days} days)</div>
                <div className="text-xs text-gray-500 mt-1">Generated: <span className="text-gray-700 font-medium">{new Date(data.generated_at).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-gray-700 font-medium">Date</th>
                    <th className="pb-2 text-gray-700 font-medium">Available (kg)</th>
                    <th className="pb-2 text-gray-700 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {r.projections.map(p => (
                    <tr key={p.date} className="border-t">
                      <td className="py-3 text-gray-800">{p.date}</td>
                      <td className="py-3 text-gray-800">{p.available_kg.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          role="status"
                          aria-label={`status-${p.status}`}
                          className={
                            p.status === "sufficient"
                              ? "text-green-700 font-semibold"
                              : p.status === "low"
                              ? "text-yellow-700 font-semibold"
                              : "text-red-700 font-semibold"
                          }
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ForageForecasts;