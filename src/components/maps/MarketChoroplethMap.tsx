import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { StyleFunction } from 'leaflet';

export interface MarketHeatmapRow {
  area: string;
  avgPricePerSqft: number;
}

interface MarketChoroplethMapProps {
  rows: MarketHeatmapRow[];
}

interface AreaCenter {
  lat: number;
  lng: number;
}

const AREA_CENTERS: Record<string, AreaCenter> = {
  'Palm Jumeirah': { lat: 25.1129, lng: 55.1387 },
  'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
  'Dubai Marina': { lat: 25.0806, lng: 55.1413 },
  'Business Bay': { lat: 25.1861, lng: 55.2644 },
  JVC: { lat: 25.0564, lng: 55.2105 },
  'Arabian Ranches': { lat: 25.0523, lng: 55.2678 },
  'Dubai Hills Estate': { lat: 25.1032, lng: 55.2449 },
};

const squarePolygon = (center: AreaCenter, delta = 0.012): number[][][] => {
  const { lat, lng } = center;
  return [
    [
      [lng - delta, lat - delta],
      [lng + delta, lat - delta],
      [lng + delta, lat + delta],
      [lng - delta, lat + delta],
      [lng - delta, lat - delta],
    ],
  ];
};

const getColor = (pricePerSqft: number): string => {
  if (pricePerSqft >= 3500) return '#7f1d1d';
  if (pricePerSqft >= 2800) return '#b91c1c';
  if (pricePerSqft >= 2200) return '#dc2626';
  if (pricePerSqft >= 1700) return '#f97316';
  return '#facc15';
};

const featureCollectionFromRows = (rows: MarketHeatmapRow[]): FeatureCollection<Polygon> => {
  const features: Feature<Polygon>[] = rows
    .filter(row => AREA_CENTERS[row.area])
    .map(row => {
      const center = AREA_CENTERS[row.area];
      return {
        type: 'Feature',
        properties: {
          area: row.area,
          avgPricePerSqft: row.avgPricePerSqft,
          label: `${row.area}: AED ${row.avgPricePerSqft.toLocaleString()}/sqft`,
        },
        geometry: {
          type: 'Polygon',
          coordinates: squarePolygon(center),
        },
      };
    });

  return {
    type: 'FeatureCollection',
    features,
  };
};

export default function MarketChoroplethMap({ rows }: MarketChoroplethMapProps) {
  const data = useMemo(() => featureCollectionFromRows(rows), [rows]);

  const style: StyleFunction = feature => {
    const avgPricePerSqft = Number(feature?.properties?.avgPricePerSqft ?? 0);
    return {
      fillColor: getColor(avgPricePerSqft),
      weight: 1,
      opacity: 1,
      color: '#111827',
      fillOpacity: 0.68,
    };
  };

  return (
    <div
      className="h-[420px] w-full overflow-hidden rounded-xl border border-gray-700"
      data-testid="market-choropleth-map"
    >
      <MapContainer
        center={[25.1402, 55.2209]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={data}
          style={style}
          onEachFeature={(feature, layer) => {
            const label = feature.properties?.label as string | undefined;
            if (label) layer.bindTooltip(label, { sticky: true });
          }}
        />
      </MapContainer>
    </div>
  );
}
