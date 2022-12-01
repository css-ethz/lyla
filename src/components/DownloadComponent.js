import { useEffect, useState , useMemo, useRef} from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'
import styled from "styled-components";
const DownloadComponent = ({filteredData,text}) => {
    const [transactionData, setTransactionData] = useState([])
    const csvLink = useRef(); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  //   const Button = styled.button`
  //   background-color: gray;
  //   color: white;
  //   font-size: 16px;
  //   padding: 10px 55px;
  //   border-radius: 50px;
  //   cursor: pointer;
  //   :hover {
  //     background-color: #707B7C
  //   };
  // `;  
    const getTransactionData =() => {

      //setTransactionData(filteredData);
      csvLink.current.link.click();
    }
    useEffect(() => {
      //var data_temp=Object.create(filteredData);
      for (var i = 0; i < filteredData.length; i++){
        filteredData[i]['evidence1_text'] = filteredData[i]['evidence1_text'].replace(/"/g, "\'");
      }
      setTransactionData(filteredData);
    },[filteredData])
  
    return (
      <div>
        <Button style={{fillOpacity:"1"}} onClick={getTransactionData}><FontAwesomeIcon icon={faArrowAltCircleDown} />{text}</Button>
        
        <CSVLink
           data={transactionData}
           enclosingCharacter={`"`}
           filename='events.csv'
           className='hidden'
           ref={csvLink}
           target='_blank'
        />
      </div>
    )
  };


export default DownloadComponent;