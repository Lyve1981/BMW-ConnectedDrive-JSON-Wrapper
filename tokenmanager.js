var fs = require('fs');
var querystring = require('querystring');

var config = require('./config.json');
var bmwrequest = require('./bmwrequest.js');

const tokenFile = 'currenttoken.json';

function clearToken()
{
    global.tokenType = undefined;
    global.token = undefined;

    if( fs.existsSync(tokenFile) )
        fs.unlinkSync(tokenFile);
}

function requestToken(_success, _error)
{
    clearToken();

    // Credit goes to https://github.com/sergejmueller/battery.ebiene.de
    var postData = querystring.stringify({
        'username': config.username,
        'password': config.password,
        'client_id': 'dbf0a542-ebd1-4ff0-a9a7-55172fbfce35',
        'redirect_uri': 'https://www.bmw-connecteddrive.com/app/default/static/external-dispatch.html',
        'response_type': 'token',
        'scope': 'authenticate_user fupo',
        'state': 'eyJtYXJrZXQiOiJkZSIsImxhbmd1YWdlIjoiZGUiLCJkZXN0aW5hdGlvbiI6ImxhbmRpbmdQYWdlIn0',
        'locale': 'DE-de'
    });

    bmwrequest.call('customer.bmwgroup.com', '/gcdm/oauth/authenticate', postData, function(data, headers)
    {
        var location = headers.location;

        if(location === 'undefined')
        {
            _error("unexpected response, location header not defined");
            return;
        }

        var values = querystring.parse(location);

        var jsonstring = JSON.stringify(values, null, 4);

        readTokenData(jsonstring, _success, _error);
    }, _error);
}

function readTokenData(data, _success, _error)
{
    var json;

    try
    {
        json = JSON.parse(data);
    }
    catch (err)
    {
        _error(err);
        return;
    }

    if(typeof(json.error) !== 'undefined' )
    {
        _error(json.error + ": " + json.error_description);
        return;
    }

    if(typeof(json.token_type) === 'undefined' || typeof(json.access_token) === 'undefined')
    {
        _error("Couldn't find token in response");
        return;
    }

    global.tokenType = json.token_type;
    global.token = json.access_token;

    // CDP server seems to be picky, so be save and let the token expire two minutes earlier
    var tokenExpiresInSeconds = json.expires_in - 120;

    var expireDate;

    var tokenFileExists = fs.existsSync(tokenFile);

    var now = new Date();

    if(tokenFileExists) {
        var stat = fs.statSync(tokenFile);

        expireDate = new Date(stat.mtime);
    }
    else
    {
        expireDate = now;
    }

    var expireTimestamp = expireDate.valueOf() + tokenExpiresInSeconds * 1000;

    var nowTimestamp = now.valueOf();

    var expired = nowTimestamp > expireTimestamp;

    if(expired)
    {
        console.log("Token expired, requesting a new one");
        requestToken(_success, _error);
    }
    else
    {
        if(!tokenFileExists)
        {
            fs.writeFile(tokenFile, data, function()
                {
                    console.log("New token file has been written to file " + tokenFile);
                }
            );
        }
        _success();
    }
}

exports.initialize = function(_success, _error)
{
    fs.readFile(tokenFile, 'utf8', function(err, data)
    {
        if(err)
        {
            console.log("Failed to read file: " + err);

            requestToken(_success, _error);
        }
        else
        {
            readTokenData(data, _success, function (err)
            {
                console.log("Failed to use existing token from file, error " + err + ", will request a new one");
                requestToken(_success, _error);
            });
        }
    })
};
