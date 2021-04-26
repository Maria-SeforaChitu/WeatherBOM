const cityWeather = document.querySelector("[data-weather-city]");
const iconWeather = document.querySelector("[data-weather-icon]");

const tempUnitStorageName = "tempUnit";
const tempUnitToggle = document.querySelector(
  "[data-weather-temp-unit-toggle]"
);
const tempUnitRadios = tempUnitToggle.querySelectorAll("[type=radio]");
for (const tempUnitRadio of tempUnitRadios) {
  tempUnitRadio.addEventListener("change", handleTempUnitRadioChange);
}

const minTemp = document.querySelector("[data-weather-temp=temp_min]");
const maxTemp = document.querySelector("[data-weather-temp=temp_max]");
const currentTemp = document.querySelector("[data-weather-temp=temp_current]");
const feelsLikeTemp = document.querySelector(
  "[data-weather-temp=temp_feels_like]"
);

function handleTempUnitRadioChange(e) {
  const tempUnitToSave = e.target.value;

  setTemperatureUnit(tempUnitToSave);
  weather();
}

function setTemperatureUnit(tempUnitToSave) {
  if (window.localStorage) {
    localStorage.setItem(tempUnitStorageName, tempUnitToSave);
  } else {
    document.cookie = `${tempUnitStorageName}=${tempUnitToSave}`;
  }
}

function weather() {
  var tempUnit = getTemperatureUnit();

  const promise = fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=Iasi,Iasi,RO&units=" +
      tempUnit +
      "&appid=8141ec9698f111a11b44587876eac2cd"
  );
  promise
    .then(handleResponse)
    .then((weatherData) => outputWeather(weatherData, tempUnit));
}

function getTemperatureUnit() {
  var savedTempUnit = null;

  // Check the local storage or in cookies for a saved temperature unit.
  if (window.localStorage) {
    savedTempUnit = localStorage.getItem(tempUnitStorageName);
  } else {
    savedTempUnit = getValueFromCookie(tempUnitStorageName);
  }

  if (savedTempUnit == null || savedTempUnit == undefined) {
    // When there is no saved temperature unit, then get it from the default checked radio and save it.
    for (const tempUnitRadio of tempUnitRadios) {
      if (tempUnitRadio.checked) {
        setTemperatureUnit(tempUnitRadio.value);
        savedTempUnit = tempUnitRadio.value;
        break;
      }
    }
  } else {
    // When there is a saved temperature unit, then update the checked radio.
    for (const tempUnitRadio of tempUnitRadios) {
      if (tempUnitRadio.value === savedTempUnit) {
        tempUnitRadio.checked = true;
      } else {
        tempUnitRadio.checked = false;
      }
    }
  }

  return savedTempUnit;
}

function getValueFromCookie(cookieName) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [cName, cValue] = cookie.split("=");
    if (cName === cookieName) {
      return cValue;
    }
  }

  return null;
}

function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error("Could not query open weather!");
}

function outputWeather(weatherData, tempUnit) {
  console.log("Received weather JSON for %s temperature unit:", tempUnit);
  console.log(weatherData);

  cityWeather.textContent = weatherData.name;
  iconWeather.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" +
      weatherData.weather[0].icon +
      "@2x.png"
  );

  var mappedTempUnit = mapTemperatureUnit(tempUnit);
  minTemp.textContent = weatherData.main.temp_min + mappedTempUnit;
  maxTemp.textContent = weatherData.main.temp_max + mappedTempUnit;
  currentTemp.textContent = weatherData.main.temp + mappedTempUnit;
  feelsLikeTemp.textContent = weatherData.main.feels_like + mappedTempUnit;
}

function mapTemperatureUnit(tempUnit) {
  switch (tempUnit) {
    case "metric":
      return " \u2103";
    case "imperial":
      return " \u2109";
    default:
      throw new Error("Unknown temperature unit!");
  }
}

weather();
