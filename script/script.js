const API_KEY = '4238b26c222f4419ae6122940231805';
const cardsContainer = document.querySelector('.cards');
const cardElements = cardsContainer.querySelectorAll('.card');
const cardData = [];
weatherApiFetch("London")

cardElements.forEach((cardElement) => {
  const cardObject = {
    title: '',
    text: '',
    imageSrc: '',
  };
  cardData.push(cardObject);
});

//console.log(cardData);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
    console.log("Geolocation is not supported by this browser.");
}

$("#searchTemperature").on("click", function () {
  const searchLocation = document.getElementById("city-name").value;
  weatherApiFetch(searchLocation);
});

function afterSearch(json) {
  console.log("halr");
  $("#city").text(json.location.name);
  $("#temp").text(json.current.temp_c);
  $("#weather").text(json.current.condition.text);

  console.log(json);

  for (let i = 0; i < cardData.length; i++) {
    const forecastDay = json.forecast.forecastday[i].day;
    const date = json.forecast.forecastday[i].date;
    const icon = json.forecast.forecastday[i].day.condition.icon;
    const avgTemp = json.forecast.forecastday[i].day.avgtemp_c;
    const avgHumidity = json.forecast.forecastday[i].day.avghumidity;
    const avgWind = json.forecast.forecastday[i].day.maxwind_kph;
    const chanceToRain = json.forecast.forecastday[i].day.daily_chance_of_rain;

    cardData[i].title = `${date}<br><b>${json.forecast.forecastday[i].day.condition.text}</b>`;
    cardData[i].imageSrc = `https://${icon}`;
    cardData[i].text = `<b>Average Temperature: </b>${avgTemp} &deg;C<br> <b>Average Humidity:</b> ${avgHumidity}<br> <b>Average Wind: </b>${avgWind}<br> <b>Chance to Rain: </b>${chanceToRain}`;
  }

  cardElements.forEach((cardElement, index) => {
    const cardTitleElement = cardElement.querySelector('.card-title');
    const cardImageElement = cardElement.querySelector('.card-img-top');
    const cardTextElement = cardElement.querySelector('.card-text');

    cardTitleElement.innerHTML = cardData[index].title;
    cardImageElement.src = cardData[index].imageSrc;
    cardTextElement.innerHTML = cardData[index].text;
  });
}

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD7FjzTZLuOPqiNkjtL0jXVUAySMXv0-Xw`)
        .then((response) => response.json())
        .then((data) => {
            const results = data.results;
            if (results.length > 0) {
                const city = results[0].address_components.find(component => component.types.includes('locality')).long_name;
                weatherApiFetch(city);
            }
        })
        .catch((error) => {
            console.log("Error in geocoding request: " + error);
        });
}

function errorCallback(error) {
    console.log("Error getting geolocation: " + error.message);
    if (error.message=='User denied Geolocation') {
        weatherApiFetch("London")
    }
}
function weatherApiFetch(location) {
    fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`
    )
    .then((response) => response.json())
    .then((json) => {
        afterSearch(json);
    })
    .catch((error) => {
        console.log(error);
    });
}