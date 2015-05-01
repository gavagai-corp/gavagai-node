'use strict';

module.exports = function (client) {
    /**
     * Lookup a word in Gavagai living lexicon.
     *
     * @param {string} word - single word or sequence of words to be looked up.
     * @param {string} [language] - optional language code.
     * @param callback - callback function for when request is complete
     * - @param {object} error - an error object if there was a problem processing the request
     * - @param {object} data - the JSON-parsed data
     * @returns {*} - a promise.
     */
    return function (word, language, callback) {

        if (typeof(language) === 'function') {
            callback = language;
            language = 'en';
        }

        var params = {
            method: 'GET',
            url: '/lexicon/' + language + '/' + word
        };

        return client.request(params, callback);
    };

};

