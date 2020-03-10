<h1>BMW ConnectedDrive API Wrapper</h1>

This is a small node.js program that wraps the authentication mechanisms needed to access 
the BMW ConnectedDrive Portal servers and returns json data for each vehicle.
 
 It supports:
 * writejson.js - Writes data for all vehicles to json files, one file per vehicle
 * server.js - Is a small web server that returns json data for each vehicle identified by the VIN upon request

__Prerequisites__

* Install node.js

* Rename/copy config_example.json to config.json and enter your credentials:

    * *username* needs to be the Mail Address that you used when registering your BMW ConnectedDrive account
    * *password* Your password

__Writing JSON Files__

* Execute the following command:      
`node writejson.js`
    

The program writes json files in form result_VIN.json where _VIN_ is your Vehicle Identification Number
in the form WBAxxxxxxxV123456

__Starting the Web Server__

* Execute the following command:
`node server.js`

    
The server listens for incoming connections on port 8777 by default, feel free to edit if needed

Requests should be made in the following form:

`http://myserver:port/VIN`

* _VIN_ is your vehicle identification number in the form WBAxxxxxxxV123456

__Actions__

* You can now initiate commands by using the provided action_xxx json files

    * *action_climate.js* Turn on air condition. The car will climate according to your last settings
    * *action_doorlock.js* Lock all doors
    * *action_doorunlock.js* Unlock doors. *Use with caution!*
    * *action_flashheadlights.js* Flash your headlights
    * *action_soundhorn.js* Trigger your horn