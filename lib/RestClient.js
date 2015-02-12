/**
 @module RestClient
 */

//dependencies
var request = require('request'),
    moduleinfo = require('../package.json'),
    querystring = require('querystring');
    url = require('url');

// api defaults
var defaultHost = 'https://api.gavagai.se',
    defaultApiVersion = 'v3';

/**
 The Gavagai REST API client
 @constructor
 @param {string} apikey - The apikey obtained from Gavagai developer portal
 @param {object} options (optional) - optional config for the REST client
 - @member {string} host - host for the Gavagai REST API (default: api.gavagai.se)
 - @member {string} apiVersion - the Gavagai REST API version to use for requests (default: v3)
 */
function RestClient(apikey, options) {

    //Required client config
    if (!apikey) {
        if (process.env.GAVAGAI_APIKEY) {
            this.apikey = process.env.GAVAGAI_APIKEY;
        }
        else {
            throw new Error('RestClient requires an apikey set explicitly or via the GAVAGAI_APIKEY environment variable');
        }
    }
    else {
        this.apikey = apikey.trim();
    }

    //Optional client config
    options = options || {};
    this.host = options.host || defaultHost;
    this.apiVersion = options.apiVersion || defaultApiVersion;
    this.timeout = options.timeout || 31000; // request timeout in milliseconds
}

/**
 Get the base URL which we'll use for all requests with this client

 @returns {string} - the API base URL
 */
RestClient.prototype.getBaseUrl = function () {
    return this.host + '/' + this.apiVersion;
};

/**
 Given a set of texts, return summaries as a set of stories.

 @param {object|Array} texts -
 @param callback - callback function for when request is complete
 - @param {object} error - an error object if there was a problem processing the request
 - @param {object} data - the JSON-parsed data
 - @param {http.ClientResponse} response - the raw node http.ClientResponse object
*/
RestClient.prototype.stories = function (texts, callback) {
    var body = JSON.stringify({ documents: texts });

    var options = {
        method: 'POST',
        url: '/stories?language=en',
        body: body
    };

    this.request(options, callback);
};

/**
 Make an authenticated request against the Gavagai backend. Uses the request
 library, and largely passes through to its API for options:

 https://github.com/mikeal/request

 @param {object} options - options for HTTP request
 @param {function} callback - callback function for when request is complete
 - @param {object} error - an error object if there was a problem processing the request
 - @param {object} data - the JSON-parsed data
 - @param {http.ClientResponse} response - the raw node http.ClientResponse object
 */
RestClient.prototype.request = function (options, callback) {
    var client = this;

    // append apiKey
    var uri = url.parse(options.url, true);
    uri.query.apiKey = this.apikey;
    uri.search = querystring.stringify(uri.query);

    //Prepare request options
    options.url = client.getBaseUrl() + url.format(uri);
    options.headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'gavagai-node/' + moduleinfo.version
    };
    options.timeout = client.timeout;

    //Initiate HTTP request
    request(options, function (err, response, body) {
        var data;
        try {
            data = err || !body ? {status: 500, message: 'Empty body'} : JSON.parse(body);
        } catch (e) {
            data = {status: 500, message: (e.message || 'Invalid JSON body')};
        }

        //request doesn't think 4xx is an error - we want an error for any non-2xx status codes
        var error = null;
        if (err || (response && (response.statusCode < 200 || response.statusCode > 206))) {
            error = {};
            // response is null if server is unreachable
            if (response) {
                error.status = response.statusCode;
                error.message = data ? data.message : 'Unable to complete HTTP request';
                error.code = data && data.code;
                error.moreInfo = data && data.more_info;
            } else {
                error.status = err.code;
                error.message = 'Unable to reach host: ' + client.host;
            }
        }

        if (error) {
            callback(error, null, response);
        } else {
            callback(null, data, response);
        }
    });
};

module.exports = RestClient;
