// autocomplete location: this function returns the ID of the first location that matches search criteria through
// the search/autocomplete api
async function autoCompleteLocation(searchValue) {
	// fetch the first valid location that matches user search
	let location = await fetch(`http://api.weatherapi.com/v1/search.json?key=bcdeff798dac4015a2a94701252606&q=${searchValue}`);

	// wait for locations to be extracted into a JSON
	let verifiedLocation = await location.json();

	// returns cairo as a default if user enters a wrong search criteria
	if (verifiedLocation.length === 0) {
		return 683802;
	}

	// return the Id of the first location
	return verifiedLocation[0].id;
}

// function to get weather data for a location over 3 days using location ID retrieved from search
async function getLocationWeather(locationId) {
	let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=bcdeff798dac4015a2a94701252606&q=id:${locationId}&days=3&aqi=no&alerts=no`);

	// wait for the response to be extracted into a JSON, then return it
	let responseJson = await response.json();

	return responseJson;
}

// getDayName(): a function that returns the day name based on a date object passed to it
function getDayName(dateString) {
	const day = new Date(dateString);
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	return dayNames[day.getDay()];
}

// getDayAndMonth(): a function that returns the day and month name based on a date object passed to it
function getDayAndMonth(dateString) {
	const date = new Date(dateString);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return date.getDate() + ' ' + months[date.getMonth()];
}

// updateCards(): a function that updates the cards with new info from the retrieved JSON
function updateCards(weatherInfo) {
	let weatherData = document.querySelector('#weather-data');

	for (let i = 0; i < 3; i++) {
		weatherData.querySelector(`#weekday${i}`).innerHTML = getDayName(weatherInfo.forecast.forecastday[i].date);
		weatherData.querySelector(`#date${i}`).innerHTML = getDayAndMonth(weatherInfo.forecast.forecastday[i].date);
		weatherData.querySelector(`#temp${i}`).innerHTML = weatherInfo.forecast.forecastday[i].day.maxtemp_c + '°C';
		weatherData.querySelector(`#night-temp${i}`).innerHTML = weatherInfo.forecast.forecastday[i].day.mintemp_c + '°C';
		// if i = 0, this info belongs to today, so display current condition(will not display night condition otherwise)
		if (i === 0) {
			weatherData.querySelector(`#weather-text${i}`).innerHTML = weatherInfo.current.condition.text;
			weatherData.querySelector(`#weather-icon${i}`).setAttribute('src', `https:${weatherInfo.current.condition.icon}`);
			// if i != 0, this info belongs to upcoming day, so display info from forcastday object
		} else {
			weatherData.querySelector(`#weather-text${i}`).innerHTML = weatherInfo.forecast.forecastday[i].day.condition.text;
			weatherData.querySelector(`#weather-icon${i}`).setAttribute('src', `https:${weatherInfo.forecast.forecastday[i].day.condition.icon}`);
		}
	}

	// set the place to the location displayed
	weatherData.querySelector('#place').innerHTML =
		weatherInfo.location.name + ', ' + weatherInfo.location.region ? weatherInfo.location.region : weatherInfo.location.country;
}

// updateMainStats(): a function to update the main card stats
function updateMainStats(weatherInfo) {
	let weatherData = document.querySelector('#weather-data');

	weatherData.querySelector('#rain-chance').innerHTML = ` ${weatherInfo.forecast.forecastday[0].day.daily_chance_of_rain}%`;

	weatherData.querySelector('#wind-speed').innerHTML = ` ${weatherInfo.current.wind_kph}Km/h`;

	weatherData.querySelector('#wind-dir-text').innerHTML = ` ${weatherInfo.current.wind_dir}`;

	weatherData.querySelector('#wind-dir-icon').setAttribute('src', `./images/${weatherInfo.current.wind_dir}.png`);
}
