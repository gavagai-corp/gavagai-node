'use strict';

module.exports = function (client) {
    var stories = {};

    /**
     Given a set of texts, return summaries as a set of stories.

     @param {object|Array} texts -
     @param {object} [options] - optional set of options, forwarded to Gavagai API.
     @param callback - callback function for when request is complete
     - @param {object} error - an error object if there was a problem processing the request
     - @param {object} data - the JSON-parsed data
     - @param {http.ClientResponse} response - the raw node http.ClientResponse object
     */
    return function (texts, options, callback) {

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        var body = options || {};
        body.language = options.language || 'en';
        body.documents = texts;

        var params = {
            method: 'POST',
            // TODO: remove detailed & language from url
            url: '/stories?detailed=true&language=' + body.language,
            body: JSON.stringify(body)
        };

        client.request(params, callback);
    };

};

