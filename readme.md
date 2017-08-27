<h1>BMW ConnectedDrive API Wrapper</h1>

This is a small node.js program that wraps the authentication mechanisms needed to access the BMW ConnectedDrive Portal servers.
 
 It supports:
 * writejson.js - Writes data for all vehicles to json files, one per vehicle
 * server.js - Is a small web server that returns json data for each vehicle identified by the VIN
 
__Prerequisites__

* Install node.js

* Edit the file config.json and enter your credentials:

    * *username* needs to be the Mail Address that you used when registering your BMW ConnectedDrive account
    * *password* Your password

__Writing JSON Files__

* Execute the following command:

    
    node writejson.js
    
The program writes json files in form result_VIN.json where _VIN_ is your Vehicle Identification Number
in the form WBAxxxxxxxV123456

__Starting the Web Server__

* Execute the following command:


    node server.js

The server listens for incoming connections on port 8777 by default, feel free to edit if needed

Requests should be made in the following form:

    http://myserver:port/VIN[?refresh]

* _VIN_ is your vehicle identification number in the form WBAxxxxxxxV123456

* _?refresh_ is an optional parameter. If set, fresh data is download from the BMW servers. If left out, 
a cached copy from stored JSON files is returned instead
