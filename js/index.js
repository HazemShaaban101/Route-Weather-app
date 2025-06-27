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
