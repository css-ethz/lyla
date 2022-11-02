import { useEffect, useState , useMemo, useRef} from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container, Row, Col ,Form} from 'react-bootstrap';
import {
  MapContainer,
  TileLayer,
  GeoJSON,Marker,Popup,
  useMap, Circle
} from 'react-leaflet'
import { Bar,Line } from "react-chartjs-2";
import L from 'leaflet';
import {Icon} from 'leaflet';
import geojson from './data/admin0.geojson.json'
import eventData from './data/json_data_complete_latin2.json'
import dictionary from './data/dictionary.json'
import tileLayer from './util/tileLayer';
import './App.css'
import 'leaflet/dist/leaflet.css';
//import { EventDropDownList } from './components/DropDownList';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateSlider from './components/DateSlider';
import DownloadComponent from './components/DownloadComponent';
import Heatmap from './components/Heatmap';
import Eventmap from './components/Eventmap';


import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import colorLib from '@kurkle/color';
import { MultiSelect } from "react-multi-select-component";
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
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
  const [peNum, setPeNum] = useState([]);
  const [tarOutcome, setTarOutcome] = useState([]);
  const [peViolence, setPeViolence] = useState([]);
  const [StartDate, setSDate] = useState("01.01.2010");
  const [EndDate, setEDate] = useState("31.12.2019");
  const [shapes, setshapes] = useState(geojson);
  const [file, setfile] = useState('Argentina');
  const [level, setlevel] = useState(0);
  const [fileflag, setfileflag] = useState('Argentina');
  //const [var_chart,setvar_chart]=useState('tar1_sex');
  const [var_chart,setvar_chart]=useState('pe_approxnumber');
  const [plotcolor, setplotcolor] = useState("red");
  const [heat,setheat]=useState(() => {
    var groups=filteredData.reduce(function (r, row) { 
      r[row.name_0] = ++r[row.name_0] || 1;
        return r;
    }, {});
    return groups;
  });
  const [barData, setBarData] = useState({
    labels: dictionary.filter((item) =>  item.variable==var_chart).map((element) => element.name),
    datasets: [],}); 

  const [lineData, setLineData] = useState({
      labels: dictionary.filter((item) =>  item.variable==var_chart).map((element) => element.name),
      datasets: [],}); 
  useEffect(() => { 
    var occurences = filteredData.reduce(function (r, row) {
        var val_name=dictionary.filter((item) =>  item.variable==var_chart  & item.value==row[var_chart]).map((element) => element.name)[0];
        r[val_name] = ++r[val_name] || 1;
        return r;
    }, {});

    setBarData({
              labels: dictionary.filter((item) =>  item.variable==var_chart).map((element) => element.name),
              datasets: [
                  {
                      label: "data",
                      data: occurences,
                      fill: false, // use "True" to draw area-plot 
                      borderColor: plotcolor,
                      backgroundColor: transparentize(plotcolor, 0.5),
                      pointBackgroundColor: 'black',
                      pointBorderColor:'black'
                  },
                ],});
        
        }, [var_chart]);

  useEffect(() => { 
    if (level==0){
      var groups=filteredData.reduce(function (r, row) { 
        r[row.name_0] = ++r[row.name_0] || 1;
          return r;
      }, {});
    }else{
      var groups=filteredData.filter((item) =>  item.name_0==fileflag).reduce(function (r, row) { 
        r[row.name_1] = ++r[row.name_1] || 1;
          return r;
      }, {});
    }
    setheat(groups);
    console.log(groups);
    var occurences = eventData.filter((item) =>  item.name_0==fileflag).reduce(function (r, row) {
      var year_month=row['date'].substring(0,4);  
      r[year_month] = ++r[year_month] || 1;
        return r;
    }, {});
    console.log(occurences);
    setLineData({
      labels: Object.keys(occurences),
      datasets: [
          {
              label: "data",
              data: occurences,
              fill: false, // use "True" to draw area-plot 
              borderColor: plotcolor,
              backgroundColor: transparentize(plotcolor, 0.5),
              pointBackgroundColor: 'black',
              pointBorderColor:'black'
          },
        ],});
        }, [fileflag]);



  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1]-1, parts[0]);
  }
   function transparentize(value, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  } 
  useEffect(() => {
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
    if(peNum.length>0){
      
      filtered_data = filtered_data.filter((item) => 
      peNum.map(function(e) {
        return e.value;
      }).includes(item.pe_approxnumber)
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
    if(peViolence.length>0){
      
      filtered_data = filtered_data.filter((item) => 
      peViolence.map(function(e) {
        return e.value;
      }).includes(item.pe_violence)
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

  },[peNum,tarOutcome,wrongdoing,peViolence,StartDate,EndDate]);



  useEffect(() => {
    console.log(file);
    console.log(level);
    setlevel(1);
    var countries=["Argentina","Bolivia","Brazil","Chile","Colombia","Mexico","Panama","Paraguay","Uruguay"]

    if (countries.includes(file)){
      fetchData(file);
      
    }else{
    const anchor = document.querySelector('#regionMap')
    anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

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
        <Col md={2}>
          <Form.Label className='mb-2'>Worst violence inflicted</Form.Label>
          <MultiSelect
          options={dictionary.filter((item) => 
            item.variable=='pe_violence'
                ).map((element) => {
                  return {'label':element.name,'value':element.value}
                    
            })}
            value={peViolence}
          onChange={setPeViolence}
          labelledBy="Select"
         />
        </Col>
        <Col md={2}>
          <Form.Label className='mb-2'>Approximate number of perpetrators</Form.Label>
          <MultiSelect
          options={dictionary.filter((item) => 
            item.variable=='pe_approxnumber'
                ).map((element) => {
                  return {'label':element.name,'value':element.value}
                    
            })}
            value={peNum}
          onChange={setPeNum}
          labelledBy="Select"
         />
        </Col>
    </Row>
    <Row>
      <DownloadComponent filteredData={filteredData}/>

    </Row>
  </Container>

</div>
<div>
  <Container fluid>
  <Col md={2}>
  <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
      onClick={console.log("clickmap")}
    >
 <TileLayer {...tileLayer} />
 <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key={fileflag}/>
    </MapContainer>

  </Col>

  <Col md={2}>
  <MapContainer
      id="regionMap"
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
    >
      <TileLayer {...{
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}
} />
      
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
              {evt.date} <br/>
              Alleged wrongdoing:&emsp;&emsp;
              {dictionary.filter((item) => 
            item.variable=='tar_wrongdoing' & item.value==evt.tar_wrongdoing).map((element) => {
                   return element.name})}  <br/>
               Worst outcome:&emsp;&emsp;&emsp;&emsp;
              {dictionary.filter((item) => 
            item.variable=='tar_outcome' & item.value==evt.tar_outcome).map((element) => {
                   return element.name})}<br/>
                   Worst violence inflicted:&ensp;
                  {dictionary.filter((item) => 
                item.variable=='pe_violence' & item.value==evt.pe_violence).map((element) => {
                       return element.name})}

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

      <Eventmap geojson_data={shapes} setfile={setfile} key={fileflag} />
    </MapContainer>

  </Col>

  </Container>
</div>

    <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ width: '40%', height: '560px'}}
      onClick={console.log("clickmap")}
    >
 <TileLayer {...tileLayer} />



     

     
      
      <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key={fileflag}/>
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
      <TileLayer {...{
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}
} />
      
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
              {evt.date} <br/>
              Alleged wrongdoing:&emsp;&emsp;
              {dictionary.filter((item) => 
            item.variable=='tar_wrongdoing' & item.value==evt.tar_wrongdoing).map((element) => {
                   return element.name})}  <br/>
               Worst outcome:&emsp;&emsp;&emsp;&emsp;
              {dictionary.filter((item) => 
            item.variable=='tar_outcome' & item.value==evt.tar_outcome).map((element) => {
                   return element.name})}<br/>
                   Worst violence inflicted:&ensp;
                  {dictionary.filter((item) => 
                item.variable=='pe_violence' & item.value==evt.pe_violence).map((element) => {
                       return element.name})}

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

      <Eventmap geojson_data={shapes} setfile={setfile} key={fileflag} />
    </MapContainer>
    <Row>
      <Col md={8}>
      <Line data={lineData} 
      // options= {/{scales: {x: {type: 'time'}}} }
      />
      </Col>
    </Row>

    <Row>
      <Col md={2}>
      <Form.Select
            value={var_chart}
            onChange={event => setvar_chart(event.target.value)}>
            <option value="pe_approxnumber">Approximate number of perpetrators</option>
            <option value="tar_wrongdoing">Wrongdoing</option>
            <option value="tar_outcome">Outcome</option>
            <option value="pe_violence">Worst violence inflicted</option>
      </Form.Select>

      </Col>
    </Row>
    <Row>
      <Col md={6}>
      <Bar data={barData}  />
      </Col>
    </Row>

    </div>
  );
};




export default App;