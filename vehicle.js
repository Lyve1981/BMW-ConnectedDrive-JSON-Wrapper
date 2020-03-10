var fs = require('fs');

var tokenmanager = require('./tokenmanager.js');
var bmwrequest = require('./bmwrequest.js');

var g_api_host = 'www.bmw-connecteddrive.de';

function requestVehicle(_rootData, _vehicleDataCallback, _error)
{
    var carData = _rootData;
    var numRequestsPending = 0;

    var vin = _rootData.vin;

    function requestVehicleData(_type, _key)
    {
        var path = '/api/vehicle/' + _type + '/v1/' + vin;

        ++numRequestsPending;

        bmwrequest.call(g_api_host, path, '', function(data)
        {
            try
            {
                carData[_key] = JSON.parse(data);

                if(--numRequestsPending === 0)
                {
                    _vehicleDataCallback(vin, carData);
                }
            }
            catch (err)
            {
                _error("Parsing Error: " + err);
            }
        }, _error);
    }

    /*
    https://www.bmw-connecteddrive.de/api/vehicle/service/v1/vin
    https://www.bmw-connecteddrive.de/api/vehicle/dynamic/v1/vin?offset=-120
    https://www.bmw-connecteddrive.de/api/vehicle/specs/v1/vin
    https://www.bmw-connecteddrive.de/api/vehicle/navigation/v1/vin
    https://www.bmw-connecteddrive.de/api/vehicle/efficiency/v1/vin
    https://www.bmw-connecteddrive.de/api/vehicle/remoteservices/chargingprofile/v1/vin
    https://www.bmw-connecteddrive.de/api/vehicle/servicepartner/v1/vin
    */

    requestVehicleData('service', 'service', '');
//  requestVehicleData('specs', 'service', '');
    requestVehicleData('dynamic', 'dynamic', '?offset=-120');
    requestVehicleData('navigation', 'navigation', '');
    requestVehicleData('remoteservices/chargingprofile', 'chargingprofile', '');
//  requestVehicleData('servicepartner', 'servicepartner', '');
    requestVehicleData('efficiency', 'efficiency', '');
}

function requestVehicles (_vehicleDataCallback, _success, _error)
{
    bmwrequest.call(g_api_host, '/api/me/vehicles/v2', '', function(data)
    {
		try
		{
            var json = JSON.parse(data);

            var numVehicles = json.length;
            var numVehiclesPending = numVehicles;

            for(var v=0; v<numVehicles; ++v)
            {
                requestVehicle(json[v], function(_vin, _data)
                {
                    _vehicleDataCallback(_vin, _data);

                    if(--numVehiclesPending === 0)
                    {
                        _success();
                    }
                }, _error);
            }
		}
		catch(err)
		{
			_error("Failed to parse data " + data + ", error " + err);
		}
    }, _error);
}

exports.writeAllVehiclesData = function (_success, _error)
{
    tokenmanager.initialize(function()
        {
            console.log("Token init completed");

            requestVehicles(function(_vin, _data)
            {
                var data = JSON.stringify(_data, null, 4);

                var filename = 'result_' + _vin + '.json';

                fs.writeFile(filename, data, function()
                {
                    console.log("Result for VIN " + _vin + " written successfully to file " + filename);
                })
            }, _success, _error);
        }, _error
    );
};
