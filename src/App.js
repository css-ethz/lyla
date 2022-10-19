import { useEffect, useState , useMemo, useRef} from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container, Row, Col ,Form} from 'react-bootstrap';
import {
  MapContainer,
  TileLayer,
  GeoJSON,Marker,Popup,
  useMap, Circle
} from 'react-leaflet'
import L from 'leaflet';
import {Icon} from 'leaflet';
import geojson from './data/admin0.geojson.json'
import eventData from './data/json_data.json'
import dictionary from './data/dictionary.json'
import tileLayer from './util/tileLayer';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'
import './App.css'
import 'leaflet/dist/leaflet.css';
//import { EventDropDownList } from './components/DropDownList';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateSlider from './components/DateSlider';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { MultiSelect } from "react-multi-select-component";
import '@changey/react-leaflet-markercluster/dist/styles.min.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
require('leaflet/dist/leaflet.css');
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
  const [wrongdoing, setWrongdoing] = useState([]);
  const [tarSex, setTarSex] = useState([]);
  const [tarOutcome, setTarOutcome] = useState([]);
  const [peViolence, setPeViolence] = useState("all");
  const [StartDate, setSDate] = useState("23.10.2008");
  const [EndDate, setEDate] = useState("23.10.2022");
  const [shapes, setshapes] = useState();
  const [file, setfile] = useState('Argentina');
  const [fileflag, setfileflag] = useState('Argentina');


  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1]-1, parts[0]);
  }
  useEffect(() => {
    //console.log(evData);
    if (!map) return;

    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `click on polygon`;
      return div;
    };
  }, [map]);


  useEffect(()=> {
    var filtered_data = Object.create(eventData);
    if(tarSex.length>0){
      
      filtered_data = filtered_data.filter((item) => 
      tarSex.map(function(e) {
        return e.value;
      }).includes(item.tar1_sex)
      );
    }
    if(tarOutcome.length>0){
      
      filtered_data = filtered_data.filter((item) => 
      tarOutcome.map(function(e) {
        return e.value;
      }).includes(item.tar_outcome)
      );
    }
    if(wrongdoing.length>0){
      
      filtered_data = filtered_data.filter((item) => 
      wrongdoing.map(function(e) {
        return e.value;
      }).includes(item.tar_wrongdoing)
      );
    }
    var start_parsed=parseDate(StartDate)
    var end_parsed=parseDate(EndDate)

    filtered_data = filtered_data.filter((item) => {

      var date = new Date(item.date);

      return (date >= start_parsed && date <= end_parsed);
    }
        
      );


    setFilteredData(filtered_data);

  },[tarSex,tarOutcome,wrongdoing,StartDate,EndDate]);

  useEffect(() => {
    console.log(file);
    fetchData(file);
    const anchor = document.querySelector('#regionMap')
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
  },[file])

  useEffect(() => {
    setfileflag(file);
  },[shapes])

  async function fetchData(file) {
    // const response = await fetch("./example.json");
    const response = await fetch('/lyla/countries/' + file + '.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
    setshapes(await response.json());
  }

  return (
    <div className="App">
      <h4>LYLA Dashboard</h4>

<div>
  <Container fluid>
    <Row>
      <Col md={6}>
         <DateSlider setSDate={setSDate} setEDate={setEDate}/> 
      </Col>
    </Row>
    <Row>
        <Col md={2}>
          <Form.Label className='mb-2'>Sex of Target</Form.Label>
          <MultiSelect
          options={dictionary.filter((item) => 
            item.variable=='tar1_sex'
                ).map((element) => {
                  return {'label':element.name,'value':element.value}
                    
            })}
            value={tarSex}
          onChange={setTarSex}
          labelledBy="Select"
         />
        </Col>
        <Col md={2}>
          <Form.Label className='mb-2'>Alleged Wrongdoing</Form.Label>
          <MultiSelect
          options={dictionary.filter((item) => 
            item.variable=='tar_wrongdoing'
                ).map((element) => {
                  return {'label':element.name,'value':element.value}
                    
            })}
            value={wrongdoing}
          onChange={setWrongdoing}
          labelledBy="Select"
         />
        </Col>
        <Col md={2}>
          <Form.Label className='mb-2'>Worst outcome</Form.Label>
          <MultiSelect
          options={dictionary.filter((item) => 
            item.variable=='tar_outcome'
                ).map((element) => {
                  return {'label':element.name,'value':element.value}
                    
            })}
            value={tarOutcome}
          onChange={setTarOutcome}
          labelledBy="Select"
         />
        </Col>

    </Row>
    <Row>
      <DownloadComponent filteredData={filteredData}/>

    </Row>
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
 <TileLayer {...tileLayer} />
 <MarkerClusterGroup maxClusterRadius={40} >
      {filteredData.map(evt => (
        <Marker
          key={evt.id}
          position={[
            evt.geometry.coordinates[0],
            evt.geometry.coordinates[1]
          ]}
          onClick={() => {
            setActiveEvent(evt);
          }}>
          <Popup>
              {evt.evidence1_source} <br/>{evt.evidence1_text.slice(0,150)}

          </Popup>


        </Marker>
/*           <Circle 
          center={{lat:evt.geometry.coordinates[0], lng: evt.geometry.coordinates[1]}}
          fillColor="green" 
          radius={20000}
          pathOptions={{
            color: "green"
          }}
                  onClick={() => {
                    console.log("click");
                    setActiveEvent(evt);
                  }}/> */
        
        
        
      ))}
</MarkerClusterGroup>      
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
        <h2>{activeEvent.evidence1_text}</h2>
        <p>{activeEvent.date}</p>
      </div>
    </Popup>
  )}


     

     
      
      <MapContent geojson_data={geojson} setfile={setfile} key={'latam'}/>
    </MapContainer>

    <MapContainer
      id="regionMap"
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
    >
      <TileLayer {...tileLayer} />
      
      <MapContent geojson_data={shapes} setfile={setfile} key={fileflag} />
    </MapContainer>


    </div>
  );
};



const MapContent = ({geojson_data,setfile,key}) => {
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
  useEffect(() => {
    if (geoJsonRef.current.getBounds().isValid()){
      map.fitBounds(geoJsonRef.current.getBounds());
    }
  
  },[geojson_data])

  const resetHighlight = (e) => {
    geoJsonRef.current?.resetStyle(e.target);
  };

  const zoomToFeature = (e) => {
    map.fitBounds(e.target.getBounds());
  };

  return (
            <GeoJSON
              data={geojson_data}
              key={key}
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
                    setfile(e.target.feature.properties.ADMIN);
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

const DownloadComponent = ({filteredData}) => {
  const [transactionData, setTransactionData] = useState([])
  const csvLink = useRef() // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const getTransactionData =() => {
    setTransactionData(filteredData);
    csvLink.current.link.click();
  }
  useEffect(() => {
    setTransactionData(filteredData);
  },[filteredData])

  return (
    <div>
      <Button onClick={getTransactionData}>Download events to csv</Button>
      <CSVLink
         data={transactionData}
         filename='events.csv'
         className='hidden'
         ref={csvLink}
         target='_blank'
      />
    </div>
  )
};

export default App;