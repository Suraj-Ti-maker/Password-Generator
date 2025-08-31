const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "YOUR_API_KEY"; // Replace with your OpenWeather API key
oldTab.classList.add("current-tab");

// Switch Tabs
function switchTab(newTab) {
  if (newTab !== oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (searchForm.classList.contains("active")) {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    } else {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
  }
}

userTab.addEventListener("click", () => switchTab(userTab));
searchTab.addEventListener("click", () => switchTab(searchTab));

// Check Session Storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchWeatherByCoords(coordinates);
  }
}

// Fetch by Coordinates
async function fetchWeatherByCoords({ lat, lon }) {
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch {
    alert("Could not fetch weather.");
    loadingScreen.classList.remove("active");
  }
}

// Fetch by City
async function fetchWeatherByCity(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch {
    alert("City not found");
    loadingScreen.classList.remove("active");
  }
}

// Render Weather Info
function renderWeatherInfo(weather) {
  document.querySelector("[data-cityName]").innerText = weather.name;
  document.querySelector("[data-countryIcon]").src =
    `https://flagcdn.com/48x36/${weather.sys.country.toLowerCase()}.png`;
  document.querySelector("[data-weatherDesc]").innerText =
    weather.weather[0].description;
  document.querySelector("[data-weatherIcon]").src =
    `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  document.querySelector("[data-temp]").innerText = `${weather.main.temp} °C`;
  document.querySelector("[data-windspeed]").innerText = `${weather.wind.speed} m/s`;
  document.querySelector("[data-humidity]").innerText = `${weather.main.humidity} %`;
  document.querySelector("[data-cloudiness]").innerText = `${weather.clouds.all} %`;
}

// Get Location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation not supported");
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchWeatherByCoords(userCoordinates);
}

document.querySelector("[data-grantAccess]")
  .addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = document.querySelector("[data-searchInput]").value;
  if (city) fetchWeatherByCity(city);
});
