import React from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

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


export default () => (
  <Popup trigger={<button className="buttoncb"> Open Codebook</button>}  modal>
    <h3 className="codebook-header">Codebook for Reported Lynching in Latin America (LYLA)</h3>
    <p><b>Creators:</b> Enzo Nussio, Govinda Clayton</p>
    <table className="table-codebook">
  <tr>
    <th>Variable</th>
    <th>Description</th>
    <th>Examples and Additional Information</th>
  </tr>
  <tr>
    <td>coder</td>
    <td> </td>
    <td></td>
  </tr>
  <tr>
    <td> id</td>
    <td> </td>
    <td></td>
  </tr>
  <tr>
    <td>cc</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>name_0</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>name_1</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>name_local</td>
    <td></td>
    <td></td>
  </tr>
</table>


  </Popup>
);
