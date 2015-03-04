'use strict';

module.exports = function (client) {
    /**
     * Given a set of texts, return summaries as a set of topics.
     *
     * @param {Array} texts - an array of text objects or strings to be analyzed.
     * @param {object} [options] - optional set of options, forwarded to Gavagai API.
     * @param callback - callback function for when request is complete
     * - @param {object} error - an error object if there was a problem processing the request
     * - @param {object} data - the JSON-parsed data
     * - @param {http.ClientResponse} response - the raw node http.ClientResponse object
     * @returns {*} - a promise.
     */
    return function (texts, options, callback) {

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        if (Array.isArray(texts)) {
            texts = texts.map(function (text, i) {
                return typeof(text) !== 'string' ? text : {body: text, id: i.toString()};
            });
        }

        options = options || {};
        options.language = options.language || 'en';

        var body = {};
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                body[key] = options[key]
            }
        }
        body.texts = texts;

        var params = {
            method: 'POST',
            url: '/topics',
            body: body
        };

        return client.request(params, callback);
    };

};

