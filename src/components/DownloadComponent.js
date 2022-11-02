import { useEffect, useState , useMemo, useRef} from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import icon from '../downloadbttn.png'

const DownloadComponent = ({filteredData}) => {
    const [transactionData, setTransactionData] = useState([])
    const csvLink = useRef() // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  
    const getTransactionData =() => {
      setTransactionData(filteredData);
      csvLink.current.link.click();
    }
    useEffect(() => {
      setTransactionData(filteredData);
    },[filteredData])
  
    return (
      <div>
        <Button onClick={getTransactionData}>
        <img src={icon} 
        width="40" 
        height="40"/> Download .csv
        </Button>
        <CSVLink
           data={transactionData}
           filename='events.csv'
           className='hidden'
           ref={csvLink}
           target='_blank'
        />
      </div>
    )
  };


export default DownloadComponent;