"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchMapPoints } from "@/lib/api";
import type { MapPoint } from "@/lib/demo-data";

const AccidentMap = dynamic(() => import("@/components/features/AccidentMap"), {
  ssr: false,
  loading: () => <div className="h-[480px] rounded-xl bg-gray-800" />,
});

export default function MapPage() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapPoints()
      .then(setPoints)
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : "The map data could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-cyan-400">Local accident map</h1>
        <p className="mb-4 text-gray-300">
          Cyan markers are incidents. Amber markers are close calls. Points are sample data around Cape Town.
        </p>
        <div className="mb-4 flex gap-4 text-sm text-gray-300">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-cyan-400" /> Incidents
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-400" /> Close calls
          </span>
        </div>
        {error && <p className="mb-4 text-red-400">{error}</p>}
        {loading ? (
          <div className="h-[480px] rounded-xl bg-gray-800" />
        ) : points.length > 0 ? (
          <div className="overflow-hidden rounded-xl">
            <AccidentMap points={points} />
          </div>
        ) : (
          <p className="text-gray-400">No map points are available.</p>
        )}
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li id={`point-${point.id}`} key={point.id} className="rounded-xl bg-gray-800 px-4 py-3">
              <p className="font-semibold text-white">{point.label}</p>
              <p className="text-sm text-gray-400">
                {point.kind === "close_call" ? "Close call" : "Incident"} · {point.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
