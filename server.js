//importing libraries
const express = require("express");
const cors = require("cors");
const path = require("path");

//creating the server object
const app = express();

app.use(cors());
app.use(express.json()); //for working with json data
app.use(express.static(path.join(__dirname, "website"))); //path of the website folder

//variables to store the latest sensor reading
let latestData = {
  temperature: null,
  humidity: null,
  time: null
};

//history array setup
let history = [];

//when the ESP32 posts to /data (written in Arduino code), this function runs
app.post("/data", (req, res) => {
  //data entry
  const entry = {
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    time: Date.now()
  };

  //updating the whole entry containing the variables earlier
  latestData = entry;

  //store the entry to history array
  history.push(entry);
  if (history.length > 500) {
    history.shift(); //remove oldest entry when the size is too big
  }

  //check the terminal for the data entry
  console.log("Received:", entry);

  res.json({ status: "ok" });
});


//current data for frontend
app.get("/data", (req, res) => {
  res.json(latestData);
});

//history setup for graphs
app.get("/history", (req, res) => {
  res.json(
    history.map(entry => ({
      time: entry.time,
      temperature: entry.temperature,
      humidity: entry.humidity
    }))
  );
});

//starting the server on port 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});