import { useEffect, useState , useMemo, useRef} from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'
const DownloadComponent = ({filteredData}) => {
    const [transactionData, setTransactionData] = useState([])
    const csvLink = useRef() // setup the ref that we'll use for the hidden CsvLink click once we've updated the data
  
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
        <Button onClick={getTransactionData}>Download events to csv</Button>
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