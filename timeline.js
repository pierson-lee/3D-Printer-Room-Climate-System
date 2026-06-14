//establishing chart objects
let tempChart;
let humChart;

//this function gets the history data
async function loadHistory() {
  const res = await fetch("/history"); //get the history data
  const data = await res.json(); //convert json history data into JavaScript object

  //exit case if there is no data
  if (!data || data.length === 0) {
    return;
  }

  //formatting graph labels
  const labels = data.map(d =>
    new Date(d.time).toLocaleTimeString()
  );

  //extracting temperature and humidity
  const temps = data.map(d => d.temperature);
  const hums = data.map(d => d.humidity);

  //temperature graph
  if (!tempChart) {
    const tempCtx = document.getElementById("tempChart"); //find the canvas element

    tempChart = new Chart(tempCtx, {
      type: "line",

      data: {
        labels: labels,

        datasets: [{
          label: "Temperature (°C)",
          data: temps,
          borderColor: "red",
          tension: 0.3,
          fill: false
        }]
      },

      options: {
        responsive: true,
        animation: false,

        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  else {
    tempChart.data.labels = labels;
    tempChart.data.datasets[0].data = temps;

    tempChart.update();
  }

  //humidity graph
  if (!humChart) {
    const humCtx = document.getElementById("humChart"); //find the canvas element

    humChart = new Chart(humCtx, {
      type: "line",

      data: {
        labels: labels,

        datasets: [{
          label: "Humidity (%)",
          data: hums,
          borderColor: "blue",
          tension: 0.3,
          fill: false
        }]
      },

      options: {
        responsive: true,
        animation: false,

        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  else {
    humChart.data.labels = labels;
    humChart.data.datasets[0].data = hums;

    humChart.update();
  }
}

//start making the charts as soon as the server goes up
loadHistory();

//every five seconds add a new data point
setInterval(loadHistory, 5000);