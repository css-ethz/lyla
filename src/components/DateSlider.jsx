import React, {Component} from 'react';
import { useEffect, useState , useMemo, useRef} from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import { Container, Row, Col } from 'reactstrap';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';


var moment = require('moment')

const Handle = Slider.Handle;


const wrapperStyle = { width: 400, margin: 50 };

function DateSlider({setSDate, setEDate, dateTitle, startDateText, endDateText}){

    const [startDate, setstartDate] = useState("01/01/2010");
    const [startDateLabel, setstartDateLabel] = useState("01/01/2010");
    const [endDate, setendDate] = useState("01/01/2020");
    const [endDateLabel, setendDateLabel] = useState("31/12/2019");
    const [currentValue, setcurrentValue] = useState([]);
    const [minRange, setminRange] = useState(0);
    const [maxRange, setmaxRange] = useState(100);


    const updateCurrent = ()=>{
        let startDate_moment = moment(startDate, "DD/MM/YYYY")
        let endDate_moment = moment(endDate, "DD/MM/YYYY")
        let new_min = startDateLabel.diff(startDate_moment, 'days');
        let new_max = endDate_moment.diff(endDateLabel, 'days');
        setcurrentValue([new_min, maxRange-new_max]);
      }
    const updateFromPicker = (newValue,isStart)=>{
      if (isStart){
        setstartDateLabel(newValue);
        setSDate(newValue.format('DD/MM/YYYY'));
      }else{
        setendDateLabel(newValue);
        setEDate(newValue.format('DD/MM/YYYY'));
      }

      updateCurrent();
      }

      const onDateChange = ([newStartDate, newEndDate])=>{
        setcurrentValue([newStartDate, newEndDate]);
        let [min, max] = [newStartDate, newEndDate];
        let start = moment(startDate,  "DD/MM/YYYY").add(min, 'd');
        let end = moment(endDate, "DD/MM/YYYY").subtract(maxRange - max , 'd');
        setstartDateLabel(start);
        setSDate(formatDate(start));
        setendDateLabel(end);
        setEDate(formatDate(end));
    }
    const formatDate=(date)=>{
        let day, month, year = 0;
        day = date.get('date')
        month = date.get('month')+1
        year = date.get('year')
        return day + '/' + month + '/' + year
      }
    

    const tipFormatter=(value)=>{

        let [min, max] = currentValue
        if(min == value){
          return(<div className="p-1 text-center">
            {startDateLabel}
          </div>)
        }
        else if(max == value){
          return(<div>
            {startDateLabel}
          </div>)
        }
      }

    useEffect(() => {
    let ignore = false;
    if (!ignore)  {
        let range = calculateDateRange(startDate, endDate);
        setmaxRange(Math.abs(range));
        setcurrentValue( [0,Math.abs(range)]);
    }
        return () => { ignore = true; }
    },[]);


  const calculateDateRange=(startDateStr, endDateStr)=>{
    //calculate the difference in start and end date fron api and assign min and max to range
    let startDate = moment(startDateStr, "DD/MM/YYYY")
    let endDate = moment(endDateStr, "DD/MM/YYYY")
    return endDate.diff(startDate, 'days')
    
  }
  const color = "white";
  const onKeyDown = (e) => {
    e.preventDefault();
 };


    return(
      <div>
        <Container fluid={true}>
          <Row >
            <Col className = "text-center" style={{ fontWeight: 'bold',fontSize:'20px',
          marginBottom: '30px' }}>{dateTitle}</Col>
          </Row>
          <Row style={{marginBottom: '50px'}}>
            <Col xs={6} sm={6} md={4}>
              {/* <span style = {{}}>
                {startDateText}: {startDateLabel}
              </span> */}
              <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker 
                  label={startDateText}
                  value={startDateLabel}
                  minDate="01-01-2010"
                  maxDate="31-12-2019"
                  inputFormat='DD/MM/yyyy'
                  onChange={(newValue) => {
                    updateFromPicker(newValue,1);
                  }}
                  renderInput={(params) => 
                  <TextField onKeyDown={onKeyDown} {...params} sx={{ svg: { color },
                  input: { color },
                  label: { color }}} />}
                />
              </LocalizationProvider>
            </Col>
            <Col xs={6} sm={6} md={4}>
            <br/>
              <div className="text-center">
                <Slider 
                    range
                        allowCross={false} 
                      min = {minRange} 
                      max = {maxRange} 
                      value = {currentValue}
                      tipFormatter = {tipFormatter}
                      // tipProps = {this.formatTooltip}
                      onChange = {onDateChange} />
              </div>
            </Col>
            <Col xs={6} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                  inputFormat='DD/MM/YYYY'
                  label={endDateText}
                  value={endDateLabel}
                  minDate="01-01-2010"
                  maxDate="01-01-2020"
                  onChange={(newValue) => {
                    updateFromPicker(newValue,0);
                  }}
                  renderInput={(params) => <TextField onKeyDown={onKeyDown} {...params} sx={{ svg: { color },
                  input: { color },
                  label: { color }}} />}
                />

              </LocalizationProvider>
            </Col>
          </Row>
        </Container>
      </div>
    )
  
}

export default DateSlider;