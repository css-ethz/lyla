import { useEffect, useState , useMemo, useRef} from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container } from 'react-bootstrap';
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
import 'bootstrap/dist/css/bootstrap.css';

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
  const [filteredData, setFilteredData] = useState(eventData);
  const [wrongdoing, setWrongdoing] = useState("all");
  const [tarSex, setTarSex] = useState(0);
  const [peViolence, setPeViolence] = useState("all");
  //console.log("variables outside use effect hook: tarSex:");
  //console.log(tarSex);
  //console.log("variables outside use effect hook: filtered data:");
  //console.log(filteredData);


  /* const handleTarChange = (e)=>{
    const value = e.target.value;
    setTarSex({
      [e.target.name]: value
    });
  }
 */
  function onFilterSexSelected(filterValue){
    setTarSex(filterValue);
  }
  const handleTarSex=(event)=>{
    const gettarsex= event.target.value;
    setTarSex(gettarsex);
    console.log(tarSex);
    event.preventDefault();
  }

  const handleWrongdoing = (event)=>{
    const getwrongdoing=event.target.value;
    setWrongdoing(getwrongdoing);
    console.log(wrongdoing);
    event.preventDefault();
  }

  /* const testVariables = () => {
    console.log(tarSex);
    console.log(filteredData);
  } */
  // let evData = [...eventData];

  /* const filterWrongdoing = useMemo((data) => {
    if (!wrongdoing || wrongdoing === "all") return data;
    
    return data.filter(item => item.properties.tar_wrongdoing === wrongdoing);

}, [wrongdoing]);
 */
  /* const filterSex = useMemo((data) => {
    if (!tarSex || tarSex === "all") return data;
    console.log("tar_sex is")
    data.map(item => console.log(item.properties.tar_sex))
    
    return data.filter(item => item.properties.tar_sex === tarSex);

  }, [tarSex]); */

 const filteredSexData = filteredData.features.filter((item) => {
        if (tarSex === 0){
          console.log('it is 0');
          return item.properties.tar1_sex === 0;
        } else if (tarSex === 1) {
          console.log('it is 1');
          return item.properties.tar1_sex === 1;
        } else {
          console.log('no filter');
          return item;
        }
      })
  

 /*  const filterPeViolence = useMemo((data) => {
    if (!peViolence || peViolence === "all") return data;
    
    return data.filter(item => item.properties.pe_violence === peViolence);

  }, [peViolence]);
   */

  useEffect(() => {
    //console.log(evData);
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
 
   /*  legend.addTo(map);
    const circle = L.circle([3.4358446, -76.527726], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 200
     }).addTo(map);

     circle.bindPopup("testing popup"); */

     /*  if (!tarSex || tarSex === 8){ setFilteredData(eventData);
      console.log("tar_sex is");
      console.log(tarSex);
      }
      else {
        console.log("filtered tar_sex");
        setFilteredData(eventData.filter(item => item.properties.tar1_sex === tarSex));
      }  */
     //filterSex(filteredData);
     //console.log("filtered data in use effect hook:");
     //console.log({filteredData});
     //console.log("tar_sex in use effect hook:");
     //console.log({tarSex});

     /* evData = filterWrongdoing(evData);
     evData = filterSex(evData);
     evData = filterPeViolence(evData);

     console.log(evData);
 */
      console.log(filteredSexData);
      console.log(filteredSexData);
  }, [map, tarSex, filteredData]);



  return (
    <div className="App">
      <h4>LYLA Dashboard</h4>
      {/*  <Dropdown className="drop" autoClose='true' onSelect={e => setWrongdoing(e.currentTarget.value)}>
        <Dropdown.Toggle variant="success" className="toggle">
          Wrongdoing Type
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropMenu">
        <Dropdown.Item  href="#/action-a">
            8
          </Dropdown.Item>
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

      <Dropdown className="drop" onSelect={e => {
          console.log("value is", e.currentTarget.value);
          setTarSex(e.currentTarget.value);
          }}>
        <Dropdown.Toggle variant="success" className="toggle">
          Sex of Target
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropMenu">
        <Dropdown.Item  href="#/tar_sex_a">
            all
           
          </Dropdown.Item>
          <Dropdown.Item  href="#/tar_sex_m">
            0
          </Dropdown.Item>
          <Dropdown.Item  href="#/tar_sex_f">
            1
           
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <Dropdown className="drop" onSelect={e => setPeViolence(e.currentTarget.value)}>
        <Dropdown.Toggle variant="success" className="toggle">
          pe_violence
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropMenu">
        <Dropdown.Item  href="#/action-va">
            all
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-v1">
            0
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-v2">
            1
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-v3">
            2
          </Dropdown.Item>
          <Dropdown.Item  href="#/action-v4">
            4
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
  

{/* <form>

<label>
  TarSex
  <input type="number" name="tarSex" value={tarSex}
    onChange={handleTarChange}
  />
</label>
<button type="button" onClick={testVariables}>Test</button>




</form> */}

<div>
  <Container className="content">
    <div className='row'>
      <div className='col-sm-12'>
        <h5 className="mt-4 mb-4 fw-bold">Title</h5>
        <div className="row mb-3">
          <div className='form-group col-md-4'>
            <label className='mb-2'>Sex of Target</label>
            <select name='tar1_sex' className='form-control' onChange={(e) => handleTarSex(e)}>
              <option>--Select--</option>
              <option value={0}>0 </option>
              <option value={1}>1 </option>
            </select>
          </div>
          <div className="form-group col-md-2 mt-4">  
          <div className='form-group col-md-4'>
            <label className='mb-2'>Alleged Wrongdoing</label>
            <select name='tar_wrongdoing' className='form-control' onChange={(e) => handleWrongdoing(e)}>
              <option>--Select--</option>
              <option value={0}>0 </option>
              <option value={1}>1 </option>
              <option value={2}>2 </option>
              <option value={3}>3 </option>
            </select>
          </div>  
          </div>
        </div>
      </div>
      {filteredSexData.features.map(item => {
        <p>{item.properties.tar1_sex}</p>
      })}
    </div>
  </Container>

</div>

    <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
    >
      {filteredData.features.map(evt => (
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
    <p>Tar Sex: {tarSex}</p>
    </div>
  );
};



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