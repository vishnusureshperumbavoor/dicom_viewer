import React, { useEffect } from "react";
const axios = require("axios");
export const serverURL = "http://localhost:5000";

function Main() {
  useEffect(() => {
    axios
      .getAdapter(`${serverURL}/getPatientName`)
      .then((response) => {
        console.log("patientname = " + response.data);
      })
      .catch((error) => {
        console.log("error");
      });
  }, []);

  return <div></div>;
}

export default Main;
