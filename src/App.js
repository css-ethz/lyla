import { useEffect, useState, useMemo, useRef } from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container, Row, Col, Form } from 'react-bootstrap';
import {
  MapContainer,
  TileLayer,
  GeoJSON, Marker, Popup,
  useMap, Circle
} from 'react-leaflet'
import { Bar, Line } from "react-chartjs-2";
import L from 'leaflet';
import { Icon } from 'leaflet';
import geojson from './data/admin0.geojson.json'
import geojson1_admin1 from './data/admin1.geojson.json'
import eventData from './data/json_data_complete_latin2.json'
import aggData from './data/data_agg.json'
import population_admin0 from './data/population_admin0.json'
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
import { Button } from 'react-bootstrap'

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

const options = {
  scales: {
    yAxes: [
      {
        gridLines: {
          display: "false"
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: "false"
        }
      }
    ]
  }
};

function style(feature) {
  return {
    fillColor: `#a9a9a9`,
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.7
  };
};




function App() {
  const [map, setMap] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [filteredData, setFilteredData] = useState(eventData);
  const [filteredData_agg, setFilteredData_agg] = useState(aggData);
  const [wrongdoing, setWrongdoing] = useState([]);
  const [tarSex, setTarSex] = useState([]);
  const [peNum, setPeNum] = useState([]);
  const [countries, setCountries] = useState([]);
  const [tarOutcome, setTarOutcome] = useState([]);
  const [peViolence, setPeViolence] = useState([]);
  const [StartDate, setSDate] = useState("01.01.2010");
  const [EndDate, setEDate] = useState("31.12.2019");
  const [shapes, setshapes] = useState(geojson);
  const [file, setfile] = useState('latam');
  const [level, setlevel] = useState(0);
  const [fileflag, setfileflag] = useState('latam');

  //const [var_chart,setvar_chart]=useState('tar1_sex');
  const [var_chart, setvar_chart] = useState('pe_approxnumber');
  const [plotcolor, setplotcolor] = useState("#e37068");
  const [zoomLevel, setZoomLevel] = useState(3);
  const [heat, setheat] = useState(() => {
    var groups = filteredData_agg.reduce(function (r, row) {
      r[row.name_0] = ++r[row.name_0] || 1;
      return r;
    }, {});
    return groups;
  });
  const Colorscale = {'latam':'#fafa6e','Mexico':'#9cdf7c','Brazil':'#4abd8c','Argentina':'#00968e','Chile':'#106e7c','Peru': '#2a4858'};
  const [barData, setBarData] = useState({
    labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
    datasets: [],
  });

  const [lineData, setLineData] = useState({
    labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
    datasets: [],
  });
  useEffect(() => {
    var occurences = filteredData_agg.reduce(function (r, row) {
      var val_name = dictionary.filter((item) => item.variable == var_chart & item.value == row[var_chart]).map((element) => element.name)[0];
      r[val_name] = ++r[val_name] || 1;
      return r;
    }, {});

    setBarData({
      labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
      datasets: [
        {
          label: "data",
          data: occurences,
          fill: false, // use "True" to draw area-plot 
          borderColor: plotcolor,
          backgroundColor: transparentize(plotcolor, 0.5),
          pointBackgroundColor: 'black',
          pointBorderColor: 'black'
        },
      ],
    });

  }, [var_chart]);

  useEffect(() => {

    if (level == 0) {
      var gg = filteredData_agg.reduce(function (r, row) {
        r[row.name_0] = r[row.name_0] + row.id || row.id;
        return r;
      }, {});
      var groups = {};
      console.log("gg", gg);
      console.log("pop", population_admin0);
      Object.keys(gg).forEach(key => groups[key] = 1000000 * gg[key] / population_admin0[0][key]);
    } else {
      var groups = filteredData_agg.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = r[row.name_1] + row.events_pop || row.events_pop;
        return r;
      }, {});
    }
    setheat(groups);
    console.log(groups);
    console.log(filteredData_agg);
    var occurences = filteredData_agg.reduce(function (r, row) {
      var year_month = row['month_year'].qyear;
      r[year_month] = ++r[year_month] || 1;
      return r;
    }, {});
    var current_countries=[{label: 'latam',data: occurences,
                  fill: false, // use "True" to draw area-plot 
                  borderColor: Colorscale['latam'],
                  color: 'white',
                  tickColor: 'white',
                  backgroundColor: transparentize(Colorscale['latam'], 0.5),
                  pointBackgroundColor: 'black',
                  pointBorderColor: 'black'}];
    current_countries.push(...countries.map(function (e) {
      var occurences = filteredData_agg.filter((item) => (item.name_0 == e.value) ).reduce(function (r, row) {
        var year_month = row['month_year'].qyear;
        r[year_month] = ++r[year_month] || 1;
        return r;
      }, {})
      return {
        label: e.value,
        data: occurences,
        fill: false, // use "True" to draw area-plot 
        borderColor: Colorscale[e.value],
        color: 'white',
        tickColor: 'white',
        backgroundColor: transparentize(Colorscale[e.value], 0.5),
        pointBackgroundColor: 'black',
        pointBorderColor: 'black'
      }
    }));

    console.log("res",current_countries);
    setLineData({
      labels: Object.keys(current_countries[0]['data']),
      datasets: current_countries,
    });
  }, [fileflag, filteredData_agg]);



  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]);
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


  useEffect(() => {
    var filtered_data = Object.create(eventData);
    var filtered_data_agg = Object.create(aggData);
    if (peNum.length > 0) {

      filtered_data = filtered_data.filter((item) =>
        peNum.map(function (e) {
          return e.value;
        }).includes(item.pe_approxnumber)
      );
      filtered_data_agg = filtered_data_agg.filter((item) =>
        peNum.map(function (e) {
          return e.value;
        }).includes(item.pe_approxnumber)
      );
    }
    if (tarOutcome.length > 0) {

      filtered_data = filtered_data.filter((item) =>
        tarOutcome.map(function (e) {
          return e.value;
        }).includes(item.tar_outcome)
      );
      filtered_data_agg = filtered_data_agg.filter((item) =>
        tarOutcome.map(function (e) {
          return e.value;
        }).includes(item.tar_outcome)
      );
    }
    if (wrongdoing.length > 0) {

      filtered_data = filtered_data.filter((item) =>
        wrongdoing.map(function (e) {
          return e.value;
        }).includes(item.tar_wrongdoing)
      );
      filtered_data_agg = filtered_data_agg.filter((item) =>
        wrongdoing.map(function (e) {
          return e.value;
        }).includes(item.tar_wrongdoing)
      );
    }
    if (peViolence.length > 0) {

      filtered_data = filtered_data.filter((item) =>
        peViolence.map(function (e) {
          return e.value;
        }).includes(item.pe_violence)
      );
      filtered_data_agg = filtered_data_agg.filter((item) =>
        peViolence.map(function (e) {
          return e.value;
        }).includes(item.pe_violence)
      );
    }
    console.log("countries",countries);
    var current_countries=countries.map(function (e) {
      return e.value;
    });
    filtered_data = filtered_data.filter((item) =>
      item.name_0==fileflag
      );
/*     if (countries.length > 0) {

      filtered_data = filtered_data.filter((item) =>
      current_countries.includes(item.name_0)
      );
       filtered_data_agg = filtered_data_agg.filter((item) =>
      current_countries.includes(item.name_0)
      ); 
    } */

/*     if (fileflag != 'latam') {
      filtered_data = filtered_data.filter((item) => item.name_0 == fileflag);
      filtered_data_agg = filtered_data_agg.filter((item) => item.name_0 == fileflag);
    } */

    var start_parsed = parseDate(StartDate)
    var end_parsed = parseDate(EndDate)

    filtered_data = filtered_data.filter((item) => {
      var date = new Date(item.date);
      return (date >= start_parsed && date <= end_parsed);
    }

    );


    setFilteredData(filtered_data);
    setFilteredData_agg(filtered_data_agg);

  }, [peNum, tarOutcome, wrongdoing, peViolence, StartDate, EndDate, fileflag,countries]);



  useEffect(() => {
    console.log(file);
    console.log(level);
    setlevel(1);
    var countries = ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
      "Costa Rica", "Dominican Republic", "Ecuador", "Guatemala", "Honduras",
      "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Uruguay", "Venezuela"]
    if (file == 'latam') {
      setshapes(geojson);
      setlevel(0);
    }
    else if (countries.includes(file)) {
      //fetchData(file);
      var geo1 = Object.create(geojson1_admin1);
      geo1.features = geo1.features.filter((item) => item.properties.NAME_0 == file);
      setshapes(geo1);

    } else {
      const anchor = document.querySelector('#regionMap')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

  }, [file])

  useEffect(() => {
    if (level == 0) {
      var groups = filteredData_agg.reduce(function (r, row) {
        r[row.name_0] = r[row.name_0] + row.events_pop || row.events_pop;
        return r;
      }, {});
    } else {
      var groups = filteredData_agg.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = r[row.name_1] + row.events_pop || row.events_pop;
        return r;
      }, {});
    }
    setheat(groups);
    setfileflag(file);
    if (file!='latam'){
      var countries_tmp=Object.create(countries);
      countries_tmp.push({label: file, value: file})
      console.log("rr",countries_tmp);
      setCountries(countries_tmp);
    }
  }, [shapes])

  async function fetchData(file) {
    // const response = await fetch("./example.json");
    const response = await fetch('/lyla/countries/' + file + '.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    setshapes(await response.json());
  }

  const reset_map = () => {
    setfile("latam");
  }

  return (
    <div className="dark">
      <h1>LYLA Dashboard</h1>

      <div>
        <Container fluid>
          <Row className='add-space'>
            <Col md={6}>
              <DateSlider setSDate={setSDate} setEDate={setEDate} />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <Form.Label className='mb-2'>Alleged Wrongdoing</Form.Label>
              <MultiSelect
                options={dictionary.filter((item) =>
                  item.variable == 'tar_wrongdoing'
                ).map((element) => {
                  return { 'label': element.name, 'value': element.value }

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
                  item.variable == 'tar_outcome'
                ).map((element) => {
                  return { 'label': element.name, 'value': element.value }

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
                  item.variable == 'pe_violence'
                ).map((element) => {
                  return { 'label': element.name, 'value': element.value }

                })}
                value={peViolence}
                onChange={setPeViolence}
                labelledBy="Select"
              />
            </Col>
            <Col md={2}>
              <Form.Label className='mb-2'>Number of perpetrators</Form.Label>
              <MultiSelect
                options={dictionary.filter((item) =>
                  item.variable == 'pe_approxnumber'
                ).map((element) => {
                  return { 'label': element.name, 'value': element.value }

                })}
                value={peNum}
                onChange={setPeNum}
                labelledBy="Select"
              />
            </Col>
            <Col md={2}>
              <Form.Label className='mb-2'>Country</Form.Label>
              <MultiSelect
                options={dictionary.filter((item) =>
                  item.variable == 'country'
                ).map((element) => {
                  return { 'label': element.name, 'value': element.value }

                })}
                value={countries}
                onChange={setCountries}
                labelledBy="Select"
              />
            </Col>

          </Row>
          <Row>
          <Col md={3}>
            <DownloadComponent filteredData={filteredData} />
            </Col>
            <Col md={3}>
              <Button onClick={reset_map}>Reset map</Button>
            </Col>
          </Row>
        </Container>

      </div>
      <div>
        <Container fluid>
          <Row>
            {/*   <Col>
  <MapContainer
      bounds={outerBounds}
      whenCreated={setMap}
      center={center}
      zoom={zoomLevel}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '560px'}}

    >
 <TileLayer {...tileLayer} />
 <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key_id={fileflag}/>
    </MapContainer>

  </Col> */}

            <Col>
              <MapContainer
                id="regionMap"
                bounds={outerBounds}
                whenCreated={setMap}
                center={center}
                zoom={3}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '560px' }}
              >
                <TileLayer {...{
                  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
                } />

                <MarkerClusterGroup maxClusterRadius={40} >
                  {fileflag != 'latam' && filteredData.map(evt => (
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
                        {evt.date} <br />
                        Alleged wrongdoing:&emsp;&emsp;
                        {dictionary.filter((item) =>
                          item.variable == 'tar_wrongdoing' & item.value == evt.tar_wrongdoing).map((element) => {
                            return element.name
                          })}  <br />
                        Worst outcome:&emsp;&emsp;&emsp;&emsp;
                        {dictionary.filter((item) =>
                          item.variable == 'tar_outcome' & item.value == evt.tar_outcome).map((element) => {
                            return element.name
                          })}<br />
                        Worst violence inflicted:&ensp;
                        {dictionary.filter((item) =>
                          item.variable == 'pe_violence' & item.value == evt.pe_violence).map((element) => {
                            return element.name
                          })}

                      </Popup>


                    </Marker>


                  ))}
                </MarkerClusterGroup>

                <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key_id={fileflag} />
              </MapContainer>

            </Col>
            <Col md={6}>
              <Line data={lineData}
                // options= {/{scales: {x: {type: 'time'}}} }
                options={options}
              />
            </Col>

          </Row>
        </Container>
      </div>
      <Row>
        <Col md={2}>
          <Form.Select
            value={var_chart}
            onChange={event => setvar_chart(event.target.value)}>
            <option value="pe_approxnumber">Number of perpetrators</option>
            <option value="tar_wrongdoing">Wrongdoing</option>
            <option value="tar_outcome">Outcome</option>
            <option value="pe_violence">Worst violence inflicted</option>
          </Form.Select>

        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Bar data={barData} />
        </Col>
      </Row>

    </div>
  );
};




export default App;