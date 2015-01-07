/**
 @module gavagai

 A helper library for interaction with the Gavagai REST API.
 */

var RestClient = require('./RestClient');

//Shorthand to automatically create a RestClient
function initializer(apikey) {
    return new RestClient(apikey);
}

initializer.RestClient = RestClient;

module.exports = initializer;
