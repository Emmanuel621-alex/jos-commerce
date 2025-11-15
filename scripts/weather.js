const apiKey = '4d65fd72d53e1fdeccb3be8564f38069';

// Helper: Capitalize description
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Fetch current weather
async function getWeather(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data?.main || !data?.weather) throw new Error("Invalid weather data");

        document.getElementById("temp").textContent = data.main.temp.toFixed(1);
        document.getElementById("weather-desc").textContent = capitalize(data.weather[0].description);
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById("weather-icon").alt = capitalize(data.weather[0].description);

        getForecast(lat, lon);
    } catch (err) {
        console.error("Weather fetch error:", err);
        document.getElementById("weather-desc").textContent = "Unable to load weather.";
    }
}

// Fetch 3-day forecast
async function getForecast(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        const forecastEl = document.getElementById("forecast-list");
        forecastEl.innerHTML = "";

        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        daily.forEach(day => {
            const date = new Date(day.dt * 1000);
            const li = document.createElement("li");
            li.innerHTML = `<strong>${date.toLocaleDateString("en-US", { weekday: "long" })}</strong>: 
                            ${day.main.temp.toFixed(1)}°C — ${capitalize(day.weather[0].description)}
                            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" 
                                 alt="${capitalize(day.weather[0].description)}" 
                                 class="forecast-icon">`;
            forecastEl.appendChild(li);
        });
    } catch (err) {
        console.error("Forecast fetch error:", err);
        document.getElementById("forecast-list").innerHTML = "<li>Unable to load forecast.</li>";
    }
}

// Get user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => {
            console.error("Location error:", err);
            alert("Location access denied. Weather cannot load.");
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
}
