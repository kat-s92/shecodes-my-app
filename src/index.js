let now = new Date();

let today = document.querySelector("#today-date");
let date = now.getDate();

let days = [
	"Sunday",
	"Monday",
	"Tueday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
let day = days[now.getDay()];

let months = [
	"Jan",
	"Feb",
	"March",
	"Apr",
	"May",
	"Jun",
	"July",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
let month = months[now.getMonth()];
let hours = now.getHours();
if (hours < 10) {
	hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
	minutes = `0${minutes}`;
}

today.innerHTML = `${day} ${month} ${date}, ${hours}:${minutes}`;

function formatHours(timestamp) {
	let date = new Date(timestamp);
	let hours = date.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	return `${hours}:${minutes}`;
}

function showWeather(response) {
	document.querySelector("#show-city").innerHTML = response.data.name;
	document.querySelector("#show-temperature").innerHTML = Math.round(
		response.data.main.temp
	);

	document.querySelector("#humidity").innerHTML = response.data.main.humidity;
	document.querySelector("#wind").innerHTML = Math.round(
		response.data.wind.speed
	);

	document.querySelector("#description").innerHTML =
		response.data.weather[0].main;

	let iconElement = document.querySelector("#icon");
	iconElement.setAttribute(
		"src",
		`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
	);
	iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response) {
	let forecastElement = document.querySelector("#forecast");
	let forecast = null;
	forecastElement.innerHTML = null;

	for (let index = 0; index < 6; index++) {
		forecast = response.data.list[index];

		forecastElement.innerHTML += `
	<div class="col-2">
	<div class="time-slot">

								<h5>${formatHours(forecast.dt * 1000)}</h5>
								<img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon
			}@2x.png"/img>
								<div class="forecast-temp">${Math.round(forecast.main.temp_max)}°</div>
							</div>`;
	}
}

function searchCity(city) {
	let apiKey = "c47639a679e866341924ab987bd35847";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(showWeather);

	apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
	event.preventDefault();
	let city = document.querySelector("#city-input").value;
	searchCity(city);
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", handleSubmit);

function changeToCelsius(event) {
	event.preventDefault();
	let temperature = document.querySelector("#show-temperature");
	temperature.innerHTML = 19;
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelsius);

function changeToFarenheit(event) {
	event.preventDefault();
	let temperature = document.querySelector("#show-temperature");
	temperature.innerHTML = 67;

	let farenheitLink = document.querySelector("#farenheit-link");
	farenheitLink.addEventListener("click", changeToFarenheit);
}

function searchCurrentLocation(position) {
	let apiKey = "c47639a679e866341924ab987bd35847";
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(showWeather);

	apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(displayForecast);
}

function getCurrentLocation() {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Toronto");
