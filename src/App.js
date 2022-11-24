import { useEffect, useState, useMemo, useRef } from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container, Row, Col, Form } from 'react-bootstrap';
import {
  MapContainer,
  TileLayer, CircleMarker, Popup
} from 'react-leaflet'
import { Bar, Line } from "react-chartjs-2";
import L from 'leaflet';
import { Icon } from 'leaflet';
import geojson from './data/admin0.geojson.json'
import geojson1_admin1 from './data/admin1.geojson.json'
import eventData from './data/json_data_complete_latin3.json'
import aggData from './data/data_agg.json'
import population_admin0 from './data/population_admin0.json'
import dictionary from './data/dictionary.json'
import tileLayer from './util/tileLayer';
import './App.css'
import 'leaflet/dist/leaflet.css';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateSlider from './components/DateSlider';
import DownloadComponent from './components/DownloadComponent';
import Heatmap from './components/Heatmap';
import ResetMarker from './components/ResetMarker';
import { Button } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css';
import colorLib from '@kurkle/color';
import { MultiSelect } from "react-multi-select-component";
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { Chart, registerables } from 'chart.js';
import DownloadCodebook from './components/CodebokkPopUp';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { renderToStaticMarkup } from "react-dom/server";
import { batch, ScrollContainer, ScrollPage, StickyIn, Fade, FadeIn, Animator, Sticky, MoveOut, MoveIn } from 'react-scroll-motion';
import Ocean from './components/Ocean';
import geojson_ocean from './data/ne_110m_ocean.geojson.json';
import EventsText from './components/EventsText';
import JoyRide, { STATUS } from 'react-joyride';
import {steps_joyride} from './util/steps';

Chart.register(...registerables);
delete L.Icon.Default.prototype._getIconUrl;
fontawesome.library.add(faCircleInfo);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
require('leaflet/dist/leaflet.css');
const center = [-100.4358446, 276.527726];
const outerBounds = [
  [2.505, -100.09],
  [-20.505, 100.09],
]
//-179.99990,-60.34703,-23.24401,30.98005
const colors = ["fe4848", "fe6c58", "fe9068", "feb478", "fed686"];
const labels = ["2-12.5", "12.6-16.8", "16.9-20.9", "21-25.9", "26-plus"];

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Annual events per million inhabitants',
    },
  },
  scales: {
    yAxes:
    {
      gridLines: {
        display: "false"
      }
    },
    xAxes: [
      {
        gridLines: {
          display: "false"
        }
      }
    ]
  }
};
const optionsBar = {
  plugins: {
    title: {
      display: true,
      text: 'Total events per million inhabitants',
    },
  },
  scales: {
    yAxes:
    {
      gridLines: {
        display: "false"
      }
    },
    xAxes: [
      {
        gridLines: {
          display: "false"
        }
      }
    ]
  }
};




function App() {
  const [map, setMap] = useState();
  const [filteredData, setFilteredData] = useState(eventData);
  const [filteredData_agg, setFilteredData_agg] = useState(aggData);
  const [wrongdoing, setWrongdoing] = useState([]);
  const [peNum, setPeNum] = useState([]);
  const [countries, setCountries] = useState([]);
  const [tarOutcome, setTarOutcome] = useState([]);
  const [peViolence, setPeViolence] = useState([]);
  const [StartDate, setSDate] = useState("01.01.2010");
  const [EndDate, setEDate] = useState("31.12.2019");
  const [shapes, setshapes] = useState(geojson);
  const [file, setfile] = useState('Latin America');
  const [level, setlevel] = useState(0);
  const [Check, setCheck] = useState(false);
  const [Show, setShow] = useState(true);
  const [fileflag, setfileflag] = useState('Latin America');
  const [var_chart, setvar_chart] = useState('pe_approxnumber');
  const [isActive, setIsActive] = useState(true);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  /***************************************** START Translated variables ****************************************************/
  const [violenceInflicted, setViolenceInflicted] = useState("Worst violence inflicted");
  const [numberPerpetrators, setNumberPerpetrators] = useState("Number of perpetrators");
  const [allegedWrongdoing, setAllegedWrongdoing] = useState("Alleged Wrongdoing");
  const [worstOutcome, setWorstOutcome] = useState("Worst Outcome");
  const [filterBy, setFilterBy] = useState("Filter By");
  const [timeWindow, setTimeWindow] = useState("Choose time window");
  const [startDateText, setStartDateText] = useState("Start Date");
  const [endDateText, setEndDateText] = useState("End Date");
  const [downloadText, setDownloadText] = useState("Download .csv");
  const [countryText, setCountryText] = useState("Country");
  const [chartText, setChartText] = useState("Annual events per million inhabitants");
  const [scrollDown, setScrollDown] = useState("Scroll down to dashboard");
  const [title, setTitle] = useState("Lynching in Latin America");
  const [textTitle, setTextTitle] = useState("The Lynching in Latin America (LYLA) dataset is the first cross-national lynching event dataset. The LYLA data captures 2818 reported lynching events across 18 Latin American countries from 2010 to 2019.");
  const [showEvents, setShowEvents] = useState("Show Events");
  const [startTour, setStartTour] = useState("Start tour");
  /***************************************** END Translated variables ******************************************************/
  const [language, setLanguage] = useState("English");
  const [occs, setOccs] = useState(null);
  const [numEvents, setNumEvents] = useState(2818);
  const [countryKey, setcountrykey] = useState('Latin America');
  const [runTour, setRunTour] = useState(true);
  const [heat, setheat] = useState(() => {
    var groups = filteredData_agg.reduce(function (r, row) {
      r[row.name_0] = ++r[row.name_0] || 1;
      return r;
    }, {});
    return groups;
  });

  
  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };

  
  const onClickLanguage = () => {
    if (language == "Español") {
      setLanguage("English");
      setViolenceInflicted("Worst violence inflicted");
      setNumberPerpetrators("Number of perpetrators");
      setAllegedWrongdoing("Alleged Wrongdoing");
      setWorstOutcome("Worst Outcome");
      setFilterBy("Filter By");
      setTimeWindow("Choose time window");
      setStartDateText("Start Date");
      setEndDateText("End Date");
      setDownloadText("Download .csv");
      setCountryText("Country");
      setChartText("Annual events per million inhabitants");
      setScrollDown("Scroll down to dashboard");
      setTitle("Lynching in Latin America");
      setTextTitle("The Lynching in Latin America (LYLA) dataset is the first cross-national lynching event dataset. The LYLA data captures 2818 reported lynching events across 18 Latin American countries from 2010 to 2019.");
      setStartDateText("Start Date");
      setEndDateText("End Date");
      setTimeWindow("Choose time window");
      setShowEvents("Show Events");
      setStartTour("Start tour");
    }
    else {
      setLanguage("Español");
      setViolenceInflicted("Peor violencia infligida");
      setNumberPerpetrators("Número de perpetradores");
      setAllegedWrongdoing("Supuesta irregularidad");
      setWorstOutcome("Peor resultado");
      setFilterBy("Filtrar por");
      setTimeWindow("Escoja ventana de tiempo");
      setStartDateText("Fecha de inicio");
      setEndDateText("Fecha final");
      setDownloadText("Descargar .csv");
      setCountryText("País");
      setChartText("Eventos anuales por millón de habitantes");
      setScrollDown("Ir a dashboard");
      setTitle("Linchamientos en Latinoamérica");
      setTextTitle("LYLA (por sus siglas en inglés) es la primera base de datos sobre casos de linchamiento a nivel transnacional. Estos datos recopilan 2,818 casos reportados de linchamientos en 18 países latinoamericanos, del año 2010 al 2019.");
      setStartDateText("Fecha de incio");
      setEndDateText("Fecha final");
      setTimeWindow("Escoja ventana de tiempo");
      setShowEvents("Mostrar Eventos");
      setStartTour("Ver tour");

    };
    console.log(language);
    console.log(violenceInflicted);

  };


  var special_events = Object.create(eventData);
  special_events = special_events.filter((item) => {
    return (item.press_article == 'true');
  });
  const Colorscale = {
    'Latin America': '#fafa6e', 'Argentina': '#00968e', 'Brazil': '#4abd8c', 'Chile': '#106e7c',
    'Mexico': '#9cdf7c', 'Peru': '#2a4858', "Bolivia": "#B1C6ED", "Colombia": "#B7E6DD",
    "Costa Rica": "#DFD3EA", "Dominican Republic": "#E3533F", "Ecuador": "#C5F08E", "Guatemala": "#E4A78E", "Honduras": "#A08EE4",
    "Nicaragua": "#ECBAC5", "Panama": "#899199", "Paraguay": "#5ADCD4", "Uruguay": "#E79456", "Venezuela": "#C4AC9A"
  };
  const [barData, setBarData] = useState({
    labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
    datasets: [],
  });
  const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
  const [lineData, setLineData] = useState({
    labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
    datasets: [],
  });


  

  

  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  function transparentize(value, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }
  

 /************************************************ function passed to heatmpa child component *********************************/

const ParentFunction = (e) => {
  console.log("tarfet admin value is:", e.target.feature.properties.ADMIN);
  console.log("heat of", e.target.feature.properties.ADMIN,"is",heat[e.target.feature.properties.ADMIN]);

  setfile(e.target.feature.properties.ADMIN);
  console.log("function triggered when clicking in heatmap, number of events here is:", numEvents);
  setcountrykey(e.target.feature.properties.ADMIN);
  console.log("countrykey", countryKey);
};
    /************************************************ end  ***********************************/

  useEffect(() => {

    setlevel(1);
    var countries = ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
      "Costa Rica", "Dominican Republic", "Ecuador", "Guatemala", "Honduras",
      "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Uruguay", "Venezuela"]
    if (file == 'Latin America') {
      setshapes(geojson);
      setlevel(0);

      //map2.fitBounds({outerBounds});
    }
    else if (countries.includes(file)) {
      //fetchData(file);
      var geo1 = Object.create(geojson1_admin1);
      geo1.features = geo1.features.filter((item) => item.properties.NAME_0 == file);
      setshapes(geo1);
      setlevel(2);

    } else {
      const anchor = document.querySelector('#regionMap')
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    

  }, [file])


  useEffect(() => {
    console.log("level here here is", level);
    if (level==0){
      var num_events = filteredData.reduce(function (r, row) {
        r[row.name_0] = ++r[row.name_0] || 1;
        return r;
    },{})}
    else {
      var num_events = filteredData.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = ++r[row.name_1] || 1;
        return r;
      }, {});
      console.log("num events level 1", num_events);

    }
    setNumEvents(num_events);
    if (numEvents !== null){
    console.log("hello");
    console.log(countryKey);
    }
    


  }, [countryKey]);

  useEffect(() => {
    console.log("number of events is",numEvents[countryKey]);

  }, [numEvents]);

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
    if (file != 'Latin America') {
      var countries_tmp = Object.create(countries);
      var current_countries = countries_tmp.map(function (e) {
        return e.value;
      });
      if (!current_countries.includes(file)) {
        countries_tmp.push({ label: file, value: file })
      }
      setCountries(countries_tmp);
    }
  }, [shapes])

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
    if (fileflag != "Latin America") {
      filtered_data = filtered_data.filter((item) =>
        item.name_0 == fileflag
      );
    }
   

    var start_parsed = parseDate(StartDate)
    var end_parsed = parseDate(EndDate)

    filtered_data = filtered_data.filter((item) => {
      var date = new Date(item.date);
      return (date >= start_parsed && date <= end_parsed);
    });
    filtered_data_agg = filtered_data_agg.filter((item) => {
      var date = new Date(item.month_year);
      return (date >= start_parsed && date <= end_parsed);
    });
    setFilteredData(filtered_data);
    setFilteredData_agg(filtered_data_agg);
    console.log("level here is", level);
    

  }, [peNum, tarOutcome, wrongdoing, peViolence, StartDate, EndDate, fileflag, countries]);


  useEffect(() => {
    var occurences = filteredData_agg.reduce(function (r, row) {
      var val_name = dictionary.filter((item) => item.variable == var_chart & item.value == row[var_chart]).map((element) => element.name)[0];
      r[val_name] = ++r[val_name] || 1;
      return r;
    }, {});
    if (!Check) {
      Object.keys(occurences).forEach(key => occurences[key] = occurences[key] / (sumValues(population_admin0[0]) / 1000000));
    }
    var current_countries = [{
      label: 'Latin America', data: occurences,
      minBarLength: 2,
      fill: false, // use "True" to draw area-plot 
      borderColor: Colorscale['Latin America'],
      color: 'white',
      tickColor: 'white',
      backgroundColor: transparentize(Colorscale['Latin America'], 0.5),
      pointBackgroundColor: 'white',
      pointBorderColor: 'black',
      pointRadius: 5,
    }];

    current_countries.push(...countries.map(function (e) {
      var occurences = filteredData_agg.filter((item) => (item.name_0 == e.value)).reduce(function (r, row) {
        var val_name = dictionary.filter((item) => item.variable == var_chart & item.value == row[var_chart]).map((element) => element.name)[0];
        r[val_name] = ++r[val_name] || 1;
        return r;
      }, {})
      if (!Check) {
        Object.keys(occurences).forEach(key => occurences[key] = occurences[key] / (population_admin0[0][e.value] / 1000000));
      }
      return {
        label: e.value,
        data: occurences,
        minBarLength: 2,
        fill: false, // use "True" to draw area-plot 
        borderColor: Colorscale[e.value],
        color: 'white',
        tickColor: 'white',
        backgroundColor: transparentize(Colorscale[e.value], 0.5),
        pointBackgroundColor: 'black',
        pointBorderColor: 'black'
      }
    }));

    setBarData({
      labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
      datasets: current_countries,
    });
  }, [var_chart, countries, filteredData_agg, Check]);

  useEffect(() => {
    if (level == 0) {
      var gg = filteredData_agg.reduce(function (r, row) {
        r[row.name_0] = r[row.name_0] + row.id || row.id;
        return r;
      }, {});
      var groups = {};

      Object.keys(gg).forEach(key => groups[key] = 1000000 * gg[key] / population_admin0[0][key]);
      
    } else {
      var groups = filteredData_agg.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = r[row.name_1] + row.events_pop || row.events_pop;
        return r;
      }, {});
    }
    setheat(groups);
    console.log("groups are:", heat);

    var occurences = filteredData_agg.reduce(function (r, row) {
      var year = row['month_year'].slice(0, 4);
      r[year] = ++r[year] || 1;
      return r; //returns array with keys being the years and values the number of events 
    }, {});
    setOccs(occurences);
    console.log("occurences are", occs);
    if (!Check) {
      Object.keys(occurences).forEach(key => occurences[key] = occurences[key] / (sumValues(population_admin0[0]) / 1000000));
    }

    var current_countries = [{
      label: 'Latin America', data: occurences,
      fill: false, // use "True" to draw area-plot 
      borderColor: Colorscale['Latin America'],
      color: 'white',
      tickColor: 'white',
      backgroundColor: transparentize(Colorscale['Latin America'], 0.5),
      pointRadius: 5,
      tension: 0.3,
    }];
    current_countries.push(...countries.map(function (e) {
      var occurences = filteredData_agg.filter((item) => (item.name_0 == e.value)).reduce(function (r, row) {
        var year = row['month_year'].slice(0, 4);
        r[year] = ++r[year] || 1;
        return r;
      }, {});
      if (!Check) {
        Object.keys(occurences).forEach(key => occurences[key] = occurences[key] / (population_admin0[0][e.value] / 1000000));
      }

      return {
        label: e.value,
        data: occurences,
        fill: false, // use "True" to draw area-plot 
        borderColor: Colorscale[e.value],
        color: 'white',
        tickColor: 'white',
        backgroundColor: transparentize(Colorscale[e.value], 0.5),
        pointRadius: 5,
        tension: 0.3,
      }
    }));
    setLineData({
      labels: Object.keys(current_countries[0]['data']),
      datasets: current_countries,
    });
  }, [countries, filteredData_agg, Check]);

  async function fetchData(file) {
    const response = await fetch('/lyla/countries/' + file + '.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    setshapes(await response.json());
  }


  const reset_map = () => {
    setfile("Latin America");
  }

  const [mouseHover, setMouseHover] = useState(false);


  return (

    <div className="dark">
   
      <JoyRide 
        callback={handleJoyrideCallback}
        continuous={true}
        disableOverlay={false}
        disableScrolling={false}
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        run={runTour}
        steps={steps_joyride}
        styles={{  buttonClose: {
          display: 'none'
        }}}>Test</JoyRide>
     

      <Container>
        <Col md={4}>
          <div className='intro'  style={{ marginTop: "10pt" }}>
            <Row>
              <Col>
                <Button className="language" style={{
                    position: "absolute",
                    top: "10px",
                    left: "16px",
                    width: '60pt'
                  }} onClick={onClickLanguage}>{language}</Button>
              </Col>
              <Col>
                <Button className="tour" style={{
                  position: "absolute",
                  top: "10px",
                  left: "100px",
                  width: '90pt'}} onClick={() => setRunTour(true)}>{startTour}</Button>
              </Col>
              
            </Row>

            <Row>
              <h2 style={{left:"16px", marginTop:"15pt"}}>{title}</h2>
              <p style={{left:"16px",fontSize: "15pt", marginTop: "30pt" }}>{textTitle}</p>
          
            </Row>
            <Row>
            <Row> {/* text with number of events */}
              <EventsText className="txt-events" country={countryKey} num_events={numEvents}/>
              </Row>
                          
              <Row> {/*start country dropdown row*/}
                <Col md={4}>
                  <Form.Label className='mb-2 countrytext'>{countryText}</Form.Label>
                  <MultiSelect className='multi-select'
                    options={dictionary.filter((item) =>
                      item.variable == 'country'
                    ).map((element) => {
                      return { 'label': element.name, 'value': element.name }

                    })}
                    value={countries}
                    onChange={setCountries}
                    labelledBy="Select"
                  />
                </Col>
                <Col md={4}>
                  <br />
                  <Form.Check
                    className='num-events'
                    type='checkbox'
                    label={`# Events`}
                    id={`population`}
                    checked={Check}
                    onChange={() => setCheck(!Check)}
                  />
                </Col>
              </Row> {/*end country dropdown row */}
              <Row>{/*start charts row */}
                 <Line clasName="linechart" data={lineData}
                  // options= {/{scales: {x: {type: 'time'}}} }
                  options={options}/>
              </Row> 
              <Row>
                <Form.Select
                    className="barvariables"
                    value={var_chart}
                    onChange={event => setvar_chart(event.target.value)}>
                    <option value="pe_approxnumber">{numberPerpetrators}</option>
                    <option value="tar_wrongdoing">{allegedWrongdoing}</option>
                    <option value="tar_outcome">{worstOutcome}</option>
                    <option value="pe_violence">{violenceInflicted}</option>
                </Form.Select>
              </Row>
              <Row>
              <Bar className="barchart" options={optionsBar} data={barData} />
              </Row>
               
             {/*end charts row */}
             
             <Row>
                <Col md={2}>
                  <br/>
                  <DownloadComponent className="download" filteredData={eventData} />
                </Col>
                <Col md={2}>
                  <br/>
                  <DownloadCodebook className="codebook" style={{position:"absolute", left:"-300px"}}/>
                </Col>
             
                
              </Row> {/*end of download bttn row */}

              </Row>

              
          </div>
        </Col>
        <Col md={10}> {/* start map column*/}
          
            <Col>
              <Row>
                <Col>
              <Form.Label style={{ fontWeight: 'bold' }}>
                  {filterBy}

                </Form.Label>
                </Col>
                
             

              </Row>
              <Row>
                <Col md={3}>
                  <Row>
                    <Form.Label className='mb-2 filters'>
                      {allegedWrongdoing}&thinsp;
                      <FontAwesomeIcon icon="fa-solid fa-circle-info" title={" What was the lynched person accused of?"} />
                    </Form.Label>
        

                    <MultiSelect className='multi-select'

                      options={dictionary.filter((item) =>
                        item.variable == 'tar_wrongdoing'
                      ).map((element) => {
                        return { 'label': element.name, 'value': element.value }

                      })}
                      value={wrongdoing}
                      onChange={setWrongdoing}
                      labelledBy="Select"/>
                  </Row>
                  <Row>
                    <Form.Label className='mb-2'>

                      {violenceInflicted}&thinsp;
                      <FontAwesomeIcon icon="fa-solid fa-circle-info" title={"What kind of violence did the lynch mob use?"} />
                      </Form.Label>
                      <MultiSelect className='multi-select'
                      options={dictionary.filter((item) =>
                        item.variable == 'pe_violence'
                      ).map((element) => {
                        return { 'label': element.name, 'value': element.value }

                      })}
                      value={peViolence}
                      onChange={setPeViolence}
                      labelledBy="Select"
                    />
                  </Row>
                  

                </Col>
                <Col md={3}>
                <Row>
                  <Form.Label className='mb-2'>
                      {worstOutcome}&thinsp;
                      <FontAwesomeIcon icon="fa-solid fa-circle-info" title={"What physical consequences did the lynched person suffer?"} />
                    </Form.Label>
                    <MultiSelect className='multi-select'
                      options={dictionary.filter((item) =>
                        item.variable == 'tar_outcome'
                      ).map((element) => {
                        return { 'label': element.name, 'value': element.value }

                      })}
                      value={tarOutcome}
                      onChange={setTarOutcome}
                      labelledBy="Select"
                    />
                </Row>
                <Row>
                  <Form.Label className='mb-2'>
                    {numberPerpetrators}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={"How large was the lynch mob?"} />
                  </Form.Label>
                  <MultiSelect className='multi-select'
                    options={dictionary.filter((item) =>
                      item.variable == 'pe_approxnumber'
                    ).map((element) => {
                      return { 'label': element.name, 'value': element.value }

                    })}
                    value={peNum}
                    onChange={setPeNum}
                    labelledBy="Select"

                  />
                </Row>
                
                  
                
                </Col>
                <Col>
                  <DateSlider className="date" style={{position:"absolute", top:'200px', right:"200px"}} setSDate={setSDate} setEDate={setEDate} dateTitle={timeWindow} startDateText={startDateText} endDateText={endDateText}/>
            
                </Col>

               
            
                {/* 
                
                <Col>
                
                </Col> */}
              </Row>
           
              
            
              
              
    

            </Col>
            <Col>
            
            <Col>
              <Form.Check 
                    className='show-events'
                    type='checkbox'
                    label={showEvents}
                    id={`events`}
                    checked={Show}
                    onChange={() => setShow(!Show)}
              />
              </Col>
              </Col>
             
         
          
          <Row>
            <MapContainer
              className='regionMap'
              id="regionMap"
              bounds={outerBounds}
              whenCreated={setMap}
              fullscreenControl={true}
              center={center}
              zoom={7}
              scrollWheelZoom={false}
              style={{width: '100%', height: '1190px' }}>
              <TileLayer {...{
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
                url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
              }
              } />

              {fileflag != 'Latin America' && Show && filteredData.map(evt => (
                <CircleMarker
                  center={[evt.geometry.coordinates[0], evt.geometry.coordinates[1]]}
                  radius={evt.press_article == 'true' ? 7 : 2}
                  pane={"markerPane"}
                  fillOpacity={1}
                  color={evt.press_article == 'true' ? '#EA4335' : '#464342'}
                  fillColor={evt.press_article  ? 'white' : '#464342'}
                  strokeOpacity={0.5}
                  eventHandlers={{
                    mouseover: (event) => {
                      event.target.openPopup()
                      setMouseHover(true)
                    }
                  }}>
                  <Popup className='popup'>
                    {evt.name_1}, {evt.name_0} <br />
                    {evt.date} <br />
                    <table className="table-popup">
                      <tr>
                        <td> {allegedWrongdoing}:</td>
                        <td></td>
                        <td> &thinsp;{dictionary.filter((item) =>
                          item.variable == 'tar_wrongdoing' & item.value == evt.tar_wrongdoing).map((element) => {
                            return element.name
                          })} </td>
                      </tr>
                      <tr>
                        <td> {violenceInflicted}:</td>
                        <td></td>
                        <td> &thinsp;{dictionary.filter((item) =>
                          item.variable == 'pe_violence' & item.value == evt.pe_violence).map((element) => {
                            return element.name
                          })}</td>
                      </tr>
                      <tr>
                        <td> {worstOutcome}:</td>
                        <td></td>
                        <td> &thinsp;{dictionary.filter((item) =>
                          item.variable == 'tar_outcome' & item.value == evt.tar_outcome).map((element) => {
                            return element.name
                          })}</td>
                      </tr>
                    </table>
                    {evt.press_article == 'true' &&
                      <a href={evt.link} target="_blank">Link to article</a>}
                  </Popup>
                </CircleMarker>
              ))}

              <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key_id={fileflag} file={file} parentFunc={ParentFunction} num_events={numEvents}/>
              <Ocean geojson_data={geojson_ocean} key_id='key_geojson'/>
              <ResetMarker className='reset' setfile={setfile}></ResetMarker>
            </MapContainer>

          </Row>
      
              

            </Col> {/*end of map column */}
      </Container>

      <div className='intro-all' style={{ marginTop: "10pt" }}>
        
    
        <Container fluid>
          
          <Row> {/* second row after date (main row that includes dropdowns&download column, map column and country dropdown&charts ) */}

            
            <Col md={5}> {/*start country dropdown&charts column */}
              
            </Col> {/*end country dropdowns&charts col */}

          </Row>


        </Container>
      </div>
      <p className='final-text'>
        You can find more information and supporting material <a href="https://css.ethz.ch/en/research/datasets/lynching-in-latin-america.html" target="_blank">here</a>.</p>

    </div>



  );


};


export default App;