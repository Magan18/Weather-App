// API Keys
const weatherApiKey = "0bce1b1ea82575876b7b0c2866b64bd4"; // Replace with your OpenWeatherMap API key
const aqiApiKey = "af2891c296287a6c6d4653c28290934c0b01e29b"; // Replace with your WAQI API key

// DOM Elements
const form = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");
const cityElement = document.querySelector(".city");
const dateElement = document.querySelector(".date");
const tempElement = document.querySelector(".temp");
const descriptionElement = document.querySelector(".description-text");
const windSpeedElement = document.querySelector(".wind-speed");
const humidityElement = document.querySelector(".humidity");
const visibilityElement = document.querySelector(".visibility-distance");
const aqiValueElement = document.querySelector(".aqi-value");
const aqiStatusElement = document.querySelector(".aqi-status");
const descriptionIcon = document.querySelector(".description i");

// Event Listener for Form Submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        fetchAQIData(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Function to Fetch Weather Data
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
        );
        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data. Please try again.");
    }
}

// Function to Fetch AQI Data
async function fetchAQIData(city) {
    try {
        const response = await fetch(
            `https://api.waqi.info/feed/${city}/?token=${aqiApiKey}`
        );
        if (!response.ok) {
            throw new Error("Unable to fetch AQI data");
        }
        const data = await response.json();
        if (data.status === "ok") {
            updateAQIUI(data.data.aqi);
        } else {
            throw new Error("AQI data not available");
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        updateAQIUI("N/A", "Data not available");
    }
}

// Function to Update Weather UI
function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    dateElement.textContent = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    windSpeedElement.textContent = `${data.wind.speed} KM/H`;
    humidityElement.textContent = `${data.main.humidity}%`;
    visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} KM`;
    descriptionIcon.textContent = getWeatherIcon(data.weather[0].main);
}

// Function to Update AQI UI
function updateAQIUI(aqi) {
    aqiValueElement.textContent = `AQI: ${aqi}`;
    aqiStatusElement.textContent = getAQIStatus(aqi);
}

// Function to Get Weather Icon
function getWeatherIcon(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };
    return iconMap[weatherCondition] || "help";
}

// Function to Get AQI Status
function getAQIStatus(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <=  300) return "Very Unhealthy";
    return "Hazardous";
}