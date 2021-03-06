/*
    This script starts a web server and waits for incoming http requests. Requests should have the form:
    http://myserver:port/VIN[?refresh]

    VIN is your vehicle identification number
        for example WBAXXXXXXXV123456

    ?refresh is an optional parameter.
        If set, fresh data is download from the BMW servers. If left out, a cached copy
        from stored JSON files is returned instead
 */

var http = require("http");
var url = require('url');
var fs = require('fs');

const g_serverListenPort = 8777;

var vehicle = require('./vehicle.js');

http.createServer(function (req, res)
{
    var requestUrl = url.parse(req.url);
    var path = requestUrl.pathname;
    var search = requestUrl.search;

    var vin = path.substring(1);

	vehicle.requestVehicles(function(_vin, _data)
    {
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.end(JSON.stringify(_data));
	}, function(_success)
	{
	}, function(err)
	{
		console.log("Error: " + err);
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end('Request Error: ' + err);
	});
}).listen(g_serverListenPort);
