import React, {Component} from 'react';
import { useEffect, useState , useMemo, useRef} from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import { Container, Row, Col } from 'reactstrap';

var moment = require('moment')

const Handle = Slider.Handle;


const wrapperStyle = { width: 400, margin: 50 };

function DateSlider({setSDate, setEDate}){

    const [startDate, setstartDate] = useState("01.01.2010");
    const [startDateLabel, setstartDateLabel] = useState("01.01.2010");
    const [endDate, setendDate] = useState("31.12.2019");
    const [endDateLabel, setendDateLabel] = useState("31.12.2019");
    const [currentValue, setcurrentValue] = useState([]);
    const [minRange, setminRange] = useState(0);
    const [maxRange, setmaxRange] = useState(100);

    const onDateChange = ([newStartDate, newEndDate])=>{
        setcurrentValue([newStartDate, newEndDate]);
        updateDates();
      }

    const updateDates = ()=>{
        //var min=currentValue[0]
        //var max=currentValue[1]
        let [min, max] = currentValue
        let start = moment(startDate,  "DD.MM.YYYY").add(min, 'd')
        let end = moment(endDate, "DD.MM.YYYY").subtract(maxRange - max , 'd')
        setstartDateLabel(formatDate(start));
        setSDate(startDateLabel);
        setendDateLabel(formatDate(end));
        setEDate(endDateLabel);
    }
    const formatDate=(date)=>{
        let day, month, year = 0;
        day = date.get('date')
        month = date.get('month')+1
        year = date.get('year')
        return day + '.' + month + '.' + year
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
    let startDate = moment(startDateStr, "DD.MM.YYYY")
    let endDate = moment(endDateStr, "DD.MM.YYYY")
    return endDate.diff(startDate, 'days')
    
  }



    return(
      <div>
        <Container fluid={true}>
          <Row>
            <Col className = "text-center">Date</Col>
          </Row>
          <Row >
            <Col xs={3} sm={3} md={3}>
              <span>
                {startDateLabel}
              </span>
            </Col>
            <Col>
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
            <Col xs={3} sm={3} md={2}>
              <span>
                {endDateLabel}
              </span>
            </Col>
          </Row>
        </Container>
      </div>
    )
  
}

export default DateSlider;