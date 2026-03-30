"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker, VISA_COLORS } from "./root-map";
import { getFlagEmoji } from "@/consts/utils";

// Fix default Leaflet icon broken in bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Props {
  markers: MapMarker[];
  userLat: number | null;
  userLon: number | null;
  selectedCountry: string | null;
  onSelect: (countryCode: string) => void;
}

function FlyToSelected({
  selectedCountry,
  markers,
}: {
  selectedCountry: string | null;
  markers: MapMarker[];
}) {
  const map = useMap();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedCountry || selectedCountry === prev.current) return;
    const marker = markers.find((m) => m.countryCode === selectedCountry);
    if (marker) {
      map.flyTo([marker.lat, marker.lon], 5, { duration: 0.8 });
      prev.current = selectedCountry;
    }
  }, [selectedCountry, markers, map]);

  return null;
}

export const RootMapInner = (props: Props) => {
  const { markers, userLat, userLon, selectedCountry, onSelect } = props;
  
  const center: [number, number] =
    userLat !== null && userLon !== null ? [userLat, userLon] : [20, 10];

  return (
    <MapContainer
      center={center}
      zoom={3}
      minZoom={2}
      maxZoom={10}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected selectedCountry={selectedCountry} markers={markers} />

      {/* User location marker */}
      {userLat !== null && userLon !== null && (
        <CircleMarker
          center={[userLat, userLon]}
          radius={9}
          pathOptions={{
            color: "#1e40af",
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <span className="text-sm font-semibold">📍 Your location</span>
          </Popup>
        </CircleMarker>
      )}

      {/* Destination markers */}
      {markers.map((m) => {
        const isSelected = m.countryCode === selectedCountry;
        const color = VISA_COLORS[m.visaStatus];
        const col = m.item.costOfLiving;

        return (
          <CircleMarker
            key={m.countryCode}
            center={[m.lat, m.lon]}
            radius={isSelected ? 12 : 8}
            pathOptions={{
              color: isSelected ? "#1e40af" : color,
              fillColor: color,
              fillOpacity: isSelected ? 1 : 0.75,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onSelect(m.countryCode),
            }}
          >
            <Popup>
              <div className="min-w-[160px] text-sm">
                <div className="font-semibold text-zinc-800 mb-1">
                  {getFlagEmoji(m.countryCode)} {m.countryName}
                </div>
                <div className="flex flex-col gap-0.5 text-xs text-zinc-600">
                  <span>✈ {m.distanceKm.toLocaleString()} km</span>
                  {m.allowedDays ? (
                    <span>🗓 {m.allowedDays} days stay</span>
                  ) : (
                    <span className="text-amber-600">🗓 Unknown stay</span>
                  )}
                  <span>⭐ Score {m.score}</span>
                  {col && (
                    <>
                      <hr className="my-1 border-zinc-200" />
                      <span>💸 ~${col.monthlyBudget}/mo (excl. rent)</span>
                      <span>🏠 ~${col.rent}/mo rent</span>
                      <span>📊 COL index {col.colIndex}</span>
                    </>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};
