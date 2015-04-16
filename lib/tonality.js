'use strict';

var Q = require('q');

module.exports = function (client) {
    /**
     * Given a set of documents, return their tonality based on lexical analysis in multiple dimensions.
     * The tonality is calculated on a document level, that is, the response will return the tonality of
     * each document.
     *
     * @param {Array|string} texts - an array of document objects or strings to be analyzed.
     * @param {object} [options] - optional set of options, forwarded to Gavagai API.
     * @param callback - callback function for when request is complete
     * - @param {object} error - an error object if there was a problem processing the request
     * - @param {object} data - the JSON-parsed data
     * - @param {http.ClientResponse} response - the raw node http.ClientResponse object
     * @returns {*} - a promise.
     */
    var tonality = function (texts, options, callback) {

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        if (Array.isArray(texts)) {
            texts = texts.map(function (text, i) {
                return textObj(text, i);
            });
        } else if (typeof(texts) === 'string') {
            texts = [textObj(texts)];
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
            url: '/tonality',
            body: body
        };

        return client.request(params, callback);
    };

    /**
     * Given the output from topics resource, return tonality for each topic. Index of texts returned
     * corresponds to the topic with the same index.
     *
     * @param topics - topics output.
     * @param options -
     * @param callback -
     * @returns {*} - a promise.
     */
    tonality.fromTopics = function (topics, options, callback) {
        var texts;

        if (typeof(options) === 'function') {
            callback = options;
            options = {};
        }

        options = options || {};

        try {
            texts = topics.topics.map(function (topic) {
                return allUtterancesJoined(topic);
            });

            if(!options.language && topics.language) {
                options.language = topics.language;
            }

            return tonality(texts, options, callback);
        }
        catch (e) {
            callback && callback({
                status: 500,
                message: e.message,
                error: e
            });
            return Q.fcall(function () {throw e;});
        }
    };

    return tonality;
};

function allUtterancesJoined(topic) {
    return topic.texts.map(function (text) {
        return text.utterances.join(' ');
    }).join(' ');
}

function textObj(text, i) {
    if (typeof(text) !== 'string') {
        return text;
    } else {
        var id = i && i.toString() || 0;
        return {body: text, id: id}
    }
}


