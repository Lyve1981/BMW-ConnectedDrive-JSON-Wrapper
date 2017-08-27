/*
    Execute this script if you just want to dump fresh json files of your car without starting a webserver that can
    provide the data. If you want to start a webserver, look at server.js instead.
 */

vehicle = require('./vehicle.js');

vehicle.writeAllVehiclesData(function () {

}, function (err) {
    console.log("ERROR: " + err);
});
