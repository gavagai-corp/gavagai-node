'use strict';

function Stories(client) {
    this.client = client;
}

/**
 Given a set of texts, return summaries as a set of stories.

 @param {object|Array} texts -
 @param callback - callback function for when request is complete
 - @param {object} error - an error object if there was a problem processing the request
 - @param {object} data - the JSON-parsed data
 - @param {http.ClientResponse} response - the raw node http.ClientResponse object
 */
Stories.prototype.find = function (texts, callback) {
    var body = JSON.stringify({ documents: texts });

    var options = {
        method: 'POST',
        url: '/stories?language=en',
        body: body
    };

    this.client.request(options, callback);
};

module.exports = Stories;