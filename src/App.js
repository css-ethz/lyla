import { useEffect, useState , useRef} from 'react';
import "@progress/kendo-theme-default/dist/all.css";
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
//import { EventDropDownList } from './components/DropDownList';
import Dropdown from 'react-bootstrap/Dropdown';

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


  }, [map]);



  return (
    <div className="App">
      <h4>LYLA Dashboard</h4>
      <Dropdown>
        <Dropdown.Toggle variant="success">
          Wrongdoing Type
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item  href="#/action-1">
            0
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-2">
            1
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-3">
            2
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle variant="success">
          Sex of Target
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item  href="#/tar_sex_m">
            Male
          </Dropdown.Item>
          <Dropdown.Item  href="#/tar_sex_f">
            Female
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle variant="success">
          pe_violence
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item  href="#/action-1">
            0
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-2">
            1
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-3">
            2
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-3">
            3
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
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
    </div>
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
    geoJsonRef.current?.resetStyle(e.target);
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