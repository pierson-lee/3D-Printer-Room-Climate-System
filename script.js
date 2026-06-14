//establish the current temp/humidity variables
let currentHumidity = null;
let currentTemp = null;

//this function retrieves the data and displays it on the webpage
async function loadData() {
  const res = await fetch("/data"); //grabs the data that the ESP32 is sending. Await ensures the function doesn't proceed until it receive the data
  const data = await res.json(); //format the data from json to a js object
  updateAmbientGlow(data.humidity);

  //putting values to the variables defined earlier
  currentHumidity = data.humidity;
  currentTemp = data.temperature;

  //display the values in the panels
  document.getElementById("temp").innerText =
    currentTemp + " °C";
  document.getElementById("hum").innerText =
    currentHumidity + " %";

  updateFilamentCheck(); //runs this function after every new set of data is pulled regardless of changes to the dropdown value
}

//this function interprets the data for printing conditions
//it runs when there is a new set of data OR if there is a change in the dropdown selection
function updateFilamentCheck() {
  if (currentHumidity === null) return; //exit out of this function if there is no data to work with

  //setting up the panel elements that may be changed
  const filament = document.getElementById("filamentSelect").value;
  const status = document.getElementById("filamentStatus");

  //variables for the safe/warning message
  let level = "green";
  let message = "";

  //easier variable to work with
  const h = currentHumidity;

  //all humidity ranges are interpreted from sources
  if (filament === "PLA") {
    if (h > 60) level = "red";
    else if (h > 50) level = "yellow";
    else level = "green";
  }

  if (filament === "PETG") {
    if (h > 50) level = "red";
    else if (h > 40) level = "yellow";
    else level = "green";
  }

  if (filament === "ABS") {
    if (h > 60) level = "red";
    else if (h > 50) level = "yellow";
    else level = "green";
  }

  if (filament === "TPU") {
    if (h > 45) level = "red";
    else if (h > 35) level = "yellow";
    else level = "green";
  }

  if (filament === "NYLON") {
    if (h > 35) level = "red";
    else if (h > 25) level = "yellow";
    else level = "green";
  }

  if (filament === "PVA") {
    if (h > 30) level = "red";
    else if (h > 20) level = "yellow";
    else level = "green";
  }

  if (filament === "Polycarbonate") {
    if (h > 35) level = "red";
    else if (h > 25) level = "yellow";
    else level = "green";
  }

  //check level to set the message
  if (level === "green") {
    message = "Safe to print";
  } else if (level === "yellow") {
    message = "Moderate risk (drier environment recommended)";
  } else {
    message = "High moisture risk (drier environment required)";
  }

  //check level to set the text colour
  status.innerText = filament + ": " + message;
  status.style.color =
    level === "green"
      ? "lightgreen"
      : level === "yellow"
      ? "orange"
      : "red";
}

function updateAmbientGlow(humidity) {
  let color = "56,189,248";

  if (humidity > 60) {
    color = "239,68,68"; // red
  }

  else if (humidity > 40) {
    color = "234,179,8"; // yellow
  }

  document.body.style.boxShadow =
    `inset 0 0 200px rgba(${color}, 0.15)`;
}

loadData(); //run the main function
setInterval(loadData, 5000); //loading data more than five seconds at a time is unecessary