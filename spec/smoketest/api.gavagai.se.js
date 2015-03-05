'use strict';

var request = require('sync-request'),
    assert = require('chai').assert,
    gavagai = require('../../lib');

var client;

if (process.env.GAVAGAI_APIKEY) {
    client = gavagai(process.env.GAVAGAI_APIKEY);
} else {
    throw new Error('Can\'t runt smoke tests without GAVAGAI_APIKEY environment variable set');
}

describe('Smoke tests for api.gavagai.se', function () {
    this.timeout(4000);

    it('get stories summary using callbacks', function (done) {
            var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/stories.json');

            client.stories(texts, function (err, data) {
                assert(!err, 'no error');
                assert.property(data, 'stories');
                assert(data.stories.length > 0, 'stories length');
                assert.property(data.stories[0], 'keywords');
                assert.property(data.stories[0], 'documents');
                done();
            });
        }
    );

    it('get stories summary using promises', function (done) {
            var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/stories.json');

            client.stories(texts)
                .then(function (data) { assert.property(data, 'stories'); })
                .done(done);
        }
    );
    it('get topics summary using callbacks', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

            client.topics(texts, function (err, data) {
                assert(!err, 'no error');
                assert.property(data, 'topics');
                assert(data.topics.length > 0, 'topics length');
                assert.property(data.topics[0], 'keywords');
                assert.property(data.topics[0], 'texts');
                done();
            });
        }
    );
    it('get topics summary using promises', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

            client.topics(texts)
                .then(function (data) { assert.property(data, 'topics'); })
                .done(done);
        }
    );

    it('get tonality analysis using callbacks', function (done) {
            var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/tonality.json');

            client.tonality(texts, function (err, data) {
                assert(!err, 'no error');
                assert.property(data, 'documents');
                assert(data.documents.length > 0, 'documents length');
                assert.property(data.documents[0], 'id');
                assert.property(data.documents[0], 'tonality');
                done();
            });
        }
    );

    it('get tonality analysis using promises', function (done) {
            var texts = swaggerDefaultRequest('documents', 'https://developer.gavagai.se/swagger/spec/tonality.json');

            client.tonality(texts)
                .then(function (data) { assert.property(data, 'documents'); })
                .done(done);
        }
    );

    it('get tonality.fromTopics using callbacks', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

            client.topics(texts, function (err, data) {
                assert(!err, 'no error in topics');
                client.tonality.fromTopics(data, function (err, data) {
                    assert(!err, 'no error in fromTopics');
                    assert.property(data, 'documents');
                    assert(data.documents.length > 0, 'documents length');
                    assert.property(data.documents[0], 'id');
                    assert.property(data.documents[0], 'tonality');
                    done();
                });
            });
        }
    );

    it('get tonality.fromTopics using promises', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

            client.topics(texts)
                .then(client.tonality.fromTopics)
                .then(function (data) { assert.property(data, 'documents'); })
                .done(done);
        }
    );

    before(function () {
        if (!client) {
            console.warn("  -> Warning: Integration tests need a GAVAGAI_APIKEY environment variable to be set.")
        }
    });
});


// Utils

/**
 * Get default request body from swagger docs at developer.gavagai.se
 */
function swaggerDefaultRequest(propName, url) {
    var res = request('GET', url);
    assert.equal(res.statusCode, 200);

    var swaggerSpec = JSON.parse(res.getBody('utf8'));
    var defaultBody = swaggerSpec
        .apis[0]
        .operations[0]
        .parameters.filter(function (element) { return element.paramType === 'body'; })[0]
        .defaultValue;

    var result = JSON.parse(defaultBody)[propName];

    // validate basic assertions
    assert.isArray(result);
    assert(result.length > 0, 'swagger sample contains data')

    return result;
}

