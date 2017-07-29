const yargs = require('yargs');
const axios = require('axios');
const ftoc  = require('f-c');

var argv = yargs
.options({
	address : {
		alias:'a',
		demand: true,
		describe:"enter address to get the temperature",
		string: true
	}
})
.help()
.alias('help', 'h')
.argv;

var encodedAddress = encodeURIComponent(argv.address);
var locationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress;

axios.get(locationUrl).then((response) => {
	if(response.data.status === 'ZERO_RESULTS'){
		throw new Error('Unable to find the address');
	}
	var	lat= response.data.results[0].geometry.location.lat;
	var lng= response.data.results[0].geometry.location.lng;
	var weatherUrl = 'https://api.darksky.net/forecast/7ccd66aefdfde2cb09e8b8fdec36137a/' +lat +',' + lng;
	console.log('Address',response.data.results[0].formatted_address);
	return axios.get(weatherUrl);
})
.then((response) => {
	var temperature = Math.round(ftoc(response.data.currently.temperature)*100)/100;
	var	apparentTemperature = Math.round(ftoc(response.data.currently.apparentTemperature)*100)/100;
	console.log(`The temperature is ${temperature} celcius. But is feels like ${apparentTemperature} celcius`);
})
.catch((error) => {
	if(error.code === 'ENOTFOUND'){
		console.log("Unable to connect to server");
	}else{
		console.log(e.message);
	}
})