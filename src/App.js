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

const center = [-10.4358446, -76.527726];
const outerBounds = [
  [2.505, -100.09],
  [-20.505, 100.09],
] 
//-179.99990,-60.34703,-23.24401,30.98005

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.ADMIN)
}

function App () {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomleft" });
    //map.fitBounds(polygon.getBounds()); // max zoom to see whole polygon
    //map.setMaxBounds(polygon.getBounds()); // restrict map view to polygon bounds
    //map.options.minZoom = map.getZoom();  
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `click on polygon`;
      return div;
    };

    legend.addTo(map);
    const circle = L.circle([3.4358446, -76.527726], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 200
     }).addTo(map);

     circle.bindPopup("testing popup");


     

  }, [map]);



  return (
    <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '550px'}}
    >

      <TileLayer {...tileLayer} />

      <GeoJSON data={geojson} onEachFeature={onEachFeature} />

    </MapContainer>
  )
}

export default App;