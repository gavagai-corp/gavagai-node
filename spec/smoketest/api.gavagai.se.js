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
    this.timeout(10000);

    it('get stories summary using callbacks', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/stories.json');
            client.stories(texts, function (err, data) {
                assert(!err, 'no error');
                assert.property(data, 'stories');
                assert(data.stories.length > 0, 'stories length');
                assert.property(data.stories[0], 'texts');
                done();
            });
        }
    );

    it('get stories summary using promises', function (done) {
            var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/stories.json');
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
    });

    it('get topics summary using promises', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');

        client.topics(texts)
            .then(function (data) { assert.property(data, 'topics'); })
            .done(done);
    });

    it('get tonality analysis using callbacks', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/tonality.json');
        client.tonality(texts, function (err, data) {
            assert(!err, 'no error');
            assert.property(data, 'texts');
            assert(data.texts.length > 0, 'texts length');
            assert.property(data.texts[0], 'id');
            assert.property(data.texts[0], 'tonality');
            done();
        });
    });

    it('get tonality analysis using promises', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/tonality.json');
        client.tonality(texts)
            .then(function (data) { assert.property(data, 'texts'); })
            .done(done);
    });

    it('get keywords using callbacks', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/tonality.json');
        client.keywords(texts, function (err, data) {
            assert(!err, 'no error');
            assert.property(data, 'numberOfKeywords');
            assert.property(data, 'keywords');
            assert(data.keywords.length > 0, 'keywords length');
            assert.property(data.keywords[0], 'term');
            assert.property(data.keywords[0], 'occurrences');
            done();
        });
    });

    it('get keywords using promises', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/tonality.json');
        client.keywords(texts)
            .then(function (data) {
                assert.property(data, 'keywords');
                assert.isArray(data.keywords);
            }).done(done);
    });

    it('get tonality.fromTopics using callbacks', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');
        client.topics(texts, function (err, data) {
            assert(!err, 'no error in topics');
            client.tonality.fromTopics(data, function (err, data) {
                assert(!err, 'no error in fromTopics');
                assert.property(data, 'texts');
                assert(data.texts.length > 0, 'texts length');
                assert.property(data.texts[0], 'id');
                assert.property(data.texts[0], 'tonality');
                done();
            });
        });
    });

    it('get tonality.fromTopics using promises', function (done) {
        var texts = swaggerDefaultRequest('texts', 'https://developer.gavagai.se/swagger/spec/topics.json');
        client.topics(texts)
            .then(client.tonality.fromTopics)
            .then(function (data) { assert.property(data, 'texts'); })
            .done(done);
    });

    it('get english lexicon word info using callbacks', function (done) {
        client.lexicon('good', function (err, data) {
            assert(!err, 'no error');
            assert.property(data, 'wordInformation');
            done();
        });
    });

    it('get english lexicon ngram info using callbacks', function (done) {
        client.lexicon('pretty good', function (err, data) {
            assert(!err, 'no error');
            assert.property(data, 'wordInformation');
            done();
        });
    });

    it('get swedish lexicon word info using callbacks', function (done) {
        client.lexicon('bra', 'sv', function (err, data) {
            assert.property(data, 'wordInformation');
            done();
        });
    });

    it('get english lexicon word info using promises', function (done) {
        client.lexicon('good')
            .then(function (data) {assert.property(data, 'wordInformation');})
            .done(done);
    });

    it('get swedish lexicon word info using promises', function (done) {
        client.lexicon('bra', 'sv')
            .then(function (data) {assert.property(data, 'wordInformation');})
            .done(done);
    });

    it('forward error message from backend api', function (done) {
        var invalidPayload = {x: 4711};
        client.topics(invalidPayload, function (err, data) {
            assert(!data);
            assert(err);
            assert.property(err, 'message');
            assert.match(err.message, /^Unrecognized value of attribute/);
            done();
        });
    });

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
    assert.isArray(result, 'swagger default request property "' + propName + '"');
    assert(result.length > 0, 'swagger sample contains data')

    return result;
}

