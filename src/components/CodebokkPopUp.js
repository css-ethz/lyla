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
    <td><b>Name of coder</b></td>
    <td>Initials for each research assistant</td>
  </tr>
  <tr>
    <td></td>
    <td>Initials coder</td>
    <td>Coverage: All countries</td>
  </tr>
  <tr>
    <td></td>
    <td>AB</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>AG</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>CS</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>MM</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>OM</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>SM</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>SS</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>VM</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>ZG</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td>EN</td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td><b>STRING</b></td>
    <td></td>

  </tr>
  <tr>
    <td> id</td>
    <td> <b>ID number of lynching event</b></td>
    <td>Consecutive numbers before data cleaning</td>
  </tr>
  <tr>
    <td></td>
    <td><b>STRING</b></td>
    <td></td>

  </tr>
  <tr>
    <td>cc</td>
    <td><b>Country code</b> of the country in which the lynching event occurs</td>
    <td>Country codes based on <a href="http://www.correlatesofwar.org/data-sets/cow-country-codes" target="_blank">COW country codes</a></td>
  </tr>
  <tr>
    <td></td>
    <td><b>NUMERIC</b></td>
    <td>COVERAGE: All countries</td>
  </tr>
  <tr>
    <td>name_0</td>
    <td><b>Country</b> in which the lynching event occurs</td>
    <td>Full name of country.</td>
  </tr>
  <tr>
    <td></td>
    <td><b>STRING</b></td>
    <td>COVERAGE: All countries</td>
  </tr>
  <tr>
    <td>name_1</td>
    <td><b>Admin_1 Name</b></td>
    <td>Name for highest level of administrative organization within each state, e.g. estado (Mexico), departamento (Colombia), etc.</td>
  </tr>
  <tr>
    <td></td>
    <td><b> STRING</b></td>
    <td></td>
  </tr>
  <tr>
    <td>name_local</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>

  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>

  </tr>
  
  
</table>


  </Popup>
);
