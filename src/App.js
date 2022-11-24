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
import eventData from './data/json_data_complete_latin3.json'
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
import { Button } from 'react-bootstrap'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
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
import geojson_ocean from './data/ne_110m_ocean.geojson.json';
import EventsText from './components/EventsText';
import JoyRide, { STATUS } from 'react-joyride';

Chart.register(...registerables);
delete L.Icon.Default.prototype._getIconUrl;
fontawesome.library.add(faCircleInfo);

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

  const steps_joyride = [
    {title: "Welcome to the LYLA Dashboard",
    content: "This web application enables researchers and journalists to analyze lynching events in Latin America.", 
    target: ".intro", 
    placement:"center",
    floaterProps: {
      hideArrow: true
    },
    disableBeacon: true,
    styles: {
      options: {
        width: 200,
      }

    }},

    {title: "Hello map", 
    content: "this is the interactive map", 
    target: ".regionMap", 
    placement:"right",
    isFixed: true,
    styles: {
      options: {
        zIndex: 1000,
        width: 200,
        height: 100
        
      }

    }},
    {title: "Reset button ", 
    content: "you can click here to reset the map to display the entire latin america", 
    target: ".reset", 
    
    floaterProps: {
      hideArrow: true
    },
    styles: {
      options: {
        zIndex: 1000,
        width: 200,
        height: 100,
        overlayColor: 'rgba(79, 26, 0, 0.4)',
        
      }

    }},
    ];

  
  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };

  
  const steps = [
    {
      title: "Welcome to the LYLA Dashboard",
      element: ".intro",
      intro: "This web application enables researchers and journalists to analyze lynching events in Latin America."
    },
    {
      title: "Choose a time window",
      element: ".intro",
      intro: "With this slidebar you can filter the dates of the events. Slide the left button to update the start date and the right button for the end date."
    },
    {
      title: "Filter By variables",
      element: ".intro",
      intro: "You can filter the displayed events by selecting different values for each of the filters shown below. Click on the info buttons next to the variable names for a description of each variable. These filters update the map and charts shown below on the right side. All possible values for all variables are selected as default."
    },
    {
      title: "Interactive map",
      element: ".regionMap",
      intro: "The initial map shown below displays 11 events for which a link to the source article is provided. Countries are colored based on the number of lynching events per million inhabitants. You can click on a country to see all lynching events "
    },
    {
      title: "Reported lynching events over time",
      element: ".intro",
      intro: "on the right hand side of the page you can find a line chart. This line chart displays as default the total number of lynching events in Latin America for each year on the range given in the date slidebar. You can add more line charts by selecting countries either by clicking on the map ot by using the dropdown button right on top of the line chart. "
    },
    {
      title: "Reported lynching events per variable",
      element: ".intro",
      intro: "Below the line chart you can find a bar chart containg the number of events for a given variable. The default displays the total number of lynching events in Latin America for a varying number of perpetrators per event, each category corresponding to a bar."
    }
  ];

  const onExit = () => {
    setStepsEnabled(false);
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



  // function fittingBounds() {
  //   const map = useMap()
  //   console.log('map center:', map.getCenter())
  //   return null
  // }
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
    //console.log("number of events is",numEvents[countryKey]);
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
    
    //console.log("number of events is", num_events);

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
        steps={steps_joyride}
        styles={{  buttonClose: {
          display: 'none'
        }}}>Test</JoyRide>
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



      <div className='intro' style={{ marginTop: "10pt" }}>
        <h2 style={{marginLeft: "10pt",marginTop:"0pt"}}>Lynching in Latin America</h2>
        <p style={{ fontSize: "15pt", marginLeft: "10pt", marginRight: "60pt", marginTop: "10pt" }}>The Lynching in Latin America (LYLA) dataset is the first cross-national lynching event dataset. The LYLA data captures 2818 reported lynching events across 18 Latin American countries from 2010 to 2019.</p>
        
    
        <Container>
          <Col md={11}></Col>
          <Col md={1}>
            <Row>
              {/*<CodeBookModal/>*/}
              <Button style={{
                position: "absolute",
                top: "10px",
                right: "16px",
                width: '60pt'
              }} onClick={onClickLanguage}>{language}</Button>
            </Row>
            <Row>
              <Button style={{
                position: "absolute",
                top: "60px",
                right: "16px",
                width: '60pt'}} onClick={() => setRunTour(true)}>Start tour</Button>
            </Row>
          </Col>
        </Container>
        <Container fluid>
          <Row className='date'>
            <Col md={1}></Col>
            <Col md={6}>
              <DateSlider className="date" setSDate={setSDate} setEDate={setEDate} />
            </Col>
            <Col md={5}></Col>
          </Row>
          <Row> {/* second row after date (main row that includes dropdowns&download column, map column and country dropdown&charts ) */}

            <Col md={2}> {/*column with dropdowns and download bttn*/}
              <Row>
                <Form.Label style={{ fontWeight: 'bold' }}>
                  {filterBy}

                </Form.Label>

              </Row>
              <Row>
                <Form.Label className='mb-2'>
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
                  labelledBy="Select"

                />
              </Row>
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
              <Row>
              <Col md={12}>
                <br/>
                <Form.Check 
                      type='checkbox'
                      label={`Show events`}
                      id={`events`}
                      checked={Show}
                      onChange={() => setShow(!Show)}
                />
                </Col>
              </Row>
              {/* </Col>
            <Col md={2}>
              
            </Col>
            <Col md={2}>
             
            </Col>
            <Col md={2}>
              
            </Col> */}

              {/* <Col md={2}>
              <Form.Label className='mb-2'>Country</Form.Label>
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
            </Col> */}

              <Row>
                <Col md={2}>
                  <br/>
                  <DownloadComponent filteredData={eventData} />
                </Col>
                {/*             <Col md={3}>
                            <Button onClick={reset_map}>Reset map</Button>
                          </Col> */}
                {/* </Row> */}
                {/* </Container>

                    </div>
                    <div>
                      <Container fluid>
                        <Row> */}
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
              </Row> {/*end of download bttn row */}
              <Row> {/* text with number of events */}
              <EventsText country={countryKey} num_events={numEvents}/>
              </Row>
            </Col> {/*end of dropdowns column */}
            <Col md={5}> {/* start map column*/}
              <MapContainer
                className='regionMap'
                id="regionMap"
                bounds={outerBounds}
                whenCreated={setMap}
                fullscreenControl={true}
                center={center}
                zoom={4}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '760px' , zIndex: '1'}}
              >
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
                      {/* <img className="popup-img" src={bogota} alt="bogota" /><br/> */}
                      {evt.name_1}, {evt.name_0} <br />
                      {evt.date} <br />
                      {/* {evt.header} <br /> */}
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

            </Col> {/*end of map column */}
            <Col md={5}> {/*start country dropdown&charts column */}
              <Row> {/*start country dropdown row*/}
                <Col md={8}>
                  <Form.Label className='mb-2'>{countryText}</Form.Label>
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
                    type='checkbox'
                    label={`# Events`}
                    id={`population`}
                    checked={Check}
                    onChange={() => setCheck(!Check)}
                  />
                </Col>
              </Row> {/*end country dropdown row */}
              <Row>{/*start charts row */}
                <Col md={12}>
                  <Line data={lineData}
                    // options= {/{scales: {x: {type: 'time'}}} }
                    options={options}
                  />
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={var_chart}
                    onChange={event => setvar_chart(event.target.value)}>
                    <option value="pe_approxnumber">{numberPerpetrators}</option>
                    <option value="tar_wrongdoing">{allegedWrongdoing}</option>
                    <option value="tar_outcome">{worstOutcome}</option>
                    <option value="pe_violence">{violenceInflicted}</option>
                  </Form.Select>

                </Col>
                <Col md={12}>
                  <Bar options={optionsBar} data={barData} />
                </Col>
              </Row> {/*end charts row */}

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