/**
 @module gavagai

 A helper library for Gavagai REST API.
 */

var RestClient = require('./RestClient');

//Shorthand to automatically create a RestClient
function gavagai(apikey, options) {
    return new RestClient(apikey, options);
}

gavagai.RestClient = RestClient;

module.exports = gavagai;
