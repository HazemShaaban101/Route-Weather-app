// initial page settings
let searchValue = 'auto:ip';

// self invoking function to retrieve initial page info and display it
(async function () {
	// removeLoadingScreen(): a function that adds display none to loading layer
	function removeLoadingScreen() {
		setTimeout(function () {
			document.getElementById('loading-screen').classList.add('d-none');
		}, 2000);
	}

	await displayLocationWeather();
	removeLoadingScreen();
})();

document.querySelector('#search-box').addEventListener('input', function (event) {
	// get the value of search input box
	searchValue = event.target.value;
	let currentValue = searchValue;

	// condition to make default search value is auto:ip
	if (event.target.value === '') {
		searchValue = 'auto:ip';
	}

	// after one second, compare the value registered on input with the value of the input box right now
	// if value is unchanged, this means the user stopped typing, so we should find weather data for user's search
	setTimeout(function () {
		if (currentValue === event.target.value) {
			displayLocationWeather();
		}
	}, 500);
});

// autocomplete location: this function returns the ID of the first location that matches search criteria through
// the search/autocomplete api
async function autoCompleteLocation(searchValue) {
	// fetch the first valid location that matches user search
	let location = await fetch(`https://api.weatherapi.com/v1/search.json?key=bcdeff798dac4015a2a94701252606&q=${searchValue}`);

	// wait for locations to be extracted into a JSON
	let verifiedLocation = await location.json();

	// if no locations that match the search criteria are found, return the result of the same
	// function but with auto:ip as search criteria. this gets the location of current ip address
	if (verifiedLocation.length === 0) {
		return autoCompleteLocation('auto:ip');
	}

	console.log(verifiedLocation[0].name);

	// return the Id of the first location
	return verifiedLocation[0].id;
}

// function to get weather data for a location over 3 days using location ID retrieved from search
async function getLocationWeather(locationId) {
	let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=bcdeff798dac4015a2a94701252606&q=id:${locationId}&days=3&aqi=no&alerts=no`);

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
	weatherData.querySelector('#place').innerHTML = `${weatherInfo.location.name}, ${
		weatherInfo.location.region ? weatherInfo.location.region : weatherInfo.location.country
	}`;
}

// updateMainStats(): a function to update the main card stats
function updateMainStats(weatherInfo) {
	let weatherData = document.querySelector('#weather-data');

	weatherData.querySelector('#rain-chance').innerHTML = ` ${weatherInfo.forecast.forecastday[0].day.daily_chance_of_rain}%`;

	weatherData.querySelector('#wind-speed').innerHTML = ` ${weatherInfo.current.wind_kph}Km/h`;

	weatherData.querySelector('#wind-dir-text').innerHTML = ` ${weatherInfo.current.wind_dir}`;

	weatherData.querySelector('#wind-dir-icon').setAttribute('src', `./images/${weatherInfo.current.wind_dir}.png`);
}

// displayLocationWeather(): the function that runs it all,
// it is async to make sure everything runs in the wanted order
async function displayLocationWeather() {
	let locationId = await autoCompleteLocation(searchValue);

	let weatherInfo = await getLocationWeather(locationId);

	updateCards(weatherInfo);

	updateMainStats(weatherInfo);
}
