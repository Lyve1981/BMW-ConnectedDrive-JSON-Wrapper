var https = require("https");

exports.call = function(_host, _path, _postData, _callbackSuccess, _callbackError)
{
	var hasToken = typeof(global.token) === "string" && global.token.length > 0;

	var options =
	{
		hostname: _host,
		port: '443',
		path: _path,
		method: _postData != null ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': _postData != null ? Buffer.byteLength(_postData) : 0
        }
	};

	if(hasToken)
	{
        options.headers['Authorization'] = global.tokenType + " " + global.token;
    }

	console.log("Calling " + options.hostname + options.path);

	const req = https.request(options, function(res)
    {
		if(res.statusCode >= 400 && res.statusCode < 600)
			console.log("Request error for URL " + _path);
//		console.log('STATUS: ' + );
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
//			console.log('FOR PATH: ' + _path);
			_callbackSuccess(data, res.headers);
		});
	});

	req.on('error', function(e)
    {
	  console.error('request error: ' + e.message);
	  _callbackError(e);
	});

	if(_postData != null)
		req.write(_postData);
	req.end();
};
