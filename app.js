let apiKey = "afd0cbb02d32c0593f8ed5f35a243397";
let openWeatherEndPoint =
  "https://api.openweathermap.org/data/2.5/weather?appid=" +
  apiKey +
  "&units=metric";
let weatherForecastEndPoint =
  "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=" +
  apiKey;
let currentGeoLoaction =
  "http://api.openweathermap.org/geo/1.0/reverse?limit=1&appid=" + apiKey;
let geocodingBaseEndpoint =
  "http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=" +
  apiKey +
  "&q=";
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let humidity = document.querySelector(".weather_indicater--humidity>.value");
let wind = document.querySelector(".weather_indicater--wind>.value");
let pressure = document.querySelector(".weather_indicater--pressure>.value");
let input = document.querySelector(".weather_search");
let temperature = document.querySelector(".weather_temp>.value");
let weatherforecast = document.querySelector(".weather_forecast");
let datalist=document.getElementById('Suggestion');
let image = document.querySelector(".weather_image");

let weatherImages = [
  {
    url: "images/broken-clouds.png",
    ids: [803, 804],
  },
  {
    url: "images/clear-sky.png",
    ids: [800],
  },
  {
    url: "images/few-clouds.png",
    ids: [801],
  },
  {
    url: "images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "images/rain.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "images/shower-rain.png",
    ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "images/snow.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "images/thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];
let updateCurrentWeather = (data) => {
  console.log(data);
  city.innerText = data.name;
  humidity.innerText = data.main.humidity;
  pressure.innerText = data.main.pressure;
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  wind.innerText = windDirection + "," + data.wind.speed;
  temperature.innerText =
    data.main.temp > 0
      ? "+" + Math.round(data.main.temp)
      : Math.round(data.main.temp);
  day.innerText = getday();
  let imgID = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.indexOf(imgID) != -1) {
      image.src = obj.url;
    }
  });
};
let getday = (dt = new Date().getTime()) => {
  let today = new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
  return today;
};

let getWeatherbyCityName = async function (city) {
  //console.log(city);
  let endPoint = openWeatherEndPoint + "&q=" + city;
  //console.log(endPoint);
  let response = await fetch(endPoint);
  let data = await response.json();
  return data;
  //updateCurrentWeather(data);
};
let getForecastByCityID = async (id) => {
  let endpoint = weatherForecastEndPoint + "&id=" + id;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  console.log(forecast);
  let forecastlist = forecast.list;
  let list = [];
  forecastlist.forEach((day) => {
    let date_txt = day.dt_txt;
    date_txt = date_txt.replace(" ", "T");
    let date = new Date(date_txt);
    let hours = date.getHours();
    if (hours == 12) {
      list.push(day);
    }
  });
  return list;
};
let weatherForCity = async (city) => {
  let data = await getWeatherbyCityName(city);
  if(data.cod==="404")
  {
    Swal.fire({icon:"error",title:"OOPs....",text:"You Type Wrong City Name",});
    return ;
  }
  updateCurrentWeather(data);
  let cityID = data.id;
  let forecast = await getForecastByCityID(cityID);
  updateForecast(forecast);
};
let updateForecast = (forecast) => {
  console.log(forecast);
  weatherforecast.innerHTML = "";
  let forecastitem = "";
  forecast.forEach((day) => {
    let iconURL =
      "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let temperature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);
    let dayName = getday(day.dt * 1000);
    forecastitem += ` <article class="weather_forcast_item">
        <img src="${iconURL}" class="weather_forecast_icon">
        <h3 class="weather_forecast_day">${dayName}</h3>
        <p class="weather_forecast_temperature">
          <span class="value">${temperature}</span> &deg;C
        </p>
      </article>`;
  });
  weatherforecast.innerHTML = forecastitem;
};

input.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    //console.log("sandeep");
    weatherForCity(input.value);
    //let forecastitem=[];
  }
});
input.addEventListener("input",async()=>
{
  if(input.value.length<=2)
  {return;}
  let endPoint=geocodingBaseEndpoint+input.value;
  let response=await fetch(endPoint);
  let data=await response.json();
  console.log(data);
  datalist.innerHTML="";
  data.forEach((city) => {
  
    let option=document.createElement("option");
    option.value=`${city.name}${city.state?","+city.state:""},${city.country}`;
    datalist.appendChild(option);
  });
})
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function show() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}
function success(pos) {
  let crd = pos.coords;
  let lat = crd.latitude.toString();
  let lng = crd.longitude.toString();
  getCurrentLocation(lat, lng);
  //console.log(lat, lng);
}
function error(error) {
  console.log(error.code, error.msg);
}
let getCurrentLocation = async (lat, lng) => {
  let endPoint = currentGeoLoaction + "&lat=" + lat + "&lon=" + lng;
  let response = await fetch(endPoint);
  let result = await response.json();
  weatherForCity(result[0].name);
};
