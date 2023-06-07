import * as React from 'react';
import 'leaflet/dist/leaflet.css';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline 
} from 'react-leaflet';
import polyline from 'google-polyline';
import icon from 'leaflet/dist/images/marker-icon.png';
import icon2 from './images/marker-icon-red.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const BlueIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12.5, 41]
});

const RedIcon = L.icon({
  iconUrl: icon2,
  shadowUrl: iconShadow,
  iconAnchor: [12.5, 43]
})

/**
 * Creates activity map for activity card.
 *
 * @param {number} start_latlng - required parameter for starting latlng
 * @param {number} end_latling - required parameter for ending latlng
 * @param {string} map - map of activity
 * @param {number} [height] - optional parameter of height of map
 * @param {number} [width] - optional parameter of width of map
 * @return {HTMLElement} - returns a react MUI map container for specified activity.
 */
export default function ActivityMap({ start_latlng, end_latlng, map, height = 40, width = 40 }) {
  const coords = polyline.decode(map.summary_polyline);
  const lineColor = localStorage.getItem('activityMapColor') || 'red';
  const hasMarkers = localStorage.getItem('activityMapMarkers') ? localStorage.getItem('activityMapMarkers') === 'true' : true;
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
      { hasMarkers ? <Marker position={start_latlng} icon={BlueIcon} /> : <></> }
      { hasMarkers ? <Marker position={end_latlng} icon={RedIcon} /> : <></> }
      <Polyline positions={coords} color={lineColor} />
    </MapContainer>
  );
}
