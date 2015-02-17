'use strict';

module.exports = function (client) {
    /**
     Given a set of documents, return their tonality based on lexical analysis in multiple dimensions.
     The tonality is calculated on a document level, that is, the response will return the tonality of
     each document.

     @param {object|Array} texts -
     @param {object} [options] - optional set of options, forwarded to Gavagai API.
     @param callback - callback function for when request is complete
     - @param {object} error - an error object if there was a problem processing the request
     - @param {object} data - the JSON-parsed data
     - @param {http.ClientResponse} response - the raw node http.ClientResponse object
     */
    return function (documents, options, callback) {

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        if (Array.isArray(documents)) {
            documents = documents.map(function (text, i) {
                return typeof(text) !== 'string' ? text : {body: text, id: i.toString()};
            });
        }

        var body = options || {};
        body.language = options.language || 'en';
        body.documents = documents;

        var params = {
            method: 'POST',
            url: '/tonality',
            body: body
        };

        client.request(params, callback);
    };

};
