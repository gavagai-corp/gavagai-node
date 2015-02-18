'use strict';

module.exports = function (client) {
    /**
     Given a set of documents, return their tonality based on lexical analysis in multiple dimensions.
     The tonality is calculated on a document level, that is, the response will return the tonality of
     each document.

     @param {Array|string} texts - an array of document objects or strings to be analyzed.
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

        var documents;
        if (Array.isArray(texts)) {
            documents = texts.map(function (text, i) {
                return document(text, i);
            });
        } else if (typeof(texts) === 'string') {
            documents = [document(texts)];
        } else {
            documents = texts;
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

function document(text, i) {
    if (typeof(text) !== 'string') {
        return text;
    } else {
        var id = i && i.toString() || 0;
        return {body: text, id: id}
    }
}

