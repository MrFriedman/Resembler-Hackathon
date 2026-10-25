"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { MapPoint } from "@/lib/demo-data";

type AccidentMapProps = {
  points: MapPoint[];
};

export default function AccidentMap({ points }: AccidentMapProps) {
  const first = points[0];
  const center: [number, number] = first ? [first.lat, first.lng] : [-33.95, 18.47];

  return (
    <MapContainer center={center} zoom={11} style={{ height: "480px", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={point.kind === "close_call" ? 8 : 11}
          pathOptions={{
            color: point.kind === "close_call" ? "#fbbf24" : "#22d3ee",
            fillColor: point.kind === "close_call" ? "#f59e0b" : "#06b6d4",
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{point.label}</strong>
            <br />
            {point.detail}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
