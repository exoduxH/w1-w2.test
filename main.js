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
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  } else {
    // Wenn keine Stadt eingegeben wurde, GPS verwenden
    getGeoLocationAndFetchWeather();
  }
});

// Funktion, um Wetterdaten basierend auf der Stadt abzurufen
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

// Funktion, um Wetterdaten basierend auf den GPS-Koordinaten abzurufen
async function getWeatherDataByCoordinates(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Could not fetch weather data for your location");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch weather data. Please try again later.");
  }
}

// Funktion, um die GPS-Daten des Benutzers zu erhalten
function getGeoLocationAndFetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await getWeatherDataByCoordinates(latitude, longitude);
          displayWeatherInfo(weatherData);
        } catch (error) {
          console.error(error);
          displayError(error.message);
        }
      },
      (error) => {
        console.error(error);
        displayError("Unable to retrieve your location.");
      }
    );
  } else {
    displayError("Geolocation is not supported by this browser.");
  }
}

function displayWeatherInfo(data) {
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
