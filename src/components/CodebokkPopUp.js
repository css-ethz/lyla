import React from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { useEffect, useState , useMemo, useRef} from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const contentStyle = {
//     maxWidth: "600px",
//     width: "90%"
//   };

// const CodeBookModal = () => (
//     <Popup
//       trigger={<button className="buttoncb"> Open Codebook </button>}
//       modal
//       contentStyle={contentStyle}
//     >
//       {close => (
//         <div className="modal">
//           <a className="close" onClick={close}>
//             &times;
//           </a>
//           <div className="header"> LYLA CODEBOOK </div>
//           <div className="content">
//             {" "}
//             CODEBOOK INFOR
//             <br />
//             MORE CODEBOOK INFO
//           </div>
          
//         </div>
//       )}
//     </Popup>
//   );
  
//   export default CodeBookModal;


const CodebookPopup = () => {
  return (
  <Popup trigger={<button className="buttoncb"> Open Codebook</button>}  modal>
    <h3 className="codebook-header">Codebook for Reported Lynching in Latin America (LYLA)</h3>
    <p><b>Creators:</b> Enzo Nussio, Govinda Clayton</p>
    <table className="table-codebook">
  <tr>
    <th>Variable</th>
    <th></th>
    <th>Description</th>
  </tr>
  <tr>
    <td> Country</td>
    <td></td>
    <td> &thinsp;Country in which the lynching event occurs</td>
  </tr>
  <tr>
    <td> Alleged Wrongdoing</td>
    <td></td>
    <td> &thinsp;What was the lynched person accused of?</td>
  </tr>
  <tr>
    <td> Worst outcome</td>
    <td></td>
    <td> &thinsp;What physical consequences did the lynched person suffer?</td>
  </tr>
  <tr>
    <td> Worst violence inflicted</td>
    <td></td>
    <td> &thinsp;What kind of violence did the lynch mob use?</td>
  </tr>
  <tr>
    <td> Number of perpetrators</td>
    <td></td>
    <td> &thinsp;How large was the lynch mob?</td>
  </tr>

  
</table>


  </Popup>
  );
  };


const DownloadCodebook = () => {
  //  const Button = styled.button`
  //   background-color: gray;
  //   color: white;
  //   font-size: 16px;
  //   padding: 10px 55px;
  //   border-radius: 50px;
  //   margin: 10px 0px;
  //   cursor: pointer;
  //   :hover {
  //     background-color: #707B7C
  //   };
  // `;  
   
  
    return (
      <div>
        <Button style={{backgroundColor:"transparent", border: "2px solid white"}}>
        <FontAwesomeIcon icon={faBook}/>
        <a style={{color: "inherit",
                  textDecoration: 'none'}}
           href="codebook.pdf" download="Codebook_LYLA" target="_blank"> Codebook</a>
        </Button>

      </div>
    )
  };


export default DownloadCodebook;
