import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,Marker,Popup,
  useMap,
} from 'react-leaflet'
import L from 'leaflet';
import geojson from './data/admin0.geojson.json'
import tileLayer from './util/tileLayer';
import './App.css'
import 'leaflet/dist/leaflet.css';

const center = [3.4358446, -76.527726];

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.nazwa)
}

function App () {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `click on polygon`;
      return div;
    };

    legend.addTo(map);

  }, [map]);



  return (
    <MapContainer
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
    >

      <TileLayer {...tileLayer} />

      <GeoJSON data={geojson} onEachFeature={onEachFeature} />

    </MapContainer>
  )
}

export default App;