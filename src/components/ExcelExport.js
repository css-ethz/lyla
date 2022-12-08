import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';


const ExportExcel = ({excelData, fileName, text}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: {'data': ws}, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);

    }

    return (
        <div>
        <Button style={{backgroundColor:"transparent", border: "2px solid white"}}  onClick={(e) => exportToExcel(fileName)}><FontAwesomeIcon icon={faArrowAltCircleDown} />{text}</Button>
        </div>
    )
}

export default ExportExcel;