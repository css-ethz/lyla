import { useEffect, useState , useRef} from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,Marker,Popup,
  useMap, Circle
} from 'react-leaflet'
import L from 'leaflet';
import {Icon} from 'leaflet';
import geojson from './data/admin0.geojson.json'
import eventData from './data/events.json'
import tileLayer from './util/tileLayer';
import './App.css'
import 'leaflet/dist/leaflet.css';

const center = [-10.4358446, -76.527726];
const outerBounds = [
  [2.505, -100.09],
  [-20.505, 100.09],
] 
//-179.99990,-60.34703,-23.24401,30.98005

//function onEachFeature(feature, layer) {
//  layer.bindPopup(feature.properties.ADMIN)
//}

function style(feature) {
  return {
      fillColor: `#a9a9a9`,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '2',
      fillOpacity: 0.7
  };
}




function App () {
  const [map, setMap] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  
  
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

    geoj = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
     

  }, [map]);



  return (
    <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
    >
      {eventData.features.map(evt => (
        //<Marker
          //key={evt.properties.id}
          //position={[
            //evt.geometry.coordinates[0],
            //evt.geometry.coordinates[1]
          //]}
          //onClick={() => {
            //setActiveEvent(evt);
          //}}
          
          //icon={icon}
        //>
          <Circle 
                  center={{lat:evt.geometry.coordinates[0], lng: evt.geometry.coordinates[1]}}
                  fillColor="green" 
                  radius={200000}
                  pathOptions={{
                    color: "green"
                  }}
                  onClick={() => {
                    setActiveEvent(evt);
                  }}/>
        
        //</Marker>
        
      ))}
      {activeEvent && (
    <Popup
      position={[
        activeEvent.geometry.coordinates[0],
        activeEvent.geometry.coordinates[1]
      ]}
      onClose={() => {
        setActiveEvent(null);
      }}
    >
      <div>
        <h2>{activeEvent.properties.evidence1_text}</h2>
        <p>{activeEvent.properties.date}</p>
      </div>
    </Popup>
  )}


      <TileLayer {...tileLayer} />

     
      
      <MapContent />
    </MapContainer>
  )
}



const MapContent = () => {
  //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
  const geoJsonRef = useRef(null);
  const map = useMap();

  //const highlightFeature = (e: Leaflet.LeafletMouseEvent) => {
  const highlightFeature = (e) => {
    const layer = e.target;

    layer.setStyle({
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
      weight: 5,
    });
  };

  const resetHighlight = (e) => {
    geoJson.current?.resetStyle(e.target);
  };

  const zoomToFeature = (e) => {
    map.fitBounds(e.target.getBounds());
  };

  return (
            <GeoJSON
              data={geojson}
              //key='latam-countries'
              ref={geoJsonRef}
              style={() => {
                return {
                  color: 'white',
                  dashArray: '3',
                  fillColor: '#f0f0f0',
                  fillOpacity: 0.7,
                  opacity: 1,
                  weight: 2,
                };
              }}
              onEachFeature={(__, layer) => {
                layer.on({
                  click: (e) => {
                    zoomToFeature(e);
                  },
                  mouseout: (e) => {
                    resetHighlight(e);
                  },
                  mouseover: (e) => {
                    highlightFeature(e);
                  },
                });
              }}
            />
  );
};

export default App;