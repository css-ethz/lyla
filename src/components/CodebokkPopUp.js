import React from "react";
import Popup from "reactjs-popup";

const contentStyle = {
    maxWidth: "600px",
    width: "90%"
  };

const CodeBookModal = () => (
    <Popup
      trigger={<button className="buttoncb"> Open Modal </button>}
      modal
      contentStyle={contentStyle}
    >
      {close => (
        <div className="modal">
          <a className="close" onClick={close}>
            &times;
          </a>
          <div className="header"> LYLA CODEBOOK </div>
          <div className="content">
            {" "}
            CODEBOOK INFOR
            <br />
            MORE CODEBOOK INFO
          </div>
          
        </div>
      )}
    </Popup>
  );
  
  export default CodeBookModal;