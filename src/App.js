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
import eventData from './data/events.json'
import dictionary from './data/dictionary.json'
import tileLayer from './util/tileLayer';
import './App.css'
import 'leaflet/dist/leaflet.css';
//import { EventDropDownList } from './components/DropDownList';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateSlider from './components/DateSlider'

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
  const [wrongdoing, setWrongdoing] = useState('--Select--');
  const [tarSex, setTarSex] = useState('--Select--');
  const [tarOutcome, setTarOutcome] = useState('--Select--');
  const [peViolence, setPeViolence] = useState("all");
  const [StartDate, setSDate] = useState("23.10.2008");
  const [EndDate, setEDate] = useState("23.10.2022");
  const [shapes, setshapes] = useState();
  const [file, setfile] = useState('Argentina');
  const [fileflag, setfileflag] = useState('Argentina');
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
  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1]-1, parts[0]);
  }

  const handleTarSex=(event)=>{
    const gettarsex= event.target.value;
    setTarSex(gettarsex);
  }

  const handleWrongdoing = (event)=>{
    const getwrongdoing=event.target.value;
    setWrongdoing(getwrongdoing);
  }


  const handleTarOutcome = (event)=>{
    const getoutcome=event.target.value;
    setTarOutcome(getoutcome);
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

 /* const filteredSexData = filteredData.features.filter(item => item.properties.tar1_sex{
        if (item.properties.tar1_sex === tarSex)
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
  
 */
 /*  const filterPeViolence = useMemo((data) => {
    if (!peViolence || peViolence === "all") return data;
    
    return data.filter(item => item.properties.pe_violence === peViolence);

  }, [peViolence]);
   */

  useEffect(() => {
    //console.log(evData);
    if (!map) return;

    const legend = L.control({ position: "bottomleft" });
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
  }, [map]);


  useEffect(()=> {
    console.log("original dataset is:");
    console.log(eventData);
    var filtered_data = Object.create(eventData);
    if (tarSex!='--Select--'){
      filtered_data.features = filtered_data.features.filter((item) => 
        item.properties.tar1_sex == tarSex
      );
    }
    if (tarOutcome!='--Select--'){
      filtered_data.features = filtered_data.features.filter((item) => 
        item.properties.tar_outcome==tarOutcome
      );
    }
    if (wrongdoing!='--Select--'){
      filtered_data.features = filtered_data.features.filter((item) => 
        item.properties.tar_wrongdoing==wrongdoing
      );
    }
    var start_parsed=parseDate(StartDate)
    var end_parsed=parseDate(EndDate)

    filtered_data.features = filtered_data.features.filter((item) => {

      var date = new Date(parseDate(item.properties.date));

      return (date >= start_parsed && date <= end_parsed);
    }
        
      );


    setFilteredData(filtered_data);
    //console.log("original dataset:");
    console.log("filtered dataset is");
    console.log(filtered_data);

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
    const response = await fetch('/countries/' + file + '.json', {
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

<Form.Label>
  TarSex
  <input type="number" name="tarSex" value={tarSex}
    onChange={handleTarChange}
  />
</Form.Label>
<button type="button" onClick={testVariables}>Test</button>




</form> */}

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
          <Form.Select name='tar1_sex' className='form-control' onChange={(e) => handleTarSex(e)}>
            <option value={null}>--Select--</option>
            {dictionary.filter((item) => 
              item.variable=='tar1_sex'
                  ).map((element) => {
                    return <option value={element.value}>{element.name} 
                      </option>;
              })
            }
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label className='mb-2'>Alleged Wrongdoing</Form.Label>
          <Form.Select name='tar_wrongdoing' className='form-control' onChange={(e) => handleWrongdoing(e)}>
            <option value={null}>--Select--</option>
            {dictionary.filter((item) => 
              item.variable=='tar_wrongdoing'
                  ).map((element) => {
                    return <option value={element.value}>{element.name} 
                      </option>;
              })
            }
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label className='mb-2'>Worst outcome</Form.Label>
          <Form.Select name='tar_outcome' className='form-control' onChange={(e) => handleTarOutcome(e)}>
            <option value={null}>--Select--</option>
            {dictionary.filter((item) => 
              item.variable=='tar_outcome'
                  ).map((element) => {
                    return <option value={element.value}>{element.name} 
                      </option>;
              })
            }
          </Form.Select>
        </Col>
      {/* {filteredSexData.features.map(item => {
        <p>{item.properties.tar1_sex}</p>
      })} */}
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

     
      
      <MapContent geojson_data={geojson} setfile={setfile} key={'latam'}/>
    </MapContainer>

    <MapContainer
      id="regionMap"
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
    >
      <TileLayer {...tileLayer} />
      
      <MapContent geojson_data={shapes} setfile={setfile} key={fileflag} />
    </MapContainer>



    <p>Tar Sex: {tarSex}</p>
    
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
  map.fitBounds(geoJsonRef.current.getBounds());
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

export default App;