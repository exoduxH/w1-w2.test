const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "9f393b81df052d098e751904f4969d38";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;

  if (city) {
    displayLoadingState();
    try {
      const weatherData = await getWeatherDataByCity(city);
      const forecastData = await getWeatherForecastByCity(city);
      displayWeatherInfo(weatherData, forecastData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  } else {
    getGeoLocationAndFetchWeather();
  }
});

async function getWeatherDataByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found or network issue");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch weather data. Please try again later.");
  }
}

async function getWeatherDataByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Location not found or network issue");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch weather data. Please try again later.");
  }
}

async function getWeatherForecastByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found or network issue");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch weather forecast. Please try again later.");
  }
}

async function getWeatherForecastByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Location not found or network issue");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch weather forecast. Please try again later.");
  }
}

function getGeoLocationAndFetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      displayLoadingState();
      try {
        const weatherData = await getWeatherDataByCoords(latitude, longitude);
        const forecastData = await getWeatherForecastByCoords(latitude, longitude);
        displayWeatherInfo(weatherData, forecastData);
      } catch (error) {
        console.error(error);
        displayError(error.message);
      }
    }, (error) => {
      console.error(error);
      displayError("Failed to get geolocation. Please try again later.");
    });
  } else {
    displayError("Geolocation is not supported by this browser.");
  }
}

function displayWeatherInfo(data, forecast) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`; // Celsius
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);

  const forecastTitle = document.createElement("h2");
  forecastTitle.textContent = "3-Day Forecast";
  card.appendChild(forecastTitle);

  for (let i = 0; i < 3; i++) {
    const forecastItem = forecast.list[i * 8]; // 8 intervals per day
    const forecastDate = new Date(forecastItem.dt * 1000);
    const forecastTemp = (forecastItem.main.temp - 273.15).toFixed(1);
    const forecastDesc = forecastItem.weather[0].description;

    const forecastDisplay = document.createElement("p");
    forecastDisplay.textContent = `${forecastDate.toDateString()}: ${forecastTemp}°C, ${forecastDesc}`;
    card.appendChild(forecastDisplay);
  }
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⚡🌧️"; 
    case weatherId >= 300 && weatherId < 400:
      return "🌦️"; 
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; 
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️"; 
    case weatherId === 800:
      return "☀️"; 
    case weatherId >= 801 && weatherId < 810:
      return "☁️"; 
    default:
      return "❓"; 
  }
}

function displayLoadingState() {
  card.textContent = "Loading...";
  card.style.display = "flex";
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}