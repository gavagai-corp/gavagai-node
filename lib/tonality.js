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
    var tonality = function (texts, options, callback) {

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

        options = options || {};
        options.language = options.language || 'en';

        var body = {};
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                body[key] = options[key]
            }
        }
        body.documents = documents;

        var params = {
            method: 'POST',
            url: '/tonality?language=' + body.language,
            body: body
        };

        return client.request(params, callback);
    };

    tonality.fromTopics = function (topics, options, callback) {
        var texts;

        texts = topics.topics.map(function (topic, i) {
            return topic.texts
                .map(function (t) {
                    return t.utterances.join(' ');
                })
                .join(' ');
        });

        return tonality(texts, options, callback);
    };

    return tonality;
};

function document(text, i) {
    if (typeof(text) !== 'string') {
        return text;
    } else {
        var id = i && i.toString() || 0;
        return {body: text, id: id}
    }
}


