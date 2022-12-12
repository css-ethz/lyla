import { useEffect, useState, useMemo, useRef } from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Container, Row, Col, Form } from 'react-bootstrap';
import {
  MapContainer,
  TileLayer,
  GeoJSON, Marker, Popup,
  useMap, CircleMarker
} from 'react-leaflet'
import { Bar, Line } from "react-chartjs-2";
import L from 'leaflet';
import { Icon } from 'leaflet';
import geojson from './data/admin0.geojson.json'
import geojson1_admin1 from './data/admin1.geojson.json'
import eventData from './data/events_data.json'
//import eventData from './data/json_data_complete_latin3.json'
import eventData_orig from './data/LYLA_2022-9-21_latest.json'
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
import ResetMarker from './components/ResetMarker';
import { Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import colorLib from '@kurkle/color';
import { MultiSelect } from "react-multi-select-component";
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { Chart, registerables } from 'chart.js';
import CodeBookModal from './components/CodebokkPopUp';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { renderToStaticMarkup } from "react-dom/server";
import ReactDOMServer from 'react-dom/server';
import { divIcon } from "leaflet";
import myIcon from "./circle.svg";
import bogota from "./bogota.jpg";
import { batch, ScrollContainer, ScrollPage, StickyIn, Fade, FadeIn, Animator, Sticky, MoveOut, MoveIn } from 'react-scroll-motion';
//import { Steps } from 'intro.js-react';
//import 'intro.js/introjs.css';
import IconButton from '@mui/material/IconButton';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Ocean from './components/Ocean';
import OtherCountries from './components/OtherCountries';
import geojson_ocean from './data/ne_110m_ocean.geojson.json';
import geojson_others from './data/admin0_exclude.geojson.json';
import content from './data/content.json';
import EventsText from './components/EventsText';
import JoyRide, { STATUS } from 'react-joyride';
import DownloadCodebook from './components/CodebokkPopUp';
import {steps_joyride, steps_joyride_es} from './util/steps';
import ExportExcel from './components/ExcelExport';
import { getClockPickerUtilityClass } from '@mui/x-date-pickers';
import { getScopedCssBaselineUtilityClass } from '@mui/material';

Chart.register(...registerables);
delete L.Icon.Default.prototype._getIconUrl;
fontawesome.library.add(faCircleInfo);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
require('leaflet/dist/leaflet.css');
const center = [-75.4358446, -5.527726];
const outerBounds = [
  [-118.759383, 33.141569],
  [-25.975381,-52.155581]
  ,
]
//-179.99990,-60.34703,-23.24401,30.98005
const colors = ["fe4848", "fe6c58", "fe9068", "feb478", "fed686"];
const labels = ["2-12.5", "12.6-16.8", "16.9-20.9", "21-25.9", "26-plus"];



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
  const [Show, setShow] = useState(false);
  const [fileflag, setfileflag] = useState('Latin America');
  const [var_chart, setvar_chart] = useState('pe_approxnumber');
  const [isActive, setIsActive] = useState(true);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  /***************************************** START Translated variables ****************************************************/
  const [language, setLanguage] = useState("Español");
  const [lan, setLan] = useState("en");
  const [occs, setOccs] = useState(null);
  const [numEvents, setNumEvents] = useState(2818);
  const [zoom,setZoom]=useState(0)
  const [countryKey, setcountrykey] = useState('Latin America');
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState(steps_joyride);
  const [heat, setheat] = useState(() => {
    var groups = filteredData_agg.reduce(function (r, row) {
      r[row.name_0] = ++r[row.name_0] || 1;
      return r;
    }, {});
    return groups;
  });
  const options = {
    plugins: {
      title: {
        display: true,
        text: content['lineplot'][Check ? "events":'per_million'][lan],
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: content['barplot'][Check ? "events":'per_million'][lan],
      },
    },
    scales: {
      //x: {
       // ticks: {
       //   display: false
       // }

      //},
      yAxes:
      {
        gridLines: {
          display: "false"
        }
      },
      xAxes: [
        {
          ticks: {
            display: false
          },
          gridLines: {
            display: "false"
          }
        }
      ]
    }
  };
  
  
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
      setLan("es");

    }
    else {
      setLanguage("Español");
      setLan("en");
    };

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
    labels: dictionary.filter((item) => (item.variable == var_chart) && (item.name != "Not reported")).map((element) => element.name),
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
  // if (fileflag == 'Latin America') {
  //     console.log("check if value coincides with zoomed out country:",e.target.feature.properties.ADMIN); //check if value coincides with zoomed out country
  //     setfile(e.target.feature.properties.ADMIN);
  //     setcountrykey(e.target.feature.properties.ADMIN);
  //     //setEventsArrayKey(e.target.feature.properties.ADMIN);
  //     console.log("function triggered when clicking in heatmap, number of events here is:", numEvents);
      
        
  //   }
  setfile(e.target.feature.properties.ADMIN);
  //setEventsArrayKey(e.target.feature.properties.ADMIN);
  console.log("function triggered when clicking in heatmap, number of events here is:", numEvents);
  setcountrykey(e.target.feature.properties.ADMIN);
  console.log("countrykey", countryKey);
};
    /************************************************ end  ***********************************/

  useEffect(() => {
    if (Show){
      console.log("show is:", Show)
      setShow(!Show);
      setShow(!Show);
      if (level==2){
        setShow(true);
      }
    }
    if (level>2){
      setlevel(1);
    }
    
    var countries = ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
      "Costa Rica", "Dominican Republic", "Ecuador", "Guatemala", "Honduras",
      "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Uruguay", "Venezuela"]
    if (file == 'Latin America') {
      setshapes(geojson);
      setlevel(0);
      setcountrykey('Latin America');

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



  // function fittingBounds() {
  //   const map = useMap()
  //   console.log('map center:', map.getCenter())
  //   return null
  // }
  useEffect(() => {
    console.log("level here here is", level);
    if (level==0){
      var num_events = eventData.reduce(function (r, row) {
        r[row.name_0] = ++r[row.name_0] || 1;
        return r;
    },{})}
    else {
      var num_events = eventData.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = ++r[row.name_1] || 1;
        return r;
      }, {});
      console.log("num events level 1", num_events);

    }
    setNumEvents(num_events);
    if (numEvents !== null){
    console.log("hello");
    console.log(countryKey);
    //console.log("number of events is",numEvents[countryKey]);
    }
    


  }, [countryKey]);


  useEffect(() => {
    if(fileflag=='Latin America'){
      setShow(true);
    }else{
      setShow(true);
    }

  }, [fileflag]);


  
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
    /*     if (countries.length > 0) {
    
          filtered_data = filtered_data.filter((item) =>
          current_countries.includes(item.name_0)
          );
           filtered_data_agg = filtered_data_agg.filter((item) =>
          current_countries.includes(item.name_0)
          ); 
        } */

    /*     if (fileflag != 'Latin America') {
          filtered_data = filtered_data.filter((item) => item.name_0 == fileflag);
          filtered_data_agg = filtered_data_agg.filter((item) => item.name_0 == fileflag);
        } */

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
    setShow(!Show);
    if (!Show){
      setShow(true);
    }
    //console.log("number of events is", num_events);

  }, [peNum, tarOutcome, wrongdoing, peViolence, StartDate, EndDate, fileflag, countries]);


  useEffect(() => {
    var occurences = filteredData_agg.reduce(function (r, row) {
      var val_name = dictionary.filter((item) => item.variable == var_chart & item.value == row[var_chart]).map((element) => element.name)[0];
      if (typeof val_name === 'undefined'){
        val_name='Not reported'
      }
      r[val_name] = r[val_name]+row.id || row.id;
      return r;
    }, {});
    delete occurences["Not reported"];
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
        if (typeof val_name === 'undefined'){
          val_name='Not reported'
        }
        r[val_name] = r[val_name]+row.id || row.id;
        return r;
      }, {})
      delete occurences["Not reported"];
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
      labels: dictionary.filter((item) => (item.variable == var_chart)&&(item.name != "Not reported")).map((element) => element.name),
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
      r[year] = r[year] + row.id|| row.id;
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
      tension: 0.0,
    }];
    current_countries.push(...countries.map(function (e) {
      var occurences = filteredData_agg.filter((item) => (item.name_0 == e.value)).reduce(function (r, row) {
        var year = row['month_year'].slice(0, 4);
        r[year] = r[year] + row.id || row.id;
        return r;
      }, {});
      var years=['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019']
      years.forEach(key => occurences[key] = occurences[key] || 0 );
      if (!Check) {
        Object.keys(occurences).forEach(key => occurences[key] = occurences[key] / (population_admin0[0][e.value] / 1000000));
      }
      console.log("occurences here are:", occurences)
      return {
        label: e.value,
        data: occurences,
        fill: false, // use "True" to draw area-plot 
        borderColor: Colorscale[e.value],
        color: 'white',
        tickColor: 'white',
        backgroundColor: transparentize(Colorscale[e.value], 0.5),
        pointRadius: 5,
        tension: 0.0,
        options: {
          spanGaps: true // this is the property I found
       }
      }
    }));
    setLineData({
      labels: Object.keys(current_countries[0]['data']),
      datasets: current_countries,
    });
  }, [countries, filteredData_agg, Check]);

  useEffect(() => {
    if (lan=='en'){
      setSteps(steps_joyride);
    }else{
      setSteps(steps_joyride_es);
    }
  
  }, [lan]);

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
    setfile("Latin America");
  }
  // const iconMarkup = renderToStaticMarkup(
  //   <i class="fa fa-camera-retro"></i>
  // );
  // //const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon="fa fa-circle" />)
  // const customMarkerIcon = divIcon({
  //   html: iconMarkup,
  //   className: 'dummy'
  // });
  //onst circleIcon = <FontAwesomeIcon icon="fas fa-circle" />;
  const [mouseHover, setMouseHover] = useState(false);


  const getColor=(flag)=>{
    if (flag==1){
      if (zoom==1){
        return '#EEE394'
      }else{
        return '#EA4335'
      }
    }else{
      if (zoom==1){
        return '#464342'
      }else{
        return '#EA4335'
      }
    }
  }

  const getOpacity = (flag) =>{
    if (flag==1){
      if (zoom==1){
        return 0.8
      }else{
        return 1
      }
    }else{
      if (zoom==1){
        return 0.4
      }else{
        return 1
      }
    }

  }

  const getRadius = (flag) =>{
    if (flag==1){
      if (zoom==1){
        return 12
      }else{
        return 20
      }
    }else{
      if (zoom==1){
        return 4
      }else{
        return 8
      }
    }

  }

  return (

    <div className="dark">
      {/* <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        options={{
          tooltipClass: "customTooltip",
          scrollToElement: true,
        }}

      /> */}
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
        steps={steps}
        styles={{  buttonClose: {
          display: 'none'},
          options:{
            width: 500

          }}}></JoyRide>
      {/* <div className="intro-title">
        <p style={{ marginLeft: "60pt",marginTop: "0pt"}}>Lynching in<br />
          Latin America <br />
          (LYLA)</p>
        <p style={{ fontSize: "3vh", marginLeft: "60pt", marginRight: "60pt", marginTop: "50pt" }}>The Lynching in Latin America (LYLA) dataset is the first cross-national lynching event dataset. The LYLA data captures 2818 reported lynching events across 18 Latin American countries from 2010 to 2019.</p>
        <ExpandMoreIcon style={{ marginLeft: "500pt", marginBottom: "-500pt" }}></ExpandMoreIcon>
        <p style={{ fontSize: '2vh', marginLeft: "460pt", marginTop: "200pt" }}>{scrollDown}</p>

      </div> */}

      {/* <div>
          <IconButton size="large" color="inherit" onClick={() => setStepsEnabled(true)}>
                  <QuestionMarkIcon />
          </IconButton>

        </div>  */}
     

      <div className='cover'>
      
     
      
      
       
        {/* Use sizes relative to screen size */}
        <img src={require("./eth_logo_kurz_neg.png")} style={{height:'50px'}}/>
        <div className='flex-container'>
          <Button className="language" style={{
                  right: "2vw",
                  maxWidth: '9vmax',
                  maxHeight: '60pt',
                  textAlign: 'center',
                  backgroundColor:"transparent",
                  border: "2px solid white",
                  display:"flex",
                  justifyContent:"space-between"
                }} onClick={onClickLanguage}>{language}</Button>
          <Button className="tour" style={{
                right: "22vmin",
                display:"flex",
                maxWidth: '90pt',
                maxHeight: '60pt',
                marginLeft: '10pt',
                backgroundColor:"transparent",
                border: "2px solid white"}} onClick={() => setRunTour(true)}>{content['startTour'][lan]}</Button>
           
          

        </div>
        
      
        <h1 style={{ fontSize: "8vmin", marginLeft: "9vw", marginRight: "1vw", marginTop: "20vh" }}>{content['title'][lan]}</h1>
        
        <p style={{ fontSize: "15pt", marginLeft: "9vw", marginRight: "20vw", marginTop: "10vh" }}>
          {content['text'][lan]}<a style={{color: "inherit"}} href="https://css.ethz.ch/en/research/datasets/lynching-in-latin-america.html" target="_blank">{content['info-ref'][lan]}</a>.
        </p>
        <Row className="download" style={{positions:"absolute", marginLeft:"8%", marginTop:"5%"}}>
              <Col>
              <ExportExcel excelData={eventData_orig} fileName={'LYLA_2022-9-21'} text={content['downloadText'][lan]}/>
                
              </Col>
        </Row>
        <Row  style={{positions:"absolute", marginLeft:"8%", marginTop:"10px"}}>
        <Col>
              <DownloadCodebook style={{width:"60px"}}/>
              </Col>
        </Row>
             
              
          
        
      
       
        
        <p style={{opacity:"0.3",position:"absolute", bottom:"20pt", right: "22vmin"}}>Image by <a style={{color: "inherit"}} target="_blank" href="https://unsplash.com/@iequezada"> Isaac Quezada</a></p>
      </div>
      <div className='intro' style={{ marginTop: "10pt" }}>
        <h2 style={{marginLeft: "10pt",marginTop:"40pt"}}>{content['title'][lan]}</h2>
        
    
        <div style={{marginLeft: "15pt",marginRight:"15pt"}}>
          
          <Row className="filters" style={{display:'flex', justifyContent:'center'}}>
            <Col md={8}>
              <Row>
                <Col md={4}>
                  <Form.Label style={{ fontWeight: 'bold' }}>
                        {content['filterBy'][lan]}

                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <Form.Label className='mb-3 line-break'>
                        {content['allegedWrongdoing'][lan]}&thinsp;
                        <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['allegedWrongdoingInfo'][lan]} />
                  </Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label className='mb-3 line-break'>
                    {content['worstOutcome'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['worstOutcomeInfo'][lan]} />
                  </Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label className='mb-3 line-break'>

                    {content['violenceInflicted'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['violenceInflictedInfo'][lan]} />
                  </Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label className='mb-3 line-break' style={{marginBottom:'40vh'}}>
                    {content['numberPerpetrators'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['numberPerpetratorsInfo'][lan]} />
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                 

                  <MultiSelect className='multi-select'

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

                <Col md={3}>
                 
                  <MultiSelect   className='multi-select'
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
                <Col md={3}>
                  
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
                </Col>
                <Col md={3}>
                  
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
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <br/>
              <DateSlider style={{fontSize:"10px"}} className="date" setSDate={setSDate} setEDate={setEDate} dateTitle={content['timeWindow'][lan]} startDateText={content['startDateText'][lan]} endDateText={content['endDateText'][lan]}/>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Row>
                <Col md={2}>
                  <Form.Check 
                            type='checkbox'
                            label={content['showEvents'][lan]}
                            id={`events`}
                            checked={Show}
                            onChange={() => setShow(!Show)}
                    />
                </Col>
                <Col md={10}>
                  <EventsText country={countryKey} num_events={numEvents} content={content} lan={lan}/>
              
                </Col>
              </Row>

            
              <Row>
                <Col md={12}>
                  <MapContainer
                      className='regionMap'
                      id={"regionMap"}
                      bounds={outerBounds}
                      whenCreated={setMap}
                      fullscreenControl={true}
                      center={center}
                      zoom={4}
                      scrollWheelZoom={false}
                      style={{ width: '100%', height: '1100px' }}>
                      <TileLayer {...{
                        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
                        url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
                      }
                      } />
                      <Heatmap geojson_data={shapes} heat={heat} setfile={setfile} key_id={fileflag} file={file} parentFunc={ParentFunction} num_events={numEvents} lan={lan} setZoom={setZoom}/>
                     

                      {Show && filteredData.map(evt => (
                        <CircleMarker
                          center={[evt.geometry.coordinates[0], evt.geometry.coordinates[1]]}
                          radius={evt.press_article == 'true' ? getRadius(1):getRadius(0)}
                          pane={evt.press_article == 'true' ? "locationMarker":"markerPane"}
                          fillOpacity={evt.press_article == 'true' ? getOpacity(1):getOpacity(0)} 
                          style={{zIndex: evt.press_article == 'true' ? 999:0}}
                          pathOptions={{
                            weight:0,
                            //color: evt.press_article == 'true'  ? getColor(1):getColor(0),
                            fillColor:evt.press_article == 'true'  ? getColor(1):getColor(0),

                            
                          }}
                          /* {evt.press_article == 'true' ? '#EA4335' : '#464342'} */
                          
                          strokeOpacity={0.5}
                          eventHandlers={{
                            mouseover: (event) => {
                              event.target.openPopup()
                              setMouseHover(true)
                            },
                            mouseout: (e) => {
                              setTimeout(() => {
                                e.target.closePopup();
                              }, 1000);
                            },
                          }}>
                          <Popup className='popup' pane="popupPane">
                            {/* <img className="popup-img" src={bogota} alt="bogota" /><br/> */}
                            
                            {/* {evt.header} <br /> */}
                            {evt.press_article == 'true' && 
                              lan == 'es' ? <h5>{evt.header_es}</h5> : <h5>{evt.header_en}</h5>}

                            {evt.press_article == 'true' && <br/>}
                            {evt.press_article == 'true' &&

                              <a href={evt.link} target="_blank">{content['link_article'][lan]}</a>}
                            <br/>{evt.name_1}, {evt.name_0} <br />
                            {evt.date} <br />
                            <table className="table-popup">
                              <tr>
                                <td> {content['allegedWrongdoing'][lan]}:</td>
                                <td></td>
                                <td> &thinsp;{dictionary.filter((item) =>
                                  item.variable == 'tar_wrongdoing' & item.value == evt.tar_wrongdoing).map((element) => {
                                    return element.name
                                  })} </td>
                              </tr>
                              <tr>
                                <td> {content['violenceInflicted'][lan]}:</td>
                                <td></td>
                                <td> &thinsp;{dictionary.filter((item) =>
                                  item.variable == 'pe_violence' & item.value == evt.pe_violence).map((element) => {
                                    return element.name
                                  })}</td>
                              </tr>
                              <tr>
                                <td> {content['worstOutcome'][lan]}:</td>
                                <td></td>
                                <td> &thinsp;{dictionary.filter((item) =>
                                  item.variable == 'tar_outcome' & item.value == evt.tar_outcome).map((element) => {
                                    return element.name
                                  })}</td>
                              </tr>
                            </table>
                            
                          </Popup>
                        </CircleMarker>
                      ))}

                      <Ocean geojson_data={geojson_ocean} key_id='key_geojson'/>
                      <OtherCountries geojson_data={geojson_others} key_id='key_geojson'/>
                      
                      <ResetMarker className='reset' setfile={setfile}></ResetMarker>
                  </MapContainer>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <Row>
                <Col md={9}>
                  <br/>
                  <br/>
                  <Form.Label className='mb-2'>{content['countryText'][lan]}</Form.Label>
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
                <Col md={3}>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <Form.Check
                          type='checkbox'
                          label={content['numEvents'][lan]}
                          id={`population`}
                          checked={Check}
                          onChange={() => setCheck(!Check)}
                        />
                </Col>
              </Row>
              <Row>
                <Line className="linechart" data={lineData}
                        // options= {/{scales: {x: {type: 'time'}}} }
                        options={options}/>

              </Row>
              <Row>
                <Col md={9}>
                  <br/>
                  <br/>
                  <Form.Select
                          value={var_chart}
                          onChange={event => setvar_chart(event.target.value)}>
                          <option value="pe_approxnumber">{content['numberPerpetrators'][lan]}</option>
                          <option value="tar_wrongdoing">{content['allegedWrongdoing'][lan]}</option>
                          <option value="tar_outcome">{content['worstOutcome'][lan]}</option>
                          <option value="pe_violence">{content['violenceInflicted'][lan]}</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Bar className="barchart" style={{height: '70vh'}} options={optionsBar} data={barData} />
                </Col>
              </Row>
            </Col>
          </Row>
         
        </div>
      </div>
      
      <p style={{fontSize:"10pt", marginLeft:'15px'}}>Website created by <a style={{color: "inherit"}} href="https://cristyguzman.github.io/" target="_blank"> Cristina Guzman</a> and <a style={{color: "inherit"}} href="https://feradauto.github.io/" target="_blank">Fernando Gonzalez</a>.</p>
      <img src={require("./eth_logo_kurz_neg.png")} style={{height:'50px', marginBottom: '10px', marginTop:'-15px'}}/>
      

    </div>



  );


};


export default App;