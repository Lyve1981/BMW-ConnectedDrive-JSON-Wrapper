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

var vehicle = require('./vehicle.js');

http.createServer(function (req, res)
{
    var requestUrl = url.parse(req.url);
    var path = requestUrl.pathname;
    var search = requestUrl.search;

    var vin = path.substring(1);

    if(search === '?refresh')
    {
        console.log("Requesting new data from BMW ConnectedDrive API server");

        vehicle.writeAllVehiclesData(function() {}, function(err)
        {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Request Error: ' + err);
        });
    }
    else
    {
        console.log("Returning cached version of data for VIN " + vin);
    }

    fs.readFile('result_' + vin + '.json', 'utf8', function(_err, _data)
    {
        if(_err)
        {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("Failed to open file " + vin + ": " + _err);
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(_data);
        }
    })

}).listen(8777);
