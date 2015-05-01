'use strict';

module.exports = function (client) {
    /**
     * Given a set of texts, return the top 10 keywords.
     *
     * @param {Array} documents - an array of documents or strings to be analyzed.
     * @param {object} [options] - optional set of options, forwarded to Gavagai API.
     * @param callback - callback function for when request is complete
     * - @param {object} error - an error object if there was a problem processing the request
     * - @param {object} data - the JSON-parsed data
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
            url: '/keywords',
            body: body
        };

        return client.request(params, callback);
    };

};

