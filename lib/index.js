/**
 @module gavagai

 A helper library for Gavagai REST API.
 */

var RestClient = require('./RestClient');

//Shorthand to automatically create a RestClient
function gavagai(apikey) {
    return new RestClient(apikey);
}

gavagai.RestClient = RestClient;

module.exports = gavagai;
