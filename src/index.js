import "babel-polyfill";
import Chart from "chart.js";

const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
let resultTimes = [];
let maxTemp = [];
let minTemp = [];

async function loadCurrency() {
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  // await приостанавливает выполнение функции 
  const parser = new DOMParser();
  const currencyData = parser.parseFromString(xmlTest, "text/xml");
  // <TEMPERATURE max="-0" min="-6"/>
  // <FORECAST day="17" month="04" year="2019" hour="21">
  const temp = currencyData.querySelectorAll("TEMPERATURE[max][min]");
  const hour = currencyData.querySelectorAll("FORECAST[hour]");

    for (let i = 0; i < hour.length; i++) {
      const rateTag = hour.item(i);
      const currency = rateTag.getAttribute("hour");
      resultTimes[i] = currency;
    }

    for (let i = 0; i < temp.length; i++) {
      const rateTag = temp.item(i);
      const currency = rateTag.getAttribute("max");
      maxTemp[i] = currency;
    }

    for (let i = 0; i < temp.length; i++) {
      const rateTag = temp.item(i);
      const currency = rateTag.getAttribute("min");
      minTemp[i] = currency;
    }
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");

buttonBuild.addEventListener("click", async function() {
  const currencyData = await loadCurrency();

  // параметры графика
  const chartConfig = {
    type: "line",

    data: {
      labels: resultTimes,
      datasets: [
        {
          label: "Температура",
          backgroundColor: "rgba(255, 20, 20, 0.7)",
          borderColor: "rgba(255, 20, 20, 0.9)",
          data: maxTemp
        },
        {
          label: "Температура по ощущениям",
          backgroundColor: "rgba(66, 12, 153, 0.7)",
          borderColor: "rgb(66, 12, 153, 0.9)",
          data: minTemp
        }
      ]
    },
    options: {
      responsive: true,
      title:{
        display:true,
        text:'Город Уфа'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Часы'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Температура'
          },
        }]
      }
    }
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
});

function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
