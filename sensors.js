// Load Grove module
var groveSensor = require('jsupm_grove');
var upmTP401 = require('jsupm_gas');
var dgram = require('dgram');

var light = new groveSensor.GroveLight(0);
var airSensor = new upmTP401.TP401(1);
var temperature = new groveSensor.GroveTemp(2);

var PORT = 41234;
var HOST = '127.0.0.1';

var sendObservation = function(data, cb) {
	var message = new Buffer(JSON.stringify(data));
	var client = dgram.createSocket('udp4');
	client.send(message, 0, message.length, PORT, HOST, function(err, response) {
		cb && cb(err, response);
		client.close();
	});
}

var data = {"n": "light", "t": "light.v1.0"};
sendObservation(data, function(err, response){
	if (err) throw err;
});
var data = {"n": "airquality", "t": "airquality.v1.0"};
sendObservation(data, function(err, response){
	if (err) throw err;
});
var data = {"n": "ppm1", "t": "ppm.v1.0"};
sendObservation(data, function(err, response){
	if (err) throw err;
});
var data = {"n": "temperature", "t": "temperature.v1.0"};
sendObservation(data, function(err, response){
	if (err) throw err;
});

function readLightSensorValue() {
	var data = {"n": "light", "v": light.value()};
	sendObservation(data, function(err, response){
		if (err) throw err;
	});
}
setInterval(readLightSensorValue, 60000);

function readAirQuality() {
    var airquality = airSensor.getSample();
    var ppm = airSensor.getPPM();

	var data = {"n": "airquality", "v": airquality};
	sendObservation(data, function(err, response){
		if (err) throw err;
	});
	var data = {"n": "ppm1", "v": ppm.toFixed(2)};
	sendObservation(data, function(err, response){
		if (err) throw err;
	});
}
setInterval(readAirQuality, 60000);

function readTemperature() {
	var data = {"n": "temperature", "v": temperature.value()};
	sendObservation(data, function(err, response){
		if (err) throw err;
	});
}
setInterval(readTemperature, 60000);
