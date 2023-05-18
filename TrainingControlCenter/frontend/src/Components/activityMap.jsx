import * as React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline } from 'react-leaflet';
import polyline from 'google-polyline';

export default function ActivityMap({ start_latlng, end_latlng, map, height = 40, width = 40 }) {
  const coords = polyline.decode(map.summary_polyline);
  let minX = start_latlng[0];
  let maxX = start_latlng[0];
  let minY = start_latlng[1];
  let maxY = start_latlng[1];
  coords.forEach((loc) => {
    if(loc[0] < minX) minX = loc[0];
    if(loc[0] > maxX) maxX = loc[0];
    if(loc[1] < minY) minY = loc[1];
    if(loc[1] > maxY) maxY = loc[1];
  });

  return (
    <MapContainer bounds={[[minX, minY], [maxX, maxY]]} scrollWheelZoom={true} style={{ height: height, width: width }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={coords} color={'red'} />
    </MapContainer>
  );
}
