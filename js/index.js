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
