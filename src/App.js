import { useEffect, useState } from 'react';
import "@progress/kendo-theme-default/dist/all.css";
import { Row, Col, Form } from 'react-bootstrap';
import {MapContainer,TileLayer,Popup,CircleMarker} from 'react-leaflet'
import { Bar, Line } from "react-chartjs-2";
import L from 'leaflet';
import geojson from './data/admin0.geojson.json'
import geojson1_admin1 from './data/admin1.geojson.json'
import eventData from './data/events_data.json'
import eventData_orig from './data/LYLA_2022-9-21_latest.json'
import aggData from './data/data_agg.json'
import population_admin0 from './data/population_admin0.json'
import dictionary from './data/dictionary.json'
import './App.css'
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateSlider from './components/DateSlider';
import Heatmap from './components/Heatmap';
import ResetMarker from './components/ResetMarker';
import { Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import colorLib from '@kurkle/color';
import { MultiSelect } from "react-multi-select-component";
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Ocean from './components/Ocean';
import OtherCountries from './components/OtherCountries';
import geojson_ocean from './data/ne_110m_ocean.geojson.json';
import geojson_others from './data/admin0_exclude.geojson.json';
import content from './data/content.json';
import EventsText from './components/EventsText';
import JoyRide, { STATUS } from 'react-joyride';
import DownloadCodebook from './components/CodebokkPopUp';
import { steps_joyride, steps_joyride_es } from './util/steps';
import ExportExcel from './components/ExcelExport';
import ReactGA from "react-ga4";
Chart.register(...registerables);
delete L.Icon.Default.prototype._getIconUrl;
fontawesome.library.add(faCircleInfo);
ReactGA.initialize([
  {
    trackingId: "G-VK2EWMHCWG",
  }
]);

// Send pageview with a custom path
ReactGA.send({ hitType: "pageview" });
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
require('leaflet/dist/leaflet.css');
const center = [-75.4358446, -5.527726];
const outerBounds = [
  [-118.759383, 33.141569],
  [-25.975381, -52.155581]
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
  const [StartDate, setSDate] = useState("01/01/2010");
  const [EndDate, setEDate] = useState("31/12/2019");
  const [shapes, setshapes] = useState(geojson);
  const [file, setfile] = useState('Latin America');
  const [level, setlevel] = useState(0);
  const [Check, setCheck] = useState(false);
  const [Show, setShow] = useState(true);
  const [fileflag, setfileflag] = useState('Latin America');
  const [var_chart, setvar_chart] = useState('pe_approxnumber');
  const [language, setLanguage] = useState("Español");
  const [lan, setLan] = useState("en");
  const [occs, setOccs] = useState(null);
  const [numEvents, setNumEvents] = useState(2818);
  const [zoom, setZoom] = useState(1)
  const [countryKey, setcountrykey] = useState('Latin America');
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState(steps_joyride);
  const Colorscale = {
    'Latin America': '#fafa6e', 'Argentina': '#00968e', 'Brazil': '#4abd8c', 'Chile': '#106e7c',
    'Mexico': '#9cdf7c', 'Peru': '#2a4858', "Bolivia": "#B1C6ED", "Colombia": "#B7E6DD",
    "Costa Rica": "#DFD3EA", "Dominican Republic": "#E3533F", "Ecuador": "#C5F08E", "Guatemala": "#E4A78E", "Honduras": "#A08EE4",
    "Nicaragua": "#ECBAC5", "Panama": "#899199", "Paraguay": "#5ADCD4", "Uruguay": "#E79456", "Venezuela": "#C4AC9A"
  };
  // Options for Line and Bar charts
  const options = {
    plugins: {
      title: {
        display: true,
        text: content['lineplot'][Check ? "events" : 'per_million'][lan],
      },
    }
  };
  const optionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: content['barplot'][Check ? "events" : 'per_million'][lan],
      },
    }
  };
  // language
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
  // tutorial
  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };
  // functions
  const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  function transparentize(value, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }
  const ParentFunction = (e) => {
    setfile(e.target.feature.properties.ADMIN);
  };
  const getColor = (flag) => {
    if (flag == 1) {
      if (zoom == 1) {
        return '#EEE394'
      } else {
        return '#EA4335'
      }
    } else {
      if (zoom == 1) {
        return '#464342'
      } else {
        return '#EA4335'
      }
    }
  }

  const getOpacity = (flag) => {
    if (flag == 1) {
      if (zoom == 1) {
        return 0.8
      } else {
        return 1
      }
    } else {
      if (zoom == 1) {
        return 0.4
      } else {
        return 1
      }
    }

  }
  const getRadius = (flag) => {
    if (flag == 1) {
      if (zoom == 1) {
        return 12
      } else {
        return 20
      }
    } else {
      if (zoom == 1) {
        return 4
      } else {
        return 8
      }
    }

  }
  // State initializations
  const [barData, setBarData] = useState({
    labels: dictionary.filter((item) => (item.variable == var_chart) && (item.name != "Not reported")).map((element) => element.name),
    datasets: [],
  });
  const [lineData, setLineData] = useState({
    labels: dictionary.filter((item) => item.variable == var_chart).map((element) => element.name),
    datasets: [],
  });
  const [heat, setheat] = useState(() => {
    var groups = filteredData_agg.reduce(function (r, row) {
      r[row.name_0] = r[row.name_0] + row.events_pop || row.events_pop;
      return r;
    }, {});
    return groups;
  });

  useEffect(() => {
    if (lan == 'en') {
      setSteps(steps_joyride);
    } else {
      setSteps(steps_joyride_es);
    }

  }, [lan]);

  // Set geojson country or Latin America
  useEffect(() => {
    if (level > 2) {
      setlevel(1);
    }
    var countries = ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
      "Costa Rica", "Dominican Republic", "Ecuador", "Guatemala", "Honduras",
      "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Uruguay", "Venezuela"]
    if (file == 'Latin America') {
      setshapes(geojson);
      setlevel(0);
      setcountrykey('Latin America');

    }
    else if (countries.includes(file)) {
      var geo1 = Object.create(geojson1_admin1);
      geo1.features = geo1.features.filter((item) => item.properties.NAME_0 == file);
      setshapes(geo1);
      setlevel(1);
      setcountrykey(file);

    }else{
      setlevel(2);
      setcountrykey(file);
      
    }
  }, [file])

// Count total events per region
  useEffect(() => {
    if (level <2) {
      var num_events = eventData.reduce(function (r, row) {
        r[row.name_0] = ++r[row.name_0] || 1;
        return r;
      }, {})
    }
    else {
      var num_events = eventData.filter((item) => item.name_0 == fileflag).reduce(function (r, row) {
        r[row.name_1] = ++r[row.name_1] || 1;
        return r;
      }, {});

    }
    setNumEvents(num_events);

  }, [countryKey]);

// compute values for heatmap and add country to list
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
// Apply filters
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
  }, [peNum, tarOutcome, wrongdoing, peViolence, StartDate, EndDate, fileflag, countries]);

// Compute data Barchart
  useEffect(() => {
    var occurences = filteredData_agg.reduce(function (r, row) {
      var val_name = dictionary.filter((item) => item.variable == var_chart & item.value == row[var_chart]).map((element) => element.name)[0];
      if (typeof val_name === 'undefined') {
        val_name = 'Not reported'
      }
      r[val_name] = r[val_name] + row.id || row.id;
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
        if (typeof val_name === 'undefined') {
          val_name = 'Not reported'
        }
        r[val_name] = r[val_name] + row.id || row.id;
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
      labels: dictionary.filter((item) => (item.variable == var_chart) && (item.name != "Not reported")).map((element) => element.name),
      datasets: current_countries,
    });
  }, [var_chart, countries, filteredData_agg, Check]);

  // Compute data linechart
  useEffect(() => {
    // Aggregate all LatinAmerica or by country
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

    var occurences = filteredData_agg.reduce(function (r, row) {
      var year = row['month_year'].slice(0, 4);
      r[year] = r[year] + row.id || row.id;
      return r; //returns array with keys being the years and values the number of events 
    }, {});

    const index_s = StartDate.lastIndexOf('/');
    const index_e = EndDate.lastIndexOf('/');
    const yr_s = StartDate.slice(index_s + 1);
    const yr_e = EndDate.slice(index_e + 1);
    const num_years = parseInt(yr_e) - parseInt(yr_s) + 1;
    const years = [...Array(num_years).keys()].map(i => (i + parseInt(yr_s)).toString());

    years.forEach(key => occurences[key] = occurences[key] || 0);

    setOccs(occurences);
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
      
      const index_s = StartDate.lastIndexOf('/');
      const index_e = EndDate.lastIndexOf('/');
      const yr_s = StartDate.slice(index_s + 1);
      const yr_e = EndDate.slice(index_e + 1);
      const num_years = parseInt(yr_e) - parseInt(yr_s) + 1;
      const years = [...Array(num_years).keys()].map(i => (i + parseInt(yr_s)).toString());
      years.forEach(key => occurences[key] = occurences[key] || 0);


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
        steps={steps}
        styles={{
          buttonClose: {
            display: 'none'
          },
          options: {
            width: 500

          }
        }}></JoyRide>
     


      <div className='cover'>
        <img src={require("./eth_logo_kurz_neg.png")} style={{ height: '50px' }} />
        <div className='flex-container'>
          <Button className="language" style={{
            right: "2vw",
            maxWidth: '9vmax',
            maxHeight: '60pt',
            textAlign: 'center',
            backgroundColor: "transparent",
            border: "2px solid white",
            paddingLeft:"12px",
            paddingRight:"12px",
            display: "flex",
            fontSize: "1.1vmax",
            justifyContent: "space-between"
          }} onClick={onClickLanguage}>{language}</Button>
          <Button className="tour" style={{
            right: "22vmin",
            display: "flex",
            maxWidth: '90pt',
            maxHeight: '60pt',
            marginLeft: '10pt',
            paddingLeft:"12px",
            paddingRight:"12px",
            fontSize: "1.1vmax",
            backgroundColor: "transparent",
            border: "2px solid white"
          }} onClick={() => setRunTour(true)}>{content['startTour'][lan]}</Button>
        </div>
        <h1 style={{ fontSize: "8vmin", marginLeft: "9vw", marginRight: "1vw", marginTop: "17vh" }}>{content['title'][lan]}</h1>

        <p style={{ fontSize: "15pt", marginLeft: "9vw", marginRight: "20vw", marginTop: "10vh" }}>
          {content['text'][lan]}<a style={{ color: "inherit" }} href="https://css.ethz.ch/en/research/datasets/lynching-in-latin-america.html" target="_blank">{content['info-ref'][lan]}</a>.
        </p>
        <Row className="download" style={{ positions: "absolute", marginLeft: "8%", marginTop: "5%" }}>
          <Col>
            <ExportExcel excelData={eventData_orig} fileName={'LYLA_2022-9-21'} text={content['downloadText'][lan]} />

          </Col>
        </Row>
        <Row style={{ positions: "absolute", marginLeft: "8%", marginTop: "10px" }}>
          <Col>
            <DownloadCodebook style={{ width: "60px" }} />
          </Col>
        </Row>

        <p style={{ opacity: "0.3", fontSize: "2vmin", position: "absolute", bottom: "20pt", right: "11vmin" }}>Image by <a style={{ color: "inherit" }} target="_blank" href="https://unsplash.com/@iequezada"> Isaac Quezada</a></p>
      </div>
      <div className='intro' style={{ marginTop: "10pt" }}>
        <h2 style={{ marginLeft: "10pt", marginTop: "40pt" }}>{content['title'][lan]}</h2>


        <div style={{ marginLeft: "15pt", marginRight: "15pt" }}>

          <Row className="filters" style={{ display: 'flex', justifyContent: 'center' }}>
            <Col xs={12} sm={12} lg={8}  >
              <Row>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Label style={{ fontWeight: 'bold' }}>
                    {content['filterBy'][lan]}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <Form.Label className='mb-3 line-break' style={{ fontSize: '0.8rem' }}>
                    {content['allegedWrongdoing'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['allegedWrongdoingInfo'][lan]} />
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
                </Col>
                <Col xs={12} sm={12} lg={3}>
                  <Form.Label className='mb-3 line-break' style={{ fontSize: '0.8rem' }}>
                    {content['worstOutcome'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['worstOutcomeInfo'][lan]} />
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
                </Col>
                <Col xs={12} sm={12} lg={3}>
                  <Form.Label className='mb-3 line-break' style={{ fontSize: '0.8rem' }}>

                    {content['violenceInflicted'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['violenceInflictedInfo'][lan]} />
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
                </Col>
                <Col xs={12} sm={12} lg={3}>
                  <Form.Label className='mb-3 line-break' style={{ marginBottom: '40vh', fontSize: '0.8rem' }}>
                    {content['numberPerpetrators'][lan]}&thinsp;
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" title={content['numberPerpetratorsInfo'][lan]} />
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
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} lg={4}>
              <br />
              <DateSlider style={{ fontSize: "10px" }} className="date" setSDate={setSDate} setEDate={setEDate} dateTitle={content['timeWindow'][lan]} startDateText={content['startDateText'][lan]} endDateText={content['endDateText'][lan]} />
            </Col>
          </Row>
          <Row>
            <Col lg={8} sm={12} xs={12}>
              <Row>
                <Col lg={2} sm={12} xs={12}>
                  <Form.Check
                    type='checkbox'
                    label={content['showEvents'][lan]}
                    id={`events`}
                    checked={Show}
                    onChange={() => setShow(!Show)}
                  />
                </Col>
                <Col lg={10}>
                  <EventsText country={countryKey} num_events={numEvents} content={content} lan={lan} />

                </Col>
              </Row>


              <Row>
                <Col lg={12}>
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
                    <Heatmap geojson_data={shapes} heat={heat} key_id={fileflag} file={file} parentFunc={ParentFunction} lan={lan} setZoom={setZoom} />


                    {Show && filteredData.map(evt => (
                      <CircleMarker
                        center={[evt.geometry.coordinates[0], evt.geometry.coordinates[1]]}
                        radius={evt.press_article == 'true' ? getRadius(1) : getRadius(0)}
                        key={evt.id}
                        fillOpacity={evt.press_article == 'true' ? getOpacity(1) : getOpacity(0)}
                        pane={evt.press_article == 'true' ? "locationMarker" : "normalPane"}
                        style={{ zIndex: evt.press_article == 'true' ? 999 : 0 }}
                        pathOptions={{
                          weight: 0,
                          fillColor: evt.press_article == 'true' ? getColor(1) : getColor(0),
                        }}
                        strokeOpacity={0.5}
                        eventHandlers={{
                          mouseover: (event) => {
                            event.target.openPopup();
                          },
                          mouseout: (e) => {
                            setTimeout(() => {
                              e.target.closePopup();
                            }, 1000);
                          },
                        }}>
                        <Popup className='popup' pane="popupPane">
                        
                          {evt.press_article == 'true' &&
                            lan == 'es' ? <h5>{evt.header_es}</h5> : <h5>{evt.header_en}</h5>}

                          {evt.press_article == 'true' && <br />}
                          {evt.press_article == 'true' &&

                            <a href={evt.link} target="_blank">{content['link_article'][lan]}</a>}
                          <br />{evt.name_1}, {evt.name_0} <br />
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

                    <Ocean geojson_data={geojson_ocean} key_id='key_geojson' />
                    <OtherCountries geojson_data={geojson_others} key_id='key_geojson' />

                    <ResetMarker className='reset' setfile={setfile}></ResetMarker>
                  </MapContainer>
                </Col>
              </Row>
            </Col>
            <Col lg={4} sm={12} xs={12}>
              <Row>
                <Col lg={9} sm={12} xs={12}>
                  <br />
                  <br />
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
                <Col lg={3} sm={12} xs={12}>
                  <br />
                  <br />
                  <br />
                  <br />
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
                  options={options} />

              </Row>
              <Row>
                <Col lg={9} sm={12} xs={12}>
                  <br />
                  <br />
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
                <Col lg={12} sm={12} xs={12}>
                  <Bar className="barchart" style={{ height: '70vh' }} options={optionsBar} data={barData} />
                </Col>
              </Row>
            </Col>
          </Row>

        </div>
      </div>

      <p style={{ fontSize: "12pt", marginLeft: '15px' }}>{content['references']['website'][lan]} <a style={{ color: "inherit" }} href="https://cristyguzman.github.io/" target="_blank"> Cristina Guzman</a> {content['references']['and'][lan]} <a style={{ color: "inherit" }} href="https://feradauto.github.io/" target="_blank">Fernando Gonzalez</a>.</p>
      <p style={{ fontSize: "12pt", marginLeft: '15px' }}>{content['references']['bib'][lan]} </p>
      <p style={{ fontSize: "12pt", marginLeft: '15px' }}>Nussio, Enzo, and Govinda Clayton. 2022. “Introducing the Lynching in Latin America (LYLA) Dataset.” <em>Working Paper,</em> ETH Zurich. </p>
      <img src={require("./eth_logo_kurz_neg.png")} style={{ height: '50px', marginBottom: '10px', marginTop: '-15px' }} />


    </div>

  );
};

export default App;