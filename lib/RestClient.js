'use strict';

//dependencies
var request = require('request'),
    Q = require('q'),
    querystring = require('querystring'),
    url = require('url'),
    moduleinfo = require('../package.json');

// api defaults
var defaultHost = 'https://api.gavagai.se',
    defaultApiVersion = 'v3',
    defaultTimeOut = 60000;

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
    this.timeout = options.timeout || defaultTimeOut;

    // Resources
    this.stories = require('./stories')(this);
    this.tonality = require('./tonality')(this);
    this.topics = require('./topics')(this);
}

/**
 Get the base URL which we'll use for all requests with this client

 @returns {string} - the API base URL
 */
RestClient.prototype.getBaseUrl = function () {
    return this.host + '/' + this.apiVersion;
};

/**
 Make an authenticated request against the Gavagai backend. Uses the request
 library, and largely passes through to its API for options:

 https://github.com/mikeal/request

 @param {object} options - options for HTTP request
 @param {function} callback - 'nodeback' function for when request is complete
 - @param {object} error - an error object if there was a problem processing the request
 - @param {object} data - the JSON-parsed data
 */
RestClient.prototype.request = function (options, callback) {
    var client = this,
        deferred = Q.defer();

    // append apiKey
    var uri = url.parse(options.url, true);
    uri.query.apiKey = this.apikey;
    uri.search = querystring.stringify(uri.query);

    //Prepare request options
    options.json = true;
    options.url = client.getBaseUrl() + url.format(uri);
    options.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json;charset=utf-8',
        'User-Agent': 'gavagai-node/' + moduleinfo.version
    };
    options.timeout = client.timeout;

    // do HTTP request
    request(options, function (err, response, data) {
        var error = null;

        if (err || (response && (response.statusCode < 200 || response.statusCode > 206))) {
            error = {};
            if (response) {
                error.status = response.statusCode;
                error.message = data ? (data.message || data) : 'Unable to complete HTTP request';
            } else {
                error.status = err.code;
                error.message = 'Unable to reach host: ' + client.host;
            }
        }

        data = data || {};
        setClientResponse(data, response);

        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(data);
        }
    });

    // Support both Node continuation-passing-style and promise-returning-style.
    return deferred.promise.nodeify(callback);
};

function setClientResponse(obj, response) {
    if (obj instanceof Object) {
        Object.defineProperty(obj, 'apiClientResponse', {
            value: response,
            configurable: true,
            writeable: true,
            enumerable: false  // set as 'not enumerable' to allow for stringify.
        });
    }
}

module.exports = RestClient;
