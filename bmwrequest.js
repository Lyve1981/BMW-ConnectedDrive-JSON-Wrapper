var https = require("https");

exports.call = function(_host, _path, _postData, _callbackSuccess, _callbackError)
{
	var hasToken = typeof(global.token) === "string" && global.token.length > 0;

	var options =
	{
		hostname: _host,
		port: '443',
		path: _path,
		method: hasToken ? 'GET' : 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(_postData)
        }
	};

	if(hasToken)
	{
        options.headers['Authorization'] = global.tokenType + " " + global.token;
    }

	console.log("Calling " + options.hostname + options.path);

	const req = https.request(options, function(res)
    {
//		console.log('STATUS: ' + res.statusCode);
//		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		
		var data = "";
		
		res.on('data', function(chunk)
        {
			data += chunk;
		});

		res.on('end', function()
        {
//			console.log('BODY: ' + data);
			_callbackSuccess(data, res.headers);
		});
	});

	req.on('error', function(e)
    {
	  console.error('request error: ' + e.message);
	  _callbackError(e);
	});

	req.write(_postData);
	req.end();
};
